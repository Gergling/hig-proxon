import { Temporal } from "temporal-polyfill";
import { SetProgressionStatus } from "../../types";

type ViewAggregatedSetProgressionStatus = SetProgressionStatus | 'none';

type ViewExerciseMuscleGroup = {
  activity: number;
  name: string;
};

type ViewExerciseItem = {
  activity: {
    exercise: number;
    muscleGroups: number;
  };
  muscleGroups: ViewExerciseMuscleGroup[];
  name: string;
};

type ViewExerciseBreakdown = {
  // The exercises trained most frequently, and earliest in the week. Can be recency-biased from a total number of sets.
  favourites: ViewExerciseItem[];
  // Assuming the favourites will be trained, what should be considered?
  proposed: ViewExerciseItem[];
};

type ViewMuscleGroupBreakdown = {
  activity: {
    // This will be the EMS but in comparison to the total EMS for the week.
    contribution: number;
    ems0ntn: number;
  };
  status: ViewAggregatedSetProgressionStatus;
};

type ViewProcessDeadlineStatus =
  | 'dormant'
  | 'slow'
  | 'overdue'
  | 'today'
  | 'tomorrow'
  | 'on-track'
;

export type ViewProcessDeadlineStatusLabels = {
  [key in ViewProcessDeadlineStatus]: string;
};

type ViewVisit = {
  date: Temporal.PlainDate;
  ems0ntn: number;
  status: SetProgressionStatus;
};

type ViewProcessDeadline = {
  date?: Temporal.PlainDate;
  status: ViewProcessDeadlineStatus;
  statusLabel: string;
};

type ViewProcess = {
  deadline: ViewProcessDeadline;
  ems0ntn: number;
  status: ViewAggregatedSetProgressionStatus;
  visits: ViewVisit[];
};

export type View = {
  exercise: ViewExerciseBreakdown;
  muscles: ViewMuscleGroupBreakdown;
  process: ViewProcess;
};
