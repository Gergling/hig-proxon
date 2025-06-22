import { GymTripProps } from "../api-types";
import { GymTripLogResponseDTO } from "../notion-sdk/dbs/gym-trip-log";

export const getGymTrip = (
  { properties: {
    gymSetIds,
    visitTime
  } }: GymTripLogResponseDTO
): GymTripProps => {
  // TODO: Will need to calculate the muscle group score manually. PITA but whatever.
  // gymSetIds.map()
  return {
    muscleScore: 0,
    sets: [],
    visitTime: visitTime?.start,
  }
};

