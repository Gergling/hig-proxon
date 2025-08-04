export const getMiddleItem = <T>(items: T[]): T | undefined => {
  const itemsLength = items.length;
  return itemsLength > 0
    ? items[Math.floor(itemsLength / 2)]
    : undefined;
};
