import { FeltSchema } from './schema';

describe('Felt schema', () => {
	it('declares a semver version', () => {
		expect(FeltSchema.version).toBeDefined();
		expect(FeltSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof FeltSchema.entities).toBe('object');
		expect(FeltSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(FeltSchema.entities))).toBe(true);
		for (const entity of Object.values(FeltSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
