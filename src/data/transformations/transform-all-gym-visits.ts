import { DTOProps, SetProgressionStatus } from "../../types";
import { getMiddleItem } from "../../utils/common-helpers";
import { getCurrentUtcInstant, instantToISOString } from "../../utils/time-helpers";
import { View, ViewAggregatedSetProgressionStatus, ViewExerciseBreakdown, ViewProcess, ViewVisit } from "../types";
import { getLast7DaysActivity, getMonthlyActivity, reduceLast7DaysTrips } from "./aggregators/activity";
import { getViewMuscleGroups } from "./enrichers";
import { getGymData } from "./get-gym-data";
import { normaliseGymSetMuscleGroups } from "./normalisers/gym-set-muscle-groups";

export const transformAll = (
  dtos: DTOProps
): View => {
  const {
    getExerciseBreakdown,
    getFavouriteExercises,
    getMostRecentActivityDate,
    getMuscleGroups,
    gymTrips,
  } = getGymData(dtos);
  const mostRecentActivityDate = getMostRecentActivityDate();

  // REFORMATION
  // In which we just normalise first.
  // if (mostRecentActivityDate) {
  //   const activityDate90DaysBeforeMostRecent = mostRecentActivityDate?.subtract({ days: 90 });
  //   const normalisedGymSetMuscleGroups = normaliseGymSetMuscleGroups(
  //     gymTrips,
  //     activityDate90DaysBeforeMostRecent
  //   );
  // }

  // Then we aggregate.
  const monthlyActivity = getMonthlyActivity(gymTrips);

  // END REFORMATION

  const muscleGroups = getMuscleGroups();
  const {
    ems0ntn,
    muscles,
  } = getViewMuscleGroups(muscleGroups, mostRecentActivityDate);

  const {
    status,
    visits,
  } = getLast7DaysActivity(gymTrips, mostRecentActivityDate);


  const favourites = getFavouriteExercises().map(({ name }) => name);
  // TODO: Priority/supplemental exercises need to be found based on the
  // muscle group activity. Will need to sort by ascending muscle group
  // activity, but because priority exercises have more muscle groups,
  // the activity level will appear higher. It would be best divided by
  // the exercise EMS.

  // TODO: NON-OPTIMAL AS IT IS, THIS PART HAS TO BE DONE AFTER GETTING
  // getGymData because we need the most recent date to have been
  // calculated.
  // At least that means no more fucking around.
  // We can get the data out of getViewMuscleGroups if necessary.
  muscleGroups.forEach((muscleGroup) => {
    // TODO: We need to calculate at the muscle group level anyway.
    // But we can still stack up the data for the exercise calculation.
    muscleGroup.activity.forEach(({
      date,
      exercise: {
        ems0ntn,
        equipment,
        id,
        name,
        ...exercise
      },
      focus,
      ...activity
    }) => {
      // Muscle groups. This data should exist already having been
      // added in the lookup.
      // We are looking for *neglected* muscle groups, and by
      // extension, suitable exercises.
      // We want a score which essentially shows muscle engagement.
      // Recency should be a factor because the longer ago it was
      // done, the less engaged it has been.
      // If it has been engaged, and focus is set, it's been more
      // engaged.
      // Lower status muscle groups will need more attention, as 
      // they are showing less progression.
      // The overall status of a muscle group should be based on the
      // minimum number of statuses against a muscle group + 1.
      // Low statuses get priority.
      // If statuses are the same, EMS is lower priority.

      // Exercises. This data has not been fully prepared yet.
      // Some muscle groups will have been engaged with many other
      // muscles as part of a higher scoring exercise. I'm not sure
      // how that affects things.
      // When proposing exercises, the focus ones for the muscle group
      // should be prioritised. Subsequently, the ones which score
      // against the flagging muscle groups should score more highly.
      // IDK how to make that rating work, but I assume it will be
      // sorted by the "median" of the list of muscle group statuses
      // (ascending), followed by the "median" focus flag from a list
      // of the muscle group focuses (descending), followed by the
      // exercise EMS (descending) IF we want to see the priority
      // proposed, but we'll also want to see (ascending) EMS for
      // supplemental.

      // TODO: If the muscle group has been engaged in the last 7 days, recency-factor is 1.
      // TODO: If the muscle group has been engaged in the last 14 days, recency-factor is 0.5.
      // const recencyFactor = date > 7 days && date <= 14 ...
      // TODO: The focus weighting applies: 0.5 or 1.
      const focusFactor = focus ? 1 : 0.5;
    });
  });

  // Metadata
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

  // View Structuring.
  const exercise: ViewExerciseBreakdown = getExerciseBreakdown();
  const process: ViewProcess = {
    ems0ntn,
    status,
    visits,
  };
  // View data will be a single file in multiple sections:
  // * trips
  // * muscle groups
  // * overview(?)
  return {
    lastUpdatedTime,
    // muscleGroups,
    // trips,

    exercise,
    monthlyActivity,
    muscles,
    process,
  };
};
