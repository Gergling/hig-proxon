import { GymExerciseSet, SetProgressionStatus, SetStatus } from "../types";

type FollowingSet = Required<GymExerciseSet>;

const getSetProgressionStatus = (
  {
    challenge,
    progression: {
      previous,
      month,
      all,
    },
    reps,
  }: FollowingSet
): SetProgressionStatus => {
  // First we check the previous challenge level. If it fails, we
  // don't need to know much more.
  if (challenge < previous.challenge) {
    if (reps > previous.reps) return 'fluctuation';

    return 'rehab';
  }

  // We check for all-time growth.
  if (challenge > all.challenge) return 'growth';
  if (challenge === all.challenge && reps > all.reps) return 'growth';

  // We check for the last 30 days growth. 
  if (challenge > month.challenge) return 'regrowth';
  if (challenge === month.challenge && reps > month.reps) return 'regrowth';

  // We check the previous set. At this point, we know we aren't beating
  // the month or all-time sets.
  if (challenge > previous.challenge) return 'uptick';
  if (challenge === previous.challenge) {
    if (reps > previous.reps) return 'uptick';
    // TODO: If we ensured the month, all-time and previous sets were all
    // entirely different, we can figure out whether this is a steady
    // growth or stagnation.
    if (reps === previous.reps) return 'steady';
  }

  return 'backslide';
};

export const getSetStatus = (set: GymExerciseSet): SetStatus => {
  const {
    progression,
    reps,
    strategy: { minimum },
  } = set;
  if (reps < 1) return 'zero';
  if (reps < minimum) return 'invalid';
  if (!progression) return 'first';

  return getSetProgressionStatus({ ...set, progression });
};
