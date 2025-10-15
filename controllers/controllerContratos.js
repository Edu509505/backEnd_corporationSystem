import { readFile, readFileSync } from 'node:fs'
import * as path from 'node:path';
import { s3 } from '../utils/s3.js';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import Contratos from "../models/contratos.js";
import z from "zod";
import AnexoContratos from '../models/anexoContratos.js'

const validacaoSchema = z.object({
    idCliente: z.coerce.string(),
    idProposta: z.coerce.string(),
    titulo: z.string(),
    anexo: z.array(z.object({
        fieldname: z.string(),
        originalname: z.string(),
        encoding: z.string(),
        mimetype: z.string(),
        destination: z.string(),
        filename: z.string(),
        path: z.string(),
        size: z.number()
    }))
});
async function createContrato(req, res) {

    const anexo = req.files;
    console.log("req.files ", anexo)
    const dadosRecebidos = {
        ...req.body,
        anexo: anexo
    };

    console.log("dadosRecebidos ", dadosRecebidos)

    const resposta = await validacaoSchema.safeParseAsync(dadosRecebidos);
    console.log("resposta: ", resposta)
    if (!resposta.success) {
        return res.status(400).json(resposta.error);
    }

    const contratoValidada = resposta.data;

    try {
        const contrato = await Contratos.create({
            idCliente: parseInt(contratoValidada.idCliente),
            idProposta: parseInt(contratoValidada.idProposta),
            titulo: contratoValidada.titulo,
            status: 'ATIVO',
            // local: contratoValidada.local
        });

        console.log(contrato)

        // Processar múltiplos arquivos
        if (req.files && req.files.length > 0) {
            // Iterar sobre cada arquivo enviado
            for (let i = 0; i < req.files.length; i++) {
                const file = req.files[i];

                // Caminho do arquivo
                const filePath = path.join(import.meta.dirname, '..', 'temp', file.filename);
                console.log('filePath', filePath);

                // Ler o arquivo
                const fileContent = readFileSync(filePath);

                // Extrair extensão do arquivo
                const extensaoDoArquivo = file.originalname.split('.').reverse()[0];

                // Upload para S3 - cada arquivo com nome único
                const s3Key = `/${contrato.idCliente}/${contrato.id}.${extensaoDoArquivo}`;
                const command = new PutObjectCommand({
                    Bucket: 'anexo-contratos',
                    Key: s3Key,
                    Body: fileContent
                });

                await s3.send(command);

                // Salvar referência no banco para cada arquivo
                await AnexoContratos.create({
                    idContrato: contrato.id,

                    path: s3Key // salva o caminho direto do s3
                });
            }
        }
        res.status(200).json({
            idCliente: parseInt(contrato.idCliente),
            idProposta: parseInt(contrato.idProposta),
            titulo: contrato.titulo,
            status: contrato.status,
            //local: contrato.local
        });
    } catch (error) {
        console.log('error', error)
        res.status(500).json({ message: "Erro ao criar contrato", error });
    }
}

async function getContratos(req, res) {
    const contratos = await Contratos.findAll({ include: ['clientesContratos', 'proposta'] });

    console.log(contratos)

    if (contratos) {
        res.json(contratos.map(contratos => contratos.toJSON()))
    } else {
        res.status(500).json({ message: 'Não foi possível buscar' })
    }
}

async function getContratoId(req, res) {
    const { id } = req.params;

    try {
        const contratoId = await Contratos.findOne({ where: id })

        if (contratoId) {
            res.json(contratoId.toJSON())
        } else {
            res.status(404).json({ message: 'Contrato inexistente' })
        }

    } catch (error) {
        res.status(500).json({ message: "Erro ao encotrar", error })
    }
}


export default { createContrato, getContratos, getContratoId }