import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, NoSuchKey } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Readable } from 'stream'; // Node.js stream module

// Environment variables will be loaded by dotenv in your main app.ts/script.ts
const AWS_REGION = process.env.AWS_REGION;
const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

// Basic validation (your app's startup script should also do this)
if (!AWS_REGION || !AWS_S3_BUCKET_NAME || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
  console.error("CRITICAL: Missing AWS S3 environment variables. S3 operations will fail.");
  // In a production app, you might throw an error or exit here.
}

// Initialize S3 Client
const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID!,
    secretAccessKey: AWS_SECRET_ACCESS_KEY!,
  },
});

/**
 * Stores a JavaScript object as a JSON file in an S3 bucket.
 * @param key The S3 object key (path) for the file (e.g., 'processed_gym_data.json').
 * @param data The JavaScript object to be stored.
 */
export async function storeJsonToS3(key: string, data: any): Promise<void> {
  if (!AWS_S3_BUCKET_NAME) throw new Error("AWS_S3_BUCKET_NAME is not defined.");

  try {
    const jsonString = JSON.stringify(data, null, 2);
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: AWS_S3_BUCKET_NAME,
        Key: key,
        Body: jsonString,
        ContentType: 'application/json',
      },
    });
    upload.on("httpUploadProgress", (progress) => {
      // console.log(`S3 Upload Progress for ${key}: ${progress.loaded}/${progress.total}`);
    });
    await upload.done();
    console.log(`JSON data successfully stored to S3://${AWS_S3_BUCKET_NAME}/${key}`);
  } catch (error: any) {
    console.error(`Error storing JSON data to S3://${AWS_S3_BUCKET_NAME}/${key}:`, error);
    throw new Error(`Failed to store JSON data to S3: ${error.message}`);
  }
}

/**
 * Retrieves and parses JSON data from an S3 bucket.
 * @param key The S3 object key (path) for the file.
 * @returns The parsed JavaScript object, or null if the file does not exist.
 */
export async function retrieveJsonFromS3(key: string): Promise<any | null> {
    if (!AWS_S3_BUCKET_NAME) throw new Error("AWS_S3_BUCKET_NAME is not defined.");
    try {
        const command = new GetObjectCommand({
            Bucket: AWS_S3_BUCKET_NAME,
            Key: key,
        });
        const response = await s3Client.send(command);
        if (response.Body instanceof Readable) {
            const chunks: Buffer[] = [];
            for await (const chunk of response.Body) {
                chunks.push(chunk);
            }
            const fileContent = Buffer.concat(chunks).toString('utf8');
            const parsedData = JSON.parse(fileContent);
            console.log(`JSON data successfully retrieved from S3://${AWS_S3_BUCKET_NAME}/${key}`);
            return parsedData;
        } else {
            const fileContent = await response.Body?.transformToString('utf8');
            if (fileContent) {
                const parsedData = JSON.parse(fileContent);
                console.log(`JSON data successfully retrieved from S3://${AWS_S3_BUCKET_NAME}/${key}`);
                return parsedData;
            }
            throw new Error("S3 GetObjectCommand response body was empty or not readable.");
        }
    } catch (error: any) {
        if (error instanceof NoSuchKey) {
            console.warn(`S3 object not found at S3://${AWS_S3_BUCKET_NAME}/${key}. Returning null.`);
            return null;
        }
        console.error(`Error retrieving or parsing JSON from S3://${AWS_S3_BUCKET_NAME}/${key}:`, error);
        throw new Error(`Failed to retrieve or parse JSON from S3: ${error.message}`);
    }
}

/**
 * Deletes a JSON file from an S3 bucket.
 * @param key The S3 object key (path) for the file to delete.
 */
export async function deleteJsonFromS3(key: string): Promise<void> {
    if (!AWS_S3_BUCKET_NAME) throw new Error("AWS_S3_BUCKET_NAME is not defined.");
    try {
        const command = new DeleteObjectCommand({
            Bucket: AWS_S3_BUCKET_NAME,
            Key: key,
        });
        await s3Client.send(command);
        console.log(`JSON file successfully deleted from S3://${AWS_S3_BUCKET_NAME}/${key}`);
    } catch (error: any) {
        if (error instanceof NoSuchKey) {
            console.warn(`Attempted to delete S3 object ${key}, but it did not exist.`);
            return;
        }
        console.error(`Error deleting JSON file from S3://${AWS_S3_BUCKET_NAME}/${key}:`, error);
        throw new Error(`Failed to delete JSON file from S3: ${error.message}`);
    }
}
