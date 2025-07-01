import { getLookup } from "./get-lookup";

type FinderMapping<DTO> = {
  [byXYZ: string]: (dto: DTO) => string;
};

describe('getLookup', () => {
  // Define mock DTO and T types for the test
  interface MockDTO {
    id: string;
    name: string;
    category: string;
    value: number;
  }

  interface MockT {
    itemId: string;
    itemName: string;
    itemCategory: string;
  }

  // Mock data
  const mockData: MockDTO[] = [
    { id: 'dto1', name: 'Item One', category: 'A', value: 10 },
    { id: 'dto2', name: 'Item Two', category: 'B', value: 20 },
    { id: 'dto3', name: 'Item Three', category: 'A', value: 30 },
  ];

  // Mock map function
  const mockMap = (dto: MockDTO): MockT => ({
    itemId: dto.id,
    itemName: dto.name,
    itemCategory: dto.category,
  });

  // Mock unique finder mapping
  const mockUniqueFinder: FinderMapping<MockDTO> = {
    byId: (dto) => dto.id,
    byName: (dto) => dto.name,
  };

  // Mock index finder mapping (for categories, assuming it's an index by category)
  // Note: The provided `getLookup` implementation only populates `uniqueMapping`.
  // If `index` is passed, its mappings won't be filled by the current forEach loop in `getLookup`.
  // We'll test its current behavior where it's effectively empty.
  const mockIndexFinder: FinderMapping<MockDTO> = {
    byCategory: (dto) => dto.category,
  };

  it('should correctly populate the items array', () => {
    const { items } = getLookup(mockData, mockMap, mockUniqueFinder);
    expect(items).toHaveLength(mockData.length);
    expect(items[0]).toEqual({ itemId: 'dto1', itemName: 'Item One', itemCategory: 'A' });
    expect(items[1]).toEqual({ itemId: 'dto2', itemName: 'Item Two', itemCategory: 'B' });
  });

  describe('getByUnique', () => {
    it('should correctly retrieve an item by a unique key', () => {
      const { getByUnique } = getLookup(mockData, mockMap, mockUniqueFinder);

      const itemById = getByUnique('byId')('dto1');
      expect(itemById).toEqual({ itemId: 'dto1', itemName: 'Item One', itemCategory: 'A' });

      const itemByName = getByUnique('byName')('Item Two');
      expect(itemByName).toEqual({ itemId: 'dto2', itemName: 'Item Two', itemCategory: 'B' });
    });

    it('should return undefined for a non-existent unique key', () => {
      const { getByUnique } = getLookup(mockData, mockMap, mockUniqueFinder);
      const nonExistentItem = getByUnique('byId')('nonExistentId');
      expect(nonExistentItem).toBeUndefined();
    });

    it('should throw an error if the unique finder key does not exist', () => {
      const { getByUnique } = getLookup(mockData, mockMap, mockUniqueFinder);
      // This scenario is actually caught by the `getBy` function if uniqueMapping[finderKey] doesn't exist
      // or if getByFactory is called with a non-existent top-level key.
      // getByFactory needs to be tested separately or its behavior understood.
      // Given getByFactory's definition, if 'nonExistentFinder' is passed, mapping['nonExistentFinder'] will be undefined
      // leading to an attempt to access properties of undefined, thus throwing.
      expect(() => getByUnique('nonExistentFinder')('someId')).toThrow(`No such finderKey 'nonExistentFinder' for mapping.`);
    });
  });

  // // Not implemented yet. Purely theoretical.
  // describe.skip('getByIndex', () => {
  //   // IMPORTANT NOTE: The provided `getLookup` function's forEach loop
  //   // currently only populates `uniqueMapping`. The `indexMapping` object
  //   // remains empty. This test reflects that current behavior.
  //   it('should return undefined when attempting to retrieve by an index key (due to current implementation)', () => {
  //     const { getByIndex } = getLookup(mockData, mockMap, mockUniqueFinder, mockIndexFinder);

  //     // Accessing byCategory will access an empty object and return undefined
  //     const itemsByCategory = getByIndex('byCategory')('A');
  //     expect(itemsByCategory).toBeUndefined();
  //   });

  //   it('should throw an error if the index finder key does not exist', () => {
  //       const { getByIndex } = getLookup(mockData, mockMap, mockUniqueFinder, mockIndexFinder);
  //       expect(() => getByIndex('nonExistentIndexFinder')('someCategory')).toThrow();
  //   });
  // });

  // describe('with index parameter undefined', () => {
  //   it('should handle undefined index gracefully for indexMappingKeys', () => {
  //     // Ensure it doesn't throw errors when `index` is undefined
  //     const { getByIndex } = getLookup(mockData, mockMap, mockUniqueFinder, undefined);
  //     // const { getBy } = getLookup(mockData, mockMap, mockUniqueFinder, undefined);

  //     expect(() => getByIndex('byCategory')('A')).toThrow(); // Still throws because getByFactory needs a valid object
  //     // For getBy, it will correctly go through the unique path if possible, or throw
  //     // expect(() => getBy('nonExistentKey')('someId')).toThrow("No keys named 'nonExistentKey'.");
  //   });
  // });

  // TODO: Add tests for populating indexMapping once the `getLookup` function is updated to do so.
  // Example of what such a test might look like:
  /*
  describe('getByIndex - fully implemented', () => {
    // This requires updating the `getLookup` function to actually populate `indexMapping`.
    // Assuming you add a loop for `index` similar to `unique`.
    const mockIndexFinderPopulated: FinderMapping<MockDTO> = {
      byCategory: (dto) => dto.category,
    };

    // A modified getLookup would look something like this to populate `indexMapping`:
    // (Inside getLookup, after uniqueMapping population)
    // data.forEach((dtoItem) => {
    //   const item = map(dtoItem);
    //   Object.entries(index || {}).forEach(([finderKey, getKey]) => {
    //     const key = getKey(dtoItem);
    //     if (!indexMapping[finderKey]) {
    //       indexMapping[finderKey] = {};
    //     }
    //     if (!indexMapping[finderKey][key]) {
    //       indexMapping[finderKey][key] = [];
    //     }
    //     indexMapping[finderKey][key].push(item);
    //   });
    // });

    it('should correctly retrieve items by an index key', () => {
      // You'd need to mock the `getLookup` to actually populate `indexMapping` for this test
      // or update your actual `getLookup` function.
      const { getByIndex } = getLookup(mockData, mockMap, mockUniqueFinder, mockIndexFinderPopulated);
      const itemsByCategoryA = getByIndex('byCategory')('A');
      expect(itemsByCategoryA).toHaveLength(2);
      expect(itemsByCategoryA).toContainEqual({ itemId: 'dto1', itemName: 'Item One', itemCategory: 'A' });
      expect(itemsByCategoryA).toContainEqual({ itemId: 'dto3', itemName: 'Item Three', itemCategory: 'A' });
    });
  });
  */
});
