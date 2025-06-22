import { WithOptional, Join, PathsToStringProps } from '../../core/types/helper.types'
import {
DatabaseObjectResponse,
StringRequest,
FormulaPropertyItemObjectResponse,
NumberPropertyItemObjectResponse,
RelationPropertyItemObjectResponse,
TitlePropertyItemObjectResponse,
ExistencePropertyFilter,
QueryDatabaseBodyParameters,
TimestampCreatedTimeFilter,
TimestampLastEditedTimeFilter,
FormulaPropertyFilter,
NumberPropertyFilter,
RelationPropertyFilter,
TextPropertyFilter
} from '../../core/types/notion-api.types'
import { MUSCLE_GROUPS_PROPS_TO_IDS } from './constants'

export interface MuscleGroupsResponse extends WithOptional<Omit<DatabaseObjectResponse, 'properties'>, 'title'| 'description'| 'is_inline'| 'url'| 'public_url'> {
  properties: {
    "30-Day Activity ": FormulaPropertyItemObjectResponse,
    "🤸🏻‍♂️ Exercises Stability ": RelationPropertyItemObjectResponse,
    "Exercises Primary ": RelationPropertyItemObjectResponse,
    "(WIP?) Priority": NumberPropertyItemObjectResponse,
    "Activation This Week": FormulaPropertyItemObjectResponse,
    "Name": TitlePropertyItemObjectResponse
  }
}

export type MuscleGroupsResponseProperties = keyof MuscleGroupsResponse['properties']
export type MuscleGroupsPath = Join<PathsToStringProps<MuscleGroupsResponse>>

type MuscleGroups30DayActivityPropertyFilter = FormulaPropertyFilter
type MuscleGroupsExercisesStabilityPropertyFilter = RelationPropertyFilter
type MuscleGroupsExercisesPrimaryPropertyFilter = RelationPropertyFilter
type MuscleGroupsWipPriorityPropertyFilter = NumberPropertyFilter
type MuscleGroupsActivationThisWeekPropertyFilter = FormulaPropertyFilter
type MuscleGroupsNamePropertyFilter = TextPropertyFilter

export type MuscleGroupsPropertyFilter = { exercisesStability: MuscleGroupsExercisesStabilityPropertyFilter } | { exercisesPrimary: MuscleGroupsExercisesPrimaryPropertyFilter } | { wipPriority: MuscleGroupsWipPriorityPropertyFilter } | { activationThisWeek: MuscleGroupsActivationThisWeekPropertyFilter } | { name: MuscleGroupsNamePropertyFilter }

export type MuscleGroupsQuery = Omit<QueryDatabaseBodyParameters, 'filter' | 'sorts'> & {
  sorts?: Array<
  | {
      property: keyof typeof MUSCLE_GROUPS_PROPS_TO_IDS
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
          | MuscleGroupsPropertyFilter
          | TimestampCreatedTimeFilter
          | TimestampLastEditedTimeFilter
          | {
              // or: MuscleGroupsQuery['filter']
              or: Array<MuscleGroupsPropertyFilter>
            }
          | {
              // and: MuscleGroupsQuery['filter']
              and: Array<MuscleGroupsPropertyFilter>
            }
        >
      }
    | {
        and: Array<
          | MuscleGroupsPropertyFilter
          | TimestampCreatedTimeFilter
          | TimestampLastEditedTimeFilter
          | {
              // or: MuscleGroupsQuery['filter']
              or: Array<MuscleGroupsPropertyFilter>
            }
          | {
              // and: MuscleGroupsQuery['filter']
              and: Array<MuscleGroupsPropertyFilter>
            }
        >
      }
    | MuscleGroupsPropertyFilter
    | TimestampCreatedTimeFilter
    | TimestampLastEditedTimeFilter
}

export type MuscleGroupsQueryFilter = MuscleGroupsQuery['filter']

export type MuscleGroupsQueryResponse = {
  results: MuscleGroupsResponse[]
  next_cursor: string | null
  has_more: boolean
}

