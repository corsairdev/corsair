import { RollbarSchema } from './schema';

describe('Rollbar schema', () => {
	it('declares a semver version', () => {
		expect(RollbarSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because this plugin does not sync Rollbar records', () => {
		// Asserted on the value itself: Object.keys on an object always returns an
		// array, so a keys check could never fail.
		expect(Array.isArray(RollbarSchema.entities)).toBe(false);
		expect(RollbarSchema.entities).toEqual({});
	});
});
