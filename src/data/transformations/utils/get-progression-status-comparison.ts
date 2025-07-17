import { SetProgressionStatus } from "../../../types";

const statuses: SetProgressionStatus[] = [
  'growth',
  'regrowth',
  'uptick',
  'steady',
  'fluctuation',
  'backslide',
  'rehab',
];

const statusMapping = statuses.reduce((mapping, status, idx) => ({
  ...mapping,
  [status]: idx,
}), {} as { [idx in SetProgressionStatus]: number; });

export const getProgressionStatusComparison = (
  a: SetProgressionStatus,
  b: SetProgressionStatus,
) => {
  const idxA = statusMapping[a];
  const idxB = statusMapping[b];
  return idxB - idxA;
};
