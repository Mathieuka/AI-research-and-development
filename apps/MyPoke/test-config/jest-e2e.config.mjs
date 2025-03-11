import { pathsToModuleNameMapper } from 'ts-jest';
import tsConfig from '../tsconfig.json' assert { type: 'json' };

const config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '../',
  testEnvironment: 'node',
  testRegex: ['.*\\.spec\\.ts$'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: pathsToModuleNameMapper(tsConfig.compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
};

export default config;
