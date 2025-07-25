import { retrieve } from "./retrieve";
import { getCurrentUtcInstant, instantToISOString } from "../../utils/time-helpers";
import { View } from "../types";

type LastUpdatedTimeProp = 'lastUpdatedTime';

type Cached = {
  [key in LastUpdatedTimeProp]: View[key];
} & Partial<Omit<View, LastUpdatedTimeProp>>;

export let gymData: Cached;

export const initialiseCache = async () => {
  const data = await retrieve();
  const response: Cached = {
    ...data,
    lastUpdatedTime: instantToISOString(getCurrentUtcInstant()),
  };
  gymData = response;
  return response;
};
