import { extractAll } from "../data/extraction/notion/extract-all";
import { ExtractionDbResponseProps } from "../data/types/notion";
import { storeLocalGymExtractionData } from "../repositories/local/local-gym";

const extractLocal = async () => {
  try {
    const responses = await extractAll(true) as ExtractionDbResponseProps;
    await storeLocalGymExtractionData(responses);
  } catch(e) {
    console.error('! Local extraction failed:', e);
    throw e;
  }
}

extractLocal();
