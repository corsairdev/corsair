import { MoosendSchema } from './schema';

describe('Moosend schema', () => {
	it('declares a semver version', () => {
		expect(MoosendSchema.version).toBeDefined();
		expect(MoosendSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	// No entities: every operation is a stateless API call against the live
	// account; Moosend has no dataset worth syncing into Corsair storage.
	it('stores no entities', () => {
		expect(MoosendSchema.entities).toEqual({});
		expect(Array.isArray(MoosendSchema.entities)).toBe(false);
	});
});
