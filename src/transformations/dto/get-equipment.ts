import { ExerciseEquipmentResponseDTO } from "../../notion-sdk/dbs/exercise-equipment";
import { getNameProperty } from "./get-name-property";

export const getEquipment = ({
  id,
  properties: { name }
}: ExerciseEquipmentResponseDTO) => ({ name: getNameProperty(name), id });
