import { Temporal } from "temporal-polyfill";
import { retrieve } from "./retrieve";
import { StoreProps } from "./types";
import { getCurrentUtcInstant, instantToISOString } from "../../utils/time-helpers";

export let gymData: StoreProps | null;

export const initialiseCache = async () => {
  // const response = await retrieve();
  const empty: StoreProps = {
    muscleGroups: [],
    trips: [],
  };
  const response = {
    ...empty,
    lastUpdated: instantToISOString(getCurrentUtcInstant()),
  };
  gymData = response;
  return response;
};
