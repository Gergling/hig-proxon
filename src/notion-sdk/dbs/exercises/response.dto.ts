import { ExercisesResponse } from "./types"

export class ExercisesResponseDTO {
  __data: ExercisesResponse
  id: ExercisesResponse['id']
  title: ExercisesResponse['title']
  description: ExercisesResponse['description']
  parent: ExercisesResponse['parent']
  createdBy: ExercisesResponse['created_by']
  lastEditedBy: ExercisesResponse['last_edited_by']
  createdTime: ExercisesResponse['created_time']
  lastEditedTime: ExercisesResponse['last_edited_time']
  isInline: ExercisesResponse['is_inline']
  archived: ExercisesResponse['archived']
  url: ExercisesResponse['url']
  publicUrl: ExercisesResponse['public_url']
  properties: ExercisesPropertiesResponseDTO

  constructor(res: ExercisesResponse) {
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
    this.properties = new ExercisesPropertiesResponseDTO(res.properties)
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
  
export class ExercisesPropertiesResponseDTO {
  __props: ExercisesResponse['properties']
  __data

  constructor(props: ExercisesResponse['properties']) {
    this.__props = props
    this.__data = {
      muscleGroup_30DayActivityScore: this.__props['Muscle Group 30-Day Activity Score'],
      lastSetWasThisWeek: this.__props['Last Set Was This Week'],
      gymSet: this.__props['Gym Set'],
      lastSessionTime: this.__props['Last Session Time'],
      stabiliserMuscleGroups: this.__props['💪🏻 Stabiliser Muscle Groups'],
      muscleGroupScore: this.__props['Muscle Group Score'],
      primaryMuscleGroups: this.__props['Primary Muscle Groups'],
      name: this.__props['Name'],
      equipmentNeeded: this.__props['Equipment Needed'],
    }
  }


  get muscleGroup_30DayActivityScore() {
    return this.__props['Muscle Group 30-Day Activity Score']?.formula
  }

  get lastSetWasThisWeek() {
    return this.__props['Last Set Was This Week']?.formula
  }

  get gymSetIds() {
    return (this.__props['Gym Set']?.relation as unknown as Array<{ id: string }>).map((item) => item.id)  
  }


  get lastSessionTime() {
    return this.__props['Last Session Time']?.formula
  }

  get stabiliserMuscleGroupsIds() {
    return (this.__props['💪🏻 Stabiliser Muscle Groups']?.relation as unknown as Array<{ id: string }>).map((item) => item.id)  
  }


  get muscleGroupScore() {
    return this.__props['Muscle Group Score']?.formula
  }

  get primaryMuscleGroupsIds() {
    return (this.__props['Primary Muscle Groups']?.relation as unknown as Array<{ id: string }>).map((item) => item.id)  
  }


  get name() {
    return {
      text: this.__props['Name']?.title ? this.__props['Name'].title.reduce((acc, item) => acc + item.plain_text, '') : undefined,
      links: this.__props['Name']?.title ? this.__props['Name'].title.filter((item) => item.href?.length).map((item) => item.href) : [],
      title: this.__props['Name']?.title,
    }
  }

  get equipmentNeededIds() {
    return (this.__props['Equipment Needed']?.relation as unknown as Array<{ id: string }>).map((item) => item.id)  
  }

}
