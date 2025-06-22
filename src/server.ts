// src/server.ts
import 'dotenv/config'; // Loads .env file
import express, { Request, Response } from 'express';
import cors from 'cors';
import { Client } from '@notionhq/client';
import { fetchGymTripData } from './sdk-query';
import { fetchDTOs } from './queries/fetch-dtos';
import { getGymTripView } from './view';

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Get and parse allowed origins from environment variable
const allowedOriginsRaw = process.env.ALLOWED_ORIGINS || '';
const allowedOrigins = allowedOriginsRaw
  .split(',')
  .map(s => s.trim())
  .filter(s => s.length > 0);

// Notion API token
const NOTION_API_TOKEN = process.env.NOTION_API_TOKEN;

if (!NOTION_API_TOKEN) {
  console.error("Error: NOTION_API_TOKEN is not set in your environment variables!");
  process.exit(1);
}

// Initialize the Notion client
const notion = new Client({ auth: NOTION_API_TOKEN });

// Configure CORS
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl requests, or same-origin requests)
    if (!origin) return callback(null, true);

    // If specific origins are configured, check against them
    if (allowedOrigins.length > 0 && !allowedOrigins.includes(origin)) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

// Middleware to parse JSON request bodies
app.use(express.json());

// Endpoint to proxy Notion database queries
app.post('/proxy-notion-query', (req, res) => {
  // const { databaseId, filter, sorts } = req.body;

  // Basic validation
  // if (!databaseId) {
  //   return res.status(400).json({ error: 'Database ID is required' });
  // }

  // notion.databases
  //   .query({
  //     // Currently hardcoded to return the sets.
  //     database_id: '15bec2ca1ca880589979d94bd39839eb',
  //     // filter: filter,
  //     // sorts: sorts,
  //   })
  //   .then((response) => res.json(response))
  //   .catch((error) => {
  //     console.error(error)
  //     res.status(500).json({
  //       error: 'Failed to fetch from Notion API',
  //       details: error.message || 'Unknown error',
  //       code: error.code // Notion API error code if available
  //     });
  //   });

  fetchDTOs()
    .then((response) => getGymTripView(response))
    .then((response) => res.json(response))
    .catch((error) => {
      console.error(error)
      res.status(500).json({
        error: 'Failed to fetch from Notion API',
        details: error.message || 'Unknown error',
        code: error.code // Notion API error code if available
      });
    });

  // try {
  //   const notionResponse = await notion.databases.query({
  //     database_id: databaseId,
  //     filter: filter,
  //     sorts: sorts,
  //   });
  //   res.json(notionResponse); // Send Notion's response back to the frontend
  // } catch (error: any) { // Use 'any' for now to catch Notion API client errors broadly
  //   console.error('Error proxying Notion request:', error.message || error);
  //   res.status(500).json({
  //     error: 'Failed to fetch from Notion API',
  //     details: error.message || 'Unknown error',
  //     code: error.code // Notion API error code if available
  //   });
  // }
});

// Start the server
app.listen(port, () => {
  console.log(`Notion Proxy Server listening at http://localhost:${port}`);
  console.log(`Allowed Origins: ${allowedOrigins.join(', ') || 'None configured (allowing same-origin & non-browser requests)'}`);
});