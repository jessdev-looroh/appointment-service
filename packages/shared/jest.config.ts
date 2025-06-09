/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    preset: 'ts-jest',
    testEnvironment: 'node',
    transformIgnorePatterns: ['/node_modules/(?!chalk).+\\.js$'],
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    testMatch: ['**/*.spec.ts'],
};
