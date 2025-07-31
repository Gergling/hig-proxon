import { NotionQueryResponse } from "../notion/types";

export type DatabaseConstructor<
  TQueryResponse extends NotionQueryResponse<any>
> = new (
  config: { notionSecret: string }
) => {
  query: (options: any) => Promise<TQueryResponse>
};
