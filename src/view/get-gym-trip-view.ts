import { getGymTrip } from "../gym-trips/get-gym-trip";
import { getExercises } from "../transformations";
import { DTOProps } from "../types/dtos";

export const getGymTripView = (dtos: DTOProps) => {
  const {
    equipment,
    exercises,
    muscleGroups,
    trips,
  } = dtos;

  // trips.map(getGymTrip);
  return {
    exercises: getExercises(equipment, exercises, muscleGroups),
  };
};
