module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	roots: ['<rootDir>'],
	testMatch: [
		'**/*.test.ts',
		'**/tests/**/*.test.ts',
		'**/plugins/**/*.test.ts',
		'**/setup/**/*.test.ts',
	],
	collectCoverageFrom: [
		'**/*.ts',
		'!**/*.d.ts',
		'!**/node_modules/**',
		'!**/dist/**',
		'!jest.config.ts',
		'!tests/**',
	],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
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
				tsconfig: {
					esModuleInterop: true,
					allowSyntheticDefaultImports: true,
				},
			},
		],
	},
	moduleNameMapper: {
		'^corsair/core$': '<rootDir>/node_modules/corsair/core.ts',
		'^corsair/http$': '<rootDir>/node_modules/corsair/http.ts',
		'^(\\.\\.?/.*)\\.js$': '$1',
	},
	transformIgnorePatterns: ['node_modules/(?!.*uuid.*)'],
	extensionsToTreatAsEsm: ['.ts'],
	testTimeout: 30000,
	verbose: true,
};
