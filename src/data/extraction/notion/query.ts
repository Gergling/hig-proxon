type BaseDbQueryResponse = {
  has_more: boolean;
  next_cursor: string | null;
};

type NotionQueryResponse<ResponseDataType> = BaseDbQueryResponse & {
  results: ResponseDataType[]
};

export type QueryFunctionResponse<DbQueryResponse> = {
  has_more: boolean;
  next_cursor: string | null;
  response: DbQueryResponse;
};


type RawQueryFn<DbQueryResponse> = (
  cursor: string | undefined
) => Promise<DbQueryResponse>;

/**
 * Unhelpful query function doc.
 */
export const queryDeprecated = async <
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
export const runQuery = async <
  ResponseDataType,
  DbQueryResponse extends NotionQueryResponse<ResponseDataType>,
  DTOInstance = never,
>(
  queryFn: RawQueryFn<DbQueryResponse>,
  getDTOs?: (queryResponse: DbQueryResponse) => DTOInstance[],
) => {
  let dtos: DTOInstance[] = [];
  let responses: DbQueryResponse[] = [];
  const page: {
    cursor: string | undefined;
    hasMore: boolean;
  } = {
    cursor: undefined,
    hasMore: true,
  };

  while(page.hasMore) {
    const response = await queryFn(page.cursor);
    const {
      has_more,
      next_cursor,
    } = response;

    if (getDTOs) {
      dtos = dtos.concat(getDTOs(response));
    } else {
      responses = responses.concat(response);
    }

    page.hasMore = has_more;
    page.cursor = next_cursor || undefined;
  }

  if (getDTOs) return dtos;
  
  return responses;
};
