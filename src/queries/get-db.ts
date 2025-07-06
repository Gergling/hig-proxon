import { ExerciseEquipmentDatabase } from '../notion-sdk/dbs/exercise-equipment';
import { ExercisesDatabase } from '../notion-sdk/dbs/exercises';
import { GymSetDatabase } from '../notion-sdk/dbs/gym-set';
import { GymSetStrategyDatabase } from '../notion-sdk/dbs/gym-set-strategy';
import { GymTripLogDatabase } from '../notion-sdk/dbs/gym-trip-log';
import { MuscleGroupsDatabase } from '../notion-sdk/dbs/muscle-groups';

export const getDBs = () => {
  const notionSecret = process.env.NOTION_TS_CLIENT_NOTION_SECRET;

  if (notionSecret) return {
    equipmentDB: new ExerciseEquipmentDatabase({ notionSecret }),
    exerciseDB: new ExercisesDatabase({ notionSecret }),
    setDB: new GymSetDatabase({ notionSecret }),
    strategyDB: new GymSetStrategyDatabase({ notionSecret }),
    muscleGroupDB: new MuscleGroupsDatabase({ notionSecret }),
    tripDB: new GymTripLogDatabase({ notionSecret }),
  };

  throw new Error('No NOTION_TS_CLIENT_NOTION_SECRET environment variable specified.');
};

