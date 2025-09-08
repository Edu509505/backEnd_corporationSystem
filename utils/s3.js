import { S3Client } from "@aws-sdk/client-s3";

import doteEnv from 'dotenv'

doteEnv.config()

const keyId = process.env.AWS_ACCESS_KEY_ID;
const secretKey = process.env.AWS_SECRET_ACCESS_KEY;
const minioLink = process.env.MINIO_LINK

export const s3 = new S3Client({
    region: "Horizon",
    credentials: {
        accessKeyId: keyId,
        secretAccessKey: secretKey
    },
    forcePathStyle: true,
    endpoint: minioLink
});

