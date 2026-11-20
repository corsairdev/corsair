import { SplitwiseSchema } from './schema';

describe('Splitwise schema', () => {
	it('declares a semver version', () => {
		expect(SplitwiseSchema.version).toBeDefined();
		expect(SplitwiseSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores no entities', () => {
		// Every read is answered live: nothing here is cached in the local
		// database, so there is no entity to sync and none to keep current.
		expect(Array.isArray(SplitwiseSchema.entities)).toBe(false);
		expect(SplitwiseSchema.entities).toEqual({});
	});
});
