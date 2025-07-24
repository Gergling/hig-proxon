import { Temporal } from "temporal-polyfill";
import { getRelatedById } from "../../common/utils";
import { DTOProps, Equipment, ExerciseMuscleGroup, GymExercise, GymExerciseSet, MuscleGroup, MuscleGroupSetActivity, SetProgressionStatus, SetProgressionStatusFirst } from "../../types";
import { getExercise } from "./dto";
import { getEquipmentLookup, getMuscleGroupLookup } from "../lookups";
import { ExerciseActivityMapping } from "../types/exercises";
import { getFavouriteExercises as getFavouriteExercisesBase, reduceActivity } from "./aggregators/activity";
import { RecencyBiasCriteria } from "../types/recency-bias";
import { getRecencyBiasedThresholds } from "../../utils/time-helpers";
import { getRecencyFactor } from "./calculations/get-recency-factor";
import { getSpliced } from "../../common/utils/get-spliced";
import { getProgressionStatusComparison } from "./utils/get-progression-status-comparison";
import { compareExercisesByEMSFactory } from "./calculations/compare-exercises";
import { Comparison, getOrder, Order, ORDER_VALUES } from "../../common/comparison";
import { getInitialObject } from "../../common/utils/get-initial-object";
import { allSetProgressionStatuses } from "../../constants/gym";
import { ProposedProp, ViewExerciseBreakdown, ViewExerciseItem } from "../types";
import { getMappedOrderArray } from "../../common/utils/get-mapped-order-array";
import { getExerciseBreakdown } from "./mappers/gym-exercise-breakdown";

type ProgressionStatus = SetProgressionStatus | SetProgressionStatusFirst;
const ascendingProgressionStatuses: ProgressionStatus[] = ['first', ...[...allSetProgressionStatuses].reverse()];
const ascendingStatusMapping = getMappedOrderArray(ascendingProgressionStatuses);
const getComparisonFromNumber = (comparisonNumber: number): Comparison => {
  if (comparisonNumber < 0) return -1;
  if (comparisonNumber > 0) return 1;
  return 0;
}
const getAscendingProgressionStatusComparison = (
  a: ProgressionStatus,
  b: ProgressionStatus,
): Comparison => {
  const idxA = ascendingStatusMapping[a];
  const idxB = ascendingStatusMapping[b];
  return getComparisonFromNumber(idxB - idxA);
};


export const getExercises = ({
  equipment: equipmentData,
  exercises: exercisesDTOs,
  muscleGroups: muscleGroupData,
}: Pick<DTOProps, 'equipment' | 'exercises' | 'muscleGroups'>): {
  addActivity: (set: GymExerciseSet, date: Temporal.PlainDate) => void;
  exercises: GymExercise[];

  getBreakdown: () => ViewExerciseBreakdown;
  getExerciseById: (id: string) => GymExercise | undefined;
  getFavouriteExercises: () => GymExercise[];
  getMostRecentActivityDate: () => Temporal.PlainDate | undefined;
  getMuscleGroupById: (id: string) => MuscleGroup | undefined;
  getMuscleGroups: () => MuscleGroup[];
} => {
  const recencyCriteria: RecencyBiasCriteria[] = [
    { days: 7 },
    { days: 14 },
    { days: 30 },
    { months: 2 },
    { months: 3 },
  ];
  const exerciseMapping: {
    [id: string]: GymExercise;
  } = {};
  const exercises: GymExercise[] = [];
  let exerciseActivity: ExerciseActivityMapping = {};
  let mostRecentActivityDate: Temporal.PlainDate | undefined = undefined;

  const {
    getEquipmentById,
  } = getEquipmentLookup(equipmentData);
  const {
    addMuscleGroupActivity,
    getMuscleGroups,
    getMuscleGroupById,
  } = getMuscleGroupLookup(muscleGroupData);
  const addActivity = (
    set: GymExerciseSet,
    date: Temporal.PlainDate
  ) => {
    const updates = reduceActivity({
      exerciseActivity,
      mostRecentActivityDate
    }, {
      date,
      set,
    });
    
    addMuscleGroupActivity(set, date);
    exerciseActivity = updates.exerciseActivity;
    mostRecentActivityDate = updates.mostRecentActivityDate;
  };
  const getMuscleGroupFactory = (focus: boolean) => (id: string): ExerciseMuscleGroup | undefined => {
    const muscleGroup = getMuscleGroupById(id);

    if (!muscleGroup) return undefined;

    return { muscleGroup, focus };
  };
  const getExerciseById = (id: string): GymExercise | undefined => exerciseMapping[id];
  const getMostRecentActivityDate = () => mostRecentActivityDate;
  const getFavouriteExercises = (): GymExercise[] => {
    if (!mostRecentActivityDate) return [];
    const thresholdDates = getRecencyBiasedThresholds(recencyCriteria, mostRecentActivityDate);
    return getFavouriteExercisesBase(exerciseActivity, thresholdDates);
  };
  const getBreakdown = (): ViewExerciseBreakdown => {
    // TODO: Instead of getting the favourites and then putting them in
    // here, we should use this function to get the favourites.
    // Obviously without activity the list will be empty, but this
    // function is designed to handle no activity and still output a
    // breakdown.
    const favourites = getFavouriteExercises();
    const muscleGroups = getMuscleGroups();
    return getExerciseBreakdown(
      favourites,
      mostRecentActivityDate,
      muscleGroups,
    );
  };

  exercisesDTOs.forEach((exerciseDataItem) => {
    const {
      equipmentNeededIds,
      // TODO: Probably should be part of the GYM-EMS-0-NTN standard, but
      // then maybe that's not required.
      id,
      primaryMuscleGroupsIds,
      stabiliserMuscleGroupsIds,
      name
    } = getExercise(exerciseDataItem);
    const exerciseEquipment = getRelatedById(
      equipmentNeededIds,
      getEquipmentById
    );

    // TODO: Figure out how to handle duplication, or whether there's any
    // point to doing so, since we'll want to move over to hardcoded ASAP.
    // const allRelatedMuscleGroupIds = [
    //   ...primaryMuscleGroupsIds,
    //   ...stabiliserMuscleGroupsIds
    // ];
    // const hasDuplicatedMuscleGroupIds = [...new Set(allRelatedMuscleGroupIds)].length !== allRelatedMuscleGroupIds.length;
    const focusMuscleGroups = getRelatedById(primaryMuscleGroupsIds, getMuscleGroupFactory(true));
    const stabiliserMuscleGroups = getRelatedById(stabiliserMuscleGroupsIds, getMuscleGroupFactory(false));
    const muscleGroups: ExerciseMuscleGroup[] = [
      ...focusMuscleGroups,
      ...stabiliserMuscleGroups,
    ];
    const ems0ntn = focusMuscleGroups.length + (stabiliserMuscleGroups.length / 2);

    
    const exercise: GymExercise = {
      id,
      equipment: exerciseEquipment,
      muscleGroups,
      ems0ntn,
      name,
    };
    
    exercises.push(exercise);
    exerciseMapping[id] = exercise;

    // Assign exercise to relevant muscle groups.
    const assignExerciseToMuscleGroup = (
      focus: boolean,
    ) => (
      { muscleGroup }: ExerciseMuscleGroup
    ) => {
      const mg = getMuscleGroupById(muscleGroup.id);
      if (mg) {
        mg.exercises.push({
          exercise,
          focus,
        });
        return;
      }

      console.error(`No muscle group for this id. Cannot assign to exercise. Or whatever.`);
    };
    focusMuscleGroups.forEach(assignExerciseToMuscleGroup(true));
    stabiliserMuscleGroups.forEach(assignExerciseToMuscleGroup(false));
  });

  return {
    addActivity,

    exercises,

    getBreakdown,
    getExerciseById,
    getFavouriteExercises,
    getMuscleGroups,
    getMostRecentActivityDate,
    getMuscleGroupById,
  };
};
