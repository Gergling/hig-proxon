import { storeJsonToFile } from "../common/file";
import { StoreProps } from "./types";

// TODO: Eventually we'll want this to store in an S3 bucket.
export const store = (data: StoreProps) => {
  return storeJsonToFile('store.json', data);
};
