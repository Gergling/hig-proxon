import { mockGymExercise } from "../../../gym-trips/mock-data";
import { MuscleGroupExercise } from "../../../types";
import { ExerciseSet, UniqueExerciseSets } from "../types/gym";
import { reduceMuscleGroupExercise } from "./gym-exercise-breakdown";

const mockExerciseSet: ExerciseSet = {
  ems0ntn: 0,
  equipment: [{ name: 'Muscle Machine' }],
  exerciseId: 'exercise1',
  exerciseName: 'Exercise 1',
  progressionStatuses: [],
  recency: 10,
};

describe('reduceMuscleGroupExercise', () => {

  it('should return the original uniqueExerciseSets if focus is false', () => {
    const initialSets: UniqueExerciseSets = {
      'ex1': { ...mockExerciseSet, progressionStatuses: ['growth'] },
    };
    const muscleGroupExercise: MuscleGroupExercise = {
      exercise: { ...mockGymExercise, id: 'ex2', name: 'Squat', ems0ntn: 5,  },
      focus: false, // Focus is false
    };

    const result = reduceMuscleGroupExercise(initialSets, muscleGroupExercise);

    // Expect the result to be the exact same object reference
    expect(result).toStrictEqual(initialSets);
  });

  it('should add a new exercise to uniqueExerciseSets if focus is true and exerciseId does not exist', () => {
    const initialSets: UniqueExerciseSets = {
      'ex1': { ...mockExerciseSet, progressionStatuses: ['growth'] },
    };
    const muscleGroupExercise: MuscleGroupExercise = {
      exercise: { ...mockGymExercise, id: 'ex2', name: 'Squat', ems0ntn: 5 },
      focus: true, // Focus is true
    };

    const result = reduceMuscleGroupExercise(initialSets, muscleGroupExercise);

    // Expect a new object to be returned (immutability)
    expect(result).not.toBe(initialSets);
    // Expect the new exercise to be added with default and provided properties
    expect(result).toEqual({
      'ex1': {
        ...mockExerciseSet,
        progressionStatuses: ['growth'],
        recency: 10,
      },
      'ex2': {
        ...mockExerciseSet,
        exerciseId: 'ex2',
        exerciseName: 'Squat', 
        progressionStatuses: [], // Default from reducer
        recency: 0,              // Default from reducer
        ems0ntn: 5,
      }
    });
  });

  it('should update an existing exercise in uniqueExerciseSets if focus is true and exerciseId exists', () => {
    const initialSets: UniqueExerciseSets = {
      'ex1': { ...mockExerciseSet, progressionStatuses: ['growth'], recency: 10, exerciseId: 'ex1', exerciseName: 'Pushup' },
      'ex2': { ...mockExerciseSet, progressionStatuses: ['rehab'], recency: 5, ems0ntn: 3, exerciseId: 'ex2', exerciseName: 'Old Squat' }
    };
    const muscleGroupExercise: MuscleGroupExercise = {
      exercise: { ...mockGymExercise, id: 'ex2', name: 'New Squat', ems0ntn: 6 }, // Updated properties
      focus: true,
    };

    const result = reduceMuscleGroupExercise(initialSets, muscleGroupExercise);

    // Expect a new object to be returned (immutability)
    expect(result).not.toBe(initialSets);
    // Expect the existing exercise to be updated, merging new properties with old ones
    expect(result).toEqual({
      'ex1': {
        ...mockExerciseSet, 
        progressionStatuses: ['growth'],
        recency: 10,
        exerciseId: 'ex1',
        exerciseName: 'Pushup',
      },
      'ex2': {
        ...mockExerciseSet,
        progressionStatuses: ['rehab'], // Should retain old progressionStatuses
        recency: 5,              // Should retain old recency
        ems0ntn: 6,              // Updated
        exerciseId: 'ex2',       // Updated (same ID)
        exerciseName: 'New Squat', // Updated
      }
    });
  });

  it('should handle empty initial uniqueExerciseSets correctly', () => {
    const initialSets: UniqueExerciseSets = {};
    const muscleGroupExercise: MuscleGroupExercise = {
      exercise: { ...mockGymExercise, id: 'ex1', name: 'Bench Press', ems0ntn: 10,  },
      focus: true,
    };

    const result = reduceMuscleGroupExercise(initialSets, muscleGroupExercise);

    expect(result).not.toBe(initialSets);
    expect(result).toEqual({
      'ex1': {
        ...mockExerciseSet,
        progressionStatuses: [],
        recency: 0,
        ems0ntn: 10,
        exerciseId: 'ex1',
        exerciseName: 'Bench Press',
      }
    });
  });
});
