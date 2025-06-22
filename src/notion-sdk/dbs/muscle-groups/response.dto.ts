import { MuscleGroupsResponse } from "./types"

export class MuscleGroupsResponseDTO {
  __data: MuscleGroupsResponse
  id: MuscleGroupsResponse['id']
  title: MuscleGroupsResponse['title']
  description: MuscleGroupsResponse['description']
  parent: MuscleGroupsResponse['parent']
  createdBy: MuscleGroupsResponse['created_by']
  lastEditedBy: MuscleGroupsResponse['last_edited_by']
  createdTime: MuscleGroupsResponse['created_time']
  lastEditedTime: MuscleGroupsResponse['last_edited_time']
  isInline: MuscleGroupsResponse['is_inline']
  archived: MuscleGroupsResponse['archived']
  url: MuscleGroupsResponse['url']
  publicUrl: MuscleGroupsResponse['public_url']
  properties: MuscleGroupsPropertiesResponseDTO

  constructor(res: MuscleGroupsResponse) {
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
    this.properties = new MuscleGroupsPropertiesResponseDTO(res.properties)
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
  
export class MuscleGroupsPropertiesResponseDTO {
  __props: MuscleGroupsResponse['properties']
  __data

  constructor(props: MuscleGroupsResponse['properties']) {
    this.__props = props
    this.__data = {
      exercisesStability: this.__props['🤸🏻‍♂️ Exercises Stability '],
      exercisesPrimary: this.__props['Exercises Primary '],
      wipPriority: this.__props['(WIP?) Priority'],
      activationThisWeek: this.__props['Activation This Week'],
      name: this.__props['Name'],
    }
  }


  get exercisesStabilityIds() {
    return (this.__props['🤸🏻‍♂️ Exercises Stability ']?.relation as unknown as Array<{ id: string }>).map((item) => item.id)  
  }


  get exercisesPrimaryIds() {
    return (this.__props['Exercises Primary ']?.relation as unknown as Array<{ id: string }>).map((item) => item.id)  
  }


  get wipPriority() {
    return this.__props['(WIP?) Priority']?.number
  }

  get activationThisWeek() {
    return this.__props['Activation This Week']?.formula
  }

  get name() {
    return {
      text: this.__props['Name']?.title ? this.__props['Name'].title.reduce((acc, item) => acc + item.plain_text, '') : undefined,
      links: this.__props['Name']?.title ? this.__props['Name'].title.filter((item) => item.href?.length).map((item) => item.href) : [],
      title: this.__props['Name']?.title,
    }
  }
}
