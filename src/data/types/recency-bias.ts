import { Temporal } from "temporal-polyfill";

export type RecencyBiasKeys = Partial<Pick<Temporal.Duration,
  | 'days'
  | 'hours'
  | 'microseconds'
  | 'milliseconds'
  | 'minutes'
  | 'months'
  | 'nanoseconds'
  | 'seconds'
  | 'weeks'
  | 'years'
>>;

export type RecencyBiasCriteria = {
  [key in keyof RecencyBiasKeys]: RecencyBiasKeys[key];
};

export type RecencyBiasedValues = {
  [key: string]: number[];
};
