import { TapfiliateSchema } from './schema';

describe('Tapfiliate schema', () => {
	it('declares a semver version', () => {
		expect(TapfiliateSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares entities as an empty object, because the plugin stores nothing', () => {
		// The map is an object, so Object.keys is always an array and can never
		// fail this check; the value itself is what matters.
		expect(Array.isArray(TapfiliateSchema.entities)).toBe(false);
		expect(TapfiliateSchema.entities).toEqual({});
	});
});
