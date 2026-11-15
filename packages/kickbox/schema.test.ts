import { KickboxSchema } from './schema';

describe('Kickbox schema', () => {
	it('declares a semver version', () => {
		expect(KickboxSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores no entities: both operations answer from Kickbox live', () => {
		expect(KickboxSchema.entities).toEqual({});
		// Object.keys of an empty object is always an array, so assert the value.
		expect(Array.isArray(KickboxSchema.entities)).toBe(false);
	});
});
