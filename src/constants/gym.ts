import { OrderProposedMapping } from "../common/types/gym";
import { SetProgressionStatus } from "../types";

export const allSetProgressionStatuses: SetProgressionStatus[] = [
  'growth',
  'regrowth',
  'uptick',
  'steady',
  'fluctuation',
  'backslide',
  'rehab',
];

export const orderProposedMapping: OrderProposedMapping = {
  asc: 'priority',
  desc: 'supplemental',
};
