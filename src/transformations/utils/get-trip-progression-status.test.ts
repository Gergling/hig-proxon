import { mockGymExerciseSet } from "../../gym-trips/mock-data";
import { GymExerciseSet, SetProgressionStatus } from "../../types";
import { getTripProgressionStatus } from "./get-trip-progression-status";

const getMockSet = (status?: SetProgressionStatus): GymExerciseSet => {
  if (!status) return mockGymExerciseSet;

  return {
    ...mockGymExerciseSet,
    progression: {
      all: mockGymExerciseSet,
      month: mockGymExerciseSet,
      previous: mockGymExerciseSet,
      status,
    },
  }
};

describe('getTripProgressionStatus', () => {
  it('should return undefined if there are no progressions in the sets', () => {
    expect(getTripProgressionStatus([])).toBeUndefined();
    expect(getTripProgressionStatus([getMockSet()])).toBeUndefined();
    expect(getTripProgressionStatus([getMockSet(), getMockSet(), getMockSet()])).toBeUndefined();
  });
  it('should return the progression status shared by all sets if they are the same', () => {
    expect(getTripProgressionStatus([getMockSet('growth')])).toBe('growth');
    expect(getTripProgressionStatus([getMockSet('growth'), getMockSet('growth')])).toBe('growth');
    expect(getTripProgressionStatus([getMockSet('growth'), getMockSet('growth'), getMockSet('growth')])).toBe('growth');
  });
  it('should return the "middle" progression status if they are different', () => {
    expect(getTripProgressionStatus([
      getMockSet('uptick'),
      getMockSet('fluctuation'),
      getMockSet('steady'),
    ])).toBe('steady');
  });
  it('should return the "middle" progression status if they are varied', () => {
    expect(getTripProgressionStatus([
      getMockSet('uptick'),
      getMockSet('fluctuation'),
      getMockSet('steady'),
      getMockSet('steady'),
      getMockSet('uptick'),
    ])).toBe('steady');
  });
});