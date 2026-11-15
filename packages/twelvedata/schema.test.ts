import { TwelveDataSchema } from './schema';

describe('Twelve Data schema', () => {
	it('declares a semver version', () => {
		expect(TwelveDataSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores no entities', () => {
		// Quotes and candles change every tick, so a local copy would be stale
		// before it was written.
		expect(Array.isArray(TwelveDataSchema.entities)).toBe(false);
		expect(TwelveDataSchema.entities).toEqual({});
	});
});
