import { GymExerciseSet, GymExerciseSetProgression, SetStatus } from "../types";
import { getSetStatus } from "./get-set-status";
import { mockGymExercise, mockGymSetStrategy } from "./mock-data";

const mockSetBase: GymExerciseSet = {
  exercise: mockGymExercise,
  challenge: 2,
  reps: 10,
  strategy: mockGymSetStrategy,
};
const mockSetBaseProgression = {
  previous: mockSetBase,
  month: mockSetBase,
  all: mockSetBase,
};
mockSetBase.progression = mockSetBaseProgression;

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
  status: SetStatus;
  set: GymExerciseSet;
}[] = [
  {
    status: 'zero',
    set: { reps: 0 }
  },
  {
    status: 'invalid',
    set: { reps: 6 }
  },
  {
    status: 'first',
    set: {
      progression: undefined,
      reps: 7
    }
  },
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
    set: {
      ...mockSetHighChallenge,
      progression: {
        ...mockSetBaseProgression,
        all: mockSetHighChallenge,
      }
    },
  },
  {
    status: 'regrowth',
    set: {
      ...mockSetHighReps,
      progression: {
        ...mockSetBaseProgression,
        all: mockSetHighChallenge,
      }
    },
  },
  {
    status: 'uptick',
    set: {
      ...mockSetHighChallenge,
      progression: {
        ...mockSetBaseProgression,
        all: mockSetHighChallenge,
        month: mockSetHighChallenge,
      }
    },
  },
  {
    status: 'uptick',
    set: {
      ...mockSetHighReps,
      progression: {
        ...mockSetBaseProgression,
        all: mockSetHighChallenge,
        month: mockSetHighChallenge,
      }
    },
  },
  {
    status: 'steady',
    set: {
      progression: {
        ...mockSetBaseProgression,
        all: mockSetHighChallenge,
        month: mockSetHighChallenge,
      }
    },
  },
  {
    status: 'backslide',
    set: mockSetLowReps,
  },
].map(({ set, status }) => ({
  status: status as SetStatus,
  set: { ...mockSetBase, ...set }
}));

describe('getSetStatus', () => {
  it.each(mockData.map(({ set, status }) => [status, set]))('tests for status %p', (status, set) => {
    expect(getSetStatus(set)).toBe(status);
  });
});
