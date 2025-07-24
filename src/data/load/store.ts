import { storeJsonToS3 } from "../../repositories/s3/store-to-s3";
import { View } from "../types";
import { STORE_FILE_NAME } from "./constants";

export const store = (data: View) => {
  return storeJsonToS3(STORE_FILE_NAME, data);
};
