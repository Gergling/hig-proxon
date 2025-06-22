import { Equipment } from "./equipment";
import { ExerciseMuscleGroup } from "./exercise-muscle-group";

export type GymExercise = {
  name: string;
  equipment: Equipment[];
  muscleGroups: ExerciseMuscleGroup[];
  ems0ntn: number;
};
