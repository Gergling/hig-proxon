// import { Temporal } from "temporal-polyfill";
// import { Equipment, MuscleGroupSetActivity, SetProgressionStatus, SetProgressionStatusFirst } from "../../../types";
// import { StandardReducer } from "../../../types/common";
// import { getRecencyFactor } from "../calculations/get-recency-factor";

// type ProgressionStatus = SetProgressionStatus | SetProgressionStatusFirst;
// type ExerciseSet = {
//   ems0ntn: number;
//   equipment: Equipment[];
//   exerciseId: string;
//   exerciseName: string;
//   focusMuscleGroupActivity: number;
//   progressionStatus: ProgressionStatus;
// };
// type UniqueExerciseSets = {
//   [exerciseId: string]: ExerciseSet;
// };

// export const reduceUniqueExerciseSets: StandardReducer<
//   {
//     thresholdDates: Temporal.PlainDate[];
//     uniqueExerciseSets: UniqueExerciseSets;
//   },
//   MuscleGroupSetActivity
// > = (
//   reduction,
//   {
//     date,
//     exercise: {
//       ems0ntn,
//       equipment,
//       id: exerciseId,
//       name: exerciseName,
//     },
//     focus,
//     status: {
//       progression: progressionStatus,
//       validity,
//     },
//   }
// ) => {
//   // We can skip invalid activity.
//   // TODO: Logging invalid exercise sets where the set strategy
//   // doesn't have a valid set on the same date may have uses.
//   if (validity !== 'valid') return reduction;

//   const {
//     thresholdDates,
//     uniqueExerciseSets
//   } = reduction;

//   // This calculates how useful the information is.
//   const recencyFactor = getRecencyFactor(date, thresholdDates);

//   // We can skip this activity if it didn't happen in the time period.
//   // TODO: THIS IS WRONG.
//   // If the muscle group wasn't engaged recently, it's MORE important to engage it.
//   if (recencyFactor === 0) return reduction;

//   const {
//     focusMuscleGroupActivity,
//   } = uniqueExerciseSets[exerciseId];

//   // Factor based on the focus on this muscle group
//   const addedMuscleGroupEMS = focus ? 1 : 0;

//   // TODO: Use recencyFactor somehow. Currently we just have 2 weeks of
//   // activity. Perhaps we can calculate against the focus factor.
//   // We *should* calculate against the status somehow though... or should
//   // we?
//   return {
//     thresholdDates,
//     uniqueExerciseSets: {
//       ...uniqueExerciseSets,
//       [exerciseId]: {
//         // This is what we're going to be sorting against first (ascending).
//         progressionStatus,

//         focusMuscleGroupActivity,
  
//         // TODO: Split the activity count (cos we want to sort ascending) against the focus (we want a total factor sorted descending).
//         // We should be using focus exercises for muscle groups where the acivity is low... so... what?
//         // This is what we're going to be sorting against second (ascending).
//         muscleGroupEMS: focusMuscleGroupActivity + addedMuscleGroupEMS,
  
//         // This is what we're sorting against to generate the priority and
//         // supplemental lists.
//         ems0ntn,
//         exerciseName,
//         exerciseId,
//         equipment,
//       },
//     },
//   };
// };
