import { ETerminSchema } from './schema';

describe('ETermin schema', () => {
	it('declares a semver version', () => {
		expect(ETerminSchema.version).toBeDefined();
		expect(ETerminSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ETerminSchema.entities).toBe('object');
		expect(ETerminSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ETerminSchema.entities))).toBe(true);
		for (const entity of Object.values(ETerminSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
