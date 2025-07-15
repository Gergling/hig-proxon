import { retrieve } from "./retrieve";
import { StoreProps } from "./types";

export let gymData: StoreProps | null;

export const initialiseCache = async () => {
  const response = await retrieve();
  gymData = response;
  return response;
};
