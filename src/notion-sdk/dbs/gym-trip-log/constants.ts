export const GYM_TRIP_LOG_PROP_VALUES = {
"location": [
  "Monument",
  "Croydon",
  "Sydenham"
] as const,
}

export const GYM_TRIP_LOG_PROPS_TO_IDS = {
  "last_8": "%3AsyF",
  "fixTimeTemp": "PTOR",
  "recent": "QWEx",
  "location": "RV%3C_",
  "visitDurationM": "VYwU",
  "muscleGroupScore": "YkY%5E",
  "visitTime": "Zk%5E%5D",
  "sessionInProgress": "%60dER",
  "action": "ikS~",
  "relativeWeekNumber": "rT%60g",
  "gymSet": "uqME",
  "rollup": "~cwZ",
  "name": "title"
} as const
export const GYM_TRIP_LOG_IDS_TO_PROPS = {
  "%3AsyF": "last_8",
  "PTOR": "fixTimeTemp",
  "QWEx": "recent",
  "RV%3C_": "location",
  "VYwU": "visitDurationM",
  "YkY%5E": "muscleGroupScore",
  "Zk%5E%5D": "visitTime",
  "%60dER": "sessionInProgress",
  "ikS~": "action",
  "rT%60g": "relativeWeekNumber",
  "uqME": "gymSet",
  "~cwZ": "rollup",
  "title": "name"
} as const
export const GYM_TRIP_LOG_PROPS_TO_TYPES = {
  "last_8": "formula",
  "fixTimeTemp": "button",
  "recent": "formula",
  "location": "select",
  "visitDurationM": "number",
  "muscleGroupScore": "formula",
  "visitTime": "date",
  "sessionInProgress": "formula",
  "action": "button",
  "relativeWeekNumber": "formula",
  "gymSet": "relation",
  "rollup": "rollup",
  "name": "title"
} as const

  export type GymTripLogDTOProperties = keyof typeof GYM_TRIP_LOG_PROPS_TO_IDS
  