import { mockGymExerciseSet } from "../../../gym-trips/mock-data";
import { GymExerciseSet, SetProgressionStatus } from "../../../types";
import { getTripProgressionStatus, reduceSetProgressionStatuses } from "./get-trip-progression-status";

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

describe('reduceSetProgressionStatuses', () => {
  it('should insert the set progression status in the correct location in order if the set has progression', () => {
    const initialStatuses: SetProgressionStatus[] = ['growth', 'rehab'];
    const exerciseSet: GymExerciseSet = getMockSet('regrowth');

    const result = reduceSetProgressionStatuses(initialStatuses, exerciseSet);

    expect(result).toEqual(['growth', 'regrowth', 'rehab']);
  });

  it('should return the same statuses if the set has no progression status', () => {
    const initialStatuses: SetProgressionStatus[] = ['growth', 'rehab'];
    const exerciseSet: GymExerciseSet = getMockSet();

    const result = reduceSetProgressionStatuses(initialStatuses, exerciseSet);

    expect(result).toEqual(initialStatuses);
  });
});

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