import { readFile, readFileSync } from 'node:fs'
import * as path from 'node:path';
import { s3 } from '../utils/s3.js';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import Anexo from "../models/anexoVersionamento.js";

async function createAnexoVersionamento(req, res) {
    // Recebe o que eu coloquei na requisição 
    const { idVersionamento, path } = req.body

    if (!idVersionamento) {
        return res.status(400).json({ message: "Versionamento não encontrado" })
    }

    try {
        // Esepra as informações do req.body cria um novo registro
        const imagens = await Anexo.create({ idVersionamento, path })

        //UPANDO ARQUIVO
        const filePath = path.join(import.meta.dirname, '..', 'temp', req.file.filename);
        //Explicando a linha: o path.join() é uma função que junta diferentes partes de um caminho,
        // o import.meta.dirname está dizedo para o código "Estou nessa pasta"
        // logo após os '..', 'temp' é como se você estivesse fazendo '../temp/arquivo
        // req.file.filename é o nome do aqrquivo que eu estou colocando em meu diretório


        console.log('filePath', filePath)

        const file = readFileSync(filePath);
        //essa variável está lendo o arquivo

        const extensaoDoArquivo = req.file.originalname.split('.').reverse()[0];

        const command = new PutObjectCommand({
            Bucket: 'anexo-versionamento',
            Key: `/${imagens.idVersionamento}/${imagens.id}.${extensaoDoArquivo}`,
            Body: file
        });

        await s3.send(command);

        if (imagens) {
            res.status(200).json({ idVersionamento, path })
        }
    } catch (error) {
        res.status(500).json({ message: "Não foi possível criar ", error })
    }
}

export default { createAnexoVersionamento }