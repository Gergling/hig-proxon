import { Temporal } from "temporal-polyfill";
import { MuscleGroupSetActivity, SetProgressionStatus } from "../../../types";
import { StandardReducer } from "../../../types/common";
import { getSplicedStatuses } from "../utils/get-spliced-statuses";

export const reduceMuscleGroupEMSStatuses: StandardReducer<
  {
    date7DaysPrior: Temporal.PlainDate;
    ems0ntn: number;
    statuses: SetProgressionStatus[];
  },
  MuscleGroupSetActivity
> = (
  aggregation,
  {
    date,
    exercise,
    focus,
    status: {
      progression,
      validity,
    }
  }
) => {
  const { date7DaysPrior } = aggregation;
  if (
    Temporal.PlainDate.compare(date7DaysPrior, date) < 0 &&
    validity !== 'valid'
  ) return aggregation;

  const addedEMS = focus ? 1 : 0.5;
  const ems0ntn = aggregation.ems0ntn + addedEMS;
  const statuses = progression === 'first'
    ? aggregation.statuses
    : getSplicedStatuses(aggregation.statuses, progression);

  return {
    date7DaysPrior,
    ems0ntn,
    statuses,
  };
};
