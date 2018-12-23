module.exports = {
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js",
        "json"
    ],
    "moduleNameMapper": {
        "\\.(svg|woff2|png)$": "<rootDir>/__tests__/__mocks__/fileMock.js"
    },
    "setupFiles": [
        "./jestSetup.js",
    ],
    "transform": {
        "\\.[jt]sx?$": "<rootDir>/node_modules/ts-jest/preprocessor.js"
    },
    "testRegex": "/__tests__/.*\\.test.(ts|tsx|js)$",
};