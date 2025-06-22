import { Equipment, GymExercise, GymSetStrategy } from "../types";

export const mockGymEquipment: Equipment = {
  name: 'Muscle Machine',
};

export const mockGymSetStrategy: GymSetStrategy = {
  maximum: 15,
  minimum: 7,
  name: 'Mock Hypertrophic Strategy',
};

export const mockGymExercise: GymExercise = {
  equipment: mockGymEquipment,
  muscleGroups: {},
  name: 'Muscle Exercise',
};