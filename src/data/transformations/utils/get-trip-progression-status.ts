import { GymExerciseSet, SetProgressionStatus } from "../../../types";
import { StandardReducer } from "../../../types/common";
import { getSplicedStatuses } from "./get-spliced-statuses";

const initialProgressionStatuses: SetProgressionStatus[] = [];

export const reduceSetProgressionStatuses: StandardReducer<
  SetProgressionStatus[],
  GymExerciseSet
> = (
  currentStatuses,
  {
    progression
  }
) => {
  if (progression) return getSplicedStatuses(currentStatuses, progression.status);

  return currentStatuses;
};

export const getTripProgressionStatus = (
  sets: GymExerciseSet[]
): SetProgressionStatus | undefined => {
  const statuses: SetProgressionStatus[] = sets.reduce(
    reduceSetProgressionStatuses,
    initialProgressionStatuses
  );

  const statusesLength = statuses.length;

  // If we didn't get any statuses, it's because none of them had progression.
  if (statusesLength === 0) return undefined;

  const middleIDX = Math.floor(statusesLength / 2);
  const status = statuses[middleIDX];

  return status;
};
