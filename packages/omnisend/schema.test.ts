import { OmnisendSchema } from './schema';

describe('Omnisend schema', () => {
	it('declares a semver version', () => {
		expect(OmnisendSchema.version).toBeDefined();
		expect(OmnisendSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores no entities, because Omnisend is the system of record', () => {
		// Contacts, campaigns and products are read on demand; copying contact
		// data, including emails and phone numbers, into the local database is
		// a decision the caller should make.
		expect(Array.isArray(OmnisendSchema.entities)).toBe(false);
		expect(OmnisendSchema.entities).toEqual({});
	});
});
