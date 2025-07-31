import 'dotenv/config';
import { DTOProps } from '../../../types';
import { DataDtoProps, ExtractionDbResponseProps, notionExtractionMapping } from '../../types/notion';
import { NOTION_EXTRACTION_CONFIG } from './config';

export const extractAll = async (
  local: boolean = false
): Promise<DataDtoProps | ExtractionDbResponseProps> => {
  const notionSecret = process.env.NOTION_TS_CLIENT_NOTION_SECRET;

  if (!notionSecret) {
    throw new Error('No NOTION_TS_CLIENT_NOTION_SECRET environment variable specified.');
  }

  // Loops extraction configs and runs them.
  const awaitingExtractions = Object
    .entries(NOTION_EXTRACTION_CONFIG)
    .map(([
      key,
      {
        queryDTOs,
        queryResponses
      }
    ]) => {
      const query = local ? queryResponses : queryDTOs;
      const name = key as keyof DTOProps;
      return new Promise<{
        name: keyof DTOProps;
        response: Awaited<ReturnType<typeof query>>;
      }>((resolve, reject) => {
        query(notionSecret).then((response) => {
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
