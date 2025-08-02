import { Temporal } from "temporal-polyfill";
import { GymTripProps } from "../../../types";
import { getMockGymTrip } from "../../../gym-trips/mock-data";
import { getMAI, getMSI } from "./indexes";

// Define a helper function to create a mock GymTripProps object for easier test setup.
const createMockTrip = (
  date: Temporal.PlainDate,
  muscleScore: number
): GymTripProps => getMockGymTrip({
  visitDate: date,
  muscleScore,
  sets: [],
  tqi: 0,
});

describe("Fitness Metric Calculations", () => {
  // Test cases for the getMSI function
  describe("getMSI", () => {
    it("should return a value less than 1 for a muscleScore less than 5", () => {
      const trip = createMockTrip(Temporal.PlainDate.from({ year: 2025, month: 7, day: 25 }), 3);
      expect(getMSI(trip)).toBe(0.6);
    });

    it("should return exactly 1 for a muscleScore of 5", () => {
      const trip = createMockTrip(Temporal.PlainDate.from({ year: 2025, month: 7, day: 25 }), 5);
      expect(getMSI(trip)).toBe(1);
    });

    it("should cap the return value at 1 for a muscleScore greater than 5", () => {
      const trip = createMockTrip(Temporal.PlainDate.from({ year: 2025, month: 7, day: 25 }), 8);
      expect(getMSI(trip)).toBe(1);
    });
  });

  // Test cases for the getMAI function
  describe("getMAI", () => {
    // A reference date for the current trip
    const today = Temporal.PlainDate.from({ year: 2025, month: 7, day: 25 });
    
    it("should correctly calculate MAI when all previous trips are within the 7-day window", () => {
      const previousTrips = [
        createMockTrip(today.subtract({ days: 1 }), 5), // MSI = 1
        createMockTrip(today.subtract({ days: 3 }), 3), // MSI = 0.6
      ];
      const currentTrip = createMockTrip(today, 4); // MSI = 0.8
      
      const { mai, msi, last7DaysTrips } = getMAI(previousTrips, currentTrip);

      // Total sessions in the last 7 days (including current trip): 3
      const msiSum = 1 + 0.6 + 0.8; // Previous MSI + Current MSI
      const msiMean = msiSum / 3;
      const totalSessionsFactor = Math.min(3 / 2, 1); // Capped at 1
      const expectedMai = msiMean * totalSessionsFactor;

      expect(last7DaysTrips.length).toBe(3);
      expect(msi).toBe(0.8);
      expect(mai).toBe(expectedMai);
    });

    it("should filter out trips older than 7 days when calculating MAI", () => {
      const previousTrips = [
        createMockTrip(today.subtract({ days: 1 }), 5), // MSI = 1 (within 7 days)
        createMockTrip(today.subtract({ days: 8 }), 5), // MSI = 1 (outside 7 days, should be ignored)
      ];
      const currentTrip = createMockTrip(today, 3); // MSI = 0.6

      const { mai, msi, last7DaysTrips } = getMAI(previousTrips, currentTrip);

      // Only one previous trip should be included (msi=1) plus the current trip (msi=0.6)
      const msiSum = 1 + 0.6;
      const msiMean = msiSum / 2;
      const totalSessionsFactor = Math.min(2 / 2, 1);
      const expectedMai = msiMean * totalSessionsFactor;

      expect(msi).toBe(0.6);
      expect(mai).toBe(expectedMai);
      expect(last7DaysTrips.length).toBe(2);
    });

    it("should correctly calculate MAI when there are no previous trips", () => {
      const previousTrips: GymTripProps[] = [];
      const currentTrip = createMockTrip(today, 4); // MSI = 0.8

      const { mai, msi, last7DaysTrips } = getMAI(previousTrips, currentTrip);

      // Only the current trip should be included
      const msiSum = 0.8;
      const msiMean = msiSum / 1;
      const totalSessionsFactor = Math.min(1 / 2, 1);
      const expectedMai = msiMean * totalSessionsFactor;

      expect(msi).toBe(0.8);
      expect(mai).toBe(expectedMai);
      expect(last7DaysTrips.length).toBe(1);
    });
  });
});
