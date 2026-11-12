import { MeloSchema } from './schema';

describe('Melo schema', () => {
	it('declares a semver version', () => {
		expect(MeloSchema.version).toBeDefined();
		expect(MeloSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	// Nothing is stored: every operation reads or writes the live Stream
	// Estate API, and listings change too often for a local copy to help.
	it('declares no stored entities', () => {
		expect(typeof MeloSchema.entities).toBe('object');
		expect(MeloSchema.entities).not.toBeNull();
		expect(Array.isArray(MeloSchema.entities)).toBe(false);
		expect(MeloSchema.entities).toEqual({});
	});
});
