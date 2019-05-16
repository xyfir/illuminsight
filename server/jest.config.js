module.exports = {
  watchPathIgnorePatterns: ['dist/'],
  setupFilesAfterEnv: ['<rootDir>/lib/test/environment.ts'],
  testEnvironment: 'node',
  modulePaths: ['<rootDir>'],
  testMatch: ['<rootDir>/__tests__/**/*.spec.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  }
};
