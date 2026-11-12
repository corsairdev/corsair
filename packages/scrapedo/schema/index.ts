/**
 * Scrape.do keeps no data the plugin needs to mirror. Every operation returns a
 * live answer for one request, and an async job's content is held by Scrape.do
 * until `ExpiresAt` — storing a copy would duplicate page content that goes
 * stale and, for authenticated pages, would hold data the caller only meant to
 * fetch once.
 */
export const ScrapeDoSchema = {
	version: '1.0.0',
	entities: {},
} as const;
