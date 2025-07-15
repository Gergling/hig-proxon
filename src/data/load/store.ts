import { storeJsonToS3 } from "../../repositories/s3/store-to-s3";
import { STORE_FILE_NAME } from "./constants";
import { StoreProps } from "./types";

export const store = (data: StoreProps) => {
  return storeJsonToS3(STORE_FILE_NAME, data);
};
