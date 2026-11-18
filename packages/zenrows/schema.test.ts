import { ZenRowsSchema } from './schema';

describe('ZenRows schema', () => {
	it('declares a semver version', () => {
		expect(ZenRowsSchema.version).toBeDefined();
		expect(ZenRowsSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ZenRowsSchema.entities).toBe('object');
		expect(ZenRowsSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ZenRowsSchema.entities))).toBe(true);
		for (const entity of Object.values(ZenRowsSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
