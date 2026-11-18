import { RedcircleSchema } from './schema';

describe('Redcircle schema', () => {
	it('declares a semver version', () => {
		expect(RedcircleSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because this plugin does not sync RedCircle records', () => {
		// Asserted on the value itself: Object.keys on an object always returns an
		// array, so a keys check could never fail.
		expect(Array.isArray(RedcircleSchema.entities)).toBe(false);
		expect(RedcircleSchema.entities).toEqual({});
	});
});
