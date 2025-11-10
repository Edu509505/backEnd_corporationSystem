import { s3 } from '../utils/s3.js';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import anexosFaturamento from "../models/anexosFaturamento.js"

async function getAnexoFaturamento(req, res) {
    const { id } = req.params
    const response = await anexosFaturamento.findAll({ where: { idFaturamento: id } })

    // console.log("Response", response[0].path)

    const command = new GetObjectCommand({
        Bucket: 'anexo-faturamento',
        Key: response[0].path
    })

    console.log(response.path)

    console.log('Passei pelo commend')
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

    console.log('Estou aqui ', signedUrl)

    return res.status(200).json({url: signedUrl, path: response[0].path})
}

export default { getAnexoFaturamento }