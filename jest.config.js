module.exports = {
    collectCoverageFrom: [
        '**/*.(t|j)s',
    ],
    testTimeout: 30000,
    moduleFileExtensions: [
        'js',
        'json',
        'ts',
    ],
    rootDir: '.',
    testRegex: '.*\\.(test|spec)\\.ts$',
    transform: {
        '.+\\.(t|j)s$': 'ts-jest',
    },
    testEnvironment: 'node',
    moduleNameMapper: {
        '@common/(.*)': '<rootDir>/src/common/$1',
        '@config/(.*)': '<rootDir>/src/config/$1',
        '@vkontakte/(.*)': '<rootDir>/src/modules/vkontakte/$1',
        '@telegram/(.*)': '<rootDir>/src/modules/telegram/$1',
    },
};
