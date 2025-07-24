import { extractAll } from "../data";
import { store } from "../data/load";
import { transformAll } from "../data/transformations/transform-all-gym-visits";

export const backfill = async () => {
  try {
    const dtos = await extractAll();
    const data = transformAll(dtos);
    await store(data);
  } catch(e) {
    console.error('! Backfill failed:', e);
    throw e;
  }
};

backfill();
