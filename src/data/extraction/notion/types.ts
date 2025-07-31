import { BaseConstructorFunction, DbQueryResponseType } from "../../../types/utils";
import { DatabaseConstructor } from "../types";

type BaseDbQueryResponse = {
  has_more: boolean;
  next_cursor: string | null;
};

export type NotionQueryResponse<ResponseDataType> = BaseDbQueryResponse & {
  results: ResponseDataType[]
};

type QueryFn<T> = (notionSecret: string) => Promise<T>;

export type NotionExtractionConfiguration<
  TDbConstructor extends DatabaseConstructor<any>,
  TDtoConstructor extends BaseConstructorFunction<any, any>
> = {
  getQueryResponseDTOs: (
    queryResponse: DbQueryResponseType<InstanceType<TDbConstructor>>
  ) => InstanceType<TDtoConstructor>[];
  queryDTOs: QueryFn<InstanceType<TDtoConstructor>[]>;
  queryResponses: QueryFn<DbQueryResponseType<InstanceType<TDbConstructor>>[]>;
  reduceQueryResponseDTOs: (
    state: InstanceType<TDtoConstructor>[],
    action: DbQueryResponseType<InstanceType<TDbConstructor>>
  ) => InstanceType<TDtoConstructor>[];
};
