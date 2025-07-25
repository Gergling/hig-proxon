import { retrieveJsonFromS3 } from "../../repositories/s3/retrieve-from-s3";
import { View } from "../types";
import { STORE_FILE_NAME } from "./constants"

export const retrieve = () => {
  return retrieveJsonFromS3<View>(STORE_FILE_NAME);
};
