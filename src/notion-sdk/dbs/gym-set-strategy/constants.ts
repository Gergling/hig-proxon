export const GYM_SET_STRATEGY_PROP_VALUES = {
"colour": [
  "🟪",
  "🟦",
  "🟩",
  "🟨",
  "🟧",
  "🟥"
] as const,
}

export const GYM_SET_STRATEGY_PROPS_TO_IDS = {
  "minimumReps": "Cu%3CM",
  "maximumReps": "EUJw",
  "colour": "Ikiw",
  "gymSet": "%7Bb%60e",
  "name": "title"
} as const
export const GYM_SET_STRATEGY_IDS_TO_PROPS = {
  "Cu%3CM": "minimumReps",
  "EUJw": "maximumReps",
  "Ikiw": "colour",
  "%7Bb%60e": "gymSet",
  "title": "name"
} as const
export const GYM_SET_STRATEGY_PROPS_TO_TYPES = {
  "minimumReps": "number",
  "maximumReps": "number",
  "colour": "select",
  "gymSet": "relation",
  "name": "title"
} as const

  export type GymSetStrategyDTOProperties = keyof typeof GYM_SET_STRATEGY_PROPS_TO_IDS
  