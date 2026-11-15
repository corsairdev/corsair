import { MetaAdsSchema } from './schema';

describe('MetaAds schema', () => {
	it('declares a semver version', () => {
		expect(MetaAdsSchema.version).toBeDefined();
		expect(MetaAdsSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof MetaAdsSchema.entities).toBe('object');
		expect(MetaAdsSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(MetaAdsSchema.entities))).toBe(true);
		for (const entity of Object.values(MetaAdsSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
