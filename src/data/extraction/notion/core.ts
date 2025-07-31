import { instantiate } from "../../../common/utils/instantiate";
import { QueryDatabaseResponse } from "../../../notion-sdk/core/types/notion-api.types";
import { BaseConstructorFunction, ConstructorFirstParameter, DbQueryResponseType, QueryResultItemType } from "../../../types/utils";
import { DatabaseConstructor } from "../types";
import { createDbInstance } from "./create-database-instance";
import { runQuery } from "./query";
import { NotionExtractionConfiguration } from "./types";

type NotionQueryResponse<ResponseDataType> = QueryDatabaseResponse & {
  results: ResponseDataType[]
};

const defaultDbQueryFactory = <
  ResponseDataType,
  QueryResponse extends NotionQueryResponse<ResponseDataType>,
  NotionDatabaseConstructor extends DatabaseConstructor<QueryResponse>
>(
  db: InstanceType<NotionDatabaseConstructor>
) => (
  start_cursor: string | undefined
) => db.query({ start_cursor });

export const configureNotionExtraction = <
  TDbConstructor extends DatabaseConstructor<any>,
  TDtoConstructor extends BaseConstructorFunction<any, any>
>(
  NotionDatabaseConstructor: TDbConstructor,
  ResponseDTOConstructor: TDtoConstructor,
  dbQueryFactory: (db: InstanceType<TDbConstructor>) => (
    start_cursor: string | undefined
  ) => Promise<DbQueryResponseType<InstanceType<TDbConstructor>>> = defaultDbQueryFactory
): NotionExtractionConfiguration<TDbConstructor, TDtoConstructor> => {
  // Infer the specific types using the utility types
  type QueryResponse = DbQueryResponseType<InstanceType<TDbConstructor>>; // e.g., ExerciseEquipmentQueryResponse
  type ResponseDataType = QueryResultItemType<QueryResponse>; // e.g., PageObjectResponse | PartialPageObjectResponse
  type DTOInstance = InstanceType<TDtoConstructor>; // e.g., ExerciseEquipmentPlainDTO

  // Compile-time assertion:
  // This type alias will cause a compilation error if the DTO constructor's
  // first parameter type does not extend the Notion raw response data type.
  // We don't need to assign it to a variable. Just its existence will trigger the check.
  type AssertDtoConstructorParamMatchesResponseDataType =
    ConstructorFirstParameter<TDtoConstructor> extends ResponseDataType
      ? true
      : {
          ERROR: "ResponseDTOConstructor's first parameter type does not match ResponseDataType. Check your DTO constructor's input type.";
          Expected: ResponseDataType;
          Got: ConstructorFirstParameter<TDtoConstructor>;
        };

  const getDbQuery = (notionSecret: string) => {
    const db = createDbInstance(NotionDatabaseConstructor, notionSecret);
    return dbQueryFactory(db);
  };

  const getDTO = (
    r: ResponseDataType
  ): DTOInstance => instantiate(
    ResponseDTOConstructor as BaseConstructorFunction<ResponseDataType, DTOInstance>,
    r
  );

  const getQueryResponseDTOs = (
    queryResponse: QueryResponse
  ): DTOInstance[] => queryResponse
    .results
    .map(getDTO);

  const reduceQueryResponseDTOs = (
    dtos: DTOInstance[],
    queryResponse: QueryResponse
  ) => ([
    ...dtos,
    ...getQueryResponseDTOs(queryResponse),
  ]);

  const queryResponses = (notionSecret: string) => runQuery<
    ResponseDataType,
    QueryResponse
  >(getDbQuery(notionSecret)) as Promise<DbQueryResponseType<InstanceType<TDbConstructor>>[]>;
  const queryDTOs = (notionSecret: string) => runQuery<
    ResponseDataType,
    QueryResponse,
    DTOInstance
  >(
    getDbQuery(notionSecret),
    getQueryResponseDTOs
  ) as Promise<InstanceType<TDtoConstructor>[]>;

  return {
    getQueryResponseDTOs,
    queryDTOs,
    queryResponses,
    reduceQueryResponseDTOs,
  };
};
