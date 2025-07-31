import { retrieveJsonFromFile, storeJsonToFile } from "../../common/file";
import { View } from "../../data/types";
import { ExtractionDbResponseProps } from "../../data/types/notion";

const LOCAL_GYM_DATA_EXTRACTION = 'gym-data-extraction.json';
const LOCAL_GYM_DATA_TRANSFORMATION = 'gym-data-transformation.json';

export const retrieveLocalGymExtractionData = () => {
  return retrieveJsonFromFile<ExtractionDbResponseProps>(LOCAL_GYM_DATA_EXTRACTION);
};

export const storeLocalGymExtractionData = (data: ExtractionDbResponseProps) => {
  return storeJsonToFile(LOCAL_GYM_DATA_EXTRACTION, data);
};

export const storeLocalGymTransformation = (data: View) => {
  return storeJsonToFile(LOCAL_GYM_DATA_TRANSFORMATION, data);
};