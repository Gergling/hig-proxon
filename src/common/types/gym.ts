import { ProposedProp } from "../../data/types";
import { Order } from "../comparison";

export type OrderProposedMapping = {
  [key in Order]: ProposedProp;
};