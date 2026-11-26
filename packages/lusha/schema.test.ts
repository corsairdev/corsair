import { LushaSchema } from './schema';

describe('Lusha schema', () => {
	it('declares a semver version', () => {
		expect(LushaSchema.version).toBeDefined();
		expect(LushaSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares entities as an empty object, not an array', () => {
		// Lusha is a read-only credits-metered data provider: nothing here is
		// worth syncing into the local database, so the map is empty on
		// purpose. Asserted on the value itself, because Object.keys always
		// returns an array and could never fail.
		expect(LushaSchema.entities).toEqual({});
		expect(Array.isArray(LushaSchema.entities)).toBe(false);
	});
});
