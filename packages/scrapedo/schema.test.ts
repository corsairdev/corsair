import { ScrapeDoSchema } from './schema';

describe('ScrapeDo schema', () => {
	it('declares a semver version', () => {
		expect(ScrapeDoSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores nothing locally', () => {
		// Every operation answers one live request, and an async job's content is
		// held by Scrape.do until it expires. A stored copy would go stale and
		// would hold authenticated page data the caller meant to fetch once.
		expect(Array.isArray(ScrapeDoSchema.entities)).toBe(false);
		expect(ScrapeDoSchema.entities).toEqual({});
	});
});
