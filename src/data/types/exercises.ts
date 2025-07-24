import { Temporal } from "temporal-polyfill";
import { GymExercise } from "../../types";

export type ExerciseActivityMapping = {
  [id in GymExercise['id']]: {
    dates: Temporal.PlainDate[];
    exercise: GymExercise;
  };
}
