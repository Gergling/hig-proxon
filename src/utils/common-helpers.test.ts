import { getMiddleItem } from "./common-helpers";

describe("getMiddleItem", () => {
  // Test case for an array with an odd number of items.
  // The function should return the single middle element.
  it("should return the middle item of an array with an odd number of elements", () => {
    const oddArray = [10, 20, 30, 40, 50];
    expect(getMiddleItem(oddArray)).toBe(30);
  });

  // Test case for an array with an even number of items.
  // The function uses Math.floor, so it should return the second of
  // the two middle elements, as they are indexed 0-3, and 4 items
  // divided by 2 is 2, so out of items 0,1,2,3, 2 will be selected.
  it("should return the first of the two middle items for an even-numbered array", () => {
    const evenArray = ["apple", "banana", "cherry", "date"];
    expect(getMiddleItem(evenArray)).toBe("cherry");
  });

  // Test case for an array with a single item.
  // The function should correctly return that item.
  it("should return the only item for a single-element array", () => {
    const singleItemArray = [99];
    expect(getMiddleItem(singleItemArray)).toBe(99);
  });

  // Test case for an empty array.
  // The function should return undefined, as there is no middle item.
  it("should return undefined for an empty array", () => {
    const emptyArray: any[] = [];
    expect(getMiddleItem(emptyArray)).toBeUndefined();
  });

  // Test case to ensure the function works with various data types.
  it("should work correctly with a mix of data types", () => {
    const mixedArray = [true, "hello", 123, { id: 1 }];
    expect(getMiddleItem(mixedArray)).toBe(123);
  });
});
