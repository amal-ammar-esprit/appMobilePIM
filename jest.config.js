module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['test'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    transform: {
      '^.+\\.ts$': 'ts-jest',
    },
    testRegex: '.*\\.spec\\.ts$',
    moduleNameMapper: {
      '^src/(.*)$': '<rootDir>/../src/$1',
    },
  };
  