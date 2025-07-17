import { mockGymExerciseSet } from "../../../gym-trips/mock-data";
import { GymExerciseSet } from "../../../types";
import { getBestSet } from "./get-best-set";

const mockSetZero: GymExerciseSet = {
  ...mockGymExerciseSet,
  reps: 0,
  validity: 'zero',
};
const mockSetInvalid: GymExerciseSet = {
  ...mockGymExerciseSet,
  reps: 6,
  validity: 'invalid',
};
const mockSetLowReps: GymExerciseSet = {
  ...mockGymExerciseSet,
  reps: 7,
  validity: 'valid',
};
const mockSetHighReps: GymExerciseSet = {
  ...mockSetLowReps,
  reps: 15,
};
const mockSetHighChallenge: GymExerciseSet = {
  ...mockSetLowReps,
  challenge: 3,
};

describe('getBestSet', () => {
  it('should return the set which is more valid, if they have varying levels of validity', () => {
    expect(getBestSet(mockSetZero, mockSetInvalid)).toBe(mockSetInvalid);
    expect(getBestSet(mockSetInvalid, mockSetZero)).toBe(mockSetInvalid);
    expect(getBestSet(mockSetZero, mockSetLowReps)).toBe(mockSetLowReps);
    expect(getBestSet(mockSetLowReps, mockSetZero)).toBe(mockSetLowReps);
    expect(getBestSet(mockSetInvalid, mockSetLowReps)).toBe(mockSetLowReps);
    expect(getBestSet(mockSetLowReps, mockSetInvalid)).toBe(mockSetLowReps);
  });
  it('should return the set which has reached a higher challenge, if they are both valid sets', () => {
    expect(getBestSet(mockSetHighReps, mockSetHighChallenge)).toBe(mockSetHighChallenge);
    expect(getBestSet(mockSetHighChallenge, mockSetHighReps)).toBe(mockSetHighChallenge);
  });
  it('should return the set which has reached a higher number of reps, if they are both valid and have the same challenge', () => {
    expect(getBestSet(mockSetLowReps, mockSetHighReps)).toBe(mockSetHighReps);
    expect(getBestSet(mockSetHighReps, mockSetLowReps)).toBe(mockSetHighReps);
  });
});
