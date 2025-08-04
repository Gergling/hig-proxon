import { MuscleGroupAggregation } from "../aggregators/types";
import { compareMuscleGroupAggregations } from "./gym-muscle-group-activity";

describe("compareMuscleGroupAggregations", () => {
  // Test Case 1: First aggregation has no statuses.
  // It should be considered inferior to the second.
  it("should return a negative number if the first aggregation has no statuses", () => {
    const one: MuscleGroupAggregation = { muscleGroupId: 'mg1', statuses: [], activity: 10 };
    const two: MuscleGroupAggregation = { muscleGroupId: 'mg2', statuses: ["growth", "growth"], activity: 5 };

    // The real getMiddleItem will return 'undefined' for the empty array,
    // which tests the specific logic in compareMuscleGroupAggregations.
    expect(compareMuscleGroupAggregations(one, two)).toBe(-1);
  });

  // Test Case 2: Second aggregation has no statuses.
  // It should be considered inferior to the first.
  it("should return a positive number if the second aggregation has no statuses", () => {
    const one: MuscleGroupAggregation = { muscleGroupId: 'mg1', statuses: ["steady"], activity: 10 };
    const two: MuscleGroupAggregation = { muscleGroupId: 'mg2', statuses: [], activity: 5 };

    // The real getMiddleItem will return 'undefined' for the empty array.
    expect(compareMuscleGroupAggregations(one, two)).toBe(1);
  });

  // Test Case 3: Both aggregations have defined statuses, and the first is inferior.
  // The result should be a negative number.
  it("should return a negative number when first's status is inferior", () => {
    const one: MuscleGroupAggregation = { muscleGroupId: 'mg1', statuses: ["rehab", "rehab"], activity: 10 };
    const two: MuscleGroupAggregation = { muscleGroupId: 'mg2', statuses: ["growth", "growth"], activity: 5 };
    
    expect(compareMuscleGroupAggregations(one, two)).toBeLessThan(0);
  });

  // Test Case 4: Both aggregations have defined statuses, and the first is superior.
  // The result should be a positive number.
  it("should return a positive number when first's status is superior", () => {
    const one: MuscleGroupAggregation = { muscleGroupId: 'mg1', statuses: ["growth", "growth"], activity: 10 };
    const two: MuscleGroupAggregation = { muscleGroupId: 'mg2', statuses: ["rehab", "rehab"], activity: 5 };

    expect(compareMuscleGroupAggregations(one, two)).toBeGreaterThan(0);
  });

  // Test Case 5: Both statuses are equal, and the first activity is higher.
  // The result should be a positive number.
  it("should return a positive number when statuses are equal and first's activity is higher", () => {
    const one: MuscleGroupAggregation = { muscleGroupId: 'mg1', statuses: ["steady"], activity: 20 };
    const two: MuscleGroupAggregation = { muscleGroupId: 'mg2', statuses: ["steady"], activity: 10 };

    expect(compareMuscleGroupAggregations(one, two)).toBe(10);
  });

  // Test Case 6: Both statuses are equal, and the first activity is lower.
  // The result should be a negative number.
  it("should return a negative number when statuses are equal and first's activity is lower", () => {
    const one: MuscleGroupAggregation = { muscleGroupId: 'mg1', statuses: ["steady"], activity: 5 };
    const two: MuscleGroupAggregation = { muscleGroupId: 'mg2', statuses: ["steady"], activity: 15 };

    expect(compareMuscleGroupAggregations(one, two)).toBe(-10);
  });

  // Test Case 7: Both statuses and activities are equal.
  // The result should be zero.
  it("should return zero when both statuses and activities are equal", () => {
    const one: MuscleGroupAggregation = { muscleGroupId: 'mg1', statuses: ["steady"], activity: 10 };
    const two: MuscleGroupAggregation = { muscleGroupId: 'mg2', statuses: ["steady"], activity: 10 };

    expect(compareMuscleGroupAggregations(one, two)).toBe(0);
  });
});
