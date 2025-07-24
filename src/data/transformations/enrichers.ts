import { Temporal } from "temporal-polyfill";
import { MuscleGroup } from "../../types";
import { ViewMuscleGroup, ViewMuscleGroupInterim } from "../types";
import { getViewMuscleGroup } from "./mappers";

/**
 * Takes an array of muscle group data with activity and "maps" into an
 * array of viewable muscle group data with %age contributions based on
 * the last 7 days of activity.
 *
 * @param muscleGroups An array of MuscleGroup objects.
 * @returns An array of ViewMuscleGroup objects.
 */
export const getViewMuscleGroups = (
  muscleGroups: MuscleGroup[],
  mostRecentActivityDate: Temporal.PlainDate | undefined,
): {
  ems0ntn: number;
  muscles: ViewMuscleGroup[];
} => {
  const {
    data,
    ems0ntn,
  } = muscleGroups.reduce(
    (
      {
        data,
        ems0ntn,
      },
      muscleGroup
    ) => {
      const muscleGroupData = getViewMuscleGroup(muscleGroup, mostRecentActivityDate);
      const { activity } = muscleGroupData;

      return {
        data: [...data, muscleGroupData],
        ems0ntn: ems0ntn + activity.ems0ntn,
      }
    },
    {
      data: [] as ViewMuscleGroupInterim[],
      ems0ntn: 0,
    }
  );

  const muscles = data.map(({ activity, ...item }): ViewMuscleGroup => {
    const contribution = activity.ems0ntn / ems0ntn;
    return ({
      ...item,
      activity: {
        contribution,
        ems0ntn,
      },
    });
  });

  return {
    ems0ntn,
    muscles,
  };
};
