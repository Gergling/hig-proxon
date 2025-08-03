import { Temporal } from "temporal-polyfill";
import { GymTripProps } from "../../../types";
import { getMockGymTrip } from "../../../gym-trips/mock-data";
import { getMonthlyActivity } from "./activity";
import { getMAI, getMSI } from "../calculations/indexes";

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

describe("getMonthlyActivity", () => {
  it("should correctly aggregate trips and calculate averages for multiple months", () => {
    // Mock trips that span two different months
    const mockTrips: GymTripProps[] = [
      createMockTrip(Temporal.PlainDate.from({ year: 2025, month: 7, day: 1 }), 5), // July Trip 1
      createMockTrip(Temporal.PlainDate.from({ year: 2025, month: 7, day: 3 }), 3), // July Trip 2
      createMockTrip(Temporal.PlainDate.from({ year: 2025, month: 7, day: 28 }), 4), // July Trip 3
      createMockTrip(Temporal.PlainDate.from({ year: 2025, month: 8, day: 1 }), 5), // August Trip 1
      createMockTrip(Temporal.PlainDate.from({ year: 2025, month: 8, day: 5 }), 4), // August Trip 2
    ];

    const result = getMonthlyActivity(mockTrips);

    // Assert that the result contains two entries for the two months
    expect(result.length).toBe(2);

    // --- Assertions for July 2025 ---
    const julyResult = result.find(m => m.month.year === 2025 && m.month.month === 7);
    expect(julyResult).toBeDefined();
    if (julyResult) {
      expect(julyResult.count).toBe(3);
      
      // Manually calculate the expected averages based on getMSI and getMAI logic
      const msi1 = getMSI(mockTrips[0]); // 1.0
      const mai1 = getMAI([], mockTrips[0]).mai; // 0.5

      const msi2 = getMSI(mockTrips[1]); // 0.6
      const mai2 = getMAI([mockTrips[0]], mockTrips[1]).mai; // 0.8
      
      const msi3 = getMSI(mockTrips[2]); // 0.8
      const mai3 = getMAI([], mockTrips[2]).mai; // 0.4
      
      const expectedMsiAvg = (msi1 + msi2 + msi3) / 3;
      const expectedMaiAvg = (mai1 + mai2 + mai3) / 3;

      expect(julyResult.msi).toBeCloseTo(expectedMsiAvg);
      expect(julyResult.mai).toBeCloseTo(expectedMaiAvg);
    }
    
    // --- Assertions for August 2025 ---
    const augustResult = result.find(m => m.month.year === 2025 && m.month.month === 8);
    expect(augustResult).toBeDefined();
    if (augustResult) {
      expect(augustResult.count).toBe(2);

      // Manually calculate the expected averages
      const msi4 = getMSI(mockTrips[3]); // 1.0
      const mai4 = getMAI([mockTrips[2]], mockTrips[3]).mai; // 0.9

      const msi5 = getMSI(mockTrips[4]); // 0.8
      const mai5 = getMAI([mockTrips[2], mockTrips[3]], mockTrips[4]).mai; // 0.8666...
      
      const expectedMsiAvg = (msi4 + msi5) / 2;
      const expectedMaiAvg = (mai4 + mai5) / 2;

      expect(augustResult.msi).toBeCloseTo(expectedMsiAvg);
      expect(augustResult.mai).toBeCloseTo(expectedMaiAvg);
    }
  });

  it("should return an empty array if the input is empty", () => {
    const mockTrips: GymTripProps[] = [];
    const result = getMonthlyActivity(mockTrips);
    expect(result).toEqual([]);
  });

  it("should handle a single trip correctly", () => {
    const singleTrip = createMockTrip(Temporal.PlainDate.from({ year: 2025, month: 9, day: 10 }), 4);
    const result = getMonthlyActivity([singleTrip]);

    expect(result.length).toBe(1);
    const singleResult = result[0];
    expect(singleResult.count).toBe(1);

    const expectedMsi = getMSI(singleTrip); // 0.8
    const expectedMai = getMAI([], singleTrip).mai; // 0.4

    expect(singleResult.msi).toBeCloseTo(expectedMsi);
    expect(singleResult.mai).toBeCloseTo(expectedMai);
  });
});
