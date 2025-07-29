import { QueryDatabaseResponse } from "../../../notion-sdk/core/types/notion-api.types";

export type DatabaseConstructor<
  TQueryResponse extends QueryDatabaseResponse
> = new (
  config: { notionSecret: string }
) => {
  query: (options: any) => Promise<TQueryResponse>
};
