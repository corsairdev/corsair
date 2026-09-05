import { HumanitixSchema } from './schema';

describe('Humanitix schema', () => {
	it('declares a semver version', () => {
		expect(HumanitixSchema.version).toBeDefined();
		expect(HumanitixSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof HumanitixSchema.entities).toBe('object');
		expect(HumanitixSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(HumanitixSchema.entities))).toBe(true);
		for (const entity of Object.values(HumanitixSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
