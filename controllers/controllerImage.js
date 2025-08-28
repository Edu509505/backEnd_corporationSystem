//@ts-check
import { readFileSync } from 'node:fs'
import * as path from 'node:path'
import { s3 } from '../utils/s3.js'
import { PutObjectCommand } from '@aws-sdk/client-s3'

const filePath = path.join(import.meta.dirname, '..', '132.png')

async function uploadImageFormData(req,res) {
    const filePath = path.join(import.meta.dirname, '..', 'temp', req.file.filename);
    console.log('filePath', filePath)
    const file = readFileSync(filePath);
    const nomeDaImagem = Math.random()
      .toString(36)
      .slice(2, 15) + '-' + req.file.originalname;
    console.log('salvando imagem', nomeDaImagem);
    const command = new PutObjectCommand({
      Bucket: 'tioduh',
      Key: `/${req.user}/${nomeDaImagem}`,
      Body: file,
    });
    await s3.send(command);
    res.status(200).json({
      message: "Imagem salva no Minio com sucesso!"
    })
  }

// // async function uploadImage(rea, res) {
// //     const file = readFileSync(filePath)
// //     const comand = new PutObjectCommand({
// //         Bucket: 'tioduh',
// //         Key: '/132.png',
// //         Body: file
// //     })
// //     await s3.send(comand)
// //     res.json(200).json({message: 'Oi'})
// // }

export default { uploadImageFormData }