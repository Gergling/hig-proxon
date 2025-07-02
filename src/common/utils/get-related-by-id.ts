export const getRelatedById = <T>(
  ids: string[],
  getItemById: (id: string) => T | undefined,
): T[] => {
  return ids.reduce((list, id) => {
    const item = getItemById(id);

    if (!item) return list;

    return [
      ...list,
      item,
    ];
  }, [] as T[])
};
