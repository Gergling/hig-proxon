export type QueryFunctionResponse<DbQueryResponse> = {
  has_more: boolean;
  next_cursor: string | null;
  response: DbQueryResponse;
};

export const query = async <
  DbQueryResponse,
  DTO,
>(
  queryFn: (
    cursor: string | undefined
  ) => Promise<QueryFunctionResponse<DbQueryResponse>>,
  getDTOs: (queryResponse: DbQueryResponse) => DTO[],
) => {
  let dtos: DTO[] = [];
  const page: {
    cursor: string | undefined;
    hasMore: boolean;
  } = {
    cursor: undefined,
    hasMore: true,
  };

  while(page.hasMore) {
    const {
      has_more,
      next_cursor,
      response,
    } = await queryFn(page.cursor);

    dtos = dtos.concat(getDTOs(response))

    page.hasMore = has_more;
    page.cursor = next_cursor || undefined;
  }

  return dtos;
};
