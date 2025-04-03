export const preset = 'ts-jest';
export const testEnvironment = 'node';
export const testMatch = ['**/*.test.ts'];
export const setupFilesAfterEnv = ['./jest.setup.ts'];
export const moduleNameMapper = {
  '^@/(.*)$': '<rootDir>/src/$1',
};
