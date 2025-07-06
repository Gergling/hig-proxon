// src/server.ts
import 'dotenv/config'; // Loads .env file
import express from 'express';
import cors from 'cors';
import { retrieveGymData } from './controllers';

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
app.get('/proxy-gym', retrieveGymData);

// Start the server
app.listen(port, () => {
  console.log(`Notion Proxy Server listening at http://localhost:${port}`);
  console.log(`Allowed Origins: ${allowedOrigins.join(', ') || 'None configured (allowing same-origin & non-browser requests)'}`);
});