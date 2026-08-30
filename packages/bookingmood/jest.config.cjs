module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	roots: ['<rootDir>'],
	testMatch: ['**/*.test.ts'],
	setupFiles: ['<rootDir>/setup-jest.cjs'],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
	transform: {
		'^.+\\.ts$': [
			'ts-jest',
			{
				useESM: true,
				diagnostics: false,
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
				tsconfig: {
					esModuleInterop: true,
					allowSyntheticDefaultImports: true,
				},
			},
		],
	},
	moduleNameMapper: {
		'^corsair/core$': '<rootDir>/../corsair/core.ts',
		'^corsair/http$': '<rootDir>/../corsair/http.ts',
		'^(\\.\\.?/.*)\\.js$': '$1',
	},
	transformIgnorePatterns: ['node_modules/(?!.*uuid.*)'],
	extensionsToTreatAsEsm: ['.ts'],
	testTimeout: 30000,
	verbose: true,
};
