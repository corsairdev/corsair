import { z } from 'zod';

/** Search, Fetch and Research accept the same three result domains. */
export const TINYFISH_DOMAIN_TYPES = ['web', 'news', 'research_paper'] as const;
const DomainTypeSchema = z.enum(TINYFISH_DOMAIN_TYPES);

export const TINYFISH_RUN_STATUSES = [
	'PENDING',
	'RUNNING',
	'COMPLETED',
	'FAILED',
	'CANCELLED',
] as const;
const RunStatusSchema = z.enum(TINYFISH_RUN_STATUSES);

const TerminalRunStatusSchema = z.enum(['CANCELLED', 'COMPLETED', 'FAILED']);

export const TINYFISH_RESEARCH_RUN_STATUSES = [
	'RUNNING',
	'COMPLETED',
	'FAILED',
	'CANCELLED',
	'TIMED_OUT',
	'QUEUED',
] as const;
const ResearchRunStatusSchema = z.enum(TINYFISH_RESEARCH_RUN_STATUSES);

/** Every documented failure code, shared by REST errors and run errors. */
export const TINYFISH_ERROR_CODES = [
	'MISSING_API_KEY',
	'INVALID_API_KEY',
	'INVALID_INPUT',
	'RATE_LIMIT_EXCEEDED',
	'DAILY_LIMIT_EXCEEDED',
	'INTERNAL_ERROR',
	'RETRY_REQUIRED',
	'UNAUTHORIZED',
	'VAULT_RECONNECT_REQUIRED',
	'FORBIDDEN',
	'NOT_FOUND',
	'FEATURE_NOT_AVAILABLE',
	'SERVICE_BUSY',
	'TIMEOUT',
	'INSUFFICIENT_CREDITS',
	'FREE_ALLOWANCE_EXHAUSTED',
	'CONTENT_POLICY_VIOLATION',
	'MAX_STEPS_EXCEEDED',
	'SITE_BLOCKED',
	'TASK_FAILED',
	'CANCELLED',
] as const;

export const TINYFISH_RUN_PROXY_COUNTRY_CODES = [
	'US',
	'GB',
	'CA',
	'DE',
	'FR',
	'JP',
	'AU',
] as const;

export const TINYFISH_PROFILE_PROXY_COUNTRY_CODES = [
	'US',
	'GB',
	'CA',
	'AU',
	'DE',
	'FR',
	'IT',
	'ES',
	'NL',
	'JP',
	'SG',
	'BR',
	'IN',
] as const;
const ProfileProxyCountryCodeSchema = z
	.enum(TINYFISH_PROFILE_PROXY_COUNTRY_CODES)
	.nullable();

/** The nudge TinyFish attaches to runs that a profile could unblock. */
export const ProfileHintSchema = z.object({
	message: z.string(),
	setup_url: z.string(),
	reason: z.enum(['auth_wall', 'bot_challenge']),
});

export type ProfileHint = z.infer<typeof ProfileHintSchema>;

export const RunErrorSchema = z.object({
	code: z.string().nullable().optional(),
	message: z.string(),
	category: z.enum([
		'SYSTEM_FAILURE',
		'AGENT_FAILURE',
		'BILLING_FAILURE',
		'UNKNOWN',
	]),
	retry_after: z.number().nullable().optional(),
	help_url: z.string().nullable().optional(),
	help_message: z.string().nullable().optional(),
	profile_hint: ProfileHintSchema.nullable().optional(),
});

export type RunError = z.infer<typeof RunErrorSchema>;

/**
 * Artifact fields are omitted unless the run's `capture_config` asked for
 * them, so they are optional even though `GET /v1/runs/{id}` marks them
 * required-nullable.
 */
export const RunStepSchema = z.object({
	id: z.string(),
	timestamp: z.string(),
	status: RunStatusSchema,
	action: z.string().nullable().optional(),
	screenshot: z.string().nullable().optional(),
	html: z.string().nullable().optional(),
	duration: z.string().nullable().optional(),
});

export type RunStep = z.infer<typeof RunStepSchema>;

const BrowserConfigSchema = z.object({
	proxy_enabled: z.boolean().nullable(),
	proxy_country_code: z.string().nullable(),
});

/** A run row as returned by the list endpoint (no artifacts). */
export const RunSummarySchema = z.object({
	run_id: z.string(),
	status: RunStatusSchema,
	goal: z.string(),
	created_at: z.string(),
	started_at: z.string().nullable(),
	finished_at: z.string().nullable(),
	num_of_steps: z.number().int().min(0).nullable(),
	result: z.record(z.string(), z.unknown()).nullable(),
	output_schema: z.record(z.string(), z.unknown()).nullable(),
	profile_attached: z.boolean(),
	profile_id: z.string().nullable(),
	error: RunErrorSchema.nullable(),
	profile_hint: ProfileHintSchema.nullable().optional(),
	streaming_url: z.string().nullable(),
	browser_config: BrowserConfigSchema.nullable(),
});

export type RunSummary = z.infer<typeof RunSummarySchema>;

export const AgentRunSchema = RunSummarySchema.extend({
	video_url: z.string().nullable(),
	steps: z.array(RunStepSchema),
});

export type AgentRun = z.infer<typeof AgentRunSchema>;

const ProxyConfigSchema = z
	.object({
		enabled: z.boolean(),
		country_code: z
			.enum(TINYFISH_RUN_PROXY_COUNTRY_CODES)
			.nullable()
			.optional(),
	})
	.strict();

export const AgentConfigSchema = z
	.object({
		mode: z.enum(['default', 'strict']).optional(),
		cursor_style: z.enum(['fish', 'standard', 'green-pointer']).optional(),
		max_steps: z.number().int().min(1).max(500).optional(),
		max_duration_seconds: z.number().int().min(1).optional(),
	})
	.strict();

export const CaptureConfigSchema = z
	.object({
		elements: z.boolean().optional(),
		snapshots: z.boolean().optional(),
		screenshots: z.boolean().optional(),
		recording: z.boolean().optional(),
		html: z.boolean().optional(),
	})
	.strict();

/** The body accepted by `POST /v1/automation/run` and `run-async`. */
export const RunRequestSchema = z
	.object({
		url: z.string(),
		goal: z.string().min(1),
		browser_profile: z.enum(['lite', 'stealth']).optional(),
		api_integration: z.string().optional(),
		agent_config: AgentConfigSchema.optional(),
		capture_config: CaptureConfigSchema.optional(),
		webhook_url: z.string().optional(),
		use_vault: z.boolean().optional(),
		use_profile: z.boolean().optional(),
		profile_id: z.string().min(1).optional(),
		credential_item_ids: z.array(z.string()).min(1).optional(),
		proxy_config: ProxyConfigSchema.optional(),
		output_schema: z.record(z.string(), z.unknown()).optional(),
	})
	.strict();

/** Batch items pick their profile on the batch envelope, not per run. */
const RunBatchItemSchema = RunRequestSchema.omit({
	use_profile: true,
	profile_id: true,
}).strict();

export const SearchResultSchema = z.object({
	position: z.number().int(),
	site_name: z.string(),
	snippet: z.string(),
	title: z.string(),
	url: z.string(),
	thumbnail_url: z.string().nullable().optional(),
	/** Present only when the `fetch` request parameter was supplied. */
	fetch: z.unknown().nullable().optional(),
	fetch_error: z.unknown().nullable().optional(),
	date: z.string().nullable().optional(),
	publisher: z.string().nullable().optional(),
	/** Present for academic results when domain_type=research_paper. */
	authors: z.array(z.string()).optional(),
	venue: z.string().nullable().optional(),
	year: z.number().int().nullable().optional(),
	cited_by_count: z.number().int().nullable().optional(),
	pdf_url: z.string().nullable().optional(),
});

export type SearchResult = z.infer<typeof SearchResultSchema>;

export const SearchInputSchema = z
	.object({
		query: z.string().min(1).max(2000),
		purpose: z.string().min(1).max(2000).optional(),
		location: z.string().optional(),
		language: z.string().optional(),
		include_domains: z.string().optional(),
		exclude_domains: z.string().optional(),
		domain_type: DomainTypeSchema.optional(),
		after_date: z.string().optional(),
		before_date: z.string().optional(),
		recency_minutes: z.number().int().min(1).max(5256000).optional(),
		pub_year_min: z.number().int().min(0).max(9999).optional(),
		pub_year_max: z.number().int().min(0).max(9999).optional(),
		page: z.number().int().min(0).max(10).nullable().optional(),
		/** Wire format is the string "true"/"false", not a boolean. */
		include_thumbnail: z.enum(['true', 'false']).optional(),
		/** JSON-encoded fetch configuration object. */
		fetch: z.string().max(256).optional(),
	})
	.strict();

export type SearchInput = z.infer<typeof SearchInputSchema>;

export const SearchResponseSchema = z.object({
	query: z.string(),
	results: z.array(SearchResultSchema),
	total_results: z.number().int(),
	page: z.number().int(),
	request_id: z.string().optional(),
});

export type SearchResponse = z.infer<typeof SearchResponseSchema>;

const SearchUsageInputSchema = z
	.object({
		start_after: z.string().optional(),
		end_before: z.string().optional(),
		status: z.enum(['completed', 'failed']).optional(),
		limit: z.number().int().min(1).max(1000).optional(),
		page: z.number().int().min(1).optional(),
	})
	.strict();

export type SearchUsageInput = z.infer<typeof SearchUsageInputSchema>;

export const SearchUsageItemSchema = z.object({
	id: z.number().int(),
	request_id: z.string(),
	query: z.string(),
	status_code: z.number().int(),
	result_count: z.number().int(),
	results: z.array(SearchResultSchema).nullable(),
	cached: z.boolean().nullable(),
	response_size_bytes: z.number().int().nullable(),
	created_at: z.string(),
});

export const SearchUsageResponseSchema = z.object({
	items: z.array(SearchUsageItemSchema),
	total: z.number().int(),
	limit: z.number().int(),
	page: z.number().int(),
	total_pages: z.number().int(),
	has_more: z.boolean(),
});

export type SearchUsageResponse = z.infer<typeof SearchUsageResponseSchema>;

export const FetchInputSchema = z
	.object({
		urls: z.array(z.string()).min(1).max(10),
		purpose: z.string().min(1).max(2000).optional(),
		format: z.enum(['markdown', 'html', 'json']).optional(),
		links: z.boolean().optional(),
		image_links: z.boolean().optional(),
		iframe_links: z.boolean().optional(),
		page_metadata: z.boolean().optional(),
		ttl: z.number().int().min(0).optional(),
		per_url_timeout_ms: z.number().int().min(1).max(110000).optional(),
		if_none_match: z.string().min(1).optional(),
		if_modified_since: z.string().min(1).optional(),
		include_etag_and_last_modified: z.boolean().optional(),
		include_selectors: z.array(z.string()).min(1).max(20).optional(),
		exclude_selectors: z.array(z.string()).min(1).max(20).optional(),
	})
	.strict();

export type FetchInput = z.infer<typeof FetchInputSchema>;

export const FetchResultSchema = z.object({
	url: z.string(),
	final_url: z.string().nullable(),
	title: z.string().nullable(),
	description: z.string().nullable(),
	language: z.string().nullable(),
	format: z.enum(['markdown', 'html', 'json']),
	/** String for markdown/html, object for json. Null if extraction failed. */
	text: z.union([z.string(), z.record(z.string(), z.unknown())]).nullable(),
	author: z.string().nullable(),
	published_date: z.string().nullable(),
	links: z.array(z.string()).optional(),
	image_links: z.array(z.string()).optional(),
	iframe_links: z.array(z.string()).optional(),
	page_metadata: z.record(z.string(), z.unknown()).optional(),
	latency_ms: z.number().nullable(),
	not_modified: z.boolean().optional(),
	etag: z.string().optional(),
	last_modified: z.string().optional(),
	unmatched_selectors: z.array(z.string()).optional(),
});

export type FetchResult = z.infer<typeof FetchResultSchema>;

export const FetchErrorSchema = z.object({
	url: z.string(),
	error: z.string(),
	status: z.number().int().optional(),
	unmatched_selectors: z.array(z.string()).optional(),
	candidate_selectors: z.array(z.string()).optional(),
});

export const FetchResponseSchema = z.object({
	results: z.array(FetchResultSchema),
	errors: z.array(FetchErrorSchema),
	request_id: z.string().optional(),
});

export type FetchResponse = z.infer<typeof FetchResponseSchema>;

const FetchUsageInputSchema = z
	.object({
		start_after: z.string().optional(),
		end_before: z.string().optional(),
		status: z.enum(['completed', 'failed']).optional(),
		limit: z.number().int().min(1).max(1000).optional(),
		page: z.number().int().min(1).optional(),
	})
	.strict();

export type FetchUsageInput = z.infer<typeof FetchUsageInputSchema>;

export const FetchUsageItemSchema = z.object({
	id: z.string(),
	url: z.string(),
	final_url: z.string(),
	title: z.string().nullable(),
	description: z.string().nullable(),
	language: z.string().nullable(),
	author: z.string().nullable(),
	published_date: z.string().nullable(),
	format: z.enum(['markdown', 'html', 'json']),
	status: z.enum(['completed', 'failed']),
	request_origin: z.string(),
	request_id: z.string().nullable(),
	text_length: z.number().int().nullable(),
	links_count: z.number().int(),
	image_links_count: z.number().int(),
	latency_ms: z.number().nullable(),
	not_modified: z.boolean().optional(),
	etag: z.string().optional(),
	last_modified: z.string().optional(),
	created_at: z.string(),
	error: z.string().nullable(),
});

export const FetchUsageResponseSchema = z.object({
	items: z.array(FetchUsageItemSchema),
	total: z.number().int(),
	limit: z.number().int(),
	page: z.number().int(),
	total_pages: z.number().int(),
	has_more: z.boolean(),
});

export type FetchUsageResponse = z.infer<typeof FetchUsageResponseSchema>;

const BrowserProxyConfigSchema = z
	.object({
		enabled: z.boolean().optional(),
		type: z.enum(['tinyfish', 'custom']).optional(),
		country_code: z.string().optional(),
		url: z.string().optional(),
		username: z.string().optional(),
		password: z.string().optional(),
	})
	.strict();

export const CreateBrowserSessionInputSchema = z
	.object({
		url: z.string().optional(),
		timeout_seconds: z.number().int().min(5).max(86400).nullable().optional(),
		proxy_config: BrowserProxyConfigSchema.optional(),
	})
	.strict();

export type CreateBrowserSessionInput = z.infer<
	typeof CreateBrowserSessionInputSchema
>;

export const BrowserSessionSchema = z.object({
	session_id: z.string().min(1),
	cdp_url: z.string(),
	base_url: z.string(),
});

export type BrowserSession = z.infer<typeof BrowserSessionSchema>;

export const TerminateBrowserSessionInputSchema = z
	.object({
		sessionId: z.string().min(1),
	})
	.strict();

export type TerminateBrowserSessionInput = z.infer<
	typeof TerminateBrowserSessionInputSchema
>;

/** Local confirmation of the 204; the provider returns no body. */
export const TerminateBrowserSessionResponseSchema = z.object({
	terminated: z.literal(true),
	session_id: z.string().min(1),
});

export type TerminateBrowserSessionResponse = z.infer<
	typeof TerminateBrowserSessionResponseSchema
>;

export const BrowserUsageInputSchema = z
	.object({
		session_id: z.string().optional(),
		start_after: z.string().optional(),
		end_before: z.string().optional(),
		status: z.enum(['running', 'ended']).optional(),
		limit: z.number().int().min(1).max(1000).optional(),
		page: z.number().int().min(1).optional(),
	})
	.strict();

export type BrowserUsageInput = z.infer<typeof BrowserUsageInputSchema>;

export const BrowserUsageItemSchema = z.object({
	session_id: z.string(),
	user_id: z.string(),
	sub_user_id: z.string().nullable(),
	mode: z.enum(['light', 'stealth', 'tf-browser']),
	start_time: z.string(),
	end_time: z.string().nullable(),
	duration_ms: z.number().int().nullable(),
	proxy_trg_rx_bytes: z.number().int().nullable(),
	proxy_trg_tx_bytes: z.number().int().nullable(),
	status: z.enum(['running', 'ended', 'created']),
	created_at: z.string(),
	updated_at: z.string(),
});

export const BrowserUsageResponseSchema = z.object({
	items: z.array(BrowserUsageItemSchema),
	total: z.number().int(),
	limit: z.number().int(),
	page: z.number().int(),
	total_pages: z.number().int(),
	has_more: z.boolean(),
});

export type BrowserUsageResponse = z.infer<typeof BrowserUsageResponseSchema>;

export const RunInputSchema = RunRequestSchema;

export type RunInput = z.infer<typeof RunInputSchema>;

export const RunAsyncInputSchema = RunRequestSchema;

export type RunAsyncInput = z.infer<typeof RunAsyncInputSchema>;

export const RunBatchInputSchema = z
	.object({
		runs: z.array(RunBatchItemSchema).min(1).max(100),
		profile_id: z.string().min(1).optional(),
		output_schema: z.record(z.string(), z.unknown()).optional(),
	})
	.strict();

export type RunBatchInput = z.infer<typeof RunBatchInputSchema>;

/** A sync run only returns once terminal. */
export const RunResponseSchema = z.object({
	run_id: z.string().nullable(),
	status: z.enum(['COMPLETED', 'FAILED']),
	started_at: z.string().nullable(),
	finished_at: z.string().nullable(),
	num_of_steps: z.number().nullable(),
	result: z.record(z.string(), z.unknown()).nullable(),
	error: RunErrorSchema.nullable(),
	profile_hint: ProfileHintSchema.nullable().optional(),
});

export type RunResponse = z.infer<typeof RunResponseSchema>;

export const RunAsyncResponseSchema = z.object({
	run_id: z.string().nullable(),
	error: z.object({ code: z.string(), message: z.string() }).nullable(),
});

export type RunAsyncResponse = z.infer<typeof RunAsyncResponseSchema>;

export const RunBatchResponseSchema = z.object({
	run_ids: z.array(z.string()).nullable(),
	error: z
		.object({
			code: z.string(),
			message: z.string(),
			details: z.unknown().nullable().optional(),
		})
		.nullable(),
});

export type RunBatchResponse = z.infer<typeof RunBatchResponseSchema>;

const PaginationSchema = z.object({
	total: z.number().int(),
	next_cursor: z.string().nullable(),
	has_more: z.boolean(),
});

export const ListRunsInputSchema = z
	.object({
		status: RunStatusSchema.optional(),
		goal: z.string().max(500).optional(),
		created_after: z.string().optional(),
		created_before: z.string().optional(),
		sort_direction: z.enum(['asc', 'desc']).optional(),
		cursor: z.string().optional(),
		limit: z.number().int().min(1).max(100).optional(),
	})
	.strict();

export type ListRunsInput = z.infer<typeof ListRunsInputSchema>;

export const ListRunsResponseSchema = z.object({
	data: z.array(RunSummarySchema),
	pagination: PaginationSchema,
});

export type ListRunsResponse = z.infer<typeof ListRunsResponseSchema>;

export const GetRunInputSchema = z
	.object({
		runId: z.string().min(1),
		screenshots: z.enum(['base64', 'url', 'none']).optional(),
		html: z.enum(['url', 'none']).optional(),
	})
	.strict();

export type GetRunInput = z.infer<typeof GetRunInputSchema>;

export const GetRunsInputSchema = z
	.object({
		run_ids: z.array(z.string()).min(1).max(100),
	})
	.strict();

export type GetRunsInput = z.infer<typeof GetRunsInputSchema>;

export const GetRunsResponseSchema = z.object({
	data: z.array(AgentRunSchema),
	not_found: z.array(z.string()).nullable(),
});

export type GetRunsResponse = z.infer<typeof GetRunsResponseSchema>;

export const CancelRunInputSchema = z
	.object({
		runId: z.string().min(1),
	})
	.strict();

export type CancelRunInput = z.infer<typeof CancelRunInputSchema>;

export const CancelRunResponseSchema = z.object({
	run_id: z.string(),
	status: TerminalRunStatusSchema,
	cancelled_at: z.string().nullable(),
	message: z.string().nullable(),
});

export type CancelRunResponse = z.infer<typeof CancelRunResponseSchema>;

export const CancelRunsInputSchema = z
	.object({
		run_ids: z.array(z.string()).min(1).max(100),
	})
	.strict();

export type CancelRunsInput = z.infer<typeof CancelRunsInputSchema>;

export const CancelRunsResponseSchema = z.object({
	results: z.array(CancelRunResponseSchema),
	not_found: z.array(z.string()).nullable(),
});

export type CancelRunsResponse = z.infer<typeof CancelRunsResponseSchema>;

/**
 * Step artifacts answer as raw bytes/HTML, so these schemas describe the
 * envelope the plugin builds around them; the body itself is never parsed.
 */
export const GetStepScreenshotInputSchema = z
	.object({
		runId: z.string().min(1),
		stepId: z.string().min(1),
	})
	.strict();

export type GetStepScreenshotInput = z.infer<
	typeof GetStepScreenshotInputSchema
>;

export const GetStepScreenshotResponseSchema = z.object({
	contentType: z.string().min(1),
	base64: z.string().min(1),
	sizeBytes: z.number().int().min(1),
});

export type GetStepScreenshotResponse = z.infer<
	typeof GetStepScreenshotResponseSchema
>;

export const GetStepHtmlInputSchema = z
	.object({
		runId: z.string().min(1),
		stepId: z.string().min(1),
	})
	.strict();

export type GetStepHtmlInput = z.infer<typeof GetStepHtmlInputSchema>;

export const GetStepHtmlResponseSchema = z.object({
	contentType: z.string().min(1),
	html: z.string(),
});

export type GetStepHtmlResponse = z.infer<typeof GetStepHtmlResponseSchema>;

const ResearchDomainFilterSchema = z
	.object({
		mode: z.enum(['include', 'exclusive']),
		domains: z.array(z.string()).max(150).optional(),
		block: z.array(z.string()).max(150).optional(),
	})
	.strict();

export const StartResearchInputSchema = z
	.object({
		query: z.string().min(1).max(2000),
		// The live API only accepts deep|max; older values were removed.
		mode: z.enum(['deep', 'max']).optional(),
		stream: z.boolean().optional(),
		output_language: z.string().optional(),
		weak_sources_enabled: z.boolean().optional(),
		domain_type: DomainTypeSchema.optional(),
		after_date: z.string().optional(),
		before_date: z.string().optional(),
		recency_minutes: z.number().int().min(1).max(5256000).optional(),
		domain_filter: ResearchDomainFilterSchema.optional(),
		prior_run_id: z.string().optional(),
		session_id: z.string().optional(),
	})
	.strict();

export type StartResearchInput = z.infer<typeof StartResearchInputSchema>;

export const StartResearchResponseSchema = z.object({
	research_run_id: z.string(),
	/** Null when the run was accepted. */
	error: z.object({ code: z.string(), message: z.string() }).nullable(),
});

export type StartResearchResponse = z.infer<typeof StartResearchResponseSchema>;

const ResearchActionSchema = z.object({
	id: z.string(),
	label: z.string(),
	status: z.enum(['running', 'done', 'error']),
	streamingUrl: z.string().optional(),
	kind: z.enum(['plan', 'search', 'fetch', 'browse', 'map']).optional(),
	iteration: z.number().int().min(0).optional(),
	url: z.string().optional(),
	query: z.string().optional(),
	details: z.array(z.string()).optional(),
});

const ResearchStatsSchema = z.object({
	iterations: z.number(),
	sources_searched: z.number(),
	sources_fetched: z.number(),
	agent_runs: z.number(),
	claims_extracted: z.number(),
	termination_reason: z.enum([
		'planner_done',
		'planner_no_queries',
		'max_iterations',
		'deadline',
		'synthesis_failed',
		'abort',
	]),
	subquestions_covered: z.number(),
	subquestions_total: z.number(),
});

const ResearchQuickResultSchema = z.object({
	answer: z.string(),
	citations: z.array(z.string()),
	actions: z.array(ResearchActionSchema).optional(),
	stats: ResearchStatsSchema.optional(),
});

const ResearchFreshnessReportSchema = z.object({
	filter_applied: z
		.object({
			domain_type: DomainTypeSchema.optional(),
			after_date: z.string().optional(),
			before_date: z.string().optional(),
			recency_minutes: z.number().int().min(1).max(5256000).optional(),
		})
		.optional(),
	latest_published_date: z.string().optional(),
	sources_with_dates: z.number().int().min(0),
	sources_without_dates: z.number().int().min(0),
	sources_in_requested_window: z.number().int().min(0),
	fetched_at_latest: z.string().optional(),
});

const ResearchDeepResultSchema = z.object({
	result: z.string(),
	citations: z.array(z.string()),
	freshness_report: ResearchFreshnessReportSchema.optional(),
	termination_reason: z
		.enum([
			'planner_done',
			'planner_no_queries',
			'max_iterations',
			'deadline',
			'synthesis_failed',
			'abort',
		])
		.optional(),
});

const ResearchPlanSchema = z.object({
	summary: z.string(),
	subquestions: z.array(
		z.object({
			id: z.string(),
			question: z.string(),
			priority: z.enum(['high', 'medium', 'low']),
		}),
	),
	search_queries: z.array(z.string()),
	done: z.boolean(),
	review: z
		.object({
			id: z.string(),
			status: z.enum(['pending', 'approve', 'refine', 'timeout']),
			expiresAt: z.number().int().min(0),
			feedback: z.string().optional(),
			resolvedAt: z.number().int().min(0).optional(),
		})
		.optional(),
});

const ResearchEvidenceSchema = z.object({
	url: z.string(),
	title: z.string(),
	language: z.string().nullable().optional(),
	published_date: z.string().nullable().optional(),
	fetched_at: z.string().optional(),
	live_fetch: z.boolean().optional(),
	access_method: z.enum(['fetch', 'browser', 'social']).optional(),
	discovered_by_queries: z.array(z.string()).optional(),
	search_filters: z
		.object({
			after_date: z.string().optional(),
			before_date: z.string().optional(),
			recency_minutes: z.number().optional(),
		})
		.optional(),
	subquestions_covered: z.array(z.string()),
	claims: z.array(
		z.object({
			claim: z.string(),
			snippet: z.string(),
			subquestion_id: z.string(),
			confidence: z.enum(['high', 'medium', 'low']),
			claim_type: z
				.enum([
					'fact',
					'official_statement',
					'reported_claim',
					'estimate',
					'opinion',
					'user_sentiment',
					'unverified',
				])
				.optional(),
		}),
	),
	source_quality: z.enum(['primary', 'secondary', 'low']),
});

export const ResearchRunSchema = z.object({
	research_run_id: z.string(),
	status: ResearchRunStatusSchema,
	query: z.string(),
	quick_result: ResearchQuickResultSchema.nullable(),
	quick_result_summary: z.string().nullable(),
	deep_result: ResearchDeepResultSchema.nullable(),
	run_ids: z.array(z.string()),
	created_at: z.string().nullable(),
	completed_at: z.string().nullable(),
	error: z
		.object({
			code: z.enum(TINYFISH_ERROR_CODES),
			message: z.string(),
			details: z.unknown().nullable().optional(),
		})
		.nullable(),
	research_plan: ResearchPlanSchema.nullable().optional(),
	evidence: z.array(ResearchEvidenceSchema).nullable().optional(),
	iterations: z.number().int().min(0).nullable().optional(),
});

export type ResearchRun = z.infer<typeof ResearchRunSchema>;

export const ListResearchRunsInputSchema = z
	.object({
		status: ResearchRunStatusSchema.optional(),
		query: z.string().max(500).optional(),
		created_after: z.string().optional(),
		created_before: z.string().optional(),
		sort_direction: z.enum(['asc', 'desc']).optional(),
		cursor: z.string().optional(),
		limit: z.number().int().min(1).max(100).optional(),
	})
	.strict();

export type ListResearchRunsInput = z.infer<typeof ListResearchRunsInputSchema>;

export const ListResearchRunsResponseSchema = z.object({
	data: z.array(ResearchRunSchema),
	pagination: z.object({
		total: z.number().int(),
		next_cursor: z.string().nullable(),
		has_more: z.boolean(),
	}),
});

export type ListResearchRunsResponse = z.infer<
	typeof ListResearchRunsResponseSchema
>;

export const GetResearchRunInputSchema = z
	.object({
		researchRunId: z.string().min(1),
	})
	.strict();

export type GetResearchRunInput = z.infer<typeof GetResearchRunInputSchema>;

export const CancelResearchRunInputSchema = z
	.object({
		researchRunId: z.string().min(1),
	})
	.strict();

export type CancelResearchRunInput = z.infer<
	typeof CancelResearchRunInputSchema
>;

export const CancelResearchRunResponseSchema = z.object({
	research_run_id: z.string(),
	status: ResearchRunStatusSchema,
	cancelled: z.boolean(),
});

export type CancelResearchRunResponse = z.infer<
	typeof CancelResearchRunResponseSchema
>;

const ProfileBaseSchema = z.object({
	id: z.string().min(1),
	name: z.string(),
	proxy_country_code: ProfileProxyCountryCodeSchema.optional(),
	is_default: z.boolean().optional(),
	fingerprint_seed: z.string().optional(),
	domain_count: z.number().int().min(0).optional(),
	created_at: z.string(),
	updated_at: z.string().optional(),
});

const ProfileDomainSchema = z.object({
	domain: z.string(),
	cookie_count: z.number().int().min(0),
	local_storage_origin_count: z.number().int().min(0),
	last_accessed_at: z.string(),
	last_written_at: z.string(),
	last_written_by_run_id: z.string(),
});

const SignedInSiteSchema = z.object({
	site: z.string(),
	claimed_at: z.string(),
});

export const ListProfilesInputSchema = z.object({}).strict();

export type ListProfilesInput = z.infer<typeof ListProfilesInputSchema>;

export const ListProfilesResponseSchema = z.object({
	profiles: z.array(
		ProfileBaseSchema.extend({
			signed_in_sites: z.array(SignedInSiteSchema).optional(),
		}),
	),
});

export type ListProfilesResponse = z.infer<typeof ListProfilesResponseSchema>;

export const CreateProfileInputSchema = z
	.object({
		name: z.string().min(1).max(100),
		set_as_default: z.boolean().optional(),
		proxy_country_code: ProfileProxyCountryCodeSchema.optional(),
	})
	.strict();

export type CreateProfileInput = z.infer<typeof CreateProfileInputSchema>;

export const CreateProfileResponseSchema = ProfileBaseSchema;

export type CreateProfileResponse = z.infer<typeof CreateProfileResponseSchema>;

export const GetProfileInputSchema = z
	.object({
		profileId: z.string().min(1),
	})
	.strict();

export type GetProfileInput = z.infer<typeof GetProfileInputSchema>;

export const ProfileSchema = ProfileBaseSchema.extend({
	domains: z.array(ProfileDomainSchema),
});

export type Profile = z.infer<typeof ProfileSchema>;

export const UpdateProfileInputSchema = z
	.object({
		profileId: z.string().min(1),
		name: z.string().min(1).max(100).optional(),
		set_as_default: z.boolean().optional(),
		proxy_country_code: ProfileProxyCountryCodeSchema.optional(),
	})
	.strict();

export type UpdateProfileInput = z.infer<typeof UpdateProfileInputSchema>;

export const DeleteProfileInputSchema = z
	.object({
		profileId: z.string().min(1),
	})
	.strict();

export type DeleteProfileInput = z.infer<typeof DeleteProfileInputSchema>;

export const DeleteProfileResponseSchema = z.object({
	deleted: z.boolean(),
});

export type DeleteProfileResponse = z.infer<typeof DeleteProfileResponseSchema>;

export const GetWalletInputSchema = z.object({}).strict();

export type GetWalletInput = z.infer<typeof GetWalletInputSchema>;

export const WalletSchema = z.object({
	available_balance: z.string(),
	currency: z.literal('USD'),
	as_of: z.string(),
	/** Union of several auto-reload states; shape varies while unconfigured. */
	auto_reload: z.unknown().nullable(),
	pending_top_up: z
		.object({
			amount: z.string(),
			started_at: z.string(),
		})
		.nullable(),
	rates: z
		.object({
			meters: z.array(
				z.object({
					label: z.string(),
					unit_amount: z.string(),
					currency: z.literal('USD'),
					per: z.string(),
				}),
			),
			as_of: z.string(),
		})
		.nullable(),
	agent_top_up_url: z.string().optional(),
});

export type Wallet = z.infer<typeof WalletSchema>;

export const ListVaultItemsInputSchema = z.object({}).strict();

export type ListVaultItemsInput = z.infer<typeof ListVaultItemsInputSchema>;

/** Display-safe metadata; secrets are never returned, only the IDs to send
 * back as `credential_item_ids` on a run body. */
export const VaultItemSchema = z.object({
	itemId: z.string(),
	connectionId: z.string().nullable(),
	label: z.string(),
	vaultName: z.string(),
	domains: z.array(z.string()),
	fieldMetadata: z.array(
		z.object({
			fieldId: z.string(),
			label: z.string(),
			type: z.enum(['STRING', 'CONCEALED', 'OTP']),
		}),
	),
	hasTotp: z.boolean(),
});

export type VaultItem = z.infer<typeof VaultItemSchema>;

export const ListVaultItemsResponseSchema = z.object({
	items: z.array(VaultItemSchema),
});

export type ListVaultItemsResponse = z.infer<
	typeof ListVaultItemsResponseSchema
>;

export type TinyFishEndpointInputs = {
	search: SearchInput;
	searchUsage: SearchUsageInput;
	fetch: FetchInput;
	fetchUsage: FetchUsageInput;
	createBrowserSession: CreateBrowserSessionInput;
	terminateBrowserSession: TerminateBrowserSessionInput;
	browserUsage: BrowserUsageInput;
	run: RunInput;
	runAsync: RunAsyncInput;
	runBatch: RunBatchInput;
	listRuns: ListRunsInput;
	getRun: GetRunInput;
	getRuns: GetRunsInput;
	cancelRun: CancelRunInput;
	cancelRuns: CancelRunsInput;
	getStepScreenshot: GetStepScreenshotInput;
	getStepHtml: GetStepHtmlInput;
	startResearch: StartResearchInput;
	listResearchRuns: ListResearchRunsInput;
	getResearchRun: GetResearchRunInput;
	cancelResearchRun: CancelResearchRunInput;
	listProfiles: ListProfilesInput;
	createProfile: CreateProfileInput;
	getProfile: GetProfileInput;
	updateProfile: UpdateProfileInput;
	deleteProfile: DeleteProfileInput;
	getWallet: GetWalletInput;
	listVaultItems: ListVaultItemsInput;
};

export type TinyFishEndpointOutputs = {
	search: SearchResponse;
	searchUsage: SearchUsageResponse;
	fetch: FetchResponse;
	fetchUsage: FetchUsageResponse;
	createBrowserSession: BrowserSession;
	terminateBrowserSession: TerminateBrowserSessionResponse;
	browserUsage: BrowserUsageResponse;
	run: RunResponse;
	runAsync: RunAsyncResponse;
	runBatch: RunBatchResponse;
	listRuns: ListRunsResponse;
	getRun: AgentRun;
	getRuns: GetRunsResponse;
	cancelRun: CancelRunResponse;
	cancelRuns: CancelRunsResponse;
	getStepScreenshot: GetStepScreenshotResponse;
	getStepHtml: GetStepHtmlResponse;
	startResearch: StartResearchResponse;
	listResearchRuns: ListResearchRunsResponse;
	getResearchRun: ResearchRun;
	cancelResearchRun: CancelResearchRunResponse;
	listProfiles: ListProfilesResponse;
	createProfile: CreateProfileResponse;
	getProfile: Profile;
	updateProfile: Profile;
	deleteProfile: DeleteProfileResponse;
	getWallet: Wallet;
	listVaultItems: ListVaultItemsResponse;
};

export const TinyFishEndpointInputSchemas = {
	search: SearchInputSchema,
	searchUsage: SearchUsageInputSchema,
	fetch: FetchInputSchema,
	fetchUsage: FetchUsageInputSchema,
	createBrowserSession: CreateBrowserSessionInputSchema,
	terminateBrowserSession: TerminateBrowserSessionInputSchema,
	browserUsage: BrowserUsageInputSchema,
	run: RunInputSchema,
	runAsync: RunAsyncInputSchema,
	runBatch: RunBatchInputSchema,
	listRuns: ListRunsInputSchema,
	getRun: GetRunInputSchema,
	getRuns: GetRunsInputSchema,
	cancelRun: CancelRunInputSchema,
	cancelRuns: CancelRunsInputSchema,
	getStepScreenshot: GetStepScreenshotInputSchema,
	getStepHtml: GetStepHtmlInputSchema,
	startResearch: StartResearchInputSchema,
	listResearchRuns: ListResearchRunsInputSchema,
	getResearchRun: GetResearchRunInputSchema,
	cancelResearchRun: CancelResearchRunInputSchema,
	listProfiles: ListProfilesInputSchema,
	createProfile: CreateProfileInputSchema,
	getProfile: GetProfileInputSchema,
	updateProfile: UpdateProfileInputSchema,
	deleteProfile: DeleteProfileInputSchema,
	getWallet: GetWalletInputSchema,
	listVaultItems: ListVaultItemsInputSchema,
} as const;

export const TinyFishEndpointOutputSchemas = {
	search: SearchResponseSchema,
	searchUsage: SearchUsageResponseSchema,
	fetch: FetchResponseSchema,
	fetchUsage: FetchUsageResponseSchema,
	createBrowserSession: BrowserSessionSchema,
	terminateBrowserSession: TerminateBrowserSessionResponseSchema,
	browserUsage: BrowserUsageResponseSchema,
	run: RunResponseSchema,
	runAsync: RunAsyncResponseSchema,
	runBatch: RunBatchResponseSchema,
	listRuns: ListRunsResponseSchema,
	getRun: AgentRunSchema,
	getRuns: GetRunsResponseSchema,
	cancelRun: CancelRunResponseSchema,
	cancelRuns: CancelRunsResponseSchema,
	getStepScreenshot: GetStepScreenshotResponseSchema,
	getStepHtml: GetStepHtmlResponseSchema,
	startResearch: StartResearchResponseSchema,
	listResearchRuns: ListResearchRunsResponseSchema,
	getResearchRun: ResearchRunSchema,
	cancelResearchRun: CancelResearchRunResponseSchema,
	listProfiles: ListProfilesResponseSchema,
	createProfile: CreateProfileResponseSchema,
	getProfile: ProfileSchema,
	updateProfile: ProfileSchema,
	deleteProfile: DeleteProfileResponseSchema,
	getWallet: WalletSchema,
	listVaultItems: ListVaultItemsResponseSchema,
} as const;
