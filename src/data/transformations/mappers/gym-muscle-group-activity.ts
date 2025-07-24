// Let's sort by activity FIRST. Activity can be in 4 levels:
// * Never.
// * More than 2 weeks ago.
// * More than a week ago.

import { Temporal } from "temporal-polyfill";
import { MuscleGroup, MuscleGroupSetActivity } from "../../../types";
import { RecencyBiasCriteria } from "../../types/recency-bias";
import { StandardReducer } from "../../../types/common";
import { UniqueExerciseSets } from "../types/gym";
import { getRecencyFactor } from "../calculations/get-recency-factor";
import { getSpliced } from "../../../common/utils/get-spliced";
import { GymExerciseSetProgressionStatus } from "../../types/gym";
import { getAscendingProgressionStatusComparison } from "../calculations/gym";
import { getRecencyBiasedThresholds } from "../../../utils/time-helpers";

// * In the last week.
const activityDateThresholds: RecencyBiasCriteria[] = [
  { days: 7 },
  { days: 14 },
];
export const getMuscleGroupActivityThresholds = (
  mostRecentActivityDate: Temporal.PlainDate,
) => getRecencyBiasedThresholds(
  activityDateThresholds,
  mostRecentActivityDate
);
const reduceRecencyFactors: StandardReducer<
  {
    date7DaysPrior: Temporal.PlainDate;
    thresholdDates: Temporal.PlainDate[];
    uniqueExerciseSets: UniqueExerciseSets;
  },
  MuscleGroupSetActivity
> = (
  reduction,
  {
    date,
    exercise: {
      ems0ntn,
      equipment,
      id: exerciseId,
      name: exerciseName,
    },
    status: {
      progression: status,
    },
  }
) => {
  const {
    date7DaysPrior,
    thresholdDates,
    uniqueExerciseSets,
  } = reduction;
  const exerciseSet = uniqueExerciseSets[exerciseId] || {
    ems0ntn,
    equipment,
    exerciseId,
    exerciseName,
    progressionStatuses: [],
    recency: 0,
  };

  const recency = Math.min(
    exerciseSet.recency,
    getRecencyFactor(date, thresholdDates)
  );

  if (Temporal.PlainDate.compare(date7DaysPrior, date) > 0) return {
    ...reduction,
    uniqueExerciseSets: {
      [exerciseId]: {
        ...exerciseSet,
        recency,
      },
    },
  };

  const progressionStatuses = getSpliced<GymExerciseSetProgressionStatus>(
    exerciseSet.progressionStatuses,
    status,
    getAscendingProgressionStatusComparison,
  );

  return {
    ...reduction,
    uniqueExerciseSets: {
      [exerciseId]: {
        ...exerciseSet,
        progressionStatuses,
        recency,
      },
    },
  }
};

export const getMuscleGroupRecencyFactors = (
  {
    activity,
  }: MuscleGroup,
  date7DaysPrior: Temporal.PlainDate,
  thresholdDates: Temporal.PlainDate[],
  initialUniqueExerciseSets: UniqueExerciseSets,
): UniqueExerciseSets => {
  if (activity.length === 0) return initialUniqueExerciseSets;
  const {
    uniqueExerciseSets,
  } = activity.reduce(reduceRecencyFactors, {
    date7DaysPrior,
    thresholdDates,
    uniqueExerciseSets: initialUniqueExerciseSets,
  });
  return uniqueExerciseSets;
};
