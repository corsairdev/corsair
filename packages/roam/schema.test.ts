import { RoamSchema } from './schema';

describe('Roam schema', () => {
	it('declares a semver version', () => {
		expect(RoamSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because this plugin does not sync Roam records', () => {
		// Asserted on the value itself: Object.keys on an object always returns an
		// array, so a keys check could never fail.
		expect(Array.isArray(RoamSchema.entities)).toBe(false);
		expect(RoamSchema.entities).toEqual({});
	});
});
