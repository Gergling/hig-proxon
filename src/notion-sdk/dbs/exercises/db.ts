import { ExercisesResponse, ExercisesQuery, ExercisesQueryResponse } from './types'
import { ExercisesPatchDTO } from './patch.dto'
import { GenericDatabaseClass, DatabaseOptions } from '../../core/src/generic-db'
import { EXERCISES_PROPS_TO_TYPES, EXERCISES_PROPS_TO_IDS, ExercisesDTOProperties } from './constants'

export class ExercisesDatabase extends GenericDatabaseClass<
  ExercisesResponse,
  ExercisesPatchDTO,
  ExercisesQuery,
  ExercisesQueryResponse,
  ExercisesDTOProperties
> {
  protected notionDatabaseId: string
  
  constructor(options: DatabaseOptions) {
    super(options)

    this.notionDatabaseId = '15bec2ca1ca880c6b48fdea439d1017b'
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
          throw new Error(`Exercises: Invalid filter value for ${key}: ${value}`)
        }
      } else {
        if (!(key in EXERCISES_PROPS_TO_TYPES)) {
          throw new Error(`Exercises: Invalid filter key: ${key}`)
        }

        const propType = EXERCISES_PROPS_TO_TYPES[key as keyof typeof EXERCISES_PROPS_TO_TYPES];
        const propId = EXERCISES_PROPS_TO_IDS[key as keyof typeof EXERCISES_PROPS_TO_IDS];

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
          property: EXERCISES_PROPS_TO_IDS[sort.property as keyof typeof EXERCISES_PROPS_TO_IDS],
          direction: sort.direction,
        }
      }

      return sort
    })
  }

  protected queryRemapFilterProperties(filterProps?: string[]) {
    return filterProps?.map((p) => EXERCISES_PROPS_TO_IDS[p as keyof typeof EXERCISES_PROPS_TO_IDS])
  }
}
