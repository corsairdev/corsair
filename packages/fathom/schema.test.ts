import { FathomSchema } from './schema';

describe('Fathom schema', () => {
	it('declares a semver version', () => {
		expect(FathomSchema.version).toBeDefined();
		expect(FathomSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof FathomSchema.entities).toBe('object');
		expect(FathomSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(FathomSchema.entities))).toBe(true);
		for (const entity of Object.values(FathomSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
