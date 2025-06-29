import { SetProgressionStatus } from "../../types";
import { getProgressionStatusComparison } from "./get-progression-status-comparison";

const initialProgressionStatuses: SetProgressionStatus[] = [];

export const getSplicedStatuses = (
  statuses: SetProgressionStatus[],
  insert: SetProgressionStatus,
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
