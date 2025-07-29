// src/types/utils.ts

import { QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";

// 1. Infers the full query response type from a Notion database client's `query` method
//    TClient is expected to have a `query` method that returns a Promise of some type R.
export type DbQueryResponseType<TClient extends { query: (options: any) => Promise<any> }> =
    TClient extends { query: (options: any) => Promise<infer R> } ? R : never;

// 2. Infers the type of a single item within the `results` array of a Notion query response
//    TQueryResponse is expected to have a `results` property which is an array.
export type QueryResultItemType<TQueryResponse extends QueryDatabaseResponse> =
    TQueryResponse extends { results: infer R extends any[] } ? R[number] : never;

// 3. Infers the type of the *first parameter* in a constructor
//    T is expected to be a constructor function.
export type ConstructorFirstParameter<T extends new (...args: any[]) => any> =
    T extends new (param: infer P, ...args: any[]) => any ? P : never;

// 4. A more robust BaseConstructorFunction that also takes the instance type
export type BaseConstructorFunction<TParam, TInstance> = new (param: TParam, ...args: any[]) => TInstance;
