// TODO: Comments are legit, but this file isn't done.

import { DTOProps, GymTripProps, MuscleGroup } from "../../types";
import { getCurrentUtcInstant, instantToISOString } from "../../utils/time-helpers";
import { getNonCircularMuscleGroup, getNonCircularTrip } from "./cleaners";
import { getGymData } from "./get-gym-data";

export const transformAll = (
  dtos: DTOProps
): {
  lastUpdatedTime: string;
  muscleGroups: MuscleGroup[];
  trips: GymTripProps[];
} => {
  const {
    // TODO: Exercises by muscle group in the appropriate order.
    getMuscleGroups,
    gymTrips,
  } = getGymData(dtos);

  // For loading purposes, we remove the circular dependency from
  // muscleGroups -> activity[] -> exercise -> muscleGroups
  const muscleGroups = getMuscleGroups().map(getNonCircularMuscleGroup);
  const trips = gymTrips.map(getNonCircularTrip);

  const lastUpdatedTime = instantToISOString(getCurrentUtcInstant());

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
  // * overview(?)
  return {
    lastUpdatedTime,
    muscleGroups,
    trips,
  };
};
