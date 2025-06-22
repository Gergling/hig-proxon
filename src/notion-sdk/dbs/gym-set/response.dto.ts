import { GymSetResponse } from "./types"

export class GymSetResponseDTO {
  __data: GymSetResponse
  id: GymSetResponse['id']
  title: GymSetResponse['title']
  description: GymSetResponse['description']
  parent: GymSetResponse['parent']
  createdBy: GymSetResponse['created_by']
  lastEditedBy: GymSetResponse['last_edited_by']
  createdTime: GymSetResponse['created_time']
  lastEditedTime: GymSetResponse['last_edited_time']
  isInline: GymSetResponse['is_inline']
  archived: GymSetResponse['archived']
  url: GymSetResponse['url']
  publicUrl: GymSetResponse['public_url']
  properties: GymSetPropertiesResponseDTO

  constructor(res: GymSetResponse) {
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
    this.properties = new GymSetPropertiesResponseDTO(res.properties)
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
  
export class GymSetPropertiesResponseDTO {
  __props: GymSetResponse['properties']
  __data

  constructor(props: GymSetResponse['properties']) {
    this.__props = props
    this.__data = {
      visitTimeEarliest: this.__props['Visit Time Earliest '],
      gymTripLog: this.__props['Gym Trip Log'],
      setsPrevious: this.__props['Sets: Previous'],
      challenge: this.__props['Challenge '],
      reps: this.__props['Reps'],
      sortCode: this.__props['Sort Code'],
      visitTime: this.__props['Visit Time'],
      gymSetStrategy: this.__props['🗺️ Gym Set Strategy'],
      strategyMinimumReps: this.__props['Strategy Minimum Reps'],
      setMuscleScore: this.__props['Set Muscle Score '],
      id: this.__props['ID'],
      done: this.__props['Done'],
      gymTripIsInProgress: this.__props['Gym Trip Is In Progress '],
      setsExperimental: this.__props['Sets: Experimental'],
      units: this.__props['Units'],
      display: this.__props['Display'],
      exercise: this.__props['Exercise'],
      previousWeightReps: this.__props['Previous Weight/Reps'],
      strategyMaximumReps: this.__props['Strategy Maximum Reps'],
      name: this.__props['Name'],
      createdTime: this.__props['Created time'],
    }
  }


  get visitTimeEarliest() {
    return this.__props['Visit Time Earliest ']?.formula
  }

  get gymTripLogIds() {
    return (this.__props['Gym Trip Log']?.relation as unknown as Array<{ id: string }>).map((item) => item.id)  
  }


  get setsPrevious() {
    return this.__props['Sets: Previous']?.formula
  }

  get challenge() {
    return this.__props['Challenge ']?.number
  }

  get reps() {
    return this.__props['Reps']?.number
  }

  get sortCode() {
    return this.__props['Sort Code']?.formula
  }

  get visitTime() {
    return this.__props['Visit Time']?.rollup
  }

  get gymSetStrategyIds() {
    return (this.__props['🗺️ Gym Set Strategy']?.relation as unknown as Array<{ id: string }>).map((item) => item.id)  
  }


  get strategyMinimumReps() {
    return this.__props['Strategy Minimum Reps']?.rollup
  }

  get setMuscleScore() {
    return this.__props['Set Muscle Score ']?.rollup
  }

  get id() {
    return this.__props['ID']?.unique_id
  }

  get done() {
    return this.__props['Done']?.checkbox
  }

  get gymTripIsInProgress() {
    return this.__props['Gym Trip Is In Progress ']?.rollup
  }

  get setsExperimental() {
    return this.__props['Sets: Experimental']?.formula
  }

  get units() {
    return this.__props['Units']?.select
  }

  get display() {
    return this.__props['Display']?.formula
  }

  get exerciseIds() {
    return (this.__props['Exercise']?.relation as unknown as Array<{ id: string }>).map((item) => item.id)  
  }


  get previousWeightReps() {
    return this.__props['Previous Weight/Reps']?.formula
  }

  get strategyMaximumReps() {
    return this.__props['Strategy Maximum Reps']?.rollup
  }

  get name() {
    return {
      text: this.__props['Name']?.title ? this.__props['Name'].title.reduce((acc, item) => acc + item.plain_text, '') : undefined,
      links: this.__props['Name']?.title ? this.__props['Name'].title.filter((item) => item.href?.length).map((item) => item.href) : [],
      title: this.__props['Name']?.title,
    }
  }

  get createdTime() {
    return this.__props['Created time']?.created_time
  }
}
