import { RaiselySchema } from './schema';

describe('Raisely schema', () => {
	it('declares a semver version', () => {
		expect(RaiselySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because this plugin does not sync Raisely records', () => {
		// Asserted on the value itself: Object.keys on an object always returns an
		// array, so a keys check could never fail.
		expect(Array.isArray(RaiselySchema.entities)).toBe(false);
		expect(RaiselySchema.entities).toEqual({});
	});
});
