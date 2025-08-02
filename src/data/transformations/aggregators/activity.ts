import { Temporal } from "temporal-polyfill";
import { GymExerciseSet, GymTripProps, SetProgressionStatus } from "../../../types";
import { ExerciseActivityMapping } from "../../types/exercises";
import { StandardReducer } from "../../../types/common";
import { getRecencyBiasedWeekdays } from "../aggregators";
import { ViewAggregatedSetProgressionStatus, ViewVisit } from "../../types";
import { getSplicedStatuses } from "../utils/get-spliced-statuses";
import { getMiddleItem } from "../../../utils/common-helpers";
import { getMAI } from "../calculations/indexes";
import { AggregatedMonthlyActivity } from "../types/gym";

type ReduceActivityState = {
  exerciseActivity: ExerciseActivityMapping;
  mostRecentActivityDate: Temporal.PlainDate | undefined;
};
type ReduceActivityAction = {
  date: Temporal.PlainDate;
  set: GymExerciseSet;
};
const reduceActivityDates: StandardReducer<
  Temporal.PlainDate[],
  Temporal.PlainDate
> = (
  dates,
  date,
) => {
  return [
    ...(dates || []),
    date,
  ];
};
export const reduceActivity: StandardReducer<
  ReduceActivityState,
  ReduceActivityAction
> = (
  state: ReduceActivityState,
  {
    date,
    set,
  }: ReduceActivityAction
): ReduceActivityState => {
  const { exercise } = set;
  const { id } = exercise;

  const mostRecentActivityDate = state.mostRecentActivityDate
    && Temporal.PlainDate.compare(date, state.mostRecentActivityDate) > 0
    ? state.mostRecentActivityDate
    : date;

  const exerciseActivity = {
    ...state.exerciseActivity,
    [id]: {
      dates: reduceActivityDates(
        state.exerciseActivity[id]?.dates || [],
        date
      ),
      exercise,
    },
  };

  return {
    exerciseActivity,
    mostRecentActivityDate,
  };
};
// const addActivity = (
//   callbackReducer: StandardReducer<
//     ReduceActivityState,
//     ReduceActivityAction
//   >,
// ) => (
//   set: GymExerciseSet,
//   date: Temporal.PlainDate,
//   state: ReduceActivityState,
// ) => {
//   const newState = reduceActivity(state, {
//     date,
//     set,
//   });

//   return callbackReducer(newState, {
//     date,
//     set,
//   });
// };

export const getFavouriteExercises = (
  exerciseActivity: ExerciseActivityMapping,
  thresholdDates: Temporal.PlainDate[],
) => Object
  .values(exerciseActivity)
  .map(({
    dates,
    ...exerciseDataItem
  }) => {
    const medianDayOfWeek = getRecencyBiasedWeekdays(dates, thresholdDates);

    return {
      ...exerciseDataItem,
      medianDayOfWeek,
    };
  })
  .sort((one, two) => {
    if (one.medianDayOfWeek === undefined) return 1;
    if (two.medianDayOfWeek === undefined || one.medianDayOfWeek < two.medianDayOfWeek) return -1;
    if (one.medianDayOfWeek > two.medianDayOfWeek) return 1;
    return 0;
  })
  .map(({ exercise }) => exercise);

// Visits MUST be the last 7 days, AND should spit out an overall
// status.

export const reduceLast7DaysTrips: StandardReducer<
  {
    dateThreshold: Temporal.PlainDate;
    statuses: SetProgressionStatus[];
    undefinedStatuses: undefined[];
    visits: ViewVisit[];
  },
  GymTripProps
> = (
  state,
  {
    status,
    muscleScore: ems0ntn,
    visitDate: date,
  }
) => {
  const {
    dateThreshold,
    statuses,
    visits,
  } = state;

  if (Temporal.PlainDate.compare(dateThreshold, date) < 0) return state;

  if (!status) {
    return {
      ...state,
      undefinedStatuses: [...state.undefinedStatuses, status],
    };
  }

  return {
    dateThreshold,
    statuses: getSplicedStatuses(statuses, status),
    undefinedStatuses: state.undefinedStatuses,
    visits: [
      ...visits,
      {
        date,
        ems0ntn,
        status,
      }
    ],
  };
};

export const getLast7DaysActivity = (
  gymTrips: GymTripProps[],
  mostRecentActivityDate: Temporal.PlainDate | undefined,
) => {
  // TODO: Consider a separate function for this part. We can put in
  // the most recent activity date (whether undefined or not) and the
  // array of gym trips. The return should be the status and the array
  // of view visits. The wrapper should be an aggregator but doesn't
  // need to be a reducer.
  const initial7DayData = {
    statuses: [] as SetProgressionStatus[],
    undefinedStatuses: [] as undefined[],
    visits: [] as ViewVisit[],
  };
  const {
    statuses,
    visits,
  } = mostRecentActivityDate ? gymTrips.reduce(
    reduceLast7DaysTrips,
    {
      ...initial7DayData,
      dateThreshold: mostRecentActivityDate,
    }
  ) : initial7DayData;
  const status: ViewAggregatedSetProgressionStatus = getMiddleItem(statuses) || 'none';

  return {
    status,
    visits,
  };
};

export const getMonthlyActivity = (
  trips: GymTripProps[]
): AggregatedMonthlyActivity[] => {
  const {
    sumMonthlyActivity
  } = trips.reduce(
    (
      reduced,
      trip
    ) => {
      const { visitDate } = trip;

      // Key data.
      const month = Temporal.PlainYearMonth.from(visitDate);
      const key = month.toString();
      const monthActivity: AggregatedMonthlyActivity = reduced.sumMonthlyActivity[key] || {
        mai: 0,
        month,
        msi: 0,
        count: 0,
      };
      
      // Value data.
      const count = monthActivity.count + 1;
      const {
        mai,
        msi,
      } = getMAI(reduced.last7DaysTrips, trip);

      return {
        ...reduced, // Remove this
        sumMonthlyActivity: {
          ...reduced.sumMonthlyActivity,
          [key]: {
            ...monthActivity,
            count,
            mai: mai + monthActivity.mai,
            msi: msi + monthActivity.msi,
          },
        },
      };
    },
    {
      last7DaysTrips: [] as GymTripProps[],
      sumMonthlyActivity: {} as { [K: string]: AggregatedMonthlyActivity; }
    }
  );

  return Object.values(sumMonthlyActivity).map(({
    count,
    mai,
    msi,
    ...monthlyActivity
  }) => {
    return {
      count,
      mai: mai / count,
      msi: msi / count,
      ...monthlyActivity,
    }
  });
};
