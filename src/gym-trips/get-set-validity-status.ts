import { SetValidityStatus } from "../types";

export const getSetValidityStatus = (
  reps: number,
  strategyMinimum: number,
): SetValidityStatus => {
  if (reps < 1) return 'zero';
  if (reps < strategyMinimum) return 'invalid';

  return 'valid';
};
