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

        if (imagens) {
            res.status(200).json({ idVersionamento, path })
        }
    } catch (error) {
        res.status(500).json({ message: "Não foi possível criar ", error })
    }
}



export default { createAnexoVersionamento }