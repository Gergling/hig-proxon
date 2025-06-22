import { WithOptional, Join, PathsToStringProps } from '../../core/types/helper.types'
import {
DatabaseObjectResponse,
StringRequest,
FormulaPropertyItemObjectResponse,
RelationPropertyItemObjectResponse,
TitlePropertyItemObjectResponse,
ExistencePropertyFilter,
QueryDatabaseBodyParameters,
TimestampCreatedTimeFilter,
TimestampLastEditedTimeFilter,
FormulaPropertyFilter,
RelationPropertyFilter,
TextPropertyFilter
} from '../../core/types/notion-api.types'
import { EXERCISES_PROPS_TO_IDS } from './constants'

export interface ExercisesResponse extends WithOptional<Omit<DatabaseObjectResponse, 'properties'>, 'title'| 'description'| 'is_inline'| 'url'| 'public_url'> {
  properties: {
    "Muscle Group 30-Day Activity Score": FormulaPropertyItemObjectResponse,
    "Last Set Was This Week": FormulaPropertyItemObjectResponse,
    "Gym Set": RelationPropertyItemObjectResponse,
    "Last Session Time": FormulaPropertyItemObjectResponse,
    "💪🏻 Stabiliser Muscle Groups": RelationPropertyItemObjectResponse,
    "Muscle Group Score": FormulaPropertyItemObjectResponse,
    "Primary Muscle Groups": RelationPropertyItemObjectResponse,
    "Name": TitlePropertyItemObjectResponse,
    "Equipment Needed": RelationPropertyItemObjectResponse
  }
}

export type ExercisesResponseProperties = keyof ExercisesResponse['properties']
export type ExercisesPath = Join<PathsToStringProps<ExercisesResponse>>

type ExercisesMuscleGroup_30DayActivityScorePropertyFilter = FormulaPropertyFilter
type ExercisesLastSetWasThisWeekPropertyFilter = FormulaPropertyFilter
type ExercisesGymSetPropertyFilter = RelationPropertyFilter
type ExercisesLastSessionTimePropertyFilter = FormulaPropertyFilter
type ExercisesStabiliserMuscleGroupsPropertyFilter = RelationPropertyFilter
type ExercisesMuscleGroupScorePropertyFilter = FormulaPropertyFilter
type ExercisesPrimaryMuscleGroupsPropertyFilter = RelationPropertyFilter
type ExercisesNamePropertyFilter = TextPropertyFilter
type ExercisesEquipmentNeededPropertyFilter = RelationPropertyFilter

export type ExercisesPropertyFilter = { muscleGroup_30DayActivityScore: ExercisesMuscleGroup_30DayActivityScorePropertyFilter } | { lastSetWasThisWeek: ExercisesLastSetWasThisWeekPropertyFilter } | { gymSet: ExercisesGymSetPropertyFilter } | { lastSessionTime: ExercisesLastSessionTimePropertyFilter } | { stabiliserMuscleGroups: ExercisesStabiliserMuscleGroupsPropertyFilter } | { muscleGroupScore: ExercisesMuscleGroupScorePropertyFilter } | { primaryMuscleGroups: ExercisesPrimaryMuscleGroupsPropertyFilter } | { name: ExercisesNamePropertyFilter } | { equipmentNeeded: ExercisesEquipmentNeededPropertyFilter }

export type ExercisesQuery = Omit<QueryDatabaseBodyParameters, 'filter' | 'sorts'> & {
  sorts?: Array<
  | {
      property: keyof typeof EXERCISES_PROPS_TO_IDS
      direction: 'ascending' | 'descending'
    }
  | {
      timestamp: 'created_time' | 'last_edited_time'
      direction: 'ascending' | 'descending'
    }
  >
  filter?:
    | {
        or: Array<
          | ExercisesPropertyFilter
          | TimestampCreatedTimeFilter
          | TimestampLastEditedTimeFilter
          | {
              // or: ExercisesQuery['filter']
              or: Array<ExercisesPropertyFilter>
            }
          | {
              // and: ExercisesQuery['filter']
              and: Array<ExercisesPropertyFilter>
            }
        >
      }
    | {
        and: Array<
          | ExercisesPropertyFilter
          | TimestampCreatedTimeFilter
          | TimestampLastEditedTimeFilter
          | {
              // or: ExercisesQuery['filter']
              or: Array<ExercisesPropertyFilter>
            }
          | {
              // and: ExercisesQuery['filter']
              and: Array<ExercisesPropertyFilter>
            }
        >
      }
    | ExercisesPropertyFilter
    | TimestampCreatedTimeFilter
    | TimestampLastEditedTimeFilter
}

export type ExercisesQueryFilter = ExercisesQuery['filter']

export type ExercisesQueryResponse = {
  results: ExercisesResponse[]
  next_cursor: string | null
  has_more: boolean
}

