import { GymExerciseSet } from "../../../types";

export const getTQI1 = (sets: GymExerciseSet[]) => {
  if (sets.length === 0) return 0;

  const validSets = sets.filter(({ validity }) => validity === 'valid');
  return validSets.length / sets.length;
};
