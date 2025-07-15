import { getCachedData, refreshAndStoreCache } from "../common/s3/test";

const run = async () => {
  console.log('About to store...', `${new Date()}`, new Date())
  await refreshAndStoreCache();
  console.log('Stored.', `${new Date()}`, new Date())
  console.log('About to retrieve...')
  const data = await getCachedData();
  console.log('Retrieved data:', `${new Date()}`, new Date(), data)
};

run();
