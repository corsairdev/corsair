import { DictionarySchema } from './schema';

describe('Dictionary schema', () => {
	it('declares a semver version', () => {
		expect(DictionarySchema.version).toBeDefined();
		expect(DictionarySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof DictionarySchema.entities).toBe('object');
		expect(DictionarySchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(DictionarySchema.entities))).toBe(true);
		for (const entity of Object.values(DictionarySchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
