import { Temporal } from "temporal-polyfill";
import { RecencyBiasCriteria } from "../data/types/recency-bias";

/**
 * Returns the current point in time as a Temporal.Instant.
 * This is timezone-agnostic and represents a universal point in time,
 * ideal for recording "last updated" timestamps without ambiguity.
 *
 * @returns {Temporal.Instant} The current UTC instant.
 */
export function getCurrentUtcInstant(): Temporal.Instant {
  return Temporal.Now.instant();
}

/**
 * Converts a Temporal.Instant to its ISO 8601 string representation.
 * This is useful for storing the Instant in JSON.
 *
 * @param {Temporal.Instant} instant The Temporal.Instant to convert.
 * @returns {string} The ISO 8601 string (e.g., "2024-07-15T17:30:00.000000000Z").
 */
export function instantToISOString(instant: Temporal.Instant): string {
  return instant.toString();
}

/**
 * Parses an ISO 8601 string back into a Temporal.Instant.
 *
 * @param {string} isoString The ISO 8601 string to parse.
 * @returns {Temporal.Instant} The parsed Temporal.Instant.
 */
export function instantFromISOString(isoString: string): Temporal.Instant {
  return Temporal.Instant.from(isoString);
}

export const getRecencyBiasedThresholds = (
  criteria: RecencyBiasCriteria[],
  benchmarkDate: Temporal.PlainDate,
): Temporal.PlainDate[] => criteria
  .map((criterion) => benchmarkDate.subtract(criterion))
  .sort(Temporal.PlainDate.compare);

type DateCallback<T> = (date: Temporal.PlainDate) => T;
/**
 * Takes an array of dates which must be sorted from oldest to newest,
 * a date to compare with which represents the "current" or "latest"
 * date.
 * 
 *
 * @param {Temporal.PlainDate[]} thresholdDates An array of dates which must be sorted from oldest to newest.
 * @param {Temporal.PlainDate} date A date to compare against.
 * @param {DateCallback} callback A date to compare against.
 * @returns {Temporal.Instant} The parsed Temporal.Instant.
 */
export const runDateCallback = (
  thresholdDates: Temporal.PlainDate[],
  date: Temporal.PlainDate,
  callback: DateCallback<void>,
): void => {
  for (let i in thresholdDates) {
    const thresholdDate = thresholdDates[i];
    // If we get to the point where the date is not within the threshold,
    // we are done here. This is because the thresholds are in order of
    // oldest to newest, so this date will not apply to further criteria.
    if (Temporal.PlainDate.compare(thresholdDate, date) < 0) return;

    // Otherwise, we are within the threshold. Add the day of week to
    // the array for the criteria.
    callback(thresholdDate);
  }
};
// type Mapped = {
//   [key: string]: unknown;
// } | undefined;
// export const getDateThresholdMap = <T extends Mapped>(
//   thresholdDates: Temporal.PlainDate[],
//   date: Temporal.PlainDate,
//   callback: DateCallback<T>,
// ): T | undefined => {
//   let output: T = undefined;
//   for (let i in thresholdDates) {
//     const thresholdDate = thresholdDates[i];
//     // If we get to the point where the date is not within the threshold,
//     // we are done here. This is because the thresholds are in order of
//     // oldest to newest, so this date will not apply to further criteria.
//     if (Temporal.PlainDate.compare(thresholdDate, date) < 0) return output;

//     // Otherwise, we are within the threshold. Add the day of week to
//     // the array for the criteria.
//     output = callback(thresholdDate);
//   }
//   return output;
// };
