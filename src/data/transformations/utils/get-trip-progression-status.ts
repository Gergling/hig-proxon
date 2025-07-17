import { GymExerciseSet, SetProgressionStatus } from "../../../types";
import { getSplicedStatuses } from "./get-spliced-statuses";

const initialProgressionStatuses: SetProgressionStatus[] = [];

export const getTripProgressionStatus = (
  sets: GymExerciseSet[]
): SetProgressionStatus | undefined => {
  const statuses: SetProgressionStatus[] = sets.reduce((currentStatuses, {
    progression
  }) => {
    if (progression) getSplicedStatuses(currentStatuses, progression.status);

    return currentStatuses;
  }, initialProgressionStatuses);

  const statusesLength = statuses.length;

  // If we didn't get any statuses, it's because none of them had progression.
  if (statusesLength === 0) return undefined;

  const middleIDX = Math.floor(statusesLength / 2);
  const status = statuses[middleIDX];

  return status;
};
