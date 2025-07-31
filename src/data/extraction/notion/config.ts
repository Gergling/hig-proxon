import { DbQueryFactory, NotionExtractionMapping, notionExtractionMapping, NotionExtractionMappingKeys } from "../../types/notion";
import { configureNotionExtraction } from "./core";
import { NotionExtractionConfiguration } from "./types";

export const NOTION_EXTRACTION_CONFIG = Object
  .entries(notionExtractionMapping)
  .reduce((config, [key, {
    dbQueryFactory,
    DbClass,
    DtoClass,
  }]) => {
    const factory = dbQueryFactory as DbQueryFactory<typeof DbClass>;
    const notionExtractionConfig = configureNotionExtraction(
      DbClass,
      DtoClass,
      factory
    );

    return {
      ...config,
      [key]: notionExtractionConfig,
    };
  }, {} as {
    [K in NotionExtractionMappingKeys]: NotionExtractionConfiguration<NotionExtractionMapping[K]['DbClass'], NotionExtractionMapping[K]['DtoClass']>
  });