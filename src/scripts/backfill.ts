import { extractAll } from "../data/extraction/notion/extract-all";
import { store } from "../data/load";
import { transformAll } from "../data/transformations/transform-all-gym-visits";
import { DataDtoProps } from "../data/types/notion";

export const backfill = async () => {
  try {
    const dtos = await extractAll() as DataDtoProps;
    const data = transformAll(dtos);
    await store(data);
  } catch(e) {
    console.error('! Backfill failed:', e);
    throw e;
  }
};

backfill();
