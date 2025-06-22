import { GymTripLogResponse } from "./types"
import { UpdatePageBodyParameters,
RichTextItemRequest
} from '../../core/types/notion-api.types'

type TypeFromRecord<Obj, Type> = Obj extends Record<string, infer T> ? Extract<T, Type> : never

export type GymTripLogPropertiesPatch = {
  last_8?: TypeFromRecord<UpdatePageBodyParameters['properties'], { type?: 'formula' }>['formula']
  recent?: TypeFromRecord<UpdatePageBodyParameters['properties'], { type?: 'formula' }>['formula']
  location?: GymTripLogResponse['properties']['Location']['select']['name']
  visitDurationM?: TypeFromRecord<UpdatePageBodyParameters['properties'], { type?: 'number' }>['number']
  muscleGroupScore?: TypeFromRecord<UpdatePageBodyParameters['properties'], { type?: 'formula' }>['formula']
  visitTime?: TypeFromRecord<UpdatePageBodyParameters['properties'], { type?: 'date' }>['date']
  sessionInProgress?: TypeFromRecord<UpdatePageBodyParameters['properties'], { type?: 'formula' }>['formula']
  relativeWeekNumber?: TypeFromRecord<UpdatePageBodyParameters['properties'], { type?: 'formula' }>['formula']
  gymSet?: TypeFromRecord<UpdatePageBodyParameters['properties'], { type?: 'relation' }>['relation']
  name?: string | { text: string; url?: string; annotations?: RichTextItemRequest['annotations'] } | RichTextItemRequest[]
}

  
export class GymTripLogPatchDTO {
  __data: UpdatePageBodyParameters

  constructor(opts: {
    properties?: GymTripLogPropertiesPatch
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
    
    if (props?.location !== undefined) {
      this.__data.properties['RV%3C_'] = {
        type: 'select',
        select: { name: props.location },
      }
    }

    if (props?.visitDurationM !== undefined) {
      this.__data.properties['VYwU'] = {
        type: 'number',
        number: props.visitDurationM,
      }
    }

    if (props?.visitTime !== undefined) {
      this.__data.properties['Zk%5E%5D'] = {
        type: 'date',
        date: props.visitTime,
      }
    }

    if (props?.gymSet !== undefined) {
      this.__data.properties['uqME'] = {
        type: 'relation',
        relation: props.gymSet,
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
