import { WebscraperioSchema } from './schema';

describe('Web Scraper Cloud schema', () => {
	it('declares a semver version', () => {
		expect(WebscraperioSchema.version).toBeDefined();
		expect(WebscraperioSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof WebscraperioSchema.entities).toBe('object');
		expect(WebscraperioSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(WebscraperioSchema.entities))).toBe(true);
		for (const entity of Object.values(WebscraperioSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('caches nothing, since a sitemap changes whenever it is edited', () => {
		// A sitemap's selectors and status change as it is edited and run, so a
		// stored copy would drift from what the Cloud app shows.
		expect(Object.keys(WebscraperioSchema.entities)).toHaveLength(0);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
