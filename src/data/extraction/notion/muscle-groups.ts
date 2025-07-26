import { MuscleGroupsDatabase, MuscleGroupsQueryResponse, MuscleGroupsResponseDTO } from "../../../notion-sdk/dbs/muscle-groups";
import { createDbInstance, query } from "./";

export const extractMuscleGroups = async (notionSecret: string) => {
  const db = createDbInstance(MuscleGroupsDatabase, notionSecret);
  return query<
    MuscleGroupsQueryResponse,
    MuscleGroupsResponseDTO
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
      .map((r) => new MuscleGroupsResponseDTO(r))
  );
};
