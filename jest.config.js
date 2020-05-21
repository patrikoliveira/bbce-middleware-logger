module.exports = {
  collectCoverageFrom: [
    "src/**/*.{ts,js}",
    "!<rootDir>/src/security/**/*.{ts,js}",
    "!<rootDir>/src/errors/**/*.{ts,js}",
    "!<rootDir>/src/endpoints/**/*.{ts,js}",
  ],
  coverageDirectory: "coverage",
  coverageThreshold: {
    global: {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  preset: "ts-jest",
  rootDir: "./",
  testEnvironment: "node",
};
