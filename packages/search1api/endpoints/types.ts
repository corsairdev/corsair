import { z } from 'zod';

/**
 * Schemas below follow https://api.search1api.com/openapi.json (OpenAPI 3.1)
 * as of the plugin's last review.
 */

/**
 * Engines accepted by POST /search. The empty string is the API's own
 * sentinel for "use the engine default".
 */
export const SEARCH1API_SEARCH_SERVICES = [
	'google',
	'bing',
	'bingcn',
	'duckduckgo',
	'yahoo',
	'yandex',
	'youtube',
	'x',
	'reddit',
	'github',
	'arxiv',
	'wechat',
	'bilibili',
	'imdb',
	'wikipedia',
	'grokipedia',
	'baidu',
	'360',
	'quark',
	'',
] as const;

export const SEARCH1API_NEWS_SERVICES = [
	'google',
	'bing',
	'duckduckgo',
	'yahoo',
	'hackernews',
	'reuters',
	'',
] as const;

/** Publication windows accepted by /search and /news. `year` means 365 days. */
export const SEARCH1API_TIME_RANGES = [
	'day',
	'week',
	'month',
	'year',
	'',
] as const;

const SearchServiceSchema = z.enum(SEARCH1API_SEARCH_SERVICES);
const NewsServiceSchema = z.enum(SEARCH1API_NEWS_SERVICES);
const TimeRangeSchema = z.enum(SEARCH1API_TIME_RANGES);
const UsagePeriodSchema = z.enum(['day', 'week', 'month', 'year']);

const searchRequestShape = {
	query: z.string().min(1),
	search_service: SearchServiceSchema.optional(),
	max_results: z.number().int().min(1).max(50).optional(),
	page: z.number().int().min(1).max(100).optional(),
	crawl_results: z.number().int().min(0).max(50).optional(),
	image: z.boolean().optional(),
	include_sites: z.array(z.string()).optional(),
	exclude_sites: z.array(z.string()).optional(),
	language: z.string().optional(),
	time_range: TimeRangeSchema.optional(),
};

export const SearchInputSchema = z.object(searchRequestShape).strict();

export type SearchInput = z.infer<typeof SearchInputSchema>;

export const SearchBatchInputSchema = z.array(SearchInputSchema).min(1);

export type SearchBatchInput = z.infer<typeof SearchBatchInputSchema>;

export const SearchResultMetadataSchema = z.object({
	kind: z.enum(['repo', 'issue', 'pr', 'discussion']).optional(),
	stars: z.number().int().optional(),
	language: z.string().optional(),
	num_comments: z.number().int().optional(),
	story_url: z.string().optional(),
	points: z.number().int().optional(),
});

export type SearchResultMetadata = z.infer<typeof SearchResultMetadataSchema>;

export const SearchResultSchema = z.object({
	title: z.string(),
	link: z.string(),
	snippet: z.string(),
	content: z.string().optional(),
	published_date: z.string().optional(),
	metadata: SearchResultMetadataSchema.optional(),
});

export type SearchResult = z.infer<typeof SearchResultSchema>;

// The response echoes the parameters with server defaults filled in.
const SearchParametersEchoSchema = z.object(searchRequestShape);

export const SearchResponseSchema = z.object({
	searchParameters: SearchParametersEchoSchema,
	results: z.array(SearchResultSchema),
	images: z.array(z.string()).optional(),
});

export type SearchResponse = z.infer<typeof SearchResponseSchema>;

function batchResponseSchema<T extends z.ZodType>(dataSchema: T) {
	return z.object({
		results: z.array(
			z.object({
				success: z.boolean(),
				data: dataSchema.optional(),
				error: z
					.object({
						message: z.string().optional(),
						statusCode: z.number().int().optional(),
					})
					.optional(),
				cost: z.number().int().min(0),
			}),
		),
		summary: z.object({
			total: z.number().int().min(0),
			successful: z.number().int().min(0),
			failed: z.number().int().min(0),
			totalCost: z.number().int().min(0),
		}),
	});
}

export const SearchBatchResponseSchema =
	batchResponseSchema(SearchResponseSchema);

export type SearchBatchResponse = z.infer<typeof SearchBatchResponseSchema>;

const newsRequestShape = {
	query: z.string().min(1),
	search_service: NewsServiceSchema.optional(),
	max_results: z.number().int().min(1).max(50).optional(),
	crawl_results: z.number().int().min(0).max(50).optional(),
	image: z.boolean().optional(),
	include_sites: z.array(z.string()).optional(),
	exclude_sites: z.array(z.string()).optional(),
	language: z.string().optional(),
	time_range: TimeRangeSchema.optional(),
};

export const NewsInputSchema = z.object(newsRequestShape).strict();

export type NewsInput = z.infer<typeof NewsInputSchema>;

export const NewsBatchInputSchema = z.array(NewsInputSchema).min(1);

export type NewsBatchInput = z.infer<typeof NewsBatchInputSchema>;

export const NewsResponseSchema = z.object({
	searchParameters: z.object(newsRequestShape),
	results: z.array(SearchResultSchema),
	images: z.array(z.string()).optional(),
});

export type NewsResponse = z.infer<typeof NewsResponseSchema>;

export const NewsBatchResponseSchema = batchResponseSchema(NewsResponseSchema);

export type NewsBatchResponse = z.infer<typeof NewsBatchResponseSchema>;

export const AskInputSchema = z
	.object({
		query: z.string().min(1).max(500),
	})
	.strict();

export type AskInput = z.infer<typeof AskInputSchema>;

export const AskResultSchema = z.object({
	title: z.string(),
	link: z.string(),
	snippet: z.string(),
	published_date: z.string().optional(),
	source: z.string(),
	relevance: z.number().min(0).max(1),
});

export type AskResult = z.infer<typeof AskResultSchema>;

export const AskResponseSchema = z.object({
	query: z.string(),
	intent: z.object({
		search_query: z.string(),
		sources: z.array(z.string()),
		time_range: z.enum(['day', 'week', 'month', 'year', '']).nullable(),
	}),
	results: z.array(AskResultSchema),
	errors: z.array(
		z.object({
			source: z.string(),
			message: z.string(),
		}),
	),
});

export type AskResponse = z.infer<typeof AskResponseSchema>;

// The live spec types search_service as a required non-empty string with no
// enum, so the platform list stays open. Currently known: github, hackernews.
export const TrendingInputSchema = z
	.object({
		search_service: z.string().min(1),
		max_results: z.number().int().min(1).optional(),
	})
	.strict();

export type TrendingInput = z.infer<typeof TrendingInputSchema>;

export const TrendingResultSchema = z.object({
	title: z.string(),
	url: z.string(),
	description: z.string().nullable().optional(),
});

export type TrendingResult = z.infer<typeof TrendingResultSchema>;

export const TrendingResponseSchema = z.object({
	trendingParameters: z.object({
		search_service: z.string(),
		max_results: z.number().int().optional(),
	}),
	results: z.array(TrendingResultSchema),
});

export type TrendingResponse = z.infer<typeof TrendingResponseSchema>;

const crawlRequestShape = {
	url: z.string().url(),
	enableFallback: z.boolean().optional(),
};

export const CrawlInputSchema = z.object(crawlRequestShape).strict();

export type CrawlInput = z.infer<typeof CrawlInputSchema>;

export const CrawlBatchInputSchema = z.array(CrawlInputSchema).min(1);

export type CrawlBatchInput = z.infer<typeof CrawlBatchInputSchema>;

export const CrawlResultSchema = z.object({
	title: z.string(),
	link: z.string(),
	content: z.string(),
	metadata: z.record(z.string(), z.unknown()).optional(),
});

export type CrawlResult = z.infer<typeof CrawlResultSchema>;

export const CrawlResponseSchema = z.object({
	crawlParameters: z.object({
		url: z.string(),
	}),
	results: CrawlResultSchema,
});

export type CrawlResponse = z.infer<typeof CrawlResponseSchema>;

// Failed urls are omitted from the batch, so an all-fail request is a
// valid empty response; the input schema still requires at least one url.
export const CrawlBatchResponseSchema = z.array(CrawlResponseSchema);

export type CrawlBatchResponse = z.infer<typeof CrawlBatchResponseSchema>;

export const ScreenshotInputSchema = z
	.object({
		url: z.string().url().max(4096),
		format: z.enum(['png', 'jpeg', 'webp']).optional(),
		full_page: z.boolean().optional(),
		viewport: z
			.object({
				width: z.number().int().min(320).max(2560).optional(),
				height: z.number().int().min(200).max(1440).optional(),
				device_scale_factor: z.number().min(1).max(2).optional(),
			})
			.strict()
			.optional(),
		wait_until: z.enum(['domcontentloaded', 'load', 'networkidle']).optional(),
		wait_for_selector: z.string().min(1).max(500).optional(),
		selector: z.string().min(1).max(500).optional(),
		delay_ms: z.number().int().min(0).max(5000).optional(),
		timeout_ms: z.number().int().min(1000).max(30000).optional(),
		quality: z.number().int().min(1).max(100).optional(),
		omit_background: z.boolean().optional(),
		color_scheme: z.enum(['light', 'dark']).optional(),
		animations: z.enum(['disabled', 'allow']).optional(),
	})
	.strict();

export type ScreenshotInput = z.infer<typeof ScreenshotInputSchema>;

export const ScreenshotResponseSchema = z.object({
	contentType: z.string().min(1),
	base64: z.string().min(1),
	sizeBytes: z.number().int().min(1),
});

export type ScreenshotResponse = z.infer<typeof ScreenshotResponseSchema>;

export const SitemapInputSchema = z
	.object({
		url: z.string().url(),
		type: z.enum(['sitemap', 'all']).optional(),
	})
	.strict();

export type SitemapInput = z.infer<typeof SitemapInputSchema>;

export const SitemapResponseSchema = z.object({
	links: z.array(z.string()),
});

export type SitemapResponse = z.infer<typeof SitemapResponseSchema>;

export const ExtractInputSchema = z
	.object({
		url: z.string().url(),
		prompt: z.string().optional(),
		response_format: z.record(z.string(), z.unknown()).optional(),
	})
	.strict();

export type ExtractInput = z.infer<typeof ExtractInputSchema>;

export const ExtractResponseSchema = z.object({
	success: z.literal(true),
	extractParameters: z.object({
		url: z.string(),
	}),
	results: z.unknown(),
});

export type ExtractResponse = z.infer<typeof ExtractResponseSchema>;

export const DeepcrawlStartInputSchema = z
	.object({
		url: z.string().url(),
		type: z.enum(['sitemap', 'all']).optional(),
	})
	.strict();

export type DeepcrawlStartInput = z.infer<typeof DeepcrawlStartInputSchema>;

export const DeepcrawlStartResponseSchema = z.object({
	taskId: z.string(),
	status: z.literal('queued'),
});

export type DeepcrawlStartResponse = z.infer<
	typeof DeepcrawlStartResponseSchema
>;

export const DeepcrawlStatusInputSchema = z
	.object({
		taskId: z.string().min(1),
	})
	.strict();

export type DeepcrawlStatusInput = z.infer<typeof DeepcrawlStatusInputSchema>;

export const DeepcrawlStatusResponseSchema = z.object({
	taskId: z.string(),
	status: z.enum([
		'queued',
		'waiting',
		'processing',
		'completed',
		'failed',
		'not_found',
	]),
	success: z.boolean().optional(),
	message: z.string().optional(),
	error: z.string().nullable().optional(),
	r2Key: z.string().optional(),
	zipUrl: z.string().nullable().optional(),
});

export type DeepcrawlStatusResponse = z.infer<
	typeof DeepcrawlStatusResponseSchema
>;

export const UsageInputSchema = z
	.object({
		period: UsagePeriodSchema.optional(),
	})
	.strict();

export type UsageInput = z.infer<typeof UsageInputSchema>;

export const UsageResponseSchema = z.object({
	usage: z.number().int().min(0),
	user_id: z.string().nullable().optional(),
	credential_type: z.enum(['api_key', 'oauth']),
	client_id: z.string().nullable().optional(),
});

export type UsageResponse = z.infer<typeof UsageResponseSchema>;

export const FeedbackInputSchema = z
	.object({
		message: z.string().min(1).max(4000),
		intent: z.string().max(2000).optional(),
		category: z.enum(['bug', 'feature_request', 'docs', 'other']).optional(),
		request_id: z.string().max(256).optional(),
		agent: z
			.object({
				name: z.string().max(128).optional(),
				model: z.string().max(128).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

export type FeedbackInput = z.infer<typeof FeedbackInputSchema>;

export const FeedbackResponseSchema = z.object({
	id: z
		.string()
		.max(80)
		.regex(/^fb_[a-zA-Z0-9_-]+$/),
	status: z.literal('new'),
});

export type FeedbackResponse = z.infer<typeof FeedbackResponseSchema>;

export const HealthInputSchema = z.object({}).strict();

export type HealthInput = z.infer<typeof HealthInputSchema>;

export const HealthResponseSchema = z.object({
	status: z.string(),
	timestamp: z.string().optional(),
	version: z.string().optional(),
});

export type HealthResponse = z.infer<typeof HealthResponseSchema>;

export type Search1APIEndpointInputs = {
	search: SearchInput;
	searchBatch: SearchBatchInput;
	news: NewsInput;
	newsBatch: NewsBatchInput;
	ask: AskInput;
	trending: TrendingInput;
	crawl: CrawlInput;
	crawlBatch: CrawlBatchInput;
	screenshot: ScreenshotInput;
	sitemap: SitemapInput;
	extract: ExtractInput;
	deepcrawlStart: DeepcrawlStartInput;
	deepcrawlStatus: DeepcrawlStatusInput;
	feedback: FeedbackInput;
	usage: UsageInput;
	health: HealthInput;
};

export type Search1APIEndpointOutputs = {
	search: SearchResponse;
	searchBatch: SearchBatchResponse;
	news: NewsResponse;
	newsBatch: NewsBatchResponse;
	ask: AskResponse;
	trending: TrendingResponse;
	crawl: CrawlResponse;
	crawlBatch: CrawlBatchResponse;
	screenshot: ScreenshotResponse;
	sitemap: SitemapResponse;
	extract: ExtractResponse;
	deepcrawlStart: DeepcrawlStartResponse;
	deepcrawlStatus: DeepcrawlStatusResponse;
	feedback: FeedbackResponse;
	usage: UsageResponse;
	health: HealthResponse;
};

export const Search1APIEndpointInputSchemas = {
	search: SearchInputSchema,
	searchBatch: SearchBatchInputSchema,
	news: NewsInputSchema,
	newsBatch: NewsBatchInputSchema,
	ask: AskInputSchema,
	trending: TrendingInputSchema,
	crawl: CrawlInputSchema,
	crawlBatch: CrawlBatchInputSchema,
	screenshot: ScreenshotInputSchema,
	sitemap: SitemapInputSchema,
	extract: ExtractInputSchema,
	deepcrawlStart: DeepcrawlStartInputSchema,
	deepcrawlStatus: DeepcrawlStatusInputSchema,
	feedback: FeedbackInputSchema,
	usage: UsageInputSchema,
	health: HealthInputSchema,
} as const;

export const Search1APIEndpointOutputSchemas = {
	search: SearchResponseSchema,
	searchBatch: SearchBatchResponseSchema,
	news: NewsResponseSchema,
	newsBatch: NewsBatchResponseSchema,
	ask: AskResponseSchema,
	trending: TrendingResponseSchema,
	crawl: CrawlResponseSchema,
	crawlBatch: CrawlBatchResponseSchema,
	screenshot: ScreenshotResponseSchema,
	sitemap: SitemapResponseSchema,
	extract: ExtractResponseSchema,
	deepcrawlStart: DeepcrawlStartResponseSchema,
	deepcrawlStatus: DeepcrawlStatusResponseSchema,
	feedback: FeedbackResponseSchema,
	usage: UsageResponseSchema,
	health: HealthResponseSchema,
} as const;
