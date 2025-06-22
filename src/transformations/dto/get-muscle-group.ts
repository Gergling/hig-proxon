import { MuscleGroupsResponseDTO } from "../../notion-sdk/dbs/muscle-groups";
import { getNameProperty } from "./get-name-property";

export const getMuscleGroup = ({
  id,
  properties: {
    exercisesPrimaryIds,
    exercisesStabilityIds,
    name,
  },
}: MuscleGroupsResponseDTO) => ({
  exercisesPrimaryIds,
  exercisesStabilityIds,
  id,
  name: getNameProperty(name),
});
