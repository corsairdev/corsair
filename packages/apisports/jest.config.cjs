module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	roots: ['<rootDir>'],
	testMatch: ['**/*.test.ts'],
	moduleFileExtensions: ['ts', 'js', 'json'],
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
	},
	moduleNameMapper: {
		'^corsair/http$': '<rootDir>/../corsair/http.ts',
		'^(\\.\\.?/.*)\\.js$': '$1',
	},
	extensionsToTreatAsEsm: ['.ts'],
	testTimeout: 60000,
	verbose: true,
};
