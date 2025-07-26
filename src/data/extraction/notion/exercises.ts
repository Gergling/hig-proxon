import { ExercisesDatabase, ExercisesQueryResponse, ExercisesResponseDTO } from "../../../notion-sdk/dbs/exercises";
import { createDbInstance, query } from "./";

export const extractExercises = async (notionSecret: string) => {
  const db = createDbInstance(ExercisesDatabase, notionSecret);
  const tripDTOs = await query<
    ExercisesQueryResponse,
    ExercisesResponseDTO
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
      .map((r) => new ExercisesResponseDTO(r))
  );
  return tripDTOs;
};
