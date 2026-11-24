import { MopinionSchema } from './schema';

describe('Mopinion schema', () => {
	it('declares a semver version', () => {
		expect(MopinionSchema.version).toBeDefined();
		expect(MopinionSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	// No entities: the whole v3.0.0-alpha data API is read-only, so there is
	// nothing to sync into Corsair storage.
	it('stores no entities', () => {
		expect(MopinionSchema.entities).toEqual({});
		expect(Array.isArray(MopinionSchema.entities)).toBe(false);
	});
});
