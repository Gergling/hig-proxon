import { retrieveJsonFromFile } from "../common/file"
import { STORE_FILE_NAME } from "./constants"
import { StoreProps } from "./types";

// TODO: Eventually this will retrieve from an S3 bucket.
export const retrieve = () => {
  return retrieveJsonFromFile<StoreProps>(STORE_FILE_NAME);
};
