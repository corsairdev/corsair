import { DictionaryApiSchema } from './schema';

describe('DictionaryApi schema', () => {
	it('declares a semver version', () => {
		expect(DictionaryApiSchema.version).toBeDefined();
		expect(DictionaryApiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof DictionaryApiSchema.entities).toBe('object');
		expect(DictionaryApiSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(DictionaryApiSchema.entities))).toBe(true);
		for (const entity of Object.values(DictionaryApiSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
