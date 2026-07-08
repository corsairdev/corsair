module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	roots: ['<rootDir>'],
	testMatch: [
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
		'^.+\\.yaml$': '<rootDir>/jest-yaml-transform.cjs',
		'^.+\\.ts$': [
			'ts-jest',
			{
				useESM: true,
				isolatedModules: true,
				tsconfig: {
					esModuleInterop: true,
					allowSyntheticDefaultImports: true,
					verbatimModuleSyntax: false,
					module: 'ESNext',
					moduleResolution: 'Bundler',
					paths: {
						'@corsair-dev/slack': ['../slack/index.ts'],
						'@corsair-dev/linear': ['../linear/index.ts'],
					},
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
					verbatimModuleSyntax: false,
					module: 'ESNext',
					moduleResolution: 'Bundler',
					paths: {
						'@corsair-dev/slack': ['../slack/index.ts'],
						'@corsair-dev/linear': ['../linear/index.ts'],
					},
				},
			},
		],
	},
	moduleNameMapper: {
		'^corsair/core$': '<rootDir>/core.ts',
		'^corsair/db$': '<rootDir>/db.ts',
		'^corsair/orm$': '<rootDir>/orm.ts',
		'^corsair/http$': '<rootDir>/http.ts',
		'^corsair/setup$': '<rootDir>/setup.ts',
		'^corsair/tests$': '<rootDir>/tests.ts',
		'^corsair$': '<rootDir>/index.ts',
		'^@corsair-dev/linear$': '<rootDir>/../linear/index.ts',
		'^@corsair-dev/linear/error-handlers$':
			'<rootDir>/../linear/error-handlers.ts',
		'^@corsair-dev/slack$': '<rootDir>/../slack/index.ts',
		'^@corsair-dev/slack/client$': '<rootDir>/../slack/client.ts',
		'^@corsair-dev/slack/schema$': '<rootDir>/../slack/schema/index.ts',
		'^@corsair-dev/slack/error-handlers$':
			'<rootDir>/../slack/error-handlers.ts',
		'^(\\.\\.?/.*)\\.js$': '$1',
	},
	transformIgnorePatterns: ['node_modules/(?!.*uuid.*)'],
	extensionsToTreatAsEsm: ['.ts'],
	testTimeout: 30000,
	verbose: true,
	setupFilesAfterEnv: ['<rootDir>/tests/setup-jsdom-fetch.cjs'],
};
