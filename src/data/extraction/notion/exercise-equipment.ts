import { ExerciseEquipmentDatabase, ExerciseEquipmentQueryResponse, ExerciseEquipmentResponseDTO } from "../../../notion-sdk/dbs/exercise-equipment";
import { createDbInstance, query } from "./";

export const extractExerciseEquipment = async (notionSecret: string) => {
  const db = createDbInstance(ExerciseEquipmentDatabase, notionSecret);
  return query<
    ExerciseEquipmentQueryResponse,
    ExerciseEquipmentResponseDTO
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
      .map((r) => new ExerciseEquipmentResponseDTO(r))
  );
};
