export const EXERCISE_EQUIPMENT_PROP_VALUES = {
}

export const EXERCISE_EQUIPMENT_PROPS_TO_IDS = {
  "exercises": "~a%3Db",
  "name": "title"
} as const
export const EXERCISE_EQUIPMENT_IDS_TO_PROPS = {
  "~a%3Db": "exercises",
  "title": "name"
} as const
export const EXERCISE_EQUIPMENT_PROPS_TO_TYPES = {
  "exercises": "relation",
  "name": "title"
} as const

  export type ExerciseEquipmentDTOProperties = keyof typeof EXERCISE_EQUIPMENT_PROPS_TO_IDS
  