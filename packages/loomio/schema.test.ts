import { LoomioSchema } from './schema';

describe('Loomio schema', () => {
	it('declares a semver version', () => {
		expect(LoomioSchema.version).toBeDefined();
		expect(LoomioSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores no entities because nothing is synced', () => {
		// Loomio reads and writes go straight to the API; no sync job or local
		// copy exists, so the map stays empty and must stay an object.
		expect(LoomioSchema.entities).toEqual({});
		expect(Array.isArray(LoomioSchema.entities)).toBe(false);
		expect(LoomioSchema.entities).not.toBeNull();
	});
});
