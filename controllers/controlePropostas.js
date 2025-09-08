import { readFile, readFileSync } from 'node:fs'
import * as path from 'node:path';
import { s3 } from '../utils/s3.js';
import { PutObjectCommand } from '@aws-sdk/client-s3';
//import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import Proposta from "../models/propostas.js";
import Versionamento from "../models/versionamento.js";
import AnexoVersionamento from '../models/anexoVersionamento.js';

async function createProposta(req, res) {
    const { idCliente, nomeDaProposta, descricao } = req.body
    // const extensao = req.files.originalname.split('.').reverse()[0]
    // console.log('req.file arrumado ', extensao);

    const proposta = await Proposta.create({ idCliente, nomeDaProposta, descricao })

    const versionamento = await Versionamento.create({ idProposta: proposta.id, versao: 1, status: 'EM_ANALISE' });

    //UPANDO ARQUIVO
    const filePath = path.join(import.meta.dirname, '..', 'temp', req.files.filename);
    //Explicando a linha: o path.join() é uma função que junta diferentes partes de um caminho,
    // o import.meta.dirname está dizedo para o código "Estou nessa pasta"
    // logo após os '..', 'temp' é como se você estivesse fazendo '../temp/arquivo
    // req.file.filename é o nome do aqrquivo que eu estou colocando em meu diretório


    console.log('filePath', filePath)

    const file = readFileSync(filePath);
    //essa variável está lendo o arquivo

    const extensaoDoArquivo = req.files.originalname.split('.').reverse()[0];

    const command = new PutObjectCommand({
        Bucket: 'anexo-versionamento',
        Key: `/${versionamento.idProposta}/${versionamento.id}.${extensaoDoArquivo}`,
        Body: file
    });

    await s3.send(command);

    await AnexoVersionamento.create({ idVersionamento: versionamento.id, path: filePath })

    if (proposta) {
        res.status(200).json({ idCliente, nomeDaProposta, descricao, id: proposta.id })
    } else {
        res.status(500).json({ message: 'Não foi possivel criar' })
    }
}

async function getProposta(req, res) {
    console.log('por favor funciona véi')
    const propostas = await Proposta.findAll()

    if (propostas) {
        res.json(propostas.map(propostas => propostas.toJSON()))
    } else {
        res.status(500).json({ message: 'Não foi possível buscar usuários' })
    }
}

export default { createProposta, getProposta }