import { MocoSchema } from './schema';

describe('Moco schema', () => {
	it('declares a semver version', () => {
		expect(MocoSchema.version).toBeDefined();
		expect(MocoSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	// No entities: every operation is a stateless API call against the live
	// account; Moco has no dataset worth syncing into Corsair storage.
	it('stores no entities', () => {
		expect(MocoSchema.entities).toEqual({});
		expect(Array.isArray(MocoSchema.entities)).toBe(false);
	});
});
