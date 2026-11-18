import { SpotlightrSchema } from './schema';

describe('Spotlightr schema', () => {
	it('declares a semver version', () => {
		expect(SpotlightrSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores no entities', () => {
		// Every read is answered live; nothing is cached locally.
		expect(Array.isArray(SpotlightrSchema.entities)).toBe(false);
		expect(SpotlightrSchema.entities).toEqual({});
	});
});
