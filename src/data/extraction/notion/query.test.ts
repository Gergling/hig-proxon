// import { QueryFunctionResponse, runQuery } from './query';

// type MockDbQueryResponse = {
//   results: { id: string; name: string }[];
// };

// type MockDTO = {
//   id: string;
//   displayName: string;
// };

// describe('query function', () => {
//   // Mock the queryFn callback
//   let mockQueryFn: jest.Mock<Promise<QueryFunctionResponse<MockDbQueryResponse>>, [string | undefined]>;
//   // Mock the getDTOs callback
//   let mockGetDTOs: jest.Mock<MockDTO[]>;

//   beforeEach(() => {
//     // Reset mocks before each test to ensure isolation
//     mockQueryFn = jest.fn();
//     mockGetDTOs = jest.fn();
//   });

//   // --- Test Case 1: Single page of results ---
//   test('should return all DTOs for a single page response', async () => {
//     // Simulate a single page response
//     mockQueryFn.mockResolvedValueOnce({
//         has_more: false,
//         next_cursor: null,
//         response: {
//             results: [{ id: 'page1', name: 'Item A' }, { id: 'page2', name: 'Item B' }],
//         },
//     });

//     // Simulate DTO transformation
//     mockGetDTOs.mockImplementation(
//       (res: MockDbQueryResponse) =>
//         res.results.map(
//           (item) => ({ id: item.id, displayName: item.name.toUpperCase() })
//         )
//     );

//     const dtos = await runQuery<
//       MockDbQueryResponse,
//       MockDTO
//     >(mockQueryFn, mockGetDTOs);

//     // Assertions
//     expect(mockQueryFn).toHaveBeenCalledTimes(1);
//     expect(mockQueryFn).toHaveBeenCalledWith(undefined); // First call should have undefined cursor

//     expect(mockGetDTOs).toHaveBeenCalledTimes(1);
//     expect(mockGetDTOs).toHaveBeenCalledWith(expect.objectContaining({
//         results: [{ id: 'page1', name: 'Item A' }, { id: 'page2', name: 'Item B' }],
//     }));

//     expect(dtos).toEqual([
//         { id: 'page1', displayName: 'ITEM A' },
//         { id: 'page2', displayName: 'ITEM B' },
//     ]);
//   });

//   // --- Test Case 2: Multiple pages of results ---
//   test('should paginate correctly and return all DTOs from multiple pages', async () => {
//     // Simulate three pages of data
//     mockQueryFn
//       .mockResolvedValueOnce({ // First page
//         has_more: true,
//         next_cursor: 'cursor1',
//         response: {
//             results: [{ id: 'page1', name: 'Item A' }, { id: 'page2', name: 'Item B' }],
//         },
//       })
//       .mockResolvedValueOnce({ // Second page
//         has_more: true,
//         next_cursor: 'cursor2',
//         response: {
//             results: [{ id: 'page3', name: 'Item C' }, { id: 'page4', name: 'Item D' }],
//         },
//       })
//       .mockResolvedValueOnce({ // Third (last) page
//         has_more: false,
//         next_cursor: null,
//         response: {
//             results: [{ id: 'page5', name: 'Item E' }],
//         },
//       });

//     // Simulate DTO transformation (same as before)
//     mockGetDTOs.mockImplementation((res: MockDbQueryResponse) =>
//       res.results.map(item => ({ id: item.id, displayName: item.name.toUpperCase() }))
//     );

//     const dtos = await query(mockQueryFn, mockGetDTOs);

//     // Assertions
//     expect(mockQueryFn).toHaveBeenCalledTimes(3);
//     expect(mockQueryFn).toHaveBeenCalledWith(undefined); // First call
//     expect(mockQueryFn).toHaveBeenCalledWith('cursor1'); // Second call with cursor from first response
//     expect(mockQueryFn).toHaveBeenCalledWith('cursor2'); // Third call with cursor from second response

//     expect(mockGetDTOs).toHaveBeenCalledTimes(3);
//     expect(mockGetDTOs).toHaveBeenCalledWith(expect.objectContaining({ results: [{ id: 'page1', name: 'Item A' }, { id: 'page2', name: 'Item B' }] }));
//     expect(mockGetDTOs).toHaveBeenCalledWith(expect.objectContaining({ results: [{ id: 'page3', name: 'Item C' }, { id: 'page4', name: 'Item D' }] }));
//     expect(mockGetDTOs).toHaveBeenCalledWith(expect.objectContaining({ results: [{ id: 'page5', name: 'Item E' }] }));


//     expect(dtos).toEqual([
//       { id: 'page1', displayName: 'ITEM A' },
//       { id: 'page2', displayName: 'ITEM B' },
//       { id: 'page3', displayName: 'ITEM C' },
//       { id: 'page4', displayName: 'ITEM D' },
//       { id: 'page5', displayName: 'ITEM E' },
//     ]);
//   });

//   // --- Test Case 3: Empty database ---
//   test('should return an empty array if the database is empty', async () => {
//     mockQueryFn.mockResolvedValueOnce({
//       has_more: false,
//       next_cursor: null,
//       response: { results: [] }, // Empty results
//     });

//     mockGetDTOs.mockImplementation((res: MockDbQueryResponse) =>
//       res.results.map(item => ({ id: item.id, displayName: item.name.toUpperCase() }))
//     );

//     const dtos = await query(mockQueryFn, mockGetDTOs);

//     expect(mockQueryFn).toHaveBeenCalledTimes(1);
//     expect(mockQueryFn).toHaveBeenCalledWith(undefined);
//     expect(mockGetDTOs).toHaveBeenCalledTimes(1);
//     expect(mockGetDTOs).toHaveBeenCalledWith(expect.objectContaining({ results: [] }));
//     expect(dtos).toEqual([]);
//   });

//   // --- Test Case 4: Error handling ---
//   test('should throw an error if queryFn throws an error', async () => {
//     const mockError = new Error('Notion API error');
//     mockQueryFn.mockRejectedValueOnce(mockError); // Simulate an error on the first call

//     // getDTOs won't be called if queryFn throws
//     mockGetDTOs.mockImplementation((res: MockDbQueryResponse) => []);

//     await expect(query(mockQueryFn, mockGetDTOs)).rejects.toThrow(mockError);
//     expect(mockQueryFn).toHaveBeenCalledTimes(1);
//     expect(mockQueryFn).toHaveBeenCalledWith(undefined);
//     expect(mockGetDTOs).not.toHaveBeenCalled(); // Should not be called if queryFn fails
//   });

//   // --- Test Case 5: DTO mapping function omitted ---
//   test.skip('should paginate correctly and return all raw responses from multiple pages', async () => {
//     // Simulate three pages of data
//     mockQueryFn
//       .mockResolvedValueOnce({ // First page
//         has_more: true,
//         next_cursor: 'cursor1',
//         response: {
//             results: [{ id: 'page1', name: 'Item A' }, { id: 'page2', name: 'Item B' }],
//         },
//       })
//       .mockResolvedValueOnce({ // Second page
//         has_more: true,
//         next_cursor: 'cursor2',
//         response: {
//             results: [{ id: 'page3', name: 'Item C' }, { id: 'page4', name: 'Item D' }],
//         },
//       })
//       .mockResolvedValueOnce({ // Third (last) page
//         has_more: false,
//         next_cursor: null,
//         response: {
//             results: [{ id: 'page5', name: 'Item E' }],
//         },
//       });

//     const responses = await query(mockQueryFn, mockGetDTOs);

//     // Assertions
//     expect(mockQueryFn).toHaveBeenCalledTimes(3);
//     expect(mockQueryFn).toHaveBeenCalledWith(undefined); // First call
//     expect(mockQueryFn).toHaveBeenCalledWith('cursor1'); // Second call with cursor from first response
//     expect(mockQueryFn).toHaveBeenCalledWith('cursor2'); // Third call with cursor from second response

//     expect(mockGetDTOs).toHaveBeenCalledTimes(3);
//     expect(mockGetDTOs).toHaveBeenCalledWith(expect.objectContaining({ results: [{ id: 'page1', name: 'Item A' }, { id: 'page2', name: 'Item B' }] }));
//     expect(mockGetDTOs).toHaveBeenCalledWith(expect.objectContaining({ results: [{ id: 'page3', name: 'Item C' }, { id: 'page4', name: 'Item D' }] }));
//     expect(mockGetDTOs).toHaveBeenCalledWith(expect.objectContaining({ results: [{ id: 'page5', name: 'Item E' }] }));


//     expect(responses).toEqual([
//       { id: 'page1', displayName: 'ITEM A' },
//       { id: 'page2', displayName: 'ITEM B' },
//       { id: 'page3', displayName: 'ITEM C' },
//       { id: 'page4', displayName: 'ITEM D' },
//       { id: 'page5', displayName: 'ITEM E' },
//     ]);
//   });
// });
