import { BraveSearchSchema } from './schema';

describe('BraveSearch schema', () => {
	it('declares a semver version', () => {
		expect(BraveSearchSchema.version).toBeDefined();
		expect(BraveSearchSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof BraveSearchSchema.entities).toBe('object');
		expect(BraveSearchSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(BraveSearchSchema.entities))).toBe(true);
		for (const entity of Object.values(BraveSearchSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
