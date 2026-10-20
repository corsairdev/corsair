import { z } from 'zod';

// MrScraper exposes two API surfaces:
//   - Platform API  https://api.app.mrscraper.com/api/v1  (account, scrapers,
//     results, analytics)
//   - Scraper API   https://api.mrscraper.com             (sync scrape ops)
// Reference: https://docs.mrscraper.com/docs/api/overview
//
// Response shapes below mirror the v3 reference pages; `runtime` and some
// analytics values are documented inconsistently (number vs numeric string),
// so those accept both. Anything whose shape is build/agent-defined is kept as
// `unknown` with a note.

// ── Shared building blocks ──────────────────────────────────────────────────

const WaitUntilSchema = z.enum([
	'domcontentloaded',
	'load',
	'networkidle0',
	'networkidle2',
]);

const ScreenshotModeSchema = z.enum(['full', 'top']);

const AIAgentSchema = z.enum(['general', 'map', 'listing']);

/** Standard success envelope: `{ message, data, meta? }`. */
const envelope = <T extends z.ZodTypeAny>(data: T) =>
	z
		.object({
			message: z.string().optional(),
			data,
		})
		.passthrough();

/** Pagination metadata returned alongside list responses. */
export const PaginationMetaSchema = z
	.object({
		page: z.number().optional(),
		pageSize: z.number().optional(),
		total: z.number().optional(),
		totalPage: z.number().optional(),
	})
	.passthrough();

/**
 * A single scrape/rerun result. `runtime` is a number on some endpoints and a
 * numeric string (e.g. `"8.678"`) on others, so both are accepted.
 */
export const ScrapeResultSchema = z
	.object({
		id: z.string(),
		createdAt: z.string().optional(),
		userId: z.string().optional(),
		scraperId: z.string().optional(),
		type: z.string().optional(),
		url: z.string().nullable().optional(),
		status: z.string().optional(),
		error: z.string().nullable().optional(),
		tokenUsage: z.number().optional(),
		runtime: z.union([z.number(), z.string()]).nullable().optional(),
		// `data` is agent-specific and its shape varies per scraper, so it
		// stays unknown for forward-compatibility.
		data: z.unknown().optional(),
		htmlPath: z.string().nullable().optional(),
		htmlContent: z.string().nullable().optional(),
		recordingPath: z.string().nullable().optional(),
		screenshotPath: z.string().nullable().optional(),
		dataPath: z.string().nullable().optional(),
		curl: z.string().nullable().optional(),
		html: z.string().nullable().optional(),
		markdown: z.string().nullable().optional(),
		screenshot: z.string().nullable().optional(),
	})
	.passthrough();

export type ScrapeResult = z.infer<typeof ScrapeResultSchema>;

/** Per-URL outcome inside a bulk rerun result. */
export const BulkUrlDetailSchema = z
	.object({
		url: z.string(),
		status: z.string().optional(),
		error: z.string().nullable().optional(),
	})
	.passthrough();

/** Aggregate counters for a bulk rerun. */
export const BulkSummarySchema = z
	.object({
		totalUrls: z.number().optional(),
		successfulUrls: z.number().optional(),
		failedUrls: z.number().optional(),
		scrapedCount: z.number().optional(),
		totalTokenUsage: z.number().optional(),
		estimatedFinishAt: z.string().nullable().optional(),
	})
	.passthrough();

/** Bulk rerun payload stored on `data`. */
export const BulkDataSchema = z
	.object({
		// `mergedData` merges every URL's extracted payload, whose shape is
		// scraper-defined, so the entries stay unknown.
		mergedData: z.array(z.unknown()).optional(),
		urlDetails: z.array(BulkUrlDetailSchema).optional(),
		summary: BulkSummarySchema.optional(),
	})
	.passthrough();

/** A bulk result: a ScrapeResult whose `data` is the structured bulk payload. */
export const BulkScrapeResultSchema = ScrapeResultSchema.extend({
	data: BulkDataSchema.optional(),
}).passthrough();

/** A scrape or rerun that returns a single result object. */
const ScrapeResultEnvelopeSchema = envelope(ScrapeResultSchema);

// ── Account ─────────────────────────────────────────────────────────────────

// GET /subscription-accounts
export const AccountGetInputSchema = z.object({}).passthrough();

export type AccountGetInput = z.infer<typeof AccountGetInputSchema>;

export const AccountSchema = z
	.object({
		id: z.string(),
		tokenLimit: z.number().optional(),
		tokenUsage: z.number().optional(),
		stripeSubscriptionId: z.string().nullable().optional(),
		userId: z.string().optional(),
		stripeStatus: z.string().nullable().optional(),
		quantity: z.number().optional(),
		endsAt: z.string().nullable().optional(),
		isEnterprise: z.boolean().optional(),
		rateLimit: z.number().optional(),
		rateTtl: z.number().optional(),
		isAutoRenew: z.boolean().optional(),
		user: z
			.object({
				id: z.string().optional(),
				name: z.string().nullable().optional(),
				email: z.string().optional(),
				latestApiToken: z.string().nullable().optional(),
				isVerified: z.boolean().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

export const AccountGetResponseSchema = envelope(AccountSchema);

export type AccountGetResponse = z.infer<typeof AccountGetResponseSchema>;

// ── Scrapers · AI ───────────────────────────────────────────────────────────

// POST /scrapers-ai — the initial AI chat returns starter code, not final
// scraped data. `prompt` is the reference field name, `message` is the guide
// alias, so either is accepted (and both are forwarded).
export const ScrapersAiInitInputSchema = z
	.object({
		url: z.url(),
		prompt: z.string().min(1).optional(),
		message: z.string().min(1).optional(),
		agent: AIAgentSchema.optional(),
		proxyCountry: z.string().optional(),
	})
	.passthrough()
	.refine(
		(value) => value.prompt !== undefined || value.message !== undefined,
		{
			message: 'Either prompt or message is required',
		},
	);

export type ScrapersAiInitInput = z.infer<typeof ScrapersAiInitInputSchema>;

export const ScrapersAiInitResponseSchema = ScrapeResultEnvelopeSchema;

export type ScrapersAiInitResponse = z.infer<
	typeof ScrapersAiInitResponseSchema
>;

// POST /scrapers-ai-rerun
export const ScrapersAiRerunInputSchema = z
	.object({
		scraperId: z.uuid(),
		url: z.url(),
		maxDepth: z.number().int().positive().optional(),
		maxPages: z.number().int().positive().optional(),
		limit: z.number().int().positive().optional(),
		// The reference documents a string; the guide shows an array, so both
		// are accepted and forwarded unchanged.
		includePatterns: z.union([z.string(), z.array(z.string())]).optional(),
		excludePatterns: z.union([z.string(), z.array(z.string())]).optional(),
	})
	.passthrough();

export type ScrapersAiRerunInput = z.infer<typeof ScrapersAiRerunInputSchema>;

export const ScrapersAiRerunResponseSchema = ScrapeResultEnvelopeSchema;

export type ScrapersAiRerunResponse = z.infer<
	typeof ScrapersAiRerunResponseSchema
>;

// POST /scrapers-ai-rerun/bulk
export const ScrapersAiRerunBulkInputSchema = z
	.object({
		scraperId: z.uuid(),
		urls: z.array(z.url()).min(1),
	})
	.passthrough();

export type ScrapersAiRerunBulkInput = z.infer<
	typeof ScrapersAiRerunBulkInputSchema
>;

export const ScrapersAiRerunBulkResponseSchema = envelope(
	BulkScrapeResultSchema,
);

export type ScrapersAiRerunBulkResponse = z.infer<
	typeof ScrapersAiRerunBulkResponseSchema
>;

// ── Scrapers · Manual ───────────────────────────────────────────────────────

// POST /scrapers-manual-rerun
export const ScrapersManualRerunInputSchema = z
	.object({
		scraperId: z.uuid(),
		url: z.url(),
		// A workflow is a list of build-defined steps; the sealed shape is not
		// published, so each step stays unknown and is forwarded verbatim.
		workflow: z.array(z.unknown()).optional(),
		record: z.boolean().optional(),
		paginator: z
			.object({
				type: z.string().optional(),
				max_page: z.number().optional(),
				enabled: z.boolean().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

export type ScrapersManualRerunInput = z.infer<
	typeof ScrapersManualRerunInputSchema
>;

export const ScrapersManualRerunResponseSchema = ScrapeResultEnvelopeSchema;

export type ScrapersManualRerunResponse = z.infer<
	typeof ScrapersManualRerunResponseSchema
>;

// POST /scrapers-manual-rerun/bulk
export const ScrapersManualRerunBulkInputSchema = z
	.object({
		scraperId: z.uuid(),
		urls: z.array(z.url()).min(1),
	})
	.passthrough();

export type ScrapersManualRerunBulkInput = z.infer<
	typeof ScrapersManualRerunBulkInputSchema
>;

export const ScrapersManualRerunBulkResponseSchema = envelope(
	BulkScrapeResultSchema,
);

export type ScrapersManualRerunBulkResponse = z.infer<
	typeof ScrapersManualRerunBulkResponseSchema
>;

// POST /scrapers-manual/{scraperId}/heal
export const ScrapersManualHealInputSchema = z
	.object({
		scraperId: z.uuid(),
	})
	.passthrough();

export type ScrapersManualHealInput = z.infer<
	typeof ScrapersManualHealInputSchema
>;

export const ManualHealDataSchema = z
	.object({
		success: z.boolean(),
		scraperId: z.string().optional(),
		workflowUpdated: z.boolean().optional(),
	})
	.passthrough();

export const ScrapersManualHealResponseSchema = envelope(ManualHealDataSchema);

export type ScrapersManualHealResponse = z.infer<
	typeof ScrapersManualHealResponseSchema
>;

// ── Scrapers · Bulk cancel ──────────────────────────────────────────────────

// PATCH /scrapers-bulks/{scraperId}/cancel
export const ScrapersCancelBulkByScraperInputSchema = z
	.object({
		scraperId: z.uuid(),
	})
	.passthrough();

export type ScrapersCancelBulkByScraperInput = z.infer<
	typeof ScrapersCancelBulkByScraperInputSchema
>;

export const CancelBulkDataSchema = z
	.object({
		id: z.string(),
		bulkUrls: z.array(z.string()).optional(),
		canceledUrls: z.array(z.string()).optional(),
	})
	.passthrough();

export const ScrapersCancelBulkByScraperResponseSchema =
	envelope(CancelBulkDataSchema);

export type ScrapersCancelBulkByScraperResponse = z.infer<
	typeof ScrapersCancelBulkByScraperResponseSchema
>;

// PATCH /scrapers-bulks/result/{resultId}/cancel — the reference path table
// names this parameter `id`; it is the bulk result id.
export const ScrapersCancelBulkByResultInputSchema = z
	.object({
		resultId: z.string().min(1),
	})
	.passthrough();

export type ScrapersCancelBulkByResultInput = z.infer<
	typeof ScrapersCancelBulkByResultInputSchema
>;

export const ScrapersCancelBulkByResultResponseSchema =
	envelope(CancelBulkDataSchema);

export type ScrapersCancelBulkByResultResponse = z.infer<
	typeof ScrapersCancelBulkByResultResponseSchema
>;

// ── Results ─────────────────────────────────────────────────────────────────

// GET /results — the reference marks page/pageSize/sortField/sortOrder as
// required, but the pagination guide proves they default, so all are optional.
export const ResultsListInputSchema = z
	.object({
		page: z.number().int().positive().optional(),
		pageSize: z.number().int().positive().optional(),
		sortField: z.string().optional(),
		sortOrder: z.enum(['ASC', 'DESC']).optional(),
		// Documented as `sort` in the guide (an alternative to the pair above).
		sort: z.string().optional(),
		search: z.string().optional(),
		dateRangeColumn: z.string().optional(),
		startAt: z.string().optional(),
		endAt: z.string().optional(),
		// Serialized by the transport as `filters[scraperId]=…`.
		filters: z
			.object({
				scraperId: z.string().optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

export type ResultsListInput = z.infer<typeof ResultsListInputSchema>;

export const ResultsListResponseSchema = z
	.object({
		message: z.string().optional(),
		data: z.array(ScrapeResultSchema),
		meta: PaginationMetaSchema.optional(),
	})
	.passthrough();

export type ResultsListResponse = z.infer<typeof ResultsListResponseSchema>;

// GET /results/{id} — every documented response returns an array of results,
// including the bulk shape, so the output is always an array.
export const ResultsGetInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.passthrough();

export type ResultsGetInput = z.infer<typeof ResultsGetInputSchema>;

export const ResultsGetResponseSchema = envelope(z.array(ScrapeResultSchema));

export type ResultsGetResponse = z.infer<typeof ResultsGetResponseSchema>;

// ── Analytics ───────────────────────────────────────────────────────────────

// GET /analytic/statuses
export const AnalyticsStatusesInputSchema = z
	.object({
		domain: z.string().min(1),
		// Dates are documented as `yyyy-MM-dd HH:mm:ss`.
		startDate: z.string().min(1),
		endDate: z.string().min(1),
		action: z.string().optional(),
		apiTokenName: z.string().optional(),
	})
	.passthrough();

export type AnalyticsStatusesInput = z.infer<
	typeof AnalyticsStatusesInputSchema
>;

export const AnalyticsStatusPointSchema = z
	.object({
		key: z.string(),
		// Docs show numeric counts as strings (e.g. "35"), so accept both.
		value: z.union([z.number(), z.string()]),
	})
	.passthrough();

export const AnalyticsStatusesDataSchema = z
	.object({
		countAll: z.union([z.number(), z.string()]).optional(),
		successRate: z.union([z.number(), z.string()]).optional(),
		reqPerMinute: z.union([z.number(), z.string()]).optional(),
		avgLatency: z.union([z.number(), z.string()]).optional(),
		data: z.array(AnalyticsStatusPointSchema),
	})
	.passthrough();

export const AnalyticsStatusesResponseSchema = envelope(
	AnalyticsStatusesDataSchema,
);

export type AnalyticsStatusesResponse = z.infer<
	typeof AnalyticsStatusesResponseSchema
>;

// GET /proxies/user/requests-bandwidth
export const AnalyticsProxyBandwidthInputSchema = z
	.object({
		startDate: z.string().min(1),
		endDate: z.string().min(1),
		timezone: z.string().optional(),
		region: z.string().optional(),
	})
	.passthrough();

export type AnalyticsProxyBandwidthInput = z.infer<
	typeof AnalyticsProxyBandwidthInputSchema
>;

export const ProxyBandwidthEntrySchema = z
	.object({
		username: z.string(),
		total_bandwidth_usage: z.union([z.number(), z.string()]).optional(),
	})
	.passthrough();

// This endpoint returns a bare top-level array (no envelope).
export const AnalyticsProxyBandwidthResponseSchema = z.array(
	ProxyBandwidthEntrySchema,
);

export type AnalyticsProxyBandwidthResponse = z.infer<
	typeof AnalyticsProxyBandwidthResponseSchema
>;

// ── Scraper API (sync scrape) ───────────────────────────────────────────────

/** Result envelope shared by every POST scrape operation. */
export const ScraperApiResultSchema = z
	.object({
		code: z.number(),
		// `data` differs per operation (sitemap urls, listing pages, extracted
		// JSON), so it stays unknown for forward-compatibility.
		data: z.unknown().optional(),
		// Documented as a JSON string (e.g. "{}") but some responses return an
		// object, so both are accepted.
		extractions: z
			.union([z.string(), z.record(z.string(), z.unknown())])
			.optional(),
		error: z.string().nullable().optional(),
		runtime: z.union([z.number(), z.string()]).optional(),
		token_usage: z.number().optional(),
		screenshots: z.array(z.string()).optional(),
		recording_path: z.string().nullable().optional(),
		data_path: z.string().nullable().optional(),
		html_path: z.string().nullable().optional(),
		residential_proxy_usage: z
			.object({
				received: z.number().optional(),
				sent: z.number().optional(),
				total: z.number().optional(),
			})
			.passthrough()
			.optional(),
		// Browser network-log payload is build-defined; keep it opaque.
		listen_network_data: z.unknown().optional(),
		html: z.string().nullable().optional(),
		markdown: z.string().nullable().optional(),
		screenshot: z.string().nullable().optional(),
	})
	.passthrough();

export type ScraperApiResult = z.infer<typeof ScraperApiResultSchema>;

// GET /?html=true — returns raw HTML as text/html, so the output is a string.
export const ScrapeFetchInputSchema = z
	.object({
		url: z.url(),
		html: z.boolean().optional(),
		super: z.boolean().optional(),
		browserRendering: z.boolean().optional(),
		waitUntil: WaitUntilSchema.optional(),
		timeout: z.number().int().positive().optional(),
		blockResources: z.boolean().optional(),
		waitForSelector: z.string().optional(),
		returnCookie: z.boolean().optional(),
		geoCode: z.string().optional(),
		proxyCountry: z.string().optional(),
	})
	.passthrough();

export type ScrapeFetchInput = z.infer<typeof ScrapeFetchInputSchema>;

export const ScrapeFetchResponseSchema = z.string();

export type ScrapeFetchResponse = z.infer<typeof ScrapeFetchResponseSchema>;

// POST /?markdown=true
export const ScrapeMarkdownInputSchema = z
	.object({
		url: z.url(),
		tokenCap: z.number().int().positive().optional(),
		maxRetries: z.number().int().nonnegative().optional(),
		super: z.boolean().optional(),
		browserRendering: z.boolean().optional(),
		waitUntil: WaitUntilSchema.optional(),
		timeout: z.number().int().positive().optional(),
		screenshot: ScreenshotModeSchema.optional(),
		geoCode: z.string().optional(),
		proxyCountry: z.string().optional(),
		blockResources: z.boolean().optional(),
		waitForSelector: z.string().optional(),
		action: z.string().optional(),
		proxy: z.string().optional(),
		returnCookie: z.boolean().optional(),
		saveResult: z.boolean().optional(),
	})
	.passthrough();

export type ScrapeMarkdownInput = z.infer<typeof ScrapeMarkdownInputSchema>;

export const ScrapeMarkdownResponseSchema = ScraperApiResultSchema;

export type ScrapeMarkdownResponse = ScraperApiResult;

// POST / — JSON extraction via the general agent.
export const ScrapeJsonInputSchema = z
	.object({
		url: z.url(),
		prompt: z.string().optional(),
		agent: AIAgentSchema.optional(),
		tokenCap: z.number().int().positive().optional(),
		maxRetries: z.number().int().nonnegative().optional(),
		html: z.boolean().optional(),
		browserRendering: z.boolean().optional(),
		waitUntil: WaitUntilSchema.optional(),
		timeout: z.number().int().positive().optional(),
		screenshot: ScreenshotModeSchema.optional(),
		super: z.boolean().optional(),
		geoCode: z.string().optional(),
		proxyCountry: z.string().optional(),
		saveResult: z.boolean().optional(),
	})
	.passthrough();

export type ScrapeJsonInput = z.infer<typeof ScrapeJsonInputSchema>;

export const ScrapeJsonResponseSchema = ScraperApiResultSchema;

export type ScrapeJsonResponse = ScraperApiResult;

// POST /?screenshot=full
export const ScrapeScreenshotInputSchema = z
	.object({
		url: z.url(),
		screenshot: ScreenshotModeSchema.optional(),
		record: z.boolean().optional(),
		browserRendering: z.boolean().optional(),
		waitUntil: WaitUntilSchema.optional(),
		timeout: z.number().int().positive().optional(),
		html: z.boolean().optional(),
		markdown: z.boolean().optional(),
		super: z.boolean().optional(),
		geoCode: z.string().optional(),
		proxyCountry: z.string().optional(),
		saveResult: z.boolean().optional(),
		blockResources: z.boolean().optional(),
		waitForSelector: z.string().optional(),
		action: z.string().optional(),
		proxy: z.string().optional(),
		returnCookie: z.boolean().optional(),
		tokenCap: z.number().int().positive().optional(),
		maxRetries: z.number().int().nonnegative().optional(),
	})
	.passthrough();

export type ScrapeScreenshotInput = z.infer<typeof ScrapeScreenshotInputSchema>;

export const ScrapeScreenshotResponseSchema = ScraperApiResultSchema;

export type ScrapeScreenshotResponse = ScraperApiResult;

// POST / — paginated listing extraction via the listing agent.
export const ScrapeListingInputSchema = z
	.object({
		url: z.url(),
		prompt: z.string().optional(),
		agent: AIAgentSchema.optional(),
		maxPages: z.number().int().positive().optional(),
		super: z.boolean().optional(),
		browserRendering: z.boolean().optional(),
		waitUntil: WaitUntilSchema.optional(),
		timeout: z.number().int().positive().optional(),
		screenshot: ScreenshotModeSchema.optional(),
		geoCode: z.string().optional(),
		proxyCountry: z.string().optional(),
		saveResult: z.boolean().optional(),
		tokenCap: z.number().int().positive().optional(),
		maxRetries: z.number().int().nonnegative().optional(),
	})
	.passthrough();

export type ScrapeListingInput = z.infer<typeof ScrapeListingInputSchema>;

export const ScrapeListingResponseSchema = ScraperApiResultSchema;

export type ScrapeListingResponse = ScraperApiResult;

// POST / — sitemap discovery via the map agent.
export const ScrapeSitemapInputSchema = z
	.object({
		url: z.url(),
		agent: AIAgentSchema.optional(),
		maxDepth: z.number().int().positive().optional(),
		maxPages: z.number().int().positive().optional(),
		limit: z.number().int().positive().optional(),
		includePatterns: z.array(z.string()).optional(),
		excludePatterns: z.array(z.string()).optional(),
		browserRendering: z.boolean().optional(),
		waitUntil: WaitUntilSchema.optional(),
		timeout: z.number().int().positive().optional(),
		screenshot: ScreenshotModeSchema.optional(),
		super: z.boolean().optional(),
		geoCode: z.string().optional(),
		proxyCountry: z.string().optional(),
		saveResult: z.boolean().optional(),
		tokenCap: z.number().int().positive().optional(),
		maxRetries: z.number().int().nonnegative().optional(),
	})
	.passthrough();

export type ScrapeSitemapInput = z.infer<typeof ScrapeSitemapInputSchema>;

export const ScrapeSitemapResponseSchema = ScraperApiResultSchema;

export type ScrapeSitemapResponse = ScraperApiResult;

// ── Plugin endpoint input/output collections ────────────────────────────────

export type MrscraperEndpointInputs = {
	accountGet: AccountGetInput;
	scrapersAiInit: ScrapersAiInitInput;
	scrapersAiRerun: ScrapersAiRerunInput;
	scrapersAiRerunBulk: ScrapersAiRerunBulkInput;
	scrapersManualRerun: ScrapersManualRerunInput;
	scrapersManualRerunBulk: ScrapersManualRerunBulkInput;
	scrapersManualHeal: ScrapersManualHealInput;
	scrapersCancelBulkByScraper: ScrapersCancelBulkByScraperInput;
	scrapersCancelBulkByResult: ScrapersCancelBulkByResultInput;
	resultsList: ResultsListInput;
	resultsGet: ResultsGetInput;
	analyticsStatuses: AnalyticsStatusesInput;
	analyticsProxyBandwidth: AnalyticsProxyBandwidthInput;
	scrapeFetch: ScrapeFetchInput;
	scrapeMarkdown: ScrapeMarkdownInput;
	scrapeJson: ScrapeJsonInput;
	scrapeScreenshot: ScrapeScreenshotInput;
	scrapeListing: ScrapeListingInput;
	scrapeSitemap: ScrapeSitemapInput;
};

export type MrscraperEndpointOutputs = {
	accountGet: AccountGetResponse;
	scrapersAiInit: ScrapersAiInitResponse;
	scrapersAiRerun: ScrapersAiRerunResponse;
	scrapersAiRerunBulk: ScrapersAiRerunBulkResponse;
	scrapersManualRerun: ScrapersManualRerunResponse;
	scrapersManualRerunBulk: ScrapersManualRerunBulkResponse;
	scrapersManualHeal: ScrapersManualHealResponse;
	scrapersCancelBulkByScraper: ScrapersCancelBulkByScraperResponse;
	scrapersCancelBulkByResult: ScrapersCancelBulkByResultResponse;
	resultsList: ResultsListResponse;
	resultsGet: ResultsGetResponse;
	analyticsStatuses: AnalyticsStatusesResponse;
	analyticsProxyBandwidth: AnalyticsProxyBandwidthResponse;
	scrapeFetch: ScrapeFetchResponse;
	scrapeMarkdown: ScrapeMarkdownResponse;
	scrapeJson: ScrapeJsonResponse;
	scrapeScreenshot: ScrapeScreenshotResponse;
	scrapeListing: ScrapeListingResponse;
	scrapeSitemap: ScrapeSitemapResponse;
};

export const MrscraperEndpointInputSchemas = {
	accountGet: AccountGetInputSchema,
	scrapersAiInit: ScrapersAiInitInputSchema,
	scrapersAiRerun: ScrapersAiRerunInputSchema,
	scrapersAiRerunBulk: ScrapersAiRerunBulkInputSchema,
	scrapersManualRerun: ScrapersManualRerunInputSchema,
	scrapersManualRerunBulk: ScrapersManualRerunBulkInputSchema,
	scrapersManualHeal: ScrapersManualHealInputSchema,
	scrapersCancelBulkByScraper: ScrapersCancelBulkByScraperInputSchema,
	scrapersCancelBulkByResult: ScrapersCancelBulkByResultInputSchema,
	resultsList: ResultsListInputSchema,
	resultsGet: ResultsGetInputSchema,
	analyticsStatuses: AnalyticsStatusesInputSchema,
	analyticsProxyBandwidth: AnalyticsProxyBandwidthInputSchema,
	scrapeFetch: ScrapeFetchInputSchema,
	scrapeMarkdown: ScrapeMarkdownInputSchema,
	scrapeJson: ScrapeJsonInputSchema,
	scrapeScreenshot: ScrapeScreenshotInputSchema,
	scrapeListing: ScrapeListingInputSchema,
	scrapeSitemap: ScrapeSitemapInputSchema,
} as const;

export const MrscraperEndpointOutputSchemas = {
	accountGet: AccountGetResponseSchema,
	scrapersAiInit: ScrapersAiInitResponseSchema,
	scrapersAiRerun: ScrapersAiRerunResponseSchema,
	scrapersAiRerunBulk: ScrapersAiRerunBulkResponseSchema,
	scrapersManualRerun: ScrapersManualRerunResponseSchema,
	scrapersManualRerunBulk: ScrapersManualRerunBulkResponseSchema,
	scrapersManualHeal: ScrapersManualHealResponseSchema,
	scrapersCancelBulkByScraper: ScrapersCancelBulkByScraperResponseSchema,
	scrapersCancelBulkByResult: ScrapersCancelBulkByResultResponseSchema,
	resultsList: ResultsListResponseSchema,
	resultsGet: ResultsGetResponseSchema,
	analyticsStatuses: AnalyticsStatusesResponseSchema,
	analyticsProxyBandwidth: AnalyticsProxyBandwidthResponseSchema,
	scrapeFetch: ScrapeFetchResponseSchema,
	scrapeMarkdown: ScrapeMarkdownResponseSchema,
	scrapeJson: ScrapeJsonResponseSchema,
	scrapeScreenshot: ScrapeScreenshotResponseSchema,
	scrapeListing: ScrapeListingResponseSchema,
	scrapeSitemap: ScrapeSitemapResponseSchema,
} as const;
