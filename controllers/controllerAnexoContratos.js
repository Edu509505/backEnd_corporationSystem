import { readFile, readFileSync } from 'node:fs'
import * as path from 'node:path';
import { s3 } from '../utils/s3.js';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import Versionamento from "../models/versionamento.js";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import anexoContrato from "../models/anexoContratos.js"

async function getAnexoContrato(req, res){
    const { id } = req.params
    const response = await anexoContrato.findAll({where: {idContrato: id} })

    const urlAnexos = []
    
        for (let i = 0; i < response.length; i++) {
            const command = new GetObjectCommand({
                Bucket: 'anexo-contrato',
                Key: response[i].path
            })
    
            console.log(response[i].path)
    
            console.log('Passei pelo commend')
            const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    
            urlAnexos.push(signedUrl)
    
            console.log('Estou aqui ', signedUrl)
        }
        return res.status(200).json({ url: urlAnexos })


}

export default { getAnexoContrato }