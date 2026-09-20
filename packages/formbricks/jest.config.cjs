module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	roots: ['<rootDir>'],
	// This package keeps its tests beside the code, so one pattern covers them. The
	// `tests/`, `plugins/` and `setup/` patterns the generator supplies match no directory
	// here.
	testMatch: ['**/*.test.ts'],
	collectCoverageFrom: [
		'**/*.ts',
		'!**/*.d.ts',
		'!**/node_modules/**',
		'!**/dist/**',
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
	// The live suite is opt-in: a default `jest` run in this package must not reach the
	// network. It also self-skips without a key, but relying on that alone would mean a
	// checkout with a key in the environment silently started writing to a real workspace.
	//
	// The backslashes are doubled on purpose. These strings become regular expressions, and
	// in a JS string literal a single backslash before a dot is a useless escape that
	// collapses to a bare dot - which in a regex matches ANY character, so the pattern would
	// also match something like `integrationXtestYts`.
	testPathIgnorePatterns: ['/node_modules/', 'integration\\.test\\.ts'],
	extensionsToTreatAsEsm: ['.ts'],
	testTimeout: 30000,
	verbose: true,
};
