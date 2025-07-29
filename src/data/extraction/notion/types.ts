import { BaseConstructorFunction, DbQueryResponseType } from "../../../types/utils";
import { DatabaseConstructor } from "../types";

export type NotionExtractionConfiguration<
  TDbConstructor extends DatabaseConstructor<any>,
  TDtoConstructor extends BaseConstructorFunction<any, any>
> = {
  queryDTOs: () => Promise<InstanceType<TDtoConstructor>[]>;
  queryResponses: () => Promise<DbQueryResponseType<InstanceType<TDbConstructor>>[]>;
};
