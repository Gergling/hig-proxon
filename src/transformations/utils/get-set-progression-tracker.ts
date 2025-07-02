import { Temporal } from "temporal-polyfill";
import { GymExerciseSet, ExerciseSetProgression } from "../../types";
import { getBestSet } from "./get-best-set";

type ProgressionWithDate = {
  progression: ExerciseSetProgression;
  tripDate: Temporal.PlainDate;
};

type ProgressionWithDateMapping = {
  [strategyExerciseKey: string]: ProgressionWithDate;
};
type SetMapping = {
  [strategyExerciseKey: string]: GymExerciseSet;
};

export const getSetProgressionTracker = () => {
  const progressions: ProgressionWithDateMapping = {};
  // TODO: Can this be a const?
  let currentTripSets: SetMapping = {};
  // let currentTripDate: Temporal.PlainDate;
  // TODO: For efficiency, what if we made a "trip mapping", which stores the
  // same mapping type, but just for this trip.
  // Instead of update we have "start", which provides a date.
  // When we run "start", anything in the trip mapping is used to override
  // the existing progression data.
  // When we override the month, we update the date with the current trip date.

  const getKey = ({ exercise, strategy }: GymExerciseSet) => `${exercise.id}-${strategy.id}`;
  const getProgressionWithDate = (key: string): ProgressionWithDate | undefined => {
    // const key = getKey(set);
    const mapping = progressions[key];
    if (mapping) return mapping;
  };
  const getCurrentTripSet = (key: string): GymExerciseSet | undefined => {
    const set = currentTripSets[key];
    if (set) return set;
  };

  const start = (tripDate: Temporal.PlainDate): void => {
    Object.entries(currentTripSets).forEach(([key, currentTripSet]) => {
      const mapping = getProgressionWithDate(key);
      const previous: GymExerciseSet = currentTripSet;

      if (!mapping) {
        progressions[key] = {
          progression: {
            all: currentTripSet,
            month: currentTripSet,
            previous,
          },
          tripDate,
        };
        return;
      }

      // The tripDate is the for gym trip we've started analysing, so we need to put this one away.
      // currentTripDate is the last trip date we were analysing, which means we need to update the progression.
      const date30DaysPriorToTrip = tripDate.subtract({ days: 30 });
      const isInDate = Temporal.PlainDate.compare(date30DaysPriorToTrip, mapping.tripDate) < 1;
      const { progression: existingProgression } = mapping;

      const all: GymExerciseSet = getBestSet(currentTripSet, existingProgression.all);
      const month: GymExerciseSet = isInDate ? getBestSet(currentTripSet, existingProgression.month) : currentTripSet;

      const isCurrentHighestMonthSet = month.id === currentTripSet.id;

      progressions[key] = {
        progression: {
          all,
          month,
          previous,
        },
        tripDate: isCurrentHighestMonthSet ? tripDate : mapping.tripDate,
      };
    });

    currentTripSets = {};
  };
  const addSet = (set: GymExerciseSet): ExerciseSetProgression | undefined => {
    const key = getKey(set);
    const mapping = getProgressionWithDate(key);

    // We ONLY put the set in the current trip sets, if it is better
    // than the one in there already for the exercise and strategy.
    const existingTripSet = getCurrentTripSet(key);
    const replacementSet = existingTripSet ? getBestSet(existingTripSet, set) : set;

    currentTripSets[key] = replacementSet;

    if (mapping) {
      return mapping.progression;
    }
  };

  // TODO: We should junk this or calculate it separately.
  const getTQI1 = () => {
    const sets = Object.values(currentTripSets);
    const validSets = sets.filter(({ validity }) => validity === 'valid');
    return validSets.length / sets.length;
  };

  return {
    addSet,
    getTQI1,
    start,
  }
};
