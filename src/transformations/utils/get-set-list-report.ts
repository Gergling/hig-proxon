import { GymExerciseSet, SetProgressionStatus } from "../../types";
import { getSplicedStatuses } from "./get-spliced-statuses";

export const getSetListReport = (sets: GymExerciseSet[]) => {
  // TODO: Consider a list of muscle groups, their progression statuses, active
  // exercise set counts and stability contributing set counts.
  const setsLength = sets.length;
  const {
    ems,
    statuses,
    totalValidSets,
  } = sets.reduce(({
    ems,
    statuses,
    totalValidSets,
  }, { exercise, progression, validity }) => {
    const exerciseEMS = exercise.ems0ntn;
    const updatedStatuses = progression
      ? getSplicedStatuses(statuses, progression.status)
      : statuses;

    return {
      ems: ems + exerciseEMS,
      statuses: updatedStatuses,
      totalValidSets: totalValidSets + (validity === 'valid' ? 1 : 0),
    };
  }, {
    ems: 0,
    statuses: [] as SetProgressionStatus[],
    totalValidSets: 0,
  });

  const statusesLength = statuses.length;
  const status = statusesLength > 0 ? statuses[Math.floor(statusesLength / 2)] : undefined;
  const tqi = setsLength > 0 ? totalValidSets / setsLength : 0;

  return {
    ems,
    status,
    tqi,
  };
};
