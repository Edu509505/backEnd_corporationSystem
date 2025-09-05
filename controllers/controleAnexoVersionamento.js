import { readFileSync } from 'fs';
import * as path from 'node:path';
import { s3 } from '../utils/s3.js'
import { PutObjectCommand } from '@aws-sdk/client-s3';

async function uploadAnexoVersionamento(req,res) {
    console.log('req.body', req.body);

    const filePath = path.join(import.meta.dirname, '..', 'temp', req.file.filename);
    console.log('filePath', filePath)

    const file = readFileSync(filePath);

    const nomeDaImagem = Math.random()
      .toString(36)
      .slice(2, 15) + '-' + req.file.originalname;

    console.log('salvando imagem', nomeDaImagem);

    const command = new PutObjectCommand({
      Bucket: 'anexo-versionamento',
      Key: `/${req.proposta.id}/${nomeDaImagem}`,
      Body: file
    });

    await s3.send(command);
    
    res.status(200).json({
      message: "Imagem salva no Minio com sucesso!"
    })
  }

export default { uploadAnexoVersionamento }