import { Equipment } from "../../../types";
import { GymExerciseSetProgressionStatus } from "../../types/gym";

export type ExerciseSet = {
  ems0ntn: number;
  equipment: Equipment[];
  exerciseId: string;
  exerciseName: string;
  progressionStatuses: GymExerciseSetProgressionStatus[];
  recency: number;
};
export type UniqueExerciseSets = {
  [exerciseId: string]: ExerciseSet;
};
