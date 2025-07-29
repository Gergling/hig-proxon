import { QueryDatabaseResponse } from "../../notion-sdk/core/types/notion-api.types";
import { ExerciseEquipmentDatabase, ExerciseEquipmentQueryResponse, ExerciseEquipmentResponseDTO } from "../../notion-sdk/dbs/exercise-equipment";
import { ExercisesDatabase, ExercisesQueryResponse, ExercisesResponseDTO } from "../../notion-sdk/dbs/exercises";
import { GymSetDatabase, GymSetQueryResponse, GymSetResponseDTO } from "../../notion-sdk/dbs/gym-set";
import { GymSetStrategyDatabase, GymSetStrategyQueryResponse, GymSetStrategyResponseDTO } from "../../notion-sdk/dbs/gym-set-strategy";
import { GymTripLogDatabase, GymTripLogQueryResponse, GymTripLogResponseDTO } from "../../notion-sdk/dbs/gym-trip-log";
import { MuscleGroupsDatabase, MuscleGroupsQueryResponse, MuscleGroupsResponseDTO } from "../../notion-sdk/dbs/muscle-groups";
import { BaseConstructorFunction, DbQueryResponseType } from "../../types/utils";
import { DatabaseConstructor } from "../extraction/types";

type ExtractionMappingKeys =
  | 'equipment'
  | 'exercises'
  | 'muscleGroups'
  | 'sets'
  | 'strategies'
  | 'trips';

type NotionExtractionMappingItem = {
  db: DatabaseConstructor<any>;
  dto: BaseConstructorFunction<any, any>;
  queryDbResponse: DbQueryResponseType<any>;
};

export const notionExtractionMapping: {
  [K in ExtractionMappingKeys]: NotionExtractionMappingItem;
} = {
  equipment: {
    db: ExerciseEquipmentDatabase,
    dto: ExerciseEquipmentResponseDTO,
    queryDbResponse: {} as ExerciseEquipmentQueryResponse,
  },
  exercises: {
    db: ExercisesDatabase,
    dto: ExercisesResponseDTO,
    queryDbResponse: {} as ExercisesQueryResponse,
  },
  muscleGroups: {
    db: MuscleGroupsDatabase,
    dto: MuscleGroupsResponseDTO,
    queryDbResponse: {} as MuscleGroupsQueryResponse,
  },
  sets: {
    db: GymSetDatabase,
    dto: GymSetResponseDTO,
    queryDbResponse: {} as GymSetQueryResponse,
  },
  strategies: {
    db: GymSetStrategyDatabase,
    dto: GymSetStrategyResponseDTO,
    queryDbResponse: {} as GymSetStrategyQueryResponse,
  },
  trips: {
    db: GymTripLogDatabase,
    dto: GymTripLogResponseDTO,
    queryDbResponse: {} as GymTripLogQueryResponse,
  },
};

type NotionExtractionMapping = typeof notionExtractionMapping;

export type DataDtoProps = {
  [K in keyof NotionExtractionMapping]: NotionExtractionMapping[K]['dto'][];
};

export type ExtractionDbResponseProps = {
  [K in keyof NotionExtractionMapping]: NotionExtractionMapping[K]['queryDbResponse'][];
};
