import { SetProgressionStatus } from "../../../types";
import { StandardReducer } from "../../../types/common";
import { getProgressionStatusComparison } from "./get-progression-status-comparison";

const initialProgressionStatuses: SetProgressionStatus[] = [];

export const getSplicedStatuses: StandardReducer<
  SetProgressionStatus[],
  SetProgressionStatus
> = (
  statuses,
  insert,
): SetProgressionStatus[] => {
  const { better, notBetter } = statuses.reduce(({
    better,
    notBetter,
  }, comparativeStatus) => {
    const comparison = getProgressionStatusComparison(
      comparativeStatus,
      insert,
    );

    if (comparison > 0) {
      return {
        better: [...better, comparativeStatus],
        notBetter,
      };
    }

    return {
      better,
      notBetter: [...notBetter, comparativeStatus],
    };
  }, {
    better: initialProgressionStatuses,
    notBetter: initialProgressionStatuses,
  });

  return [
    ...better,
    insert,
    ...notBetter,
  ];
};
