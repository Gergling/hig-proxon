// src/server.ts
import 'dotenv/config'; // Loads .env file
import express, { Request, Response } from 'express';
import cors from 'cors';
import { Client } from '@notionhq/client';
import { fetchGymTripData } from './sdk-query';
import { fetchDTOs } from './queries/fetch-dtos';
import { getGymTripView } from './view';
import { retrieve } from './load/retrieve';

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Get and parse allowed origins from environment variable
const allowedOriginsRaw = process.env.ALLOWED_ORIGINS || '';
const allowedOrigins = allowedOriginsRaw
  .split(',')
  .map(s => s.trim())
  .filter(s => s.length > 0);

// Notion API token
const NOTION_TS_CLIENT_NOTION_SECRET = process.env.NOTION_TS_CLIENT_NOTION_SECRET;

if (!NOTION_TS_CLIENT_NOTION_SECRET) {
  console.error("Error: NOTION_TS_CLIENT_NOTION_SECRET is not set in your environment variables!");
  process.exit(1);
}

// Initialize the Notion client
const notion = new Client({ auth: NOTION_TS_CLIENT_NOTION_SECRET });

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
app.get('/proxy-gym', (req, res) => {
  retrieve()
    .then(res.json)
    .catch((error) => {
      console.error(error)
      res.status(500).json({
        error: 'Failed to fetch from store',
        details: error.message || 'Unknown error',
        code: error.code,
      });
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Notion Proxy Server listening at http://localhost:${port}`);
  console.log(`Allowed Origins: ${allowedOrigins.join(', ') || 'None configured (allowing same-origin & non-browser requests)'}`);
});