import Faturamento from "../models/faturamento.js";
import AnexoFaturamento from '../models/anexosFaturamento.js';
import { readFile, readFileSync } from 'node:fs'
import * as path from 'node:path';
import { s3 } from '../utils/s3.js';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
//import { url } from 'node:inspector';
import z from 'zod';

const faturamentoSchema = z.object({
    idCliente: z.string().min(1, "Selecione ao menos um cliente"),
    idProposta: z.string().min(1, "Selecione ao menos uma proposta"),
    idMedicao: z.string().min(1, "Selecione a Medição"),
    valor: z.string().min(1, "Deina um valor"),
    vencimento: z.string().min(1, "Defina a data para o vencimento"),
    tipo: z.string().min(1, "Selecione o tipo"),
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



        const faturamento = await Faturamento.create({
            idCliente: verificacaoValidada.idCliente,
            idProposta: verificacaoValidada.idProposta,
            idMedicao: verificacaoValidada.idMedicao,
            valor: verificacaoValidada.valor * 100,
            vencimento: verificacaoValidada.vencimento,
            tipo: verificacaoValidada.tipo
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
            idMedicao: faturamento.id,
            path: s3Key // salva o caminho direto do s3
        });

        res.status(200).json({
            idCliente: parseInt(faturamento.idCliente),
            idProposta: parseInt(faturamento.idProposta),
            idMedicao: parseInt(faturamento.idMedicao),
            valor: faturamento.valo,
            vencimento: faturamento.vencimento,
            tipo: faturamento.tipo
        })

    } catch (error) {
        console.log('error', error)
        res.status(500).json({ message: "Erro ao criar contrato", error });
    }
}

export default { createFaturamento }