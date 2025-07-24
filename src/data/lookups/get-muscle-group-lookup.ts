import { Temporal } from "temporal-polyfill";
import { getLookup } from "../../common/utils";
import { MuscleGroupsResponseDTO } from "../../notion-sdk/dbs/muscle-groups";
import { getMuscleGroup } from "../transformations";
import { GymExerciseSet, MuscleGroup, MuscleGroupSetActivity } from "../../types";

export const getMuscleGroupLookup = (
  dtos: MuscleGroupsResponseDTO[]
) => {
  const {
    getByUnique,
    getItems,
  } = getLookup<
    MuscleGroupsResponseDTO,
    MuscleGroup
  >(
    dtos,
    (dto: MuscleGroupsResponseDTO): MuscleGroup => ({
      activity: [],
      exercises: [],
      ...getMuscleGroup(dto),
    }),
    { id: (dto: MuscleGroupsResponseDTO) => dto.id },
  );

  const getMuscleGroupById = getByUnique('id');

  const addMuscleGroupActivity = (
    {
      exercise,
      progression,
      validity,
    }: GymExerciseSet,
    date: Temporal.PlainDate
  ): void => {
    exercise.muscleGroups.forEach((
      {
        focus,
        muscleGroup: { id: muscleGroupId }
      }
    ) => {
      const muscleGroupActivity: MuscleGroupSetActivity = {
        date,
        exercise,
        focus,
        status: {
          progression: progression?.status || 'first',
          validity,
        },
      };
      const muscleGroup = getMuscleGroupById(muscleGroupId);

      if (!muscleGroup) throw new Error(`No muscle group found with id '${muscleGroupId}' for exercise '${exercise.name}'.`);

      muscleGroup.activity.push(muscleGroupActivity);
    });
  };

  return {
    addMuscleGroupActivity,
    getMuscleGroupById,
    getMuscleGroups: getItems,
  };
};
