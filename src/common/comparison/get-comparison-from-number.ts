import { Comparison } from "./types";

export const getComparisonFromNumber = (comparisonNumber: number): Comparison => {
  if (comparisonNumber < 0) return -1;
  if (comparisonNumber > 0) return 1;
  return 0;
}
