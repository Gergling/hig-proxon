import { WithOptional, Join, PathsToStringProps } from '../../core/types/helper.types'
import {
DatabaseObjectResponse,
StringRequest,
NumberPropertyItemObjectResponse,
RelationPropertyItemObjectResponse,
SelectPropertyItemObjectResponse,
TitlePropertyItemObjectResponse,
ExistencePropertyFilter,
QueryDatabaseBodyParameters,
TimestampCreatedTimeFilter,
TimestampLastEditedTimeFilter,
NumberPropertyFilter,
RelationPropertyFilter,
TextPropertyFilter
} from '../../core/types/notion-api.types'
import { GYM_SET_STRATEGY_PROPS_TO_IDS } from './constants'

export interface GymSetStrategyResponse extends WithOptional<Omit<DatabaseObjectResponse, 'properties'>, 'title'| 'description'| 'is_inline'| 'url'| 'public_url'> {
  properties: {
    "Minimum Reps": NumberPropertyItemObjectResponse,
    "Maximum Reps": NumberPropertyItemObjectResponse,
    "Colour": Omit<SelectPropertyItemObjectResponse, 'select'> & { select: { id: StringRequest, name: '🟩', color: 'green' } | { id: StringRequest, name: '🟨', color: 'yellow' } | { id: StringRequest, name: '🟥', color: 'red' } | { id: StringRequest, name: '🟦', color: 'blue' }},
    "Gym Set": RelationPropertyItemObjectResponse,
    "Name": TitlePropertyItemObjectResponse
  }
}

export type GymSetStrategyResponseProperties = keyof GymSetStrategyResponse['properties']
export type GymSetStrategyPath = Join<PathsToStringProps<GymSetStrategyResponse>>

type GymSetStrategyMinimumRepsPropertyFilter = NumberPropertyFilter
type GymSetStrategyMaximumRepsPropertyFilter = NumberPropertyFilter

export type GymSetStrategyColourPropertyType = GymSetStrategyResponse['properties']['Colour']['select']['name']

type GymSetStrategyColourPropertyFilter =
  | {
      equals: GymSetStrategyColourPropertyType
    }
  | {
      does_not_equal: GymSetStrategyColourPropertyType
    }
  | ExistencePropertyFilter      

type GymSetStrategyGymSetPropertyFilter = RelationPropertyFilter
type GymSetStrategyNamePropertyFilter = TextPropertyFilter

export type GymSetStrategyPropertyFilter = { minimumReps: GymSetStrategyMinimumRepsPropertyFilter } | { maximumReps: GymSetStrategyMaximumRepsPropertyFilter } | { colour: GymSetStrategyColourPropertyFilter } | { gymSet: GymSetStrategyGymSetPropertyFilter } | { name: GymSetStrategyNamePropertyFilter }

export type GymSetStrategyQuery = Omit<QueryDatabaseBodyParameters, 'filter' | 'sorts'> & {
  sorts?: Array<
  | {
      property: keyof typeof GYM_SET_STRATEGY_PROPS_TO_IDS
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
          | GymSetStrategyPropertyFilter
          | TimestampCreatedTimeFilter
          | TimestampLastEditedTimeFilter
          | {
              // or: GymSetStrategyQuery['filter']
              or: Array<GymSetStrategyPropertyFilter>
            }
          | {
              // and: GymSetStrategyQuery['filter']
              and: Array<GymSetStrategyPropertyFilter>
            }
        >
      }
    | {
        and: Array<
          | GymSetStrategyPropertyFilter
          | TimestampCreatedTimeFilter
          | TimestampLastEditedTimeFilter
          | {
              // or: GymSetStrategyQuery['filter']
              or: Array<GymSetStrategyPropertyFilter>
            }
          | {
              // and: GymSetStrategyQuery['filter']
              and: Array<GymSetStrategyPropertyFilter>
            }
        >
      }
    | GymSetStrategyPropertyFilter
    | TimestampCreatedTimeFilter
    | TimestampLastEditedTimeFilter
}

export type GymSetStrategyQueryFilter = GymSetStrategyQuery['filter']

export type GymSetStrategyQueryResponse = {
  results: GymSetStrategyResponse[]
  next_cursor: string | null
  has_more: boolean
}

