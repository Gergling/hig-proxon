import { GymSetStrategyDatabase, GymSetStrategyQueryResponse, GymSetStrategyResponseDTO } from "../../../notion-sdk/dbs/gym-set-strategy";
import { createDbInstance, query } from "./";

export const extractGymSetStrategy = async (notionSecret: string) => {
  const db = createDbInstance(GymSetStrategyDatabase, notionSecret);
  return query<
    GymSetStrategyQueryResponse,
    GymSetStrategyResponseDTO
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
      .map((r) => new GymSetStrategyResponseDTO(r))
  );
};
