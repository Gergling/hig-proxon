import { MuscleGroupsResponse } from "./types"
import { UpdatePageBodyParameters,
RichTextItemRequest
} from '../../core/types/notion-api.types'

type TypeFromRecord<Obj, Type> = Obj extends Record<string, infer T> ? Extract<T, Type> : never

export type MuscleGroupsPropertiesPatch = {
  exercisesStability?: TypeFromRecord<UpdatePageBodyParameters['properties'], { type?: 'relation' }>['relation']
  exercisesPrimary?: TypeFromRecord<UpdatePageBodyParameters['properties'], { type?: 'relation' }>['relation']
  wipPriority?: TypeFromRecord<UpdatePageBodyParameters['properties'], { type?: 'number' }>['number']
  activationThisWeek?: TypeFromRecord<UpdatePageBodyParameters['properties'], { type?: 'formula' }>['formula']
  name?: string | { text: string; url?: string; annotations?: RichTextItemRequest['annotations'] } | RichTextItemRequest[]
}

  
export class MuscleGroupsPatchDTO {
  __data: UpdatePageBodyParameters

  constructor(opts: {
    properties?: MuscleGroupsPropertiesPatch
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

    if (props?.exercisesStability !== undefined) {
      this.__data.properties['Ytlg'] = {
        type: 'relation',
        relation: props.exercisesStability,
      }
    }

    if (props?.exercisesPrimary !== undefined) {
      this.__data.properties['%5Eomy'] = {
        type: 'relation',
        relation: props.exercisesPrimary,
      }
    }

    if (props?.wipPriority !== undefined) {
      this.__data.properties['nIf%40'] = {
        type: 'number',
        number: props.wipPriority,
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
