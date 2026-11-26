import { LobSchema } from './schema';

describe('Lob schema', () => {
	it('declares a semver version', () => {
		expect(LobSchema.version).toBeDefined();
		expect(LobSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores no entities, because every Lob response is read back per call', () => {
		// Verifications return one-shot results and mail sends are read through
		// their own get endpoints, so nothing here is worth syncing into the
		// local database.
		expect(Array.isArray(LobSchema.entities)).toBe(false);
		expect(LobSchema.entities).toEqual({});
	});
});
