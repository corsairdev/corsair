import { RocketReachSchema } from './schema';

describe('RocketReach schema', () => {
	it('declares a semver version', () => {
		expect(RocketReachSchema.version).toBeDefined();
		expect(RocketReachSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof RocketReachSchema.entities).toBe('object');
		expect(RocketReachSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(RocketReachSchema.entities))).toBe(true);
		for (const entity of Object.values(RocketReachSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('caches nothing, since refreshing a lookup costs another credit', () => {
		// Profiles, companies and credit balances all change at RocketReach, and a
		// cached copy would invite paying for the same lookup twice.
		expect(Object.keys(RocketReachSchema.entities)).toHaveLength(0);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
