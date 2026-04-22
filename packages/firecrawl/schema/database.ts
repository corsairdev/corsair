import { z } from 'zod';

/** @see https://docs.firecrawl.dev/api-reference/endpoint/scrape */
const stringOrStringArray = z.union([z.string(), z.array(z.string())]);

/** `data.metadata` from POST /v2/scrape (Document metadata). */
export const FirecrawlScrapeMetadata = z
	.object({
		title: stringOrStringArray.optional(),
		description: stringOrStringArray.optional(),
		language: z.union([stringOrStringArray, z.null()]).optional(),
		keywords: stringOrStringArray.optional(),
		sourceURL: z.string().optional(),
		url: z.string().optional(),
		scrapeId: z.string().optional(),
		statusCode: z.number().optional(),
		contentType: z.string().optional(),
		error: z.string().nullable().optional(),
		ogLocaleAlternate: z.array(z.string()).optional(),
		concurrencyLimited: z.boolean().optional(),
		concurrencyQueueDurationMs: z.number().optional(),
	})
	.passthrough();

/** `data.actions` when `actions` were sent with the scrape request. */
export const FirecrawlScrapeActionResults = z
	.object({
		screenshots: z.array(z.string()).optional(),
		scrapes: z
			.array(
				z.object({
					url: z.string().optional(),
					html: z.string().optional(),
				}),
			)
			.optional(),
		javascriptReturns: z
			.array(
				z.object({
					type: z.string().optional(),
					value: z.unknown().optional(),
				}),
			)
			.optional(),
		pdfs: z.array(z.string()).optional(),
	})
	.passthrough();

/** `data.changeTracking` when `changeTracking` format is requested. */
export const FirecrawlScrapeChangeTracking = z
	.object({
		previousScrapeAt: z.string().nullable().optional(),
		changeStatus: z.enum(['new', 'same', 'changed', 'removed']).optional(),
		visibility: z.enum(['visible', 'hidden']).optional(),
		diff: z.string().nullable().optional(),
		json: z.record(z.unknown()).nullable().optional(),
	})
	.passthrough();

/**
 * Cached single-page scrape row (entity id = `metadata.scrapeId`).
 * Fields mirror `ScrapeResponse.data` plus denormalized URL fields used by persistence.
 */
export const FirecrawlScrape = z.object({
	id: z.string(),
	url: z.string().optional(),
	sourceURL: z.string().optional(),
	success: z.boolean().optional(),
	markdown: z.string().optional(),
	summary: z.string().nullable().optional(),
	html: z.string().nullable().optional(),
	rawHtml: z.string().nullable().optional(),
	screenshot: z.string().nullable().optional(),
	audio: z.string().nullable().optional(),
	links: z.array(z.string()).optional(),
	actions: FirecrawlScrapeActionResults.nullable().optional(),
	metadata: FirecrawlScrapeMetadata.optional(),
	warning: z.string().nullable().optional(),
	changeTracking: FirecrawlScrapeChangeTracking.nullable().optional(),
	branding: z.record(z.unknown()).nullable().optional(),
	/** LLM JSON extraction / structured output when requested via `formats`. */
	json: z.unknown().optional(),
	images: z.array(z.record(z.unknown())).optional(),
	fetchedAt: z.coerce.date().nullable().optional(),
});

/** @see https://docs.firecrawl.dev/api-reference/endpoint/map */
export const FirecrawlMapLink = z.object({
	url: z.string(),
	title: z.string().optional(),
	description: z.string().optional(),
});

export const FirecrawlMapApiResponse = z
	.object({
		success: z.boolean().optional(),
		links: z.array(FirecrawlMapLink).optional(),
	})
	.passthrough();

export const FirecrawlSiteMap = z.object({
	id: z.string(),
	baseUrl: z.string().optional(),
	success: z.boolean().optional(),
	payload: FirecrawlMapApiResponse.optional(),
	fetchedAt: z.coerce.date().nullable().optional(),
});

/** Search endpoint result for a request fingerprint. */
export const FirecrawlSearchWebItem = z
	.object({
		title: z.string().optional(),
		description: z.string().optional(),
		url: z.string().optional(),
		markdown: z.string().nullable().optional(),
		html: z.string().nullable().optional(),
		rawHtml: z.string().nullable().optional(),
		links: z.array(z.string()).optional(),
		screenshot: z.string().nullable().optional(),
		audio: z.string().nullable().optional(),
		category: z.string().optional(),
		metadata: FirecrawlScrapeMetadata.optional(),
	})
	.passthrough();

export const FirecrawlSearchImageItem = z
	.object({
		title: z.string().optional(),
		imageUrl: z.string().optional(),
		imageWidth: z.number().optional(),
		imageHeight: z.number().optional(),
		url: z.string().optional(),
		position: z.number().optional(),
	})
	.passthrough();

export const FirecrawlSearchNewsItem = z
	.object({
		title: z.string().optional(),
		snippet: z.string().optional(),
		url: z.string().optional(),
		date: z.string().optional(),
		imageUrl: z.string().optional(),
		position: z.number().optional(),
		markdown: z.string().nullable().optional(),
		html: z.string().nullable().optional(),
		rawHtml: z.string().nullable().optional(),
		links: z.array(z.string()).optional(),
		screenshot: z.string().nullable().optional(),
		audio: z.string().nullable().optional(),
		metadata: FirecrawlScrapeMetadata.optional(),
	})
	.passthrough();

export const FirecrawlSearchData = z
	.object({
		web: z.array(FirecrawlSearchWebItem).optional(),
		images: z.array(FirecrawlSearchImageItem).optional(),
		news: z.array(FirecrawlSearchNewsItem).optional(),
		warning: z.string().nullable().optional(),
		id: z.string().optional(),
		creditsUsed: z.number().optional(),
	})
	.passthrough();

export const FirecrawlSearchApiResponse = z
	.object({
		success: z.boolean().optional(),
		data: FirecrawlSearchData.optional(),
	})
	.passthrough();

export const FirecrawlSearchRecord = z.object({
	id: z.string(),
	success: z.boolean().optional(),
	payload: FirecrawlSearchApiResponse.optional(),
	fetchedAt: z.coerce.date().nullable().optional(),
});

export const FirecrawlCrawlStartResponse = z
	.object({
		success: z.boolean().optional(),
		id: z.string().optional(),
		url: z.string().optional(),
	})
	.passthrough();

/** One element of `data` from GET /v2/crawl/{id}. */
export const FirecrawlCrawlPageDocument = z
	.object({
		markdown: z.string().optional(),
		html: z.string().nullable().optional(),
		rawHtml: z.string().nullable().optional(),
		links: z.array(z.string()).optional(),
		screenshot: z.string().nullable().optional(),
		metadata: FirecrawlScrapeMetadata.optional(),
	})
	.passthrough();

/** @see https://docs.firecrawl.dev/api-reference/endpoint/crawl-get */
export const FirecrawlCrawlStatusResponse = z
	.object({
		status: z.string().optional(),
		total: z.number().optional(),
		completed: z.number().optional(),
		creditsUsed: z.number().optional(),
		expiresAt: z.string().optional(),
		next: z.string().nullable().optional(),
		data: z.array(FirecrawlCrawlPageDocument).optional(),
	})
	.passthrough();

/** @see https://docs.firecrawl.dev/api-reference/endpoint/agent */
export const FirecrawlAgentStartResponse = z
	.object({
		success: z.boolean().optional(),
		id: z.string().optional(),
	})
	.passthrough();

/** @see https://docs.firecrawl.dev/api-reference/endpoint/agent-get */
export const FirecrawlAgentStatusResponse = z
	.object({
		success: z.boolean().optional(),
		status: z.enum(['processing', 'completed', 'failed']).optional(),
		data: z.record(z.unknown()).optional(),
		model: z.enum(['spark-1-pro', 'spark-1-mini']).optional(),
		error: z.string().optional(),
		expiresAt: z.string().optional(),
		creditsUsed: z.number().optional(),
	})
	.passthrough();

/**
 * Last API response stored for a crawl or agent job (`snapshot` in the DB row).
 * Shape is typically {@link FirecrawlCrawlStartResponse}, {@link FirecrawlCrawlStatusResponse},
 * {@link FirecrawlAgentStartResponse}, or {@link FirecrawlAgentStatusResponse}; a plain record
 * avoids ambiguous Zod unions and still allows DELETE or future payloads.
 */
export const FirecrawlJobSnapshot = z.record(z.unknown());

/** Crawl or agent async job (entity id = job UUID from Firecrawl). */
export const FirecrawlJob = z.object({
	id: z.string(),
	kind: z.enum(['crawl', 'agent']),
	success: z.boolean().optional(),
	snapshot: FirecrawlJobSnapshot.optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export type FirecrawlScrapeMetadata = z.infer<typeof FirecrawlScrapeMetadata>;
export type FirecrawlScrapeActionResults = z.infer<
	typeof FirecrawlScrapeActionResults
>;
export type FirecrawlScrapeChangeTracking = z.infer<
	typeof FirecrawlScrapeChangeTracking
>;
export type FirecrawlScrape = z.infer<typeof FirecrawlScrape>;
export type FirecrawlMapLink = z.infer<typeof FirecrawlMapLink>;
export type FirecrawlMapApiResponse = z.infer<typeof FirecrawlMapApiResponse>;
export type FirecrawlSiteMap = z.infer<typeof FirecrawlSiteMap>;
export type FirecrawlSearchWebItem = z.infer<typeof FirecrawlSearchWebItem>;
export type FirecrawlSearchImageItem = z.infer<typeof FirecrawlSearchImageItem>;
export type FirecrawlSearchNewsItem = z.infer<typeof FirecrawlSearchNewsItem>;
export type FirecrawlSearchData = z.infer<typeof FirecrawlSearchData>;
export type FirecrawlSearchApiResponse = z.infer<
	typeof FirecrawlSearchApiResponse
>;
export type FirecrawlSearchRecord = z.infer<typeof FirecrawlSearchRecord>;
export type FirecrawlCrawlStartResponse = z.infer<
	typeof FirecrawlCrawlStartResponse
>;
export type FirecrawlCrawlPageDocument = z.infer<
	typeof FirecrawlCrawlPageDocument
>;
export type FirecrawlCrawlStatusResponse = z.infer<
	typeof FirecrawlCrawlStatusResponse
>;
export type FirecrawlAgentStartResponse = z.infer<
	typeof FirecrawlAgentStartResponse
>;
export type FirecrawlAgentStatusResponse = z.infer<
	typeof FirecrawlAgentStatusResponse
>;
export type FirecrawlJobSnapshot = z.infer<typeof FirecrawlJobSnapshot>;
export type FirecrawlJob = z.infer<typeof FirecrawlJob>;

/** Narrow `FirecrawlJob.snapshot` when you know which endpoint produced it. */
export type FirecrawlJobSnapshotAsApi =
	| FirecrawlCrawlStartResponse
	| FirecrawlCrawlStatusResponse
	| FirecrawlAgentStartResponse
	| FirecrawlAgentStatusResponse;
