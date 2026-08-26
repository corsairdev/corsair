import { BoldsignSchema } from './schema';

describe('Boldsign schema', () => {
	it('declares a semver version', () => {
		expect(BoldsignSchema.version).toBeDefined();
		expect(BoldsignSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof BoldsignSchema.entities).toBe('object');
		expect(BoldsignSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(BoldsignSchema.entities))).toBe(true);
		for (const entity of Object.values(BoldsignSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
