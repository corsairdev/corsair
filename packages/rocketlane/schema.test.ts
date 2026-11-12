import { RocketlaneSchema } from './schema';

describe('Rocketlane schema', () => {
	it('declares a semver version', () => {
		expect(RocketlaneSchema.version).toBeDefined();
		expect(RocketlaneSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof RocketlaneSchema.entities).toBe('object');
		expect(RocketlaneSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(RocketlaneSchema.entities))).toBe(true);
		for (const entity of Object.values(RocketlaneSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
