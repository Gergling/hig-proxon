import { ExerciseEquipmentResponse, ExerciseEquipmentQuery, ExerciseEquipmentQueryResponse } from './types'
import { ExerciseEquipmentPatchDTO } from './patch.dto'
import { GenericDatabaseClass, DatabaseOptions } from '../../core/src/generic-db'
import { EXERCISE_EQUIPMENT_PROPS_TO_TYPES, EXERCISE_EQUIPMENT_PROPS_TO_IDS, ExerciseEquipmentDTOProperties } from './constants'

export class ExerciseEquipmentDatabase extends GenericDatabaseClass<
  ExerciseEquipmentResponse,
  ExerciseEquipmentPatchDTO,
  ExerciseEquipmentQuery,
  ExerciseEquipmentQueryResponse,
  ExerciseEquipmentDTOProperties
> {
  protected notionDatabaseId: string
  
  constructor(options: DatabaseOptions) {
    super(options)

    this.notionDatabaseId = '199ec2ca1ca88058ae57f72583493e13'
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
          throw new Error(`ExerciseEquipment: Invalid filter value for ${key}: ${value}`)
        }
      } else {
        if (!(key in EXERCISE_EQUIPMENT_PROPS_TO_TYPES)) {
          throw new Error(`ExerciseEquipment: Invalid filter key: ${key}`)
        }

        const propType = EXERCISE_EQUIPMENT_PROPS_TO_TYPES[key as keyof typeof EXERCISE_EQUIPMENT_PROPS_TO_TYPES];
        const propId = EXERCISE_EQUIPMENT_PROPS_TO_IDS[key as keyof typeof EXERCISE_EQUIPMENT_PROPS_TO_IDS];

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
          property: EXERCISE_EQUIPMENT_PROPS_TO_IDS[sort.property as keyof typeof EXERCISE_EQUIPMENT_PROPS_TO_IDS],
          direction: sort.direction,
        }
      }

      return sort
    })
  }

  protected queryRemapFilterProperties(filterProps?: string[]) {
    return filterProps?.map((p) => EXERCISE_EQUIPMENT_PROPS_TO_IDS[p as keyof typeof EXERCISE_EQUIPMENT_PROPS_TO_IDS])
  }
}
