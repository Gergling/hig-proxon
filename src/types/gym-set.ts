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
  challenge: number;
  exercise: GymExercise;
  id: string;
  progression?: ExerciseSetProgression & { status: SetProgressionStatus; };
  reps: number;
  strategy: GymSetStrategy;
  units: GymSetPropertiesResponseDTO['units']['name'];
  validity: SetValidityStatus;
};
