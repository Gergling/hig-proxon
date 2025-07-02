// TODO: Comments are legit, but this file isn't done.

import { DTOProps, GymTripProps } from "../types";
import { getExercises } from "./get-exercises";
import { getGymData } from "./get-gym-data";

export const transformAll = (
  dtos: DTOProps
): {
  trips: GymTripProps[];
} => {
  const {
    // equipment,
    exercises,
    // muscleGroups,
  } = getExercises(dtos);

  // At this point, the gym trip data is view data, which we can store.
  const { gymTrips: trips } = getGymData(dtos);

  // TODO: Muscle groups will need exercises and sets assigned with relevant
  // gym trip dates. This doesn't need a complete breakdown of those objects.
  // Mostly we only really care about the set statuses, utilisation relevance
  // (e.g. whether the exercise for the set was focused or for stabilisation)
  // and dates.
  // So we can have a muscle group set object which will have a date,
  // utilisation and progression status. Also include set validity, JIC.

  // Once we have trip data and muscle group data, we can also assign
  // exercises, as these will be suggestible to supplement upcoming programs.

  // So we'll be able to see the muscle groups grouped by progression status
  // (lowest ranking to highest), then we can see which of those has the lowest
  // utilisation (probably use focus points separately, but then add in half
  // points for stabilisation). Then we can choose exercises from the top of
  // that list to the bottom in descending order of EMS.

  // View data will be a single file in multiple sections:
  // * trips
  // * muscle groups
  return {
    trips,
  };
};
