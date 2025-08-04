import { SetProgressionStatus } from "../../../types";

export type MuscleGroupAggregation = {
  activity: number;
  muscleGroupId: string;
  statuses: SetProgressionStatus[];
};
