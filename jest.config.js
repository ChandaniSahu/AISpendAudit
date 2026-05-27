/** @type {import('jest').Config} */
module.exports = {
  // Use ts-jest preset to handle TypeScript files
  preset: 'ts-jest',

  // Node environment (no DOM needed for audit engine tests)
  testEnvironment: 'node',

  // Look for tests inside the __tests__ folder
  roots: ['<rootDir>/__tests__'],

  // Match files ending with .test.ts
  testMatch: ['**/*.test.ts'],

  // Transform .ts files using ts-jest with a test-specific tsconfig
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: {
          // Extend project settings but override module to CommonJS for Jest
          jsx: 'react-jsx',
          module: 'commonjs',
          moduleResolution: 'node',
          esModuleInterop: true,
          strict: true,
          target: 'ES2017',
          resolveJsonModule: true,
          allowJs: true,
          paths: {
            '@/*': ['./*'],
          },
        },
      },
    ],
  },

  // Clear mocks between tests automatically
  clearMocks: true,
};