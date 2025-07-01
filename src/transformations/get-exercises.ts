import { getRelatedById } from "../common/utils";
import { getEquipmentLookup, getMuscleGroupLookup } from "../lookups";
import { DTOProps, ExerciseMuscleGroup, GymExercise, MuscleGroup } from "../types";
import { getExercise } from "./dto";

export const getExercises = ({
  equipment: equipmentData,
  exercises: exerciseData,
  muscleGroups: muscleGroupData,
}: Pick<DTOProps, 'equipment' | 'exercises' | 'muscleGroups'>): {
  // equipment: Equipment[];
  exercises: GymExercise[];
  // muscleGroups: MuscleGroup[];
  // getEquipmentById: (id: string) => Equipment;
  getExerciseById: (id: string) => GymExercise;
} => {
  const {
    getEquipmentById,
  } = getEquipmentLookup(equipmentData);
  const {
    // getMuscleGroupFactory,
    // muscleGroupMapping,
    // muscleGroups,
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
  const getExerciseById = (id: string) => exerciseMapping[id];

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
    // equipment,
    exercises,
    // muscleGroups,
    // getEquipmentById,
    getExerciseById,
  };
};
