  module.exports = {
    // The root of your source code, typically /src
    // `<rootDir>` is a token Jest substitutes
    roots: ['<rootDir>/src'],
  
    // Jest transformations -- this adds support for TypeScript
    // using ts-jest
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
    },
  
    testEnvironmentOptions: {
      enzymeAdapter: 'react16',
    },

    // Runs special logic, adding special
    // extended assertions to Jest
    setupFilesAfterEnv: [
      '@testing-library/jest-dom/extend-expect'
    ],
      setupFiles: ["jest-localstorage-mock"],
    // Test spec file resolution pattern
    // Matches parent folder `__tests__` and filename
    // should contain `test` or `spec`.
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
    
    coverageDirectory:'coverage',
    collectCoverageFrom:['<rootDir>/src/ui/**/*.tsx'],
    coverageReporters: ['lcov'],
    modulePathIgnorePatterns: ['<rootDir>/src/import-undefined-issue','<rootDir>/src/electron/index.ts', '<rootDir>/src/ui/index.tsx', '<rootDir>/src/ui/views/DockerRebuildFiles.tsx', '<rootDir>/src/ui/views/settings.tsx', '<rootDir>/src/ui/views/RebuildFiles.tsx', '<rootDir>/src/ui/views/RebuildPolicy.tsx', '<rootDir>/src/ui/views/DockerConfiguration.tsx', '<rootDir>/src/ui/views/PastRebuildPolicy.tsx', '<rootDir>/src/ui/services/GWDockerService.tsx', '<rootDir>/src/ui/services/GWSerialDockerService.tsx' ],
    snapshotSerializers: [
      "enzyme-to-json/serializer"
    ],

    // Module file extensions for importing
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    moduleNameMapper: {
      ".+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$": "identity-obj-proxy"
    }
  }
