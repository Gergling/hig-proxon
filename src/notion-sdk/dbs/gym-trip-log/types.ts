import { WithOptional, Join, PathsToStringProps } from '../../core/types/helper.types'
import {
DatabaseObjectResponse,
StringRequest,
DatePropertyItemObjectResponse,
FormulaPropertyItemObjectResponse,
NumberPropertyItemObjectResponse,
RelationPropertyItemObjectResponse,
RollupPropertyItemObjectResponse,
SelectPropertyItemObjectResponse,
TitlePropertyItemObjectResponse,
ExistencePropertyFilter,
QueryDatabaseBodyParameters,
TimestampCreatedTimeFilter,
TimestampLastEditedTimeFilter,
DatePropertyFilter,
FormulaPropertyFilter,
NumberPropertyFilter,
RelationPropertyFilter,
RollupPropertyFilter,
TextPropertyFilter
} from '../../core/types/notion-api.types'
import { GYM_TRIP_LOG_PROPS_TO_IDS } from './constants'

export interface GymTripLogResponse extends WithOptional<Omit<DatabaseObjectResponse, 'properties'>, 'title'| 'description'| 'is_inline'| 'url'| 'public_url'> {
  properties: {
    "Last 8": FormulaPropertyItemObjectResponse,
    "Recent": FormulaPropertyItemObjectResponse,
    "Location": Omit<SelectPropertyItemObjectResponse, 'select'> & { select: { id: StringRequest, name: 'Monument', color: 'brown' } | { id: StringRequest, name: 'Croydon', color: 'orange' } | { id: StringRequest, name: 'Sydenham', color: 'yellow' }},
    "Visit Duration (m)": NumberPropertyItemObjectResponse,
    "Muscle Group Score": FormulaPropertyItemObjectResponse,
    "Visit Time": DatePropertyItemObjectResponse,
    "Session In Progress": FormulaPropertyItemObjectResponse,
    "Relative Week Number": FormulaPropertyItemObjectResponse,
    "Gym Set": RelationPropertyItemObjectResponse,
    "Rollup": RollupPropertyItemObjectResponse,
    "Name": TitlePropertyItemObjectResponse
  }
}

export type GymTripLogResponseProperties = keyof GymTripLogResponse['properties']
export type GymTripLogPath = Join<PathsToStringProps<GymTripLogResponse>>

type GymTripLogLast_8PropertyFilter = FormulaPropertyFilter
type GymTripLogRecentPropertyFilter = FormulaPropertyFilter

export type GymTripLogLocationPropertyType = GymTripLogResponse['properties']['Location']['select']['name']

type GymTripLogLocationPropertyFilter =
  | {
      equals: GymTripLogLocationPropertyType
    }
  | {
      does_not_equal: GymTripLogLocationPropertyType
    }
  | ExistencePropertyFilter      

type GymTripLogVisitDurationMPropertyFilter = NumberPropertyFilter
type GymTripLogMuscleGroupScorePropertyFilter = FormulaPropertyFilter
type GymTripLogVisitTimePropertyFilter = DatePropertyFilter
type GymTripLogSessionInProgressPropertyFilter = FormulaPropertyFilter
type GymTripLogRelativeWeekNumberPropertyFilter = FormulaPropertyFilter
type GymTripLogGymSetPropertyFilter = RelationPropertyFilter
type GymTripLogRollupPropertyFilter = RollupPropertyFilter
type GymTripLogNamePropertyFilter = TextPropertyFilter

export type GymTripLogPropertyFilter = { last_8: GymTripLogLast_8PropertyFilter } | { recent: GymTripLogRecentPropertyFilter } | { location: GymTripLogLocationPropertyFilter } | { visitDurationM: GymTripLogVisitDurationMPropertyFilter } | { muscleGroupScore: GymTripLogMuscleGroupScorePropertyFilter } | { visitTime: GymTripLogVisitTimePropertyFilter } | { sessionInProgress: GymTripLogSessionInProgressPropertyFilter } | { relativeWeekNumber: GymTripLogRelativeWeekNumberPropertyFilter } | { gymSet: GymTripLogGymSetPropertyFilter } | { rollup: GymTripLogRollupPropertyFilter } | { name: GymTripLogNamePropertyFilter }

export type GymTripLogQuery = Omit<QueryDatabaseBodyParameters, 'filter' | 'sorts'> & {
  sorts?: Array<
  | {
      property: keyof typeof GYM_TRIP_LOG_PROPS_TO_IDS
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
          | GymTripLogPropertyFilter
          | TimestampCreatedTimeFilter
          | TimestampLastEditedTimeFilter
          | {
              // or: GymTripLogQuery['filter']
              or: Array<GymTripLogPropertyFilter>
            }
          | {
              // and: GymTripLogQuery['filter']
              and: Array<GymTripLogPropertyFilter>
            }
        >
      }
    | {
        and: Array<
          | GymTripLogPropertyFilter
          | TimestampCreatedTimeFilter
          | TimestampLastEditedTimeFilter
          | {
              // or: GymTripLogQuery['filter']
              or: Array<GymTripLogPropertyFilter>
            }
          | {
              // and: GymTripLogQuery['filter']
              and: Array<GymTripLogPropertyFilter>
            }
        >
      }
    | GymTripLogPropertyFilter
    | TimestampCreatedTimeFilter
    | TimestampLastEditedTimeFilter
}

export type GymTripLogQueryFilter = GymTripLogQuery['filter']

export type GymTripLogQueryResponse = {
  results: GymTripLogResponse[]
  next_cursor: string | null
  has_more: boolean
}

