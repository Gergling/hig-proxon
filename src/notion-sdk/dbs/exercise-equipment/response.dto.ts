import { ExerciseEquipmentResponse } from "./types"

export class ExerciseEquipmentResponseDTO {
  __data: ExerciseEquipmentResponse
  id: ExerciseEquipmentResponse['id']
  title: ExerciseEquipmentResponse['title']
  description: ExerciseEquipmentResponse['description']
  parent: ExerciseEquipmentResponse['parent']
  createdBy: ExerciseEquipmentResponse['created_by']
  lastEditedBy: ExerciseEquipmentResponse['last_edited_by']
  createdTime: ExerciseEquipmentResponse['created_time']
  lastEditedTime: ExerciseEquipmentResponse['last_edited_time']
  isInline: ExerciseEquipmentResponse['is_inline']
  archived: ExerciseEquipmentResponse['archived']
  url: ExerciseEquipmentResponse['url']
  publicUrl: ExerciseEquipmentResponse['public_url']
  properties: ExerciseEquipmentPropertiesResponseDTO

  constructor(res: ExerciseEquipmentResponse) {
    this.__data = res
    this.id = res.id
    this.title = res.title
    this.description = res.description
    this.parent = res.parent
    this.createdBy = res.created_by
    this.lastEditedBy = res.last_edited_by
    this.createdTime = res.created_time
    this.lastEditedTime = res.last_edited_time
    this.isInline = res.is_inline
    this.archived = res.archived
    this.url = res.url
    this.publicUrl = res.public_url
    this.properties = new ExerciseEquipmentPropertiesResponseDTO(res.properties)
  }

  get cover() {
    return {
      type: this.__data.cover?.type,
      url: this.__data.cover?.type === 'external' ? this.__data.cover?.external?.url : this.__data.cover?.file?.url,
    }
  }

  get icon() {
    return {
      type: this.__data.icon?.type,
      url:
        this.__data.icon?.type === 'external'
          ? this.__data.icon?.external?.url
          : this.__data.icon?.type === 'file'
            ? this.__data.icon?.file?.url
            : undefined,
      emoji: this.__data.icon?.type === 'emoji' ? this.__data.icon?.emoji : undefined,
    }
  }
}
  
export class ExerciseEquipmentPropertiesResponseDTO {
  __props: ExerciseEquipmentResponse['properties']
  __data

  constructor(props: ExerciseEquipmentResponse['properties']) {
    this.__props = props
    this.__data = {
      exercises: this.__props['🤸🏻‍♂️ Exercises '],
      name: this.__props['Name'],
    }
  }


  get exercisesIds() {
    return (this.__props['🤸🏻‍♂️ Exercises ']?.relation as unknown as Array<{ id: string }>).map((item) => item.id)  
  }


  get name() {
    return {
      text: this.__props['Name']?.title ? this.__props['Name'].title.reduce((acc, item) => acc + item.plain_text, '') : undefined,
      links: this.__props['Name']?.title ? this.__props['Name'].title.filter((item) => item.href?.length).map((item) => item.href) : [],
      title: this.__props['Name']?.title,
    }
  }
}
