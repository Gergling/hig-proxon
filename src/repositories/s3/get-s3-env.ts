export const getS3Env = () => {
  const AWS_REGION = process.env.AWS_REGION;
  const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
  const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
  const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

  if (!AWS_REGION || !AWS_S3_BUCKET_NAME || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
    console.error("CRITICAL: Missing AWS S3 environment variables. S3 operations will fail.");
    // TODO: Throw error or exit?
  }

  return {
    AWS_ACCESS_KEY_ID,
    AWS_REGION,
    AWS_S3_BUCKET_NAME,
    AWS_SECRET_ACCESS_KEY,
  };
};
