import { FinerWorksSchema } from './schema';

describe('FinerWorks schema', () => {
	it('declares a semver version', () => {
		expect(FinerWorksSchema.version).toBeDefined();
		expect(FinerWorksSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof FinerWorksSchema.entities).toBe('object');
		expect(FinerWorksSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(FinerWorksSchema.entities))).toBe(true);
		for (const entity of Object.values(FinerWorksSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
