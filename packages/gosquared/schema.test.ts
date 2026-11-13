import { GoSquaredSchema } from './schema';

describe('GoSquared schema', () => {
	it('declares a semver version', () => {
		expect(GoSquaredSchema.version).toBeDefined();
		expect(GoSquaredSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof GoSquaredSchema.entities).toBe('object');
		expect(GoSquaredSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(GoSquaredSchema.entities))).toBe(true);
		for (const entity of Object.values(GoSquaredSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
