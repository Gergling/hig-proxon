import { transformAll } from "../data/transformations/transform-all-gym-visits";
import { retrieveLocalGymExtractionData, storeLocalGymTransformation } from "../repositories/local/local-gym";

const transformLocal = async () => {
  try {
    const dtos = await retrieveLocalGymExtractionData();
    if (dtos) {
      const data = transformAll(dtos);
      await storeLocalGymTransformation(data);
    }
  } catch(e) {
    console.error('! Backfill failed:', e);
    throw e;
  }  
}

transformLocal();
