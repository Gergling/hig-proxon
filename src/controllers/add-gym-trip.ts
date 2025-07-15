import { Request, Response } from "express";
import { extractAll, store } from "../data";
import { transformAll } from "../transformations/transform-all";

export const addGymTrip = async (
  _: Request,
  res: Response
) => {
  console.log(_.headers)
  // try {
  //   const dtos = await extractAll();
  //   const data = transformAll(dtos);
  //   await store(data);
  // } catch(e) {
  //   res.status(500).json({
  //     error: `General backfill error.`,
  //     details: e,
  //     code: `500`,
  //   });
  //   throw e;
  // }
};
