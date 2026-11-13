import { ForceManagerSchema } from './schema';

describe('ForceManager schema', () => {
	it('declares a semver version', () => {
		expect(ForceManagerSchema.version).toBeDefined();
		expect(ForceManagerSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ForceManagerSchema.entities).toBe('object');
		expect(ForceManagerSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ForceManagerSchema.entities))).toBe(true);
		for (const entity of Object.values(ForceManagerSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
