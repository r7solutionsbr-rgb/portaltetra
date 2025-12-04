import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export class StorageService {
    private client: S3Client;
    private bucketName: string;

    constructor() {
        const accountId = process.env.R2_ACCOUNT_ID;
        const accessKeyId = process.env.R2_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
        const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;
        this.bucketName = process.env.R2_BUCKET_NAME || process.env.AWS_BUCKET || 'tetraoil-bucket';

        // Support explicit endpoint (AWS_ENDPOINT) or construct R2 endpoint from Account ID
        const endpoint = process.env.R2_ENDPOINT || process.env.AWS_ENDPOINT || (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined);

        if (!endpoint) {
            console.error('Missing R2/S3 Endpoint configuration. Set R2_ACCOUNT_ID or AWS_ENDPOINT.');
        }

        if (!accessKeyId || !secretAccessKey) {
            console.error('Missing R2/S3 credentials. Check R2_ACCESS_KEY_ID/AWS_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY/AWS_SECRET_ACCESS_KEY.');
        }

        this.client = new S3Client({
            region: 'auto',
            endpoint: endpoint || '',
            credentials: {
                accessKeyId: accessKeyId || '',
                secretAccessKey: secretAccessKey || '',
            },
        });
    }

    async generateUploadUrl(fileName: string, fileType: string) {
        // Create a unique file name to avoid collisions
        // Sanitize filename to remove spaces and special characters
        const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
        const uniqueFileName = `${Date.now()}-${sanitizedFileName}`;

        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: uniqueFileName,
            ContentType: fileType,
        });

        // Generate the presigned URL valid for 1 hour
        const uploadUrl = await getSignedUrl(this.client, command, { expiresIn: 3600 });

        // Construct the public URL
        // If R2_PUBLIC_DOMAIN is set, use it. Otherwise, fallback to a standard pattern or the bucket name.
        // Note: For R2, public access usually requires a custom domain or the r2.dev subdomain if enabled.
        const publicUrl = process.env.R2_PUBLIC_DOMAIN
            ? `${process.env.R2_PUBLIC_DOMAIN}/${uniqueFileName}`
            : `https://${this.bucketName}.r2.dev/${uniqueFileName}`;

        return { uploadUrl, publicUrl };
    }
}

export const storageService = new StorageService();
