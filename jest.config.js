export default ({
  testMatch: [
    "**/*.(test|spec).ts"
  ],
  setupFiles: [
    "<rootDir>/src/setup.jest.ts"
  ],
  collectCoverage: true,
  coverageDirectory: "artifacts/coverage",
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.{d,types}.ts",
    "!src/**/types.ts",
    "!src/**/index.ts"
  ],
  transform: {
    "^.+\\.[tj]sx?$": "@swc/jest"
  },
  extensionsToTreatAsEsm: [
    ".ts"
  ],
  moduleDirectories: ["node_modules", "<rootDir>"],
  modulePathIgnorePatterns: [
    "<rootDir>/.*/__mocks__"
  ],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  roots: [
    "src",
    "<rootDir>"
  ]
});
