import { Temporal } from "temporal-polyfill";
import { GymExercise } from "./exercise";
import { SetProgressionStatus, SetProgressionStatusFirst, SetValidityStatus } from "./status";

export type MuscleGroupExercise = {
  exercise: GymExercise;
  focus: boolean;
};

export type MuscleGroupSetActivity = {
  date: Temporal.PlainDate;
  exercise: GymExercise;
  focus: boolean;
  status: {
    progression: SetProgressionStatus | SetProgressionStatusFirst;
    validity: SetValidityStatus;
  };
};

export type MuscleGroup = {
  id: string;
  name: string;
  activity: MuscleGroupSetActivity[];
  exercises: MuscleGroupExercise[];
};
