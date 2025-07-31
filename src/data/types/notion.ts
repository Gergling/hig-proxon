import { QueryDatabaseResponse } from "../../notion-sdk/core/types/notion-api.types";
import { ExerciseEquipmentDatabase, ExerciseEquipmentQueryResponse, ExerciseEquipmentResponseDTO } from "../../notion-sdk/dbs/exercise-equipment";
import { ExercisesDatabase, ExercisesQueryResponse, ExercisesResponseDTO } from "../../notion-sdk/dbs/exercises";
import { GymSetDatabase, GymSetQueryResponse, GymSetResponseDTO } from "../../notion-sdk/dbs/gym-set";
import { GymSetStrategyDatabase, GymSetStrategyQueryResponse, GymSetStrategyResponseDTO } from "../../notion-sdk/dbs/gym-set-strategy";
import { GymTripLogDatabase, GymTripLogQueryResponse, GymTripLogResponseDTO } from "../../notion-sdk/dbs/gym-trip-log";
import { MuscleGroupsDatabase, MuscleGroupsQueryResponse, MuscleGroupsResponseDTO } from "../../notion-sdk/dbs/muscle-groups";
import { BaseConstructorFunction, DbQueryResponseType } from "../../types/utils";
import { DatabaseConstructor } from "../extraction/types";

type DbConstructor = DatabaseConstructor<any>;

export type DbQueryFactory<TDbClass extends DbConstructor> = (db: InstanceType<TDbClass>) => (
  start_cursor: string | undefined
) => Promise<DbQueryResponseType<InstanceType<TDbClass>>>;

type NotionExtractionMappingItem<
  TDbClass extends DbConstructor,
  TDtoClass extends BaseConstructorFunction<any, any>,
  // TODO: Can probably trash this.
  TQueryResponse = DbQueryResponseType<InstanceType<TDbClass>>,
> = {
  DbClass: TDbClass;
  DtoClass: TDtoClass;
  dbQueryFactory?: DbQueryFactory<TDbClass>;
};

const equipment: NotionExtractionMappingItem<
  typeof ExerciseEquipmentDatabase,
  typeof ExerciseEquipmentResponseDTO,
  ExerciseEquipmentQueryResponse
> = {
  DbClass: ExerciseEquipmentDatabase,
  DtoClass: ExerciseEquipmentResponseDTO,
};

const exercises: NotionExtractionMappingItem<
  typeof ExercisesDatabase,
  typeof ExercisesResponseDTO,
  ExercisesQueryResponse
> = {
  DbClass: ExercisesDatabase,
  DtoClass: ExercisesResponseDTO,
};
const muscleGroups: NotionExtractionMappingItem<
  typeof MuscleGroupsDatabase,
  typeof MuscleGroupsResponseDTO,
  MuscleGroupsQueryResponse
> = {
  DbClass: MuscleGroupsDatabase,
  DtoClass: MuscleGroupsResponseDTO,
};
const sets: NotionExtractionMappingItem<
  typeof GymSetDatabase,
  typeof GymSetResponseDTO,
  GymSetQueryResponse
> = {
  DbClass: GymSetDatabase,
  DtoClass: GymSetResponseDTO,
};
const strategies: NotionExtractionMappingItem<
  typeof GymSetStrategyDatabase,
  typeof GymSetStrategyResponseDTO,
  GymSetStrategyQueryResponse
> = {
  DbClass: GymSetStrategyDatabase,
  DtoClass: GymSetStrategyResponseDTO,
};
const trips: NotionExtractionMappingItem<
  typeof GymTripLogDatabase,
  typeof GymTripLogResponseDTO,
  GymTripLogQueryResponse
> = {
  DbClass: GymTripLogDatabase,
  DtoClass: GymTripLogResponseDTO,
  dbQueryFactory: (
    db: GymTripLogDatabase
  ) => (
    start_cursor: string | undefined
  ) => db.query({
    sorts: [{ property: 'visitTime', direction: 'ascending' }],
    start_cursor,
  }),
};

export const notionExtractionMapping = {
  equipment,
  exercises,
  muscleGroups,
  sets,
  strategies,
  trips,
};

export type NotionExtractionMapping = typeof notionExtractionMapping;

export type NotionExtractionMappingKeys = keyof NotionExtractionMapping;

export type DataDtoProps = {
  [K in keyof NotionExtractionMapping]: InstanceType<NotionExtractionMapping[K]['DtoClass']>[];
};

export type ExtractionDbResponseProps = {
  [K in keyof NotionExtractionMapping]: DbQueryResponseType<InstanceType<NotionExtractionMapping[K]['DbClass']>>[];
};
