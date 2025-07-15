import { Temporal } from "temporal-polyfill";

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

// --- Example Usage ---
/*
(async () => {
    // Get the current instant
    const now = getCurrentUtcInstant();
    console.log('Current UTC Instant:', now.toString()); // e.g., 2024-07-15T17:56:00.123456789Z

    // Simulate storing it
    const storedString = instantToISOString(now);
    console.log('Stored as string:', storedString);

    // Simulate retrieving and parsing it later
    const retrievedInstant = instantFromISOString(storedString);
    console.log('Retrieved Instant:', retrievedInstant.toString());

    // Verify they are the same point in time
    console.log('Are they equal?', now.equals(retrievedInstant)); // Should be true

    // Demonstrate how it's timezone-agnostic:
    // If you were to display this instant in a specific timezone:
    const londonTime = now.toZonedDateTimeISO('Europe/London');
    console.log('London Time:', londonTime.toString()); // Will show local time + offset

    const newYorkTime = now.toZonedDateTimeISO('America/New_York');
    console.log('New York Time:', newYorkTime.toString()); // Will show local time + offset

    // All these ZonedDateTimes represent the SAME Instant, just viewed from different timezones.
})();
*/
