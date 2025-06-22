import { GymSetStrategyResponse } from "./types"

export class GymSetStrategyResponseDTO {
  __data: GymSetStrategyResponse
  id: GymSetStrategyResponse['id']
  title: GymSetStrategyResponse['title']
  description: GymSetStrategyResponse['description']
  parent: GymSetStrategyResponse['parent']
  createdBy: GymSetStrategyResponse['created_by']
  lastEditedBy: GymSetStrategyResponse['last_edited_by']
  createdTime: GymSetStrategyResponse['created_time']
  lastEditedTime: GymSetStrategyResponse['last_edited_time']
  isInline: GymSetStrategyResponse['is_inline']
  archived: GymSetStrategyResponse['archived']
  url: GymSetStrategyResponse['url']
  publicUrl: GymSetStrategyResponse['public_url']
  properties: GymSetStrategyPropertiesResponseDTO

  constructor(res: GymSetStrategyResponse) {
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
    this.properties = new GymSetStrategyPropertiesResponseDTO(res.properties)
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
  
export class GymSetStrategyPropertiesResponseDTO {
  __props: GymSetStrategyResponse['properties']
  __data

  constructor(props: GymSetStrategyResponse['properties']) {
    this.__props = props
    this.__data = {
      minimumReps: this.__props['Minimum Reps'],
      maximumReps: this.__props['Maximum Reps'],
      colour: this.__props['Colour'],
      gymSet: this.__props['Gym Set'],
      name: this.__props['Name'],
    }
  }


  get minimumReps() {
    return this.__props['Minimum Reps']?.number
  }

  get maximumReps() {
    return this.__props['Maximum Reps']?.number
  }

  get colour() {
    return this.__props['Colour']?.select
  }

  get gymSetIds() {
    return (this.__props['Gym Set']?.relation as unknown as Array<{ id: string }>).map((item) => item.id)  
  }


  get name() {
    return {
      text: this.__props['Name']?.title ? this.__props['Name'].title.reduce((acc, item) => acc + item.plain_text, '') : undefined,
      links: this.__props['Name']?.title ? this.__props['Name'].title.filter((item) => item.href?.length).map((item) => item.href) : [],
      title: this.__props['Name']?.title,
    }
  }
}
