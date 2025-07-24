/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  // Use 'ts-jest' preset for TypeScript support
  preset: 'ts-jest',

  // The test environment that will be used for testing.
  // 'node' for backend tests, 'jsdom' for frontend/browser-like tests.
  testEnvironment: 'node',

  // A list of paths to directories that Jest should use to search for files in.
  // This tells Jest to only look inside the 'src' directory.
  roots: ['<rootDir>/src'],

  // The glob patterns Jest uses to detect test files.
  // This ensures only files ending with .test.ts or .spec.ts are run as tests.
  testMatch: [
    '<rootDir>/src/**/*.test.ts',
    '<rootDir>/src/**/*.spec.ts'
  ],

  // An array of regexp pattern strings that are matched against all test paths,
  // matched tests are skipped.
  // This explicitly ignores any .js files in the dist directory if they somehow get picked up,
  // and also ignores any scripts that aren't explicit test files.
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/', // Ignore compiled JavaScript files in the dist directory
    '/src/scripts/', // Ignore your standalone scripts folder (e.g., backfill.ts)
    '/src/experiments/', // Ignore any experimental code folders
    '/src/temp/' // Ignore any temporary files
  ],

  // An array of regexp pattern strings that are matched against all source file paths,
  // matched files will be transformed by the transformer.
  // This tells Jest to use ts-jest for .ts and .tsx files.
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },

  // An array of regexp pattern strings that are matched against all modules' path,
  // an extension that is not listed here will be mocked automatically.
  // This ensures Jest can resolve .ts and .js files correctly.
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // If you have path aliases in your tsconfig.json, you'll need to configure them here too.
  // For example, if you have "@utils/*": ["src/utils/*"] in tsconfig.json:
  // moduleNameMapper: {
  //   "^@utils/(.*)$": "<rootDir>/src/utils/$1"
  // },

  // Collect coverage from files
  // collectCoverage: true,
  // collectCoverageFrom: [
  //   "src/**/*.ts",
  //   "!src/**/*.d.ts",
  //   "!src/**/*.test.ts",
  //   "!src/**/*.spec.ts",
  //   "!src/scripts/**", // Exclude scripts from coverage
  //   "!src/experiments/**", // Exclude experiments from coverage
  //   "!src/temp/**" // Exclude temporary files from coverage
  // ]
};
