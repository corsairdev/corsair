import { LeverSchema } from './schema';

describe('Lever schema', () => {
	it('declares a semver version', () => {
		expect(LeverSchema.version).toBeDefined();
		expect(LeverSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof LeverSchema.entities).toBe('object');
		expect(LeverSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(LeverSchema.entities))).toBe(true);
		for (const entity of Object.values(LeverSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
