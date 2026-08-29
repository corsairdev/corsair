import { StormglassSchema } from './schema';

describe('Stormglass schema', () => {
	it('declares a semver version', () => {
		expect(StormglassSchema.version).toBeDefined();
		expect(StormglassSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof StormglassSchema.entities).toBe('object');
		expect(StormglassSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(StormglassSchema.entities))).toBe(true);
		for (const entity of Object.values(StormglassSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
