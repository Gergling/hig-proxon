import { storeJsonToFile } from "../common/file";
import { STORE_FILE_NAME } from "./constants";
import { StoreProps } from "./types";

// TODO: Eventually we'll want this to store in an S3 bucket.
export const store = (data: StoreProps) => {
  return storeJsonToFile(STORE_FILE_NAME, data);
};
