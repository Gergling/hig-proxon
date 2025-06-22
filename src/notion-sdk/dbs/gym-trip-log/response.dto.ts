import { GymTripLogResponse } from "./types"

export class GymTripLogResponseDTO {
  __data: GymTripLogResponse
  id: GymTripLogResponse['id']
  title: GymTripLogResponse['title']
  description: GymTripLogResponse['description']
  parent: GymTripLogResponse['parent']
  createdBy: GymTripLogResponse['created_by']
  lastEditedBy: GymTripLogResponse['last_edited_by']
  createdTime: GymTripLogResponse['created_time']
  lastEditedTime: GymTripLogResponse['last_edited_time']
  isInline: GymTripLogResponse['is_inline']
  archived: GymTripLogResponse['archived']
  url: GymTripLogResponse['url']
  publicUrl: GymTripLogResponse['public_url']
  properties: GymTripLogPropertiesResponseDTO

  constructor(res: GymTripLogResponse) {
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
    this.properties = new GymTripLogPropertiesResponseDTO(res.properties)
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
  
export class GymTripLogPropertiesResponseDTO {
  __props: GymTripLogResponse['properties']
  __data

  constructor(props: GymTripLogResponse['properties']) {
    this.__props = props
    this.__data = {
      last_8: this.__props['Last 8'],
      recent: this.__props['Recent'],
      location: this.__props['Location'],
      visitDurationM: this.__props['Visit Duration (m)'],
      muscleGroupScore: this.__props['Muscle Group Score'],
      visitTime: this.__props['Visit Time'],
      sessionInProgress: this.__props['Session In Progress'],
      relativeWeekNumber: this.__props['Relative Week Number'],
      gymSet: this.__props['Gym Set'],
      rollup: this.__props['Rollup'],
      name: this.__props['Name'],
    }
  }


  get last_8() {
    return this.__props['Last 8']?.formula
  }

  get recent() {
    return this.__props['Recent']?.formula
  }

  get location() {
    return this.__props['Location']?.select
  }

  get visitDurationM() {
    return this.__props['Visit Duration (m)']?.number
  }

  get muscleGroupScore() {
    return this.__props['Muscle Group Score']?.formula
  }

  get visitTime() {
    return this.__props['Visit Time']?.date
  }

  get sessionInProgress() {
    return this.__props['Session In Progress']?.formula
  }

  get relativeWeekNumber() {
    return this.__props['Relative Week Number']?.formula
  }

  get gymSetIds() {
    return (this.__props['Gym Set']?.relation as unknown as Array<{ id: string }>).map((item) => item.id)  
  }


  get rollup() {
    return this.__props['Rollup']?.rollup
  }

  get name() {
    return {
      text: this.__props['Name']?.title ? this.__props['Name'].title.reduce((acc, item) => acc + item.plain_text, '') : undefined,
      links: this.__props['Name']?.title ? this.__props['Name'].title.filter((item) => item.href?.length).map((item) => item.href) : [],
      title: this.__props['Name']?.title,
    }
  }
}
