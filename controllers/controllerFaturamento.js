import Faturamento from "../models/faturamento.js";
import AnexoFaturamento from '../models/anexosFaturamento.js';
import Medicao from '../models/medicoes.js'
import { readFile, readFileSync } from 'node:fs'
import * as path from 'node:path';
import { s3 } from '../utils/s3.js';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
//import { url } from 'node:inspector';
import z from 'zod';
import dayjs from "dayjs";
import { Op } from "sequelize";

const faturamentoSchema = z.object({
  idCliente: z.string().min(1, "Selecione ao menos um cliente"),
  idProposta: z.string().min(1, "Selecione ao menos uma proposta"),
  idMedicao: z.string().min(1, "Selecione a Medição"),
  valor: z.string().min(1, "Deina um valor"),
  vencimento: z.string().min(1, "Defina a data para o vencimento"),
  tipo: z.string().min(1, "Selecione o tipo"),
  numeroDaNota: z.string().min(1, "Precisa conter uma numeração"),
  anexo: z.object({
    fieldname: z.string(),
    originalname: z.string(),
    encoding: z.string(),
    mimetype: z.string(),
    destination: z.string(),
    filename: z.string(),
    path: z.string(),
    size: z.number()
  })
});

async function createFaturamento(req, res) {

  const anexo = req.file;
  console.log("req.file ", anexo)
  const dadosRecebidos = {
    ...req.body,
    anexo: anexo
  };

  console.log("dadosRecebidos ", dadosRecebidos)

  const verificacao = await faturamentoSchema.safeParseAsync(dadosRecebidos)
  console.log("resposta: ", verificacao)
  if (!verificacao.success) return res.status(400).json();


  const verificacaoValidada = verificacao.data;

  try {
    console.log("REQ.BODY", req.body)

    console.log("VERIFICAÇÃO VALIDADA ",verificacaoValidada)

    const faturamento = await Faturamento.create({
      idCliente: verificacaoValidada.idCliente,
      idProposta: verificacaoValidada.idProposta,
      idMedicao: verificacaoValidada.idMedicao,
      valor: verificacaoValidada.valor * 100,
      vencimento: verificacaoValidada.vencimento,
      tipo: verificacaoValidada.tipo,
      numeroDaNota: verificacaoValidada.numeroDaNota,
      pagamento: "ABERTO"
    })

    const file = req.file;

    // Caminho do arquivo
    const filePath = path.join(import.meta.dirname, '..', 'temp', file.filename);
    console.log('filePath', filePath);

    // Ler o arquivo
    const fileContent = readFileSync(filePath);

    // Extrair extensão do arquivo
    const extensaoDoArquivo = file.originalname.split('.').reverse()[0];

    // Upload para S3 - cada arquivo com nome único
    const s3Key = `/${faturamento.idMedicao}/${faturamento.id}.${extensaoDoArquivo}`;
    const command = new PutObjectCommand({
      Bucket: 'anexo-faturamento',
      Key: s3Key,
      Body: fileContent
    });

    await s3.send(command);

    // Salvar referência no banco para cada arquivo
    await AnexoFaturamento.create({
      idFaturamento: faturamento.id,
      path: s3Key // salva o caminho direto do s3
    });

    const [rowsUpdate] = await Medicao.update(
      { faturado: 'FATURADO' },
      { where: { id: verificacaoValidada.idMedicao } }
    )

    console.log(rowsUpdate)
    if (rowsUpdate === 0) {
      return res.status(400).json({ message: 'Não foi possível atualizar' })
    }
    res.status(200).json({
      idCliente: parseInt(faturamento.idCliente),
      idProposta: parseInt(faturamento.idProposta),
      idMedicao: parseInt(faturamento.idMedicao),
      numeroDaNota: faturamento.numeroDaNota,
      valor: faturamento.valor,
      vencimento: faturamento.vencimento,
      tipo: faturamento.tipo
    })

  } catch (error) {
    console.log('error', error)
    res.status(500).json({ message: "Erro ao criar contrato", error });
  }
}

async function getFaturamento(req, res) {
  try {
    const todosOsFaturamentos = await Faturamento.findAll({ include: ['clienteFaturamento', 'medicaoFaturamento', 'propostaFaturamento'] })
    if (!todosOsFaturamentos) {
      res.status(400).json({ message: "Não foi possível encontrar" })
    }

    res.status(200).json(todosOsFaturamentos)
  } catch {
    res.status(500).json({ message: "Erro Interno" })
  }
}

async function getFaturamentoId(req, res) {
  try {
    const { id } = req.params;
    const todosOsFaturamentos = await Faturamento.findByPk(id, { include: ['clienteFaturamento', 'medicaoFaturamento', 'propostaFaturamento'] })
    if (!todosOsFaturamentos) {
      res.status(404).json({ message: "Não foi possível encontrar" })
    }

    res.status(200).json(todosOsFaturamentos)

  } catch {
    res.status(500).json({ message: "Erro no Servidor" })
  }
}

const validacaoSchemaUpdateFaturamento = z.object({
  pagamento: z.enum(["PAGA", "CANCELADA"]),
});

async function updateFaturamento(req, res) {
  try {
    const verificar = await validacaoSchemaUpdateFaturamento.safeParseAsync(req.body);

    if (!verificar.success) {
      return res.status(400).json(verificar.error);
    }

    const { id } = req.params;
    const todosOsFaturamentos = await Faturamento.update(
      verificar.data,
      { where: { id } }
    );

    if (!todosOsFaturamentos || todosOsFaturamentos[0] === 0) {
      return res.status(404).json({ message: "Não foi possível encontrar" });
    }

    return res.status(200).json({ message: "Faturamento atualizado com sucesso" });

  } catch (error) {
    console.error("Erro no updateFaturamento:", error);
    return res.status(500).json({ message: "Erro no Servidor" });
  }
}


async function getFaturamentoCard(req, res) {
  try {
    const agora = new Date();
    const mesAtual = agora.getMonth(); // 0–11
    const anoAtual = agora.getFullYear();

    const mesAnterior = mesAtual === 0 ? 11 : mesAtual - 1;
    const anoAnterior = mesAtual === 0 ? anoAtual - 1 : anoAtual;

    // Faturamentos pagos
    const faturamentosPagos = await Faturamento.findAll({
      where: {
        pagamento: "PAGA",
      },
    });

    const totalAtual = faturamentosPagos
      .filter(f => {
        const data = new Date(f.createdAt);
        return data.getMonth() === mesAtual && data.getFullYear() === anoAtual;
      })
      .reduce((acc, f) => acc + f.valor, 0);
    console.log("Faturamentos pagos:", faturamentosPagos.map(f => ({
      pagamento: f.pagamento,
      createdAt: f.createdAt,
      valor: f.valor
    })));


    const totalAnterior = faturamentosPagos
      .filter(f => {
        const data = new Date(f.createdAt);
        return data.getMonth() === mesAnterior && data.getFullYear() === anoAnterior;
      })
      .reduce((acc, f) => acc + f.valor, 0);

    const variacao = totalAnterior === 0
      ? null
      : ((totalAtual - totalAnterior) / totalAnterior) * 100;

    return res.json({
      mesAtual: `${mesAtual + 1}/${anoAtual}`,
      totalAtual,
      mesAnterior: `${mesAnterior + 1}/${anoAnterior}`,
      totalAnterior,
      variacaoPercentual: variacao !== null ? variacao.toFixed(2) + "%" : "N/A",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao calcular faturamento mensal." });
  }

}
export default { createFaturamento, getFaturamento, getFaturamentoId, getFaturamentoCard, updateFaturamento }
