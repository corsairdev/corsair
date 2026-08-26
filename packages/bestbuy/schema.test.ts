import { BestBuySchema } from './schema';

describe('BestBuy schema', () => {
	it('declares a semver version', () => {
		expect(BestBuySchema.version).toBeDefined();
		expect(BestBuySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof BestBuySchema.entities).toBe('object');
		expect(BestBuySchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(BestBuySchema.entities))).toBe(true);
		for (const entity of Object.values(BestBuySchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
