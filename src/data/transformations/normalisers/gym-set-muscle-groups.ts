import { Temporal } from "temporal-polyfill";
import { Equipment, GymTripProps, SetProgressionStatus, SetProgressionStatusFirst, SetValidityStatus } from "../../../types";
import { NormalisedGymSetMuscleGroup } from "../types/gym";

export const normaliseGymSetMuscleGroups = (
  trips: GymTripProps[],
  earliestTripDateFilter: Temporal.PlainDate,
): NormalisedGymSetMuscleGroup[] => {
  const normalised: NormalisedGymSetMuscleGroup[] = [];

  trips.forEach(({ sets, visitDate: date, ...trip }) => {
    // If visitDate is AFTER the earliestTripDateFilter, we proceed.
    if (Temporal.PlainDate.compare(earliestTripDateFilter, date) < 1) return;

    sets.forEach(({
      exercise: {
        equipment,
        muscleGroups,
        ...exercise
      },
      progression,
      validity,
      ...set
    }) => {
      muscleGroups.forEach(({ focus, muscleGroup: { id, name } }) => {
        normalised.push({
          date,
          equipment,
          exercise: { id: exercise.id, name: exercise.name },
          focus,
          muscleGroup: { id, name },
          status: {
            // We will assume this is the first status for the
            // exercise/strategy for now.
            progression: progression?.status || 'first',
            validity,
          },
        });
      });
    });
  });

  return normalised;
};
