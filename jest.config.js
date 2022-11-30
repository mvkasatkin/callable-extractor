export default {
  verbose:                true,
  preset:                 'ts-jest',
  testEnvironment:        'node',
  testMatch:              ['**/*.test.ts', 'tests/*.ts'],
  testPathIgnorePatterns: ['node_modules'],
  moduleDirectories:      [
    'node_modules',
    'src',
  ],
  roots: [
    '.',
  ],
  moduleFileExtensions: [
    'ts', 'js'
  ],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  },
  moduleNameMapper: {
    '^src(.*)':     '<rootDir>/src$1',
  },
  reporters: ['jest-spec-reporter'],
}
