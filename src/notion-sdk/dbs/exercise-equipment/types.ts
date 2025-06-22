import { WithOptional, Join, PathsToStringProps } from '../../core/types/helper.types'
import {
DatabaseObjectResponse,
StringRequest,
RelationPropertyItemObjectResponse,
TitlePropertyItemObjectResponse,
ExistencePropertyFilter,
QueryDatabaseBodyParameters,
TimestampCreatedTimeFilter,
TimestampLastEditedTimeFilter,
RelationPropertyFilter,
TextPropertyFilter
} from '../../core/types/notion-api.types'
import { EXERCISE_EQUIPMENT_PROPS_TO_IDS } from './constants'

export interface ExerciseEquipmentResponse extends WithOptional<Omit<DatabaseObjectResponse, 'properties'>, 'title'| 'description'| 'is_inline'| 'url'| 'public_url'> {
  properties: {
    "🤸🏻‍♂️ Exercises ": RelationPropertyItemObjectResponse,
    "Name": TitlePropertyItemObjectResponse
  }
}

export type ExerciseEquipmentResponseProperties = keyof ExerciseEquipmentResponse['properties']
export type ExerciseEquipmentPath = Join<PathsToStringProps<ExerciseEquipmentResponse>>

type ExerciseEquipmentExercisesPropertyFilter = RelationPropertyFilter
type ExerciseEquipmentNamePropertyFilter = TextPropertyFilter

export type ExerciseEquipmentPropertyFilter = { exercises: ExerciseEquipmentExercisesPropertyFilter } | { name: ExerciseEquipmentNamePropertyFilter }

export type ExerciseEquipmentQuery = Omit<QueryDatabaseBodyParameters, 'filter' | 'sorts'> & {
  sorts?: Array<
  | {
      property: keyof typeof EXERCISE_EQUIPMENT_PROPS_TO_IDS
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
          | ExerciseEquipmentPropertyFilter
          | TimestampCreatedTimeFilter
          | TimestampLastEditedTimeFilter
          | {
              // or: ExerciseEquipmentQuery['filter']
              or: Array<ExerciseEquipmentPropertyFilter>
            }
          | {
              // and: ExerciseEquipmentQuery['filter']
              and: Array<ExerciseEquipmentPropertyFilter>
            }
        >
      }
    | {
        and: Array<
          | ExerciseEquipmentPropertyFilter
          | TimestampCreatedTimeFilter
          | TimestampLastEditedTimeFilter
          | {
              // or: ExerciseEquipmentQuery['filter']
              or: Array<ExerciseEquipmentPropertyFilter>
            }
          | {
              // and: ExerciseEquipmentQuery['filter']
              and: Array<ExerciseEquipmentPropertyFilter>
            }
        >
      }
    | ExerciseEquipmentPropertyFilter
    | TimestampCreatedTimeFilter
    | TimestampLastEditedTimeFilter
}

export type ExerciseEquipmentQueryFilter = ExerciseEquipmentQuery['filter']

export type ExerciseEquipmentQueryResponse = {
  results: ExerciseEquipmentResponse[]
  next_cursor: string | null
  has_more: boolean
}

