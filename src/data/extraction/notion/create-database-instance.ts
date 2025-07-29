import { instantiate } from "../../../common/utils/instantiate";
import { QueryDatabaseResponse } from "../../../notion-sdk/core/types/notion-api.types";
import { DatabaseConstructor } from "../types";

export const createDbInstance = <
  TQueryResponse extends QueryDatabaseResponse,
  TDbConstructor extends DatabaseConstructor<TQueryResponse>
>(
  DbConstructor: TDbConstructor,
  notionSecret: string
): InstanceType<TDbConstructor> => instantiate(DbConstructor, { notionSecret });
