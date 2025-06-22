import { GymExercise } from "./exercise";
import { GymSetStrategy } from "./strategy";

export type GymExerciseSetProgression = {
  previous: GymExerciseSet;
  month: GymExerciseSet;
  all: GymExerciseSet;
};

export type GymExerciseSet = {
  exercise: GymExercise;
  challenge: number;
  reps: number;
  progression?: GymExerciseSetProgression;
  strategy: GymSetStrategy;
};
