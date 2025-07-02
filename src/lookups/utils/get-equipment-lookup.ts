import { getLookup } from "../../common/utils";
import { ExerciseEquipmentResponseDTO } from "../../notion-sdk/dbs/exercise-equipment";
import { getEquipment } from "../../transformations";
import { Equipment } from "../../types";

export const getEquipmentLookup = (
  equipmentDTOs: ExerciseEquipmentResponseDTO[]
) => {
  const { getByUnique } = getLookup<
    ExerciseEquipmentResponseDTO,
    Equipment
  >(
    equipmentDTOs,
    getEquipment,
    { id: (dto: ExerciseEquipmentResponseDTO) => dto.id },
  );
  const getEquipmentById = getByUnique('id');
  return {
    getEquipmentById,
  };
};
