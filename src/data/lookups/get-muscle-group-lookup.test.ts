// Probably legit test file. Needs fixing.

// Import mocks/helpers if they are not directly from the same file system
// These are the *actual* implementations, not Jest mocks
// import { Temporal } from 'temporal-polyfill';
// import { getLookup } from '../../common/utils';
// import { getMuscleGroup } from '../../transformations'; // This will be the actual function
// import { MuscleGroupsResponseDTO } from '../../notion-sdk/dbs/muscle-groups';

// // Import the types needed for the test
// // import {
// //     MuscleGroupsResponseDTO,
// //     MuscleGroup,
// //     MuscleGroupSetActivity,
// //     GymExerciseSet,
// //     Exercise,
// //     Progression,
// //     Validity,
// // } from '../../types'; // Assuming these are in a central types file

// // --- Minimal Temporal.PlainDate mock for test ---
// // If you have a full Temporal polyfill, you might not need this.
// const testDate: Temporal.PlainDate = {
//     year: 2024,
//     month: 7,
//     day: 1,
//     toString: () => '2024-07-01', // Important for comparisons if you store date as string
//     // Add other methods/properties if your code uses them
// } as Temporal.PlainDate;


// describe('getMuscleGroupLookup', () => {
//     // Sample DTOs for testing (simulating Notion responses)
//     const mockMuscleGroupDTOs: MuscleGroupsResponseDTO[] = [
//         { id: 'mg1', properties: { name: { title: [{ plain_text: 'Biceps', type: 'text' }] } } },
//         { id: 'mg2', properties: { name: { title: [{ plain_text: 'Triceps' }] } } },
//         { id: 'mg3', properties: { name: { title: [{ plain_text: 'Quads' }] } } },
//     ];

//     let lookupInstance: ReturnType<typeof getMuscleGroupLookup>;
//     let addMuscleGroupActivity: (exerciseSet: GymExerciseSet, date: Temporal.PlainDate) => void;
//     let getMuscleGroups: () => MuscleGroup[];

//     beforeEach(() => {
//         // We're testing `addMuscleGroupActivity` within the context of `getMuscleGroupLookup`.
//         // So, we'll get a fresh instance of the lookup each time.
//         // `getLookup` and `getMuscleGroup` are *not* mocked here, as per your request.
//         lookupInstance = getMuscleGroupLookup(mockMuscleGroupDTOs);
//         addMuscleGroupActivity = lookupInstance.addMuscleGroupActivity;
//         getMuscleGroups = lookupInstance.getMuscleGroups;
//     });

//     // Test Case 1: Add activity to a single muscle group
//     test('should add activity to the correct muscle group', () => {
//         const mockExercise: Exercise = {
//             id: 'ex1',
//             name: 'Bicep Curl',
//             muscleGroups: [
//                 { focus: true, muscleGroup: { id: 'mg1' } } // Targets Biceps (mg1)
//             ],
//         };
//         const mockProgression: Progression = { status: 'achieved' };
//         const mockValidity: Validity = true;

//         const mockGymExerciseSet: GymExerciseSet = {
//             exercise: mockExercise,
//             progression: mockProgression,
//             validity: mockValidity,
//         };

//         addMuscleGroupActivity(mockGymExerciseSet, testDate);

//         const muscleGroups = getMuscleGroups();
//         const biceps = muscleGroups.find(mg => mg.id === 'mg1');
//         const triceps = muscleGroups.find(mg => mg.id === 'mg2'); // Should not have activity

//         // Assert that Biceps has the activity
//         expect(biceps).toBeDefined();
//         expect(biceps?.activity.length).toBe(1);
//         expect(biceps?.activity[0]).toEqual({
//             date: testDate,
//             exercise: mockExercise,
//             focus: true,
//             status: {
//                 progression: 'achieved',
//                 validity: true,
//             },
//         });

//         // Assert that other muscle groups remain unchanged
//         expect(triceps?.activity).toEqual([]);
//     });

//     // Test Case 2: Add activity involving multiple muscle groups (focus and stabilization)
//     test('should add activity to multiple muscle groups based on focus and stabilization', () => {
//         const mockExercise: Exercise = {
//             id: 'ex2',
//             name: 'Bench Press',
//             muscleGroups: [
//                 { focus: true, muscleGroup: { id: 'mg2' } }, // Triceps (focus)
//                 { focus: false, muscleGroup: { id: 'mg1' } } // Biceps (stabilization)
//             ],
//         };
//         const mockProgression: Progression = { status: 'maintained' };
//         const mockValidity: Validity = true;

//         const mockGymExerciseSet: GymExerciseSet = {
//             exercise: mockExercise,
//             progression: mockProgression,
//             validity: mockValidity,
//         };

//         addMuscleGroupActivity(mockGymExerciseSet, testDate);

//         const muscleGroups = getMuscleGroups();
//         const biceps = muscleGroups.find(mg => mg.id === 'mg1'); // Should have stabilization activity
//         const triceps = muscleGroups.find(mg => mg.id === 'mg2'); // Should have focus activity

//         expect(biceps?.activity.length).toBe(1);
//         expect(biceps?.activity[0].focus).toBe(false); // Check focus status

//         expect(triceps?.activity.length).toBe(1);
//         expect(triceps?.activity[0].focus).toBe(true); // Check focus status

//         // Verify the common parts of the activity object
//         expect(biceps?.activity[0].date).toBe(testDate);
//         expect(biceps?.activity[0].exercise).toEqual(mockExercise);
//         expect(biceps?.activity[0].status).toEqual({ progression: 'maintained', validity: true });
//     });

//     // Test Case 3: Handle optional 'progression'
//     test('should use "first" for progression status if progression is undefined', () => {
//         const mockExercise: Exercise = {
//             id: 'ex3',
//             name: 'Squat',
//             muscleGroups: [{ focus: true, muscleGroup: { id: 'mg3' } }], // Targets Quads (mg3)
//         };
//         const mockValidity: Validity = true; // Progression is omitted

//         const mockGymExerciseSet: GymExerciseSet = {
//             exercise: mockExercise,
//             // progression: undefined, // Omitted as per test case
//             validity: mockValidity,
//         };

//         addMuscleGroupActivity(mockGymExerciseSet, testDate);

//         const muscleGroups = getMuscleGroups();
//         const quads = muscleGroups.find(mg => mg.id === 'mg3');

//         expect(quads?.activity.length).toBe(1);
//         expect(quads?.activity[0].status.progression).toBe('first'); // Expect 'first'
//     });

//     // Test Case 4: Error handling for non-existent muscle group ID
//     test('should throw an error if a muscle group ID is not found', () => {
//         const nonExistentId = 'nonExistentMg';
//         const mockExercise: Exercise = {
//             id: 'ex4',
//             name: 'Invalid Exercise',
//             muscleGroups: [
//                 { focus: true, muscleGroup: { id: nonExistentId } } // Targets a non-existent muscle group
//             ],
//         };
//         const mockGymExerciseSet: GymExerciseSet = {
//             exercise: mockExercise,
//             validity: true,
//         };

//         expect(() =>
//             addMuscleGroupActivity(mockGymExerciseSet, testDate)
//         ).toThrow(`No muscle group found with id '${nonExistentId}' for exercise '${mockExercise.name}'.`);
//     });

//     // Test Case 5: Multiple activities for the same muscle group
//     test('should correctly accumulate multiple activities for the same muscle group', () => {
//         const ex1: Exercise = { id: 'e1', name: 'Pushups', muscleGroups: [{ focus: true, muscleGroup: { id: 'mg2' } }] };
//         const ex2: Exercise = { id: 'e2', name: 'Overhead Press', muscleGroups: [{ focus: true, muscleGroup: { id: 'mg2' } }] };

//         addMuscleGroupActivity({ exercise: ex1, validity: true }, testDate);
//         addMuscleGroupActivity({ exercise: ex2, validity: true, progression: { status: 'achieved' } }, testDate);

//         const muscleGroups = getMuscleGroups();
//         const triceps = muscleGroups.find(mg => mg.id === 'mg2');

//         expect(triceps?.activity.length).toBe(2);
//         expect(triceps?.activity[0].exercise.id).toBe('e1');
//         expect(triceps?.activity[1].exercise.id).toBe('e2');
//         expect(triceps?.activity[1].status.progression).toBe('achieved');
//     });
// });
