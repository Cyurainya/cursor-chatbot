import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!react-markdown|vfile|unist-util-.*|unified|bail|is-plain-obj|trough|remark-.*|mdast-util-.*|micromark.*|decode-named-character-reference|character-entities|property-information|hast-util-.*|space-separated-tokens|comma-separated-tokens|parse-entities|markdown-table|)'
  ],
};

export default createJestConfig(config);