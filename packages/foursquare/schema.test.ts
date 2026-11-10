import { FoursquareSchema } from './schema';

describe('Foursquare schema', () => {
	it('declares a semver version', () => {
		expect(FoursquareSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no stored entities, because places stay in Foursquare', () => {
		// A sync would copy place data the provider already serves, and nothing
		// here writes back, so entities stay empty.
		expect(Array.isArray(FoursquareSchema.entities)).toBe(false);
		expect(Object.keys(FoursquareSchema.entities)).toHaveLength(0);
	});
});
