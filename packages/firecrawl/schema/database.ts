import { z } from 'zod';

/** Single-page scrape result (entity id = Firecrawl `metadata.scrapeId`). */
export const FirecrawlScrape = z.object({
	id: z.string(),
	url: z.string().optional(),
	sourceURL: z.string().optional(),
	success: z.boolean().optional(),
	markdown: z.string().optional(),
	metadata: z.record(z.unknown()).optional(),
	fetchedAt: z.coerce.date().nullable().optional(),
});

/** Crawl or agent async job (entity id = job UUID from Firecrawl). */
export const FirecrawlJob = z.object({
	id: z.string(),
	kind: z.enum(['crawl', 'agent']),
	success: z.boolean().optional(),
	snapshot: z.record(z.unknown()).optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

/** Map endpoint result for a request fingerprint (stable cache key). */
export const FirecrawlSiteMap = z.object({
	id: z.string(),
	baseUrl: z.string().optional(),
	success: z.boolean().optional(),
	payload: z.record(z.unknown()).optional(),
	fetchedAt: z.coerce.date().nullable().optional(),
});

/** Search endpoint result for a request fingerprint. */
export const FirecrawlSearchRecord = z.object({
	id: z.string(),
	success: z.boolean().optional(),
	payload: z.record(z.unknown()).optional(),
	fetchedAt: z.coerce.date().nullable().optional(),
});

export type FirecrawlScrape = z.infer<typeof FirecrawlScrape>;
export type FirecrawlJob = z.infer<typeof FirecrawlJob>;
export type FirecrawlSiteMap = z.infer<typeof FirecrawlSiteMap>;
export type FirecrawlSearchRecord = z.infer<typeof FirecrawlSearchRecord>;
