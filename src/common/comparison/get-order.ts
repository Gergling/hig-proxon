import { Comparison, Order } from "./types";

export const getOrder = (
  order: Order,
) => (
  isFirstThenSecond: boolean,
): Comparison => {
  if (order === 'asc') {
    if (isFirstThenSecond) return -1;

    return 1;
  }

  if (isFirstThenSecond) return 1;

  return -1;
}
