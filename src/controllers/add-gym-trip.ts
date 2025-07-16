import { createHmac } from 'crypto'; // Node.js built-in crypto module
import { NextFunction, Request, Response } from "express";
import { extractAll, store } from "../data";
import { transformAll } from "../transformations/transform-all";

// export const addGymTrip = async (
//   _: Request,
//   res: Response
// ) => {
//   console.log(_.headers)
//   // try {
//   //   const dtos = await extractAll();
//   //   const data = transformAll(dtos);
//   //   await store(data);
//   // } catch(e) {
//   //   res.status(500).json({
//   //     error: `General backfill error.`,
//   //     details: e,
//   //     code: `500`,
//   //   });
//   //   throw e;
//   // }
// };

const getRawBodyString = (req: Request): string => {
  const bodyContent = req.body;

  if (bodyContent instanceof Buffer) {
    return bodyContent.toString('utf8');
  }

  return bodyContent;
}

const getPayload = (
  rawBodyString: string,
  res: Response,
) => {
  try {
    return JSON.parse(rawBodyString);
  } catch (parseError) {
    console.error('Error parsing webhook payload JSON:', parseError);
    res.status(400).json({ message: 'Bad Request: Invalid JSON payload.' });
    return;
  }
}

// This is your Express route handler function.
// It will be called when Notion pings your webhook URL.
export const addGymTrip = async (
    req: Request, // Use req instead of _ for clarity, as we need its properties
    res: Response,
    next: NextFunction // Include next to pass errors to global error handler
) => {
    console.log('--- Webhook Request Received ---');
    console.log('Headers:', req.headers); // Good for debugging all headers

    const NOTION_WEBHOOK_SECRET = process.env.NOTION_WEBHOOK_SECRET;
    const NOTION_API_TOKEN = process.env.NOTION_API_TOKEN; // Your main Notion API secret

    // Ensure rawBody is available from express.raw() middleware
    const rawBody = getRawBodyString(req);

    if (!rawBody) {
        console.error('Webhook received with empty raw body. Ensure express.raw() middleware is used for this route.');
        res.status(400).json({ message: 'Bad Request: Empty body or raw body not available.' });
        return;
    }

    // let payload: any;
    // try {
    //     payload = JSON.parse(rawBody.toString('utf8'));
    // } catch (parseError) {
    //     console.error('Error parsing webhook payload JSON:', parseError);
    //     res.status(400).json({ message: 'Bad Request: Invalid JSON payload.' });
    //     return;
    // }
    const payload = getPayload(rawBody, res);

    // --- TEMPORARY LOGGING FOR INITIAL WEBHOOK VERIFICATION TOKEN ---
    // This block is specifically for the one-time verification request from Notion.
    if (payload.type === 'webhook.verification') {
        const verificationToken = payload.token;
        console.log('----------------------------------------------------');
        console.log('!!! NOTION WEBHOOK VERIFICATION TOKEN FOUND !!!');
        console.log('!!! COPY THIS TOKEN AND SAVE IT AS NOTION_WEBHOOK_SECRET IN YOUR .env / RENDER VARS !!!');
        console.log('Notion Verification Token:', verificationToken);
        console.log('----------------------------------------------------');

        // Notion expects a 200 OK response for verification requests
        res.status(200).json({ status: 'ok', message: 'Webhook verification token received.' });
        return;
    }
    // --- END TEMPORARY LOGGING ---


    // --- NORMAL WEBHOOK PROCESSING (after the initial verification token has been obtained and set) ---

    // 1. Get the Notion Signature header
    const notionSignature = req.headers['x-notion-signature'] as string;
    if (!notionSignature) {
        console.warn('Webhook received without X-Notion-Signature header. Possible unauthorized request.');
        res.status(401).json({ message: 'Unauthorized: Missing signature.' });
        return;
    }

    // 2. Compute the HMAC-SHA256 signature using your STORED secret
    if (!NOTION_WEBHOOK_SECRET) {
        console.error('NOTION_WEBHOOK_SECRET environment variable is not set. Cannot verify webhook signature.');
        res.status(500).json({ message: 'Server webhook secret not configured.' });
        return;
    }
    const hmac = createHmac('sha256', NOTION_WEBHOOK_SECRET);
    hmac.update(rawBody); // Use the rawBody for signature computation
    const computedSignature = `sha256=${hmac.digest('hex')}`; // Notion's signature includes "sha256=" prefix

    // 3. Compare the signatures
    if (computedSignature !== notionSignature) {
        console.warn('Webhook signature mismatch. Possible unauthorized request.');
        res.status(403).json({ message: 'Forbidden: Invalid signature.' });
        return;
    }

    console.log('Webhook received and signature verified!');

    // 4. Process the actual webhook event (e.g., page.created, page.updated)
    try {
        console.log('Notion Webhook Event Type:', payload.event?.type); // Log the actual event type
        console.log('Notion Webhook Entity ID:', payload.event?.page_id || payload.event?.database_id); // Log the ID

        // Ensure Notion API token is available for extraction
        if (!NOTION_API_TOKEN) {
            throw new Error('NOTION_API_TOKEN environment variable is not set for webhook processing.');
        }

        // Trigger a full backfill for now.
        // In the future, you'd implement incremental updates based on `payload.event`.
        console.log('Triggering full cache refresh due to Notion webhook...');
        // const rawNotionDTOs: DTOProps = await extractAllData(NOTION_API_TOKEN);
        const dtos = await extractAll();
        const data = transformAll(dtos);
        await store(data);
        // await refreshAndStoreCache(rawNotionDTOs); // This updates S3 and in-memory cache

        res.status(200).json({ message: 'Webhook received and cache refresh initiated.' });
        return;
    } catch (e: any) {
        console.error('Error processing Notion webhook event:', e);
        // Pass the error to your global error handling middleware
        next(e);
    }
};
