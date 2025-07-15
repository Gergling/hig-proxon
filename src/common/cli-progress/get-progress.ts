
type AbstractObject = { [key: string]: unknown; };
type MappingAsync = {
  [key in keyof AbstractObject]: Promise<AbstractObject[key]>;
};
type AwaitResolved<T> = T extends PromiseLike<infer U> ? U : T;
type MappingSync<T> = {
  [key in keyof T]: AwaitResolved<T[key]>;
};
type Step<T> = {
  name: string;
  fnc: () => Promise<T>;
};

const getMappedStep = (
  onStart: (name: string, idx: number) => void,
  onComplete: (name: string, idx: number) => void,
) => async <T>(
  {
    fnc,
    name,
  }: Step<T>,
  idx: number,
): Promise<{
  response: T;
  name: string;
}> => {
  onStart(name, idx);
  const response = await fnc();
  onComplete(name, idx);
  return {
    name,
    response,
  };
};

type ProgressState = {
  name: string;
} & ({
  type: 'pending';
} | {
  type: 'working';
  rotation: 0 | 1 | 2 | 3;
} | {
  type: 'done';
});

const getProgressStateCharacter = (state: ProgressState): string => {
  if (state.type === 'pending') return '_';
  if (state.type === 'done') return '#';

  return (['|', '/', '-', '\\'])[state.rotation];
};

type MappedState<T> = {
  [key in keyof T]: ProgressState;
}

const renderProgress = (states: ProgressState[]) => {
  const max = 10;
  const barSegments = states.reduce((
    segments,
    state,
    idx,
  ) => {
    const character = getProgressStateCharacter(state);
    const start = Math.floor(idx / max);
    const end = Math.ceil(idx / max) + 1;
    const length = end - start;
    const appendages = Array.from({ length }).map(() => character);
    return [
      ...segments,
      ...appendages,
    ];
  }, [] as string[]).join('');
  process.stdout.write(`\r- Progress: [${barSegments}]`);
};

// export const getProgress = async <T extends MappingAsync>(
//   steps: Step<T[keyof T]>[]
// ): MappingSync<T> => {
//   const state = {
//     rotation: steps.map(() => 0),
//     completed: 0,
//     maximum: steps.length,
//     states: steps.reduce((states, { name }) => {
//       return {
//         ...states,
//         [name]: {
//           name,
//           type: 'pending',
//         }
//       }
//     }, {} as MappedState<T>)
//   };
//   const setState = (name: keyof T) => {
//     // Update rotation.
//     state.states = Object.values(state.states).reduce((
//       states,
//       state,
//     ) => {
//       const { name, type, ...stateProps } = state;
//       if (type === 'working') {
//         const rotation = state.rotation + 1 % 4;
//         return {
//           ...states,
//           [name]: {
//             ...state,
//             rotation,
//           },
//         };
//       }
//       return states;
//     }, state.states);
//   };
//   const onStart = (name: string, idx: number) => {
//     renderProgress
//   };
//   const onComplete = (name: string, idx: number) => {

//   };

//   const stepsAsync = steps.map(getMappedStep(onStart, onComplete));
//   const completed = await Promise.all(stepsAsync);
//   for (let i in steps) {
//     const { name, fnc } = steps[i];
//     mapping[name] = await fnc();
//   }
//   // const stepComplete = () => {};
//   return mapping;
// };
