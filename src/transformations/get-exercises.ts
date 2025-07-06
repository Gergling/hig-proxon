import { Temporal } from "temporal-polyfill";
import { getRelatedById } from "../common/utils";
import { getEquipmentLookup, getMuscleGroupLookup } from "../lookups";
import { DTOProps, ExerciseMuscleGroup, GymExercise, GymExerciseSet, MuscleGroup } from "../types";
import { getExercise } from "./dto";

export const getExercises = ({
  equipment: equipmentData,
  exercises: exerciseData,
  muscleGroups: muscleGroupData,
}: Pick<DTOProps, 'equipment' | 'exercises' | 'muscleGroups'>): {
  addMuscleGroupActivity: (set: GymExerciseSet, date: Temporal.PlainDate) => void;
  exercises: GymExercise[];
  getMuscleGroups: () => MuscleGroup[];
  // getEquipmentById: (id: string) => Equipment;
  getMuscleGroupById: (id: string) => MuscleGroup | undefined;
  getExerciseById: (id: string) => GymExercise | undefined;
} => {
  const {
    getEquipmentById,
  } = getEquipmentLookup(equipmentData);
  const {
    addMuscleGroupActivity,
    getMuscleGroups,
    getMuscleGroupById,
  } = getMuscleGroupLookup(muscleGroupData);
  const getMuscleGroupFactory = (focus: boolean) => (id: string) => {
    const muscleGroup = getMuscleGroupById(id);

    if (!muscleGroup) return undefined;

    return { muscleGroup, focus };
  };
  const exerciseMapping: {
    [id: string]: GymExercise;
  } = {};

  const exercises: GymExercise[] = [];
  const getExerciseById = (id: string): GymExercise | undefined => exerciseMapping[id];

  exerciseData.forEach((exerciseDataItem) => {
    const {
      equipmentNeededIds,
      // TODO: Probably should be part of the GYM-EMS-0-NTN standard, but
      // then maybe that's not required.
      id,
      primaryMuscleGroupsIds,
      stabiliserMuscleGroupsIds,
      name
    } = getExercise(exerciseDataItem);
    const exerciseEquipment = getRelatedById(
      equipmentNeededIds,
      getEquipmentById
    );

    // TODO: Figure out how to handle duplication, or whether there's any
    // point to doing so, since we'll want to move over to hardcoded ASAP.
    // const allRelatedMuscleGroupIds = [
    //   ...primaryMuscleGroupsIds,
    //   ...stabiliserMuscleGroupsIds
    // ];
    // const hasDuplicatedMuscleGroupIds = [...new Set(allRelatedMuscleGroupIds)].length !== allRelatedMuscleGroupIds.length;
    const focusMuscleGroups = getRelatedById(primaryMuscleGroupsIds, getMuscleGroupFactory(true));
    const stabiliserMuscleGroups = getRelatedById(stabiliserMuscleGroupsIds, getMuscleGroupFactory(false));
    const muscleGroups: ExerciseMuscleGroup[] = [
      ...focusMuscleGroups,
      ...stabiliserMuscleGroups,
    ];
    const ems0ntn = focusMuscleGroups.length + (stabiliserMuscleGroups.length / 2);

    const exercise: GymExercise = {
      id,
      equipment: exerciseEquipment,
      muscleGroups,
      ems0ntn,
      name,
    };

    exercises.push(exercise);
    exerciseMapping[id] = exercise;
  });

  return {
    addMuscleGroupActivity,
    exercises,
    getMuscleGroups,
    // getEquipmentById,
    getExerciseById,
    getMuscleGroupById,
  };
};
