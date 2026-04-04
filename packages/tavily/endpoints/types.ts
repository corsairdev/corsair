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
	/** Include raw HTML content: false, true/markdown, or text. */
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

/** Body sent to POST /search (only required + optional fields we send). */
export type TavilySearchRequestBody = TavilySearchRequest;

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
	description: z.string().optional(),
});

export type TavilySearchImage = z.infer<typeof TavilySearchImageSchema>;

export const TavilySearchUsageSchema = z.object({
	credits: z.number(),
});

export type TavilySearchUsage = z.infer<typeof TavilySearchUsageSchema>;

export const TavilySearchResponseSchema = z.object({
	query: z.string(),
	answer: z.string().optional(),
	images: z.array(TavilySearchImageSchema),
	results: z.array(TavilySearchResultSchema),
	response_time: z.number(),
	usage: TavilySearchUsageSchema.optional(),
	request_id: z.string().optional(),
	/** Present when request had auto_parameters: true. */
	auto_parameters: z.record(z.unknown()).optional(),
});

export type TavilySearchResponse = z.infer<typeof TavilySearchResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Plugin endpoint output map
// ─────────────────────────────────────────────────────────────────────────────

export type TavilyEndpointOutputs = {
	search: TavilySearchResponse;
};
