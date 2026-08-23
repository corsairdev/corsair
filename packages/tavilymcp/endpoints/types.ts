import { z } from 'zod';

// Shapes follow https://docs.tavily.com/documentation/api-reference, corrected
// against live responses where the two disagree. Request schemas carry no
// `.default()`: handlers parse their own input, so a default here would be sent
// on the wire and pin a provider default Tavily is free to change.

export const TAVILY_SEARCH_DEPTH = [
	'advanced',
	'basic',
	'fast',
	'ultra-fast',
] as const;

export type TavilySearchDepth = (typeof TAVILY_SEARCH_DEPTH)[number];

export const TAVILY_TOPIC = ['general', 'news', 'finance'] as const;

export type TavilyTopic = (typeof TAVILY_TOPIC)[number];

export const TAVILY_TIME_RANGE = [
	'day',
	'week',
	'month',
	'year',
	'd',
	'w',
	'm',
	'y',
] as const;

export type TavilyTimeRange = (typeof TAVILY_TIME_RANGE)[number];

export const TAVILY_INCLUDE_ANSWER = ['basic', 'advanced'] as const;

export type TavilyIncludeAnswerLevel = (typeof TAVILY_INCLUDE_ANSWER)[number];

export const TAVILY_RAW_CONTENT_FORMAT = ['markdown', 'text'] as const;

export type TavilyRawContentFormat = (typeof TAVILY_RAW_CONTENT_FORMAT)[number];

// ISO date string YYYY-MM-DD
const isoDateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

// ─────────────────────────────────────────────────────────────────────────────
// Search request
// ─────────────────────────────────────────────────────────────────────────────

export const TavilySearchRequestSchema = z.object({
	/**
	 * The search query to execute. Tavily rejects anything shorter than two
	 * characters with `400 Query is too short. Min query length is 2 characters.`
	 */
	query: z.string().min(2),
	/** Latency vs relevance. advanced=2 credits, others=1. Default basic. */
	search_depth: z.enum(TAVILY_SEARCH_DEPTH).optional(),
	/** Max chunks per source (1–3). Only meaningful with advanced depth. Default 3. */
	chunks_per_source: z.number().int().min(1).max(3).optional(),
	/** Max number of search results (0–20). Default 5. */
	max_results: z.number().int().min(0).max(20).optional(),
	/** Category: general, news, or finance. Default general. */
	topic: z.enum(TAVILY_TOPIC).optional(),
	/** Filter by publish/update date. Default null. */
	time_range: z.enum(TAVILY_TIME_RANGE).nullable().optional(),
	/** Results after this date (YYYY-MM-DD). Default null. */
	start_date: isoDateString.nullable().optional(),
	/** Results before this date (YYYY-MM-DD). Default null. */
	end_date: isoDateString.nullable().optional(),
	/** Include LLM-generated answer: false, true/basic, or advanced. Default false. */
	include_answer: z
		.union([z.boolean(), z.enum(TAVILY_INCLUDE_ANSWER)])
		.optional(),
	/** Include raw page content: false, true/markdown, or text. Default false. */
	include_raw_content: z
		.union([z.boolean(), z.enum(TAVILY_RAW_CONTENT_FORMAT)])
		.optional(),
	/** Also perform image search. Default false. */
	include_images: z.boolean().optional(),
	/** When include_images is true, add description per image. Default false. */
	include_image_descriptions: z.boolean().optional(),
	/** Include favicon URL per result. Default false. */
	include_favicon: z.boolean().optional(),
	/** Domains to include (max 300). */
	include_domains: z.array(z.string()).max(300).optional(),
	/** Domains to exclude (max 150). */
	exclude_domains: z.array(z.string()).max(150).optional(),
	/** Boost results from this country (general topic only). Default null. */
	country: z.string().nullable().optional(),
	/** Let Tavily auto-configure search params (may use 2 credits). Default false. */
	auto_parameters: z.boolean().optional(),
	/** Require the query to appear verbatim in results. Default false. */
	exact_match: z.boolean().optional(),
	/** Filter explicit results. Enterprise plans only. Default false. */
	safe_search: z.boolean().optional(),
	/** Include credit usage in response. Default false. */
	include_usage: z.boolean().optional(),
});

export type TavilySearchRequest = z.infer<typeof TavilySearchRequestSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Search response
// ─────────────────────────────────────────────────────────────────────────────

export const TavilySearchResultImageSchema = z
	.object({
		url: z.string(),
		description: z.string().nullable().optional(),
	})
	.passthrough();

export type TavilySearchResultImage = z.infer<
	typeof TavilySearchResultImageSchema
>;

export const TavilySearchResultSchema = z
	.object({
		title: z.string(),
		url: z.string().url(),
		content: z.string(),
		score: z.number(),
		raw_content: z.string().nullable().optional(),
		favicon: z.string().nullable().optional(),
		images: z.array(TavilySearchResultImageSchema).nullable().optional(),
		/** Per-result identifier. Returned live; absent from the published reference. */
		id: z.string().optional(),
	})
	.passthrough();

export type TavilySearchResult = z.infer<typeof TavilySearchResultSchema>;

export const TavilySearchImageSchema = z
	.object({
		url: z.string(),
		description: z.string().nullable().optional(),
	})
	.passthrough();

export type TavilySearchImage = z.infer<typeof TavilySearchImageSchema>;

export const TavilyUsageSchema = z
	.object({
		credits: z.number(),
	})
	.passthrough();

export type TavilyUsage = z.infer<typeof TavilyUsageSchema>;

export const TavilySearchResponseSchema = z
	.object({
		query: z.string(),
		answer: z.string().nullable().optional(),
		/** Returned live on every search; absent from the published reference. */
		follow_up_questions: z.array(z.string()).nullable().optional(),
		images: z.array(TavilySearchImageSchema),
		results: z.array(TavilySearchResultSchema),
		response_time: z.number(),
		usage: TavilyUsageSchema.optional(),
		request_id: z.string().optional(),
		auto_parameters: z.record(z.string(), z.unknown()).nullable().optional(),
	})
	.passthrough();

export type TavilySearchResponse = z.infer<typeof TavilySearchResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Extract
// ─────────────────────────────────────────────────────────────────────────────

export const TAVILY_EXTRACT_DEPTH = ['basic', 'advanced'] as const;

export type TavilyExtractDepth = (typeof TAVILY_EXTRACT_DEPTH)[number];

export const TAVILY_EXTRACT_FORMAT = ['markdown', 'text'] as const;

export type TavilyExtractFormat = (typeof TAVILY_EXTRACT_FORMAT)[number];

export const TavilyExtractRequestSchema = z.object({
	/** One or more URLs to extract content from. Max 20 per request. */
	urls: z.union([z.string().url(), z.array(z.string().url()).min(1).max(20)]),
	/** User intent used to rerank extracted chunks by relevance. */
	query: z.string().optional(),
	/** Max chunks per source (1–5). Only applies alongside `query`. Default 3. */
	chunks_per_source: z.number().int().min(1).max(5).optional(),
	/** Include image URLs per result. Default false. */
	include_images: z.boolean().optional(),
	/** Extraction depth. advanced uses more credits but handles complex pages. Default basic. */
	extract_depth: z.enum(TAVILY_EXTRACT_DEPTH).optional(),
	/** Output format for raw_content: markdown or text. Default markdown. */
	format: z.enum(TAVILY_EXTRACT_FORMAT).optional(),
	/** Include favicon URL per result. Default false. */
	include_favicon: z.boolean().optional(),
	/** Seconds to wait (1–60). Defaults to 10 for basic, 30 for advanced. */
	timeout: z.number().min(1).max(60).optional(),
	/** Include credit usage in response. Default false. */
	include_usage: z.boolean().optional(),
});

export type TavilyExtractRequest = z.infer<typeof TavilyExtractRequestSchema>;

export const TavilyExtractResultSchema = z
	.object({
		url: z.string(),
		raw_content: z.string(),
		/** Returned live; absent from the published reference. */
		title: z.string().nullable().optional(),
		images: z.array(z.string()).optional(),
		favicon: z.string().nullable().optional(),
	})
	.passthrough();

export type TavilyExtractResult = z.infer<typeof TavilyExtractResultSchema>;

export const TavilyFailedResultSchema = z
	.object({
		url: z.string(),
		error: z.string(),
	})
	.passthrough();

export type TavilyFailedResult = z.infer<typeof TavilyFailedResultSchema>;

export const TavilyExtractResponseSchema = z
	.object({
		results: z.array(TavilyExtractResultSchema),
		failed_results: z.array(TavilyFailedResultSchema),
		response_time: z.number(),
		usage: TavilyUsageSchema.optional(),
		request_id: z.string().optional(),
	})
	.passthrough();

export type TavilyExtractResponse = z.infer<typeof TavilyExtractResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Crawl
// ─────────────────────────────────────────────────────────────────────────────

export const TAVILY_CRAWL_CATEGORY = [
	'Careers',
	'Blog',
	'Documentation',
	'About',
	'Pricing',
	'Community',
	'Developers',
	'Contact',
	'Media',
	'People',
] as const;

export type TavilyCrawlCategory = (typeof TAVILY_CRAWL_CATEGORY)[number];

export const TavilyCrawlRequestSchema = z.object({
	/** Root URL to start crawling from. */
	url: z.string().url(),
	/** How many links deep to follow from the root URL (1–5). Default 1. */
	max_depth: z.number().int().min(1).max(5).optional(),
	/** How many links to follow per level (1–500). Default 20. */
	max_breadth: z.number().int().min(1).max(500).optional(),
	/** Overall cap on pages returned. Default 50. */
	limit: z.number().int().min(1).optional(),
	/** Natural-language instructions guiding what to crawl. Costs extra credits. */
	instructions: z.string().nullable().optional(),
	/** Max chunks per source (1–5). Default 3. */
	chunks_per_source: z.number().int().min(1).max(5).optional(),
	/** Regex path patterns to include. */
	select_paths: z.array(z.string()).optional(),
	/** Regex domain patterns to restrict the crawl to. */
	select_domains: z.array(z.string()).optional(),
	/** Regex path patterns to exclude. */
	exclude_paths: z.array(z.string()).optional(),
	/** Regex domain patterns to exclude from the crawl. */
	exclude_domains: z.array(z.string()).optional(),
	/** Follow links leaving the root domain. Default true. */
	allow_external: z.boolean().optional(),
	/** Category filters to apply while crawling. */
	categories: z.array(z.enum(TAVILY_CRAWL_CATEGORY)).optional(),
	/** Extraction depth applied to each crawled page. Default basic. */
	extract_depth: z.enum(TAVILY_EXTRACT_DEPTH).optional(),
	/** Output format for raw_content: markdown or text. Default markdown. */
	format: z.enum(TAVILY_EXTRACT_FORMAT).optional(),
	/** Include image URLs per result. Default false. */
	include_images: z.boolean().optional(),
	/** Include favicon URL per result. Default false. */
	include_favicon: z.boolean().optional(),
	/** Seconds to wait for the crawl (10–150). Default 150. */
	timeout: z.number().min(10).max(150).optional(),
	/** Include credit usage in response. Default false. */
	include_usage: z.boolean().optional(),
});

export type TavilyCrawlRequest = z.infer<typeof TavilyCrawlRequestSchema>;

export const TavilyCrawlResultSchema = z
	.object({
		url: z.string(),
		raw_content: z.string(),
		images: z.array(z.string()).optional(),
		favicon: z.string().nullable().optional(),
	})
	.passthrough();

export type TavilyCrawlResult = z.infer<typeof TavilyCrawlResultSchema>;

export const TavilyCrawlResponseSchema = z
	.object({
		base_url: z.string(),
		results: z.array(TavilyCrawlResultSchema),
		/** Only present when at least one page failed. */
		failed_results: z.array(TavilyFailedResultSchema).optional(),
		response_time: z.number(),
		usage: TavilyUsageSchema.optional(),
		request_id: z.string().optional(),
	})
	.passthrough();

export type TavilyCrawlResponse = z.infer<typeof TavilyCrawlResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Map
// ─────────────────────────────────────────────────────────────────────────────

export const TavilyMapRequestSchema = z.object({
	/** Root URL to map. */
	url: z.string().url(),
	/** How many links deep to follow from the root URL (1–5). Default 1. */
	max_depth: z.number().int().min(1).max(5).optional(),
	/** How many links to follow per level (1–500). Default 20. */
	max_breadth: z.number().int().min(1).max(500).optional(),
	/** Overall cap on URLs returned. Default 50. */
	limit: z.number().int().min(1).optional(),
	/** Natural-language instructions guiding what to map. */
	instructions: z.string().nullable().optional(),
	/** Regex path patterns to include. */
	select_paths: z.array(z.string()).optional(),
	/** Regex domain patterns to restrict the map to. */
	select_domains: z.array(z.string()).optional(),
	/** Regex path patterns to exclude. */
	exclude_paths: z.array(z.string()).optional(),
	/** Regex domain patterns to exclude from the map. */
	exclude_domains: z.array(z.string()).optional(),
	/** Follow links leaving the root domain. Default true. */
	allow_external: z.boolean().optional(),
	/** Category filters to apply while mapping. */
	categories: z.array(z.enum(TAVILY_CRAWL_CATEGORY)).optional(),
	/** Seconds to wait for the map (10–150). Default 150. */
	timeout: z.number().min(10).max(150).optional(),
	/** Include credit usage in response. Default false. */
	include_usage: z.boolean().optional(),
});

export type TavilyMapRequest = z.infer<typeof TavilyMapRequestSchema>;

export const TavilyMapResponseSchema = z
	.object({
		base_url: z.string(),
		results: z.array(z.string()),
		response_time: z.number(),
		usage: TavilyUsageSchema.optional(),
		request_id: z.string().optional(),
	})
	.passthrough();

export type TavilyMapResponse = z.infer<typeof TavilyMapResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Research
// ─────────────────────────────────────────────────────────────────────────────

export const TAVILY_RESEARCH_MODEL = ['auto', 'mini', 'pro'] as const;

export type TavilyResearchModel = (typeof TAVILY_RESEARCH_MODEL)[number];

export const TAVILY_CITATION_FORMAT = [
	'numbered',
	'mla',
	'apa',
	'chicago',
] as const;

export type TavilyCitationFormat = (typeof TAVILY_CITATION_FORMAT)[number];

export const TAVILY_OUTPUT_LENGTH = ['short', 'standard', 'long'] as const;

export type TavilyOutputLength = (typeof TAVILY_OUTPUT_LENGTH)[number];

export const TAVILY_RESEARCH_STATUS = [
	'pending',
	'in_progress',
	'completed',
	'failed',
] as const;

export type TavilyResearchStatus = (typeof TAVILY_RESEARCH_STATUS)[number];

/**
 * An inline file attachment. Tavily takes the contents on the request, not a
 * reference to a previously uploaded file: `.txt`, `.md` and `.json` only, up
 * to 5 files and 80,000 words each.
 */
export const TavilyResearchFileSchema = z.object({
	/** File name, including one of the three extensions Tavily reads. */
	name: z
		.string()
		.min(1)
		.regex(/\.(txt|md|json)$/i, 'must end in .txt, .md or .json'),
	/** Base64-encoded file contents. */
	data: z.string().min(1).base64(),
	/** Encoding discriminator; Tavily currently accepts only 'base64'. */
	type: z.literal('base64'),
});

export type TavilyResearchFile = z.infer<typeof TavilyResearchFileSchema>;

export const TavilyResearchRequestSchema = z.object({
	/** The research question or topic to investigate. */
	input: z.string().min(1),
	/** Research model: auto picks for you, mini is faster, pro is deeper. Default auto. */
	model: z.enum(TAVILY_RESEARCH_MODEL).optional(),
	/** JSON schema describing a structured output shape instead of prose. */
	output_schema: z.record(z.string(), z.unknown()).nullable().optional(),
	/** How citations are rendered in the report. Default numbered. */
	citation_format: z.enum(TAVILY_CITATION_FORMAT).optional(),
	/** Soft preference for these domains (max 20). */
	include_domains: z.array(z.string()).max(20).optional(),
	/** Hard blocklist (max 20). */
	exclude_domains: z.array(z.string()).max(20).optional(),
	/** Requested length of the final report. Default standard. */
	output_length: z.enum(TAVILY_OUTPUT_LENGTH).optional(),
	/** Inline files to research alongside the web (max 5). */
	files: z.array(TavilyResearchFileSchema).max(5).optional(),
	/** How long to wait for the research task to finish, in milliseconds. Default 300000. */
	max_wait_ms: z.number().int().min(0).max(600_000).optional(),
	/** How long to wait between status checks, in milliseconds. Default 5000. */
	poll_interval_ms: z.number().int().min(1_000).max(60_000).optional(),
});

export type TavilyResearchRequest = z.infer<typeof TavilyResearchRequestSchema>;

export const TavilyResearchSourceSchema = z
	.object({
		title: z.string().nullable().optional(),
		url: z.string(),
		favicon: z.string().nullable().optional(),
	})
	.passthrough();

export type TavilyResearchSource = z.infer<typeof TavilyResearchSourceSchema>;

export const TavilyResearchResponseSchema = z
	.object({
		request_id: z.string(),
		status: z.enum(TAVILY_RESEARCH_STATUS),
		input: z.string().nullable().optional(),
		model: z.string().nullable().optional(),
		created_at: z.string().nullable().optional(),
		/** The finished report: prose when no output_schema, otherwise an object. */
		content: z
			.union([z.string(), z.record(z.string(), z.unknown())])
			.nullable()
			.optional(),
		sources: z.array(TavilyResearchSourceSchema).optional(),
		response_time: z.number().nullable().optional(),
		usage: TavilyUsageSchema.optional(),
	})
	.passthrough();

export type TavilyResearchResponse = z.infer<
	typeof TavilyResearchResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Plugin endpoint input/output maps
// ─────────────────────────────────────────────────────────────────────────────

export type TavilyMcpEndpointInputs = {
	search: TavilySearchRequest;
	extract: TavilyExtractRequest;
	crawl: TavilyCrawlRequest;
	map: TavilyMapRequest;
	research: TavilyResearchRequest;
};

export type TavilyMcpEndpointOutputs = {
	search: TavilySearchResponse;
	extract: TavilyExtractResponse;
	crawl: TavilyCrawlResponse;
	map: TavilyMapResponse;
	research: TavilyResearchResponse;
};

export const TavilyMcpEndpointInputSchemas = {
	search: TavilySearchRequestSchema,
	extract: TavilyExtractRequestSchema,
	crawl: TavilyCrawlRequestSchema,
	map: TavilyMapRequestSchema,
	research: TavilyResearchRequestSchema,
} as const;

export const TavilyMcpEndpointOutputSchemas = {
	search: TavilySearchResponseSchema,
	extract: TavilyExtractResponseSchema,
	crawl: TavilyCrawlResponseSchema,
	map: TavilyMapResponseSchema,
	research: TavilyResearchResponseSchema,
} as const;
