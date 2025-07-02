import { Temporal } from "temporal-polyfill";
import { GymExerciseSet } from "./gym-set";
import { SetProgressionStatus } from "./status";

export type GymTripProps = {
  muscleScore: number;
  sets: GymExerciseSet[];
  status: SetProgressionStatus | undefined;
  tqi: number;
  visitDate: Temporal.PlainDate;
};
