import { GymSetResponse, GymSetQuery, GymSetQueryResponse } from './types'
import { GymSetPatchDTO } from './patch.dto'
import { GenericDatabaseClass, DatabaseOptions } from '../../core/src/generic-db'
import { GYM_SET_PROPS_TO_TYPES, GYM_SET_PROPS_TO_IDS, GymSetDTOProperties } from './constants'

export class GymSetDatabase extends GenericDatabaseClass<
  GymSetResponse,
  GymSetPatchDTO,
  GymSetQuery,
  GymSetQueryResponse,
  GymSetDTOProperties
> {
  protected notionDatabaseId: string
  
  constructor(options: DatabaseOptions) {
    super(options)

    this.notionDatabaseId = '15bec2ca1ca880589979d94bd39839eb'
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
          throw new Error(`GymSet: Invalid filter value for ${key}: ${value}`)
        }
      } else {
        if (!(key in GYM_SET_PROPS_TO_TYPES)) {
          throw new Error(`GymSet: Invalid filter key: ${key}`)
        }

        const propType = GYM_SET_PROPS_TO_TYPES[key as keyof typeof GYM_SET_PROPS_TO_TYPES];
        const propId = GYM_SET_PROPS_TO_IDS[key as keyof typeof GYM_SET_PROPS_TO_IDS];

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
          property: GYM_SET_PROPS_TO_IDS[sort.property as keyof typeof GYM_SET_PROPS_TO_IDS],
          direction: sort.direction,
        }
      }

      return sort
    })
  }

  protected queryRemapFilterProperties(filterProps?: string[]) {
    return filterProps?.map((p) => GYM_SET_PROPS_TO_IDS[p as keyof typeof GYM_SET_PROPS_TO_IDS])
  }
}
