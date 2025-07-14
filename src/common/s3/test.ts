// src/data/load/cacheManager.ts
// import { storeJsonToFile, retrieveJsonFromFile } from './localFileCache'; // REMOVE THIS LINE
// import { storeJsonToS3, retrieveJsonFromS3 } from './s3Cache'; // ADD THIS LINE
// import { transformAll } from '../../transformations/transform-all'; // Assuming this path
// import { DTOProps } from '../../types/dto-props'; // Assuming this type exists

import { retrieveJsonFromS3, storeJsonToS3 } from "./store";

const CACHE_FILE_KEY = 'gym_data.json'; // This will be the key (filename) in your S3 bucket

/**
 * Refreshes the cache by extracting, transforming, and storing data to S3.
 * @param dtos The raw DTOs extracted from Notion.
 * @returns The transformed data.
 */
export async function refreshAndStoreCache(): Promise<any> { // Adjust return type as needed
    console.log("Refreshing cache and storing to S3...");
    try {
        await storeJsonToS3(CACHE_FILE_KEY, {
          test: `Data store started at ${new Date()}.`
        });
        console.log("Cache refreshed and stored to S3 successfully.");
        return;
    } catch (error) {
        console.error("Error refreshing and storing S3 cache:", error);
        throw error;
    }
}

/**
 * Retrieves the cached data from S3.
 * @returns The parsed cached data, or null if not found.
 */
export async function getCachedData(): Promise<any | null> { // Adjust return type as needed
    return retrieveJsonFromS3(CACHE_FILE_KEY);
}
