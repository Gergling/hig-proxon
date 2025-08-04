import { Temporal } from "temporal-polyfill";
import { SetProgressionStatus, SetProgressionStatusFirst } from "../../../types";
import { getRecencyBiasedThresholds } from "../../../utils/time-helpers";
import { RecencyBiasCriteria } from "../../types/recency-bias";
import { getRecencyFactor } from "../calculations/get-recency-factor";
import { NormalisedGymSetMuscleGroup } from "../types/gym";
import { getEMS0NTN } from "../calculations/indexes";
import { getSplicedStatuses } from "../utils/get-spliced-statuses";
import { MuscleGroupAggregation } from "./types";

type AggregationConfig<T, U> = {
  getKey: (normalisedRow: NormalisedGymSetMuscleGroup) => string;
  reduce: (
    aggregation: T,
    normalisedRow: NormalisedGymSetMuscleGroup,
    supplemental: {
      key: string,
      operand: U;
    },
  ) => T;
};

const muscleGroupStatusRecencyBiasedCriteria: RecencyBiasCriteria[] = [
  { days: 7 },
  { days: 14 },
];
const muscleGroupStatusAggregation: AggregationConfig<{
  activity: number;
  statuses: (SetProgressionStatus | SetProgressionStatusFirst)[];
}, Temporal.PlainDate[]> = {
  getKey: ({ muscleGroup: { id } }) => id,
  reduce: (
    { activity, statuses },
    { date, focus, status: { progression } },
    { operand: thresholds },
  ) => {
    const recencyFactor = getRecencyFactor(date, thresholds) / thresholds.length;
    const emsFactor = getEMS0NTN(focus);
    return {
      activity,
      statuses: [
        ...statuses,
        progression
      ],
    };
  }
};

// To prioritise muscle groups, we need to know how good the progress
// has been. So we need the progression status. Ultimately the
// progression status would be in ascending order.
// If those are equal (e.g. first or even growth) we want
// to see activity level in ascending order. This requires the
// EMS calculation based on whether the set was focused on that
// exercise.

type MuscleGroupAggregationMapping = {
  [K: string]: MuscleGroupAggregation;
};

export const aggregateGymSetMuscleGroups = (
  normalisedGymSetMuscleGroups: NormalisedGymSetMuscleGroup[],
  mostRecentActivityDate: Temporal.PlainDate
): MuscleGroupAggregation[] => {
  const muscleGroupStatusRecencyBiasedThresholds = getRecencyBiasedThresholds(
    muscleGroupStatusRecencyBiasedCriteria,
    mostRecentActivityDate
  );
  const getRecency = (date: Temporal.PlainDate) =>
    (getRecencyFactor(date, muscleGroupStatusRecencyBiasedThresholds) + 1)
    / (muscleGroupStatusRecencyBiasedThresholds.length + 1);

  // Muscle group prioritisation:
  // Key is muscle group id and focus
  // Calculate recency-bias factor: 1 week, 2 weeks, other.
  // Calculate EMS factor (getEMS0NTN(focus) will do it)
  // In the next phase, loop the aggregations and get the middle status
  
  const aggregation = normalisedGymSetMuscleGroups.reduce((
    aggregations,
    { date, focus, muscleGroup: { id }, status: { progression } },
  ) => {
    const aggregation = aggregations[id] || {
      activity: 0,
      muscleGroupId: id,
      statuses: [],
    };
    const emsFactor = getEMS0NTN(focus);
    const recencyFactor = getRecency(date);
    const rowActivity = emsFactor * recencyFactor;
    const activity = rowActivity + aggregation.activity;
    const statuses = progression === 'first'
      ? aggregation.statuses
      : getSplicedStatuses(aggregation.statuses, progression);
    return {
      ...aggregations,
      [id]: {
        ...aggregation,
        activity,
        statuses,
      }
    };
  }, {} as MuscleGroupAggregationMapping);

  return Object.values(aggregation);
};

// IGNORE Favourite exercises, it's more easily done against the set
// level because you'd have to undo the counts increased by the normalised
// muscle groups.
  // Key is exercise id
  // Calculate recency-bias factor: 1 week, 2 weeks, 30 days, all-time
  // Frequency of exercise (count occurences)

// Notes about muscle group progression statuses:
// In theory the user has never trained a muscle group, or every
// set could be a first, so a muscle group could have a 'none'
// progression status.
