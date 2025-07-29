import { GymTripLogDatabase, GymTripLogResponseDTO } from "../../../notion-sdk/dbs/gym-trip-log";
import { configureNotionExtraction } from "./core";

export const getGymTripLogDatabaseNotionExtraction = (
  notionSecret: string
) => configureNotionExtraction(
  GymTripLogDatabase,
  GymTripLogResponseDTO,
  notionSecret,
);
