module.exports = {
  setupFilesAfterEnv: ['<rootDir>/lib/environment.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  modulePaths: ['<rootDir>']
};
