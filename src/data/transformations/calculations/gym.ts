import { Comparison, getComparisonFromNumber } from "../../../common/comparison";
import { getMappedOrderArray } from "../../../common/utils/get-mapped-order-array";
import { allSetProgressionStatuses } from "../../../constants/gym";
import { GymExerciseSetProgressionStatus } from "../../types/gym";

const ascendingProgressionStatuses: GymExerciseSetProgressionStatus[] = [
  'none',
  'first',
  ...[...allSetProgressionStatuses].reverse()
];
const ascendingStatusMapping = getMappedOrderArray(
  ascendingProgressionStatuses
);
export const getAscendingProgressionStatusComparison = (
  a: GymExerciseSetProgressionStatus,
  b: GymExerciseSetProgressionStatus,
): Comparison => {
  const idxA = ascendingStatusMapping[a];
  const idxB = ascendingStatusMapping[b];
  return getComparisonFromNumber(idxB - idxA);
};
