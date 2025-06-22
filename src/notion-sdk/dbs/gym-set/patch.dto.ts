import { GymSetResponse } from "./types"
import { UpdatePageBodyParameters,
RichTextItemRequest
} from '../../core/types/notion-api.types'

type TypeFromRecord<Obj, Type> = Obj extends Record<string, infer T> ? Extract<T, Type> : never

export type GymSetPropertiesPatch = {
  visitTimeEarliest?: TypeFromRecord<UpdatePageBodyParameters['properties'], { type?: 'formula' }>['formula']
  gymTripLog?: TypeFromRecord<UpdatePageBodyParameters['properties'], { type?: 'relation' }>['relation']
  setsPrevious?: TypeFromRecord<UpdatePageBodyParameters['properties'], { type?: 'formula' }>['formula']
  challenge?: TypeFromRecord<UpdatePageBodyParameters['properties'], { type?: 'number' }>['number']
  reps?: TypeFromRecord<UpdatePageBodyParameters['properties'], { type?: 'number' }>['number']
  sortCode?: TypeFromRecord<UpdatePageBodyParameters['properties'], { type?: 'formula' }>['formula']
  gymSetStrategy?: TypeFromRecord<UpdatePageBodyParameters['properties'], { type?: 'relation' }>['relation']
  id?: TypeFromRecord<UpdatePageBodyParameters['properties'], { type?: 'unique_id' }>['unique_id']
  done?: TypeFromRecord<UpdatePageBodyParameters['properties'], { type?: 'checkbox' }>['checkbox']
  setsExperimental?: TypeFromRecord<UpdatePageBodyParameters['properties'], { type?: 'formula' }>['formula']
  units?: GymSetResponse['properties']['Units']['select']['name']
  display?: TypeFromRecord<UpdatePageBodyParameters['properties'], { type?: 'formula' }>['formula']
  exercise?: TypeFromRecord<UpdatePageBodyParameters['properties'], { type?: 'relation' }>['relation']
  previousWeightReps?: TypeFromRecord<UpdatePageBodyParameters['properties'], { type?: 'formula' }>['formula']
  name?: string | { text: string; url?: string; annotations?: RichTextItemRequest['annotations'] } | RichTextItemRequest[]
}

  
export class GymSetPatchDTO {
  __data: UpdatePageBodyParameters

  constructor(opts: {
    properties?: GymSetPropertiesPatch
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
    
    if (props?.gymTripLog !== undefined) {
      this.__data.properties['%3DljL'] = {
        type: 'relation',
        relation: props.gymTripLog,
      }
    }

    if (props?.challenge !== undefined) {
      this.__data.properties['L~i~'] = {
        type: 'number',
        number: props.challenge,
      }
    }

    if (props?.reps !== undefined) {
      this.__data.properties['NPqJ'] = {
        type: 'number',
        number: props.reps,
      }
    }

    if (props?.gymSetStrategy !== undefined) {
      this.__data.properties['R~Cm'] = {
        type: 'relation',
        relation: props.gymSetStrategy,
      }
    }

    if (props?.done !== undefined) {
      this.__data.properties['f%60%7CL'] = {
        type: 'checkbox',
        checkbox: props.done,
      }
    }

    if (props?.units !== undefined) {
      this.__data.properties['mHu%5D'] = {
        type: 'select',
        select: { name: props.units },
      }
    }

    if (props?.exercise !== undefined) {
      this.__data.properties['tGt~'] = {
        type: 'relation',
        relation: props.exercise,
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
  }
}
