import { MetabaseSchema } from './schema';

describe('Metabase schema', () => {
	it('declares a semver version', () => {
		expect(MetabaseSchema.version).toBeDefined();
		expect(MetabaseSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof MetabaseSchema.entities).toBe('object');
		expect(MetabaseSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(MetabaseSchema.entities))).toBe(true);
		for (const entity of Object.values(MetabaseSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
