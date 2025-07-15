import { GetObjectCommand, NoSuchKey } from '@aws-sdk/client-s3';
import { Readable } from 'stream'; // Node.js stream module
import { getS3Env } from "./get-s3-env";
import { initialiseS3Client } from "./init-s3";

/**
 * Retrieves and parses JSON data from an S3 bucket.
 * @param key The S3 object key (path) for the file.
 * @returns The parsed JavaScript object, or null if the file does not exist.
 */
export async function retrieveJsonFromS3<T>(key: string): Promise<T | null> {
  const {
    AWS_S3_BUCKET_NAME,
  } = getS3Env();

  const s3Client = initialiseS3Client();

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
};
