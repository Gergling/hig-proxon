export const getMiddleItem = <T>(items: T[]): T | undefined => {
  const statusesLength = items.length;
  return statusesLength > 0
    ? items[Math.floor(statusesLength / 2)]
    : undefined;
};
