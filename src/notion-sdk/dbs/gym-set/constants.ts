export const GYM_SET_PROP_VALUES = {
"units": [
  "Lbs",
  "Kg",
  "Inches"
] as const,
}

export const GYM_SET_PROPS_TO_IDS = {
  "visitTimeEarliest": "%3A%3DcL",
  "gymTripLog": "%3DljL",
  "setsPrevious": "KHux",
  "challenge": "L~i~",
  "reps": "NPqJ",
  "sortCode": "Pnwo",
  "visitTime": "Qp%5E%3D",
  "gymSetStrategy": "R~Cm",
  "actionDupe": "Smif",
  "strategyMinimumReps": "VtcI",
  "setMuscleScore": "%60ikE",
  "id": "aW%5Ch",
  "done": "f%60%7CL",
  "gymTripIsInProgress": "g%3BdG",
  "actionRename": "htMp",
  "setsExperimental": "lBPF",
  "units": "mHu%5D",
  "display": "o_YP",
  "exercise": "tGt~",
  "previousWeightReps": "%7B%3BJK",
  "strategyMaximumReps": "%7C%5Bql",
  "name": "title",
  "createdTime": "LRbz"
} as const
export const GYM_SET_IDS_TO_PROPS = {
  "%3A%3DcL": "visitTimeEarliest",
  "%3DljL": "gymTripLog",
  "KHux": "setsPrevious",
  "L~i~": "challenge",
  "NPqJ": "reps",
  "Pnwo": "sortCode",
  "Qp%5E%3D": "visitTime",
  "R~Cm": "gymSetStrategy",
  "Smif": "actionDupe",
  "VtcI": "strategyMinimumReps",
  "%60ikE": "setMuscleScore",
  "aW%5Ch": "id",
  "f%60%7CL": "done",
  "g%3BdG": "gymTripIsInProgress",
  "htMp": "actionRename",
  "lBPF": "setsExperimental",
  "mHu%5D": "units",
  "o_YP": "display",
  "tGt~": "exercise",
  "%7B%3BJK": "previousWeightReps",
  "%7C%5Bql": "strategyMaximumReps",
  "title": "name",
  "LRbz": "createdTime"
} as const
export const GYM_SET_PROPS_TO_TYPES = {
  "visitTimeEarliest": "formula",
  "gymTripLog": "relation",
  "setsPrevious": "formula",
  "challenge": "number",
  "reps": "number",
  "sortCode": "formula",
  "visitTime": "rollup",
  "gymSetStrategy": "relation",
  "actionDupe": "button",
  "strategyMinimumReps": "rollup",
  "setMuscleScore": "rollup",
  "id": "unique_id",
  "done": "checkbox",
  "gymTripIsInProgress": "rollup",
  "actionRename": "button",
  "setsExperimental": "formula",
  "units": "select",
  "display": "formula",
  "exercise": "relation",
  "previousWeightReps": "formula",
  "strategyMaximumReps": "rollup",
  "name": "title",
  "createdTime": "created_time"
} as const

  export type GymSetDTOProperties = keyof typeof GYM_SET_PROPS_TO_IDS
  