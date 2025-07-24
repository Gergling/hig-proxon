import { Temporal } from "temporal-polyfill";
import { GymExercise, GymTripProps, MuscleGroup, MuscleGroupSetActivity } from "../../types";
import { View, ViewMuscleGroup } from "../types";
import { getViewMuscleGroup, getViewVisit } from "./mappers";
import { getMiddleItem } from "../../utils/common-helpers";
import { RecencyBiasCriteria, RecencyBiasedValues, RecencyBiasKeys } from "../types/recency-bias";
import { getRecencyBiasedThresholds, runDateCallback } from "../../utils/time-helpers";

// export const getAggregatedVisits = (
//   trips: GymTripProps[]
// ): View => {
//   trips.reduce(
//     () => {
//       getViewVisit
//     },

//   );

//   return {

//   };
// };

export const getMostRecentDate = (
  activity: MuscleGroupSetActivity[],
) => activity.reduce(
  (
    mostRecent,
    { date }
  ) => {
    if (!mostRecent) return date;
    if (Temporal.PlainDate.compare(mostRecent, date) > 0) return date;
    return mostRecent;
  },
  undefined as Temporal.PlainDate | undefined
);

// Belongs to getFavouriteExercises
type ExerciseData = {
  [id in GymExercise['id']]: {
    dates: Temporal.PlainDate[];
    exercise: GymExercise;
  };
}

const reduceMuscleGroupActivity = (
  aggregation: {
    exerciseData: ExerciseData,
    mostRecentDate: Temporal.PlainDate | undefined
  },
  activity: MuscleGroupSetActivity,
) => {
  const mostRecentDate
    = aggregation.mostRecentDate
    && Temporal.PlainDate.compare(activity.date, aggregation.mostRecentDate) > 0
    ? aggregation.mostRecentDate
    : activity.date;

  const aggregationExerciseDataItem = aggregation.exerciseData[activity.exercise.id] || {};
  const exerciseDataItem = {
    ...aggregationExerciseDataItem,
    dates: [
      ...(aggregationExerciseDataItem.dates || []),
      activity.date,
    ],
    exercise: activity.exercise,
  };
  const exerciseData = {
    ...aggregation.exerciseData,
    [exerciseDataItem.exercise.id]: exerciseDataItem,
  };

  return {
    exerciseData,
    mostRecentDate,
  };
};

// const getAggregatedMuscleGroupVisits = (
//   activity: MuscleGroupSetActivity[],
// ) => activity.reduce(
//   reduceMuscleGroupActivity,
//   {
//     exerciseData: {} as ExerciseData,
//     mostRecentDate: undefined as Temporal.PlainDate | undefined
//   }
// );

export const getRecencyBiasedWeekdays = (
  dates: Temporal.PlainDate[],
  thresholdDates: Temporal.PlainDate[],
) => {
  const recencyBiasedWeekDays = dates.reduce(
    (
      recencyBiasedWeekDays,
      date
    ) => {
      const { dayOfWeek } = date;

      // Add the day of week to the all-time array.
      recencyBiasedWeekDays.allTime.push(dayOfWeek);

      // Add teh day of week to the threshold date array.
      runDateCallback(thresholdDates, date, (thresholdDate) => {
        if (!recencyBiasedWeekDays[thresholdDate.toString()]) {
          recencyBiasedWeekDays[thresholdDate.toString()] = [];
        }
        recencyBiasedWeekDays[thresholdDate.toString()].push(dayOfWeek);
      });

      return recencyBiasedWeekDays;
    },
    {
      allTime: [],
    } as RecencyBiasedValues
  );

  const medianDaysOfWeek = Object
    .values(recencyBiasedWeekDays)
    .map((daysOfWeek) => getMiddleItem(daysOfWeek.sort()));
  const medianDayOfWeek = getMiddleItem(medianDaysOfWeek.sort());

  return medianDayOfWeek;
};

// export const getFavouriteExercises = (
//   activity: MuscleGroupSetActivity[],
// ) => {
//   const {
//     exerciseData,
//     mostRecentDate,
//   } = getAggregatedMuscleGroupVisits(activity);

//   // I want median day of the week for all activity across these
//   // durations, and including all-time. This will require the most
//   // recent date first. So we'll loop through all activity (which
//   // will have a date and a day of the week for each) and
//   // categorise against the recency by using the most recent date
//   // to calculate the threshold date. Everything after the threshold
//   // date counts towards that category.
//   // Probably items should be processed in order of threshold date
//   // since we don't need it anymore once it goes beyond that date.
//   const recencyCriteria: RecencyBiasCriteria[] = [
//     { days: 7 },
//     { days: 14 },
//     { days: 30 },
//     { months: 2 },
//     { months: 3 },
//   ];
//   // Probably if we're just getting and putting dates, this whole thing can go into date helpers. Here's hoping.
//   if (mostRecentDate) {
//     const thresholdDates = getRecencyBiasedThresholds(recencyCriteria, mostRecentDate);
//     const exercises = Object
//       .values(exerciseData)
//       .map(({
//         dates,
//         ...exerciseDataItem
//       }) => {
//         const medianDayOfWeek = getRecencyBiasedWeekdays(dates, thresholdDates);

//         return {
//           ...exerciseDataItem,
//           medianDayOfWeek,
//         };
//       })
//       .sort((one, two) => {
//         if (one.medianDayOfWeek === undefined) return 1;
//         if (two.medianDayOfWeek === undefined || one.medianDayOfWeek < two.medianDayOfWeek) return -1;
//         if (one.medianDayOfWeek > two.medianDayOfWeek) return 1;
//         return 0;
//       })
//       .map(({ exercise }) => exercise);
    
//     return {
//       exercises,
//       mostRecentDate,
//     };
//   }

//   return {
//     exercises: undefined,
//     mostRecentDate: undefined,
//   };
// };
