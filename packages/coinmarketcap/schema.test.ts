import { CoinMarketCapSchema } from './schema';

describe('CoinMarketCapSchema', () => {
	it('is a string version in semver form', () => {
		expect(CoinMarketCapSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities', () => {
		// Asserted on the value, not on Object.keys(entities), which is an array
		// whatever the schema holds.
		expect(Array.isArray(CoinMarketCapSchema.entities)).toBe(false);
		expect(CoinMarketCapSchema.entities).toEqual({});
	});
});
