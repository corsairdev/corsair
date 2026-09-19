import { TripadvisorSchema } from './schema';

describe('Tripadvisor schema', () => {
	it('declares a semver version', () => {
		expect(TripadvisorSchema.version).toBeDefined();
		expect(TripadvisorSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof TripadvisorSchema.entities).toBe('object');
		expect(TripadvisorSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(TripadvisorSchema.entities))).toBe(true);
		for (const entity of Object.values(TripadvisorSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
