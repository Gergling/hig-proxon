import { getSetProgressionStatus } from "../../gym-trips/get-set-progression-status";
import { ExerciseSetProgression, GymExerciseSet } from "../../types";

export const getSetWithProgression = (
  set: GymExerciseSet,
  progression: ExerciseSetProgression | undefined,
): GymExerciseSet => {
  if (!progression) return set;

  const status = getSetProgressionStatus(set, progression);

  return {
    ...set,
    progression: {
      ...progression,
      status,
    },
  };
};
