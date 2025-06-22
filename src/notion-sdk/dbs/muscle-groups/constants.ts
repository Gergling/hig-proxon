export const MUSCLE_GROUPS_PROP_VALUES = {
}

export const MUSCLE_GROUPS_PROPS_TO_IDS = {
  "30DayActivity": "TE%3FO",
  "exercisesStability": "Ytlg",
  "exercisesPrimary": "%5Eomy",
  "wipPriority": "nIf%40",
  "activationThisWeek": "tlpS",
  "name": "title"
} as const
export const MUSCLE_GROUPS_IDS_TO_PROPS = {
  "TE%3FO": "30DayActivity",
  "Ytlg": "exercisesStability",
  "%5Eomy": "exercisesPrimary",
  "nIf%40": "wipPriority",
  "tlpS": "activationThisWeek",
  "title": "name"
} as const
export const MUSCLE_GROUPS_PROPS_TO_TYPES = {
  "30DayActivity": "formula",
  "exercisesStability": "relation",
  "exercisesPrimary": "relation",
  "wipPriority": "number",
  "activationThisWeek": "formula",
  "name": "title"
} as const

  export type MuscleGroupsDTOProperties = keyof typeof MUSCLE_GROUPS_PROPS_TO_IDS
  