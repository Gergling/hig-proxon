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
import { MuscleGroupAggregation } from "../aggregators/types";
import { getMiddleItem } from "../../../utils/common-helpers";
import { getProgressionStatusComparison } from "../utils/get-progression-status-comparison";

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

export const compareMuscleGroupAggregations = (
  one: MuscleGroupAggregation,
  two: MuscleGroupAggregation,
) => {
  const statusOne = getMiddleItem(one.statuses);
  const statusTwo = getMiddleItem(two.statuses);
  // If the first argument is inferior, the output will be negative.
  // Undefined is always inferior.
  if (statusOne === undefined) return -1;
  if (statusTwo === undefined) return 1;
  const statusComparison = getProgressionStatusComparison(statusOne, statusTwo);
  // This will result in descending order of status, so best first.
  if (statusComparison !== 0) return statusComparison;

  // If the statuses are equal, compare the activity level.
  // If the first activity is inferior, the output will be negative.
  // This will result in descending order of activity.
  return one.activity - two.activity;
};

export const getMuscleGroupsWhatever = (
  getMuscleGroupById: (id: string) => MuscleGroup | undefined,
  aggregations: MuscleGroupAggregation[]
) => {
  aggregations.forEach(({
    activity,
    muscleGroupId,
    statuses,
  }) => {
    const muscleGroup = getMuscleGroupById(muscleGroupId);
    const status = getMiddleItem(statuses);
    // Could use the status and activity score to put the relevant muscle group in
    // order in an appropriate place.
  });
};
