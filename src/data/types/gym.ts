import { SetProgressionStatusFirst } from "../../types";
import { ViewAggregatedSetProgressionStatus } from "./view";

export type GymExerciseSetProgressionStatus =
  | ViewAggregatedSetProgressionStatus
  | SetProgressionStatusFirst;
