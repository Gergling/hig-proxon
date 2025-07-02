// getSetProgressionTracker
// Load it up with some trips.
// Use a couple of different exercise/set combinations.
// 2 each is 4, I guess.

import { Temporal } from "temporal-polyfill";
import { mockGymExercise, mockGymExerciseSet, mockGymSetStrategy } from "../../gym-trips/mock-data";
import { GymExercise, GymExerciseSet, ExerciseSetProgression, GymSetStrategy } from "../../types";
import { getSetProgressionTracker } from "./get-set-progression-tracker";

// We want our first trip to include sets for the benchmark.
// const mockBaseGymSet: GymExerciseSet = {
//   challenge: 2,
//   exercise: mockGymExercise,
//   id: '',
//   reps: 0,
//   strategy: mockGymSetStrategy,
// }

type SetMapping = { [name: string]: GymExerciseSet; };

const dateToday = new Temporal.PlainDate(2025, 6, 26);
const dateYesterday = dateToday.subtract({ days: 1 });
const date2DaysAgo = dateToday.subtract({ days: 2 });
const date30DaysAgo = dateToday.subtract({ days: 30 });
const date31DaysAgo = dateToday.subtract({ days: 31 });

const mockStrongExercise: GymExercise = {
  ...mockGymExercise,
  id: 'id-strong-exercise',
  name: 'Strong',
};
const mockWeakExercise: GymExercise = {
  ...mockGymExercise,
  id: 'id-weak-exercise',
  name: 'Weak',
};

const mockStrategyLight: GymSetStrategy = {
  ...mockGymSetStrategy,
  id: 'id-light-strategy',
  minimum: 12,
  maximum: 25,
  name: 'Light',
};
const mockStrategyHeavy: GymSetStrategy = {
  ...mockGymSetStrategy,
  id: 'id-heavy-strategy',
  minimum: 2,
  maximum: 8,
  name: 'Heavy',
};

// const mockSets: {
//   list: GymExerciseSet[];
//   map: { [name: string]: GymExerciseSet[]; };
// } = {
//   list: [],
//   map: {},
// };

const {
  list: mockSetList,
  map: mockSetMap,
} = [
  { strategy: mockStrategyHeavy, reps: 5, strategyChallenge: 2, },
  { strategy: mockStrategyLight, reps: 17, strategyChallenge: 1, },
].reduce(({ list, map }, { strategy, reps, strategyChallenge }) => {
  [
    { exercise: mockStrongExercise, exerciseChallenge: 2 },
    { exercise: mockWeakExercise, exerciseChallenge: 1 },
  ].forEach(({ exercise, exerciseChallenge }) => {
    const name = `mockSet${strategy.name}${exercise.name}`;
    const set: GymExerciseSet = {
      ...mockGymExerciseSet,
      challenge: 2 * strategyChallenge * exerciseChallenge,
      exercise,
      reps,
      strategy,
    };

    list.push(set);
    map[name] = set;
  });

  return {
    list,
    map,
  }
}, {
  list: [] as GymExerciseSet[],
  map: {} as SetMapping,
});

const getMockedSets = (fnc: (set: GymExerciseSet) => GymExerciseSet) => {
  const list: GymExerciseSet[] = [];
  const map: SetMapping = {};
  Object.entries(mockSetMap).forEach(([key, set]) => {
    const updatedSet = {
      ...fnc(set),
    };
    list.push(updatedSet);
    map[key] = updatedSet;
  });
  return {
    list,
    map,
  }
};

const getMockUniformProgression = (set: GymExerciseSet): ExerciseSetProgression => ({
  all: set,
  month: set,
  previous: set,
});

describe('getSetProgressionTracker', () => {
  // TODO: How should we handle no sets for a trip?
  // The scope for handling junk data at the trip level isn't here, but we need to make sure it is handled.

  // What happens if there are no previous progressions? They should be set.
  describe('addSet', () => {
    it('should return undefined when there are no progressions.', () => {
      // Arrange
      const { addSet, getTQI1, start } = getSetProgressionTracker();
  
      // Act
      start(dateToday);
  
      // Assert
      mockSetList.forEach((set) => {
        expect(addSet(set)).toBeUndefined();
      });
      expect(getTQI1()).toBe(1);
    });

    // What happens if the previous progressions are inferior? They should be replaced.
    it('should return a progression with the best sets from previous trips so far.', () => {
      // Arrange
      const { addSet, getTQI1, start } = getSetProgressionTracker();
      const { list: inferiorSets } = getMockedSets((set) => ({
        ...set,
        reps: set.reps - 1,
      }));
      const { list: betterSets } = getMockedSets((set) => ({
        ...set,
        reps: set.reps + 1,
      }));
      // inferiorSets.forEach((set, idx) => {
      //   expect(mockSetList[idx]).toStrictEqual({ ...set, reps: set.reps + 1 });
      // });
      start(date2DaysAgo);
      // const inferiorSet: GymExerciseSet = {
      //   ...mockSetMap.mockSetHeavyStrong,
      //   reps: mockSetMap.mockSetHeavyStrong.reps - 1,
      // };
      // expect(addSet(inferiorSet)).toStrictEqual(getMockUniformProgression(inferiorSet));
      // const [set0, set1, set2, set3] = inferiorSets;
      // expect(addSet(set0)).toStrictEqual(getMockUniformProgression(set0));
      // expect(addSet(set1)).toStrictEqual(getMockUniformProgression(set1));
      // expect(addSet(set2)).toStrictEqual(getMockUniformProgression(set2));
      // expect(addSet(set3)).toStrictEqual(getMockUniformProgression(set3));
      
      const progressions2DaysAgo = inferiorSets.map(addSet);

      start(dateYesterday);
      

      // Act
      start(dateToday);
      
      // Assert
      // const [set0, set1, set2, set3] = mockSetList;
      // console.log(inferiorSet)
      // console.log(set0)
      // expect(addSet(set0)).toStrictEqual(getMockUniformProgression(set0));
      // expect(addSet(set1)).toStrictEqual(getMockUniformProgression(set1));
      // expect(addSet(set2)).toStrictEqual(getMockUniformProgression(set2));
      // expect(addSet(set3)).toStrictEqual(getMockUniformProgression(set3));
  
      progressions2DaysAgo.forEach((progression) => {
        expect(progression).toBeUndefined();
      });
      mockSetList.forEach((set, idx) => {
        expect(addSet(set)).toStrictEqual(getMockUniformProgression(inferiorSets[idx]));
      });
    });
  });


  // If the previous progressions are superior, they can't be changed.
  it('should return the previous set for all progression properties when they are better than the current set.', () => {})
  
  // What happens if the month is out of date but the new one is inferior?
  it('should return the current set for the month when the month is out of date.', () => {});

  // What happens if the TQI1 calculation is below 1? What do the progressions look like if previous progressions are just poor quality?
  // it('should')
});
