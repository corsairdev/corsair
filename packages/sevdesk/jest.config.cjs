module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	roots: ['<rootDir>'],
	testMatch: ['**/*.test.ts'],
	testPathIgnorePatterns: ['/node_modules/', '/dist/', 'api\\.test\\.ts'],
	moduleNameMapper: {
		'^corsair/core$': '<rootDir>/../corsair/core.ts',
		'^corsair/http$': '<rootDir>/../corsair/http.ts',
		'^(\\.\\.?/.*)\\.js$': '$1',
	},
	transform: {
		'^.+\\.ts$': [
			'ts-jest',
			{
				useESM: true,
				tsconfig: {
					esModuleInterop: true,
					allowSyntheticDefaultImports: true,
					verbatimModuleSyntax: false,
					module: 'ESNext',
					moduleResolution: 'Bundler',
				},
			},
		],
		'.*\\.js$': [
			'ts-jest',
			{
				useESM: true,
				tsconfig: { esModuleInterop: true, allowSyntheticDefaultImports: true },
			},
		],
	},
	transformIgnorePatterns: ['node_modules/(?!.*uuid.*)'],
	extensionsToTreatAsEsm: ['.ts'],
	testTimeout: 30000,
	verbose: true,
};
