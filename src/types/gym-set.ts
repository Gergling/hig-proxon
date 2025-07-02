import { GymSetPropertiesResponseDTO } from "../notion-sdk/dbs/gym-set";
import { GymExercise } from "./exercise";
import { SetProgressionStatus, SetValidityStatus } from "./status";
import { GymSetStrategy } from "./strategy";

export type ExerciseSetProgression = {
  all: GymExerciseSet;
  month: GymExerciseSet;
  previous: GymExerciseSet;
};

export type GymExerciseSet = {
  exercise: GymExercise;
  challenge: number;
  id: string;
  progression?: ExerciseSetProgression & { status: SetProgressionStatus; };
  reps: number;
  strategy: GymSetStrategy;
  units: GymSetPropertiesResponseDTO['units']['name'];
  validity: SetValidityStatus;
};
