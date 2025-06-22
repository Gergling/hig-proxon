import { WithOptional, Join, PathsToStringProps } from '../../core/types/helper.types'
import {
DatabaseObjectResponse,
StringRequest,
CheckboxPropertyItemObjectResponse,
CreatedTimePropertyItemObjectResponse,
FormulaPropertyItemObjectResponse,
NumberPropertyItemObjectResponse,
RelationPropertyItemObjectResponse,
RollupPropertyItemObjectResponse,
SelectPropertyItemObjectResponse,
TitlePropertyItemObjectResponse,
UniqueIdPropertyItemObjectResponse,
ExistencePropertyFilter,
QueryDatabaseBodyParameters,
TimestampCreatedTimeFilter,
TimestampLastEditedTimeFilter,
CheckboxPropertyFilter,
DatePropertyFilter,
FormulaPropertyFilter,
NumberPropertyFilter,
RelationPropertyFilter,
RollupPropertyFilter,
TextPropertyFilter
} from '../../core/types/notion-api.types'
import { GYM_SET_PROPS_TO_IDS } from './constants'

export interface GymSetResponse extends WithOptional<Omit<DatabaseObjectResponse, 'properties'>, 'title'| 'description'| 'is_inline'| 'url'| 'public_url'> {
  properties: {
    "Visit Time Earliest ": FormulaPropertyItemObjectResponse,
    "Gym Trip Log": RelationPropertyItemObjectResponse,
    "Sets: Previous": FormulaPropertyItemObjectResponse,
    "Challenge ": NumberPropertyItemObjectResponse,
    "Reps": NumberPropertyItemObjectResponse,
    "Sort Code": FormulaPropertyItemObjectResponse,
    "Visit Time": RollupPropertyItemObjectResponse,
    "🗺️ Gym Set Strategy": RelationPropertyItemObjectResponse,
    "Strategy Minimum Reps": RollupPropertyItemObjectResponse,
    "Set Muscle Score ": RollupPropertyItemObjectResponse,
    "ID": UniqueIdPropertyItemObjectResponse,
    "Done": CheckboxPropertyItemObjectResponse,
    "Gym Trip Is In Progress ": RollupPropertyItemObjectResponse,
    "Sets: Experimental": FormulaPropertyItemObjectResponse,
    "Units": Omit<SelectPropertyItemObjectResponse, 'select'> & { select: { id: StringRequest, name: 'Lbs', color: 'yellow' } | { id: StringRequest, name: 'Kg', color: 'blue' } | { id: StringRequest, name: 'Inches', color: 'green' }},
    "Display": FormulaPropertyItemObjectResponse,
    "Exercise": RelationPropertyItemObjectResponse,
    "Previous Weight/Reps": FormulaPropertyItemObjectResponse,
    "Strategy Maximum Reps": RollupPropertyItemObjectResponse,
    "Name": TitlePropertyItemObjectResponse,
    "Created time": CreatedTimePropertyItemObjectResponse
  }
}

export type GymSetResponseProperties = keyof GymSetResponse['properties']
export type GymSetPath = Join<PathsToStringProps<GymSetResponse>>

type GymSetVisitTimeEarliestPropertyFilter = FormulaPropertyFilter
type GymSetGymTripLogPropertyFilter = RelationPropertyFilter
type GymSetSetsPreviousPropertyFilter = FormulaPropertyFilter
type GymSetChallengePropertyFilter = NumberPropertyFilter
type GymSetRepsPropertyFilter = NumberPropertyFilter
type GymSetSortCodePropertyFilter = FormulaPropertyFilter
type GymSetVisitTimePropertyFilter = RollupPropertyFilter
type GymSetGymSetStrategyPropertyFilter = RelationPropertyFilter
type GymSetStrategyMinimumRepsPropertyFilter = RollupPropertyFilter
type GymSetSetMuscleScorePropertyFilter = RollupPropertyFilter
type GymSetIdPropertyFilter = NumberPropertyFilter
type GymSetDonePropertyFilter = CheckboxPropertyFilter
type GymSetGymTripIsInProgressPropertyFilter = RollupPropertyFilter
type GymSetSetsExperimentalPropertyFilter = FormulaPropertyFilter

export type GymSetUnitsPropertyType = GymSetResponse['properties']['Units']['select']['name']

type GymSetUnitsPropertyFilter =
  | {
      equals: GymSetUnitsPropertyType
    }
  | {
      does_not_equal: GymSetUnitsPropertyType
    }
  | ExistencePropertyFilter      

type GymSetDisplayPropertyFilter = FormulaPropertyFilter
type GymSetExercisePropertyFilter = RelationPropertyFilter
type GymSetPreviousWeightRepsPropertyFilter = FormulaPropertyFilter
type GymSetStrategyMaximumRepsPropertyFilter = RollupPropertyFilter
type GymSetNamePropertyFilter = TextPropertyFilter
type GymSetCreatedTimePropertyFilter = DatePropertyFilter

export type GymSetPropertyFilter = { visitTimeEarliest: GymSetVisitTimeEarliestPropertyFilter } | { gymTripLog: GymSetGymTripLogPropertyFilter } | { setsPrevious: GymSetSetsPreviousPropertyFilter } | { challenge: GymSetChallengePropertyFilter } | { reps: GymSetRepsPropertyFilter } | { sortCode: GymSetSortCodePropertyFilter } | { visitTime: GymSetVisitTimePropertyFilter } | { gymSetStrategy: GymSetGymSetStrategyPropertyFilter } | { strategyMinimumReps: GymSetStrategyMinimumRepsPropertyFilter } | { setMuscleScore: GymSetSetMuscleScorePropertyFilter } | { id: GymSetIdPropertyFilter } | { done: GymSetDonePropertyFilter } | { gymTripIsInProgress: GymSetGymTripIsInProgressPropertyFilter } | { setsExperimental: GymSetSetsExperimentalPropertyFilter } | { units: GymSetUnitsPropertyFilter } | { display: GymSetDisplayPropertyFilter } | { exercise: GymSetExercisePropertyFilter } | { previousWeightReps: GymSetPreviousWeightRepsPropertyFilter } | { strategyMaximumReps: GymSetStrategyMaximumRepsPropertyFilter } | { name: GymSetNamePropertyFilter } | { createdTime: GymSetCreatedTimePropertyFilter }

export type GymSetQuery = Omit<QueryDatabaseBodyParameters, 'filter' | 'sorts'> & {
  sorts?: Array<
  | {
      property: keyof typeof GYM_SET_PROPS_TO_IDS
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
          | GymSetPropertyFilter
          | TimestampCreatedTimeFilter
          | TimestampLastEditedTimeFilter
          | {
              // or: GymSetQuery['filter']
              or: Array<GymSetPropertyFilter>
            }
          | {
              // and: GymSetQuery['filter']
              and: Array<GymSetPropertyFilter>
            }
        >
      }
    | {
        and: Array<
          | GymSetPropertyFilter
          | TimestampCreatedTimeFilter
          | TimestampLastEditedTimeFilter
          | {
              // or: GymSetQuery['filter']
              or: Array<GymSetPropertyFilter>
            }
          | {
              // and: GymSetQuery['filter']
              and: Array<GymSetPropertyFilter>
            }
        >
      }
    | GymSetPropertyFilter
    | TimestampCreatedTimeFilter
    | TimestampLastEditedTimeFilter
}

export type GymSetQueryFilter = GymSetQuery['filter']

export type GymSetQueryResponse = {
  results: GymSetResponse[]
  next_cursor: string | null
  has_more: boolean
}

