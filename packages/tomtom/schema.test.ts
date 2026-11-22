import { TomTomSchema } from './schema';

describe('TomTom schema', () => {
	it('declares a semver version', () => {
		expect(TomTomSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores no entities', () => {
		// Map data changes constantly and is answered live per request.
		expect(Array.isArray(TomTomSchema.entities)).toBe(false);
		expect(TomTomSchema.entities).toEqual({});
	});
});
