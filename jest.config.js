// setup file for jest
'use strict';
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  preset: '@shelf/jest-mongodb',
  setupFilesAfterEnv: ['jest-extended'],
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testRegex: '(/__tests__/.*|(\\.|/)(e2e|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  verbose: true,
  coverageThreshold: {
    global: {
      branches: 20,
      functions: 20,
      lines: 20,
      statements: 20
    }
  },
  coverageReporters: ['html', 'lcovonly', 'text', 'text-summary']
};
