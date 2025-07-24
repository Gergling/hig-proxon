// The highest priority in the list is absolutely muscle groups which have never been used.
// This means we need to loop a complete set of muscle groups.
// That means if a muscle group has no activity, we need ALL the exercises for that muscle group so we can loop through them.

import { GymExercise, MuscleGroup, MuscleGroupExercise } from "../../../types";
import { Temporal } from "temporal-polyfill";
import { Equipment, MuscleGroupSetActivity, SetProgressionStatusFirst } from "../../../types";
import { StandardReducer } from "../../../types/common";
import { getRecencyFactor } from "../calculations/get-recency-factor";
import { ProposedProps, ViewAggregatedSetProgressionStatus, ViewExerciseBreakdown } from "../../types";
import { getMappedOrderArray } from "../../../common/utils/get-mapped-order-array";
import { allSetProgressionStatuses, orderProposedMapping } from "../../../constants/gym";
import { Comparison, getComparisonFromNumber, getOrder, Order, ORDER_VALUES } from "../../../common/comparison";
import { RecencyBiasCriteria } from "../../types/recency-bias";
import { getRecencyBiasedThresholds } from "../../../utils/time-helpers";
import { getSpliced } from "../../../common/utils/get-spliced";
import { reduceMapped } from "../../../common/utils/mapping";
import { Mapped } from "../../../common/types/mapping";
import { getMiddleItem } from "../../../utils/common-helpers";
import { GymExerciseSetProgressionStatus } from "../../types/gym";
import { getAscendingProgressionStatusComparison } from "../calculations/gym";
import { ExerciseSet, UniqueExerciseSets } from "../types/gym";
import { getMuscleGroupActivityThresholds, getMuscleGroupRecencyFactors } from "./gym-muscle-group-activity";

const reduceMuscleGroupExercise: StandardReducer<
  UniqueExerciseSets,
  MuscleGroupExercise
> = (
  uniqueExerciseSets,
  {
    exercise: {
      ems0ntn,
      equipment,
      id: exerciseId,
      name: exerciseName,
    },
    focus
  }
) => {
  const exercise = uniqueExerciseSets[exerciseId] || {
    progressionStatuses: [],
    recency: 0,
  };

  if (!focus) return uniqueExerciseSets;

  return {
    ...uniqueExerciseSets,
    [exerciseId]: {
      ...exercise,
      ems0ntn,
      equipment,
      exerciseId,
      exerciseName,
    }
  };
}

// From there, we have a list of muscle groups sorted by their activity level.

const reduceMuscleGroup: StandardReducer<
  {
    date7DaysPrior?: Temporal.PlainDate;
    thresholdDates?: Temporal.PlainDate[];
    uniqueExerciseSets: UniqueExerciseSets;
  },
  MuscleGroup
> = (
  reduction,
  muscleGroup,
) => {
  const {
    date7DaysPrior,
    thresholdDates,
    uniqueExerciseSets,
  } = reduction;
  const {
    activity,
    exercises,
  } = muscleGroup;

  const initialisedExerciseSets = exercises.reduce(reduceMuscleGroupExercise, uniqueExerciseSets);

  if (activity.length === 0 || !date7DaysPrior || !thresholdDates) {
    return {
      ...reduction,
      uniqueExerciseSets: initialisedExerciseSets,
    };
  }

  const updatedUniqueExerciseSets = getMuscleGroupRecencyFactors(
    muscleGroup,
    date7DaysPrior,
    thresholdDates,
    initialisedExerciseSets,
  );

  return {
    ...reduction,
    uniqueExerciseSets: updatedUniqueExerciseSets,
  }
};

const getUniqueExerciseSets = (
  mostRecentActivityDate: Temporal.PlainDate | undefined,
  muscleGroups: MuscleGroup[],
): UniqueExerciseSets => {
  const initialUniqueExerciseSets: UniqueExerciseSets = {};

  if (!mostRecentActivityDate) {
    const {
      uniqueExerciseSets,
    } = muscleGroups.reduce(reduceMuscleGroup, {
      uniqueExerciseSets: initialUniqueExerciseSets
    });

    return uniqueExerciseSets;
  }

  const thresholdDates = getMuscleGroupActivityThresholds(
    mostRecentActivityDate
  );
  const [date7DaysPrior] = thresholdDates.slice(0, -1);

  const {
    uniqueExerciseSets
  } = muscleGroups.reduce(
    reduceMuscleGroup,
    {
      date7DaysPrior,
      thresholdDates,
      uniqueExerciseSets: {} as UniqueExerciseSets,
    }
  );

  return uniqueExerciseSets;
};

const reduceFavourites: StandardReducer<
  {
    favourites: string[];
    mappedFavourites: Mapped<GymExercise>;
  },
  GymExercise
> = (
  reduction,
  exercise,
) => {
  const { mapped: mappedFavourites } = reduceMapped({
    getKey: ({ id }) => id,
    mapped: reduction.mappedFavourites
  }, exercise);
  const favourites = [
    ...reduction.favourites,
    exercise.name
  ];

  return {
    favourites,
    mappedFavourites,
  }
}

const getExerciseSetProgressionStatus = (
  statuses: GymExerciseSetProgressionStatus[]
): GymExerciseSetProgressionStatus => getMiddleItem(statuses) || 'none';

const compareExerciseSetsFactory = (
  order: 'asc' | 'desc',
) => {
  const isFirstThenSecond = getOrder(order);
  return (
    one: ExerciseSet,
    two: ExerciseSet,
  ): Comparison => {
    // 1. Recency (asc). We want the least recent at the top.
    if (one.recency < two.recency) return -1;
    if (one.recency > two.recency) return 1;

    // 2. Status (asc). We want the lowest progress at the top.
    const statusOne = getExerciseSetProgressionStatus(one.progressionStatuses);
    const statusTwo = getExerciseSetProgressionStatus(two.progressionStatuses);
    const statusComparison = getAscendingProgressionStatusComparison(statusOne, statusTwo);
    if (statusComparison !== 0) return statusComparison;

    // 3. EMS (both). For priority we want the better exercises at the top,
    // and for supplemental, we want the easier exercises at the top.
    if (one.ems0ntn < two.ems0ntn) return isFirstThenSecond(true);
    if (one.ems0ntn > two.ems0ntn) return isFirstThenSecond(false);
    return 0;
  };
};

const reduceSortedExerciseSets: StandardReducer<
  {
    exercises: ExerciseSet[],
    proposed: ProposedProps,
  },
  Order
> = (
  {
    exercises,
    proposed,
  },
  orderKey,
): {
  exercises: ExerciseSet[];
  proposed: ProposedProps;
} => {
  const proposedKey = orderProposedMapping[orderKey];
  const compareExerciseSets = compareExerciseSetsFactory(orderKey);
  const sortedExercises = exercises.sort(compareExerciseSets);
  return {
    exercises,
    proposed: {
      ...proposed,
      [proposedKey]: sortedExercises,
    },
  }
};

export const getExerciseBreakdown = (
  favouriteExercises: GymExercise[],
  mostRecentActivityDate: Temporal.PlainDate | undefined,
  muscleGroups: MuscleGroup[],
): ViewExerciseBreakdown => {
  // Prepare the favourites.
  const {
    favourites,
    mappedFavourites,
  } = favouriteExercises.reduce(reduceFavourites, { favourites: [], mappedFavourites: {} });

  // 1. Enrich based on activity.
  const uniqueExerciseSets = getUniqueExerciseSets(
    mostRecentActivityDate,
    muscleGroups
  );
  const exercises = Object.values(uniqueExerciseSets);

  // TODO: We haven't removed the favourite exercises from the proposed.
  // We will need the mappedFavourites for this.

  // 2. Sort.
  const {
    proposed,
  } = ORDER_VALUES.reduce(
    reduceSortedExerciseSets,
    { exercises, proposed: {} as ProposedProps }
  );

  return {
    favourites,
    proposed,
  };
};
