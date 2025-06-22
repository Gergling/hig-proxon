import { GymSetStrategyResponse } from "./types"
import { UpdatePageBodyParameters,
RichTextItemRequest
} from '../../core/types/notion-api.types'

type TypeFromRecord<Obj, Type> = Obj extends Record<string, infer T> ? Extract<T, Type> : never

export type GymSetStrategyPropertiesPatch = {
  minimumReps?: TypeFromRecord<UpdatePageBodyParameters['properties'], { type?: 'number' }>['number']
  maximumReps?: TypeFromRecord<UpdatePageBodyParameters['properties'], { type?: 'number' }>['number']
  colour?: GymSetStrategyResponse['properties']['Colour']['select']['name']
  gymSet?: TypeFromRecord<UpdatePageBodyParameters['properties'], { type?: 'relation' }>['relation']
  name?: string | { text: string; url?: string; annotations?: RichTextItemRequest['annotations'] } | RichTextItemRequest[]
}

  
export class GymSetStrategyPatchDTO {
  __data: UpdatePageBodyParameters

  constructor(opts: {
    properties?: GymSetStrategyPropertiesPatch
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
    
    if (props?.minimumReps !== undefined) {
      this.__data.properties['Cu%3CM'] = {
        type: 'number',
        number: props.minimumReps,
      }
    }

    if (props?.maximumReps !== undefined) {
      this.__data.properties['EUJw'] = {
        type: 'number',
        number: props.maximumReps,
      }
    }

    if (props?.colour !== undefined) {
      this.__data.properties['Ikiw'] = {
        type: 'select',
        select: { name: props.colour },
      }
    }

    if (props?.gymSet !== undefined) {
      this.__data.properties['%7Bb%60e'] = {
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
