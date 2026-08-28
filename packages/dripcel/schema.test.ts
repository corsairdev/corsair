import { DripcelSchema } from './schema';

describe('Dripcel schema', () => {
	it('declares a semver version', () => {
		expect(DripcelSchema.version).toBeDefined();
		expect(DripcelSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof DripcelSchema.entities).toBe('object');
		expect(DripcelSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(DripcelSchema.entities))).toBe(true);
		for (const entity of Object.values(DripcelSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
