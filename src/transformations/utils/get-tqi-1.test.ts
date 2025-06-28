import { mockGymExerciseSet } from "../../gym-trips/mock-data";
import { GymExerciseSet } from "../../types";
import { getTQI1 } from "./get-tqi-1";

const mockZeroSet: GymExerciseSet = {
  ...mockGymExerciseSet,
  validity: 'zero',
};
const mockInvalidSet: GymExerciseSet = {
  ...mockGymExerciseSet,
  validity: 'invalid',
};
const mockValidSet: GymExerciseSet = {
  ...mockGymExerciseSet,
  validity: 'valid',
};

describe('getTQI1', () => {
  it('should return 0 if there are no sets', () => {
    expect(getTQI1([])).toBe(0);
  });
  it('should return 0 if there are no valid sets', () => {
    expect(getTQI1([mockZeroSet])).toBe(0);
    expect(getTQI1([mockInvalidSet])).toBe(0);
    expect(getTQI1([mockZeroSet, mockZeroSet, mockZeroSet])).toBe(0);
    expect(getTQI1([mockZeroSet, mockInvalidSet, mockZeroSet])).toBe(0);
  });
  it('should return 1 if all sets are valid', () => {
    expect(getTQI1([mockValidSet])).toBe(1);
    expect(getTQI1([mockValidSet, mockValidSet, mockValidSet])).toBe(1);
  });
  it('should return 0.5 if half the sets are valid', () => {
    expect(getTQI1([mockZeroSet, mockValidSet])).toBe(0.5);
    expect(getTQI1([mockZeroSet, mockInvalidSet, mockValidSet, mockValidSet])).toBe(0.5);
  });
});
