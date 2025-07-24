export const getSpliced = <T>(
  accumulated: T[],
  insert: T,
  compare: (one: T, two: T) => -1 | 0 | 1,
): T[] => {
  const initialValues: T[] = [];
  const { top, bottom } = accumulated.reduce(
    (
      {
        top,
        bottom,
      },
      comparativeItem
    ) => {
      const comparison = compare(
        comparativeItem,
        insert,
      );

      if (comparison > 0) {
        return {
          top: [...top, comparativeItem],
          bottom,
        };
      }

      return {
        top,
        bottom: [...bottom, comparativeItem],
      };
    }, {
      top: initialValues,
      bottom: initialValues,
    }
  );

  return [
    ...top,
    insert,
    ...bottom,
  ];
};
