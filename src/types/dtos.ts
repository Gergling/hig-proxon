import { ExerciseEquipmentResponseDTO } from "../notion-sdk/dbs/exercise-equipment";
import { ExercisesResponseDTO } from "../notion-sdk/dbs/exercises";
import { GymSetResponseDTO } from "../notion-sdk/dbs/gym-set";
import { GymSetStrategyResponseDTO } from "../notion-sdk/dbs/gym-set-strategy";
import { GymTripLogResponseDTO } from "../notion-sdk/dbs/gym-trip-log";
import { MuscleGroupsResponseDTO } from "../notion-sdk/dbs/muscle-groups";

export type DTOProps = {
  equipment: ExerciseEquipmentResponseDTO[];
  exercises: ExercisesResponseDTO[];
  muscleGroups: MuscleGroupsResponseDTO[];
  sets: GymSetResponseDTO[];
  strategies: GymSetStrategyResponseDTO[];
  trips: GymTripLogResponseDTO[];
};
