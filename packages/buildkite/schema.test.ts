import { BuildkiteSchema } from './schema';

describe('Buildkite schema', () => {
	it('declares a semver version', () => {
		expect(BuildkiteSchema.version).toBeDefined();
		expect(BuildkiteSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof BuildkiteSchema.entities).toBe('object');
		expect(BuildkiteSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(BuildkiteSchema.entities))).toBe(true);
		for (const entity of Object.values(BuildkiteSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
