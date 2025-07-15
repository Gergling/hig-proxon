import { DeleteObjectCommand, NoSuchKey } from "@aws-sdk/client-s3";
import { getS3Env } from "./get-s3-env";
import { initialiseS3Client } from "./init-s3";

/**
 * Deletes a JSON file from an S3 bucket.
 * @param key The S3 object key (path) for the file to delete.
 */
export async function deleteJsonFromS3(key: string): Promise<void> {
  const {
    AWS_S3_BUCKET_NAME,
  } = getS3Env();

  const s3Client = initialiseS3Client();

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
