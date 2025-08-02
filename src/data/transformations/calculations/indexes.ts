import { Temporal } from "temporal-polyfill";
import { GymTripProps } from "../../../types";

export const getEMS0NTN = (
  exerciseFocusesOnMuscleGroup: boolean
) => exerciseFocusesOnMuscleGroup ? 1 : 0.5;

export const getMSI = ({
  muscleScore
}: GymTripProps) => Math.min(muscleScore / 5, 1);

export const getMAI = (
  previousGymSession7DaysTrips: GymTripProps[],
  trip: GymTripProps,
) => {
  const { visitDate } = trip;
  const date7DaysEarlier = visitDate.subtract({ days: 7 });
  const {
    msiSum,
    trips
  } = previousGymSession7DaysTrips.reduce(
    (
      reduced,
      comparisonTrip
    ) => {
      const { visitDate } = comparisonTrip;

      // If it's before the last 7 days, we drop it.
      if (Temporal.PlainDate.compare(visitDate, date7DaysEarlier) < 0) return reduced;

      // Otherwise we keep it.
      const msiSum = getMSI(comparisonTrip) + reduced.msiSum;
      return {
        ...reduced,
        trips: [...reduced.trips, comparisonTrip],
        msiSum,
      };
    }, {
      msiSum: 0,
      trips: [] as GymTripProps[]
    }
  );
  const msiTrip = getMSI(trip);
  const last7DaysTrips = [ ...trips, trip ];
  const totalSessionsFactor = Math.min(last7DaysTrips.length / 2, 1);
  const msiMean = (msiSum + msiTrip) / last7DaysTrips.length;
  const mai = msiMean * totalSessionsFactor;

  return {
    last7DaysTrips: [ ...trips, trip ],
    mai,
    msi: msiTrip,
  };
};