import { extractAll } from "../data";
import { storeLocalGymExtractionData } from "../repositories/local/local-gym";

const extractLocal = async () => {
  try {
    const dtos = await extractAll();
    await storeLocalGymExtractionData(dtos);
  } catch(e) {
    console.error('! Local extraction failed:', e);
    throw e;
  }
}

extractLocal();
