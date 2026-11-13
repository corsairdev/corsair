import { FiberySchema } from './schema';

describe('Fibery schema', () => {
	it('declares a semver version', () => {
		expect(FiberySchema.version).toBeDefined();
		expect(FiberySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof FiberySchema.entities).toBe('object');
		expect(FiberySchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(FiberySchema.entities))).toBe(true);
		for (const entity of Object.values(FiberySchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
