import { MapboxSchema } from './schema';

describe('Mapbox schema', () => {
	it('declares a semver version', () => {
		expect(MapboxSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	// Mapbox answers every call live and nothing is worth syncing into the
	// local database, so the plugin stores no entities.
	it('stores no entities', () => {
		expect(MapboxSchema.entities).toEqual({});
		expect(Array.isArray(MapboxSchema.entities)).toBe(false);
	});
});
