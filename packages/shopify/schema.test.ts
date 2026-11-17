import { ShopifySchema } from './schema';

describe('Shopify schema', () => {
	it('declares a semver version', () => {
		expect(ShopifySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because the plugin reads live and caches nothing', () => {
		// Asserting on the value: `Object.keys` is always an array, so the
		// generated assertion could never fail.
		expect(Array.isArray(ShopifySchema.entities)).toBe(false);
		expect(ShopifySchema.entities).toEqual({});
	});
});
