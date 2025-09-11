import { readFile, readFileSync } from 'node:fs'
import * as path from 'node:path';
import { s3 } from '../utils/s3.js';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import Versionamento from "../models/versionamento.js";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { url } from 'node:inspector';
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
    const filePath = path.join(import.meta.dirname, '..', 'temp', req.files.filename);
    console.log('filePath', filePath)

    const file = readFileSync(filePath);

    //let extensaoDoArquivo = 'jpg';

    const command = new PutObjectCommand({
        Bucket: 'anexo-versionamento',
        Key: `/${versionamento.idProposta}/${versionamento.id}`,
        Body: file
    });

    await s3.send(command);

    if (versionamento) {
        console.log('estou aqui')
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

        console.log('Estou aqui ',signedUrl)
    }
    return res.status(200).json({ url: urlAnexos })

}

export default { createVersionamento, getVersionamento, getImageVersionamento }