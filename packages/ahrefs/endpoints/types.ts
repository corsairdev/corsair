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
		keywords: z.union([z.string().min(1), z.array(z.string().min(1)).min(1)]).optional(),
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
export type BacklinksStatsResponse = z.infer<typeof BacklinksStatsResponseSchema>;
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
} as const;
