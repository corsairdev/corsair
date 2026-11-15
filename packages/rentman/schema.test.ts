import { RentmanSchema } from './schema';

describe('Rentman schema', () => {
	it('declares a semver version', () => {
		expect(RentmanSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because this plugin does not sync Rentman records', () => {
		// Asserted on the value itself: Object.keys on an object always returns an
		// array, so a keys check could never fail.
		expect(Array.isArray(RentmanSchema.entities)).toBe(false);
		expect(RentmanSchema.entities).toEqual({});
	});
});
