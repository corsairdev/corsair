import { z } from 'zod';

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
	/** The search query to execute with Tavily. */
	query: z.string().min(1),
	/** Latency vs relevance. advanced=2 credits, others=1. */
	search_depth: z.enum(TAVILY_SEARCH_DEPTH).default('basic').optional(),
	/** Max chunks per source (1–3). Only when search_depth is 'advanced'. */
	chunks_per_source: z.number().int().min(1).max(3).default(3).optional(),
	/** Max number of search results (0–20). */
	max_results: z.number().int().min(0).max(20).default(5).optional(),
	/** Category: general, news, or finance. */
	topic: z.enum(TAVILY_TOPIC).default('general').optional(),
	/** Filter by publish/update date. */
	time_range: z.enum(TAVILY_TIME_RANGE).nullable().optional(),
	/** Results after this date (YYYY-MM-DD). */
	start_date: isoDateString.nullable().optional(),
	/** Results before this date (YYYY-MM-DD). */
	end_date: isoDateString.nullable().optional(),
	/** Include LLM-generated answer: false, true/basic, or advanced. */
	include_answer: z
		.union([z.boolean(), z.enum(TAVILY_INCLUDE_ANSWER)])
		.default(false)
		.optional(),
	/** Include raw page content: false, true/markdown, or text. */
	include_raw_content: z
		.union([z.boolean(), z.enum(TAVILY_RAW_CONTENT_FORMAT)])
		.default(false)
		.optional(),
	/** Also perform image search. */
	include_images: z.boolean().default(false).optional(),
	/** When include_images is true, add description per image. */
	include_image_descriptions: z.boolean().default(false).optional(),
	/** Include favicon URL per result. */
	include_favicon: z.boolean().default(false).optional(),
	/** Domains to include (max 300). */
	include_domains: z.array(z.string()).max(300).default([]).optional(),
	/** Domains to exclude (max 150). */
	exclude_domains: z.array(z.string()).max(150).default([]).optional(),
	/** Boost results from this country (general topic only). */
	country: z.string().nullable().optional(),
	/** Let Tavily auto-configure search params (may use 2 credits). */
	auto_parameters: z.boolean().default(false).optional(),
	/** Include credit usage in response. */
	include_usage: z.boolean().default(false).optional(),
});

export type TavilySearchRequest = z.infer<typeof TavilySearchRequestSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Search response
// ─────────────────────────────────────────────────────────────────────────────

export const TavilySearchResultSchema = z.object({
	title: z.string(),
	url: z.string().url(),
	content: z.string(),
	score: z.number(),
	raw_content: z.string().nullable().optional(),
	favicon: z.string().optional(),
});

export type TavilySearchResult = z.infer<typeof TavilySearchResultSchema>;

export const TavilySearchImageSchema = z.object({
	url: z.string(),
	description: z.string().nullable().optional(),
});

export type TavilySearchImage = z.infer<typeof TavilySearchImageSchema>;

export const TavilyUsageSchema = z.object({
	credits: z.number(),
});

export type TavilyUsage = z.infer<typeof TavilyUsageSchema>;

export const TavilySearchResponseSchema = z.object({
	query: z.string(),
	answer: z.string().nullable().optional(),
	images: z.array(TavilySearchImageSchema),
	results: z.array(TavilySearchResultSchema),
	response_time: z.number(),
	usage: TavilyUsageSchema.optional(),
	request_id: z.string().optional(),
	auto_parameters: z.record(z.string(), z.unknown()).optional(),
});

export type TavilySearchResponse = z.infer<typeof TavilySearchResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Extract
// ─────────────────────────────────────────────────────────────────────────────

export const TAVILY_EXTRACT_DEPTH = ['basic', 'advanced'] as const;

export type TavilyExtractDepth = (typeof TAVILY_EXTRACT_DEPTH)[number];

export const TAVILY_EXTRACT_FORMAT = ['markdown', 'text'] as const;

export type TavilyExtractFormat = (typeof TAVILY_EXTRACT_FORMAT)[number];

export const TavilyExtractRequestSchema = z.object({
	/** One or more URLs to extract content from. */
	urls: z.union([z.string().url(), z.array(z.string().url()).min(1)]),
	/** Include image URLs per result. */
	include_images: z.boolean().default(false).optional(),
	/** Extraction depth. advanced uses more credits but handles complex pages. */
	extract_depth: z.enum(TAVILY_EXTRACT_DEPTH).default('basic').optional(),
	/** Output format for raw_content: markdown or text. */
	format: z.enum(TAVILY_EXTRACT_FORMAT).default('markdown').optional(),
	/** Include favicon URL per result. */
	include_favicon: z.boolean().default(false).optional(),
});

export type TavilyExtractRequest = z.infer<typeof TavilyExtractRequestSchema>;

export const TavilyExtractResultSchema = z.object({
	url: z.string(),
	raw_content: z.string(),
	images: z.array(z.string()).optional(),
	favicon: z.string().optional(),
});

export type TavilyExtractResult = z.infer<typeof TavilyExtractResultSchema>;

export const TavilyFailedResultSchema = z.object({
	url: z.string(),
	error: z.string(),
});

export type TavilyFailedResult = z.infer<typeof TavilyFailedResultSchema>;

export const TavilyExtractResponseSchema = z.object({
	results: z.array(TavilyExtractResultSchema),
	failed_results: z.array(TavilyFailedResultSchema),
	response_time: z.number(),
	request_id: z.string().optional(),
});

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
] as const;

export type TavilyCrawlCategory = (typeof TAVILY_CRAWL_CATEGORY)[number];

export const TavilyCrawlRequestSchema = z.object({
	/** Root URL to start crawling from. */
	url: z.string().url(),
	/** How many links deep to follow from the root URL. */
	max_depth: z.number().int().min(1).default(1).optional(),
	/** How many links to follow per level (breadth). */
	max_breadth: z.number().int().min(1).default(20).optional(),
	/** Overall cap on pages returned. */
	limit: z.number().int().min(1).default(50).optional(),
	/** Natural-language instructions guiding what to crawl. */
	instructions: z.string().nullable().optional(),
	/** Regex path patterns to include. */
	select_paths: z.array(z.string()).default([]).optional(),
	/** Domains to restrict the crawl to. */
	select_domains: z.array(z.string()).default([]).optional(),
	/** Regex path patterns to exclude. */
	exclude_paths: z.array(z.string()).default([]).optional(),
	/** Domains to exclude from the crawl. */
	exclude_domains: z.array(z.string()).default([]).optional(),
	/** Follow links leaving the root domain. */
	allow_external: z.boolean().default(false).optional(),
	/** Category filters to apply while crawling. */
	categories: z.array(z.enum(TAVILY_CRAWL_CATEGORY)).default([]).optional(),
	/** Extraction depth applied to each crawled page. */
	extract_depth: z.enum(TAVILY_EXTRACT_DEPTH).default('basic').optional(),
	/** Output format for raw_content: markdown or text. */
	format: z.enum(TAVILY_EXTRACT_FORMAT).default('markdown').optional(),
	/** Include image URLs per result. */
	include_images: z.boolean().default(false).optional(),
	/** Include favicon URL per result. */
	include_favicon: z.boolean().default(false).optional(),
});

export type TavilyCrawlRequest = z.infer<typeof TavilyCrawlRequestSchema>;

export const TavilyCrawlResultSchema = z.object({
	url: z.string(),
	raw_content: z.string(),
	images: z.array(z.string()).optional(),
	favicon: z.string().optional(),
});

export type TavilyCrawlResult = z.infer<typeof TavilyCrawlResultSchema>;

export const TavilyCrawlResponseSchema = z.object({
	base_url: z.string(),
	results: z.array(TavilyCrawlResultSchema),
	failed_results: z.array(TavilyFailedResultSchema).optional(),
	response_time: z.number(),
	request_id: z.string().optional(),
});

export type TavilyCrawlResponse = z.infer<typeof TavilyCrawlResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Map
// ─────────────────────────────────────────────────────────────────────────────

export const TavilyMapRequestSchema = z.object({
	/** Root URL to map. */
	url: z.string().url(),
	/** How many links deep to follow from the root URL. */
	max_depth: z.number().int().min(1).default(1).optional(),
	/** How many links to follow per level (breadth). */
	max_breadth: z.number().int().min(1).default(20).optional(),
	/** Overall cap on URLs returned. */
	limit: z.number().int().min(1).default(50).optional(),
	/** Natural-language instructions guiding what to map. */
	instructions: z.string().nullable().optional(),
	/** Regex path patterns to include. */
	select_paths: z.array(z.string()).default([]).optional(),
	/** Domains to restrict the map to. */
	select_domains: z.array(z.string()).default([]).optional(),
	/** Regex path patterns to exclude. */
	exclude_paths: z.array(z.string()).default([]).optional(),
	/** Domains to exclude from the map. */
	exclude_domains: z.array(z.string()).default([]).optional(),
	/** Follow links leaving the root domain. */
	allow_external: z.boolean().default(false).optional(),
	/** Category filters to apply while mapping. */
	categories: z.array(z.enum(TAVILY_CRAWL_CATEGORY)).default([]).optional(),
});

export type TavilyMapRequest = z.infer<typeof TavilyMapRequestSchema>;

export const TavilyMapResponseSchema = z.object({
	base_url: z.string(),
	results: z.array(z.string()),
	response_time: z.number(),
	request_id: z.string().optional(),
});

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

export const TavilyResearchRequestSchema = z.object({
	/** The research question or topic to investigate. */
	input: z.string().min(1),
	/** Research model: auto picks for you, mini is faster, pro is deeper. */
	model: z.enum(TAVILY_RESEARCH_MODEL).default('auto').optional(),
	/** JSON schema describing a structured output shape instead of prose. */
	output_schema: z.record(z.string(), z.unknown()).nullable().optional(),
	/** How citations are rendered in the report. */
	citation_format: z
		.enum(TAVILY_CITATION_FORMAT)
		.default('numbered')
		.optional(),
	/** Domains to restrict the research to. */
	include_domains: z.array(z.string()).default([]).optional(),
	/** Domains to exclude from the research. */
	exclude_domains: z.array(z.string()).default([]).optional(),
	/** Requested length of the final report. */
	output_length: z.enum(TAVILY_OUTPUT_LENGTH).default('standard').optional(),
	/** IDs of previously uploaded files to research alongside the web. */
	files: z.array(z.string()).default([]).optional(),
	/** How long to wait for the research task to finish, in milliseconds. */
	max_wait_ms: z.number().int().min(0).max(600_000).default(300_000).optional(),
	/** How long to wait between status checks, in milliseconds. */
	poll_interval_ms: z
		.number()
		.int()
		.min(1_000)
		.max(60_000)
		.default(5_000)
		.optional(),
});

export type TavilyResearchRequest = z.infer<typeof TavilyResearchRequestSchema>;

export const TavilyResearchSourceSchema = z.object({
	title: z.string().nullable().optional(),
	url: z.string(),
	favicon: z.string().nullable().optional(),
});

export type TavilyResearchSource = z.infer<typeof TavilyResearchSourceSchema>;

export const TavilyResearchResponseSchema = z.object({
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
	sources: z.array(TavilyResearchSourceSchema).default([]).optional(),
	response_time: z.number().nullable().optional(),
	usage: TavilyUsageSchema.optional(),
});

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
