import { ExerciseEquipmentResponseDTO } from "../notion-sdk/dbs/exercise-equipment";
import { ExercisesResponseDTO } from "../notion-sdk/dbs/exercises";
import { MuscleGroupsResponseDTO } from "../notion-sdk/dbs/muscle-groups";
import { Equipment, ExerciseMuscleGroup, GymExercise, MuscleGroup } from "../types";
import { getEquipment, getExercise, getMuscleGroup } from "./dto";

const useEquipment = (equipmentData: ExerciseEquipmentResponseDTO[]) => {
  const equipmentMapping: {
    [id: string]: Equipment;
  } = equipmentData.reduce((map, equipmentDataItem) => {
    const equipment = getEquipment(equipmentDataItem);
    return {
      ...map,
      [equipment.id]: equipment,
    };
  }, {});

  const getEquipmentById = (id: string) =>
    equipmentMapping[id as keyof typeof equipmentMapping];
  
  return {
    equipmentMapping,
    getEquipmentById,
  }
};

// const useMuscleGroup = (muscleGroupData: MuscleGroupsResponseDTO[]) => {
//   const {
//     muscleGroupList,
//     muscleGroupMapping,
//   } = muscleGroupData.reduce(({
//     muscleGroupList,
//     muscleGroupMapping,
//   }, muscleGroupDataItem) => {
//     const muscleGroup = getMuscleGroup(muscleGroupDataItem);
//     return {
//       muscleGroupList: [
//         ...muscleGroupList,
//         muscleGroup,
//       ],
//       muscleGroupMapping: {
//         ...muscleGroupMapping,
//         [muscleGroup.id]: muscleGroup,
//       },
//     };
//   }, {
//     muscleGroupList: [] as { id: string; name: string; }[],
//     muscleGroupMapping: {},
//   });

//   const getMapFactory = (focus: boolean) => (id: string): ExerciseMuscleGroup => {
//     const muscleGroup = muscleGroupMapping[id as keyof typeof muscleGroupMapping];
//     return {
//       focus,
//       muscleGroup,
//     };
//   };

//   return {
//     getMapFactory,
//     muscleGroupList,
//   };
// }


const getMuscleGroupLookup = (muscleGroupData: MuscleGroupsResponseDTO[]) => {
  const muscleGroupMapping: {
    [id: string]: MuscleGroup;
  } = muscleGroupData.reduce((map, muscleGroupDataItem) => {
    const muscleGroup = getMuscleGroup(muscleGroupDataItem);
    return {
      ...map,
      [muscleGroup.id]: muscleGroup,
    };
  }, {});
  const getMuscleGroupFactory = (focus: boolean) => (id: string): ExerciseMuscleGroup => {
    const muscleGroup = muscleGroupMapping[id as keyof typeof muscleGroupMapping];
    return {
      focus,
      muscleGroup,
    };
  };

  return {
    getMuscleGroupFactory,
    muscleGroupMapping,
  };
}

export const getExercises = (
  equipmentData: ExerciseEquipmentResponseDTO[],
  exerciseData: ExercisesResponseDTO[],
  muscleGroupData: MuscleGroupsResponseDTO[],
): {
  equipment: Equipment[];
  exercises: GymExercise[];
  muscleGroups: MuscleGroup[];
} => {
  // const allEquipment = equipmentData.reduce((map, equipmentDataItem) => {
  //   const equipment = getEquipment(equipmentDataItem);
  //   return {
  //     ...map,
  //     [equipment.id]: equipment,
  //   };
  // }, {});
  const {
    equipmentMapping,
    getEquipmentById
  } = useEquipment(equipmentData);
  const {
    getMuscleGroupFactory,
    muscleGroupMapping,
  } = getMuscleGroupLookup(muscleGroupData);

  const exercises: GymExercise[] = exerciseData.map((exerciseDataItem) => {
    const {
      equipmentNeededIds,
      // TODO: Probably should be part of the GYM-EMS-0-NTN standard, but
      // then maybe that's not required.
      id,
      primaryMuscleGroupsIds,
      stabiliserMuscleGroupsIds,
      name
    } = getExercise(exerciseDataItem);
    const exerciseEquipment: Equipment[] = equipmentNeededIds
      .map(getEquipmentById);
    // const exerciseEquipment: Equipment[] = equipmentNeededIds
    //   .map((id) => allEquipment[id as keyof typeof allEquipment]);

    // TODO: Figure out how to handle duplication, or whether there's any
    // point to doing so, since we'll want to move over to hardcoded ASAP.
    // const allRelatedMuscleGroupIds = [
    //   ...primaryMuscleGroupsIds,
    //   ...stabiliserMuscleGroupsIds
    // ];
    // const hasDuplicatedMuscleGroupIds = [...new Set(allRelatedMuscleGroupIds)].length !== allRelatedMuscleGroupIds.length;
    const focusMuscleGroups = primaryMuscleGroupsIds.map(getMuscleGroupFactory(true));
    const stabiliserMuscleGroups = stabiliserMuscleGroupsIds.map(getMuscleGroupFactory(false));
    const muscleGroups: ExerciseMuscleGroup[] = [
      ...focusMuscleGroups,
      ...stabiliserMuscleGroups,
    ];
    const ems0ntn = focusMuscleGroups.length + (stabiliserMuscleGroups.length / 2);

    return {
      equipment: exerciseEquipment,
      muscleGroups,
      ems0ntn,
      name,
    }
  });

  const equipment = Object.values(equipmentMapping);
  const muscleGroups = Object.values(muscleGroupMapping);

  return {
    equipment,
    exercises,
    muscleGroups,
  };
};
