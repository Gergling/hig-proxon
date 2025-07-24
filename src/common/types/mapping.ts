export type Mapped<T> = {
  [key: string]: T;
};

export type MappingKeyFunction<T> = (item: T) => string;

export type ReductionMapper<T> = {
  getKey: MappingKeyFunction<T>;
  mapped: Mapped<T>;
};
