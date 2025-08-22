//@ts-check
import { readFileSync } from 'node:fs'
import * as path from 'node:path'
import { s3 } from '../utils/s3.js'
import { PutObjectCommand } from '@aws-sdk/client-s3'

const filePath = path.join(import.meta.dirname, '..', '132.png')

async function uploadImageJson(req, res) {
    const body = req.body;
    const { fileBase64 } = body;
    const comand = new PutObjectCommand({
            Bucket: 'tioduh',
            Key: '/132.png',
            Body: fileBase64
        });
        await s3.send(comand)
        res.json(200).json({message: 'Oi'})
}

// async function uploadImage(rea, res) {
//     const file = readFileSync(filePath)
//     const comand = new PutObjectCommand({
//         Bucket: 'tioduh',
//         Key: '/132.png',
//         Body: file
//     })
//     await s3.send(comand)
//     res.json(200).json({message: 'Oi'})
// }

export default { uploadImageJson }