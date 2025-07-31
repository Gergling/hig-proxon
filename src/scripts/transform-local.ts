import { NOTION_EXTRACTION_CONFIG } from "../data/extraction/notion/config";
import { transformAll } from "../data/transformations/transform-all-gym-visits";
import { DataDtoProps, notionExtractionMapping, NotionExtractionMappingKeys } from "../data/types/notion";
import { retrieveLocalGymExtractionData, storeLocalGymTransformation } from "../repositories/local/local-gym";

const transformLocal = async () => {
  try {
    const response = await retrieveLocalGymExtractionData();
    if (response) {
      const dtos = Object
        .entries(NOTION_EXTRACTION_CONFIG)
        .reduce((dtos, [key, {
          reduceQueryResponseDTOs,
        }]) => {
          const typedKey = key as NotionExtractionMappingKeys;
          const responseForKey = response[typedKey];
          const DtoClass = notionExtractionMapping[typedKey]['DtoClass'];
          const dtosForKey = responseForKey.reduce((state, action) => {
            return reduceQueryResponseDTOs(state as any, action as any);
          }, [] as InstanceType<(typeof DtoClass)>[]);
          return {
            ...dtos,
            [key]: dtosForKey,
          };
        }, {} as DataDtoProps);

      const data = transformAll(dtos);
      await storeLocalGymTransformation(data);
    }
  } catch(e) {
    console.error('! Backfill failed:', e);
    throw e;
  }  
}

transformLocal();
