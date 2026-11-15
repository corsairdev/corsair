import { RampSchema } from './schema';

describe('Ramp schema', () => {
	it('declares a semver version', () => {
		expect(RampSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because this plugin does not sync Ramp records', () => {
		// Asserted on the value itself: Object.keys on an object always returns an
		// array, so a keys check could never fail.
		expect(Array.isArray(RampSchema.entities)).toBe(false);
		expect(RampSchema.entities).toEqual({});
	});
});
