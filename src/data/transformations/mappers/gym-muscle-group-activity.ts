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
import { getComparisonFromNumber } from "../../../common/comparison";

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
): number => {
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

type MuscleGroupAggregationCoupling = {
  aggregation: MuscleGroupAggregation,
  muscleGroup: MuscleGroup,
};
export const getMuscleGroupsFromAggregation = (
  getMuscleGroupById: (id: string) => MuscleGroup | undefined,
  aggregations: MuscleGroupAggregation[]
): {
  priorityMuscleGroups: MuscleGroup[]
} => {
  const {
    priority
  } = aggregations.reduce(
    (
      state,
      aggregation
    ) => {
      const { muscleGroupId } = aggregation;
      const muscleGroup = getMuscleGroupById(muscleGroupId);

      // If we can't find the muscle group, we can't do anything with this anyway.
      if (!muscleGroup) return state;

      const priority = getSpliced(
        state.priority,
        {
          aggregation,
          muscleGroup,
        },
        (one, two) => getComparisonFromNumber(
          // The output would give us descending order of status then
          // activity, and we want ascending.
          -compareMuscleGroupAggregations(one.aggregation, two.aggregation)
        )
      );
      // Could use the status and activity score to put the relevant muscle group in
      // order in an appropriate place.
      return {
        priority
      };
    },
    {
      priority: [] as MuscleGroupAggregationCoupling[],
    }
  );

  // Map out muscle groups as a separate phase from whatever we put
  // together above.
  const priorityMuscleGroups = priority.map(
    ({ muscleGroup }) => muscleGroup
  );

  return {
    priorityMuscleGroups,
  };
};
