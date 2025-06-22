import { GymTripLogResponse, GymTripLogQuery, GymTripLogQueryResponse } from './types'
import { GymTripLogPatchDTO } from './patch.dto'
import { GenericDatabaseClass, DatabaseOptions } from '../../core/src/generic-db'
import { GYM_TRIP_LOG_PROPS_TO_TYPES, GYM_TRIP_LOG_PROPS_TO_IDS, GymTripLogDTOProperties } from './constants'

export class GymTripLogDatabase extends GenericDatabaseClass<
  GymTripLogResponse,
  GymTripLogPatchDTO,
  GymTripLogQuery,
  GymTripLogQueryResponse,
  GymTripLogDTOProperties
> {
  protected notionDatabaseId: string
  
  constructor(options: DatabaseOptions) {
    super(options)

    this.notionDatabaseId = '156ec2ca1ca880f99cc5de1b6c166cc5'
  }

  protected queryRemapFilter(filter?: Record<string, unknown>) {
    if (!filter) {
      return undefined
    }

    const notionFilter = {} as Record<string, unknown>

    Object.entries(filter).forEach(([key, value]) => {
      if (key === 'and' || key === 'or') {
        if (Array.isArray(value)) {
          notionFilter[key] = value.map((v) => this.queryRemapFilter(v))
        } else {
          throw new Error(`GymTripLog: Invalid filter value for ${key}: ${value}`)
        }
      } else {
        if (!(key in GYM_TRIP_LOG_PROPS_TO_TYPES)) {
          throw new Error(`GymTripLog: Invalid filter key: ${key}`)
        }

        const propType = GYM_TRIP_LOG_PROPS_TO_TYPES[key as keyof typeof GYM_TRIP_LOG_PROPS_TO_TYPES];
        const propId = GYM_TRIP_LOG_PROPS_TO_IDS[key as keyof typeof GYM_TRIP_LOG_PROPS_TO_IDS];

        notionFilter['property'] = propId
        notionFilter[propType] = value
      }
    })
    
    return notionFilter
  }

  protected queryRemapSorts(sorts?: Record<string, string>[]) {
    return sorts?.map((sort) => {
      if ('property' in sort) {
        return {
          property: GYM_TRIP_LOG_PROPS_TO_IDS[sort.property as keyof typeof GYM_TRIP_LOG_PROPS_TO_IDS],
          direction: sort.direction,
        }
      }

      return sort
    })
  }

  protected queryRemapFilterProperties(filterProps?: string[]) {
    return filterProps?.map((p) => GYM_TRIP_LOG_PROPS_TO_IDS[p as keyof typeof GYM_TRIP_LOG_PROPS_TO_IDS])
  }
}
