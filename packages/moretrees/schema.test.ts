import { MoreTreesSchema } from './schema';

describe('More Trees schema', () => {
	it('declares a semver version', () => {
		expect(MoreTreesSchema.version).toBeDefined();
		expect(MoreTreesSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	// No entities: the public API surface is account reads plus one planting
	// POST; there is no dataset worth syncing into Corsair storage.
	it('stores no entities', () => {
		expect(MoreTreesSchema.entities).toEqual({});
		expect(Array.isArray(MoreTreesSchema.entities)).toBe(false);
	});
});
