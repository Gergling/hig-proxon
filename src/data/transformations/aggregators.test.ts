import { Temporal } from "temporal-polyfill";
import { MuscleGroupSetActivity, SetProgressionStatus, SetValidityStatus } from "../../types";
import { getMostRecentDate } from "./aggregators";
import { mockGymExercise } from "../../gym-trips/mock-data";

// Helper function to create a mock Temporal.PlainDate
const createPlainDate = (
  isoDateString: string
) => Temporal.PlainDate.from(isoDateString);

const createMockMuscleGroupSetActivity = (
  options?: Partial<MuscleGroupSetActivity> & {
    status?: Partial<MuscleGroupSetActivity['status']>
  }
): MuscleGroupSetActivity => {
  const defaultDate = createPlainDate('2023-01-15');
  const defaultExercise = mockGymExercise;
  const defaultProgression: SetProgressionStatus = 'steady';
  const defaultValidity: SetValidityStatus = 'valid';

  return {
    date: options?.date || defaultDate,
    exercise: options?.exercise || defaultExercise,
    focus: options?.focus !== undefined ? options.focus : true, // Default to true if not specified
    status: {
      progression: options?.status?.progression || defaultProgression,
      validity: options?.status?.validity || defaultValidity,
    },
  };
};


describe('getMostRecentDate', () => {

  it('should return undefined for an empty activity array', () => {
    const activity: MuscleGroupSetActivity[] = [];
    expect(getMostRecentDate(activity)).toBeUndefined();
  });

  it('should return the date for a single activity in the array', () => {
    const singleActivity = createMockMuscleGroupSetActivity();
    const activity: MuscleGroupSetActivity[] = [singleActivity];
    expect(getMostRecentDate(activity)).toEqual(singleActivity.date);
  });

  it('should return the most recent date when it is the last in the array', () => {
    const date1 = createPlainDate('2023-01-15');
    const date2 = createPlainDate('2023-02-01');
    const date3 = createPlainDate('2023-03-10'); // Most recent
    const activity: MuscleGroupSetActivity[] = [
      createMockMuscleGroupSetActivity({ date: date1 }),
      createMockMuscleGroupSetActivity({ date: date2 }),
      createMockMuscleGroupSetActivity({ date: date3 }),
    ];
    expect(getMostRecentDate(activity)).toEqual(date3);
  });

  it('should return the most recent date when it is the first in the array', () => {
    const date1 = createPlainDate('2023-04-20'); // Most recent
    const date2 = createPlainDate('2023-02-01');
    const date3 = createPlainDate('2023-03-10');
    const activity: MuscleGroupSetActivity[] = [
      createMockMuscleGroupSetActivity({ date: date1 }),
      createMockMuscleGroupSetActivity({ date: date2 }),
      createMockMuscleGroupSetActivity({ date: date3 }),
    ];
    expect(getMostRecentDate(activity)).toEqual(date1);
  });

  it('should return the most recent date when it is in the middle of the array', () => {
    const date1 = createPlainDate('2023-01-15');
    const date2 = createPlainDate('2023-05-05'); // Most recent
    const date3 = createPlainDate('2023-03-10');
    const activity: MuscleGroupSetActivity[] = [
      createMockMuscleGroupSetActivity({ date: date1 }),
      createMockMuscleGroupSetActivity({ date: date2 }),
      createMockMuscleGroupSetActivity({ date: date3 }),
    ];
    expect(getMostRecentDate(activity)).toEqual(date2);
  });

  it('should handle dates with the same value correctly (return the first encountered or equivalent)', () => {
    const date1 = createPlainDate('2023-01-15');
    const date2 = createPlainDate('2023-02-01');
    const date3 = createPlainDate('2023-02-01'); // Same as date2
    const activity: MuscleGroupSetActivity[] = [
      createMockMuscleGroupSetActivity({ date: date1 }),
      createMockMuscleGroupSetActivity({ date: date2 }),
      createMockMuscleGroupSetActivity({ date: date3 }),
    ];
    // The reduce function's logic `if (Temporal.PlainDate.compare(mostRecent, date) > 0) return date;`
    // means it keeps the *later* date if they are equal. So if date2 and date3 are the same,
    // it will return date3 because compare(date2, date3) is 0, so it keeps date2.
    // Then compare(date2, date3) is 0, so it keeps date2.
    // Wait, `compare(mostRecent, date) > 0` means `mostRecent` is *later* than `date`.
    // If `mostRecent` is '2023-02-01' (date2) and `date` is '2023-02-01' (date3),
    // compare returns 0. So `0 > 0` is false. It returns `mostRecent` (date2).
    // So it should return date2.
    expect(getMostRecentDate(activity)).toEqual(date2);
  });

  it('should correctly identify the most recent among multiple dates', () => {
    const dates = [
      createPlainDate('2022-11-01'),
      createPlainDate('2023-07-20'),
      createPlainDate('2023-01-01'),
      createPlainDate('2023-07-19'),
      createPlainDate('2023-07-21'), // The most recent
      createPlainDate('2022-12-31'),
    ];
    const activity: MuscleGroupSetActivity[] = dates.map(date => createMockMuscleGroupSetActivity({ date }));
    expect(getMostRecentDate(activity)).toEqual(createPlainDate('2023-07-21'));
  });
});
