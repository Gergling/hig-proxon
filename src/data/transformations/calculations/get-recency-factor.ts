import { Temporal } from "temporal-polyfill";

export const getRecencyFactor = (
  date: Temporal.PlainDate,
  thresholdDates: Temporal.PlainDate[],
) => thresholdDates.reduce(
  (
    totalWithinThreshold,
    thresholdDate
  ) => totalWithinThreshold + Temporal.PlainDate
    .compare(date, thresholdDate) < 0
      ? 1
      : 0,
  0
);