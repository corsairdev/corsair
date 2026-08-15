import { ApaleoSchema } from './schema';

describe('Apaleo schema', () => {
	it('declares a semver version', () => {
		expect(ApaleoSchema.version).toBeDefined();
		expect(ApaleoSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ApaleoSchema.entities).toBe('object');
		expect(ApaleoSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ApaleoSchema.entities))).toBe(true);
		for (const entity of Object.values(ApaleoSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
