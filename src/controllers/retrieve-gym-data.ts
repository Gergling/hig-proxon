import { Request, Response } from "express";
import { gymData } from "../data/load/cache";

export const retrieveGymData = (
  _: Request,
  res: Response
) => {
  if (gymData) {
    res.json(gymData);
  } else {
    res.status(503).json({
      error: `No data available yet.`,
      details: `A backfill completion may be needed.`,
      code: `503`,
    });
  }
}