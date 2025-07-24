import { Mapped, MappingKeyFunction, ReductionMapper } from "../types/mapping";

export const reduceMapped = <T>(
  { getKey, mapped }: ReductionMapper<T>,
  item: T,
): ReductionMapper<T> => {
  const key = getKey(item);
  return {
    getKey,
    mapped: {
      ...mapped,
      [key]: item,
    },
  };
};

export const getMapped = <T>(
  list: T[],
  getKey: MappingKeyFunction<T>,
): Mapped<T> => {
  const {
    mapped,
  } = list.reduce(reduceMapped, { getKey, mapped: {} as Mapped<T> });
  return mapped;
};
