module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	roots: ['<rootDir>'],
	testMatch: ['**/*.test.ts'],
	transform: {
		'^.+\\.ts$': [
			'ts-jest',
			{
				useESM: true,
				tsconfig: 'tsconfig.test.json',
			},
		],
		'.*\\.js$': [
			'ts-jest',
			{
				useESM: true,
				tsconfig: 'tsconfig.test.json',
			},
		],
	},
	moduleNameMapper: {
		'^corsair/http$': '<rootDir>/../corsair/http.ts',
		'^corsair/core$': '<rootDir>/../corsair/core.ts',
		'^(\\.\\.?/.*)\\.js$': '$1',
	},
	transformIgnorePatterns: ['node_modules/(?!.*uuid.*)'],
	extensionsToTreatAsEsm: ['.ts'],
	testTimeout: 30000,
};
