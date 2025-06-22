import { ExercisesResponseDTO } from "../../notion-sdk/dbs/exercises";
import { getNameProperty } from "./get-name-property";

export const getExercise = ({
  id,
  properties: {
    equipmentNeededIds,
    name,
    primaryMuscleGroupsIds,
    stabiliserMuscleGroupsIds,
  },
}: ExercisesResponseDTO) => ({
  equipmentNeededIds,
  id,
  name: getNameProperty(name),
  primaryMuscleGroupsIds,
  stabiliserMuscleGroupsIds,
});
