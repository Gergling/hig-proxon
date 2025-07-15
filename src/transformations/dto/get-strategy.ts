import { GymSetStrategyResponseDTO } from "../../notion-sdk/dbs/gym-set-strategy";
import { GymSetStrategy } from "../../types";
import { getNameProperty } from "./get-name-property";

export const getStrategy = ({
  id,
  properties: {
    maximumReps,
    minimumReps,
    name,
  },
}: GymSetStrategyResponseDTO): GymSetStrategy => ({
  id,
  maximum: maximumReps || 0,
  minimum: minimumReps || 0,
  name: getNameProperty(name), 
});
