import { HotspotSystemSchema } from './schema';

describe('hotspotsystem schema', () => {
	it('declares a semver version', () => {
		expect(HotspotSystemSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores no entities, because every read is a live API call', () => {
		expect(Array.isArray(HotspotSystemSchema.entities)).toBe(false);
		expect(HotspotSystemSchema.entities).toEqual({});
	});
});
