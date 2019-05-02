module.exports = {
  watchPathIgnorePatterns: ['\\.ts$'],
  testEnvironment: 'node',
  modulePaths: ['<rootDir>/dist'],
  testMatch: ['<rootDir>/dist/__tests__/**/*.js']
};
