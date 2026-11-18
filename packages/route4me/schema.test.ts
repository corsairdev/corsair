import { Route4meSchema } from './schema';

describe('Route4me schema', () => {
	it('declares a semver version', () => {
		expect(Route4meSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because this plugin does not sync Route4Me records', () => {
		// Asserted on the value itself: Object.keys on an object always returns an
		// array, so a keys check could never fail.
		expect(Array.isArray(Route4meSchema.entities)).toBe(false);
		expect(Route4meSchema.entities).toEqual({});
	});
});
