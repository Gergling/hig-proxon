import { Request, Response } from "express";
import { retrieve } from "../load/retrieve";

export const retrieveGymData = (
  _: Request,
  res: Response
) => {
  retrieve()
    .then((response) => res.json(response))
    .catch((error) => {
      console.error(error)
      res.status(500).json({
        error: 'Failed to fetch from store',
        details: error.message || 'Unknown error',
        code: error.code,
      });
    });
}