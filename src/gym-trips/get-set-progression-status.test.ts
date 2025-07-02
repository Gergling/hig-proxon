import { GymExerciseSet, ExerciseSetProgression, SetProgressionStatus } from "../types";
import { getSetProgressionStatus } from "./get-set-progression-status";
import { mockGymExercise, mockGymSetStrategy } from "./mock-data";

const mockSetBase: GymExerciseSet = {
  challenge: 2,
  exercise: mockGymExercise,
  id: '',
  units: 'Kg',
  reps: 10,
  strategy: mockGymSetStrategy,
  validity: 'valid',
};
const mockSetBaseProgression: ExerciseSetProgression = {
  previous: mockSetBase,
  month: mockSetBase,
  all: mockSetBase,
};

const mockSetLowChallenge: GymExerciseSet = {
  ...mockSetBase,
  challenge: 1,
};
const mockSetHighChallenge: GymExerciseSet = {
  ...mockSetBase,
  challenge: 3,
};
const mockSetLowReps: GymExerciseSet = {
  ...mockSetBase,
  reps: 9,
};
const mockSetHighReps: GymExerciseSet = {
  ...mockSetBase,
  reps: 11,
};


const mockData: {
  status: SetProgressionStatus;
  set: GymExerciseSet;
  progression: ExerciseSetProgression;
}[] = [
  {
    status: 'rehab',
    set: mockSetLowChallenge,
  },
  {
    status: 'fluctuation',
    set: {
      ...mockSetLowChallenge,
      reps: 11,
    }
  },
  {
    status: 'growth',
    set: mockSetHighChallenge,
  },
  {
    status: 'growth',
    set: mockSetHighReps,
  },
  {
    status: 'regrowth',
    set: mockSetHighChallenge,
    progression: {
      ...mockSetBaseProgression,
      all: mockSetHighChallenge,
    },
  },
  {
    status: 'regrowth',
    set: mockSetHighReps,
    progression: {
      ...mockSetBaseProgression,
      all: mockSetHighChallenge,
    },
  },
  {
    status: 'uptick',
    set: mockSetHighChallenge,
    progression: {
      ...mockSetBaseProgression,
      all: mockSetHighChallenge,
      month: mockSetHighChallenge,
    },
  },
  {
    status: 'uptick',
    set: mockSetHighReps,
    progression: {
      ...mockSetBaseProgression,
      all: mockSetHighChallenge,
      month: mockSetHighChallenge,
    },
  },
  {
    status: 'steady',
    progression: {
      ...mockSetBaseProgression,
      all: mockSetHighChallenge,
      month: mockSetHighChallenge,
    },
  },
  {
    status: 'backslide',
    set: mockSetLowReps,
  },
].map(({ set, status, ...props }) => ({
  progression: mockSetBaseProgression,
  ...props,
  status: status as SetProgressionStatus,
  set: { ...mockSetBase, ...set },
}));

describe('getSetProgressionStatus', () => {
  it.each(mockData.map(({
    set,
    status,
    progression,
  }) => [
    status,
    set,
    progression,
  ]))('tests for status %p', (status, set, progression) => {
    expect(getSetProgressionStatus(set, progression)).toBe(status);
  });
});
