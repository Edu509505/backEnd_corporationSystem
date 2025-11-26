import { S3Client } from "@aws-sdk/client-s3";

import doteEnv from 'dotenv'

doteEnv.config()

const keyId = process.env.AWS_ACCESS_KEY_ID;
const secretKey = process.env.AWS_SECRET_ACCESS_KEY;
const minioLink = process.env.MINIO_LINK;

console.log('keyId', keyId);
console.log('secretKey', secretKey);
console.log('minioLink', minioLink);

export const s3 = new S3Client({
    region: "us-east-1",
    credentials: {
        accessKeyId: keyId,
        secretAccessKey: secretKey
    },
    forcePathStyle: true,
    endpoint: minioLink
});

