import { SetValidityStatus } from "../../types";

const validities: SetValidityStatus[] = ['zero', 'invalid', 'valid'];
const getValidityIndex = (needle: SetValidityStatus): number =>
  validities.findIndex((validity) => needle === validity);

export const getSetValidityComparison = (
  a: SetValidityStatus,
  b: SetValidityStatus
) => {
  const idxA = getValidityIndex(a);
  const idxB = getValidityIndex(b);
  const comparison = idxA - idxB;
  if (comparison < 0) return -1;
  if (comparison > 0) return 1;
  return 0;
};
