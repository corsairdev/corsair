module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	roots: ['<rootDir>/tests'],
	testMatch: ['**/*.test.ts'],
	transform: {
		'^.+\\.ts$': [
			'ts-jest',
			{
				tsconfig: {
					target: 'ES2020',
					module: 'commonjs',
					esModuleInterop: true,
					allowSyntheticDefaultImports: true,
					skipLibCheck: true,
					strict: false,
				},
			},
		],
	},
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	collectCoverageFrom: [
		'core/**/*.ts',
		'services/**/*.ts',
		'webhooks/**/*.ts',
		'!**/*.d.ts',
		'!**/node_modules/**',
	],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/$1',
	},
	setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
	testTimeout: 30000,
	verbose: true,
	transformIgnorePatterns: [
		'node_modules/(?!(.*\\.mjs$))',
	],
	clearMocks: true,
	resetMocks: true,
	restoreMocks: true,
};

