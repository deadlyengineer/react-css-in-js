/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

module.exports = {
  preset: 'ts-jest',
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!**/node_modules/**', '!**/index.{ts,tsx}'],
  coverageDirectory: 'coverage',
  coverageReporters: ['json-summary', 'text-summary', 'html'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testEnvironment: 'jest-environment-jsdom-global',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  verbose: true,
};
