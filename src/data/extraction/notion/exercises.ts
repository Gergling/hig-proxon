import { ExercisesDatabase, ExercisesResponseDTO } from "../../../notion-sdk/dbs/exercises";
import { configureNotionExtraction } from "./core";

export const getExercisesDatabaseNotionExtraction = (
  notionSecret: string
) => configureNotionExtraction(
  ExercisesDatabase,
  ExercisesResponseDTO,
  notionSecret,
);
