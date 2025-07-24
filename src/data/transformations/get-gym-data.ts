import { Temporal } from "temporal-polyfill";
import { getSetValidityStatus } from "../../gym-trips/get-set-validity-status";
import { GymSetResponseDTO } from "../../notion-sdk/dbs/gym-set";
import { DTOProps, GymExerciseSet, GymTripProps } from "../../types";
import { getExercises } from "./get-exercises";
import { getSetProgressionTracker } from "./utils/get-set-progression-tracker";
import { getSetWithProgression } from "./utils/get-set-with-progression";
import { getSetListReport } from "./utils/get-set-list-report";
import { getExerciseSetLookup, getStrategyLookup } from "../lookups";

export const getGymData = (dtos: DTOProps) => {
  const {
    addActivity,
    getBreakdown: getExerciseBreakdown,
    getExerciseById,
    getMuscleGroups,
    ...exerciseFunctions
  } = getExercises(dtos);
  const {
    sets: setDTOs,
    strategies: strategyDTOs,
    trips: tripDTOs,
  } = dtos;
  const {
    getStrategyById,
  } = getStrategyLookup(strategyDTOs);
  const getSet = ({
    id,
    properties: {
      challenge,
      exerciseIds: [exerciseId, ...erroneousExerciseIds],
      gymSetStrategyIds: [strategyId, ...erroneousStrategyIds],
      reps,
      units: { name: units },
    },
  }: GymSetResponseDTO): GymExerciseSet => {
    // TODO: The exercises and gym strategies CAN be empty.
    // Ideally we should at least output a console log here.
    // Ultimately though, we should be flagging the record in Notion
    // with a data impurity.
    const strategy = getStrategyById(strategyId);
    if (!strategy) throw new Error(`No strategy for id '${strategyId}' found.`);
    const exercise = getExerciseById(exerciseId);
    if (!exercise) throw new Error(`No exercise for id '${exerciseId}' found.`);
    const validity = getSetValidityStatus(reps || 0, strategy.minimum);

    return {
      challenge: challenge || 0,
      exercise,
      id,
      reps: reps || 0,
      strategy,
      units,
      validity,
    };
  };

  const { getExerciseSetById } = getExerciseSetLookup(setDTOs, getSet);
  const gymTrips: GymTripProps[] = [];
  const { addSet, start } = getSetProgressionTracker();

  // NOTE: It is important that we note the assumption that these are in
  // ascending date order, as the progression calculations will be difficult otherwise.

  // Get the trips and relate the sets.
  // Also need to relate the set progression.
  tripDTOs.forEach(({
    id,
    properties: {
      gymSetIds,
      visitTime
    },
  }) => {
    if (!visitTime) {
      console.error(`Missing gym visit time found with trip id: '${id}'`);
      return;
    }

    const visitDate = Temporal.PlainDate.from(visitTime.start);

    start(visitDate);

    const sets = gymSetIds.map((gymSetId): GymExerciseSet => {
      const setWithoutProgression = getExerciseSetById(gymSetId);
      if (!setWithoutProgression) throw new Error(`No set for id '${gymSetId}' found.`);
      const progression = addSet(setWithoutProgression);
      const setWithProgression = getSetWithProgression(setWithoutProgression, progression);

      // Add this set to the muscle group activity.
      addActivity(setWithProgression, visitDate);

      return setWithProgression;
    });

    // TODO: This function is an aggregator and should be categorised as such.
    const {
      ems,
      status,
      tqi,
    } = getSetListReport(sets);

    const trip: GymTripProps = {
      muscleScore: ems,
      sets,
      status,
      tqi,
      visitDate,
    };

    gymTrips.push(trip);

    // TODO: In theory we can update the relevant muscle groups with a set
    // status from here. Also the focus/stabilisation muscle groups.
  });

  return {
    ...exerciseFunctions,
    getExerciseBreakdown,
    getMuscleGroups,
    gymTrips,
  };
};
