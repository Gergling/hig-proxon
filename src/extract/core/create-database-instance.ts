type DatabaseConstructor = new (config: { notionSecret: string }) => any;

export const createDbInstance = <T extends DatabaseConstructor>(
  DbConstructor: T,
  notionSecret: string
): InstanceType<T> => {
  return new DbConstructor({ notionSecret });
};
