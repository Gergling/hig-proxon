export const getMappedOrderArray = <T extends string | number>(
  items: T[],
) => items.reduce((mapping, value, idx) => ({
  ...mapping,
  [value]: idx,
}), {} as { [idx in T]: number; });
