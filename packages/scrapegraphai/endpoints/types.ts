import { z } from 'zod';

/**
 * All shapes below are transcribed from ScrapeGraphAI's own OpenAPI document
 * (`GET https://api.scrapegraphai.com/openapi.json`, confirmed live
 * 2026-08-29) plus https://docs.scrapegraphai.com/services/smartscraper for
 * the auth header. Field names are kept exactly as the API expects them
 * (snake_case) since request bodies are forwarded to the provider as-is.
 *
 * A handful of endpoints (`POST /v1/crawl`, `GET /v1/crawl/{task_id}`,
 * `GET /v1/webhook/logs/{crawler_id}`, `POST /v1/endpoint/save-endpoint`,
 * `GET /v1/validate`, `POST /v1/toonify`) declare an empty `{}` response
 * schema in the provider's own spec — FastAPI's shorthand for "no
 * `response_model`, returns whatever the handler builds". Those are typed
 * with `.loose()` against the closest sibling model (or left maximally
 * permissive) rather than guessed at field-by-field; see the comment above
 * each one.
 */

/* -------------------------------------------------------------------------- */
/* shared fragments                                                           */
/* -------------------------------------------------------------------------- */

const TimeRangeSchema = z.enum([
	'past_hour',
	'past_24_hours',
	'past_week',
	'past_month',
	'past_year',
]);

const JobStatusSchema = z.enum(['queued', 'processing', 'completed', 'failed']);

const ServiceTypeSchema = z.enum([
	'smartscraper',
	'searchscraper',
	'markdownify',
	'smartcrawler',
	'agenticscrapper',
	'site_monitor',
]);

const stringHeaders = z.record(z.string(), z.string()).nullable().optional();
const jsonObject = z.record(z.string(), z.unknown());

/* -------------------------------------------------------------------------- */
/* searchScraper — POST/GET /v1/searchscraper, GET /v1/history/searchscraper  */
/* -------------------------------------------------------------------------- */

const SearchScraperStartInputSchema = z.object({
	user_prompt: z.string(),
	num_results: z.number().int().min(3).max(20).optional(),
	headers: stringHeaders,
	output_schema: jsonObject.nullable().optional(),
	extraction_mode: z.boolean().optional(),
	markdown_mode: z.boolean().optional(),
	stealth: z.boolean().optional(),
	mock: z.boolean().optional(),
	stream: z.boolean().optional(),
	webhook_url: z.string().nullable().optional(),
	location_geo_code: z.string().nullable().optional(),
	time_range: TimeRangeSchema.nullable().optional(),
});
export type SearchScraperStartInput = z.infer<
	typeof SearchScraperStartInputSchema
>;

const SearchScraperStartResponseSchema = z.object({
	request_id: z.string(),
	status: JobStatusSchema,
	user_prompt: z.string(),
	num_results: z.number().nullable().optional(),
	result: z.unknown().nullable().optional(),
	reference_urls: z.array(z.string()).nullable().optional(),
	markdown_content: z.string().nullable().optional(),
	error: z.string().nullable().optional(),
});
export type SearchScraperStartResponse = z.infer<
	typeof SearchScraperStartResponseSchema
>;

const SearchScraperStatusInputSchema = z.object({
	request_id: z.string(),
});
export type SearchScraperStatusInput = z.infer<
	typeof SearchScraperStatusInputSchema
>;

/** `GET /v1/searchscraper/{id}` declares no response schema; same fields as start, all optional. */
const SearchScraperStatusResponseSchema =
	SearchScraperStartResponseSchema.partial().loose();
export type SearchScraperStatusResponse = z.infer<
	typeof SearchScraperStatusResponseSchema
>;

const HistoryInputSchema = z.object({
	page: z.number().int().min(1).optional(),
	page_size: z.number().int().min(1).max(100).optional(),
});

const SearchScraperHistoryInputSchema = HistoryInputSchema;
export type SearchScraperHistoryInput = z.infer<
	typeof SearchScraperHistoryInputSchema
>;

const SearchscraperRequestDBSchema = z.object({
	request_id: z.string(),
	user_id: z.string().nullable().optional(),
	user_prompt: z.string(),
	search_query: z.string().nullable().optional(),
	extraction_query: z.string().nullable().optional(),
	references_urls: z.array(z.string()).nullable().optional(),
	output_schema: jsonObject.nullable().optional(),
	result: z.unknown().nullable().optional(),
	status: JobStatusSchema.optional(),
	metadata: jsonObject.optional(),
	error: z.string().nullable().optional(),
	requested_at: z.string().optional(),
	finished_at: z.string().nullable().optional(),
});

const SearchScraperHistoryResponseSchema = z.object({
	requests: z.array(SearchscraperRequestDBSchema),
	next_key: jsonObject.nullable().optional(),
});
export type SearchScraperHistoryResponse = z.infer<
	typeof SearchScraperHistoryResponseSchema
>;

/* -------------------------------------------------------------------------- */
/* smartScraper — POST/GET /v1/smartscraper, GET /v1/history/smartscraper     */
/* -------------------------------------------------------------------------- */

const SmartScraperStartInputSchema = z.object({
	user_prompt: z.string(),
	website_url: z.string().nullable().optional(),
	website_html: z.string().nullable().optional(),
	website_markdown: z.string().nullable().optional(),
	render_heavy_js: z.boolean().optional(),
	mock: z.boolean().optional(),
	stealth: z.boolean().optional(),
	branding: z.boolean().optional(),
	stream: z.boolean().optional(),
	country_code: z.string().nullable().optional(),
	wait_ms: z.number().int().optional(),
	output_schema: jsonObject.nullable().optional(),
	headers: stringHeaders,
	number_of_scrolls: z.number().int().min(0).max(100).optional(),
	total_pages: z.number().int().min(1).max(100).optional(),
	steps: z.array(z.string()).nullable().optional(),
	cookies: z.record(z.string(), z.string()).nullable().optional(),
	plain_text: z.boolean().optional(),
	webhook_url: z.string().nullable().optional(),
	offset: z.number().int().optional(),
	is_multipage_child: z.boolean().optional(),
});
export type SmartScraperStartInput = z.infer<
	typeof SmartScraperStartInputSchema
>;

const SmartScraperStartResponseSchema = z.object({
	request_id: z.string(),
	status: JobStatusSchema,
	website_url: z.string().nullable().optional(),
	user_prompt: z.string(),
	result: z.union([jsonObject, z.string()]).nullable().optional(),
	error: z.string().optional(),
});
export type SmartScraperStartResponse = z.infer<
	typeof SmartScraperStartResponseSchema
>;

const SmartScraperStatusInputSchema = z.object({
	request_id: z.string(),
});
export type SmartScraperStatusInput = z.infer<
	typeof SmartScraperStatusInputSchema
>;

/** `GET /v1/smartscraper/{id}` declares no response schema; same fields as start, all optional. */
const SmartScraperStatusResponseSchema =
	SmartScraperStartResponseSchema.partial().loose();
export type SmartScraperStatusResponse = z.infer<
	typeof SmartScraperStatusResponseSchema
>;

const SmartScraperHistoryInputSchema = HistoryInputSchema;
export type SmartScraperHistoryInput = z.infer<
	typeof SmartScraperHistoryInputSchema
>;

const SmartscraperRequestDBSchema = z.object({
	request_id: z.string(),
	user_id: z.string().nullable().optional(),
	webpage_id: z.string().nullable().optional(),
	website_url: z.string().nullable().optional(),
	user_prompt: z.string(),
	output_schema: jsonObject.nullable().optional(),
	result: z.union([jsonObject, z.string()]).nullable().optional(),
	status: JobStatusSchema.optional(),
	requested_at: z.string(),
	finished_at: z.string().nullable().optional(),
	error: z.string().nullable().optional(),
	metadata: jsonObject.nullable().optional(),
	request_params: jsonObject.nullable().optional(),
});

const SmartScraperHistoryResponseSchema = z.object({
	requests: z.array(SmartscraperRequestDBSchema),
	next_key: jsonObject.nullable().optional(),
});
export type SmartScraperHistoryResponse = z.infer<
	typeof SmartScraperHistoryResponseSchema
>;

/* -------------------------------------------------------------------------- */
/* markdownify — POST/GET /v1/markdownify, GET /v1/history/markdownify        */
/* -------------------------------------------------------------------------- */

const MarkdownifyStartInputSchema = z.object({
	website_url: z.string(),
	render_heavy_js: z.boolean().optional(),
	mock: z.boolean().optional(),
	stealth: z.boolean().optional(),
	branding: z.boolean().optional(),
	stream: z.boolean().optional(),
	country_code: z.string().nullable().optional(),
	wait_ms: z.number().int().optional(),
	headers: stringHeaders,
	steps: z.array(z.string()).nullable().optional(),
	webhook_url: z.string().nullable().optional(),
});
export type MarkdownifyStartInput = z.infer<typeof MarkdownifyStartInputSchema>;

const MarkdownifyStartResponseSchema = z.object({
	request_id: z.string(),
	status: JobStatusSchema,
	website_url: z.string(),
	result: z.string().nullable().optional(),
	error: z.string().optional(),
});
export type MarkdownifyStartResponse = z.infer<
	typeof MarkdownifyStartResponseSchema
>;

const MarkdownifyStatusInputSchema = z.object({
	request_id: z.string(),
});
export type MarkdownifyStatusInput = z.infer<
	typeof MarkdownifyStatusInputSchema
>;

/** `GET /v1/markdownify/{id}` declares no response schema; same fields as start, all optional. */
const MarkdownifyStatusResponseSchema =
	MarkdownifyStartResponseSchema.partial().loose();
export type MarkdownifyStatusResponse = z.infer<
	typeof MarkdownifyStatusResponseSchema
>;

const MarkdownifyHistoryInputSchema = HistoryInputSchema;
export type MarkdownifyHistoryInput = z.infer<
	typeof MarkdownifyHistoryInputSchema
>;

const MarkdownifyRequestDBSchema = z.object({
	request_id: z.string().optional(),
	user_id: z.string().nullable().optional(),
	webpage_id: z.string().nullable().optional(),
	requested_at: z.string().optional(),
	status: JobStatusSchema.optional(),
	error: z.string().nullable().optional(),
	website_url: z.string(),
	finished_at: z.string().nullable().optional(),
	metadata: jsonObject.nullable().optional(),
	usage_id: z.string().nullable().optional(),
	request_params: jsonObject.nullable().optional(),
});

const MarkdownifyHistoryResponseSchema = z.object({
	requests: z.array(MarkdownifyRequestDBSchema),
	next_key: jsonObject.nullable().optional(),
});
export type MarkdownifyHistoryResponse = z.infer<
	typeof MarkdownifyHistoryResponseSchema
>;

/* -------------------------------------------------------------------------- */
/* smartCrawler — POST /v1/crawl, GET /v1/crawl/{task_id},                    */
/* GET /v1/history/crawl, GET /v1/webhook/logs/{crawler_id}                   */
/* -------------------------------------------------------------------------- */

const CrawlJobRulesSchema = z.object({
	exclude: z.array(z.string()).nullable().optional(),
	include_paths: z.array(z.string()).nullable().optional(),
	exclude_paths: z.array(z.string()).nullable().optional(),
	same_domain: z.boolean().nullable().optional(),
});

const SmartCrawlerStartInputSchema = z.object({
	url: z.string(),
	depth: z.number().int().optional(),
	breadth: z.number().int().nullable().optional(),
	max_pages: z.number().int().nullable().optional(),
	prompt: z.string().nullable().optional(),
	schema: jsonObject.nullable().optional(),
	rules: CrawlJobRulesSchema.nullable().optional(),
	sitemap: z.boolean().optional(),
	render_heavy_js: z.boolean().optional(),
	extraction_mode: z.boolean().optional(),
	stealth: z.boolean().optional(),
	mock: z.boolean().optional(),
	webhook_url: z.string().nullable().optional(),
	reader_mode: z.boolean().optional(),
	wait_ms: z.number().int().optional(),
	country_code: z.string().nullable().optional(),
});
export type SmartCrawlerStartInput = z.infer<
	typeof SmartCrawlerStartInputSchema
>;

/**
 * `POST /v1/crawl` declares an empty `{}` response schema (no
 * `response_model` on the handler). Typed loosely against the fields
 * `CrawlerRequestDB` and `GET /v1/crawl/{task_id}` confirm exist for a crawl
 * job — not independently confirmed live, since that would require a real
 * account and consumed credits.
 */
const CrawlResultSchema = z
	.object({
		task_id: z.string().optional(),
		request_id: z.string().optional(),
		status: z.string().optional(),
		url: z.string().optional(),
		prompt: z.string().nullable().optional(),
		max_pages: z.number().int().optional(),
		error: z.string().nullable().optional(),
		metadata: jsonObject.nullable().optional(),
		requested_at: z.string().optional(),
		finished_at: z.string().nullable().optional(),
		total_cost: z.number().nullable().optional(),
		credits_used: z.number().int().nullable().optional(),
		pages_processed: z.number().int().nullable().optional(),
		crawled_urls: z.array(z.string()).nullable().optional(),
		result: jsonObject.nullable().optional(),
		result_url: z.string().nullable().optional(),
	})
	.loose();
export type SmartCrawlerStartResponse = z.infer<typeof CrawlResultSchema>;

const SmartCrawlerStatusInputSchema = z.object({
	task_id: z.string(),
});
export type SmartCrawlerStatusInput = z.infer<
	typeof SmartCrawlerStatusInputSchema
>;

/** `GET /v1/crawl/{task_id}` also declares an empty `{}` response schema — see `CrawlResultSchema` above. */
const SmartCrawlerStatusResponseSchema = CrawlResultSchema;
export type SmartCrawlerStatusResponse = z.infer<
	typeof SmartCrawlerStatusResponseSchema
>;

const SmartCrawlerHistoryInputSchema = HistoryInputSchema;
export type SmartCrawlerHistoryInput = z.infer<
	typeof SmartCrawlerHistoryInputSchema
>;

const CrawlerRequestDBSchema = z.object({
	request_id: z.string(),
	user_id: z.string(),
	url: z.string(),
	prompt: z.string().nullable().optional(),
	max_pages: z.number().int(),
	status: JobStatusSchema,
	error: z.string().nullable().optional(),
	metadata: jsonObject.nullable().optional(),
	requested_at: z.string(),
	finished_at: z.string().nullable().optional(),
	total_cost: z.number().nullable().optional(),
	credits_used: z.number().int().nullable().optional(),
	pages_processed: z.number().int().nullable().optional(),
	crawled_urls: z.array(z.string()).nullable().optional(),
	task_id: z.string().nullable().optional(),
	result: jsonObject.nullable().optional(),
	result_url: z.string().nullable().optional(),
	request_params: jsonObject.nullable().optional(),
});

const SmartCrawlerHistoryResponseSchema = z.object({
	requests: z.array(CrawlerRequestDBSchema),
	next_key: jsonObject.nullable().optional(),
});
export type SmartCrawlerHistoryResponse = z.infer<
	typeof SmartCrawlerHistoryResponseSchema
>;

const SmartCrawlerWebhookLogsInputSchema = z.object({
	crawler_id: z.string(),
});
export type SmartCrawlerWebhookLogsInput = z.infer<
	typeof SmartCrawlerWebhookLogsInputSchema
>;

/** `GET /v1/webhook/logs/{crawler_id}` declares an empty `{}` response schema — shape not published. */
const SmartCrawlerWebhookLogsResponseSchema = z
	.object({
		logs: z.array(jsonObject).optional(),
	})
	.loose();
export type SmartCrawlerWebhookLogsResponse = z.infer<
	typeof SmartCrawlerWebhookLogsResponseSchema
>;

/* -------------------------------------------------------------------------- */
/* agenticScraper — GET /v1/history/agentic-scraper, POST /v1/get-live-session-url */
/* -------------------------------------------------------------------------- */

const AgenticScraperHistoryInputSchema = HistoryInputSchema;
export type AgenticScraperHistoryInput = z.infer<
	typeof AgenticScraperHistoryInputSchema
>;

const AgenticScraperStatusSchema = z.enum([
	'queued',
	'processing',
	'processinghtml',
	'processedhtml',
	'completed',
	'failed',
]);

const AgenticScraperRequestDBSchema = z.object({
	request_id: z.string(),
	user_id: z.string(),
	webpage_id: z.string(),
	website_url: z.string(),
	user_prompt: z.string().nullable().optional(),
	output_schema: jsonObject.nullable().optional(),
	requested_at: z.string(),
	finished_at: z.string().nullable().optional(),
	status: AgenticScraperStatusSchema,
	metadata: z.unknown().nullable().optional(),
	result: z.unknown().nullable().optional(),
	total_cost: z.number().nullable().optional(),
	usage_id: z.string().nullable().optional(),
	error: z.string().nullable().optional(),
});

const AgenticScraperHistoryResponseSchema = z.object({
	requests: z.array(AgenticScraperRequestDBSchema),
	next_key: jsonObject.nullable().optional(),
});
export type AgenticScraperHistoryResponse = z.infer<
	typeof AgenticScraperHistoryResponseSchema
>;

const AgenticScraperGetLiveSessionUrlInputSchema = z.object({
	url: z.string(),
	timeout: z.number().int().optional(),
});
export type AgenticScraperGetLiveSessionUrlInput = z.infer<
	typeof AgenticScraperGetLiveSessionUrlInputSchema
>;

const AgenticScraperGetLiveSessionUrlResponseSchema = z.object({
	session_url: z.string(),
	session_id: z.string(),
});
export type AgenticScraperGetLiveSessionUrlResponse = z.infer<
	typeof AgenticScraperGetLiveSessionUrlResponseSchema
>;

/* -------------------------------------------------------------------------- */
/* scrape — GET /v1/history/scrape (read-only; no start op in this catalog)   */
/* -------------------------------------------------------------------------- */

const ScrapeHistoryInputSchema = HistoryInputSchema;
export type ScrapeHistoryInput = z.infer<typeof ScrapeHistoryInputSchema>;

const ScrapeRequestDBSchema = z.object({
	request_id: z.string(),
	user_id: z.string().nullable().optional(),
	website_url: z.string(),
	render_heavy_js: z.boolean().optional(),
	result: z.string().nullable().optional(),
	status: JobStatusSchema.optional(),
	metadata: jsonObject.optional(),
	error: z.string().nullable().optional(),
	finished_at: z.string().nullable().optional(),
	requested_at: z.string().optional(),
	cost: z.number().int().optional(),
	request_params: jsonObject.nullable().optional(),
});

const ScrapeHistoryResponseSchema = z.object({
	requests: z.array(ScrapeRequestDBSchema),
	next_key: jsonObject.nullable().optional(),
});
export type ScrapeHistoryResponse = z.infer<typeof ScrapeHistoryResponseSchema>;

/* -------------------------------------------------------------------------- */
/* sitemap — GET /v1/history/sitemap (read-only; no start op in this catalog) */
/* -------------------------------------------------------------------------- */

const SitemapHistoryInputSchema = HistoryInputSchema;
export type SitemapHistoryInput = z.infer<typeof SitemapHistoryInputSchema>;

const SitemapRequestDBSchema = z.object({
	request_id: z.string(),
	website_url: z.string(),
	api_key_id: z.string(),
	user_id: z.string(),
	requested_at: z.string(),
	status: z.string(),
	urls_count: z.number().int(),
	error_message: z.string().nullable().optional(),
	metadata: jsonObject.nullable().optional(),
});

const SitemapHistoryResponseSchema = z.object({
	requests: z.array(SitemapRequestDBSchema),
	next_key: jsonObject.nullable().optional(),
});
export type SitemapHistoryResponse = z.infer<
	typeof SitemapHistoryResponseSchema
>;

/* -------------------------------------------------------------------------- */
/* schema — POST /v1/generate_schema                                          */
/* -------------------------------------------------------------------------- */

const SchemaGenerateInputSchema = z.object({
	user_prompt: z.string(),
	existing_schema: jsonObject.nullable().optional(),
});
export type SchemaGenerateInput = z.infer<typeof SchemaGenerateInputSchema>;

const SchemaGenerateResponseSchema = z.object({
	request_id: z.string(),
	status: z.string(),
	user_prompt: z.string(),
	refined_prompt: z.string(),
	generated_schema: jsonObject,
	error: z.string().nullable().optional(),
});
export type SchemaGenerateResponse = z.infer<
	typeof SchemaGenerateResponseSchema
>;

/* -------------------------------------------------------------------------- */
/* endpoint — POST /v1/endpoint/get-suggestions, /v1/endpoint/save-endpoint   */
/* -------------------------------------------------------------------------- */

const EndpointParameterSchema = z.object({
	name: z.string(),
	type: z.string(),
	location: z.string(),
	required: z.boolean(),
	description: z.string(),
	is_url: z.boolean().optional(),
});

const EndpointSuggestionSchema = z.object({
	endpoint: z.string(),
	method: z.string().optional(),
	description: z.string(),
	target_url: z.string(),
	parameters: z.array(EndpointParameterSchema),
	pydantic_schema: jsonObject,
	extraction_prompt: z.string(),
	interaction_steps: z.array(z.string()).nullable().optional(),
});
export type EndpointSuggestion = z.infer<typeof EndpointSuggestionSchema>;

const EndpointGetSuggestionsInputSchema = z.object({
	website_url: z.string(),
	prompt: z.string(),
});
export type EndpointGetSuggestionsInput = z.infer<
	typeof EndpointGetSuggestionsInputSchema
>;

const EndpointGetSuggestionsResponseSchema = z.object({
	suggestions: z.array(EndpointSuggestionSchema),
	html_with_markdowns: z.unknown(),
});
export type EndpointGetSuggestionsResponse = z.infer<
	typeof EndpointGetSuggestionsResponseSchema
>;

const EndpointSaveInputSchema = z.object({
	suggestions: z.array(EndpointSuggestionSchema),
});
export type EndpointSaveInput = z.infer<typeof EndpointSaveInputSchema>;

/** `POST /v1/endpoint/save-endpoint` declares an empty `{}` response schema — shape not published. */
const EndpointSaveResponseSchema = z.object({}).loose();
export type EndpointSaveResponse = z.infer<typeof EndpointSaveResponseSchema>;

/* -------------------------------------------------------------------------- */
/* account — GET /v1/credits, GET /v1/validate, GET /v1/usage/timeline        */
/* -------------------------------------------------------------------------- */

const NoInputSchema = z.object({});

const AccountCreditsInputSchema = NoInputSchema;
export type AccountCreditsInput = z.infer<typeof AccountCreditsInputSchema>;

const AccountCreditsResponseSchema = z.object({
	remaining_credits: z.number().int(),
	total_credits_used: z.number().int(),
});
export type AccountCreditsResponse = z.infer<
	typeof AccountCreditsResponseSchema
>;

const AccountValidateApiKeyInputSchema = NoInputSchema;
export type AccountValidateApiKeyInput = z.infer<
	typeof AccountValidateApiKeyInputSchema
>;

/** `GET /v1/validate` declares a bare `object` response schema — shape not published. */
const AccountValidateApiKeyResponseSchema = z.object({}).loose();
export type AccountValidateApiKeyResponse = z.infer<
	typeof AccountValidateApiKeyResponseSchema
>;

const AccountUsageTimelineInputSchema = z.object({
	days: z.enum(['7', '14', '30', 'all']).optional(),
});
export type AccountUsageTimelineInput = z.infer<
	typeof AccountUsageTimelineInputSchema
>;

const AccountUsageTimelineResponseSchema = z.object({
	timeline: z.array(
		z.object({
			service: z.string(),
			timestamp: z.string(),
		}),
	),
});
export type AccountUsageTimelineResponse = z.infer<
	typeof AccountUsageTimelineResponseSchema
>;

/* -------------------------------------------------------------------------- */
/* feedback — POST /v1/feedback, POST /v1/product-feedback                    */
/* -------------------------------------------------------------------------- */

const FeedbackSubmitInputSchema = z.object({
	request_id: z.string(),
	rating: z.number().int().min(0).max(5),
	feedback_text: z.string().nullable().optional(),
});
export type FeedbackSubmitInput = z.infer<typeof FeedbackSubmitInputSchema>;

const FeedbackSubmitResponseSchema = z.object({
	feedback_id: z.string(),
	request_id: z.string(),
	message: z.string().optional(),
	feedback_timestamp: z.string(),
});
export type FeedbackSubmitResponse = z.infer<
	typeof FeedbackSubmitResponseSchema
>;

const FeedbackSubmitProductInputSchema = z.object({
	feedback_id: z.string(),
	name: z.string().nullable().optional(),
	email: z.string().nullable().optional(),
	company: z.string().nullable().optional(),
	how_discovered: z.string().nullable().optional(),
	usage_frequency: z.string().nullable().optional(),
	use_cases: z.array(z.string()).nullable().optional(),
	rating: z.number().int().min(1).max(5).nullable().optional(),
	liked_most: z.string().nullable().optional(),
	disliked: z.string().nullable().optional(),
	requested_features: z.string().nullable().optional(),
	setup_easy: z.boolean().nullable().optional(),
	issues: z.string().nullable().optional(),
	recommend_score: z.number().int().min(0).max(10).nullable().optional(),
	improvement_suggestions: z.string().nullable().optional(),
	can_contact: z.boolean().nullable().optional(),
	contact_method: z.string().nullable().optional(),
});
export type FeedbackSubmitProductInput = z.infer<
	typeof FeedbackSubmitProductInputSchema
>;

const FeedbackSubmitProductResponseSchema = z.object({
	message: z.string().optional(),
});
export type FeedbackSubmitProductResponse = z.infer<
	typeof FeedbackSubmitProductResponseSchema
>;

/* -------------------------------------------------------------------------- */
/* scheduledJobs — GET /v1/scheduled-jobs                                     */
/* -------------------------------------------------------------------------- */

const ScheduledJobsListInputSchema = z.object({
	page: z.number().int().min(1).optional(),
	page_size: z.number().int().min(1).max(100).optional(),
	/** Query filters — absence means "no filter"; unlike the request body
	 * fields elsewhere in this file, these can't be sent as JSON `null`. */
	service_type: ServiceTypeSchema.optional(),
	is_active: z.boolean().optional(),
});
export type ScheduledJobsListInput = z.infer<
	typeof ScheduledJobsListInputSchema
>;

const ScheduledJobResponseSchema = z.object({
	id: z.string(),
	user_id: z.string(),
	job_name: z.string(),
	service_type: ServiceTypeSchema,
	cron_expression: z.string(),
	job_config: jsonObject,
	is_active: z.boolean(),
	created_at: z.string(),
	updated_at: z.string(),
	last_run_at: z.string().nullable().optional(),
	next_run_at: z.string().nullable().optional(),
});

const ScheduledJobsListResponseSchema = z.object({
	total: z.number().int(),
	page: z.number().int(),
	page_size: z.number().int(),
	jobs: z.array(ScheduledJobResponseSchema),
});
export type ScheduledJobsListResponse = z.infer<
	typeof ScheduledJobsListResponseSchema
>;

/* -------------------------------------------------------------------------- */
/* utilities — POST /v1/toonify                                               */
/* -------------------------------------------------------------------------- */

/**
 * `POST /v1/toonify` accepts the JSON object to convert as the raw request
 * body itself (its schema is a bare, property-less `object`) — there's no
 * `data` wrapper on the wire. `data` here is a Corsair-side parameter name
 * for ergonomics; the endpoint unwraps it before sending.
 */
const UtilitiesToonifyInputSchema = z.object({
	data: jsonObject.optional(),
});
export type UtilitiesToonifyInput = z.infer<typeof UtilitiesToonifyInputSchema>;

/** `POST /v1/toonify` declares an empty `{}` response schema — shape not published; typed permissively. */
const UtilitiesToonifyResponseSchema = z.union([
	z.string(),
	z.object({}).loose(),
]);
export type UtilitiesToonifyResponse = z.infer<
	typeof UtilitiesToonifyResponseSchema
>;

/* -------------------------------------------------------------------------- */
/* endpoint maps                                                              */
/* -------------------------------------------------------------------------- */

export const ScrapegraphAiEndpointInputSchemas = {
	'searchScraper.start': SearchScraperStartInputSchema,
	'searchScraper.status': SearchScraperStatusInputSchema,
	'searchScraper.history': SearchScraperHistoryInputSchema,
	'smartScraper.start': SmartScraperStartInputSchema,
	'smartScraper.status': SmartScraperStatusInputSchema,
	'smartScraper.history': SmartScraperHistoryInputSchema,
	'markdownify.start': MarkdownifyStartInputSchema,
	'markdownify.status': MarkdownifyStatusInputSchema,
	'markdownify.history': MarkdownifyHistoryInputSchema,
	'smartCrawler.start': SmartCrawlerStartInputSchema,
	'smartCrawler.status': SmartCrawlerStatusInputSchema,
	'smartCrawler.history': SmartCrawlerHistoryInputSchema,
	'smartCrawler.webhookLogs': SmartCrawlerWebhookLogsInputSchema,
	'agenticScraper.history': AgenticScraperHistoryInputSchema,
	'agenticScraper.getLiveSessionUrl':
		AgenticScraperGetLiveSessionUrlInputSchema,
	'scrape.history': ScrapeHistoryInputSchema,
	'sitemap.history': SitemapHistoryInputSchema,
	'schema.generate': SchemaGenerateInputSchema,
	'endpoint.getSuggestions': EndpointGetSuggestionsInputSchema,
	'endpoint.save': EndpointSaveInputSchema,
	'account.credits': AccountCreditsInputSchema,
	'account.validateApiKey': AccountValidateApiKeyInputSchema,
	'account.usageTimeline': AccountUsageTimelineInputSchema,
	'feedback.submit': FeedbackSubmitInputSchema,
	'feedback.submitProduct': FeedbackSubmitProductInputSchema,
	'scheduledJobs.list': ScheduledJobsListInputSchema,
	'utilities.toonify': UtilitiesToonifyInputSchema,
} as const;

export const ScrapegraphAiEndpointOutputSchemas = {
	'searchScraper.start': SearchScraperStartResponseSchema,
	'searchScraper.status': SearchScraperStatusResponseSchema,
	'searchScraper.history': SearchScraperHistoryResponseSchema,
	'smartScraper.start': SmartScraperStartResponseSchema,
	'smartScraper.status': SmartScraperStatusResponseSchema,
	'smartScraper.history': SmartScraperHistoryResponseSchema,
	'markdownify.start': MarkdownifyStartResponseSchema,
	'markdownify.status': MarkdownifyStatusResponseSchema,
	'markdownify.history': MarkdownifyHistoryResponseSchema,
	'smartCrawler.start': CrawlResultSchema,
	'smartCrawler.status': SmartCrawlerStatusResponseSchema,
	'smartCrawler.history': SmartCrawlerHistoryResponseSchema,
	'smartCrawler.webhookLogs': SmartCrawlerWebhookLogsResponseSchema,
	'agenticScraper.history': AgenticScraperHistoryResponseSchema,
	'agenticScraper.getLiveSessionUrl':
		AgenticScraperGetLiveSessionUrlResponseSchema,
	'scrape.history': ScrapeHistoryResponseSchema,
	'sitemap.history': SitemapHistoryResponseSchema,
	'schema.generate': SchemaGenerateResponseSchema,
	'endpoint.getSuggestions': EndpointGetSuggestionsResponseSchema,
	'endpoint.save': EndpointSaveResponseSchema,
	'account.credits': AccountCreditsResponseSchema,
	'account.validateApiKey': AccountValidateApiKeyResponseSchema,
	'account.usageTimeline': AccountUsageTimelineResponseSchema,
	'feedback.submit': FeedbackSubmitResponseSchema,
	'feedback.submitProduct': FeedbackSubmitProductResponseSchema,
	'scheduledJobs.list': ScheduledJobsListResponseSchema,
	'utilities.toonify': UtilitiesToonifyResponseSchema,
} as const;

export type ScrapegraphAiEndpointInputs = {
	[K in keyof typeof ScrapegraphAiEndpointInputSchemas]: z.infer<
		(typeof ScrapegraphAiEndpointInputSchemas)[K]
	>;
};

export type ScrapegraphAiEndpointOutputs = {
	[K in keyof typeof ScrapegraphAiEndpointOutputSchemas]: z.infer<
		(typeof ScrapegraphAiEndpointOutputSchemas)[K]
	>;
};
