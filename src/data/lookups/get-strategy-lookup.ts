import { getLookup } from "../../common/utils";
import { GymSetStrategyResponseDTO } from "../../notion-sdk/dbs/gym-set-strategy";
import { getStrategy } from "../transformations";
import { GymSetStrategy } from "../../types";

export const getStrategyLookup = (
  strategyDTOs: GymSetStrategyResponseDTO[]
) => {
  const {
    getByUnique,
  } = getLookup<
    GymSetStrategyResponseDTO,
    GymSetStrategy
  >(
    strategyDTOs,
    getStrategy,
    { id: (dto: GymSetStrategyResponseDTO) => dto.id },
  );

  const getStrategyById = getByUnique('id');

  return {
    getStrategyById,
  };
};
