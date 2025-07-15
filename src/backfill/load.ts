import { store } from "../data/load";
import { GymTripProps, MuscleGroup } from "../types";

export const load = async ({
  muscleGroups,
  trips,
}: {
  muscleGroups: MuscleGroup[];
  trips: GymTripProps[];
}) => {
  console.log('+++ Loading...');
  try {
    await store({
      muscleGroups,
      trips,
    });
  } catch (e) {
    console.error('! Loading failed:', e);
    throw e;
  }
};
