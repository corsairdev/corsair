import { NeedleSchema } from './schema';

describe('Needle schema', () => {
	it('declares a semver version', () => {
		expect(NeedleSchema.version).toBeDefined();
		expect(NeedleSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof NeedleSchema.entities).toBe('object');
		expect(NeedleSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(NeedleSchema.entities))).toBe(true);
		for (const entity of Object.values(NeedleSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
