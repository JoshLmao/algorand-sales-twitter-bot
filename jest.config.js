/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: [
        // Run tests only in /src/
        "<rootDir>/src/**/*.test.ts"
    ]
};