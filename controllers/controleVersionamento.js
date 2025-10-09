import { readFile, readFileSync } from 'node:fs'
import * as path from 'node:path';
import { s3 } from '../utils/s3.js';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import Versionamento from "../models/versionamento.js";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
//import { url } from 'node:inspector';
import AnexoVersionamento from '../models/anexoVersionamento.js'


async function createVersionamento(req, res) {
    const { idProposta } = req.params

    const contarVersao = await Versionamento.count({
        where: {
            idProposta
        }
    })

    console.log('contarVersao', contarVersao)

    const novaVersao = contarVersao + 1;

    const versionamento = await Versionamento.create({ versao: novaVersao, idProposta, status: 'EM_ANALISE' })

    //UPANDO ARQUIVO
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
            const s3Key = `/${versionamento.idProposta}/${versionamento.id}.${extensaoDoArquivo}`;
            const command = new PutObjectCommand({
                Bucket: 'anexo-versionamento',
                Key: s3Key,
                Body: fileContent
            });

            await s3.send(command);

            // Salvar referência no banco para cada arquivo
            await AnexoVersionamento.create({
                idVersionamento: versionamento.id,
                path: s3Key // salva o caminho direto do s3
            });
        }
    }

    if (versionamento) {
        console.log('estou aqui')
        res.status(200).json({ versao: versionamento.versao, idProposta, status: versionamento.status })
    } else {
        res.status(500).json({ message: 'Não foi possivel criar' })
    }
}

async function getVersionamento(req, res) {
    const { id } = req.params

    const versionamento = await Versionamento.findByPk(id);

    if (versionamento) {
        res.status(200).json(versionamento.toJSON);
    } else {
        res.status(500).json({ message: 'Não foi possível buscar este versionamento' });
    }

}

async function getVersionamentos(req, res) {
    const versionamentos = await Versionamento.findAll()

    if (versionamentos) {
        res.json(versionamentos.map(versionamento => versionamento.toJSON()))
    } else {
        res.status(500).json({ message: 'Não foi possível buscar usuários' })
    }
}
    
async function getPropostaVersionamentos(req, res) {
    const { idProposta } = req.params
    const propostaVersionamentos = await Versionamento.findAll({
        where: {
            idProposta
        }
    });

    if (!propostaVersionamentos) {
        res.status(500).
            json({
                message: 'Não foi possivel buscar pelos versionamentos desta proposta'
            });
    }

    res.json(
        propostaVersionamentos
            .map(propostaVersionamento =>
                propostaVersionamento.toJSON())
    )
}


async function getImageVersionamento(req, res) {
    const { idVersionamento } = req.params
    const anexos = await AnexoVersionamento.findAll({
        where: {
            idVersionamento: idVersionamento
        }
    })

    console.log(anexos)

    const urlAnexos = []

    for (let i = 0; i < anexos.length; i++) {
        console.log('Entrei no For')
        const command = new GetObjectCommand({
            Bucket: 'anexo-versionamento',
            Key: anexos[i].path
        })

        console.log(anexos[i].path)

        console.log('Passei pelo commend')
        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

        urlAnexos.push(signedUrl)

        console.log('Estou aqui ', signedUrl)
    }
    return res.status(200).json({ url: urlAnexos })

}

async function updateVersionamento(req, res) {
    const { id } = req.params
    const { status } = req.body
    const versionamento = await Versionamento.findByPk(id)
    if (!versionamento) {
        return res.status(404).json({ message: 'Versionamento não encontrado' })
    }
    versionamento.status = status || versionamento.status
    await versionamento.save()
    return res.status(200).json(versionamento.toJSON())
}

export default {
    createVersionamento,
    getVersionamentos,
    getVersionamento,
    getImageVersionamento,
    getPropostaVersionamentos,
    updateVersionamento,
}