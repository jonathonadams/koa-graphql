// setup file for jest
'use strict';
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  setupFilesAfterEnv: ['jest-extended'],
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testRegex: '(/__tests__/.*|(\\.|/)(e2e|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'js'],
  verbose: true,
  coverageThreshold: {
    global: {
      branches: 20,
      functions: 20,
      lines: 20,
      statements: 20
    }
  },
  coverageReporters: ['html', 'text-summary']
};
