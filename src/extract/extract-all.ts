import 'dotenv/config';
import { DTOProps } from "../types";
import { extractGymSet, extractGymTripLog } from "./extractions";
import { extractExerciseEquipment } from "./extractions/exercise-equipment";
import { extractExercises } from "./extractions/exercises";
import { extractGymSetStrategy } from "./extractions/gym-set-strategy";
import { extractMuscleGroups } from "./extractions/muscle-groups";

export const extractAll = async (): Promise<DTOProps> => {
  const notionSecret = process.env.NOTION_TS_CLIENT_NOTION_SECRET;

  if (!notionSecret) {
    throw new Error('No NOTION_TS_CLIENT_NOTION_SECRET environment variable specified.');
  }

  const equipment = await extractExerciseEquipment(notionSecret);
  const exercises = await extractExercises(notionSecret);
  const muscleGroups = await extractMuscleGroups(notionSecret);
  const sets = await extractGymSet(notionSecret);
  const strategies = await extractGymSetStrategy(notionSecret);
  const trips = await extractGymTripLog(notionSecret);

  return {
    equipment,
    exercises,
    muscleGroups,
    sets,
    strategies,
    trips,
  };
};
