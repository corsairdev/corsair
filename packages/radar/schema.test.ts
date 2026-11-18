import { RadarSchema } from './schema';

describe('Radar schema', () => {
	it('declares a semver version', () => {
		expect(RadarSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because this plugin does not sync Radar records', () => {
		// Asserted on the value itself: Object.keys on an object always returns an
		// array, so a keys check could never fail.
		expect(Array.isArray(RadarSchema.entities)).toBe(false);
		expect(RadarSchema.entities).toEqual({});
	});
});
