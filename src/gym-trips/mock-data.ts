import { Equipment, ExerciseMuscleGroup, GymExercise, GymExerciseSet, GymSetStrategy, MuscleGroup } from "../types";

export const mockGymEquipment: Equipment = {
  name: 'Muscle Machine',
};

export const mockGymSetStrategy: GymSetStrategy = {
  id: '',
  maximum: 15,
  minimum: 7,
  name: 'Mock Hypertrophic Strategy',
};

export const mockMuscleGroup: MuscleGroup = {
  activity: [],
  exercises: [],
  id: 'muscle-group-id-pectorals',
  name: 'Mock Muscle Group Pectorals',
};

export const mockExerciseMuscleGroup: ExerciseMuscleGroup = {
  focus: true,
  muscleGroup: mockMuscleGroup,
};

export const mockGymExercise: GymExercise = {
  ems0ntn: 0,
  equipment: [mockGymEquipment],
  id: '',
  muscleGroups: [],
  name: 'Muscle Exercise',
};

export const mockGymExerciseSet: GymExerciseSet = {
  challenge: 2,
  exercise: mockGymExercise,
  id: '',
  units: 'Kg',
  reps: 10,
  strategy: mockGymSetStrategy,
  validity: 'valid',
};
