import { GymExercise, GymExerciseSet, GymTripProps, MuscleGroup } from "../../../types";

const getNonCircularExercise = (
  exercise: GymExercise
): GymExercise => ({
  ...exercise,
  muscleGroups: [],
});

const getNonCircularSet = ({
  exercise,
  progression,
  ...set
}: GymExerciseSet): GymExerciseSet => ({
  ...set,
  exercise: getNonCircularExercise(exercise),
  progression: progression
    ? {
      all: getNonCircularSet(progression.all),
      month: getNonCircularSet(progression.month),
      previous: getNonCircularSet(progression.previous),
      status: progression.status,
    }
    : undefined,
});

export const getNonCircularMuscleGroup = ({
  activity,
  ...muscleGroup
}: MuscleGroup) => ({
  ...muscleGroup,
  activity: activity.map(({ exercise, ...activity }) => ({
    ...activity,
    exercise: getNonCircularExercise(exercise),
  }))
});

export const getNonCircularTrip = ({
  sets,
  ...trip
}: GymTripProps) => ({
  ...trip,
  sets: sets.map(getNonCircularSet)
});
