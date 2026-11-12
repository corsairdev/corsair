import { RocketlaneSchema } from './schema';

describe('Rocketlane schema', () => {
	it('declares a semver version', () => {
		expect(RocketlaneSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because this plugin does not sync Rocketlane records', () => {
		// Asserted on the value itself: Object.keys on an object always returns an
		// array, so a keys check could never fail.
		expect(Array.isArray(RocketlaneSchema.entities)).toBe(false);
		expect(RocketlaneSchema.entities).toEqual({});
	});
});
