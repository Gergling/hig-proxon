import { ExerciseEquipmentDatabase, ExerciseEquipmentQueryResponse, ExerciseEquipmentResponseDTO } from "../notion-sdk/dbs/exercise-equipment";
import { ExercisesDatabase, ExercisesQueryResponse, ExercisesResponseDTO } from "../notion-sdk/dbs/exercises";
import { GymSetDatabase, GymSetQueryResponse, GymSetResponseDTO } from "../notion-sdk/dbs/gym-set";
import { GymSetStrategyDatabase, GymSetStrategyQueryResponse, GymSetStrategyResponseDTO } from "../notion-sdk/dbs/gym-set-strategy";
import { GymTripLogDatabase, GymTripLogQueryResponse, GymTripLogResponseDTO } from "../notion-sdk/dbs/gym-trip-log";
import { MuscleGroupsDatabase, MuscleGroupsQueryResponse, MuscleGroupsResponseDTO } from "../notion-sdk/dbs/muscle-groups";
import { DTOProps } from "../types";
import { getDBs } from "./get-db";

// class GenericDB<> {
  
// }
// class GenericDTO<> {

// }

// const getDTOs = <QueryResponse>(
//   queryResponse: QueryResponse
// ) => queryResponse.results.map((r) => new GymTripLogResponseDTO(r))

// const reduceMapping = <QueryResponse extends DatabaseQueryResponse, ItemResponse, ItemDTO>(
//   mapping: unknown,
//   key: string,
//   query: () => Promise<QueryResponse>,
//   dto: (item: ItemResponse) => ItemDTO,
// ) => {
//   query().then((queryResponse) => {
//     queryResponse.results.map(dto);
//   });
// };

    // equipmentDB: new ExerciseEquipmentDatabase({ notionSecret }),
// type NTNDatabase = ExerciseEquipmentDatabase
//   | ExercisesDatabase
//   | GymSetDatabase
//   | GymSetStrategyDatabase
//   | MuscleGroupsDatabase
//   | GymTripLogDatabase;

// type NTNQueryResponse = ExerciseEquipmentQueryResponse
//   | ExercisesQueryResponse
//   | GymSetQueryResponse
//   | GymSetStrategyQueryResponse
//   | MuscleGroupsQueryResponse
//   | GymTripLogQueryResponse;

// // type NTN

// const fetchSomething = <FetchResponse, DB, DTO>(
//   getDB: () => DB,
//   getDTO: (r: FetchResponse) => DTO,
// ) => {
//   const db = getDB();
//   return db.query({}).then((response) => {
//     return response.results.map(getDTO)
//   });
// }
const fetchEquipment = (notionSecret: string) => {
  const db = new ExerciseEquipmentDatabase({ notionSecret });
  return db.query({}).then((response) =>
    response.results.map((r) => new ExerciseEquipmentResponseDTO(r))
  );
}

export const fetchDTOs = async (): Promise<DTOProps> => {
  const {
    equipmentDB,
    exerciseDB,
    muscleGroupDB,
    setDB,
    strategyDB,
    tripDB,
  } = getDBs();
  // TODO: Concurrence is fine for these.
  // Also, might want to grab all the static data at once, so probably
  // get the raw lists and combine elsewhere.
  // const stuff: {
  //   dto: class;
  //   key: string;
  //   run: () => Promise<unknown>;
  // }[] = [];
  // const promises = [];
  const queryResponses = {
    equipment: await equipmentDB.query({}),
    exercise: await exerciseDB.query({}),
    muscleGroup: await muscleGroupDB.query({}),
    set: await setDB.query({}),
    strategy: await strategyDB.query({}),
    trip: await tripDB.query({
      sorts: [{ property: 'visitTime', direction: 'ascending' }],
    }),
  };
  // const exercise = await exerciseDB.query({}),
  // const muscleGroup = await muscleGroupDB.query({}),
  // const set = await setDB.query({}),
  // const strategy = await strategyDB.query({}),
  // const trip = await tripDB.query({
  //   sorts: [{ property: 'visitTime', direction: 'ascending' }],
  // });
  return {
    equipment: queryResponses.equipment.results.map((r) => new ExerciseEquipmentResponseDTO(r)),
    exercises: queryResponses.exercise.results.map((r) => new ExercisesResponseDTO(r)),
    muscleGroups: queryResponses.muscleGroup.results.map((r) => new MuscleGroupsResponseDTO(r)),
    sets: queryResponses.set.results.map((r) => new GymSetResponseDTO(r)),
    strategies: queryResponses.strategy.results.map((r) => new GymSetStrategyResponseDTO(r)),
    trips: queryResponses.trip.results.map((r) => new GymTripLogResponseDTO(r)),
  };
};
