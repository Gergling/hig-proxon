import { Temporal } from "temporal-polyfill";
import { Equipment, SetProgressionStatus, SetProgressionStatusFirst, SetValidityStatus } from "../../../types";
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

type NamedId = {
  id: string;
  name: string;
};

export type NormalisedGymSetMuscleGroup = {
  date: Temporal.PlainDate;
  // Note: Equipment is not normalised, because mostly we care about
  // exercises in terms of muscle groups. HOWEVER, some pieces of
  // equipment might be harder to access due to their frequent usage.
  equipment: Equipment[];
  exercise: NamedId;
  focus: boolean;
  muscleGroup: NamedId;
  status: {
    progression: SetProgressionStatus | SetProgressionStatusFirst;
    validity: SetValidityStatus;
  };
};

export type AggregatedMonthlyActivity = {
  count: number;
  mai: number;
  month: Temporal.PlainYearMonth;
  msi: number;
};
