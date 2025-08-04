import { getMappedOrderArray } from "../../../common/utils/get-mapped-order-array";
import { allSetProgressionStatuses } from "../../../constants/gym";
import { SetProgressionStatus } from "../../../types";

const statusMapping = getMappedOrderArray(allSetProgressionStatuses);

export const getProgressionStatusComparison = (
  a: SetProgressionStatus,
  b: SetProgressionStatus,
) => {
  const idxA = statusMapping[a];
  const idxB = statusMapping[b];
  return idxB - idxA;
};
