import { GymSetDatabase, GymSetQueryResponse, GymSetResponseDTO } from "../../../notion-sdk/dbs/gym-set";
import { createDbInstance, query } from "./";

export const extractGymSet = async (notionSecret: string) => {
  const db = createDbInstance(GymSetDatabase, notionSecret);
  const tripDTOs = await query<
    GymSetQueryResponse,
    GymSetResponseDTO
  >(
    async (start_cursor) => {
      const response = await db.query({ start_cursor });
      const { has_more, next_cursor } = response;
      return {
        has_more,
        next_cursor,
        response,
      };
    },
    (queryResponse) => queryResponse
      .results
      .map((r) => new GymSetResponseDTO(r))
  );
  return tripDTOs;
};
