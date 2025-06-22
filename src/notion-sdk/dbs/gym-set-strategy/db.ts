import { GymSetStrategyResponse, GymSetStrategyQuery, GymSetStrategyQueryResponse } from './types'
import { GymSetStrategyPatchDTO } from './patch.dto'
import { GenericDatabaseClass, DatabaseOptions } from '../../core/src/generic-db'
import { GYM_SET_STRATEGY_PROPS_TO_TYPES, GYM_SET_STRATEGY_PROPS_TO_IDS, GymSetStrategyDTOProperties } from './constants'

export class GymSetStrategyDatabase extends GenericDatabaseClass<
  GymSetStrategyResponse,
  GymSetStrategyPatchDTO,
  GymSetStrategyQuery,
  GymSetStrategyQueryResponse,
  GymSetStrategyDTOProperties
> {
  protected notionDatabaseId: string
  
  constructor(options: DatabaseOptions) {
    super(options)

    this.notionDatabaseId = '19bec2ca1ca880c6b54ff8bb4ddeac74'
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
          throw new Error(`GymSetStrategy: Invalid filter value for ${key}: ${value}`)
        }
      } else {
        if (!(key in GYM_SET_STRATEGY_PROPS_TO_TYPES)) {
          throw new Error(`GymSetStrategy: Invalid filter key: ${key}`)
        }

        const propType = GYM_SET_STRATEGY_PROPS_TO_TYPES[key as keyof typeof GYM_SET_STRATEGY_PROPS_TO_TYPES];
        const propId = GYM_SET_STRATEGY_PROPS_TO_IDS[key as keyof typeof GYM_SET_STRATEGY_PROPS_TO_IDS];

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
          property: GYM_SET_STRATEGY_PROPS_TO_IDS[sort.property as keyof typeof GYM_SET_STRATEGY_PROPS_TO_IDS],
          direction: sort.direction,
        }
      }

      return sort
    })
  }

  protected queryRemapFilterProperties(filterProps?: string[]) {
    return filterProps?.map((p) => GYM_SET_STRATEGY_PROPS_TO_IDS[p as keyof typeof GYM_SET_STRATEGY_PROPS_TO_IDS])
  }
}
