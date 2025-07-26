import * as fs from 'fs/promises'; // Node.js file system module with promise-based API
import * as path from 'path';     // Node.js path module for resolving file paths

/**
 * Defines the default directory where cache files will be stored.
 * This will be relative to the current working directory of the Node.js process.
 * For local development, this typically means a 'cache' folder in your project root.
 */
const DEFAULT_CACHE_DIR = path.join(process.cwd(), 'cache');

/**
 * Ensures that the specified directory exists. If it doesn't, it creates it.
 * @param dirPath The path to the directory to ensure exists.
 */
async function ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
        // `recursive: true` ensures that parent directories are also created if they don't exist.
        await fs.mkdir(dirPath, { recursive: true });
        console.log(`Directory ensured: ${dirPath}`);
    } catch (error: any) {
        // If the error is not that the directory already exists, then re-throw.
        // 'EEXIST' means the directory already exists, which is fine.
        if (error.code !== 'EEXIST') {
            console.error(`Error ensuring directory ${dirPath} exists:`, error);
            throw new Error(`Failed to create directory ${dirPath}: ${error.message}`);
        }
        console.log(`Directory already exists: ${dirPath}`);
    }
}

/**
 * Stores a JavaScript object as a JSON file on the server's local filesystem.
 * The data will be pretty-printed with 2 spaces for readability.
 *
 * @param fileName The name of the JSON file (e.g., 'all_gym_data.json').
 * @param data The JavaScript object to be stored.
 * @param cacheDir Optional. The directory where the file should be saved. Defaults to 'cache/' in the project root.
 * @returns A Promise that resolves when the file has been successfully written.
 */
export async function storeJsonToFile<T>(
    fileName: string,
    data: T,
    cacheDir: string = DEFAULT_CACHE_DIR
): Promise<void> {
    const filePath = path.join(cacheDir, fileName);

    try {
        await ensureDirectoryExists(cacheDir); // Ensure the target directory exists

        // Convert the JavaScript object to a pretty-printed JSON string
        const jsonString = JSON.stringify(data, null, 2);

        // Write the JSON string to the file
        await fs.writeFile(filePath, jsonString, 'utf8');
        console.log(`JSON data successfully stored to: ${filePath}`);
    } catch (error: any) {
        console.error(`Error storing JSON data to ${filePath}:`, error);
        throw new Error(`Failed to store JSON data to file: ${error.message}`);
    }
}

/**
 * Retrieves and parses JSON data from a file on the server's local filesystem.
 *
 * @param fileName The name of the JSON file (e.g., 'all_gym_data.json').
 * @param cacheDir Optional. The directory where the file is expected. Defaults to 'cache/' in the project root.
 * @returns A Promise that resolves with the parsed JavaScript object, or null if the file does not exist.
 */
export async function retrieveJsonFromFile<T>(
    fileName: string,
    cacheDir: string = DEFAULT_CACHE_DIR
): Promise<T | null> {
    const filePath = path.join(cacheDir, fileName);

    try {
        // Read the file content as a string
        const fileContent = await fs.readFile(filePath, 'utf8');

        // Parse the JSON string back into a JavaScript object
        const parsedData = JSON.parse(fileContent);
        console.log(`JSON data successfully retrieved from: ${filePath}`);
        return parsedData;
    } catch (error: any) {
        // If the file does not exist, return null (common scenario for cache not found)
        if (error.code === 'ENOENT') {
            console.warn(`JSON file not found at ${filePath}. Returning null.`);
            return null;
        }
        // For other errors (e.g., invalid JSON format), log and re-throw
        console.error(`Error retrieving or parsing JSON from ${filePath}:`, error);
        throw new Error(`Failed to retrieve or parse JSON from file: ${error.message}`);
    }
}

// /**
//  * Deletes a JSON file from the server's local filesystem.
//  *
//  * @param fileName The name of the JSON file to delete.
//  * @param cacheDir Optional. The directory where the file is located. Defaults to 'cache/' in the project root.
//  * @returns A Promise that resolves when the file has been successfully deleted, or if it didn't exist.
//  */
// export async function deleteJsonFile(
//     fileName: string,
//     cacheDir: string = DEFAULT_CACHE_DIR
// ): Promise<void> {
//     const filePath = path.join(cacheDir, fileName);

//     try {
//         await fs.unlink(filePath);
//         console.log(`JSON file successfully deleted: ${filePath}`);
//     } catch (error: any) {
//         // If the file does not exist, it's already "deleted" so no need to throw
//         if (error.code === 'ENOENT') {
//             console.warn(`Attempted to delete file ${filePath}, but it did not exist.`);
//             return;
//         }
//         console.error(`Error deleting JSON file ${filePath}:`, error);
//         throw new Error(`Failed to delete JSON file: ${error.message}`);
//     }
// }

// --- Example Usage (for testing purposes) ---
/*
(async () => {
    const testData = {
        message: "Hello from local storage!",
        timestamp: new Date().toISOString(),
        items: [1, 2, 3]
    };
    const testFileName = 'test_cache.json';

    try {
        // 1. Store data
        await storeJsonToFile(testFileName, testData);

        // 2. Retrieve data
        const retrievedData = await retrieveJsonFromFile(testFileName);
        if (retrievedData) {
            console.log('Retrieved data:', retrievedData);
            console.log('Message:', retrievedData.message);
        }

        // 3. Attempt to retrieve a non-existent file
        const nonExistentData = await retrieveJsonFromFile('non_existent.json');
        console.log('Non-existent data:', nonExistentData); // Should be null

        // 4. Delete the stored file
        await deleteJsonFile(testFileName);

        // 5. Try to retrieve after deletion (should return null)
        const dataAfterDeletion = await retrieveJsonFromFile(testFileName);
        console.log('Data after deletion:', dataAfterDeletion); // Should be null

    } catch (error) {
        console.error('An error occurred during example usage:', error);
    }
})();
*/
