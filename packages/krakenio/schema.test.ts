import { KrakenioSchema } from './schema';

describe('Kraken.io schema', () => {
	it('declares a semver version', () => {
		expect(KrakenioSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores no entities: every operation answers from Kraken live', () => {
		expect(KrakenioSchema.entities).toEqual({});
		// Object.keys of an empty object is always an array, so assert the value.
		expect(Array.isArray(KrakenioSchema.entities)).toBe(false);
	});
});
