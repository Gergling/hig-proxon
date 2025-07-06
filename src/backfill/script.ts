import { transformAll } from "../transformations/transform-all";
import { extract } from "./extract";
import { load } from "./load";

export const backfill = async () => {
  try {
    const dtos = await extract();
    const data = transformAll(dtos);
    await load(data);
  } catch(e) {
    console.error('! Backfill failed:', e);
    throw e;
  }
};

backfill();
