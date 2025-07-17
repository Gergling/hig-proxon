import { GymExerciseSet } from "../../../types";
import { getSetValidityComparison } from "./get-set-validity-comparison";

export const getBestSet = (
  a: GymExerciseSet,
  b: GymExerciseSet
): GymExerciseSet => {
  // We *might* be comparing sets which aren't valid. If they are not equally
  // valid, we should return the one which is "more" valid, e.g. because it
  // has a rep rather than *no* reps.
  const validityComparison = getSetValidityComparison(a.validity, b.validity);

  if (validityComparison !== 0)
    return validityComparison < 0 ? b : a;

  // If both sets are of equal validity, regardless of what that level is,
  if (a.challenge > b.challenge) return a;
  if (a.challenge < b.challenge) return b;

  if (a.reps > b.reps) return a;
  if (a.reps < b.reps) return b;

  return a;
};
