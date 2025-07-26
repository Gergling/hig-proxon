import { retrieveJsonFromFile, storeJsonToFile } from "../../common/file";
import { View } from "../../data/types";
import { DTOProps } from "../../types";

const LOCAL_GYM_DATA_EXTRACTION = 'gym-data-extraction.json';
const LOCAL_GYM_DATA_TRANSFORMATION = 'gym-data-transformation.json';

export const retrieveLocalGymExtractionData = () => {
  return retrieveJsonFromFile<DTOProps>(LOCAL_GYM_DATA_EXTRACTION);
};

export const storeLocalGymExtractionData = (data: DTOProps) => {
  return storeJsonToFile(LOCAL_GYM_DATA_EXTRACTION, data);
};

export const storeLocalGymTransformation = (data: View) => {
  return storeJsonToFile(LOCAL_GYM_DATA_TRANSFORMATION, data);
};