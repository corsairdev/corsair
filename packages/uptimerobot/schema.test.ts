import { UptimeRobotSchema } from './schema';

describe('UptimeRobot schema', () => {
	it('declares a semver version', () => {
		expect(UptimeRobotSchema.version).toBeDefined();
		expect(UptimeRobotSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof UptimeRobotSchema.entities).toBe('object');
		expect(UptimeRobotSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(UptimeRobotSchema.entities))).toBe(true);
		for (const entity of Object.values(UptimeRobotSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('caches nothing, since a status changes with every check', () => {
		// A monitor moves between UP, DOWN and PAUSED every few minutes and an
		// incident resolves on its own, so a cached copy would misstate both.
		expect(Object.keys(UptimeRobotSchema.entities)).toHaveLength(0);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
