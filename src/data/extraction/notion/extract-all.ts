import 'dotenv/config';
import { DTOProps } from '../../../types';
import { DataDtoProps, ExtractionDbResponseProps, notionExtractionMapping } from '../../types/notion';
import { configureNotionExtraction } from './core';

export const extractAll = async (
  local: boolean = false
): Promise<DataDtoProps | ExtractionDbResponseProps> => {
  const notionSecret = process.env.NOTION_TS_CLIENT_NOTION_SECRET;

  if (!notionSecret) {
    throw new Error('No NOTION_TS_CLIENT_NOTION_SECRET environment variable specified.');
  }

  // I added this block to loop the extractions and run them.
  const awaitingExtractions = Object
    .entries(notionExtractionMapping)
    .map(([key, { db: DbConstructor, dto: DtoContructor }]) => {
      const {
        queryDTOs,
        queryResponses
      } = configureNotionExtraction(
        DbConstructor,
        DtoContructor,
        notionSecret
      );
      const query = local ? queryResponses : queryDTOs;
      const name = key as keyof DTOProps;
      return new Promise<{
        name: keyof DTOProps;
        response: Awaited<ReturnType<typeof query>>;
      }>((resolve, reject) => {
        query().then((response) => {
          resolve({ name, response });
        });
      });
    });

  // TODO: Putting this in a for...in and awaiting the queries individually
  // will reduce the 429 likelihood.
  const completedExtractions = await Promise.all(awaitingExtractions);

  const mappedExtractions = completedExtractions.reduce(
    (
      state,
      {
        name,
        response,
      }
    ) => {
      return {
        ...state,
        [name]: response,
      }
    },
    local ? {} as ExtractionDbResponseProps : {} as DataDtoProps
  );

  return mappedExtractions;
};
