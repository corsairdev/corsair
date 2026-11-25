import { LinkhutSchema } from './schema';

describe('Linkhut schema', () => {
	it('declares a semver version', () => {
		expect(LinkhutSchema.version).toBeDefined();
		expect(LinkhutSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores no entities: a bookmark list is per-account state the API already pages, so there is nothing to sync', () => {
		expect(LinkhutSchema.entities).toEqual({});
		expect(Array.isArray(LinkhutSchema.entities)).toBe(false);
	});
});
