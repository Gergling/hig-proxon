import { ExercisesResponse } from "./types"
import { UpdatePageBodyParameters,
RichTextItemRequest
} from '../../core/types/notion-api.types'

type TypeFromRecord<Obj, Type> = Obj extends Record<string, infer T> ? Extract<T, Type> : never

export type ExercisesPropertiesPatch = {
  muscleGroup_30DayActivityScore?: TypeFromRecord<UpdatePageBodyParameters['properties'], { type?: 'formula' }>['formula']
  lastSetWasThisWeek?: TypeFromRecord<UpdatePageBodyParameters['properties'], { type?: 'formula' }>['formula']
  gymSet?: TypeFromRecord<UpdatePageBodyParameters['properties'], { type?: 'relation' }>['relation']
  lastSessionTime?: TypeFromRecord<UpdatePageBodyParameters['properties'], { type?: 'formula' }>['formula']
  stabiliserMuscleGroups?: TypeFromRecord<UpdatePageBodyParameters['properties'], { type?: 'relation' }>['relation']
  muscleGroupScore?: TypeFromRecord<UpdatePageBodyParameters['properties'], { type?: 'formula' }>['formula']
  primaryMuscleGroups?: TypeFromRecord<UpdatePageBodyParameters['properties'], { type?: 'relation' }>['relation']
  name?: string | { text: string; url?: string; annotations?: RichTextItemRequest['annotations'] } | RichTextItemRequest[]
  equipmentNeeded?: TypeFromRecord<UpdatePageBodyParameters['properties'], { type?: 'relation' }>['relation']
}

  
export class ExercisesPatchDTO {
  __data: UpdatePageBodyParameters

  constructor(opts: {
    properties?: ExercisesPropertiesPatch
    coverUrl?: string
    icon?: UpdatePageBodyParameters['icon']
    archived?: UpdatePageBodyParameters['archived']
  }) {
    const { properties: props, coverUrl, icon, archived } = opts

    this.__data = {}
    this.__data.properties = {}
    this.__data.cover = coverUrl ? { type: 'external', external: { url: coverUrl } } : undefined
    this.__data.icon = icon
    this.__data.archived = archived
    
    if (props?.gymSet !== undefined) {
      this.__data.properties['%60BtR'] = {
        type: 'relation',
        relation: props.gymSet,
      }
    }

    if (props?.stabiliserMuscleGroups !== undefined) {
      this.__data.properties['rgRe'] = {
        type: 'relation',
        relation: props.stabiliserMuscleGroups,
      }
    }

    if (props?.primaryMuscleGroups !== undefined) {
      this.__data.properties['xT%3Bk'] = {
        type: 'relation',
        relation: props.primaryMuscleGroups,
      }
    }

    if (props?.name !== undefined) {
      this.__data.properties['title'] = {
        type: 'title',
        title: typeof props.name === 'string' 
          ? [{ type: 'text', text: { content: props.name } }]
          : Array.isArray(props.name)
            ? props.name
            : props.name === null
              ? []
              : [
                  {
                    type: 'text',
                    text: {
                      content: props.name.text,
                      link: props.name?.url ? { url: props.name.url } : undefined
                    },
                    annotations: props.name.annotations
                  },
                ]
      }
    }

    if (props?.equipmentNeeded !== undefined) {
      this.__data.properties['mMKh'] = {
        type: 'relation',
        relation: props.equipmentNeeded,
      }
    }
  }
}
