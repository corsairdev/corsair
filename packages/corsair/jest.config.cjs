module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	roots: ['<rootDir>'],
	testMatch: ['**/tests/**/*.test.ts', '**/plugins/**/*.test.ts'],
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
	transformIgnorePatterns: [
		'node_modules/(?!.*uuid.*)',
	],
	extensionsToTreatAsEsm: ['.ts'],
	testTimeout: 30000,
	verbose: true,
};
