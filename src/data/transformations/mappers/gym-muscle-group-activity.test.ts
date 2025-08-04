import { MuscleGroup } from "../../../types";
import { MuscleGroupAggregation } from "../aggregators/types";
import { compareMuscleGroupAggregations, getMuscleGroupsFromAggregation } from "./gym-muscle-group-activity";

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

describe("getMuscleGroupsFromAggregation", () => {
  // TODO: Move to mock data.
  // Define sample data for testing. These will be the "database" of muscle groups.
  const squat: MuscleGroup = {
    id: "squat",
    name: "Squat",
    activity: [],
    exercises: []
  };
  const benchPress: MuscleGroup = {
    id: "bench-press",
    name: "Bench Press",
    activity: [],
    exercises: []
  };
  const deadlift: MuscleGroup = {
    id: "deadlift",
    name: "Deadlift",
    activity: [],
    exercises: []
  };
  const unknownMuscleGroup: MuscleGroup = {
    id: "unknown",
    name: "Unknown",
    activity: [],
    exercises: []
  };

  // Define a set of aggregations to be processed.
  const aggregations: MuscleGroupAggregation[] = [
    // Deadlift has high activity and a growth status.
    { muscleGroupId: deadlift.id, statuses: ["growth"], activity: 100 },
    // Bench press has steady status and medium activity.
    { muscleGroupId: benchPress.id, statuses: ["steady"], activity: 50 },
    // Squat has low activity and a rehab status.
    { muscleGroupId: squat.id, statuses: ["rehab"], activity: 20 },
    // This muscle group will not be found by our mock function.
    { muscleGroupId: "not-in-db", statuses: ["growth"], activity: 150 },
  ];

  // A mock `getMuscleGroupById` function to simulate fetching data from a source.
  const mockGetMuscleGroupById = jest.fn((id: string): MuscleGroup | undefined => {
    switch (id) {
      case squat.id:
        return squat;
      case benchPress.id:
        return benchPress;
      case deadlift.id:
        return deadlift;
      default:
        return undefined; // Simulate no muscle group found
    }
  });

  // Test Case 1: Successfully sorts muscle groups by ascending priority, filtering out unknown IDs.
  it("should return muscle groups sorted by ascending priority and filter out unknown IDs", () => {
    // The `compareMuscleGroupAggregations` function is used to create a descending
    // order of priority, but the `getSpliced` function then negates the comparison
    // number to get the final ascending priority.
    // Therefore, the expected order is based on the lowest priority item first.
    const expectedPriority = [squat, benchPress, deadlift];

    const { priorityMuscleGroups } = getMuscleGroupsFromAggregation(
      mockGetMuscleGroupById,
      aggregations
    );

    // The final array of muscle groups should be sorted and the 'not-in-db' item should be removed.
    expect(priorityMuscleGroups).toEqual(expectedPriority);
  });

  // Test Case 2: Handles an empty input array gracefully.
  it("should return an empty array if the aggregations input is empty", () => {
    const { priorityMuscleGroups } = getMuscleGroupsFromAggregation(
      mockGetMuscleGroupById,
      []
    );

    // An empty input array should result in an empty output array.
    expect(priorityMuscleGroups).toEqual([]);
  });

  // Test Case 3: Handles a case where all muscle groups are not found.
  it("should return an empty array if no muscle groups are found by the getter", () => {
    const aggregationsWithUnknowns: MuscleGroupAggregation[] = [
      { muscleGroupId: "unknown1", statuses: ["growth"], activity: 100 },
      { muscleGroupId: "unknown2", statuses: ["steady"], activity: 50 },
    ];

    const { priorityMuscleGroups } = getMuscleGroupsFromAggregation(
      mockGetMuscleGroupById,
      aggregationsWithUnknowns
    );

    expect(priorityMuscleGroups).toEqual([]);
  });

  // Test Case 4: Handles a single item in the input array.
  it("should handle a single aggregation correctly", () => {
    const singleAggregation: MuscleGroupAggregation[] = [
      { muscleGroupId: deadlift.id, statuses: ["growth"], activity: 100 },
    ];

    const { priorityMuscleGroups } = getMuscleGroupsFromAggregation(
      mockGetMuscleGroupById,
      singleAggregation
    );

    expect(priorityMuscleGroups).toEqual([deadlift]);
  });
});
