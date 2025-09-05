import { readFile, readFileSync } from 'node:fs'
import * as path from 'node:path';
import { s3 } from '../utils/s3.js';
import { PutObjectCommand } from '@aws-sdk/client-s3';
//import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import Proposta from "../models/propostas.js";
import Versionamento from "../models/versionamento.js";

async function createProposta(req, res) {
    const { idCliente, nomeDaProposta, descricao } = req.body
    console.log('req.file', req.file);
    const proposta = await Proposta.create({ idCliente, nomeDaProposta, descricao})

    const versionamento = await Versionamento.create({ idProposta: proposta.id, versao: 1, status: 'EM_ANALISE'});
    
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

    if (proposta) {
        res.status(200).json({ idCliente, nomeDaProposta, descricao, id: proposta.id})
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