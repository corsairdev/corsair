module.exports = {
	preset: 'ts-jest/presets/default-esm',
	testEnvironment: 'node',
	roots: ['<rootDir>'],
	testMatch: ['**/*.test.ts'],
	setupFiles: ['<rootDir>/setup-jest.cjs'],
	setupFilesAfterEnv: ['<rootDir>/../corsair/tests/setup-jsdom-fetch.cjs'],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
	transform: {
		'^.+\\.ts$': [
			'ts-jest',
			{
				useESM: true,
				isolatedModules: true,
				diagnostics: false,
				tsconfig: {
					module: 'NodeNext',
					moduleResolution: 'NodeNext',
					target: 'ES2022',
					esModuleInterop: true,
					allowSyntheticDefaultImports: true,
					verbatimModuleSyntax: false,
					skipLibCheck: true,
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
