import { NextFunction, Request, Response } from "express";

export const healthCheck = async (
  req: Request, // Use req instead of _ for clarity, as we need its properties
  res: Response,
  next: NextFunction // Include next to pass errors to global error handler
) => {
  console.log('--- Simple Webhook Test Received ---');
  console.log('Headers:', req.headers);
  console.log('Raw Body:', (req as any).rawBody ? (req as any).rawBody.toString('utf8') : 'No raw body');
  res.status(200).json({ message: 'Simple test response.' });
};
