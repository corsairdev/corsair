/**
 * ScrapingAnt keeps no state that is worth syncing: every operation reads a
 * live page or the account's credit balance, and nothing the plugin receives
 * can be looked up again later as a stored record. A local table would hold
 * scraped pages that go stale the moment they are written.
 */
export const ScrapingAntSchema = {
	version: '1.0.0',
	entities: {},
} as const;
