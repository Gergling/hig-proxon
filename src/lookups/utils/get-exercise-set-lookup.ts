import { getLookup } from "../../common/utils";
import { GymSetResponseDTO } from "../../notion-sdk/dbs/gym-set";
import { GymExerciseSet } from "../../types";

export const getExerciseSetLookup = (
  setDTOs: GymSetResponseDTO[],
  getSet: (dto: GymSetResponseDTO) => GymExerciseSet
) => {
  const { getByUnique } = getLookup<
    GymSetResponseDTO,
    GymExerciseSet
  >(
    setDTOs,
    getSet,
    { id: (dto: GymSetResponseDTO) => dto.id },
  );

  const getExerciseSetById = getByUnique('id');

  return {
    getExerciseSetById,
  };
};
