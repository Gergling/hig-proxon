import { extractAll } from "../extract/extract-all";

export const backfill = async () => {
  const dtos = await extractAll();
  // transform
  // load
};
