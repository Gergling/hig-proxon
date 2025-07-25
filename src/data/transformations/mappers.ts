import { Temporal } from "temporal-polyfill";
import { GymTripProps, MuscleGroup, MuscleGroupSetActivity, SetProgressionStatus } from "../../types";
import { ViewAggregatedSetProgressionStatus, ViewMuscleGroup, ViewVisit } from "../types";
import { getMostRecentDate } from "./aggregators";
import { getSplicedStatuses } from "./utils/get-spliced-statuses";
import { getMiddleItem } from "../../utils/common-helpers";
import { reduceMuscleGroupEMSStatuses } from "./aggregators/muscle-groups";

export const getViewVisit = ({
  muscleScore: ems0ntn,
  status,
  visitDate: date,
}: GymTripProps): ViewVisit => ({
  date,
  ems0ntn,
  status,
});

type ViewMuscleGroupProps = Omit<ViewMuscleGroup, 'activity'> & {
  activity: {
    ems0ntn: ViewMuscleGroup['activity']['ems0ntn'];
  };
};

export const getViewMuscleGroup = (
  {
    activity,
    name,
  }: MuscleGroup,
  mostRecentDate: Temporal.PlainDate | undefined,
): ViewMuscleGroupProps => {
  // TODO: Find a list of favourite exercises from the individual
  // activity items. For this, we need to loop the activity.

  if (!mostRecentDate) return {
    activity: {
      ems0ntn: 0,
    },
    name,
    status: 'none',
  };

  const date7DaysPrior = mostRecentDate.subtract({ days: 7 });
  const {
    ems0ntn,
    statuses,
  } = activity.reduce(
    reduceMuscleGroupEMSStatuses,
    {
      date7DaysPrior,
      ems0ntn: 0,
      statuses: [] as SetProgressionStatus[],
    }
  );
  const status: ViewAggregatedSetProgressionStatus = getMiddleItem(statuses) || 'none';

  return {
    activity: {
      ems0ntn,
    },
    name,
    status,
  };
};
