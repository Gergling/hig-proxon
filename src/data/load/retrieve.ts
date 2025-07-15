import { retrieveJsonFromS3 } from "../../repositories/s3/retrieve-from-s3";
import { STORE_FILE_NAME } from "./constants"
import { StoreProps } from "./types";

export const retrieve = () => {
  return retrieveJsonFromS3<StoreProps>(STORE_FILE_NAME);
};
