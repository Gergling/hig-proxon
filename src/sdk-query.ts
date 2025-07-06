// Let's imagine you have a database of online events in your Notion :)
import { getGymTrip } from './transformations/dto/get-gym-trip';
import {
  GymTripLogDatabase,
  GymTripLogResponseDTO,
  // GymTripLogPatchDTO
} from './notion-sdk/dbs/gym-trip-log';

const getDB = () => {
  const notionSecret = process.env.NOTION_TS_CLIENT_NOTION_SECRET;

  if (notionSecret) return new GymTripLogDatabase({ notionSecret });

  throw new Error('No NOTION_TS_CLIENT_NOTION_SECRET environment variable specified.');
};

export const fetchGymTripData = async () => {
  const db = getDB();
  const queryResponse = await db.query({
    sorts: [{ property: 'visitTime', direction: 'ascending' }],
  });
  // TODO: Fetch complete list of sets, strategies and exercises.
  // TODO: Get all the set ids. Put them into a filter to fetch the sets.
  // TODO: The overall index will be a process index and will be weighted based on the 3-month, 2-month and 3-week means of scores.
  const pages = queryResponse.results.map((r) => getGymTrip(new GymTripLogResponseDTO(r)));
  // console.log(pages[0].properties.organization) // <--- type safe!
  return pages;

  // TODO: Things to output.
  // A complete list of gym trip data.
  // An overview of calculations.
};
