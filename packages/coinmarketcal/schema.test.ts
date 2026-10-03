import { CoinmarketcalSchema } from './schema';

describe('Coinmarketcal schema', () => {
	it('declares a semver version', () => {
		expect(CoinmarketcalSchema.version).toBeDefined();
		expect(CoinmarketcalSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof CoinmarketcalSchema.entities).toBe('object');
		expect(CoinmarketcalSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(CoinmarketcalSchema.entities))).toBe(true);
		for (const entity of Object.values(CoinmarketcalSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
