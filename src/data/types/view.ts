import { Temporal } from "temporal-polyfill";
import { SetProgressionStatus } from "../../types";
import { AggregatedMonthlyActivity } from "../transformations/types/gym";

export type ViewAggregatedSetProgressionStatus = SetProgressionStatus | 'none';

export type ProposedProp = 'priority' | 'supplemental';

type ViewExerciseMuscleGroup = {
  activity: number;
  name: string;
};

export type ViewExerciseItem = {
  ems0ntn: number;
  exerciseId: string;
  exerciseName: string;
  muscleGroups: ViewExerciseMuscleGroup[];
};

export type ProposedProps = {
  [key in ProposedProp]: ViewExerciseItem[];
};

export type ViewExerciseBreakdown = {
  // The exercises trained most frequently, and earliest in the week. Can be recency-biased from a total number of sets.
  favourites: string[];
  // Assuming the favourites will be trained, what should be considered?
  proposed: ProposedProps;
  // Should ideally include ranking by high EMS, but also low EMS.
};

export type ViewMuscleGroupInterim = {
  activity: {
    ems0ntn: number;
  };
  name: string;
  status: ViewAggregatedSetProgressionStatus;
};

export type ViewMuscleGroup = ViewMuscleGroupInterim & {
  activity: ViewMuscleGroupInterim['activity'] & {
    // This will be the EMS but in comparison to the total EMS for the week.
    contribution: number;
  };
};

export type ViewMuscleGroups = {
  favourites: ViewMuscleGroup[];
  highestContribution: number;
  priority: ViewMuscleGroup[];
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

export type ViewVisit = {
  date: Temporal.PlainDate;
  ems0ntn: number;
  status: SetProgressionStatus | undefined;
};

export type ViewProcess = {
  ems0ntn: number;
  status: ViewAggregatedSetProgressionStatus;
  visits: ViewVisit[];
};

export type ViewAchievement = {
  date: Temporal.PlainDate;
  description: string;
  precedented: boolean;
  goalType: 'process' | 'performance' | 'outcome';
};

export type View = {
  achievements: ViewAchievement[];
  exercise: ViewExerciseBreakdown;
  lastUpdatedTime: string;
  monthlyActivity: AggregatedMonthlyActivity[];
  muscles: ViewMuscleGroups;
  process: ViewProcess;
};
