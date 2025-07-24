// Ascending by status (lowest to highest status)
// Descending by focus (primary then stabilisation)
// This is our array of exercises. We may as well sort
// by EMS later.

import { Comparison, getOrder } from "../../../common/comparison";
import { GymExercise } from "../../../types";

export const compareExercisesByEMSFactory = (
  order: 'asc' | 'desc',
) => (
  one: GymExercise,
  two: GymExercise,
): Comparison => {
  const isFirstThenSecond = getOrder(order);
  if (one.ems0ntn < two.ems0ntn) return isFirstThenSecond(true);
  if (one.ems0ntn > two.ems0ntn) return isFirstThenSecond(false);
  return 0;
};
