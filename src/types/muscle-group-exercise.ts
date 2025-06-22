import { GymExercise } from "./exercise";

export type MuscleGroupExercise = {
  exercises: GymExercise[];
  focus: boolean;
};
