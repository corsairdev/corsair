import { z } from 'zod';

const isoDateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

// Keywords Explorer takes a two-letter country code, or `all` for every
// location.
const countryOrAll = z.union([z.string().length(2), z.literal('all')]);

// Nested values inside Ahrefs rows (per-platform post metrics, intent flags,
// lists of linked objects) change with `select` and the data source, and the
// API spec gives them no fixed shape, so they stay open records and lists.
const AhrefsOpenObject = z.record(z.string(), z.unknown());
const AhrefsOpenList = z.array(z.unknown());

// Ahrefs filter expressions are nested and/or/not trees over fields that
// differ per endpoint; the API validates them, so the body keeps them open.
const AhrefsFilterExpression = z.record(z.string(), z.unknown());

export const AHREFS_PROTOCOLS = ['both', 'http', 'https'] as const;
export const AHREFS_TARGET_MODES = [
	'exact',
	'prefix',
	'domain',
	'subdomains',
] as const;
export const AHREFS_OUTPUT_FORMATS = ['json'] as const;
export const AHREFS_TARGET_POSITIONS = ['in_top10', 'in_top100'] as const;
export const AHREFS_VOLUME_MODES = ['monthly', 'average'] as const;
export const AHREFS_TRAFFIC_MODES = ['static', 'adaptive'] as const;
export const AHREFS_RANK_TRACKER_DEVICES = ['desktop', 'mobile'] as const;

const BaseSiteExplorerInputSchema = z.object({
	protocol: z.enum(AHREFS_PROTOCOLS).default('both').optional(),
	target: z.string().min(1),
	date: isoDateString,
	output: z.enum(AHREFS_OUTPUT_FORMATS).default('json').optional(),
});

export const DomainRatingInputSchema = BaseSiteExplorerInputSchema;

export const DomainRatingResponseSchema = z.object({
	domain_rating: z.object({
		ahrefs_rank: z.number().int().nullable(),
		domain_rating: z.number().nullable(),
	}),
});

/** Ahrefs portfolio; when set it takes precedence over `target`. */
const portfolioId = z.number().int().positive().optional();

export const BacklinksStatsInputSchema = BaseSiteExplorerInputSchema.extend({
	mode: z.enum(AHREFS_TARGET_MODES).default('subdomains').optional(),
	portfolio_id: portfolioId,
});

export const BacklinksStatsResponseSchema = z.object({
	metrics: z.object({
		all_time: z.number().int().nullable(),
		all_time_refdomains: z.number().int().nullable(),
		live: z.number().int().nullable(),
		live_refdomains: z.number().int().nullable(),
	}),
});

const SiteExplorerTableInputSchema = BaseSiteExplorerInputSchema.extend({
	timeout: z.number().int().nonnegative().optional(),
	portfolio_id: portfolioId,
	limit: z.number().int().positive().default(1000).optional(),
	order_by: z.string().optional(),
	where: z.string().optional(),
	select: z.string().min(1),
	mode: z.enum(AHREFS_TARGET_MODES).default('subdomains').optional(),
});

export const OrganicKeywordsInputSchema = SiteExplorerTableInputSchema.extend({
	country: z.string().length(2),
	date_compared: isoDateString.optional(),
	volume_mode: z.enum(AHREFS_VOLUME_MODES).default('monthly').optional(),
	traffic_mode: z.enum(AHREFS_TRAFFIC_MODES).optional(),
});

export const RefdomainsInputSchema = SiteExplorerTableInputSchema.extend({
	history: z.string().default('all_time').optional(),
});

export const TopPagesInputSchema = SiteExplorerTableInputSchema.extend({
	country: z.string().length(2),
	date_compared: isoDateString.optional(),
	volume_mode: z.enum(AHREFS_VOLUME_MODES).default('monthly').optional(),
	traffic_mode: z.enum(AHREFS_TRAFFIC_MODES).optional(),
});

export const KeywordsOverviewInputSchema = z
	.object({
		timeout: z.number().int().nonnegative().optional(),
		limit: z.number().int().positive().default(1000).optional(),
		order_by: z.string().optional(),
		where: z.string().optional(),
		select: z.string().min(1),
		volume_monthly_date_to: isoDateString.optional(),
		volume_monthly_date_from: isoDateString.optional(),
		/** Scope of `target`. */
		mode: z.enum(AHREFS_TARGET_MODES).optional(),
		/** Older name for `mode`, still accepted; sent to Ahrefs as `mode`. */
		target_mode: z.enum(AHREFS_TARGET_MODES).optional(),
		target: z.string().min(1).optional(),
		target_position: z.enum(AHREFS_TARGET_POSITIONS).optional(),
		country: countryOrAll,
		keywords: z
			.union([z.string().min(1), z.array(z.string().min(1)).min(1)])
			.optional(),
		keyword_list_id: z.number().int().positive().optional(),
		output: z.enum(AHREFS_OUTPUT_FORMATS).default('json').optional(),
	})
	.refine((value) => value.keywords || value.keyword_list_id || value.target, {
		message: 'Provide keywords, keyword_list_id, or target',
	});

const AhrefsIntentsSchema = z
	.object({
		informational: z.boolean().optional(),
		navigational: z.boolean().optional(),
		commercial: z.boolean().optional(),
		transactional: z.boolean().optional(),
		branded: z.boolean().optional(),
		local: z.boolean().optional(),
	})
	.loose();

// Using z.unknown() because Ahrefs returns monthly volume history as an
// arbitrary key->value map whose value structure varies by select fields,
// making a stricter type infeasible without tight coupling to API internals.
const VolumeMonthlyHistorySchema = z.record(z.string(), z.unknown());

export const KeywordOverviewSchema = z
	.object({
		clicks: z.number().int().nullable().optional(),
		cpc: z.number().nullable().optional(),
		cps: z.number().nullable().optional(),
		difficulty: z.number().int().nullable().optional(),
		first_seen: z.string().nullable().optional(),
		global_volume: z.number().int().nullable().optional(),
		intents: AhrefsIntentsSchema.nullable().optional(),
		keyword: z.string().nullable().optional(),
		parent_topic: z.string().nullable().optional(),
		parent_volume: z.number().int().nullable().optional(),
		searches_pct_clicks_organic_and_paid: z.number().nullable().optional(),
		searches_pct_clicks_organic_only: z.number().nullable().optional(),
		searches_pct_clicks_paid_only: z.number().nullable().optional(),
		serp_features: z.array(z.string()).optional(),
		serp_last_update: z.string().nullable().optional(),
		traffic_potential: z.number().int().nullable().optional(),
		volume: z.number().int().nullable().optional(),
		volume_desktop_pct: z.number().nullable().optional(),
		volume_mobile_pct: z.number().nullable().optional(),
		volume_monthly: z.number().int().nullable().optional(),
		volume_monthly_history: z.array(VolumeMonthlyHistorySchema).optional(),
	})
	.loose();

export const KeywordsOverviewResponseSchema = z.object({
	keywords: z.array(KeywordOverviewSchema),
});

export const OrganicKeywordSchema = z
	.object({
		keyword: z.string().nullable().optional(),
		keyword_country: z.string().optional(),
		best_position: z.number().int().nullable().optional(),
		best_position_url: z.string().nullable().optional(),
		keyword_difficulty: z.number().int().nullable().optional(),
		volume: z.number().int().nullable().optional(),
		cpc: z.number().int().nullable().optional(),
		sum_traffic: z.number().int().nullable().optional(),
		serp_features: z.array(z.string()).optional(),
		last_update: z.string().nullable().optional(),
		status: z.string().optional(),
	})
	.loose();

export const OrganicKeywordsResponseSchema = z.object({
	keywords: z.array(OrganicKeywordSchema),
});

export const RefdomainSchema = z
	.object({
		domain: z.string().nullable().optional(),
		domain_rating: z.number().nullable().optional(),
		dofollow_links: z.number().int().nullable().optional(),
		dofollow_refdomains: z.number().int().nullable().optional(),
		links: z.number().int().nullable().optional(),
		refdomains: z.number().int().nullable().optional(),
		first_seen: z.string().nullable().optional(),
		last_visited: z.string().nullable().optional(),
	})
	.loose();

export const RefdomainsResponseSchema = z.object({
	refdomains: z.array(RefdomainSchema),
});

export const TopPageSchema = z
	.object({
		raw_url: z.string().nullable().optional(),
		keywords: z.number().int().nullable().optional(),
		referring_domains: z.number().int().nullable().optional(),
		sum_traffic: z.number().int().nullable().optional(),
		value: z.number().int().nullable().optional(),
		page_type: z.string().nullable().optional(),
		status: z.string().optional(),
	})
	.loose();

export const TopPagesResponseSchema = z.object({
	pages: z.array(TopPageSchema),
});

export const RankTrackerOverviewInputSchema = z.object({
	timeout: z.number().int().nonnegative().optional(),
	limit: z.number().int().positive().default(1000).optional(),
	order_by: z.string().optional(),
	where: z.string().optional(),
	select: z.string().min(1),
	date_compared: isoDateString.optional(),
	date: isoDateString,
	device: z.enum(AHREFS_RANK_TRACKER_DEVICES),
	project_id: z.number().int().positive(),
	volume_mode: z.enum(AHREFS_VOLUME_MODES).default('monthly').optional(),
	output: z.enum(AHREFS_OUTPUT_FORMATS).default('json').optional(),
});

export const RankTrackerOverviewItemSchema = z
	.object({
		keyword: z.string().nullable().optional(),
		country: z.string().optional(),
		device: z.string().optional(),
		position: z.number().int().nullable().optional(),
		previous_position: z.number().int().nullable().optional(),
		best_position_kind: z.string().nullable().optional(),
		clicks: z.number().int().nullable().optional(),
		volume: z.number().int().nullable().optional(),
		traffic: z.number().int().nullable().optional(),
		url: z.string().nullable().optional(),
	})
	.loose();

export const RankTrackerOverviewResponseSchema = z.object({
	overviews: z.array(RankTrackerOverviewItemSchema),
});

export const SerpOverviewInputSchema = z.object({
	select: z.string().min(1),
	top_positions: z.number().int().positive().optional(),
	date: isoDateString.optional(),
	country: z.string().length(2),
	keyword: z.string().min(1),
	/** Comma-separated extra countries to return ranks in for the same URLs. */
	comparison_countries: z.string().min(2).optional(),
	/** Comma-separated SERP feature types to keep, e.g. `organic,snippet`. */
	type: z.string().min(1).optional(),
	output: z.enum(AHREFS_OUTPUT_FORMATS).default('json').optional(),
});

export const SerpPositionSchema = z
	.object({
		position: z.number().int().nullable().optional(),
		url: z.string().nullable().optional(),
		title: z.string().nullable().optional(),
		type: z.array(z.string()).optional(),
		domain_rating: z.number().nullable().optional(),
		ahrefs_rank: z.number().int().nullable().optional(),
		backlinks: z.number().int().nullable().optional(),
		refdomains: z.number().int().nullable().optional(),
		traffic: z.number().int().nullable().optional(),
		value: z.number().int().nullable().optional(),
		update_date: z.string().nullable().optional(),
	})
	.loose();

export const SerpOverviewResponseSchema = z.object({
	positions: z.array(SerpPositionSchema),
});

export const LimitsAndUsageInputSchema = z.object({
	output: z.enum(AHREFS_OUTPUT_FORMATS).default('json').optional(),
});

export const LimitsAndUsageSchema = z.object({
	api_key_expiration_date: z.string(),
	subscription: z.string(),
	units_limit_api_key: z.number().int().nullable(),
	units_limit_workspace: z.number().int().nullable(),
	units_usage_api_key: z.number().int(),
	units_usage_workspace: z.number().int().nullable(),
	usage_reset_date: z.string(),
});

export const LimitsAndUsageResponseSchema = z.object({
	limits_and_usage: LimitsAndUsageSchema,
});

export type DomainRatingInput = z.infer<typeof DomainRatingInputSchema>;
export type DomainRatingResponse = z.infer<typeof DomainRatingResponseSchema>;
export type BacklinksStatsInput = z.infer<typeof BacklinksStatsInputSchema>;
export type BacklinksStatsResponse = z.infer<
	typeof BacklinksStatsResponseSchema
>;
export type KeywordsOverviewInput = z.infer<typeof KeywordsOverviewInputSchema>;
export type KeywordsOverviewResponse = z.infer<
	typeof KeywordsOverviewResponseSchema
>;
export type KeywordOverview = z.infer<typeof KeywordOverviewSchema>;
export type OrganicKeywordsInput = z.infer<typeof OrganicKeywordsInputSchema>;
export type OrganicKeywordsResponse = z.infer<
	typeof OrganicKeywordsResponseSchema
>;
export type OrganicKeyword = z.infer<typeof OrganicKeywordSchema>;
export type RefdomainsInput = z.infer<typeof RefdomainsInputSchema>;
export type RefdomainsResponse = z.infer<typeof RefdomainsResponseSchema>;
export type Refdomain = z.infer<typeof RefdomainSchema>;
export type TopPagesInput = z.infer<typeof TopPagesInputSchema>;
export type TopPagesResponse = z.infer<typeof TopPagesResponseSchema>;
export type TopPage = z.infer<typeof TopPageSchema>;
export type RankTrackerOverviewInput = z.infer<
	typeof RankTrackerOverviewInputSchema
>;
export type RankTrackerOverviewResponse = z.infer<
	typeof RankTrackerOverviewResponseSchema
>;
export type RankTrackerOverviewItem = z.infer<
	typeof RankTrackerOverviewItemSchema
>;
export type SerpOverviewInput = z.infer<typeof SerpOverviewInputSchema>;
export type SerpOverviewResponse = z.infer<typeof SerpOverviewResponseSchema>;
export type SerpPosition = z.infer<typeof SerpPositionSchema>;
export type LimitsAndUsageInput = z.infer<typeof LimitsAndUsageInputSchema>;
export type LimitsAndUsageResponse = z.infer<
	typeof LimitsAndUsageResponseSchema
>;
export type LimitsAndUsage = z.infer<typeof LimitsAndUsageSchema>;

// Search Console, Site Audit, Keywords/Site Explorer, Rank Tracker and
// management reads. Shapes follow https://docs.ahrefs.com/openapi.json.

export const GscKeywordsInputSchema = z
	.object({
		project_id: z.number().int().positive().optional().describe('Project ID.'),
		portfolio_id: z
			.number()
			.int()
			.positive()
			.optional()
			.describe('Portfolio ID.'),
		date_from: isoDateString.describe(
			'The start date of the historical period in YYYY-MM-DD format.',
		),
		date_to: isoDateString
			.optional()
			.describe('The end date of the historical period in YYYY-MM-DD format.'),
		search_type: z
			.enum(['web', 'image', 'video', 'news'])
			.optional()
			.describe(
				'The type of search results to return (web, image, video, news).',
			),
		country: z
			.string()
			.length(2)
			.optional()
			.describe('A two-letter country code (ISO 3166-1 alpha-2).'),
		device: z
			.enum(['desktop', 'mobile', 'tablet'])
			.optional()
			.describe('Filter by device type (DESKTOP, MOBILE, TABLET).'),
		limit: z
			.number()
			.int()
			.positive()
			.optional()
			.describe('The number of results to return.'),
		where: z
			.string()
			.optional()
			.describe(
				'Filter expression as a JSON string; see the Ahrefs API docs for the fields this endpoint accepts.',
			),
		keyword_list_id: z
			.number()
			.int()
			.positive()
			.optional()
			.describe('The id of an existing keyword list to show metrics for.'),
		keyword_lists: z
			.string()
			.optional()
			.describe('Keyword lists filter (JSON string).'),
		output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
	})
	.refine((value) => value.project_id || value.portfolio_id, {
		message: 'Provide project_id or portfolio_id',
	});

export const GscKeywordsRowSchema = z
	.object({
		clicks: z.number().nullable().optional(),
		ctr: z.number().nullable().optional(),
		impressions: z.number().nullable().optional(),
		keyword: z.string().nullable().optional(),
		keyword_list_labels: z.array(z.string()).nullable().optional(),
		position: z.number().nullable().optional(),
		top_url: z.string().nullable().optional(),
		urls_count: z.number().nullable().optional(),
	})
	.loose();

export const GscKeywordsResponseSchema = z.object({
	keywords: z.array(GscKeywordsRowSchema),
});

export const GscPagesInputSchema = z
	.object({
		project_id: z.number().int().positive().optional().describe('Project ID.'),
		portfolio_id: z
			.number()
			.int()
			.positive()
			.optional()
			.describe('Portfolio ID.'),
		date_from: isoDateString.describe(
			'The start date of the historical period in YYYY-MM-DD format.',
		),
		date_to: isoDateString
			.optional()
			.describe('The end date of the historical period in YYYY-MM-DD format.'),
		search_type: z
			.enum(['web', 'image', 'video', 'news'])
			.optional()
			.describe(
				'The type of search results to return (web, image, video, news).',
			),
		country: z
			.string()
			.length(2)
			.optional()
			.describe('A two-letter country code (ISO 3166-1 alpha-2).'),
		device: z
			.enum(['desktop', 'mobile', 'tablet'])
			.optional()
			.describe('Filter by device type (DESKTOP, MOBILE, TABLET).'),
		limit: z
			.number()
			.int()
			.positive()
			.optional()
			.describe('The number of results to return.'),
		where: z
			.string()
			.optional()
			.describe(
				'Filter expression as a JSON string; see the Ahrefs API docs for the fields this endpoint accepts.',
			),
		output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
	})
	.refine((value) => value.project_id || value.portfolio_id, {
		message: 'Provide project_id or portfolio_id',
	});

export const GscPagesRowSchema = z
	.object({
		clicks: z.number().nullable().optional(),
		ctr: z.number().nullable().optional(),
		impressions: z.number().nullable().optional(),
		keywords_count: z.number().nullable().optional(),
		page: z.string().nullable().optional(),
		position: z.number().nullable().optional(),
		top_keyword: z.string().nullable().optional(),
		traffic_value: z.number().nullable().optional(),
	})
	.loose();

export const GscPagesResponseSchema = z.object({
	pages: z.array(GscPagesRowSchema),
});

export const GscPerformanceHistoryInputSchema = z
	.object({
		project_id: z.number().int().positive().optional().describe('Project ID.'),
		portfolio_id: z
			.number()
			.int()
			.positive()
			.optional()
			.describe('Portfolio ID.'),
		date_from: isoDateString.describe(
			'The start date of the historical period in YYYY-MM-DD format.',
		),
		date_to: isoDateString
			.optional()
			.describe('The end date of the historical period in YYYY-MM-DD format.'),
		history_grouping: z
			.enum(['daily', 'weekly', 'monthly'])
			.optional()
			.describe('The time interval used to group historical data.'),
		search_type: z
			.enum(['web', 'image', 'video', 'news'])
			.optional()
			.describe(
				'The type of search results to return (web, image, video, news).',
			),
		country: z
			.string()
			.length(2)
			.optional()
			.describe('A two-letter country code (ISO 3166-1 alpha-2).'),
		device: z
			.enum(['desktop', 'mobile', 'tablet'])
			.optional()
			.describe('Filter by device type (DESKTOP, MOBILE, TABLET).'),
		where: z
			.string()
			.optional()
			.describe(
				'Filter expression as a JSON string; see the Ahrefs API docs for the fields this endpoint accepts.',
			),
		output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
	})
	.refine((value) => value.project_id || value.portfolio_id, {
		message: 'Provide project_id or portfolio_id',
	});

export const GscPerformanceHistoryRowSchema = z
	.object({
		clicks: z.number().nullable().optional(),
		ctr: z.number().nullable().optional(),
		date: z.string().nullable().optional(),
		impressions: z.number().nullable().optional(),
		position: z.number().nullable().optional(),
	})
	.loose();

export const GscPerformanceHistoryResponseSchema = z.object({
	metrics: z.array(GscPerformanceHistoryRowSchema),
});

export const GscKeywordHistoryInputSchema = z
	.object({
		project_id: z.number().int().positive().optional().describe('Project ID.'),
		portfolio_id: z
			.number()
			.int()
			.positive()
			.optional()
			.describe('Portfolio ID.'),
		date_from: isoDateString.describe(
			'The start date of the historical period in YYYY-MM-DD format.',
		),
		date_to: isoDateString
			.optional()
			.describe('The end date of the historical period in YYYY-MM-DD format.'),
		history_grouping: z
			.enum(['daily', 'weekly', 'monthly'])
			.optional()
			.describe('The time interval used to group historical data.'),
		country: z
			.string()
			.length(2)
			.optional()
			.describe('A two-letter country code (ISO 3166-1 alpha-2).'),
		device: z
			.enum(['desktop', 'mobile', 'tablet'])
			.optional()
			.describe('Filter by device type (DESKTOP, MOBILE, TABLET).'),
		keywords: z
			.string()
			.optional()
			.describe('A comma-separated list of keywords to get history data for.'),
		where: z
			.string()
			.optional()
			.describe(
				'Filter expression as a JSON string; see the Ahrefs API docs for the fields this endpoint accepts.',
			),
		output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
	})
	.refine((value) => value.project_id || value.portfolio_id, {
		message: 'Provide project_id or portfolio_id',
	});

export const GscKeywordHistoryRowSchema = z
	.object({
		clicks: z.number().nullable().optional(),
		ctr: z.number().nullable().optional(),
		date: z.string().nullable().optional(),
		impressions: z.number().nullable().optional(),
		keyword: z.string().nullable().optional(),
		position: z.number().nullable().optional(),
	})
	.loose();

export const GscKeywordHistoryResponseSchema = z.object({
	metrics: z.array(GscKeywordHistoryRowSchema),
});

export const GscPageHistoryInputSchema = z
	.object({
		project_id: z.number().int().positive().optional().describe('Project ID.'),
		portfolio_id: z
			.number()
			.int()
			.positive()
			.optional()
			.describe('Portfolio ID.'),
		date_from: isoDateString.describe(
			'The start date of the historical period in YYYY-MM-DD format.',
		),
		date_to: isoDateString
			.optional()
			.describe('The end date of the historical period in YYYY-MM-DD format.'),
		history_grouping: z
			.enum(['daily', 'weekly', 'monthly'])
			.optional()
			.describe('The time interval used to group historical data.'),
		country: z
			.string()
			.length(2)
			.optional()
			.describe('A two-letter country code (ISO 3166-1 alpha-2).'),
		device: z
			.enum(['desktop', 'mobile', 'tablet'])
			.optional()
			.describe('Filter by device type (DESKTOP, MOBILE, TABLET).'),
		pages: z
			.string()
			.optional()
			.describe('A comma-separated list of page URLs to get history data for.'),
		output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
	})
	.refine((value) => value.project_id || value.portfolio_id, {
		message: 'Provide project_id or portfolio_id',
	});

export const GscPageHistoryRowSchema = z
	.object({
		clicks: z.number().nullable().optional(),
		ctr: z.number().nullable().optional(),
		date: z.string().nullable().optional(),
		impressions: z.number().nullable().optional(),
		page: z.string().nullable().optional(),
		position: z.number().nullable().optional(),
	})
	.loose();

export const GscPageHistoryResponseSchema = z.object({
	metrics: z.array(GscPageHistoryRowSchema),
});

export const GscPagesHistoryInputSchema = z
	.object({
		project_id: z.number().int().positive().optional().describe('Project ID.'),
		portfolio_id: z
			.number()
			.int()
			.positive()
			.optional()
			.describe('Portfolio ID.'),
		date_from: isoDateString.describe(
			'The start date of the historical period in YYYY-MM-DD format.',
		),
		date_to: isoDateString
			.optional()
			.describe('The end date of the historical period in YYYY-MM-DD format.'),
		history_grouping: z
			.enum(['daily', 'weekly', 'monthly'])
			.optional()
			.describe('The time interval used to group historical data.'),
		search_type: z
			.enum(['web', 'image', 'video', 'news'])
			.optional()
			.describe(
				'The type of search results to return (web, image, video, news).',
			),
		country: z
			.string()
			.length(2)
			.optional()
			.describe('A two-letter country code (ISO 3166-1 alpha-2).'),
		device: z
			.enum(['desktop', 'mobile', 'tablet'])
			.optional()
			.describe('Filter by device type (DESKTOP, MOBILE, TABLET).'),
		where: z
			.string()
			.optional()
			.describe(
				'Filter expression as a JSON string; see the Ahrefs API docs for the fields this endpoint accepts.',
			),
		output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
	})
	.refine((value) => value.project_id || value.portfolio_id, {
		message: 'Provide project_id or portfolio_id',
	});

export const GscPagesHistoryRowSchema = z
	.object({
		date: z.string().nullable().optional(),
		total_pages: z.number().nullable().optional(),
	})
	.loose();

export const GscPagesHistoryResponseSchema = z.object({
	metrics: z.array(GscPagesHistoryRowSchema),
});

export const GscPositionsHistoryInputSchema = z
	.object({
		project_id: z.number().int().positive().optional().describe('Project ID.'),
		portfolio_id: z
			.number()
			.int()
			.positive()
			.optional()
			.describe('Portfolio ID.'),
		date_from: isoDateString.describe(
			'The start date of the historical period in YYYY-MM-DD format.',
		),
		date_to: isoDateString
			.optional()
			.describe('The end date of the historical period in YYYY-MM-DD format.'),
		history_grouping: z
			.enum(['daily', 'weekly', 'monthly'])
			.optional()
			.describe('The time interval used to group historical data.'),
		search_type: z
			.enum(['web', 'image', 'video', 'news'])
			.optional()
			.describe(
				'The type of search results to return (web, image, video, news).',
			),
		country: z
			.string()
			.length(2)
			.optional()
			.describe('A two-letter country code (ISO 3166-1 alpha-2).'),
		device: z
			.enum(['desktop', 'mobile', 'tablet'])
			.optional()
			.describe('Filter by device type (DESKTOP, MOBILE, TABLET).'),
		where: z
			.string()
			.optional()
			.describe(
				'Filter expression as a JSON string; see the Ahrefs API docs for the fields this endpoint accepts.',
			),
		output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
	})
	.refine((value) => value.project_id || value.portfolio_id, {
		message: 'Provide project_id or portfolio_id',
	});

export const GscPositionsHistoryRowSchema = z
	.object({
		date: z.string().nullable().optional(),
		position_1_to_3: z.number().nullable().optional(),
		position_4_to_10: z.number().nullable().optional(),
		position_11_to_20: z.number().nullable().optional(),
		position_21_to_50: z.number().nullable().optional(),
		position_51_plus: z.number().nullable().optional(),
		total: z.number().nullable().optional(),
	})
	.loose();

export const GscPositionsHistoryResponseSchema = z.object({
	metrics: z.array(GscPositionsHistoryRowSchema),
});

export const GscCtrByPositionInputSchema = z
	.object({
		project_id: z.number().int().positive().optional().describe('Project ID.'),
		portfolio_id: z
			.number()
			.int()
			.positive()
			.optional()
			.describe('Portfolio ID.'),
		date_from: isoDateString.describe(
			'The start date of the historical period in YYYY-MM-DD format.',
		),
		date_to: isoDateString
			.optional()
			.describe('The end date of the historical period in YYYY-MM-DD format.'),
		country: z
			.string()
			.length(2)
			.optional()
			.describe('A two-letter country code (ISO 3166-1 alpha-2).'),
		device: z
			.enum(['desktop', 'mobile', 'tablet'])
			.optional()
			.describe('Filter by device type (DESKTOP, MOBILE, TABLET).'),
		output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
	})
	.refine((value) => value.project_id || value.portfolio_id, {
		message: 'Provide project_id or portfolio_id',
	});

export const GscCtrByPositionRowSchema = z
	.object({
		average_ctr_percent: z.number().nullable().optional(),
		keyword_count: z.number().nullable().optional(),
		position: z.number().nullable().optional(),
	})
	.loose();

export const GscCtrByPositionResponseSchema = z.object({
	metrics: z.array(GscCtrByPositionRowSchema),
});

export const GscPerformanceByDeviceInputSchema = z
	.object({
		project_id: z.number().int().positive().optional().describe('Project ID.'),
		portfolio_id: z
			.number()
			.int()
			.positive()
			.optional()
			.describe('Portfolio ID.'),
		date_from: isoDateString.describe(
			'The start date of the historical period in YYYY-MM-DD format.',
		),
		date_to: isoDateString
			.optional()
			.describe('The end date of the historical period in YYYY-MM-DD format.'),
		search_type: z
			.enum(['web', 'image', 'video', 'news'])
			.optional()
			.describe(
				'The type of search results to return (web, image, video, news).',
			),
		country: z
			.string()
			.length(2)
			.optional()
			.describe('A two-letter country code (ISO 3166-1 alpha-2).'),
		where: z
			.string()
			.optional()
			.describe(
				'Filter expression as a JSON string; see the Ahrefs API docs for the fields this endpoint accepts.',
			),
		output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
	})
	.refine((value) => value.project_id || value.portfolio_id, {
		message: 'Provide project_id or portfolio_id',
	});

export const GscPerformanceByDeviceRowSchema = z
	.object({
		clicks: z.number().nullable().optional(),
		ctr: z.number().nullable().optional(),
		device: z.string().nullable().optional(),
		impressions: z.number().nullable().optional(),
		position: z.number().nullable().optional(),
	})
	.loose();

export const GscPerformanceByDeviceResponseSchema = z.object({
	metrics: z.array(GscPerformanceByDeviceRowSchema),
});

export const GscPerformanceByPositionInputSchema = z
	.object({
		project_id: z.number().int().positive().optional().describe('Project ID.'),
		portfolio_id: z
			.number()
			.int()
			.positive()
			.optional()
			.describe('Portfolio ID.'),
		date_from: isoDateString.describe(
			'The start date of the historical period in YYYY-MM-DD format.',
		),
		date_to: isoDateString
			.optional()
			.describe('The end date of the historical period in YYYY-MM-DD format.'),
		search_type: z
			.enum(['web', 'image', 'video', 'news'])
			.optional()
			.describe(
				'The type of search results to return (web, image, video, news).',
			),
		country: z
			.string()
			.length(2)
			.optional()
			.describe('A two-letter country code (ISO 3166-1 alpha-2).'),
		device: z
			.enum(['desktop', 'mobile', 'tablet'])
			.optional()
			.describe('Filter by device type (DESKTOP, MOBILE, TABLET).'),
		where: z
			.string()
			.optional()
			.describe(
				'Filter expression as a JSON string; see the Ahrefs API docs for the fields this endpoint accepts.',
			),
		output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
	})
	.refine((value) => value.project_id || value.portfolio_id, {
		message: 'Provide project_id or portfolio_id',
	});

export const GscPerformanceByPositionRowSchema = z
	.object({
		clicks: z.number().nullable().optional(),
		clicks_percent: z.number().nullable().optional(),
		impressions: z.number().nullable().optional(),
		impressions_percent: z.number().nullable().optional(),
		keyword_count: z.number().nullable().optional(),
		keyword_count_percent: z.number().nullable().optional(),
		position_range: z.string().nullable().optional(),
	})
	.loose();

export const GscPerformanceByPositionResponseSchema = z.object({
	metrics: z.array(GscPerformanceByPositionRowSchema),
});

export const GscMetricsByCountryInputSchema = z
	.object({
		project_id: z.number().int().positive().optional().describe('Project ID.'),
		portfolio_id: z
			.number()
			.int()
			.positive()
			.optional()
			.describe('Portfolio ID.'),
		date_from: isoDateString.describe(
			'The start date of the historical period in YYYY-MM-DD format.',
		),
		date_to: isoDateString
			.optional()
			.describe('The end date of the historical period in YYYY-MM-DD format.'),
		history_grouping: z
			.enum(['daily', 'weekly', 'monthly'])
			.optional()
			.describe('The time interval used to group historical data.'),
		search_type: z
			.enum(['web', 'image', 'video', 'news'])
			.optional()
			.describe(
				'The type of search results to return (web, image, video, news).',
			),
		device: z
			.enum(['desktop', 'mobile', 'tablet'])
			.optional()
			.describe('Filter by device type (DESKTOP, MOBILE, TABLET).'),
		where: z
			.string()
			.optional()
			.describe(
				'Filter expression as a JSON string; see the Ahrefs API docs for the fields this endpoint accepts.',
			),
		output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
	})
	.refine((value) => value.project_id || value.portfolio_id, {
		message: 'Provide project_id or portfolio_id',
	});

export const GscMetricsByCountryRowSchema = z
	.object({
		clicks: z.number().nullable().optional(),
		country: z.string().nullable().optional(),
	})
	.loose();

export const GscMetricsByCountryResponseSchema = z.object({
	metrics: z.array(GscMetricsByCountryRowSchema),
});

export const GscAnonymousQueriesInputSchema = z.object({
	select: z
		.string()
		.min(1)
		.describe('A comma-separated list of columns to return.'),
	where: z
		.string()
		.optional()
		.describe(
			'Filter expression as a JSON string; see the Ahrefs API docs for the fields this endpoint accepts.',
		),
	order_by: z
		.string()
		.optional()
		.describe(
			'A comma-separated list of columns to order results by, with optional direction.',
		),
	limit: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The number of results to return.'),
	timeout: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('A manual timeout duration in seconds.'),
	project_id: z.number().int().positive().describe('Project ID'),
	date_from: isoDateString.describe(
		'The start date of the historical period in YYYY-MM-DD format.',
	),
	country: z
		.string()
		.length(2)
		.describe('A two-letter country code (ISO 3166-1 alpha-2).'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const GscAnonymousQueriesRowSchema = z
	.object({
		cpc: z.number().nullable().optional(),
		keyword: z.string().nullable().optional(),
		keyword_country: z.string().nullable().optional(),
		keyword_difficulty: z.number().nullable().optional(),
		position: z.number().nullable().optional(),
		position_kind: z.string().nullable().optional(),
		traffic: z.number().nullable().optional(),
		url: z.string().nullable().optional(),
		volume: z.number().nullable().optional(),
	})
	.loose();

export const GscAnonymousQueriesResponseSchema = z.object({
	keywords: z.array(GscAnonymousQueriesRowSchema),
});

export const SiteAuditProjectsInputSchema = z.object({
	project_id: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The unique identifier of the project.'),
	date: z
		.string()
		.optional()
		.describe(
			'A timestamp in YYYY-MM-DDThh:mm:ss format specifying the crawl date to retrieve metrics from.',
		),
	project_name: z.string().optional().describe('Filters projects by name.'),
	project_url: z
		.string()
		.optional()
		.describe(
			'Filters projects by target URL (ignores protocol and trailing slash).',
		),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const SiteAuditProjectsRowSchema = z
	.object({
		date: z.string().nullable().optional(),
		health_score: z.number().nullable().optional(),
		project_id: z.string().nullable().optional(),
		project_name: z.string().nullable().optional(),
		status: z.string().nullable().optional(),
		target_mode: z.string().nullable().optional(),
		target_protocol: z.string().nullable().optional(),
		target_url: z.string().nullable().optional(),
		total: z.number().nullable().optional(),
		urls_with_errors: z.number().nullable().optional(),
		urls_with_notices: z.number().nullable().optional(),
		urls_with_warnings: z.number().nullable().optional(),
	})
	.loose();

export const SiteAuditProjectsResponseSchema = z.object({
	healthscores: z.array(SiteAuditProjectsRowSchema),
});

export const SiteAuditIssuesInputSchema = z.object({
	project_id: z
		.number()
		.int()
		.positive()
		.describe('The unique identifier of the project.'),
	date: z
		.string()
		.optional()
		.describe(
			'A timestamp in YYYY-MM-DDThh:mm:ss format specifying the crawl date to retrieve metrics from.',
		),
	date_compared: z
		.string()
		.optional()
		.describe(
			'A timestamp in YYYY-MM-DDThh:mm:ss format specifying the crawl date to compare metrics with.',
		),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const SiteAuditIssuesRowSchema = z
	.object({
		added: z.number().nullable().optional(),
		category: z.string().nullable().optional(),
		change: z.number().nullable().optional(),
		crawled: z.number().nullable().optional(),
		importance: z.string().nullable().optional(),
		is_indexable: z.boolean().nullable().optional(),
		issue_id: z.string().nullable().optional(),
		missing: z.number().nullable().optional(),
		name: z.string().nullable().optional(),
		new: z.number().nullable().optional(),
		removed: z.number().nullable().optional(),
	})
	.loose();

export const SiteAuditIssuesResponseSchema = z.object({
	issues: z.array(SiteAuditIssuesRowSchema),
});

export const SiteAuditPageExplorerInputSchema = z.object({
	select: z
		.string()
		.min(1)
		.optional()
		.describe('A comma-separated list of fields to return.'),
	where: z
		.string()
		.optional()
		.describe(
			'Filter expression as a JSON string; see the Ahrefs API docs for the fields this endpoint accepts.',
		),
	order_by: z
		.string()
		.optional()
		.describe('A field to order the results by, with optional direction.'),
	project_id: z
		.number()
		.int()
		.positive()
		.describe('The unique identifier of the project.'),
	date: z
		.string()
		.optional()
		.describe(
			'A timestamp in YYYY-MM-DDThh:mm:ss format specifying the crawl date to retrieve metrics from.',
		),
	date_compared: z
		.string()
		.optional()
		.describe(
			'A timestamp in YYYY-MM-DDThh:mm:ss format specifying the crawl date to compare metrics with.',
		),
	issue_id: z
		.string()
		.optional()
		.describe('The unique identifier of an issue.'),
	filter_mode: z
		.enum(['added', 'new', 'removed', 'missing', 'no_change'])
		.optional()
		.describe(
			'Indicates which pages to return compared to the previous crawl.',
		),
	offset: z
		.number()
		.int()
		.nonnegative()
		.optional()
		.describe('The number of results to skip.'),
	limit: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The number of results to return.'),
	timeout: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('A manual timeout duration in seconds.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

// Site Audit pages carry 600+ selectable columns; the common ones are typed
// here and the rest pass through .loose().
export const SiteAuditPageExplorerRowSchema = z
	.object({
		backlinks: z.number().nullable().optional(),
		canonical: z.string().nullable().optional(),
		compliant: z.boolean().nullable().optional(),
		content_type: z.string().nullable().optional(),
		depth: z.number().nullable().optional(),
		h1: z.array(z.string()).nullable().optional(),
		http_code: z.number().nullable().optional(),
		incoming_all_links: z.number().nullable().optional(),
		incoming_links: z.number().nullable().optional(),
		is_html: z.boolean().nullable().optional(),
		is_valid_internal_html: z.boolean().nullable().optional(),
		keywords: z.array(z.string()).nullable().optional(),
		loading_time: z.number().nullable().optional(),
		meta_description: z.array(z.string()).nullable().optional(),
		origin: z.string().nullable().optional(),
		page_rating: z.number().nullable().optional(),
		redirect: z.string().nullable().optional(),
		scheme: z.string().nullable().optional(),
		size: z.number().nullable().optional(),
		time_to_first_byte: z.number().nullable().optional(),
		title: z.array(z.string()).nullable().optional(),
		traffic: z.number().nullable().optional(),
		url: z.string().nullable().optional(),
	})
	.loose();

export const SiteAuditPageExplorerResponseSchema = z.object({
	pages: z.array(SiteAuditPageExplorerRowSchema),
});

export const SiteAuditPageContentInputSchema = z.object({
	select: z
		.string()
		.min(1)
		.describe('A comma-separated list of fields to return.'),
	project_id: z
		.number()
		.int()
		.positive()
		.describe('The unique identifier of the project.'),
	target_url: z
		.string()
		.min(1)
		.describe('The URL of the page to retrieve content for.'),
	date: z
		.string()
		.optional()
		.describe(
			'A timestamp in YYYY-MM-DDThh:mm:ss format specifying the crawl date to retrieve metrics from.',
		),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const SiteAuditPageContentResponseSchema = z.object({
	'page-content': z
		.object({
			crawl_datetime: z.string().nullable().optional(),
			page_text: z.string().nullable().optional(),
			page_text_md: z.string().nullable().optional(),
			raw_html: z.string().nullable().optional(),
			rendered_html: z.string().nullable().optional(),
		})
		.loose(),
});

export const MatchingTermsInputSchema = z
	.object({
		select: z
			.string()
			.min(1)
			.describe('A comma-separated list of columns to return.'),
		where: z
			.string()
			.optional()
			.describe(
				'Filter expression as a JSON string; see the Ahrefs API docs for the fields this endpoint accepts.',
			),
		order_by: z.string().optional().describe('A column to order results by.'),
		limit: z
			.number()
			.int()
			.positive()
			.optional()
			.describe('The number of results to return.'),
		timeout: z
			.number()
			.int()
			.positive()
			.optional()
			.describe('A manual timeout duration in seconds.'),
		keyword_list_id: z
			.number()
			.int()
			.positive()
			.optional()
			.describe('The id of an existing keyword list.'),
		keywords: z
			.string()
			.optional()
			.describe('A comma-separated list of keywords to show metrics for.'),
		country: countryOrAll.describe(
			'A country code, or all for matching terms across all locations.',
		),
		terms: z
			.enum(['all', 'questions', 'global'])
			.optional()
			.describe(
				'All keyword ideas (all), questions (questions), or global terms including translations (global).',
			),
		match_mode: z
			.enum(['terms', 'phrase'])
			.optional()
			.describe(
				'Keyword ideas contain the words from your query in any order (terms) or in the exact order they are written (phrase).',
			),
		output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
	})
	.refine((value) => value.keywords || value.keyword_list_id, {
		message: 'Provide keywords or keyword_list_id',
	});

export const MatchingTermsRowSchema = z
	.object({
		country: z.string().nullable().optional(),
		cpc: z.number().nullable().optional(),
		cps: z.number().nullable().optional(),
		difficulty: z.number().nullable().optional(),
		first_seen: z.string().nullable().optional(),
		global_traffic_potential: z.number().nullable().optional(),
		global_volume: z.number().nullable().optional(),
		intents: AhrefsOpenObject.nullable().optional(),
		keyword: z.string().nullable().optional(),
		parent_topic: z.string().nullable().optional(),
		serp_features: z.array(z.string()).nullable().optional(),
		serp_last_update: z.string().nullable().optional(),
		traffic_potential: z.number().nullable().optional(),
		volume: z.number().nullable().optional(),
		volume_desktop_pct: z.number().nullable().optional(),
		volume_mobile_pct: z.number().nullable().optional(),
		volume_monthly: z.number().nullable().optional(),
	})
	.loose();

export const MatchingTermsResponseSchema = z.object({
	keywords: z.array(MatchingTermsRowSchema),
});

export const RelatedTermsInputSchema = z
	.object({
		select: z
			.string()
			.min(1)
			.describe('A comma-separated list of columns to return.'),
		where: z
			.string()
			.optional()
			.describe(
				'Filter expression as a JSON string; see the Ahrefs API docs for the fields this endpoint accepts.',
			),
		order_by: z.string().optional().describe('A column to order results by.'),
		limit: z
			.number()
			.int()
			.positive()
			.optional()
			.describe('The number of results to return.'),
		timeout: z
			.number()
			.int()
			.positive()
			.optional()
			.describe('A manual timeout duration in seconds.'),
		keyword_list_id: z
			.number()
			.int()
			.positive()
			.optional()
			.describe('The id of an existing keyword list.'),
		keywords: z
			.string()
			.optional()
			.describe('A comma-separated list of keywords to show metrics for.'),
		country: z
			.string()
			.length(2)
			.describe('A two-letter country code (ISO 3166-1 alpha-2).'),
		terms: z
			.enum(['all', 'also_rank_for', 'also_talk_about'])
			.optional()
			.describe(
				'Related keywords which top-ranking pages also rank for (also_rank_for), additional keywords frequently mentioned in top-ranking pages (also_talk_about), or comb',
			),
		view_for: z
			.enum(['top_10', 'top_100'])
			.optional()
			.describe('View keywords for the top 10 or top 100 ranking pages.'),
		output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
	})
	.refine((value) => value.keywords || value.keyword_list_id, {
		message: 'Provide keywords or keyword_list_id',
	});

export const RelatedTermsRowSchema = z
	.object({
		country: z.string().nullable().optional(),
		cpc: z.number().nullable().optional(),
		cps: z.number().nullable().optional(),
		difficulty: z.number().nullable().optional(),
		first_seen: z.string().nullable().optional(),
		global_traffic_potential: z.number().nullable().optional(),
		global_volume: z.number().nullable().optional(),
		intents: AhrefsOpenObject.nullable().optional(),
		keyword: z.string().nullable().optional(),
		parent_topic: z.string().nullable().optional(),
		serp_features: z.array(z.string()).nullable().optional(),
		serp_last_update: z.string().nullable().optional(),
		traffic_potential: z.number().nullable().optional(),
		volume: z.number().nullable().optional(),
		volume_desktop_pct: z.number().nullable().optional(),
		volume_mobile_pct: z.number().nullable().optional(),
		volume_monthly: z.number().nullable().optional(),
	})
	.loose();

export const RelatedTermsResponseSchema = z.object({
	keywords: z.array(RelatedTermsRowSchema),
});

export const SearchSuggestionsInputSchema = z
	.object({
		select: z
			.string()
			.min(1)
			.describe('A comma-separated list of columns to return.'),
		where: z
			.string()
			.optional()
			.describe(
				'Filter expression as a JSON string; see the Ahrefs API docs for the fields this endpoint accepts.',
			),
		order_by: z.string().optional().describe('A column to order results by.'),
		limit: z
			.number()
			.int()
			.positive()
			.optional()
			.describe('The number of results to return.'),
		timeout: z
			.number()
			.int()
			.positive()
			.optional()
			.describe('A manual timeout duration in seconds.'),
		keyword_list_id: z
			.number()
			.int()
			.positive()
			.optional()
			.describe('The id of an existing keyword list.'),
		keywords: z
			.string()
			.optional()
			.describe('A comma-separated list of keywords to show metrics for.'),
		country: z
			.string()
			.length(2)
			.describe('A two-letter country code (ISO 3166-1 alpha-2).'),
		output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
	})
	.refine((value) => value.keywords || value.keyword_list_id, {
		message: 'Provide keywords or keyword_list_id',
	});

export const SearchSuggestionsRowSchema = z
	.object({
		country: z.string().nullable().optional(),
		cpc: z.number().nullable().optional(),
		cps: z.number().nullable().optional(),
		difficulty: z.number().nullable().optional(),
		first_seen: z.string().nullable().optional(),
		global_traffic_potential: z.number().nullable().optional(),
		global_volume: z.number().nullable().optional(),
		intents: AhrefsOpenObject.nullable().optional(),
		keyword: z.string().nullable().optional(),
		parent_topic: z.string().nullable().optional(),
		serp_features: z.array(z.string()).nullable().optional(),
		serp_last_update: z.string().nullable().optional(),
		traffic_potential: z.number().nullable().optional(),
		volume: z.number().nullable().optional(),
		volume_desktop_pct: z.number().nullable().optional(),
		volume_mobile_pct: z.number().nullable().optional(),
		volume_monthly: z.number().nullable().optional(),
	})
	.loose();

export const SearchSuggestionsResponseSchema = z.object({
	keywords: z.array(SearchSuggestionsRowSchema),
});

export const VolumeHistoryInputSchema = z.object({
	keyword: z.string().min(1).describe('The keyword to show metrics for.'),
	country: countryOrAll.describe('A country code, or all for all locations.'),
	date_from: isoDateString
		.optional()
		.describe('The start date of the historical period in YYYY-MM-DD format.'),
	date_to: isoDateString
		.optional()
		.describe('The end date of the historical period in YYYY-MM-DD format.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const VolumeHistoryRowSchema = z
	.object({
		date: z.string().nullable().optional(),
		volume: z.number().nullable().optional(),
	})
	.loose();

export const VolumeHistoryResponseSchema = z.object({
	metrics: z.array(VolumeHistoryRowSchema),
});

export const VolumeByCountryInputSchema = z
	.object({
		select: z
			.string()
			.min(1)
			.optional()
			.describe('A comma-separated list of fields to return.'),
		order_by: z
			.string()
			.optional()
			.describe('A field to order the results by, with optional direction.'),
		limit: z
			.number()
			.int()
			.positive()
			.optional()
			.describe('The number of results to return.'),
		offset: z
			.number()
			.int()
			.nonnegative()
			.optional()
			.describe('The number of results to skip.'),
		keyword_list_id: z
			.number()
			.int()
			.positive()
			.optional()
			.describe('The id of an existing keyword list.'),
		keyword: z
			.string()
			.min(1)
			.optional()
			.describe('A comma-separated list of keywords to show metrics for.'),
		countries: z
			.string()
			.optional()
			.describe(
				'A comma-separated list of two-letter country codes (ISO 3166-1 alpha-2).',
			),
		volume_monthly_date_from: isoDateString
			.optional()
			.describe(
				'The start date in YYYY-MM-DD format for retrieving historical monthly search volumes in the volume_monthly_history field.',
			),
		volume_monthly_date_to: isoDateString
			.optional()
			.describe(
				'The end date in YYYY-MM-DD format for retrieving historical monthly search volumes in the volume_monthly_history field.',
			),
		output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
	})
	.refine((value) => value.keyword || value.keyword_list_id, {
		message: 'Provide keyword or keyword_list_id',
	});

export const VolumeByCountryRowSchema = z
	.object({
		country: z.string().nullable().optional(),
		cpc: z.number().nullable().optional(),
		difficulty: z.number().nullable().optional(),
		growth_rate_12m: z.number().nullable().optional(),
		has_serp: z.boolean().nullable().optional(),
		top_keyword: z.string().nullable().optional(),
		top_page: z.string().nullable().optional(),
		top_page_title: z.string().nullable().optional(),
		traffic_potential: z.number().nullable().optional(),
		volume: z.number().nullable().optional(),
		volume_monthly_history: AhrefsOpenList.nullable().optional(),
	})
	.loose();

export const VolumeByCountryResponseSchema = z.object({
	countries: z.array(VolumeByCountryRowSchema),
});

export const SiteMetricsInputSchema = z.object({
	date: isoDateString.describe(
		'A date to report metrics on in YYYY-MM-DD format.',
	),
	mode: z
		.enum(['exact', 'prefix', 'domain', 'subdomains'])
		.optional()
		.describe('The scope of the target.'),
	target: z
		.string()
		.min(1)
		.describe('The target of the search: a domain or a URL.'),
	portfolio_id: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The unique identifier of the portfolio.'),
	protocol: z
		.enum(['both', 'http', 'https'])
		.optional()
		.describe('The protocol of your target.'),
	country: z
		.string()
		.length(2)
		.optional()
		.describe('A two-letter country code (ISO 3166-1 alpha-2).'),
	volume_mode: z
		.enum(['monthly', 'average'])
		.optional()
		.describe('The search volume calculation mode: monthly or average.'),
	traffic_mode: z
		.enum(['static', 'adaptive'])
		.optional()
		.describe('The organic traffic calculation mode: static or adaptive.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const SiteMetricsResponseSchema = z.object({
	metrics: z
		.object({
			org_cost: z.number().nullable().optional(),
			org_keywords: z.number().nullable().optional(),
			org_keywords_1_3: z.number().nullable().optional(),
			org_traffic: z.number().nullable().optional(),
			paid_cost: z.number().nullable().optional(),
			paid_keywords: z.number().nullable().optional(),
			paid_pages: z.number().nullable().optional(),
			paid_traffic: z.number().nullable().optional(),
		})
		.loose(),
});

export const MetricsHistoryInputSchema = z.object({
	select: z
		.string()
		.min(1)
		.optional()
		.describe('A comma-separated list of columns to return.'),
	mode: z
		.enum(['exact', 'prefix', 'domain', 'subdomains'])
		.optional()
		.describe('The scope of the target.'),
	target: z
		.string()
		.min(1)
		.describe('The target of the search: a domain or a URL.'),
	portfolio_id: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The unique identifier of the portfolio.'),
	protocol: z
		.enum(['both', 'http', 'https'])
		.optional()
		.describe('The protocol of your target.'),
	country: z
		.string()
		.length(2)
		.optional()
		.describe('A two-letter country code (ISO 3166-1 alpha-2).'),
	date_from: isoDateString.describe(
		'The start date of the historical period in YYYY-MM-DD format.',
	),
	date_to: isoDateString
		.optional()
		.describe('The end date of the historical period in YYYY-MM-DD format.'),
	history_grouping: z
		.enum(['daily', 'weekly', 'monthly'])
		.optional()
		.describe('The time interval used to group historical data.'),
	volume_mode: z
		.enum(['monthly', 'average'])
		.optional()
		.describe('The search volume calculation mode: monthly or average.'),
	traffic_mode: z
		.enum(['static', 'adaptive'])
		.optional()
		.describe('The organic traffic calculation mode: static or adaptive.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const MetricsHistoryRowSchema = z
	.object({
		date: z.string().nullable().optional(),
		org_cost: z.number().nullable().optional(),
		org_traffic: z.number().nullable().optional(),
		paid_cost: z.number().nullable().optional(),
		paid_traffic: z.number().nullable().optional(),
	})
	.loose();

export const MetricsHistoryResponseSchema = z.object({
	metrics: z.array(MetricsHistoryRowSchema),
});

export const DomainRatingHistoryInputSchema = z.object({
	target: z
		.string()
		.min(1)
		.describe('The target of the search: a domain or a URL.'),
	date_from: isoDateString.describe(
		'The start date of the historical period in YYYY-MM-DD format.',
	),
	date_to: isoDateString
		.optional()
		.describe('The end date of the historical period in YYYY-MM-DD format.'),
	history_grouping: z
		.enum(['daily', 'weekly', 'monthly'])
		.optional()
		.describe('The time interval used to group historical data.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const DomainRatingHistoryRowSchema = z
	.object({
		date: z.string().nullable().optional(),
		domain_rating: z.number().nullable().optional(),
	})
	.loose();

export const DomainRatingHistoryResponseSchema = z.object({
	domain_ratings: z.array(DomainRatingHistoryRowSchema),
});

export const AllBacklinksInputSchema = z.object({
	select: z
		.string()
		.min(1)
		.describe('A comma-separated list of columns to return.'),
	where: z
		.string()
		.optional()
		.describe(
			'Filter expression as a JSON string; see the Ahrefs API docs for the fields this endpoint accepts.',
		),
	order_by: z.string().optional().describe('A column to order results by.'),
	limit: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The number of results to return.'),
	timeout: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('A manual timeout duration in seconds.'),
	aggregation: z
		.enum(['similar_links', '1_per_domain', 'all'])
		.optional()
		.describe('The backlinks grouping mode.'),
	history: z
		.string()
		.optional()
		.describe('A time frame to add lost backlinks to the report.'),
	mode: z
		.enum(['exact', 'prefix', 'domain', 'subdomains'])
		.optional()
		.describe('The scope of the search based on the target you entered.'),
	target: z
		.string()
		.min(1)
		.describe('The target of the search: a domain or a URL.'),
	portfolio_id: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The unique identifier of the portfolio.'),
	protocol: z
		.enum(['both', 'http', 'https'])
		.optional()
		.describe('The protocol of your target.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const AllBacklinksRowSchema = z
	.object({
		ahrefs_rank_source: z.number().nullable().optional(),
		ahrefs_rank_target: z.number().nullable().optional(),
		alt: z.string().nullable().optional(),
		anchor: z.string().nullable().optional(),
		broken_redirect_new_target: z.string().nullable().optional(),
		broken_redirect_reason: z.string().nullable().optional(),
		broken_redirect_source: z.string().nullable().optional(),
		class_c: z.number().nullable().optional(),
		discovered_status: z.string().nullable().optional(),
		domain_rating_source: z.number().nullable().optional(),
		domain_rating_target: z.number().nullable().optional(),
		drop_reason: z.string().nullable().optional(),
		encoding: z.string().nullable().optional(),
		first_seen: z.string().nullable().optional(),
		first_seen_link: z.string().nullable().optional(),
		http_code: z.number().nullable().optional(),
		http_crawl: z.boolean().nullable().optional(),
		ip_source: z.string().nullable().optional(),
		is_alternate: z.boolean().nullable().optional(),
		is_canonical: z.boolean().nullable().optional(),
		is_content: z.boolean().nullable().optional(),
		is_dofollow: z.boolean().nullable().optional(),
		is_form: z.boolean().nullable().optional(),
		is_frame: z.boolean().nullable().optional(),
		is_image: z.boolean().nullable().optional(),
		is_lost: z.boolean().nullable().optional(),
		is_new: z.boolean().nullable().optional(),
		is_nofollow: z.boolean().nullable().optional(),
		is_redirect: z.boolean().nullable().optional(),
		is_redirect_lost: z.boolean().nullable().optional(),
		is_root_source: z.boolean().nullable().optional(),
		is_root_target: z.boolean().nullable().optional(),
		is_rss: z.boolean().nullable().optional(),
		is_spam: z.boolean().nullable().optional(),
		is_sponsored: z.boolean().nullable().optional(),
		is_text: z.boolean().nullable().optional(),
		is_ugc: z.boolean().nullable().optional(),
		js_crawl: z.boolean().nullable().optional(),
		languages: z.array(z.string()).nullable().optional(),
		last_seen: z.string().nullable().optional(),
		last_visited: z.string().nullable().optional(),
		link_group_count: z.number().nullable().optional(),
		link_type: z.string().nullable().optional(),
		linked_domains_source_domain: z.number().nullable().optional(),
		linked_domains_source_page: z.number().nullable().optional(),
		linked_domains_target_domain: z.number().nullable().optional(),
		links_external: z.number().nullable().optional(),
		links_internal: z.number().nullable().optional(),
		lost_reason: z.string().nullable().optional(),
		name_source: z.string().nullable().optional(),
		name_target: z.string().nullable().optional(),
		noindex: z.boolean().nullable().optional(),
		page_category_source: z.string().nullable().optional(),
		page_size: z.number().nullable().optional(),
		page_type_source: z.string().nullable().optional(),
		port_source: z.number().nullable().optional(),
		port_target: z.number().nullable().optional(),
		positions: z.number().nullable().optional(),
		powered_by: z.array(z.string()).nullable().optional(),
		redirect_code: z.number().nullable().optional(),
		redirect_kind: z.array(z.number()).nullable().optional(),
		refdomains_source: z.number().nullable().optional(),
		refdomains_source_domain: z.number().nullable().optional(),
		refdomains_target_domain: z.number().nullable().optional(),
		root_name_source: z.string().nullable().optional(),
		root_name_target: z.string().nullable().optional(),
		snippet_left: z.string().nullable().optional(),
		snippet_right: z.string().nullable().optional(),
		source_page_author: z.string().nullable().optional(),
		source_page_publish_date: z.string().nullable().optional(),
		title: z.string().nullable().optional(),
		tld_class_source: z.string().nullable().optional(),
		tld_class_target: z.string().nullable().optional(),
		traffic: z.number().nullable().optional(),
		traffic_domain: z.number().nullable().optional(),
		url_from: z.string().nullable().optional(),
		url_from_plain: z.string().nullable().optional(),
		url_rating_source: z.number().nullable().optional(),
		url_redirect: z.array(z.string()).nullable().optional(),
		url_redirect_with_target: z.array(z.string()).nullable().optional(),
		url_to: z.string().nullable().optional(),
		url_to_plain: z.string().nullable().optional(),
	})
	.loose();

export const AllBacklinksResponseSchema = z.object({
	backlinks: z.array(AllBacklinksRowSchema),
});

export const BrokenBacklinksInputSchema = z.object({
	select: z
		.string()
		.min(1)
		.describe('A comma-separated list of columns to return.'),
	where: z
		.string()
		.optional()
		.describe(
			'Filter expression as a JSON string; see the Ahrefs API docs for the fields this endpoint accepts.',
		),
	order_by: z.string().optional().describe('A column to order results by.'),
	limit: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The number of results to return.'),
	timeout: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('A manual timeout duration in seconds.'),
	aggregation: z
		.enum(['similar_links', '1_per_domain', 'all'])
		.optional()
		.describe('The backlinks grouping mode.'),
	mode: z
		.enum(['exact', 'prefix', 'domain', 'subdomains'])
		.optional()
		.describe('The scope of the search based on the target you entered.'),
	target: z
		.string()
		.min(1)
		.describe('The target of the search: a domain or a URL.'),
	portfolio_id: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The unique identifier of the portfolio.'),
	protocol: z
		.enum(['both', 'http', 'https'])
		.optional()
		.describe('The protocol of your target.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const BrokenBacklinksRowSchema = z
	.object({
		ahrefs_rank_source: z.number().nullable().optional(),
		ahrefs_rank_target: z.number().nullable().optional(),
		alt: z.string().nullable().optional(),
		anchor: z.string().nullable().optional(),
		class_c: z.number().nullable().optional(),
		domain_rating_source: z.number().nullable().optional(),
		domain_rating_target: z.number().nullable().optional(),
		encoding: z.string().nullable().optional(),
		first_seen: z.string().nullable().optional(),
		first_seen_link: z.string().nullable().optional(),
		http_code: z.number().nullable().optional(),
		http_code_target: z.number().nullable().optional(),
		http_crawl: z.boolean().nullable().optional(),
		ip_source: z.string().nullable().optional(),
		is_alternate: z.boolean().nullable().optional(),
		is_canonical: z.boolean().nullable().optional(),
		is_content: z.boolean().nullable().optional(),
		is_dofollow: z.boolean().nullable().optional(),
		is_form: z.boolean().nullable().optional(),
		is_frame: z.boolean().nullable().optional(),
		is_image: z.boolean().nullable().optional(),
		is_nofollow: z.boolean().nullable().optional(),
		is_redirect: z.boolean().nullable().optional(),
		is_root_source: z.boolean().nullable().optional(),
		is_root_target: z.boolean().nullable().optional(),
		is_rss: z.boolean().nullable().optional(),
		is_spam: z.boolean().nullable().optional(),
		is_sponsored: z.boolean().nullable().optional(),
		is_text: z.boolean().nullable().optional(),
		is_ugc: z.boolean().nullable().optional(),
		js_crawl: z.boolean().nullable().optional(),
		languages: z.array(z.string()).nullable().optional(),
		last_seen: z.string().nullable().optional(),
		last_visited: z.string().nullable().optional(),
		last_visited_target: z.string().nullable().optional(),
		link_group_count: z.number().nullable().optional(),
		link_type: z.string().nullable().optional(),
		linked_domains_source_domain: z.number().nullable().optional(),
		linked_domains_source_page: z.number().nullable().optional(),
		linked_domains_target_domain: z.number().nullable().optional(),
		links_external: z.number().nullable().optional(),
		links_internal: z.number().nullable().optional(),
		name_source: z.string().nullable().optional(),
		name_target: z.string().nullable().optional(),
		page_category_source: z.string().nullable().optional(),
		page_size: z.number().nullable().optional(),
		page_type_source: z.string().nullable().optional(),
		port_source: z.number().nullable().optional(),
		port_target: z.number().nullable().optional(),
		positions: z.number().nullable().optional(),
		powered_by: z.array(z.string()).nullable().optional(),
		redirect_code: z.number().nullable().optional(),
		redirect_kind: z.array(z.number()).nullable().optional(),
		refdomains_source: z.number().nullable().optional(),
		refdomains_source_domain: z.number().nullable().optional(),
		refdomains_target_domain: z.number().nullable().optional(),
		root_name_source: z.string().nullable().optional(),
		root_name_target: z.string().nullable().optional(),
		snippet_left: z.string().nullable().optional(),
		snippet_right: z.string().nullable().optional(),
		source_page_author: z.string().nullable().optional(),
		title: z.string().nullable().optional(),
		tld_class_source: z.string().nullable().optional(),
		tld_class_target: z.string().nullable().optional(),
		traffic: z.number().nullable().optional(),
		traffic_domain: z.number().nullable().optional(),
		url_from: z.string().nullable().optional(),
		url_from_plain: z.string().nullable().optional(),
		url_rating_source: z.number().nullable().optional(),
		url_redirect: z.array(z.string()).nullable().optional(),
		url_redirect_with_target: z.array(z.string()).nullable().optional(),
		url_to: z.string().nullable().optional(),
		url_to_plain: z.string().nullable().optional(),
	})
	.loose();

export const BrokenBacklinksResponseSchema = z.object({
	backlinks: z.array(BrokenBacklinksRowSchema),
});

export const AnchorsInputSchema = z.object({
	select: z
		.string()
		.min(1)
		.describe('A comma-separated list of columns to return.'),
	where: z
		.string()
		.optional()
		.describe(
			'Filter expression as a JSON string; see the Ahrefs API docs for the fields this endpoint accepts.',
		),
	order_by: z
		.string()
		.optional()
		.describe(
			'A comma-separated list of columns to order results by, with optional direction.',
		),
	limit: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The number of results to return.'),
	timeout: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('A manual timeout duration in seconds.'),
	history: z
		.string()
		.optional()
		.describe('A time frame to add lost backlinks to the report.'),
	mode: z
		.enum(['exact', 'prefix', 'domain', 'subdomains'])
		.optional()
		.describe('The scope of the search based on the target you entered.'),
	target: z
		.string()
		.min(1)
		.describe('The target of the search: a domain or a URL.'),
	portfolio_id: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The unique identifier of the portfolio.'),
	protocol: z
		.enum(['both', 'http', 'https'])
		.optional()
		.describe('The protocol of your target.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const AnchorsRowSchema = z
	.object({
		anchor: z.string().nullable().optional(),
		dofollow_links: z.number().nullable().optional(),
		first_seen: z.string().nullable().optional(),
		is_spam: z.boolean().nullable().optional(),
		last_seen: z.string().nullable().optional(),
		links_to_target: z.number().nullable().optional(),
		lost_links: z.number().nullable().optional(),
		new_links: z.number().nullable().optional(),
		refdomains: z.number().nullable().optional(),
		refpages: z.number().nullable().optional(),
		top_domain_rating: z.number().nullable().optional(),
	})
	.loose();

export const AnchorsResponseSchema = z.object({
	anchors: z.array(AnchorsRowSchema),
});

export const OrganicCompetitorsInputSchema = z.object({
	select: z
		.string()
		.min(1)
		.describe('A comma-separated list of columns to return.'),
	where: z
		.string()
		.optional()
		.describe(
			'Filter expression as a JSON string; see the Ahrefs API docs for the fields this endpoint accepts.',
		),
	order_by: z
		.string()
		.optional()
		.describe(
			'A comma-separated list of columns to order results by, with optional direction.',
		),
	limit: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The number of results to return.'),
	timeout: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('A manual timeout duration in seconds.'),
	volume_mode: z
		.enum(['monthly', 'average'])
		.optional()
		.describe('The search volume calculation mode: monthly or average.'),
	traffic_mode: z
		.enum(['static', 'adaptive'])
		.optional()
		.describe('The organic traffic calculation mode: static or adaptive.'),
	date: isoDateString.describe(
		'A date to report metrics on in YYYY-MM-DD format.',
	),
	date_compared: isoDateString
		.optional()
		.describe('A date to compare metrics with in YYYY-MM-DD format.'),
	country: z
		.string()
		.length(2)
		.describe('A two-letter country code (ISO 3166-1 alpha-2).'),
	mode: z
		.enum(['exact', 'prefix', 'domain', 'subdomains'])
		.optional()
		.describe('The scope of the search based on the target you entered.'),
	target: z
		.string()
		.min(1)
		.describe('The target of the search: a domain or a URL.'),
	portfolio_id: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The unique identifier of the portfolio.'),
	protocol: z
		.enum(['both', 'http', 'https'])
		.optional()
		.describe('The protocol of your target.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const OrganicCompetitorsRowSchema = z
	.object({
		competitor_domain: z.string().nullable().optional(),
		competitor_url: z.string().nullable().optional(),
		domain_rating: z.number().nullable().optional(),
		group_mode: z.string().nullable().optional(),
		keywords_common: z.number().nullable().optional(),
		keywords_competitor: z.number().nullable().optional(),
		keywords_target: z.number().nullable().optional(),
		pages: z.number().nullable().optional(),
		pages_diff: z.number().nullable().optional(),
		pages_merged: z.number().nullable().optional(),
		pages_prev: z.number().nullable().optional(),
		share: z.number().nullable().optional(),
		traffic: z.number().nullable().optional(),
		traffic_diff: z.number().nullable().optional(),
		traffic_merged: z.number().nullable().optional(),
		traffic_prev: z.number().nullable().optional(),
		value: z.number().nullable().optional(),
		value_diff: z.number().nullable().optional(),
		value_merged: z.number().nullable().optional(),
		value_prev: z.number().nullable().optional(),
	})
	.loose();

export const OrganicCompetitorsResponseSchema = z.object({
	competitors: z.array(OrganicCompetitorsRowSchema),
});

export const PagesByTrafficInputSchema = z.object({
	target: z
		.string()
		.min(1)
		.describe('The target of the search: a domain or a URL.'),
	portfolio_id: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The unique identifier of the portfolio.'),
	protocol: z
		.enum(['both', 'http', 'https'])
		.optional()
		.describe('The protocol of your target.'),
	mode: z
		.enum(['exact', 'prefix', 'domain', 'subdomains'])
		.optional()
		.describe('The scope of the target.'),
	volume_mode: z
		.enum(['monthly', 'average'])
		.optional()
		.describe('The search volume calculation mode: monthly or average.'),
	traffic_mode: z
		.enum(['static', 'adaptive'])
		.optional()
		.describe('The organic traffic calculation mode: static or adaptive.'),
	country: z
		.string()
		.length(2)
		.optional()
		.describe('A two-letter country code (ISO 3166-1 alpha-2).'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const PagesByTrafficResponseSchema = z.object({
	pages: z
		.object({
			range0_pages: z.number().nullable().optional(),
			range1k_pages: z.number().nullable().optional(),
			range1k_traffic: z.number().nullable().optional(),
			range5k_pages: z.number().nullable().optional(),
			range5k_traffic: z.number().nullable().optional(),
			range10k_pages: z.number().nullable().optional(),
			range10k_plus_pages: z.number().nullable().optional(),
			range10k_plus_traffic: z.number().nullable().optional(),
			range10k_traffic: z.number().nullable().optional(),
			range100_pages: z.number().nullable().optional(),
			range100_traffic: z.number().nullable().optional(),
		})
		.loose(),
});

export const RefdomainsHistoryInputSchema = z.object({
	mode: z
		.enum(['exact', 'prefix', 'domain', 'subdomains'])
		.optional()
		.describe('The scope of the target.'),
	target: z
		.string()
		.min(1)
		.describe('The target of the search: a domain or a URL.'),
	portfolio_id: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The unique identifier of the portfolio.'),
	protocol: z
		.enum(['both', 'http', 'https'])
		.optional()
		.describe('The protocol of your target.'),
	date_from: isoDateString.describe(
		'The start date of the historical period in YYYY-MM-DD format.',
	),
	date_to: isoDateString
		.optional()
		.describe('The end date of the historical period in YYYY-MM-DD format.'),
	history_grouping: z
		.enum(['daily', 'weekly', 'monthly'])
		.optional()
		.describe('The time interval used to group historical data.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const RefdomainsHistoryRowSchema = z
	.object({
		date: z.string().nullable().optional(),
		refdomains: z.number().nullable().optional(),
	})
	.loose();

export const RefdomainsHistoryResponseSchema = z.object({
	refdomains: z.array(RefdomainsHistoryRowSchema),
});

export const KeywordsHistoryInputSchema = z.object({
	select: z
		.string()
		.min(1)
		.optional()
		.describe('A comma-separated list of columns to return.'),
	mode: z
		.enum(['exact', 'prefix', 'domain', 'subdomains'])
		.optional()
		.describe('The scope of the target.'),
	target: z
		.string()
		.min(1)
		.describe('The target of the search: a domain or a URL.'),
	portfolio_id: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The unique identifier of the portfolio.'),
	protocol: z
		.enum(['both', 'http', 'https'])
		.optional()
		.describe('The protocol of your target.'),
	country: z
		.string()
		.length(2)
		.optional()
		.describe('A two-letter country code (ISO 3166-1 alpha-2).'),
	date_from: isoDateString.describe(
		'The start date of the historical period in YYYY-MM-DD format.',
	),
	date_to: isoDateString
		.optional()
		.describe('The end date of the historical period in YYYY-MM-DD format.'),
	history_grouping: z
		.enum(['daily', 'weekly', 'monthly'])
		.optional()
		.describe('The time interval used to group historical data.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const KeywordsHistoryRowSchema = z
	.object({
		date: z.string().nullable().optional(),
		top3: z.number().nullable().optional(),
		top4_10: z.number().nullable().optional(),
		top11_20: z.number().nullable().optional(),
		top11_plus: z.number().nullable().optional(),
		top21_50: z.number().nullable().optional(),
		top51_plus: z.number().nullable().optional(),
	})
	.loose();

export const KeywordsHistoryResponseSchema = z.object({
	keywords: z.array(KeywordsHistoryRowSchema),
});

export const LinkedDomainsInputSchema = z.object({
	select: z
		.string()
		.min(1)
		.describe('A comma-separated list of columns to return.'),
	where: z
		.string()
		.optional()
		.describe(
			'Filter expression as a JSON string; see the Ahrefs API docs for the fields this endpoint accepts.',
		),
	order_by: z
		.string()
		.optional()
		.describe(
			'A comma-separated list of columns to order results by, with optional direction.',
		),
	limit: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The number of results to return.'),
	timeout: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('A manual timeout duration in seconds.'),
	mode: z
		.enum(['exact', 'prefix', 'domain', 'subdomains'])
		.optional()
		.describe('The scope of the search based on the target you entered.'),
	target: z
		.string()
		.min(1)
		.describe('The target of the search: a domain or a URL.'),
	portfolio_id: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The unique identifier of the portfolio.'),
	protocol: z
		.enum(['both', 'http', 'https'])
		.optional()
		.describe('The protocol of your target.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const LinkedDomainsRowSchema = z
	.object({
		dofollow_linked_domains: z.number().nullable().optional(),
		dofollow_links: z.number().nullable().optional(),
		dofollow_refdomains: z.number().nullable().optional(),
		domain: z.string().nullable().optional(),
		domain_rating: z.number().nullable().optional(),
		first_seen: z.string().nullable().optional(),
		is_root_domain: z.boolean().nullable().optional(),
		linked_domain_traffic: z.number().nullable().optional(),
		linked_pages: z.number().nullable().optional(),
		links_from_target: z.number().nullable().optional(),
	})
	.loose();

export const LinkedDomainsResponseSchema = z.object({
	linkeddomains: z.array(LinkedDomainsRowSchema),
});

export const PagesByBacklinksInputSchema = z.object({
	select: z
		.string()
		.min(1)
		.describe('A comma-separated list of columns to return.'),
	where: z
		.string()
		.optional()
		.describe(
			'Filter expression as a JSON string; see the Ahrefs API docs for the fields this endpoint accepts.',
		),
	order_by: z.string().optional().describe('A column to order results by.'),
	limit: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The number of results to return.'),
	timeout: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('A manual timeout duration in seconds.'),
	history: z
		.string()
		.optional()
		.describe('A time frame to add lost backlinks to the report.'),
	mode: z
		.enum(['exact', 'prefix', 'domain', 'subdomains'])
		.optional()
		.describe('The scope of the search based on the target you entered.'),
	target: z
		.string()
		.min(1)
		.describe('The target of the search: a domain or a URL.'),
	portfolio_id: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The unique identifier of the portfolio.'),
	protocol: z
		.enum(['both', 'http', 'https'])
		.optional()
		.describe('The protocol of your target.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const PagesByBacklinksRowSchema = z
	.object({
		dofollow_to_target: z.number().nullable().optional(),
		first_seen_link: z.string().nullable().optional(),
		http_code_target: z.number().nullable().optional(),
		is_spam: z.boolean().nullable().optional(),
		languages_target: z.array(z.string()).nullable().optional(),
		last_seen: z.string().nullable().optional(),
		last_visited_source: z.string().nullable().optional(),
		last_visited_target: z.string().nullable().optional(),
		links_to_target: z.number().nullable().optional(),
		lost_links_to_target: z.number().nullable().optional(),
		new_links_to_target: z.number().nullable().optional(),
		nofollow_to_target: z.number().nullable().optional(),
		page_type_target: z.string().nullable().optional(),
		powered_by_target: z.array(z.string()).nullable().optional(),
		redirects_to_target: z.number().nullable().optional(),
		refdomains_target: z.number().nullable().optional(),
		target_redirect: z.string().nullable().optional(),
		title_target: z.string().nullable().optional(),
		top_domain_rating_source: z.number().nullable().optional(),
		url_rating_target: z.number().nullable().optional(),
		url_to: z.string().nullable().optional(),
		url_to_plain: z.string().nullable().optional(),
	})
	.loose();

export const PagesByBacklinksResponseSchema = z.object({
	pages: z.array(PagesByBacklinksRowSchema),
});

export const RankTrackerSerpOverviewInputSchema = z.object({
	project_id: z
		.number()
		.int()
		.positive()
		.describe('The unique identifier of the project.'),
	keyword: z
		.string()
		.min(1)
		.describe('The keyword to return SERP Overview for.'),
	language_code: z
		.string()
		.optional()
		.describe(
			'The language code of a tracked keyword.You can use the management/project-keywords endpoint to get country codes, language codes and location IDs for your track',
		),
	country: z
		.string()
		.length(2)
		.describe('A two-letter country code (ISO 3166-1 alpha-2).'),
	location_id: z
		.number()
		.int()
		.positive()
		.optional()
		.describe(
			'The location ID of a tracked keyword.You can use the management/project-keywords endpoint to get country codes, language codes and location IDs for your tracked',
		),
	date: z
		.string()
		.optional()
		.describe(
			'A timestamp on which the last available SERP Overview is returned in YYYY-MM-DDThh:mm:ss format.',
		),
	device: z
		.enum(['desktop', 'mobile'])
		.describe('Choose between mobile and desktop rankings.'),
	top_positions: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The number of top organic SERP positions to return.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const RankTrackerSerpOverviewRowSchema = z
	.object({
		ahrefs_rank: z.number().nullable().optional(),
		backlinks: z.number().nullable().optional(),
		domain_rating: z.number().nullable().optional(),
		keywords: z.number().nullable().optional(),
		nr_words: z.number().nullable().optional(),
		page_type: z.string().nullable().optional(),
		position: z.number().nullable().optional(),
		refdomains: z.number().nullable().optional(),
		title: z.string().nullable().optional(),
		top_keyword: z.string().nullable().optional(),
		top_keyword_volume: z.number().nullable().optional(),
		traffic: z.number().nullable().optional(),
		type: z.array(z.string()).nullable().optional(),
		update_date: z.string().nullable().optional(),
		url: z.string().nullable().optional(),
		url_rating: z.number().nullable().optional(),
		value: z.number().nullable().optional(),
	})
	.loose();

export const RankTrackerSerpOverviewResponseSchema = z.object({
	positions: z.array(RankTrackerSerpOverviewRowSchema),
});

export const RankTrackerCompetitorsOverviewInputSchema = z.object({
	select: z
		.string()
		.min(1)
		.describe('A comma-separated list of columns to return.'),
	where: z
		.string()
		.optional()
		.describe(
			'Filter expression as a JSON string; see the Ahrefs API docs for the fields this endpoint accepts.',
		),
	order_by: z
		.string()
		.optional()
		.describe(
			'A comma-separated list of columns to order results by, with optional direction.',
		),
	limit: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The number of results to return.'),
	timeout: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('A manual timeout duration in seconds.'),
	volume_mode: z
		.enum(['monthly', 'average'])
		.optional()
		.describe('The search volume calculation mode: monthly or average.'),
	project_id: z
		.number()
		.int()
		.positive()
		.describe('The unique identifier of the project.'),
	device: z
		.enum(['desktop', 'mobile'])
		.describe('Choose between mobile and desktop rankings.'),
	date: isoDateString.describe(
		'A date to report metrics on in YYYY-MM-DD format.',
	),
	date_compared: isoDateString
		.optional()
		.describe('A date to compare metrics with in YYYY-MM-DD format.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const RankTrackerCompetitorsOverviewRowSchema = z
	.object({
		competitors_list: AhrefsOpenList.nullable().optional(),
		country: z.string().nullable().optional(),
		keyword: z.string().nullable().optional(),
		keyword_difficulty: z.number().nullable().optional(),
		keyword_has_data: z.boolean().nullable().optional(),
		keyword_is_frozen: z.boolean().nullable().optional(),
		language: z.string().nullable().optional(),
		location: z.string().nullable().optional(),
		serp_features: z.array(z.string()).nullable().optional(),
		serp_updated: z.string().nullable().optional(),
		serp_updated_prev: z.string().nullable().optional(),
		tags: z.array(z.string()).nullable().optional(),
		volume: z.number().nullable().optional(),
	})
	.loose();

export const RankTrackerCompetitorsOverviewResponseSchema = z.object({
	keywords: z.array(RankTrackerCompetitorsOverviewRowSchema),
});

export const ManagementProjectsInputSchema = z.object({
	access: z
		.enum(['private', 'shared'])
		.optional()
		.describe('The access type of the project.'),
	owned_by: z.string().optional().describe('The email of the project owner'),
	project_id: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The unique identifier of the project.'),
	has_keywords: z.boolean().optional().describe('Has Rank Tracker keywords.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const ManagementProjectsRowSchema = z
	.object({
		access: z.string().nullable().optional(),
		folder: AhrefsOpenObject.nullable().optional(),
		keyword_count: z.number().nullable().optional(),
		mode: z.string().nullable().optional(),
		owned_by: z.string().nullable().optional(),
		project_id: z.string().nullable().optional(),
		project_name: z.string().nullable().optional(),
		protocol: z.string().nullable().optional(),
		url: z.string().nullable().optional(),
		verified: z.boolean().nullable().optional(),
		web_analytics_data_key: z.string().nullable().optional(),
	})
	.loose();

export const ManagementProjectsResponseSchema = z.object({
	projects: z.array(ManagementProjectsRowSchema),
});

export const ManagementProjectKeywordsInputSchema = z.object({
	project_id: z
		.number()
		.int()
		.positive()
		.describe('The unique identifier of the project.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const ManagementProjectKeywordsRowSchema = z
	.object({
		keyword: z.string().nullable().optional(),
		language: z.string().nullable().optional(),
		language_code: z.string().nullable().optional(),
		location: z.string().nullable().optional(),
		location_id: z.number().nullable().optional(),
		tags: z.array(z.string()).nullable().optional(),
	})
	.loose();

export const ManagementProjectKeywordsResponseSchema = z.object({
	keywords: z.array(ManagementProjectKeywordsRowSchema),
});

export const ManagementKeywordListsInputSchema = z.object({
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const ManagementKeywordListsRowSchema = z
	.object({
		access: z.string().nullable().optional(),
		countries: z.array(z.string()).nullable().optional(),
		folder_id: z.string().nullable().optional(),
		keyword_count: z.number().nullable().optional(),
		keyword_list_id: z.string().nullable().optional(),
		location: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
		owned_by: z.string().nullable().optional(),
	})
	.loose();

export const ManagementKeywordListsResponseSchema = z.object({
	keyword_lists: z.array(ManagementKeywordListsRowSchema),
});

export const ManagementKeywordListKeywordsInputSchema = z.object({
	keyword_list_id: z
		.number()
		.int()
		.positive()
		.describe('The id of an existing keyword list.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const ManagementKeywordListKeywordsRowSchema = z
	.object({
		keyword: z.string().nullable().optional(),
	})
	.loose();

export const ManagementKeywordListKeywordsResponseSchema = z.object({
	keywords: z.array(ManagementKeywordListKeywordsRowSchema),
});

export const ManagementLocationsInputSchema = z.object({
	country_code: z
		.string()
		.length(2)
		.describe('A two-letter country code (ISO 3166-1 alpha-2).'),
	us_state: z
		.string()
		.optional()
		.describe('A two-letter US state code (ISO 3166-2:US).'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const ManagementLocationsResponseSchema = z.object({
	location: z
		.object({
			country_code: z.string().nullable().optional(),
			languages: AhrefsOpenList.nullable().optional(),
			locations: AhrefsOpenList.nullable().optional(),
		})
		.loose(),
});

export type GscKeywordsRow = z.infer<typeof GscKeywordsRowSchema>;
export type GscKeywordsInput = z.infer<typeof GscKeywordsInputSchema>;
export type GscKeywordsResponse = z.infer<typeof GscKeywordsResponseSchema>;
export type GscPagesRow = z.infer<typeof GscPagesRowSchema>;
export type GscPagesInput = z.infer<typeof GscPagesInputSchema>;
export type GscPagesResponse = z.infer<typeof GscPagesResponseSchema>;
export type GscPerformanceHistoryRow = z.infer<
	typeof GscPerformanceHistoryRowSchema
>;
export type GscPerformanceHistoryInput = z.infer<
	typeof GscPerformanceHistoryInputSchema
>;
export type GscPerformanceHistoryResponse = z.infer<
	typeof GscPerformanceHistoryResponseSchema
>;
export type GscKeywordHistoryRow = z.infer<typeof GscKeywordHistoryRowSchema>;
export type GscKeywordHistoryInput = z.infer<
	typeof GscKeywordHistoryInputSchema
>;
export type GscKeywordHistoryResponse = z.infer<
	typeof GscKeywordHistoryResponseSchema
>;
export type GscPageHistoryRow = z.infer<typeof GscPageHistoryRowSchema>;
export type GscPageHistoryInput = z.infer<typeof GscPageHistoryInputSchema>;
export type GscPageHistoryResponse = z.infer<
	typeof GscPageHistoryResponseSchema
>;
export type GscPagesHistoryRow = z.infer<typeof GscPagesHistoryRowSchema>;
export type GscPagesHistoryInput = z.infer<typeof GscPagesHistoryInputSchema>;
export type GscPagesHistoryResponse = z.infer<
	typeof GscPagesHistoryResponseSchema
>;
export type GscPositionsHistoryRow = z.infer<
	typeof GscPositionsHistoryRowSchema
>;
export type GscPositionsHistoryInput = z.infer<
	typeof GscPositionsHistoryInputSchema
>;
export type GscPositionsHistoryResponse = z.infer<
	typeof GscPositionsHistoryResponseSchema
>;
export type GscCtrByPositionRow = z.infer<typeof GscCtrByPositionRowSchema>;
export type GscCtrByPositionInput = z.infer<typeof GscCtrByPositionInputSchema>;
export type GscCtrByPositionResponse = z.infer<
	typeof GscCtrByPositionResponseSchema
>;
export type GscPerformanceByDeviceRow = z.infer<
	typeof GscPerformanceByDeviceRowSchema
>;
export type GscPerformanceByDeviceInput = z.infer<
	typeof GscPerformanceByDeviceInputSchema
>;
export type GscPerformanceByDeviceResponse = z.infer<
	typeof GscPerformanceByDeviceResponseSchema
>;
export type GscPerformanceByPositionRow = z.infer<
	typeof GscPerformanceByPositionRowSchema
>;
export type GscPerformanceByPositionInput = z.infer<
	typeof GscPerformanceByPositionInputSchema
>;
export type GscPerformanceByPositionResponse = z.infer<
	typeof GscPerformanceByPositionResponseSchema
>;
export type GscMetricsByCountryRow = z.infer<
	typeof GscMetricsByCountryRowSchema
>;
export type GscMetricsByCountryInput = z.infer<
	typeof GscMetricsByCountryInputSchema
>;
export type GscMetricsByCountryResponse = z.infer<
	typeof GscMetricsByCountryResponseSchema
>;
export type GscAnonymousQueriesRow = z.infer<
	typeof GscAnonymousQueriesRowSchema
>;
export type GscAnonymousQueriesInput = z.infer<
	typeof GscAnonymousQueriesInputSchema
>;
export type GscAnonymousQueriesResponse = z.infer<
	typeof GscAnonymousQueriesResponseSchema
>;
export type SiteAuditProjectsRow = z.infer<typeof SiteAuditProjectsRowSchema>;
export type SiteAuditProjectsInput = z.infer<
	typeof SiteAuditProjectsInputSchema
>;
export type SiteAuditProjectsResponse = z.infer<
	typeof SiteAuditProjectsResponseSchema
>;
export type SiteAuditIssuesRow = z.infer<typeof SiteAuditIssuesRowSchema>;
export type SiteAuditIssuesInput = z.infer<typeof SiteAuditIssuesInputSchema>;
export type SiteAuditIssuesResponse = z.infer<
	typeof SiteAuditIssuesResponseSchema
>;
export type SiteAuditPageExplorerRow = z.infer<
	typeof SiteAuditPageExplorerRowSchema
>;
export type SiteAuditPageExplorerInput = z.infer<
	typeof SiteAuditPageExplorerInputSchema
>;
export type SiteAuditPageExplorerResponse = z.infer<
	typeof SiteAuditPageExplorerResponseSchema
>;
export type SiteAuditPageContentInput = z.infer<
	typeof SiteAuditPageContentInputSchema
>;
export type SiteAuditPageContentResponse = z.infer<
	typeof SiteAuditPageContentResponseSchema
>;
export type MatchingTermsRow = z.infer<typeof MatchingTermsRowSchema>;
export type MatchingTermsInput = z.infer<typeof MatchingTermsInputSchema>;
export type MatchingTermsResponse = z.infer<typeof MatchingTermsResponseSchema>;
export type RelatedTermsRow = z.infer<typeof RelatedTermsRowSchema>;
export type RelatedTermsInput = z.infer<typeof RelatedTermsInputSchema>;
export type RelatedTermsResponse = z.infer<typeof RelatedTermsResponseSchema>;
export type SearchSuggestionsRow = z.infer<typeof SearchSuggestionsRowSchema>;
export type SearchSuggestionsInput = z.infer<
	typeof SearchSuggestionsInputSchema
>;
export type SearchSuggestionsResponse = z.infer<
	typeof SearchSuggestionsResponseSchema
>;
export type VolumeHistoryRow = z.infer<typeof VolumeHistoryRowSchema>;
export type VolumeHistoryInput = z.infer<typeof VolumeHistoryInputSchema>;
export type VolumeHistoryResponse = z.infer<typeof VolumeHistoryResponseSchema>;
export type VolumeByCountryRow = z.infer<typeof VolumeByCountryRowSchema>;
export type VolumeByCountryInput = z.infer<typeof VolumeByCountryInputSchema>;
export type VolumeByCountryResponse = z.infer<
	typeof VolumeByCountryResponseSchema
>;
export type SiteMetricsInput = z.infer<typeof SiteMetricsInputSchema>;
export type SiteMetricsResponse = z.infer<typeof SiteMetricsResponseSchema>;
export type MetricsHistoryRow = z.infer<typeof MetricsHistoryRowSchema>;
export type MetricsHistoryInput = z.infer<typeof MetricsHistoryInputSchema>;
export type MetricsHistoryResponse = z.infer<
	typeof MetricsHistoryResponseSchema
>;
export type DomainRatingHistoryRow = z.infer<
	typeof DomainRatingHistoryRowSchema
>;
export type DomainRatingHistoryInput = z.infer<
	typeof DomainRatingHistoryInputSchema
>;
export type DomainRatingHistoryResponse = z.infer<
	typeof DomainRatingHistoryResponseSchema
>;
export type AllBacklinksRow = z.infer<typeof AllBacklinksRowSchema>;
export type AllBacklinksInput = z.infer<typeof AllBacklinksInputSchema>;
export type AllBacklinksResponse = z.infer<typeof AllBacklinksResponseSchema>;
export type BrokenBacklinksRow = z.infer<typeof BrokenBacklinksRowSchema>;
export type BrokenBacklinksInput = z.infer<typeof BrokenBacklinksInputSchema>;
export type BrokenBacklinksResponse = z.infer<
	typeof BrokenBacklinksResponseSchema
>;
export type AnchorsRow = z.infer<typeof AnchorsRowSchema>;
export type AnchorsInput = z.infer<typeof AnchorsInputSchema>;
export type AnchorsResponse = z.infer<typeof AnchorsResponseSchema>;
export type OrganicCompetitorsRow = z.infer<typeof OrganicCompetitorsRowSchema>;
export type OrganicCompetitorsInput = z.infer<
	typeof OrganicCompetitorsInputSchema
>;
export type OrganicCompetitorsResponse = z.infer<
	typeof OrganicCompetitorsResponseSchema
>;
export type PagesByTrafficInput = z.infer<typeof PagesByTrafficInputSchema>;
export type PagesByTrafficResponse = z.infer<
	typeof PagesByTrafficResponseSchema
>;
export type RefdomainsHistoryRow = z.infer<typeof RefdomainsHistoryRowSchema>;
export type RefdomainsHistoryInput = z.infer<
	typeof RefdomainsHistoryInputSchema
>;
export type RefdomainsHistoryResponse = z.infer<
	typeof RefdomainsHistoryResponseSchema
>;
export type KeywordsHistoryRow = z.infer<typeof KeywordsHistoryRowSchema>;
export type KeywordsHistoryInput = z.infer<typeof KeywordsHistoryInputSchema>;
export type KeywordsHistoryResponse = z.infer<
	typeof KeywordsHistoryResponseSchema
>;
export type LinkedDomainsRow = z.infer<typeof LinkedDomainsRowSchema>;
export type LinkedDomainsInput = z.infer<typeof LinkedDomainsInputSchema>;
export type LinkedDomainsResponse = z.infer<typeof LinkedDomainsResponseSchema>;
export type PagesByBacklinksRow = z.infer<typeof PagesByBacklinksRowSchema>;
export type PagesByBacklinksInput = z.infer<typeof PagesByBacklinksInputSchema>;
export type PagesByBacklinksResponse = z.infer<
	typeof PagesByBacklinksResponseSchema
>;
export type RankTrackerSerpOverviewRow = z.infer<
	typeof RankTrackerSerpOverviewRowSchema
>;
export type RankTrackerSerpOverviewInput = z.infer<
	typeof RankTrackerSerpOverviewInputSchema
>;
export type RankTrackerSerpOverviewResponse = z.infer<
	typeof RankTrackerSerpOverviewResponseSchema
>;
export type RankTrackerCompetitorsOverviewRow = z.infer<
	typeof RankTrackerCompetitorsOverviewRowSchema
>;
export type RankTrackerCompetitorsOverviewInput = z.infer<
	typeof RankTrackerCompetitorsOverviewInputSchema
>;
export type RankTrackerCompetitorsOverviewResponse = z.infer<
	typeof RankTrackerCompetitorsOverviewResponseSchema
>;
export type ManagementProjectsRow = z.infer<typeof ManagementProjectsRowSchema>;
export type ManagementProjectsInput = z.infer<
	typeof ManagementProjectsInputSchema
>;
export type ManagementProjectsResponse = z.infer<
	typeof ManagementProjectsResponseSchema
>;
export type ManagementProjectKeywordsRow = z.infer<
	typeof ManagementProjectKeywordsRowSchema
>;
export type ManagementProjectKeywordsInput = z.infer<
	typeof ManagementProjectKeywordsInputSchema
>;
export type ManagementProjectKeywordsResponse = z.infer<
	typeof ManagementProjectKeywordsResponseSchema
>;
export type ManagementKeywordListsRow = z.infer<
	typeof ManagementKeywordListsRowSchema
>;
export type ManagementKeywordListsInput = z.infer<
	typeof ManagementKeywordListsInputSchema
>;
export type ManagementKeywordListsResponse = z.infer<
	typeof ManagementKeywordListsResponseSchema
>;
export type ManagementKeywordListKeywordsRow = z.infer<
	typeof ManagementKeywordListKeywordsRowSchema
>;
export type ManagementKeywordListKeywordsInput = z.infer<
	typeof ManagementKeywordListKeywordsInputSchema
>;
export type ManagementKeywordListKeywordsResponse = z.infer<
	typeof ManagementKeywordListKeywordsResponseSchema
>;
export type ManagementLocationsInput = z.infer<
	typeof ManagementLocationsInputSchema
>;
export type ManagementLocationsResponse = z.infer<
	typeof ManagementLocationsResponseSchema
>;

// Web Analytics, Brand Radar, social media, management writes and the
// remaining Site Explorer, Rank Tracker and public reads.

// Web Analytics: 34 endpoints share these inputs and rows. Each table lists
// visitors by one dimension (page, browser, country...) and each chart adds a
// timestamp; the dimension field is the only part that differs.
const webAnalyticsBaseInput = {
	project_id: z
		.number()
		.int()
		.positive()
		.describe('The ID of the Ahrefs project that has Web Analytics installed.'),
	from: z
		.string()
		.optional()
		.describe('Start of the period, e.g. 2026-10-01 or 2026-10-01T00:00:00Z.'),
	to: z
		.string()
		.optional()
		.describe('End of the period, in the same format as from.'),
	where: z
		.string()
		.optional()
		.describe(
			'Filter expression as a JSON string over dimensions and metrics; see the Ahrefs API docs.',
		),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
};

export const WebAnalyticsTableInputSchema = z.object({
	...webAnalyticsBaseInput,
	order_by: z
		.string()
		.optional()
		.describe('Order by a metric, as metric:desc or metric:asc.'),
	limit: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The number of results to return.'),
});

export const WebAnalyticsChartInputSchema = z.object({
	...webAnalyticsBaseInput,
	granularity: z
		.enum(['hourly', 'daily', 'weekly', 'monthly'])
		.describe('The time step between chart points.'),
});

const webAnalyticsUtmParam = z
	.enum(['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'])
	.describe('The UTM parameter to group visitors by.');

export const WebAnalyticsUtmTableInputSchema =
	WebAnalyticsTableInputSchema.extend({ utm_param: webAnalyticsUtmParam });

export const WebAnalyticsUtmChartInputSchema =
	WebAnalyticsChartInputSchema.extend({ utm_param: webAnalyticsUtmParam });

const webAnalyticsMetric = z.number().nullable().optional();
// Ahrefs sends counts (visitors, visits, pageviews, entries, exits) as numeric
// strings such as "689", although its OpenAPI spec says integer.
const webAnalyticsCount = z
	.union([z.number(), z.string()])
	.nullable()
	.optional();

export const WebAnalyticsMetricsSchema = z
	.object({
		visitors: webAnalyticsCount,
		visits: webAnalyticsCount,
		pageviews: webAnalyticsCount,
		session_bounce_rate: webAnalyticsMetric,
		avg_session_duration_sec: webAnalyticsMetric,
		avg_session_length: webAnalyticsMetric,
		avg_page_visit_duration_sec: webAnalyticsMetric,
		entries: webAnalyticsCount,
		exits: webAnalyticsCount,
		exit_rate: webAnalyticsMetric,
	})
	.loose();

const webAnalyticsDimensionValue = z.string().nullable().optional();
const webAnalyticsTimestamp = z.string().nullable().optional();

function webAnalyticsRow<const D extends string>(dimension: D) {
	return WebAnalyticsMetricsSchema.extend({
		[dimension]: webAnalyticsDimensionValue,
	} as {
		[K in D]: typeof webAnalyticsDimensionValue;
	}).loose();
}

/** `{ stats: [...] }` rows of visitors by one dimension. */
export function webAnalyticsTableResponse<const D extends string>(
	dimension: D,
) {
	return z.object({ stats: z.array(webAnalyticsRow(dimension)) });
}

/** `{ points: [...] }` chart rows of visitors by one dimension over time. */
export function webAnalyticsChartResponse<const D extends string>(
	dimension: D,
) {
	return z.object({
		points: z.array(
			webAnalyticsRow(dimension)
				.extend({ timestamp: webAnalyticsTimestamp })
				.loose(),
		),
	});
}

export const WebAnalyticsStatsResponseShape = z.object({
	stats: WebAnalyticsMetricsSchema,
});

export const WebAnalyticsChartResponseShape = z.object({
	points: z.array(
		WebAnalyticsMetricsSchema.extend({
			timestamp: webAnalyticsTimestamp,
		}).loose(),
	),
});

export const WebAnalyticsStatsInputSchema = WebAnalyticsTableInputSchema;
export const WebAnalyticsStatsResponseSchema = WebAnalyticsStatsResponseShape;
export type WebAnalyticsStatsInput = z.infer<
	typeof WebAnalyticsStatsInputSchema
>;
export type WebAnalyticsStatsResponse = z.infer<
	typeof WebAnalyticsStatsResponseSchema
>;

export const WebAnalyticsTotalsChartInputSchema = WebAnalyticsChartInputSchema;
export const WebAnalyticsTotalsChartResponseSchema =
	WebAnalyticsChartResponseShape;
export type WebAnalyticsTotalsChartInput = z.infer<
	typeof WebAnalyticsTotalsChartInputSchema
>;
export type WebAnalyticsTotalsChartResponse = z.infer<
	typeof WebAnalyticsTotalsChartResponseSchema
>;

export const WebAnalyticsTopPagesInputSchema = WebAnalyticsTableInputSchema;
export const WebAnalyticsTopPagesResponseSchema =
	webAnalyticsTableResponse('page');
export type WebAnalyticsTopPagesInput = z.infer<
	typeof WebAnalyticsTopPagesInputSchema
>;
export type WebAnalyticsTopPagesResponse = z.infer<
	typeof WebAnalyticsTopPagesResponseSchema
>;

export const WebAnalyticsTopPagesChartInputSchema =
	WebAnalyticsChartInputSchema.extend({
		pages_to_chart: z
			.string()
			.optional()
			.describe(
				'Comma-separated page values to chart; the top ones are charted when omitted.',
			),
	});
export const WebAnalyticsTopPagesChartResponseSchema =
	webAnalyticsChartResponse('page');
export type WebAnalyticsTopPagesChartInput = z.infer<
	typeof WebAnalyticsTopPagesChartInputSchema
>;
export type WebAnalyticsTopPagesChartResponse = z.infer<
	typeof WebAnalyticsTopPagesChartResponseSchema
>;

export const WebAnalyticsEntryPagesInputSchema = WebAnalyticsTableInputSchema;
export const WebAnalyticsEntryPagesResponseSchema =
	webAnalyticsTableResponse('entry_page');
export type WebAnalyticsEntryPagesInput = z.infer<
	typeof WebAnalyticsEntryPagesInputSchema
>;
export type WebAnalyticsEntryPagesResponse = z.infer<
	typeof WebAnalyticsEntryPagesResponseSchema
>;

export const WebAnalyticsEntryPagesChartInputSchema =
	WebAnalyticsChartInputSchema.extend({
		entry_pages_to_chart: z
			.string()
			.optional()
			.describe(
				'Comma-separated entry page values to chart; the top ones are charted when omitted.',
			),
	});
export const WebAnalyticsEntryPagesChartResponseSchema =
	webAnalyticsChartResponse('entry_page');
export type WebAnalyticsEntryPagesChartInput = z.infer<
	typeof WebAnalyticsEntryPagesChartInputSchema
>;
export type WebAnalyticsEntryPagesChartResponse = z.infer<
	typeof WebAnalyticsEntryPagesChartResponseSchema
>;

export const WebAnalyticsExitPagesInputSchema = WebAnalyticsTableInputSchema;
export const WebAnalyticsExitPagesResponseSchema =
	webAnalyticsTableResponse('exit_page');
export type WebAnalyticsExitPagesInput = z.infer<
	typeof WebAnalyticsExitPagesInputSchema
>;
export type WebAnalyticsExitPagesResponse = z.infer<
	typeof WebAnalyticsExitPagesResponseSchema
>;

export const WebAnalyticsExitPagesChartInputSchema =
	WebAnalyticsChartInputSchema.extend({
		exit_pages_to_chart: z
			.string()
			.optional()
			.describe(
				'Comma-separated exit page values to chart; the top ones are charted when omitted.',
			),
	});
export const WebAnalyticsExitPagesChartResponseSchema =
	webAnalyticsChartResponse('exit_page');
export type WebAnalyticsExitPagesChartInput = z.infer<
	typeof WebAnalyticsExitPagesChartInputSchema
>;
export type WebAnalyticsExitPagesChartResponse = z.infer<
	typeof WebAnalyticsExitPagesChartResponseSchema
>;

export const WebAnalyticsReferrersInputSchema = WebAnalyticsTableInputSchema;
export const WebAnalyticsReferrersResponseSchema =
	webAnalyticsTableResponse('source_referer');
export type WebAnalyticsReferrersInput = z.infer<
	typeof WebAnalyticsReferrersInputSchema
>;
export type WebAnalyticsReferrersResponse = z.infer<
	typeof WebAnalyticsReferrersResponseSchema
>;

export const WebAnalyticsReferrersChartInputSchema =
	WebAnalyticsChartInputSchema.extend({
		source_referers_to_chart: z
			.string()
			.optional()
			.describe(
				'Comma-separated referrer values to chart; the top ones are charted when omitted.',
			),
	});
export const WebAnalyticsReferrersChartResponseSchema =
	webAnalyticsChartResponse('source_referer');
export type WebAnalyticsReferrersChartInput = z.infer<
	typeof WebAnalyticsReferrersChartInputSchema
>;
export type WebAnalyticsReferrersChartResponse = z.infer<
	typeof WebAnalyticsReferrersChartResponseSchema
>;

export const WebAnalyticsSourcesInputSchema = WebAnalyticsTableInputSchema;
export const WebAnalyticsSourcesResponseSchema =
	webAnalyticsTableResponse('source');
export type WebAnalyticsSourcesInput = z.infer<
	typeof WebAnalyticsSourcesInputSchema
>;
export type WebAnalyticsSourcesResponse = z.infer<
	typeof WebAnalyticsSourcesResponseSchema
>;

export const WebAnalyticsSourcesChartInputSchema =
	WebAnalyticsChartInputSchema.extend({
		sources_to_chart: z
			.string()
			.optional()
			.describe(
				'Comma-separated traffic source values to chart; the top ones are charted when omitted.',
			),
	});
export const WebAnalyticsSourcesChartResponseSchema =
	webAnalyticsChartResponse('source');
export type WebAnalyticsSourcesChartInput = z.infer<
	typeof WebAnalyticsSourcesChartInputSchema
>;
export type WebAnalyticsSourcesChartResponse = z.infer<
	typeof WebAnalyticsSourcesChartResponseSchema
>;

export const WebAnalyticsSourceChannelsInputSchema =
	WebAnalyticsTableInputSchema;
export const WebAnalyticsSourceChannelsResponseSchema =
	webAnalyticsTableResponse('source_channel');
export type WebAnalyticsSourceChannelsInput = z.infer<
	typeof WebAnalyticsSourceChannelsInputSchema
>;
export type WebAnalyticsSourceChannelsResponse = z.infer<
	typeof WebAnalyticsSourceChannelsResponseSchema
>;

export const WebAnalyticsSourceChannelsChartInputSchema =
	WebAnalyticsChartInputSchema.extend({
		source_channels_to_chart: z
			.string()
			.optional()
			.describe(
				'Comma-separated source channel values to chart; the top ones are charted when omitted.',
			),
	});
export const WebAnalyticsSourceChannelsChartResponseSchema =
	webAnalyticsChartResponse('source_channel');
export type WebAnalyticsSourceChannelsChartInput = z.infer<
	typeof WebAnalyticsSourceChannelsChartInputSchema
>;
export type WebAnalyticsSourceChannelsChartResponse = z.infer<
	typeof WebAnalyticsSourceChannelsChartResponseSchema
>;

export const WebAnalyticsUtmParamsInputSchema = WebAnalyticsUtmTableInputSchema;
export const WebAnalyticsUtmParamsResponseSchema =
	webAnalyticsTableResponse('utm_param');
export type WebAnalyticsUtmParamsInput = z.infer<
	typeof WebAnalyticsUtmParamsInputSchema
>;
export type WebAnalyticsUtmParamsResponse = z.infer<
	typeof WebAnalyticsUtmParamsResponseSchema
>;

export const WebAnalyticsUtmParamsChartInputSchema =
	WebAnalyticsUtmChartInputSchema.extend({
		utm_params_to_chart: z
			.string()
			.optional()
			.describe(
				'Comma-separated UTM parameter value values to chart; the top ones are charted when omitted.',
			),
	});
export const WebAnalyticsUtmParamsChartResponseSchema =
	webAnalyticsChartResponse('utm_param');
export type WebAnalyticsUtmParamsChartInput = z.infer<
	typeof WebAnalyticsUtmParamsChartInputSchema
>;
export type WebAnalyticsUtmParamsChartResponse = z.infer<
	typeof WebAnalyticsUtmParamsChartResponseSchema
>;

export const WebAnalyticsCountriesInputSchema = WebAnalyticsTableInputSchema;
export const WebAnalyticsCountriesResponseSchema =
	webAnalyticsTableResponse('country');
export type WebAnalyticsCountriesInput = z.infer<
	typeof WebAnalyticsCountriesInputSchema
>;
export type WebAnalyticsCountriesResponse = z.infer<
	typeof WebAnalyticsCountriesResponseSchema
>;

export const WebAnalyticsCountriesChartInputSchema =
	WebAnalyticsChartInputSchema.extend({
		countries_to_chart: z
			.string()
			.optional()
			.describe(
				'Comma-separated country values to chart; the top ones are charted when omitted.',
			),
	});
export const WebAnalyticsCountriesChartResponseSchema =
	webAnalyticsChartResponse('country');
export type WebAnalyticsCountriesChartInput = z.infer<
	typeof WebAnalyticsCountriesChartInputSchema
>;
export type WebAnalyticsCountriesChartResponse = z.infer<
	typeof WebAnalyticsCountriesChartResponseSchema
>;

export const WebAnalyticsCitiesInputSchema = WebAnalyticsTableInputSchema;
export const WebAnalyticsCitiesResponseSchema =
	webAnalyticsTableResponse('city');
export type WebAnalyticsCitiesInput = z.infer<
	typeof WebAnalyticsCitiesInputSchema
>;
export type WebAnalyticsCitiesResponse = z.infer<
	typeof WebAnalyticsCitiesResponseSchema
>;

export const WebAnalyticsCitiesChartInputSchema =
	WebAnalyticsChartInputSchema.extend({
		cities_to_chart: z
			.string()
			.optional()
			.describe(
				'Comma-separated city values to chart; the top ones are charted when omitted.',
			),
	});
export const WebAnalyticsCitiesChartResponseSchema =
	webAnalyticsChartResponse('city');
export type WebAnalyticsCitiesChartInput = z.infer<
	typeof WebAnalyticsCitiesChartInputSchema
>;
export type WebAnalyticsCitiesChartResponse = z.infer<
	typeof WebAnalyticsCitiesChartResponseSchema
>;

export const WebAnalyticsContinentsInputSchema = WebAnalyticsTableInputSchema;
export const WebAnalyticsContinentsResponseSchema =
	webAnalyticsTableResponse('continent');
export type WebAnalyticsContinentsInput = z.infer<
	typeof WebAnalyticsContinentsInputSchema
>;
export type WebAnalyticsContinentsResponse = z.infer<
	typeof WebAnalyticsContinentsResponseSchema
>;

export const WebAnalyticsContinentsChartInputSchema =
	WebAnalyticsChartInputSchema.extend({
		continents_to_chart: z
			.string()
			.optional()
			.describe(
				'Comma-separated continent values to chart; the top ones are charted when omitted.',
			),
	});
export const WebAnalyticsContinentsChartResponseSchema =
	webAnalyticsChartResponse('continent');
export type WebAnalyticsContinentsChartInput = z.infer<
	typeof WebAnalyticsContinentsChartInputSchema
>;
export type WebAnalyticsContinentsChartResponse = z.infer<
	typeof WebAnalyticsContinentsChartResponseSchema
>;

export const WebAnalyticsLanguagesInputSchema = WebAnalyticsTableInputSchema;
export const WebAnalyticsLanguagesResponseSchema =
	webAnalyticsTableResponse('browser_language');
export type WebAnalyticsLanguagesInput = z.infer<
	typeof WebAnalyticsLanguagesInputSchema
>;
export type WebAnalyticsLanguagesResponse = z.infer<
	typeof WebAnalyticsLanguagesResponseSchema
>;

export const WebAnalyticsLanguagesChartInputSchema =
	WebAnalyticsChartInputSchema.extend({
		browser_language_to_chart: z
			.string()
			.optional()
			.describe(
				'Comma-separated browser language values to chart; the top ones are charted when omitted.',
			),
	});
export const WebAnalyticsLanguagesChartResponseSchema =
	webAnalyticsChartResponse('browser_language');
export type WebAnalyticsLanguagesChartInput = z.infer<
	typeof WebAnalyticsLanguagesChartInputSchema
>;
export type WebAnalyticsLanguagesChartResponse = z.infer<
	typeof WebAnalyticsLanguagesChartResponseSchema
>;

export const WebAnalyticsDevicesInputSchema = WebAnalyticsTableInputSchema;
export const WebAnalyticsDevicesResponseSchema =
	webAnalyticsTableResponse('device');
export type WebAnalyticsDevicesInput = z.infer<
	typeof WebAnalyticsDevicesInputSchema
>;
export type WebAnalyticsDevicesResponse = z.infer<
	typeof WebAnalyticsDevicesResponseSchema
>;

export const WebAnalyticsDevicesChartInputSchema =
	WebAnalyticsChartInputSchema.extend({
		devices_to_chart: z
			.string()
			.optional()
			.describe(
				'Comma-separated device type values to chart; the top ones are charted when omitted.',
			),
	});
export const WebAnalyticsDevicesChartResponseSchema =
	webAnalyticsChartResponse('device');
export type WebAnalyticsDevicesChartInput = z.infer<
	typeof WebAnalyticsDevicesChartInputSchema
>;
export type WebAnalyticsDevicesChartResponse = z.infer<
	typeof WebAnalyticsDevicesChartResponseSchema
>;

export const WebAnalyticsBrowsersInputSchema = WebAnalyticsTableInputSchema;
export const WebAnalyticsBrowsersResponseSchema =
	webAnalyticsTableResponse('browser');
export type WebAnalyticsBrowsersInput = z.infer<
	typeof WebAnalyticsBrowsersInputSchema
>;
export type WebAnalyticsBrowsersResponse = z.infer<
	typeof WebAnalyticsBrowsersResponseSchema
>;

export const WebAnalyticsBrowsersChartInputSchema =
	WebAnalyticsChartInputSchema.extend({
		browser_to_chart: z
			.string()
			.optional()
			.describe(
				'Comma-separated browser values to chart; the top ones are charted when omitted.',
			),
	});
export const WebAnalyticsBrowsersChartResponseSchema =
	webAnalyticsChartResponse('browser');
export type WebAnalyticsBrowsersChartInput = z.infer<
	typeof WebAnalyticsBrowsersChartInputSchema
>;
export type WebAnalyticsBrowsersChartResponse = z.infer<
	typeof WebAnalyticsBrowsersChartResponseSchema
>;

export const WebAnalyticsBrowserVersionsInputSchema =
	WebAnalyticsTableInputSchema;
export const WebAnalyticsBrowserVersionsResponseSchema =
	webAnalyticsTableResponse('browser_version');
export type WebAnalyticsBrowserVersionsInput = z.infer<
	typeof WebAnalyticsBrowserVersionsInputSchema
>;
export type WebAnalyticsBrowserVersionsResponse = z.infer<
	typeof WebAnalyticsBrowserVersionsResponseSchema
>;

export const WebAnalyticsBrowserVersionsChartInputSchema =
	WebAnalyticsChartInputSchema.extend({
		browser_version_to_chart: z
			.string()
			.optional()
			.describe(
				'Comma-separated browser version values to chart; the top ones are charted when omitted.',
			),
	});
export const WebAnalyticsBrowserVersionsChartResponseSchema =
	webAnalyticsChartResponse('browser_version');
export type WebAnalyticsBrowserVersionsChartInput = z.infer<
	typeof WebAnalyticsBrowserVersionsChartInputSchema
>;
export type WebAnalyticsBrowserVersionsChartResponse = z.infer<
	typeof WebAnalyticsBrowserVersionsChartResponseSchema
>;

export const WebAnalyticsOperatingSystemsInputSchema =
	WebAnalyticsTableInputSchema;
export const WebAnalyticsOperatingSystemsResponseSchema =
	webAnalyticsTableResponse('os');
export type WebAnalyticsOperatingSystemsInput = z.infer<
	typeof WebAnalyticsOperatingSystemsInputSchema
>;
export type WebAnalyticsOperatingSystemsResponse = z.infer<
	typeof WebAnalyticsOperatingSystemsResponseSchema
>;

export const WebAnalyticsOperatingSystemsChartInputSchema =
	WebAnalyticsChartInputSchema.extend({
		os_to_chart: z
			.string()
			.optional()
			.describe(
				'Comma-separated operating system values to chart; the top ones are charted when omitted.',
			),
	});
export const WebAnalyticsOperatingSystemsChartResponseSchema =
	webAnalyticsChartResponse('os');
export type WebAnalyticsOperatingSystemsChartInput = z.infer<
	typeof WebAnalyticsOperatingSystemsChartInputSchema
>;
export type WebAnalyticsOperatingSystemsChartResponse = z.infer<
	typeof WebAnalyticsOperatingSystemsChartResponseSchema
>;

export const WebAnalyticsOperatingSystemsVersionsInputSchema =
	WebAnalyticsTableInputSchema;
export const WebAnalyticsOperatingSystemsVersionsResponseSchema =
	webAnalyticsTableResponse('os_version');
export type WebAnalyticsOperatingSystemsVersionsInput = z.infer<
	typeof WebAnalyticsOperatingSystemsVersionsInputSchema
>;
export type WebAnalyticsOperatingSystemsVersionsResponse = z.infer<
	typeof WebAnalyticsOperatingSystemsVersionsResponseSchema
>;

export const WebAnalyticsOperatingSystemsVersionsChartInputSchema =
	WebAnalyticsChartInputSchema.extend({
		os_versions_to_chart: z
			.string()
			.optional()
			.describe(
				'Comma-separated operating system version values to chart; the top ones are charted when omitted.',
			),
	});
export const WebAnalyticsOperatingSystemsVersionsChartResponseSchema =
	webAnalyticsChartResponse('os_version');
export type WebAnalyticsOperatingSystemsVersionsChartInput = z.infer<
	typeof WebAnalyticsOperatingSystemsVersionsChartInputSchema
>;
export type WebAnalyticsOperatingSystemsVersionsChartResponse = z.infer<
	typeof WebAnalyticsOperatingSystemsVersionsChartResponseSchema
>;

export const BrandRadarAiResponsesInputSchema = z.object({
	select: z
		.string()
		.min(1)
		.describe('A comma-separated list of fields to return.'),
	where: z
		.string()
		.optional()
		.describe(
			'Filter expression as a JSON string; see the Ahrefs API docs for the fields this endpoint accepts.',
		),
	report_id: z.string().optional().describe('The ID of the report to use.'),
	brand: z
		.string()
		.optional()
		.describe('A comma-separated list of brands to search for.'),
	competitors: z
		.string()
		.optional()
		.describe('A comma-separated list of competitors of your brands.'),
	data_source: z
		.string()
		.min(1)
		.describe(
			'Comma-separated chatbot models: chatgpt, google_ai_overviews, google_ai_mode, gemini, perplexity, copilot, claude (custom prompts only), grok, google_ai_overviews_keywords, google_ai_mode_keywords.',
		),
	country: z
		.string()
		.optional()
		.describe(
			'A comma-separated list of two-letter country codes (ISO 3166-1 alpha-2).',
		),
	prompts: z
		.enum(['ahrefs', 'custom'])
		.optional()
		.describe('The type of prompts to use.'),
	limit: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The number of results to return.'),
	date: isoDateString
		.optional()
		.describe('The date to search for in YYYY-MM-DD format.'),
	date_compared: isoDateString
		.optional()
		.describe('A date to compare date with, in YYYY-MM-DD format.'),
	order_by: z
		.enum(['relevance', 'volume'])
		.optional()
		.describe('A column to order the results by.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const BrandRadarAiResponsesRowSchema = z
	.object({
		brand_sentiment: AhrefsOpenList.nullable().optional(),
		country: z.string().nullable().optional(),
		data_source: z.string().nullable().optional(),
		funnel_stage: z.string().nullable().optional(),
		intent: z.array(z.string()).nullable().optional(),
		last_updated: z.string().nullable().optional(),
		links: AhrefsOpenList.nullable().optional(),
		question: z.string().nullable().optional(),
		response: z.string().nullable().optional(),
		search_queries: z.array(z.string()).nullable().optional(),
		status: z.string().nullable().optional(),
		tags: z.array(z.string()).nullable().optional(),
		volume: z.number().nullable().optional(),
	})
	.loose();

export const BrandRadarAiResponsesResponseSchema = z.object({
	ai_responses: z.array(BrandRadarAiResponsesRowSchema),
});

export type BrandRadarAiResponsesRow = z.infer<
	typeof BrandRadarAiResponsesRowSchema
>;

export type BrandRadarAiResponsesInput = z.infer<
	typeof BrandRadarAiResponsesInputSchema
>;
export type BrandRadarAiResponsesResponse = z.infer<
	typeof BrandRadarAiResponsesResponseSchema
>;

export const BrandRadarAiResponsesEntitiesInputSchema = z.object({
	select: z.array(z.string().min(1)).describe('A list of fields to return.'),
	where: AhrefsFilterExpression.optional().describe(
		'Filter expression as a JSON object; see the Ahrefs API docs for the fields this endpoint accepts.',
	),
	report_id: z.string().optional().describe('The ID of the report to use.'),
	brands: z
		.array(
			z.object({
				names: z.array(z.string()).optional(),
				url_groups: z
					.array(
						z.object({
							target: z.string().min(1),
							scope: z.enum(['url', 'path', 'domain', 'subdomains']),
						}),
					)
					.optional(),
			}),
		)
		.optional()
		.describe('A list of brand names and websites to search for.'),
	competitors: z
		.array(
			z.object({
				names: z.array(z.string()).optional(),
				url_groups: z
					.array(
						z.object({
							target: z.string().min(1),
							scope: z.enum(['url', 'path', 'domain', 'subdomains']),
						}),
					)
					.optional(),
			}),
		)
		.optional()
		.describe('A list of competitor names and websites to search for.'),
	content_filter: z
		.object({
			include: z.array(z.string()).optional(),
			exclude: z.array(z.string()).optional(),
		})
		.optional()
		.describe(
			'Optional phrases used to include or exclude results based on their content.',
		),
	data_source: z
		.array(
			z.enum([
				'chatgpt',
				'google_ai_overviews',
				'google_ai_mode',
				'gemini',
				'perplexity',
				'copilot',
				'claude',
				'grok',
				'google_ai_overviews_keywords',
				'google_ai_mode_keywords',
			]),
		)
		.describe('A list of chatbot models.'),
	country: z
		.array(z.string().length(2))
		.optional()
		.describe('A list of two-letter country codes (ISO 3166-1 alpha-2).'),
	prompts: z
		.enum(['ahrefs', 'custom'])
		.optional()
		.describe('The type of prompts to use.'),
	limit: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The number of results to return.'),
	date: isoDateString
		.optional()
		.describe('The date to search for in YYYY-MM-DD format.'),
	date_compared: isoDateString
		.optional()
		.describe('A date to compare date with, in YYYY-MM-DD format.'),
	order_by: z
		.union([
			z.enum(['relevance', 'volume']),
			z.object({
				direction: z.enum(['most_negative', 'most_positive']),
				brand: z.string(),
				aspect: z
					.enum([
						'features_specs',
						'performance_effectiveness',
						'price_value',
						'reputation_popularity',
						'quality_reliability',
						'design_comfort',
						'usability_compatibility',
						'availability_delivery',
						'safety_health',
						'service_support',
						'general',
					])
					.optional(),
			}),
		])
		.optional()
		.describe(
			'How to order the results: a column, or how the responses talk about one brand, as the Sentiment page in Brand Radar can.',
		),
	tags_filter: AhrefsFilterExpression.optional().describe(
		'A filter expression for prompt tags.',
	),
	brand_filter: AhrefsFilterExpression.optional().describe(
		'A filter expression for your brand\'s visibility, mirroring the "Your brand" filter.',
	),
	volume_range: z
		.object({
			from: z.number().int().optional(),
			to: z.number().int().optional(),
		})
		.optional()
		.describe('The volume range to filter by.'),
	changes: z
		.object({
			prompt: z.array(z.enum(['new', 'lost', 'no_change'])).optional(),
			mentions: z.array(z.enum(['new', 'lost', 'no_change'])).optional(),
			citations: z.array(z.enum(['new', 'lost', 'no_change'])).optional(),
		})
		.optional()
		.describe('Requires date_compared.'),
	sentiment_filter: AhrefsFilterExpression.optional().describe(
		'A filter on how the responses talk about your brands and competitors, like the Sentiment filter in Brand Radar.',
	),
	opinions_first: z
		.boolean()
		.optional()
		.describe(
			'Puts the responses with a positive, negative or mixed mention of a tracked brand before the others, each group by relevance, as the Sentiment page in Brand Rada',
		),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const BrandRadarAiResponsesEntitiesRowSchema = z
	.object({
		brand_sentiment: AhrefsOpenList.nullable().optional(),
		country: z.string().nullable().optional(),
		data_source: z.string().nullable().optional(),
		funnel_stage: z.string().nullable().optional(),
		intent: z.array(z.string()).nullable().optional(),
		last_updated: z.string().nullable().optional(),
		links: AhrefsOpenList.nullable().optional(),
		question: z.string().nullable().optional(),
		response: z.string().nullable().optional(),
		search_queries: z.array(z.string()).nullable().optional(),
		status: z.string().nullable().optional(),
		tags: z.array(z.string()).nullable().optional(),
		volume: z.number().nullable().optional(),
	})
	.loose();

export const BrandRadarAiResponsesEntitiesResponseSchema = z.object({
	ai_responses: z.array(BrandRadarAiResponsesEntitiesRowSchema),
});

export type BrandRadarAiResponsesEntitiesRow = z.infer<
	typeof BrandRadarAiResponsesEntitiesRowSchema
>;

export type BrandRadarAiResponsesEntitiesInput = z.infer<
	typeof BrandRadarAiResponsesEntitiesInputSchema
>;
export type BrandRadarAiResponsesEntitiesResponse = z.infer<
	typeof BrandRadarAiResponsesEntitiesResponseSchema
>;

export const BrandRadarCitationsHistoryEntitiesInputSchema = z.object({
	where: AhrefsFilterExpression.optional().describe(
		'Filter expression as a JSON object; see the Ahrefs API docs for the fields this endpoint accepts.',
	),
	report_id: z.string().optional().describe('The ID of the report to use.'),
	brands: z
		.array(
			z.object({
				names: z.array(z.string()).optional(),
				url_groups: z
					.array(
						z.object({
							target: z.string().min(1),
							scope: z.enum(['url', 'path', 'domain', 'subdomains']),
						}),
					)
					.optional(),
			}),
		)
		.optional()
		.describe('A list of brand names and websites to search for.'),
	content_filter: z
		.object({
			include: z.array(z.string()).optional(),
			exclude: z.array(z.string()).optional(),
		})
		.optional()
		.describe(
			'Optional phrases used to include or exclude results based on their content.',
		),
	data_source: z
		.array(
			z.enum([
				'chatgpt',
				'google_ai_overviews',
				'google_ai_mode',
				'gemini',
				'perplexity',
				'copilot',
				'claude',
				'grok',
				'google_ai_overviews_keywords',
				'google_ai_mode_keywords',
			]),
		)
		.describe('A list of chatbot models.'),
	country: z
		.array(z.string().length(2))
		.optional()
		.describe('A list of two-letter country codes (ISO 3166-1 alpha-2).'),
	prompts: z
		.enum(['ahrefs', 'custom'])
		.optional()
		.describe('The type of prompts to use.'),
	date_from: isoDateString.describe(
		'The start date of the historical period in YYYY-MM-DD format.',
	),
	date_to: isoDateString
		.optional()
		.describe('The end date of the historical period in YYYY-MM-DD format.'),
	tags_filter: AhrefsFilterExpression.optional().describe(
		'A filter expression for prompt tags.',
	),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const BrandRadarCitationsHistoryEntitiesRowSchema = z
	.object({
		citations: z.number().nullable().optional(),
		date: z.string().nullable().optional(),
	})
	.loose();

export const BrandRadarCitationsHistoryEntitiesResponseSchema = z.object({
	metrics: z.array(BrandRadarCitationsHistoryEntitiesRowSchema),
});

export type BrandRadarCitationsHistoryEntitiesRow = z.infer<
	typeof BrandRadarCitationsHistoryEntitiesRowSchema
>;

export type BrandRadarCitationsHistoryEntitiesInput = z.infer<
	typeof BrandRadarCitationsHistoryEntitiesInputSchema
>;
export type BrandRadarCitationsHistoryEntitiesResponse = z.infer<
	typeof BrandRadarCitationsHistoryEntitiesResponseSchema
>;

export const BrandRadarCitationsOverviewEntitiesInputSchema = z.object({
	select: z.array(z.string().min(1)).describe('A list of fields to return.'),
	where: AhrefsFilterExpression.optional().describe(
		'Filter expression as a JSON object; see the Ahrefs API docs for the fields this endpoint accepts.',
	),
	report_id: z.string().optional().describe('The ID of the report to use.'),
	brands: z
		.array(
			z.object({
				names: z.array(z.string()).optional(),
				url_groups: z
					.array(
						z.object({
							target: z.string().min(1),
							scope: z.enum(['url', 'path', 'domain', 'subdomains']),
						}),
					)
					.optional(),
			}),
		)
		.optional()
		.describe('A list of brand names and websites to search for.'),
	competitors: z
		.array(
			z.object({
				names: z.array(z.string()).optional(),
				url_groups: z
					.array(
						z.object({
							target: z.string().min(1),
							scope: z.enum(['url', 'path', 'domain', 'subdomains']),
						}),
					)
					.optional(),
			}),
		)
		.optional()
		.describe('A list of competitor names and websites to search for.'),
	content_filter: z
		.object({
			include: z.array(z.string()).optional(),
			exclude: z.array(z.string()).optional(),
		})
		.optional()
		.describe(
			'Optional phrases used to include or exclude results based on their content.',
		),
	data_source: z
		.array(
			z.enum([
				'chatgpt',
				'google_ai_overviews',
				'google_ai_mode',
				'gemini',
				'perplexity',
				'copilot',
				'claude',
				'grok',
				'google_ai_overviews_keywords',
				'google_ai_mode_keywords',
			]),
		)
		.describe('A list of chatbot models.'),
	country: z
		.array(z.string().length(2))
		.optional()
		.describe('A list of two-letter country codes (ISO 3166-1 alpha-2).'),
	prompts: z
		.enum(['ahrefs', 'custom'])
		.optional()
		.describe('The type of prompts to use.'),
	tags_filter: AhrefsFilterExpression.optional().describe(
		'A filter expression for prompt tags.',
	),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const BrandRadarCitationsOverviewEntitiesRowSchema = z
	.object({
		brand: z.string().nullable().optional(),
		entity_type: z.string().nullable().optional(),
		no_tracked_brands: z.number().nullable().optional(),
		only_competitors_brands: z.number().nullable().optional(),
		only_target_brand: z.number().nullable().optional(),
		target_and_competitors_brands: z.number().nullable().optional(),
		total: z.number().nullable().optional(),
	})
	.loose();

export const BrandRadarCitationsOverviewEntitiesResponseSchema = z.object({
	metrics: z.array(BrandRadarCitationsOverviewEntitiesRowSchema),
});

export type BrandRadarCitationsOverviewEntitiesRow = z.infer<
	typeof BrandRadarCitationsOverviewEntitiesRowSchema
>;

export type BrandRadarCitationsOverviewEntitiesInput = z.infer<
	typeof BrandRadarCitationsOverviewEntitiesInputSchema
>;
export type BrandRadarCitationsOverviewEntitiesResponse = z.infer<
	typeof BrandRadarCitationsOverviewEntitiesResponseSchema
>;

export const BrandRadarCitedDomainsInputSchema = z.object({
	select: z
		.string()
		.min(1)
		.describe('A comma-separated list of fields to return.'),
	where: z
		.string()
		.optional()
		.describe(
			'Filter expression as a JSON string; see the Ahrefs API docs for the fields this endpoint accepts.',
		),
	report_id: z.string().optional().describe('The ID of the report to use.'),
	brand: z
		.string()
		.optional()
		.describe('A comma-separated list of brands to search for.'),
	competitors: z
		.string()
		.optional()
		.describe('A comma-separated list of competitors of your brands.'),
	data_source: z
		.string()
		.min(1)
		.describe(
			'Comma-separated chatbot models: chatgpt, google_ai_overviews, google_ai_mode, gemini, perplexity, copilot, claude (custom prompts only), grok, google_ai_overviews_keywords, google_ai_mode_keywords.',
		),
	country: z
		.string()
		.optional()
		.describe(
			'A comma-separated list of two-letter country codes (ISO 3166-1 alpha-2).',
		),
	prompts: z
		.enum(['ahrefs', 'custom'])
		.optional()
		.describe('The type of prompts to use.'),
	limit: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The number of results to return.'),
	date: isoDateString
		.optional()
		.describe('The date to search for in YYYY-MM-DD format.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const BrandRadarCitedDomainsRowSchema = z
	.object({
		domain: z.string().nullable().optional(),
		mentions: AhrefsOpenList.nullable().optional(),
		pages: z.number().nullable().optional(),
		responses: z.number().nullable().optional(),
		volume: z.number().nullable().optional(),
	})
	.loose();

export const BrandRadarCitedDomainsResponseSchema = z.object({
	domains: z.array(BrandRadarCitedDomainsRowSchema),
});

export type BrandRadarCitedDomainsRow = z.infer<
	typeof BrandRadarCitedDomainsRowSchema
>;

export type BrandRadarCitedDomainsInput = z.infer<
	typeof BrandRadarCitedDomainsInputSchema
>;
export type BrandRadarCitedDomainsResponse = z.infer<
	typeof BrandRadarCitedDomainsResponseSchema
>;

export const BrandRadarCitedDomainsEntitiesInputSchema = z.object({
	select: z.array(z.string().min(1)).describe('A list of fields to return.'),
	where: AhrefsFilterExpression.optional().describe(
		'Filter expression as a JSON object; see the Ahrefs API docs for the fields this endpoint accepts.',
	),
	report_id: z.string().optional().describe('The ID of the report to use.'),
	brands: z
		.array(
			z.object({
				names: z.array(z.string()).optional(),
				url_groups: z
					.array(
						z.object({
							target: z.string().min(1),
							scope: z.enum(['url', 'path', 'domain', 'subdomains']),
						}),
					)
					.optional(),
			}),
		)
		.optional()
		.describe('A list of brand names and websites to search for.'),
	competitors: z
		.array(
			z.object({
				names: z.array(z.string()).optional(),
				url_groups: z
					.array(
						z.object({
							target: z.string().min(1),
							scope: z.enum(['url', 'path', 'domain', 'subdomains']),
						}),
					)
					.optional(),
			}),
		)
		.optional()
		.describe('A list of competitor names and websites to search for.'),
	content_filter: z
		.object({
			include: z.array(z.string()).optional(),
			exclude: z.array(z.string()).optional(),
		})
		.optional()
		.describe(
			'Optional phrases used to include or exclude results based on their content.',
		),
	data_source: z
		.array(
			z.enum([
				'chatgpt',
				'google_ai_overviews',
				'google_ai_mode',
				'gemini',
				'perplexity',
				'copilot',
				'claude',
				'grok',
				'google_ai_overviews_keywords',
				'google_ai_mode_keywords',
			]),
		)
		.describe('A list of chatbot models.'),
	country: z
		.array(z.string().length(2))
		.optional()
		.describe('A list of two-letter country codes (ISO 3166-1 alpha-2).'),
	prompts: z
		.enum(['ahrefs', 'custom'])
		.optional()
		.describe('The type of prompts to use.'),
	limit: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The number of results to return.'),
	date: isoDateString
		.optional()
		.describe('The date to search for in YYYY-MM-DD format.'),
	tags_filter: AhrefsFilterExpression.optional().describe(
		'A filter expression for prompt tags.',
	),
	brand_filter: AhrefsFilterExpression.optional().describe(
		'A filter expression for your brand\'s visibility, mirroring the "Your brand" filter.',
	),
	volume_range: z
		.object({
			from: z.number().int().optional(),
			to: z.number().int().optional(),
		})
		.optional()
		.describe('The volume range to filter by.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const BrandRadarCitedDomainsEntitiesRowSchema = z
	.object({
		domain: z.string().nullable().optional(),
		mentions: AhrefsOpenList.nullable().optional(),
		pages: z.number().nullable().optional(),
		responses: z.number().nullable().optional(),
		volume: z.number().nullable().optional(),
	})
	.loose();

export const BrandRadarCitedDomainsEntitiesResponseSchema = z.object({
	domains: z.array(BrandRadarCitedDomainsEntitiesRowSchema),
});

export type BrandRadarCitedDomainsEntitiesRow = z.infer<
	typeof BrandRadarCitedDomainsEntitiesRowSchema
>;

export type BrandRadarCitedDomainsEntitiesInput = z.infer<
	typeof BrandRadarCitedDomainsEntitiesInputSchema
>;
export type BrandRadarCitedDomainsEntitiesResponse = z.infer<
	typeof BrandRadarCitedDomainsEntitiesResponseSchema
>;

export const BrandRadarCitedPagesInputSchema = z.object({
	select: z
		.string()
		.min(1)
		.describe('A comma-separated list of fields to return.'),
	where: z
		.string()
		.optional()
		.describe(
			'Filter expression as a JSON string; see the Ahrefs API docs for the fields this endpoint accepts.',
		),
	report_id: z.string().optional().describe('The ID of the report to use.'),
	brand: z
		.string()
		.optional()
		.describe('A comma-separated list of brands to search for.'),
	competitors: z
		.string()
		.optional()
		.describe('A comma-separated list of competitors of your brands.'),
	data_source: z
		.string()
		.min(1)
		.describe(
			'Comma-separated chatbot models: chatgpt, google_ai_overviews, google_ai_mode, gemini, perplexity, copilot, claude (custom prompts only), grok, google_ai_overviews_keywords, google_ai_mode_keywords.',
		),
	country: z
		.string()
		.optional()
		.describe(
			'A comma-separated list of two-letter country codes (ISO 3166-1 alpha-2).',
		),
	prompts: z
		.enum(['ahrefs', 'custom'])
		.optional()
		.describe('The type of prompts to use.'),
	limit: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The number of results to return.'),
	date: isoDateString
		.optional()
		.describe('The date to search for in YYYY-MM-DD format.'),
	tracked_urls: z
		.string()
		.optional()
		.describe('A comma-separated list of tracked page URLs.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const BrandRadarCitedPagesRowSchema = z
	.object({
		mentions: AhrefsOpenList.nullable().optional(),
		responses: z.number().nullable().optional(),
		title: z.string().nullable().optional(),
		url: z.string().nullable().optional(),
		volume: z.number().nullable().optional(),
	})
	.loose();

export const BrandRadarCitedPagesResponseSchema = z.object({
	pages: z.array(BrandRadarCitedPagesRowSchema),
});

export type BrandRadarCitedPagesRow = z.infer<
	typeof BrandRadarCitedPagesRowSchema
>;

export type BrandRadarCitedPagesInput = z.infer<
	typeof BrandRadarCitedPagesInputSchema
>;
export type BrandRadarCitedPagesResponse = z.infer<
	typeof BrandRadarCitedPagesResponseSchema
>;

export const BrandRadarCitedPagesEntitiesInputSchema = z.object({
	select: z.array(z.string().min(1)).describe('A list of fields to return.'),
	where: AhrefsFilterExpression.optional().describe(
		'Filter expression as a JSON object; see the Ahrefs API docs for the fields this endpoint accepts.',
	),
	report_id: z.string().optional().describe('The ID of the report to use.'),
	brands: z
		.array(
			z.object({
				names: z.array(z.string()).optional(),
				url_groups: z
					.array(
						z.object({
							target: z.string().min(1),
							scope: z.enum(['url', 'path', 'domain', 'subdomains']),
						}),
					)
					.optional(),
			}),
		)
		.optional()
		.describe('A list of brand names and websites to search for.'),
	competitors: z
		.array(
			z.object({
				names: z.array(z.string()).optional(),
				url_groups: z
					.array(
						z.object({
							target: z.string().min(1),
							scope: z.enum(['url', 'path', 'domain', 'subdomains']),
						}),
					)
					.optional(),
			}),
		)
		.optional()
		.describe('A list of competitor names and websites to search for.'),
	content_filter: z
		.object({
			include: z.array(z.string()).optional(),
			exclude: z.array(z.string()).optional(),
		})
		.optional()
		.describe(
			'Optional phrases used to include or exclude results based on their content.',
		),
	data_source: z
		.array(
			z.enum([
				'chatgpt',
				'google_ai_overviews',
				'google_ai_mode',
				'gemini',
				'perplexity',
				'copilot',
				'claude',
				'grok',
				'google_ai_overviews_keywords',
				'google_ai_mode_keywords',
			]),
		)
		.describe('A list of chatbot models.'),
	country: z
		.array(z.string().length(2))
		.optional()
		.describe('A list of two-letter country codes (ISO 3166-1 alpha-2).'),
	prompts: z
		.enum(['ahrefs', 'custom'])
		.optional()
		.describe('The type of prompts to use.'),
	limit: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The number of results to return.'),
	date: isoDateString
		.optional()
		.describe('The date to search for in YYYY-MM-DD format.'),
	tracked_urls: z
		.array(z.string())
		.optional()
		.describe('A list of tracked page URLs.'),
	tags_filter: AhrefsFilterExpression.optional().describe(
		'A filter expression for prompt tags.',
	),
	brand_filter: AhrefsFilterExpression.optional().describe(
		'A filter expression for your brand\'s visibility, mirroring the "Your brand" filter.',
	),
	volume_range: z
		.object({
			from: z.number().int().optional(),
			to: z.number().int().optional(),
		})
		.optional()
		.describe('The volume range to filter by.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const BrandRadarCitedPagesEntitiesRowSchema = z
	.object({
		mentions: AhrefsOpenList.nullable().optional(),
		responses: z.number().nullable().optional(),
		title: z.string().nullable().optional(),
		url: z.string().nullable().optional(),
		volume: z.number().nullable().optional(),
	})
	.loose();

export const BrandRadarCitedPagesEntitiesResponseSchema = z.object({
	pages: z.array(BrandRadarCitedPagesEntitiesRowSchema),
});

export type BrandRadarCitedPagesEntitiesRow = z.infer<
	typeof BrandRadarCitedPagesEntitiesRowSchema
>;

export type BrandRadarCitedPagesEntitiesInput = z.infer<
	typeof BrandRadarCitedPagesEntitiesInputSchema
>;
export type BrandRadarCitedPagesEntitiesResponse = z.infer<
	typeof BrandRadarCitedPagesEntitiesResponseSchema
>;

export const BrandRadarImpressionsHistoryInputSchema = z.object({
	where: z
		.string()
		.optional()
		.describe(
			'Filter expression as a JSON string; see the Ahrefs API docs for the fields this endpoint accepts.',
		),
	report_id: z.string().optional().describe('The ID of the report to use.'),
	brand: z.string().describe('The brand to search for.'),
	data_source: z
		.string()
		.min(1)
		.describe(
			'Comma-separated chatbot models: chatgpt, google_ai_overviews, google_ai_mode, gemini, perplexity, copilot, claude (custom prompts only), grok, google_ai_overviews_keywords, google_ai_mode_keywords.',
		),
	country: z
		.string()
		.optional()
		.describe(
			'A comma-separated list of two-letter country codes (ISO 3166-1 alpha-2).',
		),
	prompts: z
		.enum(['ahrefs', 'custom'])
		.optional()
		.describe('The type of prompts to use.'),
	date_from: isoDateString.describe(
		'The start date of the historical period in YYYY-MM-DD format.',
	),
	date_to: isoDateString
		.optional()
		.describe('The end date of the historical period in YYYY-MM-DD format.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const BrandRadarImpressionsHistoryRowSchema = z
	.object({
		date: z.string().nullable().optional(),
		impressions: z.number().nullable().optional(),
	})
	.loose();

export const BrandRadarImpressionsHistoryResponseSchema = z.object({
	metrics: z.array(BrandRadarImpressionsHistoryRowSchema),
});

export type BrandRadarImpressionsHistoryRow = z.infer<
	typeof BrandRadarImpressionsHistoryRowSchema
>;

export type BrandRadarImpressionsHistoryInput = z.infer<
	typeof BrandRadarImpressionsHistoryInputSchema
>;
export type BrandRadarImpressionsHistoryResponse = z.infer<
	typeof BrandRadarImpressionsHistoryResponseSchema
>;

export const BrandRadarImpressionsHistoryEntitiesInputSchema = z.object({
	where: AhrefsFilterExpression.optional().describe(
		'Filter expression as a JSON object; see the Ahrefs API docs for the fields this endpoint accepts.',
	),
	report_id: z.string().optional().describe('The ID of the report to use.'),
	brands: z
		.array(
			z.object({
				names: z.array(z.string()).optional(),
				url_groups: z
					.array(
						z.object({
							target: z.string().min(1),
							scope: z.enum(['url', 'path', 'domain', 'subdomains']),
						}),
					)
					.optional(),
			}),
		)
		.optional()
		.describe('A list of brand names and websites to search for.'),
	content_filter: z
		.object({
			include: z.array(z.string()).optional(),
			exclude: z.array(z.string()).optional(),
		})
		.optional()
		.describe(
			'Optional phrases used to include or exclude results based on their content.',
		),
	data_source: z
		.array(
			z.enum([
				'chatgpt',
				'google_ai_overviews',
				'google_ai_mode',
				'gemini',
				'perplexity',
				'copilot',
				'claude',
				'grok',
				'google_ai_overviews_keywords',
				'google_ai_mode_keywords',
			]),
		)
		.describe('A list of chatbot models.'),
	country: z
		.array(z.string().length(2))
		.optional()
		.describe('A list of two-letter country codes (ISO 3166-1 alpha-2).'),
	prompts: z
		.enum(['ahrefs', 'custom'])
		.optional()
		.describe('The type of prompts to use.'),
	date_from: isoDateString.describe(
		'The start date of the historical period in YYYY-MM-DD format.',
	),
	date_to: isoDateString
		.optional()
		.describe('The end date of the historical period in YYYY-MM-DD format.'),
	tags_filter: AhrefsFilterExpression.optional().describe(
		'A filter expression for prompt tags.',
	),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const BrandRadarImpressionsHistoryEntitiesRowSchema = z
	.object({
		date: z.string().nullable().optional(),
		impressions: z.number().nullable().optional(),
	})
	.loose();

export const BrandRadarImpressionsHistoryEntitiesResponseSchema = z.object({
	metrics: z.array(BrandRadarImpressionsHistoryEntitiesRowSchema),
});

export type BrandRadarImpressionsHistoryEntitiesRow = z.infer<
	typeof BrandRadarImpressionsHistoryEntitiesRowSchema
>;

export type BrandRadarImpressionsHistoryEntitiesInput = z.infer<
	typeof BrandRadarImpressionsHistoryEntitiesInputSchema
>;
export type BrandRadarImpressionsHistoryEntitiesResponse = z.infer<
	typeof BrandRadarImpressionsHistoryEntitiesResponseSchema
>;

export const BrandRadarImpressionsOverviewInputSchema = z.object({
	select: z
		.string()
		.min(1)
		.describe('A comma-separated list of fields to return.'),
	where: z
		.string()
		.optional()
		.describe(
			'Filter expression as a JSON string; see the Ahrefs API docs for the fields this endpoint accepts.',
		),
	report_id: z.string().optional().describe('The ID of the report to use.'),
	brand: z
		.string()
		.optional()
		.describe('A comma-separated list of brands to search for.'),
	competitors: z
		.string()
		.optional()
		.describe('A comma-separated list of competitors of your brands.'),
	data_source: z
		.string()
		.min(1)
		.describe(
			'Comma-separated chatbot models: chatgpt, google_ai_overviews, google_ai_mode, gemini, perplexity, copilot, claude (custom prompts only), grok, google_ai_overviews_keywords, google_ai_mode_keywords.',
		),
	country: z
		.string()
		.optional()
		.describe(
			'A comma-separated list of two-letter country codes (ISO 3166-1 alpha-2).',
		),
	prompts: z
		.enum(['ahrefs', 'custom'])
		.optional()
		.describe('The type of prompts to use.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const BrandRadarImpressionsOverviewRowSchema = z
	.object({
		brand: z.string().nullable().optional(),
		entity_type: z.string().nullable().optional(),
		no_tracked_brands: z.number().nullable().optional(),
		only_competitors_brands: z.number().nullable().optional(),
		only_target_brand: z.number().nullable().optional(),
		target_and_competitors_brands: z.number().nullable().optional(),
		total: z.number().nullable().optional(),
	})
	.loose();

export const BrandRadarImpressionsOverviewResponseSchema = z.object({
	metrics: z.array(BrandRadarImpressionsOverviewRowSchema),
});

export type BrandRadarImpressionsOverviewRow = z.infer<
	typeof BrandRadarImpressionsOverviewRowSchema
>;

export type BrandRadarImpressionsOverviewInput = z.infer<
	typeof BrandRadarImpressionsOverviewInputSchema
>;
export type BrandRadarImpressionsOverviewResponse = z.infer<
	typeof BrandRadarImpressionsOverviewResponseSchema
>;

export const BrandRadarImpressionsOverviewEntitiesInputSchema = z.object({
	select: z.array(z.string().min(1)).describe('A list of fields to return.'),
	where: AhrefsFilterExpression.optional().describe(
		'Filter expression as a JSON object; see the Ahrefs API docs for the fields this endpoint accepts.',
	),
	report_id: z.string().optional().describe('The ID of the report to use.'),
	brands: z
		.array(
			z.object({
				names: z.array(z.string()).optional(),
				url_groups: z
					.array(
						z.object({
							target: z.string().min(1),
							scope: z.enum(['url', 'path', 'domain', 'subdomains']),
						}),
					)
					.optional(),
			}),
		)
		.optional()
		.describe('A list of brand names and websites to search for.'),
	competitors: z
		.array(
			z.object({
				names: z.array(z.string()).optional(),
				url_groups: z
					.array(
						z.object({
							target: z.string().min(1),
							scope: z.enum(['url', 'path', 'domain', 'subdomains']),
						}),
					)
					.optional(),
			}),
		)
		.optional()
		.describe('A list of competitor names and websites to search for.'),
	content_filter: z
		.object({
			include: z.array(z.string()).optional(),
			exclude: z.array(z.string()).optional(),
		})
		.optional()
		.describe(
			'Optional phrases used to include or exclude results based on their content.',
		),
	data_source: z
		.array(
			z.enum([
				'chatgpt',
				'google_ai_overviews',
				'google_ai_mode',
				'gemini',
				'perplexity',
				'copilot',
				'claude',
				'grok',
				'google_ai_overviews_keywords',
				'google_ai_mode_keywords',
			]),
		)
		.describe('A list of chatbot models.'),
	country: z
		.array(z.string().length(2))
		.optional()
		.describe('A list of two-letter country codes (ISO 3166-1 alpha-2).'),
	prompts: z
		.enum(['ahrefs', 'custom'])
		.optional()
		.describe('The type of prompts to use.'),
	tags_filter: AhrefsFilterExpression.optional().describe(
		'A filter expression for prompt tags.',
	),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const BrandRadarImpressionsOverviewEntitiesRowSchema = z
	.object({
		brand: z.string().nullable().optional(),
		entity_type: z.string().nullable().optional(),
		no_tracked_brands: z.number().nullable().optional(),
		only_competitors_brands: z.number().nullable().optional(),
		only_target_brand: z.number().nullable().optional(),
		target_and_competitors_brands: z.number().nullable().optional(),
		total: z.number().nullable().optional(),
	})
	.loose();

export const BrandRadarImpressionsOverviewEntitiesResponseSchema = z.object({
	metrics: z.array(BrandRadarImpressionsOverviewEntitiesRowSchema),
});

export type BrandRadarImpressionsOverviewEntitiesRow = z.infer<
	typeof BrandRadarImpressionsOverviewEntitiesRowSchema
>;

export type BrandRadarImpressionsOverviewEntitiesInput = z.infer<
	typeof BrandRadarImpressionsOverviewEntitiesInputSchema
>;
export type BrandRadarImpressionsOverviewEntitiesResponse = z.infer<
	typeof BrandRadarImpressionsOverviewEntitiesResponseSchema
>;

export const BrandRadarMentionsHistoryInputSchema = z.object({
	where: z
		.string()
		.optional()
		.describe(
			'Filter expression as a JSON string; see the Ahrefs API docs for the fields this endpoint accepts.',
		),
	report_id: z.string().optional().describe('The ID of the report to use.'),
	brand: z.string().describe('The brand to search for.'),
	data_source: z
		.string()
		.min(1)
		.describe(
			'Comma-separated chatbot models: chatgpt, google_ai_overviews, google_ai_mode, gemini, perplexity, copilot, claude (custom prompts only), grok, google_ai_overviews_keywords, google_ai_mode_keywords.',
		),
	country: z
		.string()
		.optional()
		.describe(
			'A comma-separated list of two-letter country codes (ISO 3166-1 alpha-2).',
		),
	prompts: z
		.enum(['ahrefs', 'custom'])
		.optional()
		.describe('The type of prompts to use.'),
	date_from: isoDateString.describe(
		'The start date of the historical period in YYYY-MM-DD format.',
	),
	date_to: isoDateString
		.optional()
		.describe('The end date of the historical period in YYYY-MM-DD format.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const BrandRadarMentionsHistoryRowSchema = z
	.object({
		date: z.string().nullable().optional(),
		mentions: z.number().nullable().optional(),
	})
	.loose();

export const BrandRadarMentionsHistoryResponseSchema = z.object({
	metrics: z.array(BrandRadarMentionsHistoryRowSchema),
});

export type BrandRadarMentionsHistoryRow = z.infer<
	typeof BrandRadarMentionsHistoryRowSchema
>;

export type BrandRadarMentionsHistoryInput = z.infer<
	typeof BrandRadarMentionsHistoryInputSchema
>;
export type BrandRadarMentionsHistoryResponse = z.infer<
	typeof BrandRadarMentionsHistoryResponseSchema
>;

export const BrandRadarMentionsHistoryEntitiesInputSchema = z.object({
	where: AhrefsFilterExpression.optional().describe(
		'Filter expression as a JSON object; see the Ahrefs API docs for the fields this endpoint accepts.',
	),
	report_id: z.string().optional().describe('The ID of the report to use.'),
	brands: z
		.array(
			z.object({
				names: z.array(z.string()).optional(),
				url_groups: z
					.array(
						z.object({
							target: z.string().min(1),
							scope: z.enum(['url', 'path', 'domain', 'subdomains']),
						}),
					)
					.optional(),
			}),
		)
		.optional()
		.describe('A list of brand names and websites to search for.'),
	content_filter: z
		.object({
			include: z.array(z.string()).optional(),
			exclude: z.array(z.string()).optional(),
		})
		.optional()
		.describe(
			'Optional phrases used to include or exclude results based on their content.',
		),
	data_source: z
		.array(
			z.enum([
				'chatgpt',
				'google_ai_overviews',
				'google_ai_mode',
				'gemini',
				'perplexity',
				'copilot',
				'claude',
				'grok',
				'google_ai_overviews_keywords',
				'google_ai_mode_keywords',
			]),
		)
		.describe('A list of chatbot models.'),
	country: z
		.array(z.string().length(2))
		.optional()
		.describe('A list of two-letter country codes (ISO 3166-1 alpha-2).'),
	prompts: z
		.enum(['ahrefs', 'custom'])
		.optional()
		.describe('The type of prompts to use.'),
	date_from: isoDateString.describe(
		'The start date of the historical period in YYYY-MM-DD format.',
	),
	date_to: isoDateString
		.optional()
		.describe('The end date of the historical period in YYYY-MM-DD format.'),
	tags_filter: AhrefsFilterExpression.optional().describe(
		'A filter expression for prompt tags.',
	),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const BrandRadarMentionsHistoryEntitiesRowSchema = z
	.object({
		date: z.string().nullable().optional(),
		mentions: z.number().nullable().optional(),
	})
	.loose();

export const BrandRadarMentionsHistoryEntitiesResponseSchema = z.object({
	metrics: z.array(BrandRadarMentionsHistoryEntitiesRowSchema),
});

export type BrandRadarMentionsHistoryEntitiesRow = z.infer<
	typeof BrandRadarMentionsHistoryEntitiesRowSchema
>;

export type BrandRadarMentionsHistoryEntitiesInput = z.infer<
	typeof BrandRadarMentionsHistoryEntitiesInputSchema
>;
export type BrandRadarMentionsHistoryEntitiesResponse = z.infer<
	typeof BrandRadarMentionsHistoryEntitiesResponseSchema
>;

export const BrandRadarMentionsOverviewInputSchema = z.object({
	select: z
		.string()
		.min(1)
		.describe('A comma-separated list of fields to return.'),
	where: z
		.string()
		.optional()
		.describe(
			'Filter expression as a JSON string; see the Ahrefs API docs for the fields this endpoint accepts.',
		),
	report_id: z.string().optional().describe('The ID of the report to use.'),
	brand: z
		.string()
		.optional()
		.describe('A comma-separated list of brands to search for.'),
	competitors: z
		.string()
		.optional()
		.describe('A comma-separated list of competitors of your brands.'),
	data_source: z
		.string()
		.min(1)
		.describe(
			'Comma-separated chatbot models: chatgpt, google_ai_overviews, google_ai_mode, gemini, perplexity, copilot, claude (custom prompts only), grok, google_ai_overviews_keywords, google_ai_mode_keywords.',
		),
	country: z
		.string()
		.optional()
		.describe(
			'A comma-separated list of two-letter country codes (ISO 3166-1 alpha-2).',
		),
	prompts: z
		.enum(['ahrefs', 'custom'])
		.optional()
		.describe('The type of prompts to use.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const BrandRadarMentionsOverviewRowSchema = z
	.object({
		brand: z.string().nullable().optional(),
		entity_type: z.string().nullable().optional(),
		no_tracked_brands: z.number().nullable().optional(),
		only_competitors_brands: z.number().nullable().optional(),
		only_target_brand: z.number().nullable().optional(),
		target_and_competitors_brands: z.number().nullable().optional(),
		total: z.number().nullable().optional(),
	})
	.loose();

export const BrandRadarMentionsOverviewResponseSchema = z.object({
	metrics: z.array(BrandRadarMentionsOverviewRowSchema),
});

export type BrandRadarMentionsOverviewRow = z.infer<
	typeof BrandRadarMentionsOverviewRowSchema
>;

export type BrandRadarMentionsOverviewInput = z.infer<
	typeof BrandRadarMentionsOverviewInputSchema
>;
export type BrandRadarMentionsOverviewResponse = z.infer<
	typeof BrandRadarMentionsOverviewResponseSchema
>;

export const BrandRadarMentionsOverviewEntitiesInputSchema = z.object({
	select: z.array(z.string().min(1)).describe('A list of fields to return.'),
	where: AhrefsFilterExpression.optional().describe(
		'Filter expression as a JSON object; see the Ahrefs API docs for the fields this endpoint accepts.',
	),
	report_id: z.string().optional().describe('The ID of the report to use.'),
	brands: z
		.array(
			z.object({
				names: z.array(z.string()).optional(),
				url_groups: z
					.array(
						z.object({
							target: z.string().min(1),
							scope: z.enum(['url', 'path', 'domain', 'subdomains']),
						}),
					)
					.optional(),
			}),
		)
		.optional()
		.describe('A list of brand names and websites to search for.'),
	competitors: z
		.array(
			z.object({
				names: z.array(z.string()).optional(),
				url_groups: z
					.array(
						z.object({
							target: z.string().min(1),
							scope: z.enum(['url', 'path', 'domain', 'subdomains']),
						}),
					)
					.optional(),
			}),
		)
		.optional()
		.describe('A list of competitor names and websites to search for.'),
	content_filter: z
		.object({
			include: z.array(z.string()).optional(),
			exclude: z.array(z.string()).optional(),
		})
		.optional()
		.describe(
			'Optional phrases used to include or exclude results based on their content.',
		),
	data_source: z
		.array(
			z.enum([
				'chatgpt',
				'google_ai_overviews',
				'google_ai_mode',
				'gemini',
				'perplexity',
				'copilot',
				'claude',
				'grok',
				'google_ai_overviews_keywords',
				'google_ai_mode_keywords',
			]),
		)
		.describe('A list of chatbot models.'),
	country: z
		.array(z.string().length(2))
		.optional()
		.describe('A list of two-letter country codes (ISO 3166-1 alpha-2).'),
	prompts: z
		.enum(['ahrefs', 'custom'])
		.optional()
		.describe('The type of prompts to use.'),
	tags_filter: AhrefsFilterExpression.optional().describe(
		'A filter expression for prompt tags.',
	),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const BrandRadarMentionsOverviewEntitiesRowSchema = z
	.object({
		brand: z.string().nullable().optional(),
		entity_type: z.string().nullable().optional(),
		no_tracked_brands: z.number().nullable().optional(),
		only_competitors_brands: z.number().nullable().optional(),
		only_target_brand: z.number().nullable().optional(),
		target_and_competitors_brands: z.number().nullable().optional(),
		total: z.number().nullable().optional(),
	})
	.loose();

export const BrandRadarMentionsOverviewEntitiesResponseSchema = z.object({
	metrics: z.array(BrandRadarMentionsOverviewEntitiesRowSchema),
});

export type BrandRadarMentionsOverviewEntitiesRow = z.infer<
	typeof BrandRadarMentionsOverviewEntitiesRowSchema
>;

export type BrandRadarMentionsOverviewEntitiesInput = z.infer<
	typeof BrandRadarMentionsOverviewEntitiesInputSchema
>;
export type BrandRadarMentionsOverviewEntitiesResponse = z.infer<
	typeof BrandRadarMentionsOverviewEntitiesResponseSchema
>;

export const BrandRadarSovHistoryInputSchema = z.object({
	where: z
		.string()
		.optional()
		.describe(
			'Filter expression as a JSON string; see the Ahrefs API docs for the fields this endpoint accepts.',
		),
	report_id: z.string().optional().describe('The ID of the report to use.'),
	brand: z
		.string()
		.optional()
		.describe('A comma-separated list of brands to search for.'),
	competitors: z
		.string()
		.optional()
		.describe('A comma-separated list of competitors of your brands.'),
	data_source: z
		.string()
		.min(1)
		.describe(
			'Comma-separated chatbot models: chatgpt, google_ai_overviews, google_ai_mode, gemini, perplexity, copilot, claude (custom prompts only), grok, google_ai_overviews_keywords, google_ai_mode_keywords.',
		),
	country: z
		.string()
		.optional()
		.describe(
			'A comma-separated list of two-letter country codes (ISO 3166-1 alpha-2).',
		),
	prompts: z
		.enum(['ahrefs', 'custom'])
		.optional()
		.describe('The type of prompts to use.'),
	date_from: isoDateString.describe(
		'The start date of the historical period in YYYY-MM-DD format.',
	),
	date_to: isoDateString
		.optional()
		.describe('The end date of the historical period in YYYY-MM-DD format.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const BrandRadarSovHistoryRowSchema = z
	.object({
		date: z.string().nullable().optional(),
		share_of_voice: AhrefsOpenList.nullable().optional(),
	})
	.loose();

export const BrandRadarSovHistoryResponseSchema = z.object({
	metrics: z.array(BrandRadarSovHistoryRowSchema),
});

export type BrandRadarSovHistoryRow = z.infer<
	typeof BrandRadarSovHistoryRowSchema
>;

export type BrandRadarSovHistoryInput = z.infer<
	typeof BrandRadarSovHistoryInputSchema
>;
export type BrandRadarSovHistoryResponse = z.infer<
	typeof BrandRadarSovHistoryResponseSchema
>;

export const BrandRadarSovHistoryEntitiesInputSchema = z.object({
	where: AhrefsFilterExpression.optional().describe(
		'Filter expression as a JSON object; see the Ahrefs API docs for the fields this endpoint accepts.',
	),
	report_id: z.string().optional().describe('The ID of the report to use.'),
	brands: z
		.array(
			z.object({
				names: z.array(z.string()).optional(),
				url_groups: z
					.array(
						z.object({
							target: z.string().min(1),
							scope: z.enum(['url', 'path', 'domain', 'subdomains']),
						}),
					)
					.optional(),
			}),
		)
		.optional()
		.describe('A list of brand names and websites to search for.'),
	competitors: z
		.array(
			z.object({
				names: z.array(z.string()).optional(),
				url_groups: z
					.array(
						z.object({
							target: z.string().min(1),
							scope: z.enum(['url', 'path', 'domain', 'subdomains']),
						}),
					)
					.optional(),
			}),
		)
		.optional()
		.describe('A list of competitor names and websites to search for.'),
	content_filter: z
		.object({
			include: z.array(z.string()).optional(),
			exclude: z.array(z.string()).optional(),
		})
		.optional()
		.describe(
			'Optional phrases used to include or exclude results based on their content.',
		),
	data_source: z
		.array(
			z.enum([
				'chatgpt',
				'google_ai_overviews',
				'google_ai_mode',
				'gemini',
				'perplexity',
				'copilot',
				'claude',
				'grok',
				'google_ai_overviews_keywords',
				'google_ai_mode_keywords',
			]),
		)
		.describe('A list of chatbot models.'),
	country: z
		.array(z.string().length(2))
		.optional()
		.describe('A list of two-letter country codes (ISO 3166-1 alpha-2).'),
	prompts: z
		.enum(['ahrefs', 'custom'])
		.optional()
		.describe('The type of prompts to use.'),
	date_from: isoDateString.describe(
		'The start date of the historical period in YYYY-MM-DD format.',
	),
	date_to: isoDateString
		.optional()
		.describe('The end date of the historical period in YYYY-MM-DD format.'),
	tags_filter: AhrefsFilterExpression.optional().describe(
		'A filter expression for prompt tags.',
	),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const BrandRadarSovHistoryEntitiesRowSchema = z
	.object({
		date: z.string().nullable().optional(),
		share_of_voice: AhrefsOpenList.nullable().optional(),
	})
	.loose();

export const BrandRadarSovHistoryEntitiesResponseSchema = z.object({
	metrics: z.array(BrandRadarSovHistoryEntitiesRowSchema),
});

export type BrandRadarSovHistoryEntitiesRow = z.infer<
	typeof BrandRadarSovHistoryEntitiesRowSchema
>;

export type BrandRadarSovHistoryEntitiesInput = z.infer<
	typeof BrandRadarSovHistoryEntitiesInputSchema
>;
export type BrandRadarSovHistoryEntitiesResponse = z.infer<
	typeof BrandRadarSovHistoryEntitiesResponseSchema
>;

export const BrandRadarSovOverviewInputSchema = z.object({
	where: z
		.string()
		.optional()
		.describe(
			'Filter expression as a JSON string; see the Ahrefs API docs for the fields this endpoint accepts.',
		),
	report_id: z.string().optional().describe('The ID of the report to use.'),
	brand: z
		.string()
		.optional()
		.describe('A comma-separated list of brands to search for.'),
	competitors: z
		.string()
		.optional()
		.describe('A comma-separated list of competitors of your brands.'),
	data_source: z
		.string()
		.min(1)
		.describe(
			'Comma-separated chatbot models: chatgpt, google_ai_overviews, google_ai_mode, gemini, perplexity, copilot, claude (custom prompts only), grok, google_ai_overviews_keywords, google_ai_mode_keywords.',
		),
	country: z
		.string()
		.optional()
		.describe(
			'A comma-separated list of two-letter country codes (ISO 3166-1 alpha-2).',
		),
	prompts: z
		.enum(['ahrefs', 'custom'])
		.optional()
		.describe('The type of prompts to use.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const BrandRadarSovOverviewRowSchema = z
	.object({
		brand: z.string().nullable().optional(),
		entity_type: z.string().nullable().optional(),
		share_of_voice: z.number().nullable().optional(),
	})
	.loose();

export const BrandRadarSovOverviewResponseSchema = z.object({
	metrics: z.array(BrandRadarSovOverviewRowSchema),
});

export type BrandRadarSovOverviewRow = z.infer<
	typeof BrandRadarSovOverviewRowSchema
>;

export type BrandRadarSovOverviewInput = z.infer<
	typeof BrandRadarSovOverviewInputSchema
>;
export type BrandRadarSovOverviewResponse = z.infer<
	typeof BrandRadarSovOverviewResponseSchema
>;

export const BrandRadarSovOverviewEntitiesInputSchema = z.object({
	where: AhrefsFilterExpression.optional().describe(
		'Filter expression as a JSON object; see the Ahrefs API docs for the fields this endpoint accepts.',
	),
	report_id: z.string().optional().describe('The ID of the report to use.'),
	brands: z
		.array(
			z.object({
				names: z.array(z.string()).optional(),
				url_groups: z
					.array(
						z.object({
							target: z.string().min(1),
							scope: z.enum(['url', 'path', 'domain', 'subdomains']),
						}),
					)
					.optional(),
			}),
		)
		.optional()
		.describe('A list of brand names and websites to search for.'),
	competitors: z
		.array(
			z.object({
				names: z.array(z.string()).optional(),
				url_groups: z
					.array(
						z.object({
							target: z.string().min(1),
							scope: z.enum(['url', 'path', 'domain', 'subdomains']),
						}),
					)
					.optional(),
			}),
		)
		.optional()
		.describe('A list of competitor names and websites to search for.'),
	content_filter: z
		.object({
			include: z.array(z.string()).optional(),
			exclude: z.array(z.string()).optional(),
		})
		.optional()
		.describe(
			'Optional phrases used to include or exclude results based on their content.',
		),
	data_source: z
		.array(
			z.enum([
				'chatgpt',
				'google_ai_overviews',
				'google_ai_mode',
				'gemini',
				'perplexity',
				'copilot',
				'claude',
				'grok',
				'google_ai_overviews_keywords',
				'google_ai_mode_keywords',
			]),
		)
		.describe('A list of chatbot models.'),
	country: z
		.array(z.string().length(2))
		.optional()
		.describe('A list of two-letter country codes (ISO 3166-1 alpha-2).'),
	prompts: z
		.enum(['ahrefs', 'custom'])
		.optional()
		.describe('The type of prompts to use.'),
	tags_filter: AhrefsFilterExpression.optional().describe(
		'A filter expression for prompt tags.',
	),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const BrandRadarSovOverviewEntitiesRowSchema = z
	.object({
		brand: z.string().nullable().optional(),
		entity_type: z.string().nullable().optional(),
		share_of_voice: z.number().nullable().optional(),
	})
	.loose();

export const BrandRadarSovOverviewEntitiesResponseSchema = z.object({
	metrics: z.array(BrandRadarSovOverviewEntitiesRowSchema),
});

export type BrandRadarSovOverviewEntitiesRow = z.infer<
	typeof BrandRadarSovOverviewEntitiesRowSchema
>;

export type BrandRadarSovOverviewEntitiesInput = z.infer<
	typeof BrandRadarSovOverviewEntitiesInputSchema
>;
export type BrandRadarSovOverviewEntitiesResponse = z.infer<
	typeof BrandRadarSovOverviewEntitiesResponseSchema
>;

export const SocialMediaChannelsInputSchema = z.object({
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const SocialMediaChannelsRowSchema = z
	.object({
		channel_display_name: z.string().nullable().optional(),
		channel_id: z.string().nullable().optional(),
		channel_kind: z.string().nullable().optional(),
		channel_profile_image_url: z.string().nullable().optional(),
		channel_status: z.string().nullable().optional(),
		channel_username: z.string().nullable().optional(),
		external_channel_id: z.string().nullable().optional(),
		token_validity: z.string().nullable().optional(),
	})
	.loose();

export const SocialMediaChannelsResponseSchema = z.object({
	channels: z.array(SocialMediaChannelsRowSchema),
});

export type SocialMediaChannelsRow = z.infer<
	typeof SocialMediaChannelsRowSchema
>;

export type SocialMediaChannelsInput = z.infer<
	typeof SocialMediaChannelsInputSchema
>;
export type SocialMediaChannelsResponse = z.infer<
	typeof SocialMediaChannelsResponseSchema
>;

export const SocialMediaAuthorsInputSchema = z.object({
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const SocialMediaAuthorsRowSchema = z
	.object({
		author_id: z.string().nullable().optional(),
		author_name: z.string().nullable().optional(),
	})
	.loose();

export const SocialMediaAuthorsResponseSchema = z.object({
	authors: z.array(SocialMediaAuthorsRowSchema),
});

export type SocialMediaAuthorsRow = z.infer<typeof SocialMediaAuthorsRowSchema>;

export type SocialMediaAuthorsInput = z.infer<
	typeof SocialMediaAuthorsInputSchema
>;
export type SocialMediaAuthorsResponse = z.infer<
	typeof SocialMediaAuthorsResponseSchema
>;

export const SocialMediaPostsInputSchema = z.object({
	status: z
		.enum(['published', 'scheduled', 'draft', 'failed', 'deleted'])
		.describe('The publishing lifecycle stage of the post.'),
	channel_ids: z
		.string()
		.optional()
		.describe('Comma-separated list of channel IDs to filter by.'),
	author_ids: z
		.string()
		.optional()
		.describe('Comma-separated list of author user IDs to filter by.'),
	search_query: z
		.string()
		.optional()
		.describe('Text search query to filter posts by content.'),
	date_from: isoDateString
		.optional()
		.describe('The start date of the historical period in YYYY-MM-DD format.'),
	date_to: isoDateString
		.optional()
		.describe('The end date of the historical period in YYYY-MM-DD format.'),
	order_by: z
		.enum(['date', 'views', 'unique_views', 'comments', 'likes'])
		.optional()
		.describe('Sort field for posts.'),
	order_direction: z
		.enum(['asc', 'desc'])
		.optional()
		.describe(
			'The order in which results are returned, ascending or descending.',
		),
	limit: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The number of results to return.'),
	offset: z
		.number()
		.int()
		.nonnegative()
		.optional()
		.describe('The number of results to skip.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const SocialMediaPostsRowSchema = z
	.object({
		author_id: z.string().nullable().optional(),
		author_name: z.string().nullable().optional(),
		auto_comment: z.string().nullable().optional(),
		channels: AhrefsOpenList.nullable().optional(),
		created_at: z.string().nullable().optional(),
		external_post_id: z.string().nullable().optional(),
		permalink: z.string().nullable().optional(),
		post_id: z.number().nullable().optional(),
		status_timestamp: z.string().nullable().optional(),
		text_content: z.string().nullable().optional(),
	})
	.loose();

export const SocialMediaPostsResponseSchema = z.object({
	posts: z.array(SocialMediaPostsRowSchema),
});

export type SocialMediaPostsRow = z.infer<typeof SocialMediaPostsRowSchema>;

export type SocialMediaPostsInput = z.infer<typeof SocialMediaPostsInputSchema>;
export type SocialMediaPostsResponse = z.infer<
	typeof SocialMediaPostsResponseSchema
>;

export const SocialMediaChannelMetricsInputSchema = z.object({
	channel_id: z
		.string()
		.describe('Unique identifier for the social media channel.'),
	date_from: isoDateString.describe(
		'The start date of the historical period in YYYY-MM-DD format.',
	),
	date_to: isoDateString
		.optional()
		.describe('The end date of the historical period in YYYY-MM-DD format.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const SocialMediaChannelMetricsRowSchema = z
	.object({
		follower_count: z.number().nullable().optional(),
		retrieved_at: z.string().nullable().optional(),
	})
	.loose();

export const SocialMediaChannelMetricsResponseSchema = z.object({
	metrics: z.array(SocialMediaChannelMetricsRowSchema),
});

export type SocialMediaChannelMetricsRow = z.infer<
	typeof SocialMediaChannelMetricsRowSchema
>;

export type SocialMediaChannelMetricsInput = z.infer<
	typeof SocialMediaChannelMetricsInputSchema
>;
export type SocialMediaChannelMetricsResponse = z.infer<
	typeof SocialMediaChannelMetricsResponseSchema
>;

export const SocialMediaPostMetricsInputSchema = z.object({
	external_post_id: z.string().describe('Platform-specific post identifier.'),
	channel_id: z
		.string()
		.describe('Unique identifier for the social media channel.'),
	date_from: isoDateString.describe(
		'The start date of the historical period in YYYY-MM-DD format.',
	),
	date_to: isoDateString
		.optional()
		.describe('The end date of the historical period in YYYY-MM-DD format.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const SocialMediaPostMetricsRowSchema = z
	.object({
		facebook_metrics: AhrefsOpenObject.nullable().optional(),
		instagram_metrics: AhrefsOpenObject.nullable().optional(),
		likes: z.number().nullable().optional(),
		linkedin_metrics: AhrefsOpenObject.nullable().optional(),
		retrieved_at: z.string().nullable().optional(),
		threads_metrics: AhrefsOpenObject.nullable().optional(),
		tiktok_metrics: AhrefsOpenObject.nullable().optional(),
		twitter_metrics: AhrefsOpenObject.nullable().optional(),
		unique_views: z.number().nullable().optional(),
		views: z.number().nullable().optional(),
		youtube_metrics: AhrefsOpenObject.nullable().optional(),
	})
	.loose();

export const SocialMediaPostMetricsResponseSchema = z.object({
	metrics: z.array(SocialMediaPostMetricsRowSchema),
});

export type SocialMediaPostMetricsRow = z.infer<
	typeof SocialMediaPostMetricsRowSchema
>;

export type SocialMediaPostMetricsInput = z.infer<
	typeof SocialMediaPostMetricsInputSchema
>;
export type SocialMediaPostMetricsResponse = z.infer<
	typeof SocialMediaPostMetricsResponseSchema
>;

export const SocialMediaActivityHistoryInputSchema = z.object({
	post_id: z
		.number()
		.int()
		.positive()
		.describe('Unique identifier for the post.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const SocialMediaActivityHistoryRowSchema = z
	.object({
		action_type: z.string().nullable().optional(),
		activity_id: z.number().nullable().optional(),
		channel_id: z.string().nullable().optional(),
		channel_kind: z.string().nullable().optional(),
		created_at: z.string().nullable().optional(),
		user_name: z.string().nullable().optional(),
	})
	.loose();

export const SocialMediaActivityHistoryResponseSchema = z.object({
	activities: z.array(SocialMediaActivityHistoryRowSchema),
});

export type SocialMediaActivityHistoryRow = z.infer<
	typeof SocialMediaActivityHistoryRowSchema
>;

export type SocialMediaActivityHistoryInput = z.infer<
	typeof SocialMediaActivityHistoryInputSchema
>;
export type SocialMediaActivityHistoryResponse = z.infer<
	typeof SocialMediaActivityHistoryResponseSchema
>;

export const SocialMediaCreatePostInputSchema = z.object({
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
	channel_ids: z
		.array(z.string())
		.describe('Non-empty list of channel IDs to publish the post to.'),
	text_content: z.string().min(1).describe('Text content of the post.'),
	timing: z
		.enum(['publish_now', 'scheduled', 'draft'])
		.describe('When to publish the post.'),
	scheduled_at: z
		.string()
		.optional()
		.describe(
			'Timestamp for scheduled posts (required when timing is scheduled)',
		),
	auto_comment: z
		.string()
		.optional()
		.describe('Auto-comment text posted after publishing.'),
});

export const SocialMediaCreatePostResponseSchema = z.object({
	post: z
		.object({
			author_id: z.string().nullable().optional(),
			author_name: z.string().nullable().optional(),
			auto_comment: z.string().nullable().optional(),
			channels: AhrefsOpenList.nullable().optional(),
			created_at: z.string().nullable().optional(),
			external_post_id: z.string().nullable().optional(),
			permalink: z.string().nullable().optional(),
			post_id: z.number().nullable().optional(),
			status_timestamp: z.string().nullable().optional(),
			text_content: z.string().nullable().optional(),
		})
		.loose(),
});

export type SocialMediaCreatePostInput = z.infer<
	typeof SocialMediaCreatePostInputSchema
>;
export type SocialMediaCreatePostResponse = z.infer<
	typeof SocialMediaCreatePostResponseSchema
>;

export const SocialMediaUpdatePostInputSchema = z.object({
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
	post_id: z
		.number()
		.int()
		.positive()
		.describe('Unique identifier for the post.'),
	channel_ids: z
		.array(z.string())
		.optional()
		.describe('Non-empty list of channel IDs to publish the post to.'),
	text_content: z
		.string()
		.min(1)
		.optional()
		.describe('Text content of the post.'),
	timing: z
		.enum(['publish_now', 'scheduled', 'draft'])
		.optional()
		.describe('When to publish the post.'),
	scheduled_at: z
		.string()
		.optional()
		.describe(
			'Timestamp for scheduled posts (required when timing is scheduled)',
		),
	auto_comment: z
		.string()
		.optional()
		.describe('Auto-comment text posted after publishing.'),
});

export const SocialMediaUpdatePostResponseSchema = z.object({
	post: z
		.object({
			author_id: z.string().nullable().optional(),
			author_name: z.string().nullable().optional(),
			auto_comment: z.string().nullable().optional(),
			channels: AhrefsOpenList.nullable().optional(),
			created_at: z.string().nullable().optional(),
			external_post_id: z.string().nullable().optional(),
			permalink: z.string().nullable().optional(),
			post_id: z.number().nullable().optional(),
			status_timestamp: z.string().nullable().optional(),
			text_content: z.string().nullable().optional(),
		})
		.loose(),
});

export type SocialMediaUpdatePostInput = z.infer<
	typeof SocialMediaUpdatePostInputSchema
>;
export type SocialMediaUpdatePostResponse = z.infer<
	typeof SocialMediaUpdatePostResponseSchema
>;

export const SocialMediaDeletePostInputSchema = z.object({
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
	post_id: z
		.number()
		.int()
		.positive()
		.describe('Unique identifier for the post.'),
});

export const SocialMediaDeletePostResponseSchema = z.object({
	post: z
		.object({
			author_id: z.string().nullable().optional(),
			author_name: z.string().nullable().optional(),
			auto_comment: z.string().nullable().optional(),
			channels: AhrefsOpenList.nullable().optional(),
			created_at: z.string().nullable().optional(),
			external_post_id: z.string().nullable().optional(),
			permalink: z.string().nullable().optional(),
			post_id: z.number().nullable().optional(),
			status_timestamp: z.string().nullable().optional(),
			text_content: z.string().nullable().optional(),
		})
		.loose(),
});

export type SocialMediaDeletePostInput = z.infer<
	typeof SocialMediaDeletePostInputSchema
>;
export type SocialMediaDeletePostResponse = z.infer<
	typeof SocialMediaDeletePostResponseSchema
>;

export const ManagementCreateProjectInputSchema = z.object({
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
	access: z
		.enum(['private', 'shared'])
		.optional()
		.describe('The access type of the project.'),
	owned_by: z.string().optional().describe('The email of the project owner.'),
	project_name: z.string().min(1).describe('The name of the project.'),
	mode: z
		.enum(['exact', 'prefix', 'domain', 'subdomains'])
		.describe('The scope of the target.'),
	url: z.string().min(1).describe('The URL of your target.'),
	protocol: z
		.enum(['both', 'http', 'https'])
		.describe('The protocol of your target.'),
	folder_id: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The folder id to assign to the project.'),
});

export const ManagementCreateProjectRowSchema = z
	.object({
		access: z.string().nullable().optional(),
		folder: AhrefsOpenObject.nullable().optional(),
		keyword_count: z.number().nullable().optional(),
		mode: z.string().nullable().optional(),
		owned_by: z.string().nullable().optional(),
		project_id: z.string().nullable().optional(),
		project_name: z.string().nullable().optional(),
		protocol: z.string().nullable().optional(),
		url: z.string().nullable().optional(),
		verified: z.boolean().nullable().optional(),
		web_analytics_data_key: z.string().nullable().optional(),
	})
	.loose();

export const ManagementCreateProjectResponseSchema = z.object({
	projects: z.array(ManagementCreateProjectRowSchema),
});

export type ManagementCreateProjectRow = z.infer<
	typeof ManagementCreateProjectRowSchema
>;

export type ManagementCreateProjectInput = z.infer<
	typeof ManagementCreateProjectInputSchema
>;
export type ManagementCreateProjectResponse = z.infer<
	typeof ManagementCreateProjectResponseSchema
>;

export const ManagementUpdateProjectInputSchema = z.object({
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
	project_id: z
		.number()
		.int()
		.positive()
		.describe('The ID of the project whose access setting you want to update.'),
	folder: z
		.union([
			z.object({ operation: z.enum(['remove']) }),
			z.object({
				operation: z.enum(['move']),
				folder_id: z.number().int().positive(),
			}),
		])
		.optional()
		.describe('A folder operation, applied before the access change.'),
	access: z
		.enum(['private', 'shared'])
		.optional()
		.describe('The new access setting for the project.'),
});

export const ManagementUpdateProjectResponseSchema = z.object({
	project: z
		.object({
			access: z.string().nullable().optional(),
			folder: AhrefsOpenObject.nullable().optional(),
			mode: z.string().nullable().optional(),
			project_id: z.string().nullable().optional(),
			project_name: z.string().nullable().optional(),
			protocol: z.string().nullable().optional(),
			url: z.string().nullable().optional(),
		})
		.loose(),
});

export type ManagementUpdateProjectInput = z.infer<
	typeof ManagementUpdateProjectInputSchema
>;
export type ManagementUpdateProjectResponse = z.infer<
	typeof ManagementUpdateProjectResponseSchema
>;

export const ManagementDeleteProjectsInputSchema = z.object({
	project_ids: z
		.string()
		.describe(
			'A comma-separated list of the IDs of the projects you want to delete.',
		),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const ManagementDeleteProjectsRowSchema = z
	.object({
		access: z.string().nullable().optional(),
		folder: AhrefsOpenObject.nullable().optional(),
		keyword_count: z.number().nullable().optional(),
		mode: z.string().nullable().optional(),
		owned_by: z.string().nullable().optional(),
		project_id: z.string().nullable().optional(),
		project_name: z.string().nullable().optional(),
		protocol: z.string().nullable().optional(),
		url: z.string().nullable().optional(),
		verified: z.boolean().nullable().optional(),
		web_analytics_data_key: z.string().nullable().optional(),
	})
	.loose();

export const ManagementDeleteProjectsResponseSchema = z.object({
	projects: z.array(ManagementDeleteProjectsRowSchema),
});

export type ManagementDeleteProjectsRow = z.infer<
	typeof ManagementDeleteProjectsRowSchema
>;

export type ManagementDeleteProjectsInput = z.infer<
	typeof ManagementDeleteProjectsInputSchema
>;
export type ManagementDeleteProjectsResponse = z.infer<
	typeof ManagementDeleteProjectsResponseSchema
>;

export const ManagementAddProjectKeywordsInputSchema = z.object({
	project_id: z
		.number()
		.int()
		.positive()
		.describe('The unique identifier of the project.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
	keywords: z
		.array(
			z.object({
				keyword: z.string().min(1),
				tags: z.array(z.string()).optional(),
			}),
		)
		.describe('A list of keywords to add.'),
	locations: z
		.array(
			z.object({
				country: z.string().length(2),
				location_id: z.number().int().positive().optional(),
				language: z.string().optional(),
			}),
		)
		.describe('A list of locations to assign to given keywords.'),
});

export const ManagementAddProjectKeywordsRowSchema = z
	.object({
		keyword: z.string().nullable().optional(),
		language: z.string().nullable().optional(),
		language_code: z.string().nullable().optional(),
		location: z.string().nullable().optional(),
		location_id: z.number().nullable().optional(),
		tags: z.array(z.string()).nullable().optional(),
	})
	.loose();

export const ManagementAddProjectKeywordsResponseSchema = z.object({
	keywords: z.array(ManagementAddProjectKeywordsRowSchema),
});

export type ManagementAddProjectKeywordsRow = z.infer<
	typeof ManagementAddProjectKeywordsRowSchema
>;

export type ManagementAddProjectKeywordsInput = z.infer<
	typeof ManagementAddProjectKeywordsInputSchema
>;
export type ManagementAddProjectKeywordsResponse = z.infer<
	typeof ManagementAddProjectKeywordsResponseSchema
>;

export const ManagementDeleteProjectKeywordsInputSchema = z.object({
	project_id: z
		.number()
		.int()
		.positive()
		.describe('The unique identifier of the project.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
	keywords: z
		.array(
			z.object({
				keyword: z.string().min(1),
				country: z.string().length(2).optional(),
				location_id: z.number().int().positive().optional(),
				language: z.string().optional(),
			}),
		)
		.describe('A list of keywords to delete.'),
});

export const ManagementDeleteProjectKeywordsRowSchema = z
	.object({
		keyword: z.string().nullable().optional(),
		language: z.string().nullable().optional(),
		language_code: z.string().nullable().optional(),
		location: z.string().nullable().optional(),
		location_id: z.number().nullable().optional(),
		tags: z.array(z.string()).nullable().optional(),
	})
	.loose();

export const ManagementDeleteProjectKeywordsResponseSchema = z.object({
	keywords: z.array(ManagementDeleteProjectKeywordsRowSchema),
});

export type ManagementDeleteProjectKeywordsRow = z.infer<
	typeof ManagementDeleteProjectKeywordsRowSchema
>;

export type ManagementDeleteProjectKeywordsInput = z.infer<
	typeof ManagementDeleteProjectKeywordsInputSchema
>;
export type ManagementDeleteProjectKeywordsResponse = z.infer<
	typeof ManagementDeleteProjectKeywordsResponseSchema
>;

export const ManagementAddProjectKeywordTagsInputSchema = z.object({
	project_id: z
		.number()
		.int()
		.positive()
		.describe('The unique identifier of the project.'),
	keywords: z
		.array(
			z.object({
				keyword: z.string().min(1),
				country: z.string().length(2).optional(),
				location_id: z.number().int().positive().optional(),
				language: z.string().optional(),
			}),
		)
		.describe('A list of keywords to add.'),
	tags: z.array(z.string()).describe('A list of tags to add to the keywords.'),
	update_mode: z
		.enum(['add', 'replace'])
		.optional()
		.describe(
			'add appends tags to existing ones; replace overwrites all existing tags entirely.',
		),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const ManagementAddProjectKeywordTagsRowSchema = z
	.object({
		keyword: z.string().nullable().optional(),
		language: z.string().nullable().optional(),
		language_code: z.string().nullable().optional(),
		location: z.string().nullable().optional(),
		location_id: z.number().nullable().optional(),
		tags: z.array(z.string()).nullable().optional(),
	})
	.loose();

export const ManagementAddProjectKeywordTagsResponseSchema = z.object({
	keywords: z.array(ManagementAddProjectKeywordTagsRowSchema),
});

export type ManagementAddProjectKeywordTagsRow = z.infer<
	typeof ManagementAddProjectKeywordTagsRowSchema
>;

export type ManagementAddProjectKeywordTagsInput = z.infer<
	typeof ManagementAddProjectKeywordTagsInputSchema
>;
export type ManagementAddProjectKeywordTagsResponse = z.infer<
	typeof ManagementAddProjectKeywordTagsResponseSchema
>;

export const ManagementDeleteProjectKeywordTagsInputSchema = z.object({
	project_id: z
		.number()
		.int()
		.positive()
		.describe('The unique identifier of the project.'),
	keywords: z
		.array(
			z.object({
				keyword: z.string().min(1),
				country: z.string().length(2).optional(),
				location_id: z.number().int().positive().optional(),
				language: z.string().optional(),
			}),
		)
		.describe('A list of keywords to delete.'),
	tags: z
		.array(z.string())
		.describe('A list of tags to remove from the keywords.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const ManagementDeleteProjectKeywordTagsRowSchema = z
	.object({
		keyword: z.string().nullable().optional(),
		language: z.string().nullable().optional(),
		language_code: z.string().nullable().optional(),
		location: z.string().nullable().optional(),
		location_id: z.number().nullable().optional(),
		tags: z.array(z.string()).nullable().optional(),
	})
	.loose();

export const ManagementDeleteProjectKeywordTagsResponseSchema = z.object({
	keywords: z.array(ManagementDeleteProjectKeywordTagsRowSchema),
});

export type ManagementDeleteProjectKeywordTagsRow = z.infer<
	typeof ManagementDeleteProjectKeywordTagsRowSchema
>;

export type ManagementDeleteProjectKeywordTagsInput = z.infer<
	typeof ManagementDeleteProjectKeywordTagsInputSchema
>;
export type ManagementDeleteProjectKeywordTagsResponse = z.infer<
	typeof ManagementDeleteProjectKeywordTagsResponseSchema
>;

export const ManagementProjectCompetitorsInputSchema = z.object({
	project_id: z
		.number()
		.int()
		.positive()
		.describe('The unique identifier of the project.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const ManagementProjectCompetitorsRowSchema = z
	.object({
		mode: z.string().nullable().optional(),
		url: z.string().nullable().optional(),
	})
	.loose();

export const ManagementProjectCompetitorsResponseSchema = z.object({
	competitors: z.array(ManagementProjectCompetitorsRowSchema),
});

export type ManagementProjectCompetitorsRow = z.infer<
	typeof ManagementProjectCompetitorsRowSchema
>;

export type ManagementProjectCompetitorsInput = z.infer<
	typeof ManagementProjectCompetitorsInputSchema
>;
export type ManagementProjectCompetitorsResponse = z.infer<
	typeof ManagementProjectCompetitorsResponseSchema
>;

export const ManagementAddProjectCompetitorsInputSchema = z.object({
	project_id: z
		.number()
		.int()
		.positive()
		.describe('The unique identifier of the project.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
	competitors: z
		.array(
			z.object({
				url: z.string().min(1),
				mode: z.enum(['exact', 'prefix', 'domain', 'subdomains']),
			}),
		)
		.describe('A list of competitors to add.'),
});

export const ManagementAddProjectCompetitorsRowSchema = z
	.object({
		mode: z.string().nullable().optional(),
		url: z.string().nullable().optional(),
	})
	.loose();

export const ManagementAddProjectCompetitorsResponseSchema = z.object({
	competitors: z.array(ManagementAddProjectCompetitorsRowSchema),
});

export type ManagementAddProjectCompetitorsRow = z.infer<
	typeof ManagementAddProjectCompetitorsRowSchema
>;

export type ManagementAddProjectCompetitorsInput = z.infer<
	typeof ManagementAddProjectCompetitorsInputSchema
>;
export type ManagementAddProjectCompetitorsResponse = z.infer<
	typeof ManagementAddProjectCompetitorsResponseSchema
>;

export const ManagementDeleteProjectCompetitorsInputSchema = z.object({
	project_id: z
		.number()
		.int()
		.positive()
		.describe('The unique identifier of the project.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
	competitors: z
		.array(
			z.object({
				url: z.string().min(1),
				mode: z.enum(['exact', 'prefix', 'domain', 'subdomains']),
			}),
		)
		.describe('A list of competitors to delete.'),
});

export const ManagementDeleteProjectCompetitorsRowSchema = z
	.object({
		mode: z.string().nullable().optional(),
		url: z.string().nullable().optional(),
	})
	.loose();

export const ManagementDeleteProjectCompetitorsResponseSchema = z.object({
	competitors: z.array(ManagementDeleteProjectCompetitorsRowSchema),
});

export type ManagementDeleteProjectCompetitorsRow = z.infer<
	typeof ManagementDeleteProjectCompetitorsRowSchema
>;

export type ManagementDeleteProjectCompetitorsInput = z.infer<
	typeof ManagementDeleteProjectCompetitorsInputSchema
>;
export type ManagementDeleteProjectCompetitorsResponse = z.infer<
	typeof ManagementDeleteProjectCompetitorsResponseSchema
>;

export const ManagementCreateKeywordListInputSchema = z.object({
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
	name: z.string().min(1).describe('The name of the keyword list.'),
	location: z.string().describe('The location of the keyword list.'),
	countries: z
		.array(z.string().length(2))
		.optional()
		.describe("Up to 15 country codes to select when location is 'all'."),
	keywords: z.array(z.string()).optional().describe('Initial keywords to add.'),
	access: z
		.enum(['private', 'shared'])
		.optional()
		.describe('The access type of the keyword list.'),
	owned_by: z
		.string()
		.optional()
		.describe('The email of the keyword list owner.'),
	folder_id: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The ID of the folder to assign the keyword list to.'),
});

export const ManagementCreateKeywordListResponseSchema = z.object({
	keyword_list: z
		.object({
			access: z.string().nullable().optional(),
			countries: z.array(z.string()).nullable().optional(),
			folder_id: z.string().nullable().optional(),
			keyword_count: z.number().nullable().optional(),
			keyword_list_id: z.string().nullable().optional(),
			location: z.string().nullable().optional(),
			name: z.string().nullable().optional(),
			owned_by: z.string().nullable().optional(),
		})
		.loose(),
});

export type ManagementCreateKeywordListInput = z.infer<
	typeof ManagementCreateKeywordListInputSchema
>;
export type ManagementCreateKeywordListResponse = z.infer<
	typeof ManagementCreateKeywordListResponseSchema
>;

export const ManagementDeleteKeywordListsInputSchema = z.object({
	keyword_list_ids: z
		.string()
		.describe(
			'A comma-separated list of the IDs of the keyword lists to delete.',
		),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const ManagementDeleteKeywordListsRowSchema = z
	.object({
		access: z.string().nullable().optional(),
		countries: z.array(z.string()).nullable().optional(),
		folder_id: z.string().nullable().optional(),
		keyword_count: z.number().nullable().optional(),
		keyword_list_id: z.string().nullable().optional(),
		location: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
		owned_by: z.string().nullable().optional(),
	})
	.loose();

export const ManagementDeleteKeywordListsResponseSchema = z.object({
	keyword_lists: z.array(ManagementDeleteKeywordListsRowSchema),
});

export type ManagementDeleteKeywordListsRow = z.infer<
	typeof ManagementDeleteKeywordListsRowSchema
>;

export type ManagementDeleteKeywordListsInput = z.infer<
	typeof ManagementDeleteKeywordListsInputSchema
>;
export type ManagementDeleteKeywordListsResponse = z.infer<
	typeof ManagementDeleteKeywordListsResponseSchema
>;

export const ManagementAddKeywordListKeywordsInputSchema = z.object({
	keyword_list_id: z
		.number()
		.int()
		.positive()
		.describe('The id of an existing keyword list.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
	keywords: z.array(z.string()).describe('A list of keywords to add.'),
});

export const ManagementAddKeywordListKeywordsRowSchema = z
	.object({
		keyword: z.string().nullable().optional(),
	})
	.loose();

export const ManagementAddKeywordListKeywordsResponseSchema = z.object({
	keywords: z.array(ManagementAddKeywordListKeywordsRowSchema),
});

export type ManagementAddKeywordListKeywordsRow = z.infer<
	typeof ManagementAddKeywordListKeywordsRowSchema
>;

export type ManagementAddKeywordListKeywordsInput = z.infer<
	typeof ManagementAddKeywordListKeywordsInputSchema
>;
export type ManagementAddKeywordListKeywordsResponse = z.infer<
	typeof ManagementAddKeywordListKeywordsResponseSchema
>;

export const ManagementDeleteKeywordListKeywordsInputSchema = z.object({
	keyword_list_id: z
		.number()
		.int()
		.positive()
		.describe('The id of an existing keyword list.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
	keywords: z.array(z.string()).describe('A list of keywords to delete.'),
});

export const ManagementDeleteKeywordListKeywordsRowSchema = z
	.object({
		keyword: z.string().nullable().optional(),
	})
	.loose();

export const ManagementDeleteKeywordListKeywordsResponseSchema = z.object({
	keywords: z.array(ManagementDeleteKeywordListKeywordsRowSchema),
});

export type ManagementDeleteKeywordListKeywordsRow = z.infer<
	typeof ManagementDeleteKeywordListKeywordsRowSchema
>;

export type ManagementDeleteKeywordListKeywordsInput = z.infer<
	typeof ManagementDeleteKeywordListKeywordsInputSchema
>;
export type ManagementDeleteKeywordListKeywordsResponse = z.infer<
	typeof ManagementDeleteKeywordListKeywordsResponseSchema
>;

export const ManagementBrandRadarReportsInputSchema = z.object({
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const ManagementBrandRadarReportsRowSchema = z
	.object({
		created_at: z.string().nullable().optional(),
		project_id: z.number().nullable().optional(),
		prompts_frequency: AhrefsOpenList.nullable().optional(),
		report_id: z.string().nullable().optional(),
		report_name: z.string().nullable().optional(),
		settings: AhrefsOpenObject.nullable().optional(),
		updated_at: z.string().nullable().optional(),
	})
	.loose();

export const ManagementBrandRadarReportsResponseSchema = z.object({
	reports: z.array(ManagementBrandRadarReportsRowSchema),
});

export type ManagementBrandRadarReportsRow = z.infer<
	typeof ManagementBrandRadarReportsRowSchema
>;

export type ManagementBrandRadarReportsInput = z.infer<
	typeof ManagementBrandRadarReportsInputSchema
>;
export type ManagementBrandRadarReportsResponse = z.infer<
	typeof ManagementBrandRadarReportsResponseSchema
>;

export const ManagementCreateBrandRadarReportInputSchema = z.object({
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
	brand: z
		.union([
			z.array(
				z.object({
					names: z.array(z.string()).optional(),
					url_groups: z
						.array(
							z.object({
								target: z.string().min(1),
								scope: z.enum(['url', 'path', 'domain', 'subdomains']),
							}),
						)
						.optional(),
				}),
			),
			z.array(z.string()),
		])
		.optional()
		.describe(
			'At least one of brand or competitors is required to be non-empty.',
		),
	competitors: z
		.union([
			z.array(
				z.object({
					names: z.array(z.string()).optional(),
					url_groups: z
						.array(
							z.object({
								target: z.string().min(1),
								scope: z.enum(['url', 'path', 'domain', 'subdomains']),
							}),
						)
						.optional(),
				}),
			),
			z.array(z.string()),
		])
		.optional()
		.describe(
			'At least one of brand or competitors is required to be non-empty.',
		),
	name: z.string().min(1).optional().describe('The name of the report.'),
	project_id: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The ID of the project to use.'),
	country: z
		.array(z.string().length(2))
		.optional()
		.describe('Saved countries.'),
	where: AhrefsFilterExpression.optional().describe(
		'Filter expression as a JSON object; see the Ahrefs API docs for the fields this endpoint accepts.',
	),
	content_filter: z
		.object({
			include: z.array(z.string()).optional(),
			exclude: z.array(z.string()).optional(),
		})
		.optional()
		.describe(
			'Optional phrases used to include or exclude results based on their content.',
		),
	prompts_frequency: z
		.array(
			z.object({
				data_source: z.enum([
					'chatgpt',
					'google_ai_overviews',
					'google_ai_mode',
					'gemini',
					'perplexity',
					'copilot',
					'claude',
					'grok',
				]),
				frequency: z.enum(['daily', 'weekly', 'monthly', 'off']),
			}),
		)
		.optional()
		.describe('The prompts frequency to use.'),
});

export const ManagementCreateBrandRadarReportRowSchema = z
	.object({
		created_at: z.string().nullable().optional(),
		project_id: z.number().nullable().optional(),
		prompts_frequency: AhrefsOpenList.nullable().optional(),
		report_id: z.string().nullable().optional(),
		report_name: z.string().nullable().optional(),
		settings: AhrefsOpenObject.nullable().optional(),
		updated_at: z.string().nullable().optional(),
	})
	.loose();

export const ManagementCreateBrandRadarReportResponseSchema = z.object({
	reports: z.array(ManagementCreateBrandRadarReportRowSchema),
});

export type ManagementCreateBrandRadarReportRow = z.infer<
	typeof ManagementCreateBrandRadarReportRowSchema
>;

export type ManagementCreateBrandRadarReportInput = z.infer<
	typeof ManagementCreateBrandRadarReportInputSchema
>;
export type ManagementCreateBrandRadarReportResponse = z.infer<
	typeof ManagementCreateBrandRadarReportResponseSchema
>;

export const ManagementUpdateBrandRadarReportInputSchema = z.object({
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
	report_id: z.string().describe('The ID of the report to use.'),
	brand: z
		.array(
			z.object({
				names: z.array(z.string()).optional(),
				url_groups: z
					.array(
						z.object({
							target: z.string().min(1),
							scope: z.enum(['url', 'path', 'domain', 'subdomains']),
						}),
					)
					.optional(),
			}),
		)
		.optional()
		.describe('Replaces the saved brands.'),
	competitors: z
		.array(
			z.object({
				names: z.array(z.string()).optional(),
				url_groups: z
					.array(
						z.object({
							target: z.string().min(1),
							scope: z.enum(['url', 'path', 'domain', 'subdomains']),
						}),
					)
					.optional(),
			}),
		)
		.optional()
		.describe('Replaces the saved competitors.'),
	country: z
		.array(z.string().length(2))
		.optional()
		.describe('Replaces the saved countries.'),
	where: AhrefsFilterExpression.optional().describe(
		'Filter expression as a JSON object; see the Ahrefs API docs for the fields this endpoint accepts.',
	),
	content_filter: z
		.object({
			include: z.array(z.string()).optional(),
			exclude: z.array(z.string()).optional(),
		})
		.optional()
		.describe('Replaces the saved content filter.'),
	prompts_frequency: z
		.array(
			z.object({
				data_source: z.enum([
					'chatgpt',
					'google_ai_overviews',
					'google_ai_mode',
					'gemini',
					'perplexity',
					'copilot',
					'claude',
					'grok',
				]),
				frequency: z.enum(['daily', 'weekly', 'monthly', 'off']),
			}),
		)
		.describe(
			'Data source frequencies; the API requires this on every update, so send the current values to keep them.',
		),
});

export const ManagementUpdateBrandRadarReportRowSchema = z
	.object({
		created_at: z.string().nullable().optional(),
		project_id: z.number().nullable().optional(),
		prompts_frequency: AhrefsOpenList.nullable().optional(),
		report_id: z.string().nullable().optional(),
		report_name: z.string().nullable().optional(),
		settings: AhrefsOpenObject.nullable().optional(),
		updated_at: z.string().nullable().optional(),
	})
	.loose();

export const ManagementUpdateBrandRadarReportResponseSchema = z.object({
	reports: z.array(ManagementUpdateBrandRadarReportRowSchema),
});

export type ManagementUpdateBrandRadarReportRow = z.infer<
	typeof ManagementUpdateBrandRadarReportRowSchema
>;

export type ManagementUpdateBrandRadarReportInput = z.infer<
	typeof ManagementUpdateBrandRadarReportInputSchema
>;
export type ManagementUpdateBrandRadarReportResponse = z.infer<
	typeof ManagementUpdateBrandRadarReportResponseSchema
>;

export const ManagementBrandRadarPromptsInputSchema = z.object({
	report_id: z.string().describe('The ID of the report to use.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const ManagementBrandRadarPromptsRowSchema = z
	.object({
		country: z.string().nullable().optional(),
		created_at: z.string().nullable().optional(),
		prompt: z.string().nullable().optional(),
		tags: z.array(z.string()).nullable().optional(),
	})
	.loose();

export const ManagementBrandRadarPromptsResponseSchema = z.object({
	prompts: z.array(ManagementBrandRadarPromptsRowSchema),
});

export type ManagementBrandRadarPromptsRow = z.infer<
	typeof ManagementBrandRadarPromptsRowSchema
>;

export type ManagementBrandRadarPromptsInput = z.infer<
	typeof ManagementBrandRadarPromptsInputSchema
>;
export type ManagementBrandRadarPromptsResponse = z.infer<
	typeof ManagementBrandRadarPromptsResponseSchema
>;

export const ManagementAddBrandRadarPromptsInputSchema = z.object({
	report_id: z.string().describe('The ID of the report to use.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
	prompts: z.array(z.string()).describe('A list of custom prompts to add.'),
	countries: z
		.array(z.string().length(2))
		.describe('A list of two-letter country codes (ISO 3166-1 alpha-2).'),
	tags: z
		.array(z.string())
		.optional()
		.describe('A list of tags to assign to the prompts.'),
});

export const ManagementAddBrandRadarPromptsRowSchema = z
	.object({
		country: z.string().nullable().optional(),
		created_at: z.string().nullable().optional(),
		prompt: z.string().nullable().optional(),
		tags: z.array(z.string()).nullable().optional(),
	})
	.loose();

export const ManagementAddBrandRadarPromptsResponseSchema = z.object({
	prompts: z.array(ManagementAddBrandRadarPromptsRowSchema),
});

export type ManagementAddBrandRadarPromptsRow = z.infer<
	typeof ManagementAddBrandRadarPromptsRowSchema
>;

export type ManagementAddBrandRadarPromptsInput = z.infer<
	typeof ManagementAddBrandRadarPromptsInputSchema
>;
export type ManagementAddBrandRadarPromptsResponse = z.infer<
	typeof ManagementAddBrandRadarPromptsResponseSchema
>;

export const ManagementUpdateBrandRadarPromptsInputSchema = z.object({
	report_id: z.string().describe('The ID of the report to use.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
	prompts: z
		.array(z.string())
		.describe('A list of custom prompts of the report to update.'),
	countries: z
		.union([
			z.object({
				operation: z.enum(['add']),
				countries: z.array(z.string().length(2)),
			}),
			z.object({
				operation: z.enum(['remove']),
				countries: z.array(z.string().length(2)),
			}),
		])
		.optional()
		.describe('The country operation to apply to the prompts.'),
	tags: z
		.union([
			z.object({ operation: z.enum(['add']), tags: z.array(z.string()) }),
			z.object({ operation: z.enum(['remove']), tags: z.array(z.string()) }),
			z.object({ operation: z.enum(['replace']), tags: z.array(z.string()) }),
		])
		.optional()
		.describe('The tag operation to apply to the prompts.'),
});

export const ManagementUpdateBrandRadarPromptsRowSchema = z
	.object({
		country: z.string().nullable().optional(),
		created_at: z.string().nullable().optional(),
		prompt: z.string().nullable().optional(),
		tags: z.array(z.string()).nullable().optional(),
	})
	.loose();

export const ManagementUpdateBrandRadarPromptsResponseSchema = z.object({
	prompts: z.array(ManagementUpdateBrandRadarPromptsRowSchema),
});

export type ManagementUpdateBrandRadarPromptsRow = z.infer<
	typeof ManagementUpdateBrandRadarPromptsRowSchema
>;

export type ManagementUpdateBrandRadarPromptsInput = z.infer<
	typeof ManagementUpdateBrandRadarPromptsInputSchema
>;
export type ManagementUpdateBrandRadarPromptsResponse = z.infer<
	typeof ManagementUpdateBrandRadarPromptsResponseSchema
>;

export const ManagementDeleteBrandRadarPromptsInputSchema = z.object({
	report_id: z.string().describe('The ID of the report to use.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
	prompts: z.array(z.string()).describe('A list of custom prompts to delete.'),
	countries: z
		.array(z.string().length(2))
		.optional()
		.describe('A list of two-letter country codes (ISO 3166-1 alpha-2).'),
});

export const ManagementDeleteBrandRadarPromptsRowSchema = z
	.object({
		country: z.string().nullable().optional(),
		created_at: z.string().nullable().optional(),
		prompt: z.string().nullable().optional(),
		tags: z.array(z.string()).nullable().optional(),
	})
	.loose();

export const ManagementDeleteBrandRadarPromptsResponseSchema = z.object({
	prompts: z.array(ManagementDeleteBrandRadarPromptsRowSchema),
});

export type ManagementDeleteBrandRadarPromptsRow = z.infer<
	typeof ManagementDeleteBrandRadarPromptsRowSchema
>;

export type ManagementDeleteBrandRadarPromptsInput = z.infer<
	typeof ManagementDeleteBrandRadarPromptsInputSchema
>;
export type ManagementDeleteBrandRadarPromptsResponse = z.infer<
	typeof ManagementDeleteBrandRadarPromptsResponseSchema
>;

export const SiteExplorerAiResponsesCountInputSchema = z.object({
	select: z
		.string()
		.min(1)
		.describe('A comma-separated list of fields to return.'),
	date: isoDateString
		.optional()
		.describe('The date to report on in YYYY-MM-DD format.'),
	mode: z
		.enum(['exact', 'prefix', 'domain', 'subdomains'])
		.optional()
		.describe('The scope of the target.'),
	target: z
		.string()
		.min(1)
		.describe('The target of the search: a domain or a URL.'),
	protocol: z
		.enum(['both', 'http', 'https'])
		.optional()
		.describe('The protocol of your target.'),
	country: z
		.string()
		.length(2)
		.optional()
		.describe('A two-letter country code (ISO 3166-1 alpha-2).'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const SiteExplorerAiResponsesCountResponseSchema = z.object({
	ai_responses_count: z
		.object({
			all_platforms: AhrefsOpenObject.nullable().optional(),
			chatgpt: AhrefsOpenObject.nullable().optional(),
			copilot: AhrefsOpenObject.nullable().optional(),
			gemini: AhrefsOpenObject.nullable().optional(),
			google_ai_mode: AhrefsOpenObject.nullable().optional(),
			google_ai_mode_keywords: AhrefsOpenObject.nullable().optional(),
			google_ai_overviews: AhrefsOpenObject.nullable().optional(),
			google_ai_overviews_keywords: AhrefsOpenObject.nullable().optional(),
			grok: AhrefsOpenObject.nullable().optional(),
			perplexity: AhrefsOpenObject.nullable().optional(),
		})
		.loose(),
});

export type SiteExplorerAiResponsesCountInput = z.infer<
	typeof SiteExplorerAiResponsesCountInputSchema
>;
export type SiteExplorerAiResponsesCountResponse = z.infer<
	typeof SiteExplorerAiResponsesCountResponseSchema
>;

export const SiteExplorerCrawledPagesInputSchema = z.object({
	select: z
		.string()
		.min(1)
		.describe('A comma-separated list of fields to return.'),
	order_by: z
		.string()
		.optional()
		.describe('A field to order the results by, with optional direction.'),
	where: z
		.string()
		.optional()
		.describe(
			'Filter expression as a JSON string; see the Ahrefs API docs for the fields this endpoint accepts.',
		),
	target: z
		.string()
		.min(1)
		.describe('The target of the search: a domain or a URL.'),
	mode: z
		.enum(['exact', 'prefix', 'domain', 'subdomains'])
		.optional()
		.describe('The scope of the target.'),
	protocol: z
		.enum(['both', 'http', 'https'])
		.optional()
		.describe('The protocol of your target.'),
	limit: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The number of results to return.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const SiteExplorerCrawledPagesRowSchema = z
	.object({
		first_seen: z.string().nullable().optional(),
		http_code: z.number().nullable().optional(),
		languages: z.array(z.string()).nullable().optional(),
		last_attempt: z.string().nullable().optional(),
		last_crawled: z.string().nullable().optional(),
		page_category: z.string().nullable().optional(),
		page_type: z.string().nullable().optional(),
		publish_date: z.string().nullable().optional(),
		title: z.string().nullable().optional(),
		url: z.string().nullable().optional(),
		url_rating: z.number().nullable().optional(),
	})
	.loose();

export const SiteExplorerCrawledPagesResponseSchema = z.object({
	pages: z.array(SiteExplorerCrawledPagesRowSchema),
});

export type SiteExplorerCrawledPagesRow = z.infer<
	typeof SiteExplorerCrawledPagesRowSchema
>;

export type SiteExplorerCrawledPagesInput = z.infer<
	typeof SiteExplorerCrawledPagesInputSchema
>;
export type SiteExplorerCrawledPagesResponse = z.infer<
	typeof SiteExplorerCrawledPagesResponseSchema
>;

export const SiteExplorerLinkedAnchorsExternalInputSchema = z.object({
	select: z
		.string()
		.min(1)
		.describe('A comma-separated list of columns to return.'),
	where: z
		.string()
		.optional()
		.describe(
			'Filter expression as a JSON string; see the Ahrefs API docs for the fields this endpoint accepts.',
		),
	order_by: z
		.string()
		.optional()
		.describe(
			'A comma-separated list of columns to order results by, with optional direction.',
		),
	limit: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The number of results to return.'),
	timeout: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('A manual timeout duration in seconds.'),
	mode: z
		.enum(['exact', 'prefix', 'domain', 'subdomains'])
		.optional()
		.describe('The scope of the search based on the target you entered.'),
	target: z
		.string()
		.min(1)
		.describe('The target of the search: a domain or a URL.'),
	portfolio_id: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The unique identifier of the portfolio.'),
	protocol: z
		.enum(['both', 'http', 'https'])
		.optional()
		.describe('The protocol of your target.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const SiteExplorerLinkedAnchorsExternalRowSchema = z
	.object({
		anchor: z.string().nullable().optional(),
		dofollow_links: z.number().nullable().optional(),
		first_seen: z.string().nullable().optional(),
		linked_domains: z.number().nullable().optional(),
		linked_pages: z.number().nullable().optional(),
		links_from_target: z.number().nullable().optional(),
	})
	.loose();

export const SiteExplorerLinkedAnchorsExternalResponseSchema = z.object({
	linkedanchors: z.array(SiteExplorerLinkedAnchorsExternalRowSchema),
});

export type SiteExplorerLinkedAnchorsExternalRow = z.infer<
	typeof SiteExplorerLinkedAnchorsExternalRowSchema
>;

export type SiteExplorerLinkedAnchorsExternalInput = z.infer<
	typeof SiteExplorerLinkedAnchorsExternalInputSchema
>;
export type SiteExplorerLinkedAnchorsExternalResponse = z.infer<
	typeof SiteExplorerLinkedAnchorsExternalResponseSchema
>;

export const SiteExplorerLinkedAnchorsInternalInputSchema = z.object({
	select: z
		.string()
		.min(1)
		.describe('A comma-separated list of columns to return.'),
	where: z
		.string()
		.optional()
		.describe(
			'Filter expression as a JSON string; see the Ahrefs API docs for the fields this endpoint accepts.',
		),
	order_by: z
		.string()
		.optional()
		.describe(
			'A comma-separated list of columns to order results by, with optional direction.',
		),
	limit: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The number of results to return.'),
	timeout: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('A manual timeout duration in seconds.'),
	mode: z
		.enum(['exact', 'prefix', 'domain', 'subdomains'])
		.optional()
		.describe('The scope of the search based on the target you entered.'),
	target: z
		.string()
		.min(1)
		.describe('The target of the search: a domain or a URL.'),
	portfolio_id: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The unique identifier of the portfolio.'),
	protocol: z
		.enum(['both', 'http', 'https'])
		.optional()
		.describe('The protocol of your target.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const SiteExplorerLinkedAnchorsInternalRowSchema = z
	.object({
		anchor: z.string().nullable().optional(),
		dofollow_links: z.number().nullable().optional(),
		first_seen: z.string().nullable().optional(),
		linked_pages: z.number().nullable().optional(),
		links_from_target: z.number().nullable().optional(),
	})
	.loose();

export const SiteExplorerLinkedAnchorsInternalResponseSchema = z.object({
	linkedanchors: z.array(SiteExplorerLinkedAnchorsInternalRowSchema),
});

export type SiteExplorerLinkedAnchorsInternalRow = z.infer<
	typeof SiteExplorerLinkedAnchorsInternalRowSchema
>;

export type SiteExplorerLinkedAnchorsInternalInput = z.infer<
	typeof SiteExplorerLinkedAnchorsInternalInputSchema
>;
export type SiteExplorerLinkedAnchorsInternalResponse = z.infer<
	typeof SiteExplorerLinkedAnchorsInternalResponseSchema
>;

export const SiteExplorerMetricsByCountryInputSchema = z.object({
	select: z
		.string()
		.min(1)
		.optional()
		.describe('A comma-separated list of columns to return.'),
	limit: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The number of results to return.'),
	date: isoDateString.describe(
		'A date to report metrics on in YYYY-MM-DD format.',
	),
	mode: z
		.enum(['exact', 'prefix', 'domain', 'subdomains'])
		.optional()
		.describe('The scope of the target.'),
	target: z
		.string()
		.min(1)
		.describe('The target of the search: a domain or a URL.'),
	portfolio_id: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The unique identifier of the portfolio.'),
	protocol: z
		.enum(['both', 'http', 'https'])
		.optional()
		.describe('The protocol of your target.'),
	volume_mode: z
		.enum(['monthly', 'average'])
		.optional()
		.describe('The search volume calculation mode: monthly or average.'),
	traffic_mode: z
		.enum(['static', 'adaptive'])
		.optional()
		.describe('The organic traffic calculation mode: static or adaptive.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const SiteExplorerMetricsByCountryRowSchema = z
	.object({
		country: z.string().nullable().optional(),
		org_cost: z.number().nullable().optional(),
		org_keywords: z.number().nullable().optional(),
		org_keywords_1_3: z.number().nullable().optional(),
		org_traffic: z.number().nullable().optional(),
		paid_cost: z.number().nullable().optional(),
		paid_keywords: z.number().nullable().optional(),
		paid_pages: z.number().nullable().optional(),
		paid_traffic: z.number().nullable().optional(),
	})
	.loose();

export const SiteExplorerMetricsByCountryResponseSchema = z.object({
	metrics: z.array(SiteExplorerMetricsByCountryRowSchema),
});

export type SiteExplorerMetricsByCountryRow = z.infer<
	typeof SiteExplorerMetricsByCountryRowSchema
>;

export type SiteExplorerMetricsByCountryInput = z.infer<
	typeof SiteExplorerMetricsByCountryInputSchema
>;
export type SiteExplorerMetricsByCountryResponse = z.infer<
	typeof SiteExplorerMetricsByCountryResponseSchema
>;

export const SiteExplorerOutlinksStatsInputSchema = z.object({
	target: z
		.string()
		.min(1)
		.describe('The target of the search: a domain or a URL.'),
	mode: z
		.enum(['exact', 'prefix', 'domain', 'subdomains'])
		.optional()
		.describe('The scope of the target.'),
	protocol: z
		.enum(['both', 'http', 'https'])
		.optional()
		.describe('The protocol of your target.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const SiteExplorerOutlinksStatsResponseSchema = z.object({
	metrics: z
		.object({
			linked_domains: z.number().nullable().optional(),
			linked_domains_dofollow: z.number().nullable().optional(),
			outgoing_links: z.number().nullable().optional(),
			outgoing_links_dofollow: z.number().nullable().optional(),
		})
		.loose(),
});

export type SiteExplorerOutlinksStatsInput = z.infer<
	typeof SiteExplorerOutlinksStatsInputSchema
>;
export type SiteExplorerOutlinksStatsResponse = z.infer<
	typeof SiteExplorerOutlinksStatsResponseSchema
>;

export const SiteExplorerPagesByInternalLinksInputSchema = z.object({
	select: z
		.string()
		.min(1)
		.describe('A comma-separated list of columns to return.'),
	where: z
		.string()
		.optional()
		.describe(
			'Filter expression as a JSON string; see the Ahrefs API docs for the fields this endpoint accepts.',
		),
	order_by: z.string().optional().describe('A column to order results by.'),
	limit: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The number of results to return.'),
	timeout: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('A manual timeout duration in seconds.'),
	mode: z
		.enum(['exact', 'prefix', 'domain', 'subdomains'])
		.optional()
		.describe('The scope of the search based on the target you entered.'),
	target: z
		.string()
		.min(1)
		.describe('The target of the search: a domain or a URL.'),
	portfolio_id: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The unique identifier of the portfolio.'),
	protocol: z
		.enum(['both', 'http', 'https'])
		.optional()
		.describe('The protocol of your target.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const SiteExplorerPagesByInternalLinksRowSchema = z
	.object({
		canonical_to_target: z.number().nullable().optional(),
		dofollow_to_target: z.number().nullable().optional(),
		first_seen_link: z.string().nullable().optional(),
		http_code_target: z.number().nullable().optional(),
		languages_target: z.array(z.string()).nullable().optional(),
		last_seen: z.string().nullable().optional(),
		last_visited_source: z.string().nullable().optional(),
		last_visited_target: z.string().nullable().optional(),
		links_to_target: z.number().nullable().optional(),
		nofollow_to_target: z.number().nullable().optional(),
		page_type_target: z.string().nullable().optional(),
		powered_by_target: z.array(z.string()).nullable().optional(),
		redirects_to_target: z.number().nullable().optional(),
		target_redirect: z.string().nullable().optional(),
		title_target: z.string().nullable().optional(),
		url_rating_target: z.number().nullable().optional(),
		url_to: z.string().nullable().optional(),
		url_to_plain: z.string().nullable().optional(),
	})
	.loose();

export const SiteExplorerPagesByInternalLinksResponseSchema = z.object({
	pages: z.array(SiteExplorerPagesByInternalLinksRowSchema),
});

export type SiteExplorerPagesByInternalLinksRow = z.infer<
	typeof SiteExplorerPagesByInternalLinksRowSchema
>;

export type SiteExplorerPagesByInternalLinksInput = z.infer<
	typeof SiteExplorerPagesByInternalLinksInputSchema
>;
export type SiteExplorerPagesByInternalLinksResponse = z.infer<
	typeof SiteExplorerPagesByInternalLinksResponseSchema
>;

export const SiteExplorerPagesHistoryInputSchema = z.object({
	mode: z
		.enum(['exact', 'prefix', 'domain', 'subdomains'])
		.optional()
		.describe('The scope of the target.'),
	target: z
		.string()
		.min(1)
		.describe('The target of the search: a domain or a URL.'),
	portfolio_id: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The unique identifier of the portfolio.'),
	protocol: z
		.enum(['both', 'http', 'https'])
		.optional()
		.describe('The protocol of your target.'),
	country: z
		.string()
		.length(2)
		.optional()
		.describe('A two-letter country code (ISO 3166-1 alpha-2).'),
	date_from: isoDateString.describe(
		'The start date of the historical period in YYYY-MM-DD format.',
	),
	date_to: isoDateString
		.optional()
		.describe('The end date of the historical period in YYYY-MM-DD format.'),
	history_grouping: z
		.enum(['daily', 'weekly', 'monthly'])
		.optional()
		.describe('The time interval used to group historical data.'),
	page_positions: z
		.enum(['top10', 'top100'])
		.optional()
		.describe('Filter pages by their ranking position.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const SiteExplorerPagesHistoryRowSchema = z
	.object({
		date: z.string().nullable().optional(),
		pages: z.number().nullable().optional(),
	})
	.loose();

export const SiteExplorerPagesHistoryResponseSchema = z.object({
	pages: z.array(SiteExplorerPagesHistoryRowSchema),
});

export type SiteExplorerPagesHistoryRow = z.infer<
	typeof SiteExplorerPagesHistoryRowSchema
>;

export type SiteExplorerPagesHistoryInput = z.infer<
	typeof SiteExplorerPagesHistoryInputSchema
>;
export type SiteExplorerPagesHistoryResponse = z.infer<
	typeof SiteExplorerPagesHistoryResponseSchema
>;

export const SiteExplorerPaidPagesInputSchema = z.object({
	select: z
		.string()
		.min(1)
		.describe('A comma-separated list of columns to return.'),
	where: z
		.string()
		.optional()
		.describe(
			'Filter expression as a JSON string; see the Ahrefs API docs for the fields this endpoint accepts.',
		),
	order_by: z
		.string()
		.optional()
		.describe(
			'A comma-separated list of columns to order results by, with optional direction.',
		),
	limit: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The number of results to return.'),
	timeout: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('A manual timeout duration in seconds.'),
	volume_mode: z
		.enum(['monthly', 'average'])
		.optional()
		.describe('The search volume calculation mode: monthly or average.'),
	date: isoDateString.describe(
		'A date to report metrics on in YYYY-MM-DD format.',
	),
	date_compared: isoDateString
		.optional()
		.describe('A date to compare metrics with in YYYY-MM-DD format.'),
	country: z
		.string()
		.length(2)
		.optional()
		.describe('A two-letter country code (ISO 3166-1 alpha-2).'),
	mode: z
		.enum(['exact', 'prefix', 'domain', 'subdomains'])
		.optional()
		.describe('The scope of the search based on the target you entered.'),
	target: z
		.string()
		.min(1)
		.describe('The target of the search: a domain or a URL.'),
	portfolio_id: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The unique identifier of the portfolio.'),
	protocol: z
		.enum(['both', 'http', 'https'])
		.optional()
		.describe('The protocol of your target.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const SiteExplorerPaidPagesRowSchema = z
	.object({
		ads_count: z.number().nullable().optional(),
		ads_count_diff: z.number().nullable().optional(),
		ads_count_prev: z.number().nullable().optional(),
		keywords: z.number().nullable().optional(),
		keywords_diff: z.number().nullable().optional(),
		keywords_diff_percent: z.number().nullable().optional(),
		keywords_merged: z.number().nullable().optional(),
		keywords_prev: z.number().nullable().optional(),
		raw_url: z.string().nullable().optional(),
		raw_url_prev: z.string().nullable().optional(),
		referring_domains: z.number().nullable().optional(),
		status: z.string().nullable().optional(),
		sum_traffic: z.number().nullable().optional(),
		sum_traffic_merged: z.number().nullable().optional(),
		sum_traffic_prev: z.number().nullable().optional(),
		top_keyword: z.string().nullable().optional(),
		top_keyword_best_position: z.number().nullable().optional(),
		top_keyword_best_position_diff: z.number().nullable().optional(),
		top_keyword_best_position_kind: z.string().nullable().optional(),
		top_keyword_best_position_kind_prev: z.string().nullable().optional(),
		top_keyword_best_position_prev: z.number().nullable().optional(),
		top_keyword_best_position_title: z.string().nullable().optional(),
		top_keyword_best_position_title_prev: z.string().nullable().optional(),
		top_keyword_country: z.string().nullable().optional(),
		top_keyword_country_prev: z.string().nullable().optional(),
		top_keyword_prev: z.string().nullable().optional(),
		top_keyword_volume: z.number().nullable().optional(),
		top_keyword_volume_prev: z.number().nullable().optional(),
		traffic_diff: z.number().nullable().optional(),
		traffic_diff_percent: z.number().nullable().optional(),
		ur: z.number().nullable().optional(),
		url: z.string().nullable().optional(),
		url_prev: z.string().nullable().optional(),
		value: z.number().nullable().optional(),
		value_diff: z.number().nullable().optional(),
		value_diff_percent: z.number().nullable().optional(),
		value_merged: z.number().nullable().optional(),
		value_prev: z.number().nullable().optional(),
	})
	.loose();

export const SiteExplorerPaidPagesResponseSchema = z.object({
	pages: z.array(SiteExplorerPaidPagesRowSchema),
});

export type SiteExplorerPaidPagesRow = z.infer<
	typeof SiteExplorerPaidPagesRowSchema
>;

export type SiteExplorerPaidPagesInput = z.infer<
	typeof SiteExplorerPaidPagesInputSchema
>;
export type SiteExplorerPaidPagesResponse = z.infer<
	typeof SiteExplorerPaidPagesResponseSchema
>;

export const SiteExplorerTotalSearchVolumeHistoryInputSchema = z.object({
	mode: z
		.enum(['exact', 'prefix', 'domain', 'subdomains'])
		.optional()
		.describe('The scope of the target.'),
	target: z
		.string()
		.min(1)
		.describe('The target of the search: a domain or a URL.'),
	portfolio_id: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The unique identifier of the portfolio.'),
	protocol: z
		.enum(['both', 'http', 'https'])
		.optional()
		.describe('The protocol of your target.'),
	country: z
		.string()
		.length(2)
		.optional()
		.describe('A two-letter country code (ISO 3166-1 alpha-2).'),
	date_from: isoDateString.describe(
		'The start date of the historical period in YYYY-MM-DD format.',
	),
	date_to: isoDateString
		.optional()
		.describe('The end date of the historical period in YYYY-MM-DD format.'),
	history_grouping: z
		.enum(['daily', 'weekly', 'monthly'])
		.optional()
		.describe('The time interval used to group historical data.'),
	top_positions: z
		.enum(['top_10', 'top_100'])
		.optional()
		.describe(
			'The number of top organic search positions to consider when calculating total search volume.',
		),
	volume_mode: z
		.enum(['monthly', 'average'])
		.optional()
		.describe('The search volume calculation mode: monthly or average.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const SiteExplorerTotalSearchVolumeHistoryRowSchema = z
	.object({
		date: z.string().nullable().optional(),
		total_search_volume: z.number().nullable().optional(),
	})
	.loose();

export const SiteExplorerTotalSearchVolumeHistoryResponseSchema = z.object({
	metrics: z.array(SiteExplorerTotalSearchVolumeHistoryRowSchema),
});

export type SiteExplorerTotalSearchVolumeHistoryRow = z.infer<
	typeof SiteExplorerTotalSearchVolumeHistoryRowSchema
>;

export type SiteExplorerTotalSearchVolumeHistoryInput = z.infer<
	typeof SiteExplorerTotalSearchVolumeHistoryInputSchema
>;
export type SiteExplorerTotalSearchVolumeHistoryResponse = z.infer<
	typeof SiteExplorerTotalSearchVolumeHistoryResponseSchema
>;

export const SiteExplorerUrlRatingHistoryInputSchema = z.object({
	target: z
		.string()
		.min(1)
		.describe('The target of the search: a domain or a URL.'),
	date_from: isoDateString.describe(
		'The start date of the historical period in YYYY-MM-DD format.',
	),
	date_to: isoDateString
		.optional()
		.describe('The end date of the historical period in YYYY-MM-DD format.'),
	history_grouping: z
		.enum(['daily', 'weekly', 'monthly'])
		.optional()
		.describe('The time interval used to group historical data.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const SiteExplorerUrlRatingHistoryRowSchema = z
	.object({
		date: z.string().nullable().optional(),
		url_rating: z.number().nullable().optional(),
	})
	.loose();

export const SiteExplorerUrlRatingHistoryResponseSchema = z.object({
	url_ratings: z.array(SiteExplorerUrlRatingHistoryRowSchema),
});

export type SiteExplorerUrlRatingHistoryRow = z.infer<
	typeof SiteExplorerUrlRatingHistoryRowSchema
>;

export type SiteExplorerUrlRatingHistoryInput = z.infer<
	typeof SiteExplorerUrlRatingHistoryInputSchema
>;
export type SiteExplorerUrlRatingHistoryResponse = z.infer<
	typeof SiteExplorerUrlRatingHistoryResponseSchema
>;

export const RankTrackerCompetitorsDomainsInputSchema = z.object({
	select: z
		.string()
		.min(1)
		.describe('A comma-separated list of columns to return.'),
	where: z
		.string()
		.optional()
		.describe(
			'Filter expression as a JSON string; see the Ahrefs API docs for the fields this endpoint accepts.',
		),
	order_by: z
		.string()
		.optional()
		.describe(
			'A comma-separated list of columns to order results by, with optional direction.',
		),
	limit: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The number of results to return.'),
	timeout: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('A manual timeout duration in seconds.'),
	volume_mode: z
		.enum(['monthly', 'average'])
		.optional()
		.describe('The search volume calculation mode: monthly or average.'),
	project_id: z
		.number()
		.int()
		.positive()
		.describe('The unique identifier of the project.'),
	device: z
		.enum(['desktop', 'mobile'])
		.describe('Choose between mobile and desktop rankings.'),
	date: isoDateString.describe(
		'A date to report metrics on in YYYY-MM-DD format.',
	),
	date_compared: isoDateString
		.optional()
		.describe('A date to compare metrics with in YYYY-MM-DD format.'),
	target_and_tracked_competitors_only: z
		.boolean()
		.optional()
		.describe('Restrict domains to target and tracked competitors'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const RankTrackerCompetitorsDomainsRowSchema = z
	.object({
		domain: z.string().nullable().optional(),
		keywords: z.number().nullable().optional(),
		pages: z.number().nullable().optional(),
		share_of_traffic_value: z.number().nullable().optional(),
		share_of_traffic_value_prev: z.number().nullable().optional(),
		share_of_voice: z.number().nullable().optional(),
		share_of_voice_prev: z.number().nullable().optional(),
		status: z.string().nullable().optional(),
		traffic: z.number().nullable().optional(),
		traffic_prev: z.number().nullable().optional(),
		traffic_value: z.number().nullable().optional(),
		traffic_value_prev: z.number().nullable().optional(),
	})
	.loose();

export const RankTrackerCompetitorsDomainsResponseSchema = z.object({
	'competitors-domains': z.array(RankTrackerCompetitorsDomainsRowSchema),
});

export type RankTrackerCompetitorsDomainsRow = z.infer<
	typeof RankTrackerCompetitorsDomainsRowSchema
>;

export type RankTrackerCompetitorsDomainsInput = z.infer<
	typeof RankTrackerCompetitorsDomainsInputSchema
>;
export type RankTrackerCompetitorsDomainsResponse = z.infer<
	typeof RankTrackerCompetitorsDomainsResponseSchema
>;

export const RankTrackerCompetitorsPagesInputSchema = z.object({
	select: z
		.string()
		.min(1)
		.describe('A comma-separated list of columns to return.'),
	where: z
		.string()
		.optional()
		.describe(
			'Filter expression as a JSON string; see the Ahrefs API docs for the fields this endpoint accepts.',
		),
	order_by: z
		.string()
		.optional()
		.describe(
			'A comma-separated list of columns to order results by, with optional direction.',
		),
	limit: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The number of results to return.'),
	timeout: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('A manual timeout duration in seconds.'),
	volume_mode: z
		.enum(['monthly', 'average'])
		.optional()
		.describe('The search volume calculation mode: monthly or average.'),
	project_id: z
		.number()
		.int()
		.positive()
		.describe('The unique identifier of the project.'),
	device: z
		.enum(['desktop', 'mobile'])
		.describe('Choose between mobile and desktop rankings.'),
	date: isoDateString.describe(
		'A date to report metrics on in YYYY-MM-DD format.',
	),
	date_compared: isoDateString
		.optional()
		.describe('A date to compare metrics with in YYYY-MM-DD format.'),
	target_and_tracked_competitors_only: z
		.boolean()
		.optional()
		.describe('Restrict pages to target and tracked competitors'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const RankTrackerCompetitorsPagesRowSchema = z
	.object({
		keywords: z.number().nullable().optional(),
		share_of_traffic_value: z.number().nullable().optional(),
		share_of_traffic_value_prev: z.number().nullable().optional(),
		share_of_voice: z.number().nullable().optional(),
		share_of_voice_prev: z.number().nullable().optional(),
		status: z.string().nullable().optional(),
		title: z.string().nullable().optional(),
		title_prev: z.string().nullable().optional(),
		traffic: z.number().nullable().optional(),
		traffic_prev: z.number().nullable().optional(),
		traffic_value: z.number().nullable().optional(),
		traffic_value_prev: z.number().nullable().optional(),
		url: z.string().nullable().optional(),
	})
	.loose();

export const RankTrackerCompetitorsPagesResponseSchema = z.object({
	'competitors-pages': z.array(RankTrackerCompetitorsPagesRowSchema),
});

export type RankTrackerCompetitorsPagesRow = z.infer<
	typeof RankTrackerCompetitorsPagesRowSchema
>;

export type RankTrackerCompetitorsPagesInput = z.infer<
	typeof RankTrackerCompetitorsPagesInputSchema
>;
export type RankTrackerCompetitorsPagesResponse = z.infer<
	typeof RankTrackerCompetitorsPagesResponseSchema
>;

export const RankTrackerCompetitorsStatsInputSchema = z.object({
	select: z
		.string()
		.min(1)
		.describe('A comma-separated list of columns to return.'),
	volume_mode: z
		.enum(['monthly', 'average'])
		.optional()
		.describe('The search volume calculation mode: monthly or average.'),
	project_id: z
		.number()
		.int()
		.positive()
		.describe('The unique identifier of the project.'),
	device: z
		.enum(['desktop', 'mobile'])
		.describe('Choose between mobile and desktop rankings.'),
	date: isoDateString.describe(
		'A date to report metrics on in YYYY-MM-DD format.',
	),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const RankTrackerCompetitorsStatsRowSchema = z
	.object({
		ai_overview_count: z.number().nullable().optional(),
		average_position: z.number().nullable().optional(),
		competitor: z.string().nullable().optional(),
		discussions_count: z.number().nullable().optional(),
		featured_snippet_count: z.number().nullable().optional(),
		image_pack_count: z.number().nullable().optional(),
		knowledge_card_count: z.number().nullable().optional(),
		knowledge_panel_count: z.number().nullable().optional(),
		pos_1_3: z.number().nullable().optional(),
		pos_4_10: z.number().nullable().optional(),
		pos_11_20: z.number().nullable().optional(),
		pos_21_50: z.number().nullable().optional(),
		pos_51_plus: z.number().nullable().optional(),
		pos_no_rank: z.number().nullable().optional(),
		share_of_traffic_value: z.number().nullable().optional(),
		share_of_voice: z.number().nullable().optional(),
		sitelinks_count: z.number().nullable().optional(),
		thumbnail_count: z.number().nullable().optional(),
		top_stories_count: z.number().nullable().optional(),
		traffic: z.number().nullable().optional(),
		traffic_value: z.number().nullable().optional(),
		video_preview_count: z.number().nullable().optional(),
		videos_count: z.number().nullable().optional(),
		x_count: z.number().nullable().optional(),
	})
	.loose();

export const RankTrackerCompetitorsStatsResponseSchema = z.object({
	'competitors-metrics': z.array(RankTrackerCompetitorsStatsRowSchema),
});

export type RankTrackerCompetitorsStatsRow = z.infer<
	typeof RankTrackerCompetitorsStatsRowSchema
>;

export type RankTrackerCompetitorsStatsInput = z.infer<
	typeof RankTrackerCompetitorsStatsInputSchema
>;
export type RankTrackerCompetitorsStatsResponse = z.infer<
	typeof RankTrackerCompetitorsStatsResponseSchema
>;

export const BatchAnalysisAnalyzeInputSchema = z.object({
	select: z.array(z.string().min(1)).describe('A list of fields to return.'),
	order_by: z
		.array(z.string())
		.optional()
		.describe(
			'A list of fields to order the results by, with optional direction.',
		),
	targets: z
		.array(
			z.object({
				url: z.string().min(1),
				mode: z.enum(['exact', 'prefix', 'domain', 'subdomains']),
				protocol: z.enum(['both', 'http', 'https']),
			}),
		)
		.describe('A list of targets to do batch analysis.'),
	volume_mode: z
		.enum(['monthly', 'average'])
		.optional()
		.describe('The search volume calculation mode: monthly or average.'),
	country: z
		.string()
		.length(2)
		.optional()
		.describe('A two-letter country code (ISO 3166-1 alpha-2).'),
	top_countries: z
		.number()
		.int()
		.positive()
		.optional()
		.describe(
			'The number of countries to return in the org_traffic_top_by_country field.',
		),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const BatchAnalysisAnalyzeRowSchema = z
	.object({
		ahrefs_rank: z.number().nullable().optional(),
		backlinks: z.number().nullable().optional(),
		backlinks_dofollow: z.number().nullable().optional(),
		backlinks_internal: z.number().nullable().optional(),
		backlinks_nofollow: z.number().nullable().optional(),
		backlinks_redirect: z.number().nullable().optional(),
		domain_rating: z.number().nullable().optional(),
		index: z.number().nullable().optional(),
		ip: z.string().nullable().optional(),
		linked_domains: z.number().nullable().optional(),
		linked_domains_dofollow: z.number().nullable().optional(),
		mode: z.string().nullable().optional(),
		org_cost: z.number().nullable().optional(),
		org_keywords: z.number().nullable().optional(),
		org_keywords_1_3: z.number().nullable().optional(),
		org_keywords_4_10: z.number().nullable().optional(),
		org_keywords_11_20: z.number().nullable().optional(),
		org_keywords_21_50: z.number().nullable().optional(),
		org_keywords_51_plus: z.number().nullable().optional(),
		org_traffic: z.number().nullable().optional(),
		org_traffic_top_by_country: AhrefsOpenList.nullable().optional(),
		outgoing_links: z.number().nullable().optional(),
		outgoing_links_dofollow: z.number().nullable().optional(),
		paid_ads: z.number().nullable().optional(),
		paid_cost: z.number().nullable().optional(),
		paid_keywords: z.number().nullable().optional(),
		paid_traffic: z.number().nullable().optional(),
		protocol: z.string().nullable().optional(),
		refdomains: z.number().nullable().optional(),
		refdomains_dofollow: z.number().nullable().optional(),
		refdomains_nofollow: z.number().nullable().optional(),
		refips: z.number().nullable().optional(),
		refips_subnets: z.number().nullable().optional(),
		url: z.string().nullable().optional(),
		url_rating: z.number().nullable().optional(),
	})
	.loose();

export const BatchAnalysisAnalyzeResponseSchema = z.object({
	targets: z.array(BatchAnalysisAnalyzeRowSchema),
});

export type BatchAnalysisAnalyzeRow = z.infer<
	typeof BatchAnalysisAnalyzeRowSchema
>;

export type BatchAnalysisAnalyzeInput = z.infer<
	typeof BatchAnalysisAnalyzeInputSchema
>;
export type BatchAnalysisAnalyzeResponse = z.infer<
	typeof BatchAnalysisAnalyzeResponseSchema
>;

export const ContentHelperTopicsInputSchema = z.object({
	keyword: z.string().min(1).describe('The keyword to analyse the SERP for.'),
	country: z
		.string()
		.length(2)
		.describe('A two-letter country code (ISO 3166-1 alpha-2).'),
	top_competitors: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('How many of the top-ranking pages to analyse.'),
	target_url: z
		.string()
		.min(1)
		.optional()
		.describe(
			'(500 units) A page of your own to score against the same topics, for example a draft you are writing or a page you want to improve.',
		),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const ContentHelperTopicsRowSchema = z
	.object({
		avg_score: z.number().nullable().optional(),
		description: z.string().nullable().optional(),
		pages: AhrefsOpenList.nullable().optional(),
		pages_covering: z.number().nullable().optional(),
		serp_date: z.string().nullable().optional(),
		target: AhrefsOpenObject.nullable().optional(),
		topic: z.string().nullable().optional(),
	})
	.loose();

export const ContentHelperTopicsResponseSchema = z.object({
	topics: z.array(ContentHelperTopicsRowSchema),
});

export type ContentHelperTopicsRow = z.infer<
	typeof ContentHelperTopicsRowSchema
>;

export type ContentHelperTopicsInput = z.infer<
	typeof ContentHelperTopicsInputSchema
>;
export type ContentHelperTopicsResponse = z.infer<
	typeof ContentHelperTopicsResponseSchema
>;

export const PublicCrawlerIpsInputSchema = z.object({
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const PublicCrawlerIpsRowSchema = z
	.object({
		ip_address: z.string().nullable().optional(),
	})
	.loose();

export const PublicCrawlerIpsResponseSchema = z.object({
	ips: z.array(PublicCrawlerIpsRowSchema),
});

export type PublicCrawlerIpsRow = z.infer<typeof PublicCrawlerIpsRowSchema>;

export type PublicCrawlerIpsInput = z.infer<typeof PublicCrawlerIpsInputSchema>;
export type PublicCrawlerIpsResponse = z.infer<
	typeof PublicCrawlerIpsResponseSchema
>;

export const PublicCrawlerIpRangesInputSchema = z.object({
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const PublicCrawlerIpRangesRowSchema = z
	.object({
		ipv4Prefix: z.string().nullable().optional(),
	})
	.loose();

export const PublicCrawlerIpRangesResponseSchema = z.object({
	prefixes: z.array(PublicCrawlerIpRangesRowSchema),
});

export type PublicCrawlerIpRangesRow = z.infer<
	typeof PublicCrawlerIpRangesRowSchema
>;

export type PublicCrawlerIpRangesInput = z.infer<
	typeof PublicCrawlerIpRangesInputSchema
>;
export type PublicCrawlerIpRangesResponse = z.infer<
	typeof PublicCrawlerIpRangesResponseSchema
>;

export const PublicDomainRatingFreeInputSchema = z.object({
	target: z
		.string()
		.min(1)
		.describe('The target of the search: a domain or a URL.'),
	version: z
		.enum(['dr3', 'dr4'])
		.optional()
		.describe('The Domain Rating version.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const PublicDomainRatingFreeResponseSchema = z.object({
	domain_rating: z
		.object({
			domain_rating: z.number().nullable().optional(),
			license: z.string().nullable().optional(),
		})
		.loose(),
});

export type PublicDomainRatingFreeInput = z.infer<
	typeof PublicDomainRatingFreeInputSchema
>;
export type PublicDomainRatingFreeResponse = z.infer<
	typeof PublicDomainRatingFreeResponseSchema
>;

export const PublicDomainRatingFreeBatchInputSchema = z.object({
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
	targets: z
		.array(z.string())
		.describe('The targets of the search: domains or URLs.'),
	version: z
		.enum(['dr3', 'dr4'])
		.optional()
		.describe('The Domain Rating version.'),
});

export const PublicDomainRatingFreeBatchResponseSchema = z.object({
	domain_rating: z
		.object({
			license: z.string().nullable().optional(),
			targets: AhrefsOpenList.nullable().optional(),
		})
		.loose(),
});

export type PublicDomainRatingFreeBatchInput = z.infer<
	typeof PublicDomainRatingFreeBatchInputSchema
>;
export type PublicDomainRatingFreeBatchResponse = z.infer<
	typeof PublicDomainRatingFreeBatchResponseSchema
>;

export const PublicDomainRatingTopDomainsInputSchema = z.object({
	from: z
		.number()
		.int()
		.nonnegative()
		.optional()
		.describe('Rank position to start from.'),
	to: z
		.number()
		.int()
		.nonnegative()
		.optional()
		.describe('Rank position to end at.'),
	output: z.enum(AHREFS_OUTPUT_FORMATS).optional(),
});

export const PublicDomainRatingTopDomainsRowSchema = z
	.object({
		domain: z.string().nullable().optional(),
		domain_rating: z.number().nullable().optional(),
		rank: z.number().nullable().optional(),
	})
	.loose();

export const PublicDomainRatingTopDomainsResponseSchema = z.object({
	domains: z.array(PublicDomainRatingTopDomainsRowSchema),
});

export type PublicDomainRatingTopDomainsRow = z.infer<
	typeof PublicDomainRatingTopDomainsRowSchema
>;

export type PublicDomainRatingTopDomainsInput = z.infer<
	typeof PublicDomainRatingTopDomainsInputSchema
>;
export type PublicDomainRatingTopDomainsResponse = z.infer<
	typeof PublicDomainRatingTopDomainsResponseSchema
>;

export type AhrefsEndpointInputs = {
	getDomainRating: DomainRatingInput;
	backlinksStats: BacklinksStatsInput;
	organicKeywords: OrganicKeywordsInput;
	refdomains: RefdomainsInput;
	topPages: TopPagesInput;
	keywordsOverview: KeywordsOverviewInput;
	rankTrackerOverview: RankTrackerOverviewInput;
	serpOverview: SerpOverviewInput;
	limitsAndUsage: LimitsAndUsageInput;
	gscKeywords: GscKeywordsInput;
	gscPages: GscPagesInput;
	gscPerformanceHistory: GscPerformanceHistoryInput;
	gscKeywordHistory: GscKeywordHistoryInput;
	gscPageHistory: GscPageHistoryInput;
	gscPagesHistory: GscPagesHistoryInput;
	gscPositionsHistory: GscPositionsHistoryInput;
	gscCtrByPosition: GscCtrByPositionInput;
	gscPerformanceByDevice: GscPerformanceByDeviceInput;
	gscPerformanceByPosition: GscPerformanceByPositionInput;
	gscMetricsByCountry: GscMetricsByCountryInput;
	gscAnonymousQueries: GscAnonymousQueriesInput;
	siteAuditProjects: SiteAuditProjectsInput;
	siteAuditIssues: SiteAuditIssuesInput;
	siteAuditPageExplorer: SiteAuditPageExplorerInput;
	siteAuditPageContent: SiteAuditPageContentInput;
	matchingTerms: MatchingTermsInput;
	relatedTerms: RelatedTermsInput;
	searchSuggestions: SearchSuggestionsInput;
	volumeHistory: VolumeHistoryInput;
	volumeByCountry: VolumeByCountryInput;
	siteMetrics: SiteMetricsInput;
	metricsHistory: MetricsHistoryInput;
	domainRatingHistory: DomainRatingHistoryInput;
	allBacklinks: AllBacklinksInput;
	brokenBacklinks: BrokenBacklinksInput;
	anchors: AnchorsInput;
	organicCompetitors: OrganicCompetitorsInput;
	pagesByTraffic: PagesByTrafficInput;
	refdomainsHistory: RefdomainsHistoryInput;
	keywordsHistory: KeywordsHistoryInput;
	linkedDomains: LinkedDomainsInput;
	pagesByBacklinks: PagesByBacklinksInput;
	rankTrackerSerpOverview: RankTrackerSerpOverviewInput;
	rankTrackerCompetitorsOverview: RankTrackerCompetitorsOverviewInput;
	managementProjects: ManagementProjectsInput;
	managementProjectKeywords: ManagementProjectKeywordsInput;
	managementKeywordLists: ManagementKeywordListsInput;
	managementKeywordListKeywords: ManagementKeywordListKeywordsInput;
	managementLocations: ManagementLocationsInput;
	brandRadarAiResponses: BrandRadarAiResponsesInput;
	brandRadarAiResponsesEntities: BrandRadarAiResponsesEntitiesInput;
	brandRadarCitationsHistoryEntities: BrandRadarCitationsHistoryEntitiesInput;
	brandRadarCitationsOverviewEntities: BrandRadarCitationsOverviewEntitiesInput;
	brandRadarCitedDomains: BrandRadarCitedDomainsInput;
	brandRadarCitedDomainsEntities: BrandRadarCitedDomainsEntitiesInput;
	brandRadarCitedPages: BrandRadarCitedPagesInput;
	brandRadarCitedPagesEntities: BrandRadarCitedPagesEntitiesInput;
	brandRadarImpressionsHistory: BrandRadarImpressionsHistoryInput;
	brandRadarImpressionsHistoryEntities: BrandRadarImpressionsHistoryEntitiesInput;
	brandRadarImpressionsOverview: BrandRadarImpressionsOverviewInput;
	brandRadarImpressionsOverviewEntities: BrandRadarImpressionsOverviewEntitiesInput;
	brandRadarMentionsHistory: BrandRadarMentionsHistoryInput;
	brandRadarMentionsHistoryEntities: BrandRadarMentionsHistoryEntitiesInput;
	brandRadarMentionsOverview: BrandRadarMentionsOverviewInput;
	brandRadarMentionsOverviewEntities: BrandRadarMentionsOverviewEntitiesInput;
	brandRadarSovHistory: BrandRadarSovHistoryInput;
	brandRadarSovHistoryEntities: BrandRadarSovHistoryEntitiesInput;
	brandRadarSovOverview: BrandRadarSovOverviewInput;
	brandRadarSovOverviewEntities: BrandRadarSovOverviewEntitiesInput;
	socialMediaChannels: SocialMediaChannelsInput;
	socialMediaAuthors: SocialMediaAuthorsInput;
	socialMediaPosts: SocialMediaPostsInput;
	socialMediaChannelMetrics: SocialMediaChannelMetricsInput;
	socialMediaPostMetrics: SocialMediaPostMetricsInput;
	socialMediaActivityHistory: SocialMediaActivityHistoryInput;
	socialMediaCreatePost: SocialMediaCreatePostInput;
	socialMediaUpdatePost: SocialMediaUpdatePostInput;
	socialMediaDeletePost: SocialMediaDeletePostInput;
	managementCreateProject: ManagementCreateProjectInput;
	managementUpdateProject: ManagementUpdateProjectInput;
	managementDeleteProjects: ManagementDeleteProjectsInput;
	managementAddProjectKeywords: ManagementAddProjectKeywordsInput;
	managementDeleteProjectKeywords: ManagementDeleteProjectKeywordsInput;
	managementAddProjectKeywordTags: ManagementAddProjectKeywordTagsInput;
	managementDeleteProjectKeywordTags: ManagementDeleteProjectKeywordTagsInput;
	managementProjectCompetitors: ManagementProjectCompetitorsInput;
	managementAddProjectCompetitors: ManagementAddProjectCompetitorsInput;
	managementDeleteProjectCompetitors: ManagementDeleteProjectCompetitorsInput;
	managementCreateKeywordList: ManagementCreateKeywordListInput;
	managementDeleteKeywordLists: ManagementDeleteKeywordListsInput;
	managementAddKeywordListKeywords: ManagementAddKeywordListKeywordsInput;
	managementDeleteKeywordListKeywords: ManagementDeleteKeywordListKeywordsInput;
	managementBrandRadarReports: ManagementBrandRadarReportsInput;
	managementCreateBrandRadarReport: ManagementCreateBrandRadarReportInput;
	managementUpdateBrandRadarReport: ManagementUpdateBrandRadarReportInput;
	managementBrandRadarPrompts: ManagementBrandRadarPromptsInput;
	managementAddBrandRadarPrompts: ManagementAddBrandRadarPromptsInput;
	managementUpdateBrandRadarPrompts: ManagementUpdateBrandRadarPromptsInput;
	managementDeleteBrandRadarPrompts: ManagementDeleteBrandRadarPromptsInput;
	siteExplorerAiResponsesCount: SiteExplorerAiResponsesCountInput;
	siteExplorerCrawledPages: SiteExplorerCrawledPagesInput;
	siteExplorerLinkedAnchorsExternal: SiteExplorerLinkedAnchorsExternalInput;
	siteExplorerLinkedAnchorsInternal: SiteExplorerLinkedAnchorsInternalInput;
	siteExplorerMetricsByCountry: SiteExplorerMetricsByCountryInput;
	siteExplorerOutlinksStats: SiteExplorerOutlinksStatsInput;
	siteExplorerPagesByInternalLinks: SiteExplorerPagesByInternalLinksInput;
	siteExplorerPagesHistory: SiteExplorerPagesHistoryInput;
	siteExplorerPaidPages: SiteExplorerPaidPagesInput;
	siteExplorerTotalSearchVolumeHistory: SiteExplorerTotalSearchVolumeHistoryInput;
	siteExplorerUrlRatingHistory: SiteExplorerUrlRatingHistoryInput;
	rankTrackerCompetitorsDomains: RankTrackerCompetitorsDomainsInput;
	rankTrackerCompetitorsPages: RankTrackerCompetitorsPagesInput;
	rankTrackerCompetitorsStats: RankTrackerCompetitorsStatsInput;
	batchAnalysisAnalyze: BatchAnalysisAnalyzeInput;
	contentHelperTopics: ContentHelperTopicsInput;
	publicCrawlerIps: PublicCrawlerIpsInput;
	publicCrawlerIpRanges: PublicCrawlerIpRangesInput;
	publicDomainRatingFree: PublicDomainRatingFreeInput;
	publicDomainRatingFreeBatch: PublicDomainRatingFreeBatchInput;
	publicDomainRatingTopDomains: PublicDomainRatingTopDomainsInput;
	webAnalyticsStats: WebAnalyticsStatsInput;
	webAnalyticsChart: WebAnalyticsTotalsChartInput;
	webAnalyticsTopPages: WebAnalyticsTopPagesInput;
	webAnalyticsTopPagesChart: WebAnalyticsTopPagesChartInput;
	webAnalyticsEntryPages: WebAnalyticsEntryPagesInput;
	webAnalyticsEntryPagesChart: WebAnalyticsEntryPagesChartInput;
	webAnalyticsExitPages: WebAnalyticsExitPagesInput;
	webAnalyticsExitPagesChart: WebAnalyticsExitPagesChartInput;
	webAnalyticsReferrers: WebAnalyticsReferrersInput;
	webAnalyticsReferrersChart: WebAnalyticsReferrersChartInput;
	webAnalyticsSources: WebAnalyticsSourcesInput;
	webAnalyticsSourcesChart: WebAnalyticsSourcesChartInput;
	webAnalyticsSourceChannels: WebAnalyticsSourceChannelsInput;
	webAnalyticsSourceChannelsChart: WebAnalyticsSourceChannelsChartInput;
	webAnalyticsUtmParams: WebAnalyticsUtmParamsInput;
	webAnalyticsUtmParamsChart: WebAnalyticsUtmParamsChartInput;
	webAnalyticsCountries: WebAnalyticsCountriesInput;
	webAnalyticsCountriesChart: WebAnalyticsCountriesChartInput;
	webAnalyticsCities: WebAnalyticsCitiesInput;
	webAnalyticsCitiesChart: WebAnalyticsCitiesChartInput;
	webAnalyticsContinents: WebAnalyticsContinentsInput;
	webAnalyticsContinentsChart: WebAnalyticsContinentsChartInput;
	webAnalyticsLanguages: WebAnalyticsLanguagesInput;
	webAnalyticsLanguagesChart: WebAnalyticsLanguagesChartInput;
	webAnalyticsDevices: WebAnalyticsDevicesInput;
	webAnalyticsDevicesChart: WebAnalyticsDevicesChartInput;
	webAnalyticsBrowsers: WebAnalyticsBrowsersInput;
	webAnalyticsBrowsersChart: WebAnalyticsBrowsersChartInput;
	webAnalyticsBrowserVersions: WebAnalyticsBrowserVersionsInput;
	webAnalyticsBrowserVersionsChart: WebAnalyticsBrowserVersionsChartInput;
	webAnalyticsOperatingSystems: WebAnalyticsOperatingSystemsInput;
	webAnalyticsOperatingSystemsChart: WebAnalyticsOperatingSystemsChartInput;
	webAnalyticsOperatingSystemsVersions: WebAnalyticsOperatingSystemsVersionsInput;
	webAnalyticsOperatingSystemsVersionsChart: WebAnalyticsOperatingSystemsVersionsChartInput;
};

export type AhrefsEndpointOutputs = {
	getDomainRating: DomainRatingResponse;
	backlinksStats: BacklinksStatsResponse;
	organicKeywords: OrganicKeywordsResponse;
	refdomains: RefdomainsResponse;
	topPages: TopPagesResponse;
	keywordsOverview: KeywordsOverviewResponse;
	rankTrackerOverview: RankTrackerOverviewResponse;
	serpOverview: SerpOverviewResponse;
	limitsAndUsage: LimitsAndUsageResponse;
	gscKeywords: GscKeywordsResponse;
	gscPages: GscPagesResponse;
	gscPerformanceHistory: GscPerformanceHistoryResponse;
	gscKeywordHistory: GscKeywordHistoryResponse;
	gscPageHistory: GscPageHistoryResponse;
	gscPagesHistory: GscPagesHistoryResponse;
	gscPositionsHistory: GscPositionsHistoryResponse;
	gscCtrByPosition: GscCtrByPositionResponse;
	gscPerformanceByDevice: GscPerformanceByDeviceResponse;
	gscPerformanceByPosition: GscPerformanceByPositionResponse;
	gscMetricsByCountry: GscMetricsByCountryResponse;
	gscAnonymousQueries: GscAnonymousQueriesResponse;
	siteAuditProjects: SiteAuditProjectsResponse;
	siteAuditIssues: SiteAuditIssuesResponse;
	siteAuditPageExplorer: SiteAuditPageExplorerResponse;
	siteAuditPageContent: SiteAuditPageContentResponse;
	matchingTerms: MatchingTermsResponse;
	relatedTerms: RelatedTermsResponse;
	searchSuggestions: SearchSuggestionsResponse;
	volumeHistory: VolumeHistoryResponse;
	volumeByCountry: VolumeByCountryResponse;
	siteMetrics: SiteMetricsResponse;
	metricsHistory: MetricsHistoryResponse;
	domainRatingHistory: DomainRatingHistoryResponse;
	allBacklinks: AllBacklinksResponse;
	brokenBacklinks: BrokenBacklinksResponse;
	anchors: AnchorsResponse;
	organicCompetitors: OrganicCompetitorsResponse;
	pagesByTraffic: PagesByTrafficResponse;
	refdomainsHistory: RefdomainsHistoryResponse;
	keywordsHistory: KeywordsHistoryResponse;
	linkedDomains: LinkedDomainsResponse;
	pagesByBacklinks: PagesByBacklinksResponse;
	rankTrackerSerpOverview: RankTrackerSerpOverviewResponse;
	rankTrackerCompetitorsOverview: RankTrackerCompetitorsOverviewResponse;
	managementProjects: ManagementProjectsResponse;
	managementProjectKeywords: ManagementProjectKeywordsResponse;
	managementKeywordLists: ManagementKeywordListsResponse;
	managementKeywordListKeywords: ManagementKeywordListKeywordsResponse;
	managementLocations: ManagementLocationsResponse;
	brandRadarAiResponses: BrandRadarAiResponsesResponse;
	brandRadarAiResponsesEntities: BrandRadarAiResponsesEntitiesResponse;
	brandRadarCitationsHistoryEntities: BrandRadarCitationsHistoryEntitiesResponse;
	brandRadarCitationsOverviewEntities: BrandRadarCitationsOverviewEntitiesResponse;
	brandRadarCitedDomains: BrandRadarCitedDomainsResponse;
	brandRadarCitedDomainsEntities: BrandRadarCitedDomainsEntitiesResponse;
	brandRadarCitedPages: BrandRadarCitedPagesResponse;
	brandRadarCitedPagesEntities: BrandRadarCitedPagesEntitiesResponse;
	brandRadarImpressionsHistory: BrandRadarImpressionsHistoryResponse;
	brandRadarImpressionsHistoryEntities: BrandRadarImpressionsHistoryEntitiesResponse;
	brandRadarImpressionsOverview: BrandRadarImpressionsOverviewResponse;
	brandRadarImpressionsOverviewEntities: BrandRadarImpressionsOverviewEntitiesResponse;
	brandRadarMentionsHistory: BrandRadarMentionsHistoryResponse;
	brandRadarMentionsHistoryEntities: BrandRadarMentionsHistoryEntitiesResponse;
	brandRadarMentionsOverview: BrandRadarMentionsOverviewResponse;
	brandRadarMentionsOverviewEntities: BrandRadarMentionsOverviewEntitiesResponse;
	brandRadarSovHistory: BrandRadarSovHistoryResponse;
	brandRadarSovHistoryEntities: BrandRadarSovHistoryEntitiesResponse;
	brandRadarSovOverview: BrandRadarSovOverviewResponse;
	brandRadarSovOverviewEntities: BrandRadarSovOverviewEntitiesResponse;
	socialMediaChannels: SocialMediaChannelsResponse;
	socialMediaAuthors: SocialMediaAuthorsResponse;
	socialMediaPosts: SocialMediaPostsResponse;
	socialMediaChannelMetrics: SocialMediaChannelMetricsResponse;
	socialMediaPostMetrics: SocialMediaPostMetricsResponse;
	socialMediaActivityHistory: SocialMediaActivityHistoryResponse;
	socialMediaCreatePost: SocialMediaCreatePostResponse;
	socialMediaUpdatePost: SocialMediaUpdatePostResponse;
	socialMediaDeletePost: SocialMediaDeletePostResponse;
	managementCreateProject: ManagementCreateProjectResponse;
	managementUpdateProject: ManagementUpdateProjectResponse;
	managementDeleteProjects: ManagementDeleteProjectsResponse;
	managementAddProjectKeywords: ManagementAddProjectKeywordsResponse;
	managementDeleteProjectKeywords: ManagementDeleteProjectKeywordsResponse;
	managementAddProjectKeywordTags: ManagementAddProjectKeywordTagsResponse;
	managementDeleteProjectKeywordTags: ManagementDeleteProjectKeywordTagsResponse;
	managementProjectCompetitors: ManagementProjectCompetitorsResponse;
	managementAddProjectCompetitors: ManagementAddProjectCompetitorsResponse;
	managementDeleteProjectCompetitors: ManagementDeleteProjectCompetitorsResponse;
	managementCreateKeywordList: ManagementCreateKeywordListResponse;
	managementDeleteKeywordLists: ManagementDeleteKeywordListsResponse;
	managementAddKeywordListKeywords: ManagementAddKeywordListKeywordsResponse;
	managementDeleteKeywordListKeywords: ManagementDeleteKeywordListKeywordsResponse;
	managementBrandRadarReports: ManagementBrandRadarReportsResponse;
	managementCreateBrandRadarReport: ManagementCreateBrandRadarReportResponse;
	managementUpdateBrandRadarReport: ManagementUpdateBrandRadarReportResponse;
	managementBrandRadarPrompts: ManagementBrandRadarPromptsResponse;
	managementAddBrandRadarPrompts: ManagementAddBrandRadarPromptsResponse;
	managementUpdateBrandRadarPrompts: ManagementUpdateBrandRadarPromptsResponse;
	managementDeleteBrandRadarPrompts: ManagementDeleteBrandRadarPromptsResponse;
	siteExplorerAiResponsesCount: SiteExplorerAiResponsesCountResponse;
	siteExplorerCrawledPages: SiteExplorerCrawledPagesResponse;
	siteExplorerLinkedAnchorsExternal: SiteExplorerLinkedAnchorsExternalResponse;
	siteExplorerLinkedAnchorsInternal: SiteExplorerLinkedAnchorsInternalResponse;
	siteExplorerMetricsByCountry: SiteExplorerMetricsByCountryResponse;
	siteExplorerOutlinksStats: SiteExplorerOutlinksStatsResponse;
	siteExplorerPagesByInternalLinks: SiteExplorerPagesByInternalLinksResponse;
	siteExplorerPagesHistory: SiteExplorerPagesHistoryResponse;
	siteExplorerPaidPages: SiteExplorerPaidPagesResponse;
	siteExplorerTotalSearchVolumeHistory: SiteExplorerTotalSearchVolumeHistoryResponse;
	siteExplorerUrlRatingHistory: SiteExplorerUrlRatingHistoryResponse;
	rankTrackerCompetitorsDomains: RankTrackerCompetitorsDomainsResponse;
	rankTrackerCompetitorsPages: RankTrackerCompetitorsPagesResponse;
	rankTrackerCompetitorsStats: RankTrackerCompetitorsStatsResponse;
	batchAnalysisAnalyze: BatchAnalysisAnalyzeResponse;
	contentHelperTopics: ContentHelperTopicsResponse;
	publicCrawlerIps: PublicCrawlerIpsResponse;
	publicCrawlerIpRanges: PublicCrawlerIpRangesResponse;
	publicDomainRatingFree: PublicDomainRatingFreeResponse;
	publicDomainRatingFreeBatch: PublicDomainRatingFreeBatchResponse;
	publicDomainRatingTopDomains: PublicDomainRatingTopDomainsResponse;
	webAnalyticsStats: WebAnalyticsStatsResponse;
	webAnalyticsChart: WebAnalyticsTotalsChartResponse;
	webAnalyticsTopPages: WebAnalyticsTopPagesResponse;
	webAnalyticsTopPagesChart: WebAnalyticsTopPagesChartResponse;
	webAnalyticsEntryPages: WebAnalyticsEntryPagesResponse;
	webAnalyticsEntryPagesChart: WebAnalyticsEntryPagesChartResponse;
	webAnalyticsExitPages: WebAnalyticsExitPagesResponse;
	webAnalyticsExitPagesChart: WebAnalyticsExitPagesChartResponse;
	webAnalyticsReferrers: WebAnalyticsReferrersResponse;
	webAnalyticsReferrersChart: WebAnalyticsReferrersChartResponse;
	webAnalyticsSources: WebAnalyticsSourcesResponse;
	webAnalyticsSourcesChart: WebAnalyticsSourcesChartResponse;
	webAnalyticsSourceChannels: WebAnalyticsSourceChannelsResponse;
	webAnalyticsSourceChannelsChart: WebAnalyticsSourceChannelsChartResponse;
	webAnalyticsUtmParams: WebAnalyticsUtmParamsResponse;
	webAnalyticsUtmParamsChart: WebAnalyticsUtmParamsChartResponse;
	webAnalyticsCountries: WebAnalyticsCountriesResponse;
	webAnalyticsCountriesChart: WebAnalyticsCountriesChartResponse;
	webAnalyticsCities: WebAnalyticsCitiesResponse;
	webAnalyticsCitiesChart: WebAnalyticsCitiesChartResponse;
	webAnalyticsContinents: WebAnalyticsContinentsResponse;
	webAnalyticsContinentsChart: WebAnalyticsContinentsChartResponse;
	webAnalyticsLanguages: WebAnalyticsLanguagesResponse;
	webAnalyticsLanguagesChart: WebAnalyticsLanguagesChartResponse;
	webAnalyticsDevices: WebAnalyticsDevicesResponse;
	webAnalyticsDevicesChart: WebAnalyticsDevicesChartResponse;
	webAnalyticsBrowsers: WebAnalyticsBrowsersResponse;
	webAnalyticsBrowsersChart: WebAnalyticsBrowsersChartResponse;
	webAnalyticsBrowserVersions: WebAnalyticsBrowserVersionsResponse;
	webAnalyticsBrowserVersionsChart: WebAnalyticsBrowserVersionsChartResponse;
	webAnalyticsOperatingSystems: WebAnalyticsOperatingSystemsResponse;
	webAnalyticsOperatingSystemsChart: WebAnalyticsOperatingSystemsChartResponse;
	webAnalyticsOperatingSystemsVersions: WebAnalyticsOperatingSystemsVersionsResponse;
	webAnalyticsOperatingSystemsVersionsChart: WebAnalyticsOperatingSystemsVersionsChartResponse;
};

export const AhrefsEndpointInputSchemas = {
	getDomainRating: DomainRatingInputSchema,
	backlinksStats: BacklinksStatsInputSchema,
	organicKeywords: OrganicKeywordsInputSchema,
	refdomains: RefdomainsInputSchema,
	topPages: TopPagesInputSchema,
	keywordsOverview: KeywordsOverviewInputSchema,
	rankTrackerOverview: RankTrackerOverviewInputSchema,
	serpOverview: SerpOverviewInputSchema,
	limitsAndUsage: LimitsAndUsageInputSchema,
	gscKeywords: GscKeywordsInputSchema,
	gscPages: GscPagesInputSchema,
	gscPerformanceHistory: GscPerformanceHistoryInputSchema,
	gscKeywordHistory: GscKeywordHistoryInputSchema,
	gscPageHistory: GscPageHistoryInputSchema,
	gscPagesHistory: GscPagesHistoryInputSchema,
	gscPositionsHistory: GscPositionsHistoryInputSchema,
	gscCtrByPosition: GscCtrByPositionInputSchema,
	gscPerformanceByDevice: GscPerformanceByDeviceInputSchema,
	gscPerformanceByPosition: GscPerformanceByPositionInputSchema,
	gscMetricsByCountry: GscMetricsByCountryInputSchema,
	gscAnonymousQueries: GscAnonymousQueriesInputSchema,
	siteAuditProjects: SiteAuditProjectsInputSchema,
	siteAuditIssues: SiteAuditIssuesInputSchema,
	siteAuditPageExplorer: SiteAuditPageExplorerInputSchema,
	siteAuditPageContent: SiteAuditPageContentInputSchema,
	matchingTerms: MatchingTermsInputSchema,
	relatedTerms: RelatedTermsInputSchema,
	searchSuggestions: SearchSuggestionsInputSchema,
	volumeHistory: VolumeHistoryInputSchema,
	volumeByCountry: VolumeByCountryInputSchema,
	siteMetrics: SiteMetricsInputSchema,
	metricsHistory: MetricsHistoryInputSchema,
	domainRatingHistory: DomainRatingHistoryInputSchema,
	allBacklinks: AllBacklinksInputSchema,
	brokenBacklinks: BrokenBacklinksInputSchema,
	anchors: AnchorsInputSchema,
	organicCompetitors: OrganicCompetitorsInputSchema,
	pagesByTraffic: PagesByTrafficInputSchema,
	refdomainsHistory: RefdomainsHistoryInputSchema,
	keywordsHistory: KeywordsHistoryInputSchema,
	linkedDomains: LinkedDomainsInputSchema,
	pagesByBacklinks: PagesByBacklinksInputSchema,
	rankTrackerSerpOverview: RankTrackerSerpOverviewInputSchema,
	rankTrackerCompetitorsOverview: RankTrackerCompetitorsOverviewInputSchema,
	managementProjects: ManagementProjectsInputSchema,
	managementProjectKeywords: ManagementProjectKeywordsInputSchema,
	managementKeywordLists: ManagementKeywordListsInputSchema,
	managementKeywordListKeywords: ManagementKeywordListKeywordsInputSchema,
	managementLocations: ManagementLocationsInputSchema,
	brandRadarAiResponses: BrandRadarAiResponsesInputSchema,
	brandRadarAiResponsesEntities: BrandRadarAiResponsesEntitiesInputSchema,
	brandRadarCitationsHistoryEntities:
		BrandRadarCitationsHistoryEntitiesInputSchema,
	brandRadarCitationsOverviewEntities:
		BrandRadarCitationsOverviewEntitiesInputSchema,
	brandRadarCitedDomains: BrandRadarCitedDomainsInputSchema,
	brandRadarCitedDomainsEntities: BrandRadarCitedDomainsEntitiesInputSchema,
	brandRadarCitedPages: BrandRadarCitedPagesInputSchema,
	brandRadarCitedPagesEntities: BrandRadarCitedPagesEntitiesInputSchema,
	brandRadarImpressionsHistory: BrandRadarImpressionsHistoryInputSchema,
	brandRadarImpressionsHistoryEntities:
		BrandRadarImpressionsHistoryEntitiesInputSchema,
	brandRadarImpressionsOverview: BrandRadarImpressionsOverviewInputSchema,
	brandRadarImpressionsOverviewEntities:
		BrandRadarImpressionsOverviewEntitiesInputSchema,
	brandRadarMentionsHistory: BrandRadarMentionsHistoryInputSchema,
	brandRadarMentionsHistoryEntities:
		BrandRadarMentionsHistoryEntitiesInputSchema,
	brandRadarMentionsOverview: BrandRadarMentionsOverviewInputSchema,
	brandRadarMentionsOverviewEntities:
		BrandRadarMentionsOverviewEntitiesInputSchema,
	brandRadarSovHistory: BrandRadarSovHistoryInputSchema,
	brandRadarSovHistoryEntities: BrandRadarSovHistoryEntitiesInputSchema,
	brandRadarSovOverview: BrandRadarSovOverviewInputSchema,
	brandRadarSovOverviewEntities: BrandRadarSovOverviewEntitiesInputSchema,
	socialMediaChannels: SocialMediaChannelsInputSchema,
	socialMediaAuthors: SocialMediaAuthorsInputSchema,
	socialMediaPosts: SocialMediaPostsInputSchema,
	socialMediaChannelMetrics: SocialMediaChannelMetricsInputSchema,
	socialMediaPostMetrics: SocialMediaPostMetricsInputSchema,
	socialMediaActivityHistory: SocialMediaActivityHistoryInputSchema,
	socialMediaCreatePost: SocialMediaCreatePostInputSchema,
	socialMediaUpdatePost: SocialMediaUpdatePostInputSchema,
	socialMediaDeletePost: SocialMediaDeletePostInputSchema,
	managementCreateProject: ManagementCreateProjectInputSchema,
	managementUpdateProject: ManagementUpdateProjectInputSchema,
	managementDeleteProjects: ManagementDeleteProjectsInputSchema,
	managementAddProjectKeywords: ManagementAddProjectKeywordsInputSchema,
	managementDeleteProjectKeywords: ManagementDeleteProjectKeywordsInputSchema,
	managementAddProjectKeywordTags: ManagementAddProjectKeywordTagsInputSchema,
	managementDeleteProjectKeywordTags:
		ManagementDeleteProjectKeywordTagsInputSchema,
	managementProjectCompetitors: ManagementProjectCompetitorsInputSchema,
	managementAddProjectCompetitors: ManagementAddProjectCompetitorsInputSchema,
	managementDeleteProjectCompetitors:
		ManagementDeleteProjectCompetitorsInputSchema,
	managementCreateKeywordList: ManagementCreateKeywordListInputSchema,
	managementDeleteKeywordLists: ManagementDeleteKeywordListsInputSchema,
	managementAddKeywordListKeywords: ManagementAddKeywordListKeywordsInputSchema,
	managementDeleteKeywordListKeywords:
		ManagementDeleteKeywordListKeywordsInputSchema,
	managementBrandRadarReports: ManagementBrandRadarReportsInputSchema,
	managementCreateBrandRadarReport: ManagementCreateBrandRadarReportInputSchema,
	managementUpdateBrandRadarReport: ManagementUpdateBrandRadarReportInputSchema,
	managementBrandRadarPrompts: ManagementBrandRadarPromptsInputSchema,
	managementAddBrandRadarPrompts: ManagementAddBrandRadarPromptsInputSchema,
	managementUpdateBrandRadarPrompts:
		ManagementUpdateBrandRadarPromptsInputSchema,
	managementDeleteBrandRadarPrompts:
		ManagementDeleteBrandRadarPromptsInputSchema,
	siteExplorerAiResponsesCount: SiteExplorerAiResponsesCountInputSchema,
	siteExplorerCrawledPages: SiteExplorerCrawledPagesInputSchema,
	siteExplorerLinkedAnchorsExternal:
		SiteExplorerLinkedAnchorsExternalInputSchema,
	siteExplorerLinkedAnchorsInternal:
		SiteExplorerLinkedAnchorsInternalInputSchema,
	siteExplorerMetricsByCountry: SiteExplorerMetricsByCountryInputSchema,
	siteExplorerOutlinksStats: SiteExplorerOutlinksStatsInputSchema,
	siteExplorerPagesByInternalLinks: SiteExplorerPagesByInternalLinksInputSchema,
	siteExplorerPagesHistory: SiteExplorerPagesHistoryInputSchema,
	siteExplorerPaidPages: SiteExplorerPaidPagesInputSchema,
	siteExplorerTotalSearchVolumeHistory:
		SiteExplorerTotalSearchVolumeHistoryInputSchema,
	siteExplorerUrlRatingHistory: SiteExplorerUrlRatingHistoryInputSchema,
	rankTrackerCompetitorsDomains: RankTrackerCompetitorsDomainsInputSchema,
	rankTrackerCompetitorsPages: RankTrackerCompetitorsPagesInputSchema,
	rankTrackerCompetitorsStats: RankTrackerCompetitorsStatsInputSchema,
	batchAnalysisAnalyze: BatchAnalysisAnalyzeInputSchema,
	contentHelperTopics: ContentHelperTopicsInputSchema,
	publicCrawlerIps: PublicCrawlerIpsInputSchema,
	publicCrawlerIpRanges: PublicCrawlerIpRangesInputSchema,
	publicDomainRatingFree: PublicDomainRatingFreeInputSchema,
	publicDomainRatingFreeBatch: PublicDomainRatingFreeBatchInputSchema,
	publicDomainRatingTopDomains: PublicDomainRatingTopDomainsInputSchema,
	webAnalyticsStats: WebAnalyticsStatsInputSchema,
	webAnalyticsChart: WebAnalyticsTotalsChartInputSchema,
	webAnalyticsTopPages: WebAnalyticsTopPagesInputSchema,
	webAnalyticsTopPagesChart: WebAnalyticsTopPagesChartInputSchema,
	webAnalyticsEntryPages: WebAnalyticsEntryPagesInputSchema,
	webAnalyticsEntryPagesChart: WebAnalyticsEntryPagesChartInputSchema,
	webAnalyticsExitPages: WebAnalyticsExitPagesInputSchema,
	webAnalyticsExitPagesChart: WebAnalyticsExitPagesChartInputSchema,
	webAnalyticsReferrers: WebAnalyticsReferrersInputSchema,
	webAnalyticsReferrersChart: WebAnalyticsReferrersChartInputSchema,
	webAnalyticsSources: WebAnalyticsSourcesInputSchema,
	webAnalyticsSourcesChart: WebAnalyticsSourcesChartInputSchema,
	webAnalyticsSourceChannels: WebAnalyticsSourceChannelsInputSchema,
	webAnalyticsSourceChannelsChart: WebAnalyticsSourceChannelsChartInputSchema,
	webAnalyticsUtmParams: WebAnalyticsUtmParamsInputSchema,
	webAnalyticsUtmParamsChart: WebAnalyticsUtmParamsChartInputSchema,
	webAnalyticsCountries: WebAnalyticsCountriesInputSchema,
	webAnalyticsCountriesChart: WebAnalyticsCountriesChartInputSchema,
	webAnalyticsCities: WebAnalyticsCitiesInputSchema,
	webAnalyticsCitiesChart: WebAnalyticsCitiesChartInputSchema,
	webAnalyticsContinents: WebAnalyticsContinentsInputSchema,
	webAnalyticsContinentsChart: WebAnalyticsContinentsChartInputSchema,
	webAnalyticsLanguages: WebAnalyticsLanguagesInputSchema,
	webAnalyticsLanguagesChart: WebAnalyticsLanguagesChartInputSchema,
	webAnalyticsDevices: WebAnalyticsDevicesInputSchema,
	webAnalyticsDevicesChart: WebAnalyticsDevicesChartInputSchema,
	webAnalyticsBrowsers: WebAnalyticsBrowsersInputSchema,
	webAnalyticsBrowsersChart: WebAnalyticsBrowsersChartInputSchema,
	webAnalyticsBrowserVersions: WebAnalyticsBrowserVersionsInputSchema,
	webAnalyticsBrowserVersionsChart: WebAnalyticsBrowserVersionsChartInputSchema,
	webAnalyticsOperatingSystems: WebAnalyticsOperatingSystemsInputSchema,
	webAnalyticsOperatingSystemsChart:
		WebAnalyticsOperatingSystemsChartInputSchema,
	webAnalyticsOperatingSystemsVersions:
		WebAnalyticsOperatingSystemsVersionsInputSchema,
	webAnalyticsOperatingSystemsVersionsChart:
		WebAnalyticsOperatingSystemsVersionsChartInputSchema,
} as const;

export const AhrefsEndpointOutputSchemas = {
	getDomainRating: DomainRatingResponseSchema,
	backlinksStats: BacklinksStatsResponseSchema,
	organicKeywords: OrganicKeywordsResponseSchema,
	refdomains: RefdomainsResponseSchema,
	topPages: TopPagesResponseSchema,
	keywordsOverview: KeywordsOverviewResponseSchema,
	rankTrackerOverview: RankTrackerOverviewResponseSchema,
	serpOverview: SerpOverviewResponseSchema,
	limitsAndUsage: LimitsAndUsageResponseSchema,
	gscKeywords: GscKeywordsResponseSchema,
	gscPages: GscPagesResponseSchema,
	gscPerformanceHistory: GscPerformanceHistoryResponseSchema,
	gscKeywordHistory: GscKeywordHistoryResponseSchema,
	gscPageHistory: GscPageHistoryResponseSchema,
	gscPagesHistory: GscPagesHistoryResponseSchema,
	gscPositionsHistory: GscPositionsHistoryResponseSchema,
	gscCtrByPosition: GscCtrByPositionResponseSchema,
	gscPerformanceByDevice: GscPerformanceByDeviceResponseSchema,
	gscPerformanceByPosition: GscPerformanceByPositionResponseSchema,
	gscMetricsByCountry: GscMetricsByCountryResponseSchema,
	gscAnonymousQueries: GscAnonymousQueriesResponseSchema,
	siteAuditProjects: SiteAuditProjectsResponseSchema,
	siteAuditIssues: SiteAuditIssuesResponseSchema,
	siteAuditPageExplorer: SiteAuditPageExplorerResponseSchema,
	siteAuditPageContent: SiteAuditPageContentResponseSchema,
	matchingTerms: MatchingTermsResponseSchema,
	relatedTerms: RelatedTermsResponseSchema,
	searchSuggestions: SearchSuggestionsResponseSchema,
	volumeHistory: VolumeHistoryResponseSchema,
	volumeByCountry: VolumeByCountryResponseSchema,
	siteMetrics: SiteMetricsResponseSchema,
	metricsHistory: MetricsHistoryResponseSchema,
	domainRatingHistory: DomainRatingHistoryResponseSchema,
	allBacklinks: AllBacklinksResponseSchema,
	brokenBacklinks: BrokenBacklinksResponseSchema,
	anchors: AnchorsResponseSchema,
	organicCompetitors: OrganicCompetitorsResponseSchema,
	pagesByTraffic: PagesByTrafficResponseSchema,
	refdomainsHistory: RefdomainsHistoryResponseSchema,
	keywordsHistory: KeywordsHistoryResponseSchema,
	linkedDomains: LinkedDomainsResponseSchema,
	pagesByBacklinks: PagesByBacklinksResponseSchema,
	rankTrackerSerpOverview: RankTrackerSerpOverviewResponseSchema,
	rankTrackerCompetitorsOverview: RankTrackerCompetitorsOverviewResponseSchema,
	managementProjects: ManagementProjectsResponseSchema,
	managementProjectKeywords: ManagementProjectKeywordsResponseSchema,
	managementKeywordLists: ManagementKeywordListsResponseSchema,
	managementKeywordListKeywords: ManagementKeywordListKeywordsResponseSchema,
	managementLocations: ManagementLocationsResponseSchema,
	brandRadarAiResponses: BrandRadarAiResponsesResponseSchema,
	brandRadarAiResponsesEntities: BrandRadarAiResponsesEntitiesResponseSchema,
	brandRadarCitationsHistoryEntities:
		BrandRadarCitationsHistoryEntitiesResponseSchema,
	brandRadarCitationsOverviewEntities:
		BrandRadarCitationsOverviewEntitiesResponseSchema,
	brandRadarCitedDomains: BrandRadarCitedDomainsResponseSchema,
	brandRadarCitedDomainsEntities: BrandRadarCitedDomainsEntitiesResponseSchema,
	brandRadarCitedPages: BrandRadarCitedPagesResponseSchema,
	brandRadarCitedPagesEntities: BrandRadarCitedPagesEntitiesResponseSchema,
	brandRadarImpressionsHistory: BrandRadarImpressionsHistoryResponseSchema,
	brandRadarImpressionsHistoryEntities:
		BrandRadarImpressionsHistoryEntitiesResponseSchema,
	brandRadarImpressionsOverview: BrandRadarImpressionsOverviewResponseSchema,
	brandRadarImpressionsOverviewEntities:
		BrandRadarImpressionsOverviewEntitiesResponseSchema,
	brandRadarMentionsHistory: BrandRadarMentionsHistoryResponseSchema,
	brandRadarMentionsHistoryEntities:
		BrandRadarMentionsHistoryEntitiesResponseSchema,
	brandRadarMentionsOverview: BrandRadarMentionsOverviewResponseSchema,
	brandRadarMentionsOverviewEntities:
		BrandRadarMentionsOverviewEntitiesResponseSchema,
	brandRadarSovHistory: BrandRadarSovHistoryResponseSchema,
	brandRadarSovHistoryEntities: BrandRadarSovHistoryEntitiesResponseSchema,
	brandRadarSovOverview: BrandRadarSovOverviewResponseSchema,
	brandRadarSovOverviewEntities: BrandRadarSovOverviewEntitiesResponseSchema,
	socialMediaChannels: SocialMediaChannelsResponseSchema,
	socialMediaAuthors: SocialMediaAuthorsResponseSchema,
	socialMediaPosts: SocialMediaPostsResponseSchema,
	socialMediaChannelMetrics: SocialMediaChannelMetricsResponseSchema,
	socialMediaPostMetrics: SocialMediaPostMetricsResponseSchema,
	socialMediaActivityHistory: SocialMediaActivityHistoryResponseSchema,
	socialMediaCreatePost: SocialMediaCreatePostResponseSchema,
	socialMediaUpdatePost: SocialMediaUpdatePostResponseSchema,
	socialMediaDeletePost: SocialMediaDeletePostResponseSchema,
	managementCreateProject: ManagementCreateProjectResponseSchema,
	managementUpdateProject: ManagementUpdateProjectResponseSchema,
	managementDeleteProjects: ManagementDeleteProjectsResponseSchema,
	managementAddProjectKeywords: ManagementAddProjectKeywordsResponseSchema,
	managementDeleteProjectKeywords:
		ManagementDeleteProjectKeywordsResponseSchema,
	managementAddProjectKeywordTags:
		ManagementAddProjectKeywordTagsResponseSchema,
	managementDeleteProjectKeywordTags:
		ManagementDeleteProjectKeywordTagsResponseSchema,
	managementProjectCompetitors: ManagementProjectCompetitorsResponseSchema,
	managementAddProjectCompetitors:
		ManagementAddProjectCompetitorsResponseSchema,
	managementDeleteProjectCompetitors:
		ManagementDeleteProjectCompetitorsResponseSchema,
	managementCreateKeywordList: ManagementCreateKeywordListResponseSchema,
	managementDeleteKeywordLists: ManagementDeleteKeywordListsResponseSchema,
	managementAddKeywordListKeywords:
		ManagementAddKeywordListKeywordsResponseSchema,
	managementDeleteKeywordListKeywords:
		ManagementDeleteKeywordListKeywordsResponseSchema,
	managementBrandRadarReports: ManagementBrandRadarReportsResponseSchema,
	managementCreateBrandRadarReport:
		ManagementCreateBrandRadarReportResponseSchema,
	managementUpdateBrandRadarReport:
		ManagementUpdateBrandRadarReportResponseSchema,
	managementBrandRadarPrompts: ManagementBrandRadarPromptsResponseSchema,
	managementAddBrandRadarPrompts: ManagementAddBrandRadarPromptsResponseSchema,
	managementUpdateBrandRadarPrompts:
		ManagementUpdateBrandRadarPromptsResponseSchema,
	managementDeleteBrandRadarPrompts:
		ManagementDeleteBrandRadarPromptsResponseSchema,
	siteExplorerAiResponsesCount: SiteExplorerAiResponsesCountResponseSchema,
	siteExplorerCrawledPages: SiteExplorerCrawledPagesResponseSchema,
	siteExplorerLinkedAnchorsExternal:
		SiteExplorerLinkedAnchorsExternalResponseSchema,
	siteExplorerLinkedAnchorsInternal:
		SiteExplorerLinkedAnchorsInternalResponseSchema,
	siteExplorerMetricsByCountry: SiteExplorerMetricsByCountryResponseSchema,
	siteExplorerOutlinksStats: SiteExplorerOutlinksStatsResponseSchema,
	siteExplorerPagesByInternalLinks:
		SiteExplorerPagesByInternalLinksResponseSchema,
	siteExplorerPagesHistory: SiteExplorerPagesHistoryResponseSchema,
	siteExplorerPaidPages: SiteExplorerPaidPagesResponseSchema,
	siteExplorerTotalSearchVolumeHistory:
		SiteExplorerTotalSearchVolumeHistoryResponseSchema,
	siteExplorerUrlRatingHistory: SiteExplorerUrlRatingHistoryResponseSchema,
	rankTrackerCompetitorsDomains: RankTrackerCompetitorsDomainsResponseSchema,
	rankTrackerCompetitorsPages: RankTrackerCompetitorsPagesResponseSchema,
	rankTrackerCompetitorsStats: RankTrackerCompetitorsStatsResponseSchema,
	batchAnalysisAnalyze: BatchAnalysisAnalyzeResponseSchema,
	contentHelperTopics: ContentHelperTopicsResponseSchema,
	publicCrawlerIps: PublicCrawlerIpsResponseSchema,
	publicCrawlerIpRanges: PublicCrawlerIpRangesResponseSchema,
	publicDomainRatingFree: PublicDomainRatingFreeResponseSchema,
	publicDomainRatingFreeBatch: PublicDomainRatingFreeBatchResponseSchema,
	publicDomainRatingTopDomains: PublicDomainRatingTopDomainsResponseSchema,
	webAnalyticsStats: WebAnalyticsStatsResponseSchema,
	webAnalyticsChart: WebAnalyticsTotalsChartResponseSchema,
	webAnalyticsTopPages: WebAnalyticsTopPagesResponseSchema,
	webAnalyticsTopPagesChart: WebAnalyticsTopPagesChartResponseSchema,
	webAnalyticsEntryPages: WebAnalyticsEntryPagesResponseSchema,
	webAnalyticsEntryPagesChart: WebAnalyticsEntryPagesChartResponseSchema,
	webAnalyticsExitPages: WebAnalyticsExitPagesResponseSchema,
	webAnalyticsExitPagesChart: WebAnalyticsExitPagesChartResponseSchema,
	webAnalyticsReferrers: WebAnalyticsReferrersResponseSchema,
	webAnalyticsReferrersChart: WebAnalyticsReferrersChartResponseSchema,
	webAnalyticsSources: WebAnalyticsSourcesResponseSchema,
	webAnalyticsSourcesChart: WebAnalyticsSourcesChartResponseSchema,
	webAnalyticsSourceChannels: WebAnalyticsSourceChannelsResponseSchema,
	webAnalyticsSourceChannelsChart:
		WebAnalyticsSourceChannelsChartResponseSchema,
	webAnalyticsUtmParams: WebAnalyticsUtmParamsResponseSchema,
	webAnalyticsUtmParamsChart: WebAnalyticsUtmParamsChartResponseSchema,
	webAnalyticsCountries: WebAnalyticsCountriesResponseSchema,
	webAnalyticsCountriesChart: WebAnalyticsCountriesChartResponseSchema,
	webAnalyticsCities: WebAnalyticsCitiesResponseSchema,
	webAnalyticsCitiesChart: WebAnalyticsCitiesChartResponseSchema,
	webAnalyticsContinents: WebAnalyticsContinentsResponseSchema,
	webAnalyticsContinentsChart: WebAnalyticsContinentsChartResponseSchema,
	webAnalyticsLanguages: WebAnalyticsLanguagesResponseSchema,
	webAnalyticsLanguagesChart: WebAnalyticsLanguagesChartResponseSchema,
	webAnalyticsDevices: WebAnalyticsDevicesResponseSchema,
	webAnalyticsDevicesChart: WebAnalyticsDevicesChartResponseSchema,
	webAnalyticsBrowsers: WebAnalyticsBrowsersResponseSchema,
	webAnalyticsBrowsersChart: WebAnalyticsBrowsersChartResponseSchema,
	webAnalyticsBrowserVersions: WebAnalyticsBrowserVersionsResponseSchema,
	webAnalyticsBrowserVersionsChart:
		WebAnalyticsBrowserVersionsChartResponseSchema,
	webAnalyticsOperatingSystems: WebAnalyticsOperatingSystemsResponseSchema,
	webAnalyticsOperatingSystemsChart:
		WebAnalyticsOperatingSystemsChartResponseSchema,
	webAnalyticsOperatingSystemsVersions:
		WebAnalyticsOperatingSystemsVersionsResponseSchema,
	webAnalyticsOperatingSystemsVersionsChart:
		WebAnalyticsOperatingSystemsVersionsChartResponseSchema,
} as const;
