import { z } from 'zod';

const isoDateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

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

export const BacklinksStatsInputSchema = BaseSiteExplorerInputSchema.extend({
	mode: z.enum(AHREFS_TARGET_MODES).default('subdomains').optional(),
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
	timeout: z.number().int().positive().optional(),
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
});

export const RefdomainsInputSchema = SiteExplorerTableInputSchema.extend({
	history: z.string().default('all_time').optional(),
});

export const TopPagesInputSchema = SiteExplorerTableInputSchema.extend({
	country: z.string().length(2),
	date_compared: isoDateString.optional(),
	volume_mode: z.enum(AHREFS_VOLUME_MODES).default('monthly').optional(),
});

export const KeywordsOverviewInputSchema = z
	.object({
		timeout: z.number().int().positive().optional(),
		limit: z.number().int().positive().default(1000).optional(),
		order_by: z.string().optional(),
		where: z.string().optional(),
		select: z.string().min(1),
		volume_monthly_date_to: isoDateString.optional(),
		volume_monthly_date_from: isoDateString.optional(),
		target_mode: z.enum(AHREFS_TARGET_MODES).optional(),
		target: z.string().min(1).optional(),
		target_position: z.enum(AHREFS_TARGET_POSITIONS).optional(),
		country: z.string().length(2),
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
		keyword: z.string(),
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
		domain: z.string(),
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
		raw_url: z.string(),
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
	timeout: z.number().int().positive().optional(),
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
	output: z.enum(AHREFS_OUTPUT_FORMATS).default('json').optional(),
});

export const SerpPositionSchema = z
	.object({
		position: z.number().int(),
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
		country: z
			.string()
			.length(2)
			.describe(
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
		intents: z.record(z.string(), z.unknown()).nullable().optional(),
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
		intents: z.record(z.string(), z.unknown()).nullable().optional(),
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
		intents: z.record(z.string(), z.unknown()).nullable().optional(),
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
	country: z
		.string()
		.length(2)
		.describe('A country code, or all for all locations.'),
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
		volume_monthly_history: z.array(z.unknown()).nullable().optional(),
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
		competitors_list: z.array(z.unknown()).nullable().optional(),
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
		folder: z.record(z.string(), z.unknown()).nullable().optional(),
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
			languages: z.array(z.unknown()).nullable().optional(),
			locations: z.array(z.unknown()).nullable().optional(),
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
} as const;
