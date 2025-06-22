type Equipment = {
  name: string;
};

type MuscleGroup = {
  name: string;
};

type ExerciseMuscleGroup = {
  muscleGroup: MuscleGroup;
  focus: boolean;
};

type GymExercise = {
  name: string;
  equipment: Equipment;
  muscleGroups: {
    [key: MuscleGroup['name']]: ExerciseMuscleGroup;
  };
};

type GymExerciseSet = {
  exercise: GymExercise;
  challenge: {
    value: number;
    unit: 'lbs' | 'kgs' | 'inches';
  };
  reps: number;
  progression: {
    previous: GymExerciseSet;
    month: GymExerciseSet;
    all: GymExerciseSet;
  } | undefined;
};

// We will want a list of gym trips.
export type GymTripProps = {
  visitTime: string | undefined; // TODO: Probably a good Temporal opportunity.
  sets: GymExerciseSet[];
  muscleScore: number;
};

// We will want body measurements.
type PhysicalMeasurementsProps = {
  // TODO: We won't *need* to calculate these in Notion anymore.
  // The calculations should probably be done here.
  indeces: {
    bbi: number;
    bfi: number;
    mmi: number;
  };
  base: {
    fat: number;
    muscle: number;
  };
};
