type FinderMapping<DTO> = {
  [byXYZ: string]: (dto: DTO) => string;
};

const getByFactory = <T>(mapping: {
  [categoryKey: string]: {
    [getKey: string]: T;
  };
}) => (finderKey: keyof typeof mapping) => {
  if (!mapping[finderKey]) throw new Error(`No such finderKey '${finderKey}' for mapping.`);
  return (id: string): T | undefined => {
    return mapping[finderKey][id];
  };
};

export const getLookup = <DTO, T>(
  data: DTO[],
  map: (dto: DTO) => T,
  unique: FinderMapping<DTO>,
  // TODO: To implement if we need it.
  // index?: FinderMapping<DTO>,
) => {
  type UniqueMapKey = keyof typeof unique;

  const uniqueMapping: {
    [categoryKey: UniqueMapKey]: {
      [getKey: string]: T;
    };
  } = {};
  // TODO: Handle where index is undefined.
  // const indexMapping: {
  //   [categoryKey: string]: {
  //     [getKey: string]: T[];
  //   };
  // } = {};
  const items: T[] = [];
  const getByUnique = getByFactory<T>(uniqueMapping);
  // const getByIndex = getByFactory<T[]>(indexMapping);

  const getItems = (): T[] => items;

  data.forEach((dtoItem) => {
    // TODO: Optional function to check validity beforehand and simply omit
    // items if they aren't. This will mean it can handle sets without assigned
    // reps, challenge or units.
    const item = map(dtoItem);
    items.push(item);
    Object.entries(unique).forEach(([finderKey, getKey]) => {
      const key = getKey(dtoItem);
      if (!uniqueMapping[finderKey]) {
        uniqueMapping[finderKey] = {};
      }
      uniqueMapping[finderKey][key] = item;
    });
  });

  return {
    // getByIndex,
    getByUnique,
    getItems,
    items,
  };
};
