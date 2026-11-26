import { MoceanSchema } from './schema';

describe('Mocean schema', () => {
	it('declares a semver version', () => {
		expect(MoceanSchema.version).toBeDefined();
		expect(MoceanSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	// No entities: every operation is a stateless API call (a send or a
	// read), and there is no dataset worth syncing into Corsair.
	it('stores no entities', () => {
		expect(MoceanSchema.entities).toEqual({});
		expect(Array.isArray(MoceanSchema.entities)).toBe(false);
	});
});
