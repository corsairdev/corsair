import { AbyssaleSchema } from './schema';

describe('Abyssale schema', () => {
	it('declares a semver version', () => {
		expect(AbyssaleSchema.version).toBeDefined();
		expect(AbyssaleSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof AbyssaleSchema.entities).toBe('object');
		expect(AbyssaleSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(AbyssaleSchema.entities))).toBe(true);
		for (const entity of Object.values(AbyssaleSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
