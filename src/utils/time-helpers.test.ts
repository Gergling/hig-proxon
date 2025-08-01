import { Temporal } from "temporal-polyfill";
import { RecencyBiasCriteria } from "../data/types/recency-bias";
import { getRecencyBiasedThresholds } from "./time-helpers";

describe('getRecencyBiasedThresholds', () => {
  const benchmarkDate = Temporal.PlainDate.from('2024-07-25');

  it('should correctly calculate and sort thresholds for a simple set of criteria', () => {
    const criteria: RecencyBiasCriteria[] = [
        { weeks: 2 },
        { days: 10 },
        { months: 1 },
    ];

    const expectedThresholds = [
        Temporal.PlainDate.from('2024-06-25'), // 1 month before
        Temporal.PlainDate.from('2024-07-05'), // 20 days before (1 month is 30 days)
        Temporal.PlainDate.from('2024-07-15'), // 10 days before
    ];

    const thresholds = getRecencyBiasedThresholds(criteria, benchmarkDate);

    // Expect the resulting array to have the same length
    expect(thresholds.length).toBe(criteria.length);

    // Expect each element to be a Temporal.PlainDate object
    expect(thresholds[0]).toBeInstanceOf(Temporal.PlainDate);

    // Use toEqual to compare the date values
    expect(thresholds).toEqual([
      Temporal.PlainDate.from('2024-06-25'),
      Temporal.PlainDate.from('2024-07-11'),
      Temporal.PlainDate.from('2024-07-15'),
    ]);
  });

  it('should return an empty array if the criteria array is empty', () => {
      const criteria: RecencyBiasCriteria[] = [];
      const thresholds = getRecencyBiasedThresholds(criteria, benchmarkDate);

      expect(thresholds).toEqual([]);
  });

  it('should handle a single criterion correctly', () => {
      const criteria: RecencyBiasCriteria[] = [
          { days: 7 }
      ];

      const expectedThresholds = [
          Temporal.PlainDate.from('2024-07-18')
      ];

      const thresholds = getRecencyBiasedThresholds(criteria, benchmarkDate);

      expect(thresholds).toEqual(expectedThresholds);
  });

  it('should correctly sort thresholds even if the input criteria are unsorted', () => {
      // Here, a large duration is first, but the result should be sorted correctly.
      const criteria: RecencyBiasCriteria[] = [
          { months: 3 }, // 2024-04-25
          { weeks: 1 },  // 2024-07-18
          { days: 20 },  // 2024-07-05
      ];

      const expectedThresholds = [
          Temporal.PlainDate.from('2024-04-25'), // 3 months before
          Temporal.PlainDate.from('2024-07-05'), // 20 days before
          Temporal.PlainDate.from('2024-07-18'), // 1 week before
      ];

      const thresholds = getRecencyBiasedThresholds(criteria, benchmarkDate);

      expect(thresholds).toEqual(expectedThresholds);
  });

  it('should handle criteria with different duration units', () => {
      const criteria: RecencyBiasCriteria[] = [
          { weeks: 1, days: 3 }, // 10 days
          { days: 10 },
          { hours: 48 }, // 2 days
      ];

      const expectedThresholds = [
          Temporal.PlainDate.from('2024-07-23'), // 2 days
          Temporal.PlainDate.from('2024-07-15'), // 10 days
          Temporal.PlainDate.from('2024-07-15'), // 10 days
      ];

      const thresholds = getRecencyBiasedThresholds(criteria, benchmarkDate);

      expect(thresholds).toEqual(expectedThresholds);
  });
});
