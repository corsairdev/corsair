import { AivoovSchema } from './schema';

describe('Aivoov schema', () => {
	it('declares a semver version', () => {
		expect(AivoovSchema.version).toBeDefined();
		expect(AivoovSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof AivoovSchema.entities).toBe('object');
		expect(AivoovSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(AivoovSchema.entities))).toBe(true);
		for (const entity of Object.values(AivoovSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('schema version is 1.1.0', () => {
		expect(AivoovSchema.version).toBe('1.1.0');
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test — see tests/api.test.ts for endpoint tests.
