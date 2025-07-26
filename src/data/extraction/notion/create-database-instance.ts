import { DatabaseConstructor } from "../types";

export const createDbInstance = <T extends DatabaseConstructor>(
  DbConstructor: T,
  notionSecret: string
): InstanceType<T> => {
  return new DbConstructor({ notionSecret });
};
