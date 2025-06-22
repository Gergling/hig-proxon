export const EXERCISES_PROP_VALUES = {
}

export const EXERCISES_PROPS_TO_IDS = {
  "muscleGroup_30DayActivityScore": "EAuY",
  "lastSetWasThisWeek": "%5EZ%3EG",
  "gymSet": "%60BtR",
  "actionRehab": "%60%5CTO",
  "lastSessionTime": "em%3Bx",
  "stabiliserMuscleGroups": "rgRe",
  "actionStart": "tqAu",
  "muscleGroupScore": "vN%3Am",
  "primaryMuscleGroups": "xT%3Bk",
  "name": "title",
  "equipmentNeeded": "mMKh"
} as const
export const EXERCISES_IDS_TO_PROPS = {
  "EAuY": "muscleGroup_30DayActivityScore",
  "%5EZ%3EG": "lastSetWasThisWeek",
  "%60BtR": "gymSet",
  "%60%5CTO": "actionRehab",
  "em%3Bx": "lastSessionTime",
  "rgRe": "stabiliserMuscleGroups",
  "tqAu": "actionStart",
  "vN%3Am": "muscleGroupScore",
  "xT%3Bk": "primaryMuscleGroups",
  "title": "name",
  "mMKh": "equipmentNeeded"
} as const
export const EXERCISES_PROPS_TO_TYPES = {
  "muscleGroup_30DayActivityScore": "formula",
  "lastSetWasThisWeek": "formula",
  "gymSet": "relation",
  "actionRehab": "button",
  "lastSessionTime": "formula",
  "stabiliserMuscleGroups": "relation",
  "actionStart": "button",
  "muscleGroupScore": "formula",
  "primaryMuscleGroups": "relation",
  "name": "title",
  "equipmentNeeded": "relation"
} as const

  export type ExercisesDTOProperties = keyof typeof EXERCISES_PROPS_TO_IDS
  