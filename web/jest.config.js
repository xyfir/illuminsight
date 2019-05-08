module.exports = {
  setupFilesAfterEnv: [
    'react-testing-library/cleanup-after-each',
    '<rootDir>/lib/test/environment.ts'
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  modulePaths: ['<rootDir>']
};
