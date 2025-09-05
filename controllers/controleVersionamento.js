import { readFile, readFileSync } from 'node:fs'
import * as path from 'node:path';
import { s3 } from '../utils/s3.js';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import Versionamento from "../models/versionamento.js";

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
    const filePath = path.join(import.meta.dirname, '..', 'temp', req.file.filename);
    console.log('filePath', filePath)

    const file = readFileSync(filePath);

    let extensaoDoArquivo = 'jpg';

    const command = new PutObjectCommand({
        Bucket: 'anexo-versionamento',
        Key: `/${versionamento.idProposta}/${versionamento.id}.${extensaoDoArquivo}`,
        Body: file
    });

    await s3.send(command);

    if (versionamento) {
        res.status(200).json({ versao: versionamento.versao, idProposta, status: versionamento.status })
    } else {
        res.status(500).json({ message: 'Não foi possivel criar' })
    }
}

async function getVersionamento(req, res) {
    const versionamento = await Versionamento.findAll()

    if (versionamento) {
        res.json(versionamento.map(versionamento => versionamento.toJSON()))
    } else {
        res.status(500).json({ message: 'Não foi possível buscar usuários' })
    }
}

export default { createVersionamento, getVersionamento }