import { RevoltSchema } from './schema';

describe('Revolt schema', () => {
	it('declares a semver version', () => {
		expect(RevoltSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because this plugin does not sync Revolt records', () => {
		// Asserted on the value itself: Object.keys on an object always returns an
		// array, so a keys check could never fail.
		expect(Array.isArray(RevoltSchema.entities)).toBe(false);
		expect(RevoltSchema.entities).toEqual({});
	});
});
