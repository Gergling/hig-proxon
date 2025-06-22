import { MuscleGroupsResponse, MuscleGroupsQuery, MuscleGroupsQueryResponse } from './types'
import { MuscleGroupsPatchDTO } from './patch.dto'
import { GenericDatabaseClass, DatabaseOptions } from '../../core/src/generic-db'
import { MUSCLE_GROUPS_PROPS_TO_TYPES, MUSCLE_GROUPS_PROPS_TO_IDS, MuscleGroupsDTOProperties } from './constants'

export class MuscleGroupsDatabase extends GenericDatabaseClass<
  MuscleGroupsResponse,
  MuscleGroupsPatchDTO,
  MuscleGroupsQuery,
  MuscleGroupsQueryResponse,
  MuscleGroupsDTOProperties
> {
  protected notionDatabaseId: string
  
  constructor(options: DatabaseOptions) {
    super(options)

    this.notionDatabaseId = '170ec2ca1ca8802c9bc2f52a3416dadd'
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
          throw new Error(`MuscleGroups: Invalid filter value for ${key}: ${value}`)
        }
      } else {
        if (!(key in MUSCLE_GROUPS_PROPS_TO_TYPES)) {
          throw new Error(`MuscleGroups: Invalid filter key: ${key}`)
        }

        const propType = MUSCLE_GROUPS_PROPS_TO_TYPES[key as keyof typeof MUSCLE_GROUPS_PROPS_TO_TYPES];
        const propId = MUSCLE_GROUPS_PROPS_TO_IDS[key as keyof typeof MUSCLE_GROUPS_PROPS_TO_IDS];

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
          property: MUSCLE_GROUPS_PROPS_TO_IDS[sort.property as keyof typeof MUSCLE_GROUPS_PROPS_TO_IDS],
          direction: sort.direction,
        }
      }

      return sort
    })
  }

  protected queryRemapFilterProperties(filterProps?: string[]) {
    return filterProps?.map((p) => MUSCLE_GROUPS_PROPS_TO_IDS[p as keyof typeof MUSCLE_GROUPS_PROPS_TO_IDS])
  }
}
