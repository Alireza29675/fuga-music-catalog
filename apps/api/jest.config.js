/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts', '**/*.spec.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', 'test-setup.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/generated/**',
    '!src/index.ts',
    '!src/env.ts',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFiles: ['<rootDir>/src/test-setup.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      diagnostics: {
        ignoreCodes: [151002],
      },
    }],
  },
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};
