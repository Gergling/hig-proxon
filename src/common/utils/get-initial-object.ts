type Mapped<T extends string | number | symbol, U> = {
  [key in T]: U;
};

export const getInitialObject = <T extends string | number, U>(
  items: T[],
  value: U,
): Mapped<T, U> => items.reduce((obj, key) => ({
  ...obj,
  [key]: value,
}), {} as Mapped<T, U>);
