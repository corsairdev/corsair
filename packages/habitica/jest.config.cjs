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
		// The generator emitted `!jest.config.ts`, but this file is `.cjs`, so
		// the exclusion never matched anything.
		'!jest.config.cjs',
		// Test files are not the subject of coverage measurement.
		'!**/*.test.ts',
		'!tests/**',
	],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
	transform: {
		'^.+\\.yaml$': '<rootDir>/../corsair/jest-yaml-transform.cjs',
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
		'^corsair/core$': '<rootDir>/../corsair/core.ts',
		'^corsair/http$': '<rootDir>/../corsair/http.ts',
		'^(\\.\\.?/.*)\\.js$': '$1',
	},
	transformIgnorePatterns: ['node_modules/(?!.*uuid.*)'],
	extensionsToTreatAsEsm: ['.ts'],
	// The live suite is excluded from a default run: it needs real credentials
	// and spends a 30-request-per-minute budget. Run it with `pnpm test:live`.
	testPathIgnorePatterns: ['/node_modules/', 'integration\\.test\\.ts'],
	testTimeout: 30000,
	verbose: true,
};
