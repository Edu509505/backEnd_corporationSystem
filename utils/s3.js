import { S3Client } from "@aws-sdk/client-s3";

import doteEnv from 'dotenv'

doteEnv.config()

const keyId = process.env.AWS_ACCESS_KEY_ID;
const secretKey = process.env.AWS_SECRET_ACCESS_KEY;

console.log('process.env.AWS_ACCESS_KEY_ID', process.env.AWS_ACCESS_KEY_ID);
console.log('process.env.AWS_SECRET_ACCESS_KEY', process.env.AWS_SECRET_ACCESS_KEY);

export const s3 = new S3Client({
    region: "BLÁ",
    credentials: {
        accessKeyId: keyId,
        secretAccessKey: secretKey
    },
    forcePathStyle: true,
    endpoint: 'https://minio-hos008kc8co8gc480sskkc8s.212.85.1.115.sslip.io'
});