import { ExerciseEquipmentResponseDTO } from "../../../notion-sdk/dbs/exercise-equipment";
import { getNameProperty } from "./get-name-property";

export const getEquipment = (dto: ExerciseEquipmentResponseDTO) => {
  const {
    id,
    properties: { name }
  } = dto;
  if (!name) {
    console.error(`Equipment record with id '${id}' has no name property. Full DTO data is as follows:`, dto);
  };
  return {
    name: getNameProperty(name),
    id
  }
};
