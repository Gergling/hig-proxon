import { GymTripLogDatabase, GymTripLogQueryResponse, GymTripLogResponseDTO } from "../../../notion-sdk/dbs/gym-trip-log";
import { createDbInstance, query } from "./";

export const extractGymTripLog = async (notionSecret: string) => {
  const db = createDbInstance(GymTripLogDatabase, notionSecret);
  const tripDTOs = await query<
    GymTripLogQueryResponse,
    GymTripLogResponseDTO
  >(
    async (start_cursor) => {
      const response = await db.query({
        sorts: [{ property: 'visitTime', direction: 'ascending' }],
        start_cursor,
      });
      const { has_more, next_cursor } = response;
      return {
        has_more,
        next_cursor,
        response,
      };
    },
    (queryResponse) => queryResponse
      .results
      .map((r) => new GymTripLogResponseDTO(r))
  );
  return tripDTOs;
};
