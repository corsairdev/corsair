import { ListcleanSchema } from './schema';

describe('Listclean schema', () => {
	it('declares a semver version', () => {
		expect(ListcleanSchema.version).toBeDefined();
		expect(ListcleanSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores no entities, because verification results are read per call and no sync needs a local copy', () => {
		// Assert on the value itself: Object.keys() always returns an array, so
		// it can never fail.
		expect(Array.isArray(ListcleanSchema.entities)).toBe(false);
		expect(ListcleanSchema.entities).toEqual({});
	});
});
