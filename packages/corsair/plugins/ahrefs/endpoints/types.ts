import { z } from 'zod';

// ── Shared Enums ─────────────────────────────────────────────────────────────

const ModeEnum = z.enum(['exact', 'prefix', 'domain', 'subdomains']).optional();
const ProtocolEnum = z.enum(['both', 'http', 'https']).optional();
const OutputFormatEnum = z.enum(['json', 'csv', 'xml', 'php']).optional();
const HistoryGroupingEnum = z.enum(['daily', 'weekly', 'monthly']).optional();
const VolumeModeEnum = z.enum(['monthly', 'average']).optional();
const DeviceEnum = z.enum(['desktop', 'mobile']);
// Country codes follow ISO 3166-1 alpha-2; using z.string() to avoid exhaustive enum maintenance
const CountryCodeSchema = z.string().optional();
const CountryCodeRequiredSchema = z.string();

// ── Base Response Schema ──────────────────────────────────────────────────────

const BaseResponseSchema = z.object({
	successful: z.boolean(),
	error: z.string().optional(),
});

// ── Input Schemas ─────────────────────────────────────────────────────────────

// Site Explorer

export const SiteExplorerBacklinksStatsInputSchema = z.object({
	target: z.string(),
	date: z.string(),
	mode: ModeEnum,
	protocol: ProtocolEnum,
	output: OutputFormatEnum,
});

export const SiteExplorerBatchUrlAnalysisInputSchema = z.object({
	targets: z.array(z.string()),
	select: z.array(z.string()),
	country: CountryCodeSchema,
	order_by: z.string().optional(),
	volume_mode: VolumeModeEnum,
	output: OutputFormatEnum,
});

export const SiteExplorerDomainRatingInputSchema = z.object({
	target: z.string(),
	date: z.string(),
	protocol: ProtocolEnum,
	output: OutputFormatEnum,
});

export const SiteExplorerDomainRatingHistoryInputSchema = z.object({
	target: z.string(),
	date_from: z.string(),
	date_to: z.string().optional(),
	history_grouping: HistoryGroupingEnum,
	output: OutputFormatEnum,
});

export const SiteExplorerAllBacklinksInputSchema = z.object({
	target: z.string(),
	select: z.string(),
	mode: ModeEnum,
	protocol: ProtocolEnum,
	limit: z.number().optional(),
	offset: z.number().optional(),
	where: z.string().optional(),
	order_by: z.string().optional(),
	history: z.string().optional(),
	timeout: z.number().optional(),
	aggregation: z.enum(['similar_links', '1_per_domain', 'all']).optional(),
	output: OutputFormatEnum,
});

export const SiteExplorerBrokenBacklinksInputSchema = z.object({
	target: z.string(),
	select: z.string(),
	mode: ModeEnum,
	protocol: ProtocolEnum,
	limit: z.number().optional(),
	offset: z.number().optional(),
	where: z.string().optional(),
	order_by: z.string().optional(),
	timeout: z.number().optional(),
	aggregation: z.enum(['similar_links', '1_per_domain', 'all']).optional(),
	output: OutputFormatEnum,
});

export const SiteExplorerReferringDomainsInputSchema = z.object({
	target: z.string(),
	select: z.string(),
	mode: ModeEnum,
	protocol: ProtocolEnum,
	limit: z.number().optional(),
	offset: z.number().optional(),
	where: z.string().optional(),
	order_by: z.string().optional(),
	history: z.string().optional(),
	timeout: z.number().optional(),
	output: OutputFormatEnum,
});

export const SiteExplorerCountryMetricsInputSchema = z.object({
	target: z.string(),
	date: z.string(),
	mode: ModeEnum,
	protocol: ProtocolEnum,
	limit: z.number().optional(),
	volume_mode: VolumeModeEnum,
	output: OutputFormatEnum,
});

export const SiteExplorerLinkedAnchorsExternalInputSchema = z.object({
	target: z.string(),
	select: z.string(),
	mode: ModeEnum,
	protocol: ProtocolEnum,
	limit: z.number().optional(),
	offset: z.number().optional(),
	where: z.string().optional(),
	order_by: z.string().optional(),
	timeout: z.number().optional(),
	output: OutputFormatEnum,
});

export const SiteExplorerUrlRatingHistoryInputSchema = z.object({
	target: z.string(),
	date_from: z.string(),
	date_to: z.string().optional(),
	history_grouping: HistoryGroupingEnum,
	output: OutputFormatEnum,
});

export const SiteExplorerLinkedAnchorsInputSchema = z.object({
	target: z.string(),
	select: z.string(),
	mode: ModeEnum,
	protocol: ProtocolEnum,
	limit: z.number().optional(),
	offset: z.number().optional(),
	where: z.string().optional(),
	order_by: z.string().optional(),
	timeout: z.number().optional(),
	output: OutputFormatEnum,
});

export const SiteExplorerBestByExternalLinksInputSchema = z.object({
	target: z.string(),
	select: z.string(),
	mode: ModeEnum,
	protocol: ProtocolEnum,
	limit: z.number().optional(),
	offset: z.number().optional(),
	where: z.string().optional(),
	order_by: z.string().optional(),
	history: z.string().optional(),
	timeout: z.number().optional(),
	output: OutputFormatEnum,
});

export const SiteExplorerPagesByTrafficInputSchema = z.object({
	target: z.string(),
	mode: ModeEnum,
	protocol: ProtocolEnum,
	country: CountryCodeSchema,
	volume_mode: VolumeModeEnum,
	output: OutputFormatEnum,
});

export const SiteExplorerAnchorDataInputSchema = z.object({
	target: z.string(),
	select: z.string(),
	mode: ModeEnum,
	protocol: ProtocolEnum,
	limit: z.number().optional(),
	offset: z.number().optional(),
	where: z.string().optional(),
	order_by: z.string().optional(),
	history: z.string().optional(),
	timeout: z.number().optional(),
	output: OutputFormatEnum,
});

export const SiteExplorerBestByInternalLinksInputSchema = z.object({
	target: z.string(),
	select: z.string(),
	mode: ModeEnum,
	protocol: ProtocolEnum,
	limit: z.number().optional(),
	offset: z.number().optional(),
	where: z.string().optional(),
	order_by: z.string().optional(),
	timeout: z.number().optional(),
	output: OutputFormatEnum,
});

export const SiteExplorerOrganicCompetitorsInputSchema = z.object({
	target: z.string(),
	date: z.string(),
	country: CountryCodeRequiredSchema,
	select: z.string(),
	mode: ModeEnum,
	protocol: ProtocolEnum,
	limit: z.number().optional(),
	offset: z.number().optional(),
	where: z.string().optional(),
	order_by: z.string().optional(),
	timeout: z.number().optional(),
	volume_mode: VolumeModeEnum,
	date_compared: z.string().optional(),
	output: OutputFormatEnum,
});

export const SiteExplorerOrganicKeywordsInputSchema = z.object({
	target: z.string(),
	date: z.string(),
	country: CountryCodeRequiredSchema,
	select: z.string(),
	mode: ModeEnum,
	protocol: ProtocolEnum,
	limit: z.number().optional(),
	offset: z.number().optional(),
	where: z.string().optional(),
	order_by: z.string().optional(),
	timeout: z.number().optional(),
	volume_mode: VolumeModeEnum,
	date_compared: z.string().optional(),
	output: OutputFormatEnum,
});

export const SiteExplorerOutlinksStatsInputSchema = z.object({
	target: z.string(),
	mode: ModeEnum,
	protocol: ProtocolEnum,
	output: OutputFormatEnum,
});

export const SiteExplorerPaidPagesInputSchema = z.object({
	target: z.string(),
	date: z.string(),
	select: z.string(),
	mode: ModeEnum,
	protocol: ProtocolEnum,
	country: CountryCodeSchema,
	limit: z.number().optional(),
	offset: z.number().optional(),
	where: z.string().optional(),
	order_by: z.string().optional(),
	timeout: z.number().optional(),
	volume_mode: VolumeModeEnum,
	date_compared: z.string().optional(),
	output: OutputFormatEnum,
});

export const SiteExplorerKeywordsHistoryInputSchema = z.object({
	target: z.string(),
	date_from: z.string(),
	mode: ModeEnum,
	protocol: ProtocolEnum,
	country: CountryCodeSchema,
	select: z.string().optional(),
	date_to: z.string().optional(),
	history_grouping: HistoryGroupingEnum,
	output: OutputFormatEnum,
});

export const SiteExplorerMetricsInputSchema = z.object({
	target: z.string(),
	date: z.string(),
	mode: ModeEnum,
	protocol: ProtocolEnum,
	country: CountryCodeSchema,
	volume_mode: VolumeModeEnum,
	output: OutputFormatEnum,
});

export const SiteExplorerMetricsHistoryInputSchema = z.object({
	target: z.string(),
	date_from: z.string(),
	mode: ModeEnum,
	protocol: ProtocolEnum,
	country: CountryCodeSchema,
	select: z.string().optional(),
	date_to: z.string().optional(),
	volume_mode: VolumeModeEnum,
	history_grouping: HistoryGroupingEnum,
	output: OutputFormatEnum,
});

export const SiteExplorerPagesHistoryInputSchema = z.object({
	target: z.string(),
	date_from: z.string(),
	mode: ModeEnum,
	protocol: ProtocolEnum,
	country: CountryCodeSchema,
	date_to: z.string().optional(),
	history_grouping: HistoryGroupingEnum,
	output: OutputFormatEnum,
});

export const SiteExplorerReferringDomainsHistoryInputSchema = z.object({
	target: z.string(),
	date_from: z.string(),
	mode: ModeEnum,
	protocol: ProtocolEnum,
	date_to: z.string().optional(),
	history_grouping: HistoryGroupingEnum,
	output: OutputFormatEnum,
});

export const SiteExplorerTopPagesInputSchema = z.object({
	target: z.string(),
	date: z.string(),
	select: z.string(),
	mode: ModeEnum,
	protocol: ProtocolEnum,
	country: CountryCodeSchema,
	limit: z.number().optional(),
	offset: z.number().optional(),
	where: z.string().optional(),
	order_by: z.string().optional(),
	timeout: z.number().optional(),
	volume_mode: VolumeModeEnum,
	date_compared: z.string().optional(),
	output: OutputFormatEnum,
});

export const SiteExplorerLinkedDomainsInputSchema = z.object({
	target: z.string(),
	select: z.string(),
	mode: ModeEnum,
	protocol: ProtocolEnum,
	limit: z.number().optional(),
	offset: z.number().optional(),
	where: z.string().optional(),
	order_by: z.string().optional(),
	timeout: z.number().optional(),
	output: OutputFormatEnum,
});

// Keywords Explorer

export const KeywordsExplorerOverviewInputSchema = z.object({
	country: CountryCodeRequiredSchema,
	select: z.string(),
	target: z.string().optional(),
	target_mode: z.enum(['exact', 'prefix', 'domain', 'subdomains']).optional(),
	target_position: z.enum(['in_top10', 'in_top100']).optional(),
	keywords: z.string().optional(),
	keyword_list_id: z.number().optional(),
	search_engine: z.enum(['google']).optional(),
	limit: z.number().optional(),
	offset: z.number().optional(),
	where: z.string().optional(),
	order_by: z.string().optional(),
	timeout: z.number().optional(),
	output: OutputFormatEnum,
});

export const KeywordsExplorerVolumeByCountryInputSchema = z.object({
	keyword: z.string(),
	search_engine: z.enum(['google']).optional(),
	limit: z.number().optional(),
	output: OutputFormatEnum,
});

export const KeywordsExplorerMatchingTermsInputSchema = z.object({
	country: CountryCodeRequiredSchema,
	select: z.string(),
	keywords: z.string().optional(),
	keyword_list_id: z.number().optional(),
	terms: z.enum(['all', 'questions']).optional(),
	match_mode: z.enum(['terms', 'phrase']).optional(),
	search_engine: z.enum(['google']).optional(),
	limit: z.number().optional(),
	offset: z.number().optional(),
	where: z.string().optional(),
	order_by: z.string().optional(),
	timeout: z.number().optional(),
	output: OutputFormatEnum,
});

export const KeywordsExplorerTotalSearchVolumeHistoryInputSchema = z.object({
	target: z.string(),
	date_from: z.string(),
	mode: ModeEnum,
	protocol: ProtocolEnum,
	country: CountryCodeSchema,
	date_to: z.string().optional(),
	volume_mode: VolumeModeEnum,
	top_positions: z.enum(['top_10', 'top_100']).optional(),
	history_grouping: HistoryGroupingEnum,
	output: OutputFormatEnum,
});

export const KeywordsExplorerRelatedTermsInputSchema = z.object({
	country: CountryCodeRequiredSchema,
	select: z.string(),
	keywords: z.string().optional(),
	keyword_list_id: z.number().optional(),
	terms: z.enum(['all', 'questions']).optional(),
	view_for: z.string().optional(),
	limit: z.number().optional(),
	offset: z.number().optional(),
	where: z.string().optional(),
	order_by: z.string().optional(),
	timeout: z.number().optional(),
	output: OutputFormatEnum,
});

export const KeywordsExplorerVolumeHistoryInputSchema = z.object({
	keyword: z.string(),
	country: CountryCodeRequiredSchema,
	output: OutputFormatEnum,
});

export const KeywordsExplorerSearchSuggestionsInputSchema = z.object({
	country: CountryCodeRequiredSchema,
	select: z.string(),
	keywords: z.string().optional(),
	keyword_list_id: z.number().optional(),
	search_engine: z.enum(['google']).optional(),
	limit: z.number().optional(),
	offset: z.number().optional(),
	where: z.string().optional(),
	order_by: z.string().optional(),
	timeout: z.number().optional(),
	output: OutputFormatEnum,
});

// Rank Tracker

export const RankTrackerCompetitorsOverviewInputSchema = z.object({
	project_id: z.number(),
	date: z.string(),
	device: DeviceEnum,
	select: z.string(),
	limit: z.number().optional(),
	offset: z.number().optional(),
	where: z.string().optional(),
	order_by: z.string().optional(),
	timeout: z.number().optional(),
	volume_mode: VolumeModeEnum,
	date_compared: z.string().optional(),
	output: OutputFormatEnum,
});

export const RankTrackerOverviewInputSchema = z.object({
	project_id: z.number(),
	date: z.string(),
	device: DeviceEnum,
	select: z.string(),
	limit: z.number().optional(),
	offset: z.number().optional(),
	where: z.string().optional(),
	order_by: z.string().optional(),
	timeout: z.number().optional(),
	volume_mode: VolumeModeEnum,
	date_compared: z.string().optional(),
	output: OutputFormatEnum,
});

// SERP

export const SerpOverviewInputSchema = z.object({
	keyword: z.string(),
	country: CountryCodeRequiredSchema,
	select: z.string(),
	date: z.string().optional(),
	top_positions: z.number().optional(),
	output: OutputFormatEnum,
});

// Site Audit

export const SiteAuditProjectsInputSchema = z.object({
	output: OutputFormatEnum,
});

// Subscription

export const SubscriptionLimitsAndUsageInputSchema = z.object({
	output: OutputFormatEnum,
});

// Crawler

export const CrawlerIpRangesInputSchema = z.object({
	output: OutputFormatEnum,
});

export const CrawlerPublicIpsInputSchema = z.object({
	output: OutputFormatEnum,
});

// ── Output Schemas ────────────────────────────────────────────────────────────

// Shared metrics object used in backlinks stats and site explorer metrics
const BacklinksMetricsSchema = z.object({
	edu: z.number().optional(),
	gov: z.number().optional(),
	rss: z.number().optional(),
	live: z.number().optional(),
	text: z.number().optional(),
	image: z.number().optional(),
	pages: z.number().optional(),
	refips: z.number().optional(),
	dofollow: z.number().optional(),
	nofollow: z.number().optional(),
	redirect: z.number().optional(),
	refpages: z.number().optional(),
	alternate: z.number().optional(),
	backlinks: z.number().optional(),
	canonical: z.number().optional(),
	html_pages: z.number().optional(),
	refclass_c: z.number().optional(),
	refdomains: z.number().optional(),
	valid_pages: z.number().optional(),
	links_external: z.number().optional(),
	links_internal: z.number().optional(),
	linked_root_domains: z.number().optional(),
});

// Ahrefs API returns flexible arrays of domain/page/keyword objects with `select`-driven fields;
// using z.array(z.record(z.string(), z.unknown())) to accommodate the dynamic shape
const FlexibleArraySchema = z.array(z.record(z.string(), z.unknown()));

export const SiteExplorerBacklinksStatsOutputSchema = BaseResponseSchema.extend({
	data: z
		.object({
			metrics: BacklinksMetricsSchema.optional(),
		})
		.optional(),
});

export const SiteExplorerBatchUrlAnalysisOutputSchema = BaseResponseSchema.extend({
	data: z
		.object({
			// Ahrefs batch analysis returns an array of per-URL metric objects keyed by selected fields
			results: FlexibleArraySchema.optional(),
		})
		.optional(),
});

export const SiteExplorerDomainRatingOutputSchema = BaseResponseSchema.extend({
	data: z
		.object({
			domain_rating: z.number().optional(),
			ahrefs_rank: z.number().optional(),
		})
		.optional(),
});

export const SiteExplorerDomainRatingHistoryOutputSchema = BaseResponseSchema.extend({
	data: z
		.object({
			// Array of { date, domain_rating } objects
			history: FlexibleArraySchema.optional(),
		})
		.optional(),
});

export const SiteExplorerAllBacklinksOutputSchema = BaseResponseSchema.extend({
	data: z
		.object({
			// Array of backlink objects with select-driven fields
			refpages: FlexibleArraySchema.optional(),
		})
		.optional(),
});

export const SiteExplorerBrokenBacklinksOutputSchema = BaseResponseSchema.extend({
	data: z
		.object({
			refpages: FlexibleArraySchema.optional(),
		})
		.optional(),
});

export const SiteExplorerReferringDomainsOutputSchema = BaseResponseSchema.extend({
	data: z
		.object({
			// stats is an open-ended summary object; field names and value types vary by Ahrefs API version
			stats: z.record(z.string(), z.unknown()).optional(),
			refdomains: FlexibleArraySchema.optional(),
		})
		.optional(),
});

export const SiteExplorerCountryMetricsOutputSchema = BaseResponseSchema.extend({
	data: z
		.object({
			country: z.string().optional(),
			// Array of per-country metric objects
			metrics: FlexibleArraySchema.optional(),
		})
		.optional(),
});

export const SiteExplorerLinkedAnchorsExternalOutputSchema = BaseResponseSchema.extend({
	data: z
		.object({
			anchors: FlexibleArraySchema.optional(),
		})
		.optional(),
});

export const SiteExplorerUrlRatingHistoryOutputSchema = BaseResponseSchema.extend({
	data: z
		.object({
			mode: z.string().optional(),
			target: z.string().optional(),
			history: FlexibleArraySchema.optional(),
		})
		.optional(),
});

export const SiteExplorerLinkedAnchorsOutputSchema = BaseResponseSchema.extend({
	data: z
		.object({
			anchors: FlexibleArraySchema.optional(),
		})
		.optional(),
});

export const SiteExplorerBestByExternalLinksOutputSchema = BaseResponseSchema.extend({
	data: z
		.object({
			pages: FlexibleArraySchema.optional(),
		})
		.optional(),
});

export const SiteExplorerPagesByTrafficOutputSchema = BaseResponseSchema.extend({
	data: z
		.object({
			pages: FlexibleArraySchema.optional(),
		})
		.optional(),
});

export const SiteExplorerAnchorDataOutputSchema = BaseResponseSchema.extend({
	data: z
		.object({
			// stats is an open-ended summary object; field names and value types vary by Ahrefs API version
			stats: z.record(z.string(), z.unknown()).optional(),
			anchors: FlexibleArraySchema.optional(),
		})
		.optional(),
});

export const SiteExplorerBestByInternalLinksOutputSchema = BaseResponseSchema.extend({
	data: z
		.object({
			pages: FlexibleArraySchema.optional(),
		})
		.optional(),
});

export const SiteExplorerOrganicCompetitorsOutputSchema = BaseResponseSchema.extend({
	data: z
		.object({
			competitors: FlexibleArraySchema.optional(),
		})
		.optional(),
});

export const SiteExplorerOrganicKeywordsOutputSchema = BaseResponseSchema.extend({
	data: z
		.object({
			keywords: FlexibleArraySchema.optional(),
		})
		.optional(),
});

export const SiteExplorerOutlinksStatsOutputSchema = BaseResponseSchema.extend({
	data: z
		.object({
			// outlinks is a scalar-stats map; field names (links_external, links_internal, etc.) depend on the Ahrefs response version
			outlinks: z.record(z.string(), z.unknown()).optional(),
		})
		.optional(),
});

export const SiteExplorerPaidPagesOutputSchema = BaseResponseSchema.extend({
	data: z
		.object({
			pages: FlexibleArraySchema.optional(),
		})
		.optional(),
});

export const SiteExplorerKeywordsHistoryOutputSchema = BaseResponseSchema.extend({
	data: z
		.object({
			keywords: FlexibleArraySchema.optional(),
		})
		.optional(),
});

export const SiteExplorerMetricsOutputSchema = BaseResponseSchema.extend({
	data: BacklinksMetricsSchema.optional(),
});

export const SiteExplorerMetricsHistoryOutputSchema = BaseResponseSchema.extend({
	data: z
		.object({
			metrics: FlexibleArraySchema.optional(),
		})
		.optional(),
});

export const SiteExplorerPagesHistoryOutputSchema = BaseResponseSchema.extend({
	data: z
		.object({
			target: z.string().optional(),
			history: FlexibleArraySchema.optional(),
		})
		.optional(),
});

export const SiteExplorerReferringDomainsHistoryOutputSchema = BaseResponseSchema.extend({
	data: z
		.object({
			history: FlexibleArraySchema.optional(),
		})
		.optional(),
});

export const SiteExplorerTopPagesOutputSchema = BaseResponseSchema.extend({
	data: z
		.object({
			pages: FlexibleArraySchema.optional(),
		})
		.optional(),
});

export const SiteExplorerLinkedDomainsOutputSchema = BaseResponseSchema.extend({
	data: z
		.object({
			domains: FlexibleArraySchema.optional(),
		})
		.optional(),
});

// Keywords Explorer

export const KeywordsExplorerOverviewOutputSchema = BaseResponseSchema.extend({
	data: z
		.object({
			// Overview data shape varies based on `select` fields
			data: FlexibleArraySchema.optional(),
		})
		.optional(),
});

export const KeywordsExplorerVolumeByCountryOutputSchema = BaseResponseSchema.extend({
	data: z
		.object({
			keyword: z.string().optional(),
			globalVolume: z.number().optional(),
			lastUpdated: z.string().optional(),
			countries: FlexibleArraySchema.optional(),
		})
		.optional(),
});

export const KeywordsExplorerMatchingTermsOutputSchema = BaseResponseSchema.extend({
	data: z
		.object({
			keywords: FlexibleArraySchema.optional(),
		})
		.optional(),
});

export const KeywordsExplorerTotalSearchVolumeHistoryOutputSchema = BaseResponseSchema.extend({
	data: z
		.object({
			target: z.string().optional(),
			history: FlexibleArraySchema.optional(),
		})
		.optional(),
});

export const KeywordsExplorerRelatedTermsOutputSchema = BaseResponseSchema.extend({
	data: z
		.object({
			terms: FlexibleArraySchema.optional(),
		})
		.optional(),
});

export const KeywordsExplorerVolumeHistoryOutputSchema = BaseResponseSchema.extend({
	data: z
		.object({
			keyword: z.string().optional(),
			country: z.string().optional(),
			date_from: z.string().optional(),
			date_to: z.string().optional(),
			volume_history: FlexibleArraySchema.optional(),
		})
		.optional(),
});

export const KeywordsExplorerSearchSuggestionsOutputSchema = BaseResponseSchema.extend({
	data: z
		.object({
			suggestions: FlexibleArraySchema.optional(),
		})
		.optional(),
});

// Rank Tracker

export const RankTrackerCompetitorsOverviewOutputSchema = BaseResponseSchema.extend({
	data: z
		.object({
			competitors: FlexibleArraySchema.optional(),
		})
		.optional(),
});

export const RankTrackerOverviewOutputSchema = BaseResponseSchema.extend({
	data: z
		.object({
			cost: z.number().optional(),
			traffic: z.number().optional(),
			cost_top3: z.number().optional(),
			positions: z.number().optional(),
			cost_top10: z.number().optional(),
			visibility: z.number().optional(),
			traffic_top3: z.number().optional(),
			traffic_top10: z.number().optional(),
			positions_top3: z.number().optional(),
			share_of_voice: z.number().optional(),
			positions_top10: z.number().optional(),
			average_position: z.number().optional(),
		})
		.optional(),
});

// SERP

export const SerpOverviewOutputSchema = BaseResponseSchema.extend({
	data: z
		.object({
			results: FlexibleArraySchema.optional(),
		})
		.optional(),
});

// Site Audit

const SiteAuditProjectSchema = z.object({
	project_id: z.string().optional(),
	domain: z.string().optional(),
	crawl_id: z.string().optional(),
	crawl_status: z.string().optional(),
	crawled_urls: z.number().optional(),
	health_score: z.number().optional(),
	issues_count: z.number().optional(),
	last_crawl_date: z.string().optional(),
	next_scheduled_audit: z.string().optional(),
});

export const SiteAuditProjectsOutputSchema = BaseResponseSchema.extend({
	data: z
		.object({
			projects: z.array(SiteAuditProjectSchema).optional(),
		})
		.optional(),
});

// Subscription

export const SubscriptionLimitsAndUsageOutputSchema = BaseResponseSchema.extend({
	data: z
		.object({
			rows_left: z.number().optional(),
			rows_limit: z.number().optional(),
			subscription: z.string().optional(),
		})
		.optional(),
});

// Crawler

export const CrawlerIpRangesOutputSchema = BaseResponseSchema.extend({
	data: z
		.object({
			// Array of CIDR prefix strings
			prefixes: z.array(z.string()).optional(),
		})
		.optional(),
});

export const CrawlerPublicIpsOutputSchema = BaseResponseSchema.extend({
	data: z
		.object({
			ips: z.array(z.string()).optional(),
		})
		.optional(),
});

// ── Endpoint I/O Maps ─────────────────────────────────────────────────────────

export type AhrefsEndpointInputs = {
	// Site Explorer
	siteExplorerBacklinksStats: z.infer<typeof SiteExplorerBacklinksStatsInputSchema>;
	siteExplorerBatchUrlAnalysis: z.infer<typeof SiteExplorerBatchUrlAnalysisInputSchema>;
	siteExplorerDomainRating: z.infer<typeof SiteExplorerDomainRatingInputSchema>;
	siteExplorerDomainRatingHistory: z.infer<typeof SiteExplorerDomainRatingHistoryInputSchema>;
	siteExplorerAllBacklinks: z.infer<typeof SiteExplorerAllBacklinksInputSchema>;
	siteExplorerBrokenBacklinks: z.infer<typeof SiteExplorerBrokenBacklinksInputSchema>;
	siteExplorerReferringDomains: z.infer<typeof SiteExplorerReferringDomainsInputSchema>;
	siteExplorerCountryMetrics: z.infer<typeof SiteExplorerCountryMetricsInputSchema>;
	siteExplorerLinkedAnchorsExternal: z.infer<typeof SiteExplorerLinkedAnchorsExternalInputSchema>;
	siteExplorerUrlRatingHistory: z.infer<typeof SiteExplorerUrlRatingHistoryInputSchema>;
	siteExplorerLinkedAnchors: z.infer<typeof SiteExplorerLinkedAnchorsInputSchema>;
	siteExplorerBestByExternalLinks: z.infer<typeof SiteExplorerBestByExternalLinksInputSchema>;
	siteExplorerPagesByTraffic: z.infer<typeof SiteExplorerPagesByTrafficInputSchema>;
	siteExplorerAnchorData: z.infer<typeof SiteExplorerAnchorDataInputSchema>;
	siteExplorerBestByInternalLinks: z.infer<typeof SiteExplorerBestByInternalLinksInputSchema>;
	siteExplorerOrganicCompetitors: z.infer<typeof SiteExplorerOrganicCompetitorsInputSchema>;
	siteExplorerOrganicKeywords: z.infer<typeof SiteExplorerOrganicKeywordsInputSchema>;
	siteExplorerOutlinksStats: z.infer<typeof SiteExplorerOutlinksStatsInputSchema>;
	siteExplorerPaidPages: z.infer<typeof SiteExplorerPaidPagesInputSchema>;
	siteExplorerKeywordsHistory: z.infer<typeof SiteExplorerKeywordsHistoryInputSchema>;
	siteExplorerMetrics: z.infer<typeof SiteExplorerMetricsInputSchema>;
	siteExplorerMetricsHistory: z.infer<typeof SiteExplorerMetricsHistoryInputSchema>;
	siteExplorerPagesHistory: z.infer<typeof SiteExplorerPagesHistoryInputSchema>;
	siteExplorerReferringDomainsHistory: z.infer<typeof SiteExplorerReferringDomainsHistoryInputSchema>;
	siteExplorerTopPages: z.infer<typeof SiteExplorerTopPagesInputSchema>;
	siteExplorerLinkedDomains: z.infer<typeof SiteExplorerLinkedDomainsInputSchema>;
	// Keywords Explorer
	keywordsExplorerOverview: z.infer<typeof KeywordsExplorerOverviewInputSchema>;
	keywordsExplorerVolumeByCountry: z.infer<typeof KeywordsExplorerVolumeByCountryInputSchema>;
	keywordsExplorerMatchingTerms: z.infer<typeof KeywordsExplorerMatchingTermsInputSchema>;
	keywordsExplorerTotalSearchVolumeHistory: z.infer<typeof KeywordsExplorerTotalSearchVolumeHistoryInputSchema>;
	keywordsExplorerRelatedTerms: z.infer<typeof KeywordsExplorerRelatedTermsInputSchema>;
	keywordsExplorerVolumeHistory: z.infer<typeof KeywordsExplorerVolumeHistoryInputSchema>;
	keywordsExplorerSearchSuggestions: z.infer<typeof KeywordsExplorerSearchSuggestionsInputSchema>;
	// Rank Tracker
	rankTrackerCompetitorsOverview: z.infer<typeof RankTrackerCompetitorsOverviewInputSchema>;
	rankTrackerOverview: z.infer<typeof RankTrackerOverviewInputSchema>;
	// SERP
	serpOverview: z.infer<typeof SerpOverviewInputSchema>;
	// Site Audit
	siteAuditProjects: z.infer<typeof SiteAuditProjectsInputSchema>;
	// Subscription
	subscriptionLimitsAndUsage: z.infer<typeof SubscriptionLimitsAndUsageInputSchema>;
	// Crawler
	crawlerIpRanges: z.infer<typeof CrawlerIpRangesInputSchema>;
	crawlerPublicIps: z.infer<typeof CrawlerPublicIpsInputSchema>;
};

export type AhrefsEndpointOutputs = {
	// Site Explorer
	siteExplorerBacklinksStats: z.infer<typeof SiteExplorerBacklinksStatsOutputSchema>;
	siteExplorerBatchUrlAnalysis: z.infer<typeof SiteExplorerBatchUrlAnalysisOutputSchema>;
	siteExplorerDomainRating: z.infer<typeof SiteExplorerDomainRatingOutputSchema>;
	siteExplorerDomainRatingHistory: z.infer<typeof SiteExplorerDomainRatingHistoryOutputSchema>;
	siteExplorerAllBacklinks: z.infer<typeof SiteExplorerAllBacklinksOutputSchema>;
	siteExplorerBrokenBacklinks: z.infer<typeof SiteExplorerBrokenBacklinksOutputSchema>;
	siteExplorerReferringDomains: z.infer<typeof SiteExplorerReferringDomainsOutputSchema>;
	siteExplorerCountryMetrics: z.infer<typeof SiteExplorerCountryMetricsOutputSchema>;
	siteExplorerLinkedAnchorsExternal: z.infer<typeof SiteExplorerLinkedAnchorsExternalOutputSchema>;
	siteExplorerUrlRatingHistory: z.infer<typeof SiteExplorerUrlRatingHistoryOutputSchema>;
	siteExplorerLinkedAnchors: z.infer<typeof SiteExplorerLinkedAnchorsOutputSchema>;
	siteExplorerBestByExternalLinks: z.infer<typeof SiteExplorerBestByExternalLinksOutputSchema>;
	siteExplorerPagesByTraffic: z.infer<typeof SiteExplorerPagesByTrafficOutputSchema>;
	siteExplorerAnchorData: z.infer<typeof SiteExplorerAnchorDataOutputSchema>;
	siteExplorerBestByInternalLinks: z.infer<typeof SiteExplorerBestByInternalLinksOutputSchema>;
	siteExplorerOrganicCompetitors: z.infer<typeof SiteExplorerOrganicCompetitorsOutputSchema>;
	siteExplorerOrganicKeywords: z.infer<typeof SiteExplorerOrganicKeywordsOutputSchema>;
	siteExplorerOutlinksStats: z.infer<typeof SiteExplorerOutlinksStatsOutputSchema>;
	siteExplorerPaidPages: z.infer<typeof SiteExplorerPaidPagesOutputSchema>;
	siteExplorerKeywordsHistory: z.infer<typeof SiteExplorerKeywordsHistoryOutputSchema>;
	siteExplorerMetrics: z.infer<typeof SiteExplorerMetricsOutputSchema>;
	siteExplorerMetricsHistory: z.infer<typeof SiteExplorerMetricsHistoryOutputSchema>;
	siteExplorerPagesHistory: z.infer<typeof SiteExplorerPagesHistoryOutputSchema>;
	siteExplorerReferringDomainsHistory: z.infer<typeof SiteExplorerReferringDomainsHistoryOutputSchema>;
	siteExplorerTopPages: z.infer<typeof SiteExplorerTopPagesOutputSchema>;
	siteExplorerLinkedDomains: z.infer<typeof SiteExplorerLinkedDomainsOutputSchema>;
	// Keywords Explorer
	keywordsExplorerOverview: z.infer<typeof KeywordsExplorerOverviewOutputSchema>;
	keywordsExplorerVolumeByCountry: z.infer<typeof KeywordsExplorerVolumeByCountryOutputSchema>;
	keywordsExplorerMatchingTerms: z.infer<typeof KeywordsExplorerMatchingTermsOutputSchema>;
	keywordsExplorerTotalSearchVolumeHistory: z.infer<typeof KeywordsExplorerTotalSearchVolumeHistoryOutputSchema>;
	keywordsExplorerRelatedTerms: z.infer<typeof KeywordsExplorerRelatedTermsOutputSchema>;
	keywordsExplorerVolumeHistory: z.infer<typeof KeywordsExplorerVolumeHistoryOutputSchema>;
	keywordsExplorerSearchSuggestions: z.infer<typeof KeywordsExplorerSearchSuggestionsOutputSchema>;
	// Rank Tracker
	rankTrackerCompetitorsOverview: z.infer<typeof RankTrackerCompetitorsOverviewOutputSchema>;
	rankTrackerOverview: z.infer<typeof RankTrackerOverviewOutputSchema>;
	// SERP
	serpOverview: z.infer<typeof SerpOverviewOutputSchema>;
	// Site Audit
	siteAuditProjects: z.infer<typeof SiteAuditProjectsOutputSchema>;
	// Subscription
	subscriptionLimitsAndUsage: z.infer<typeof SubscriptionLimitsAndUsageOutputSchema>;
	// Crawler
	crawlerIpRanges: z.infer<typeof CrawlerIpRangesOutputSchema>;
	crawlerPublicIps: z.infer<typeof CrawlerPublicIpsOutputSchema>;
};

export const AhrefsEndpointInputSchemas = {
	// Site Explorer
	siteExplorerBacklinksStats: SiteExplorerBacklinksStatsInputSchema,
	siteExplorerBatchUrlAnalysis: SiteExplorerBatchUrlAnalysisInputSchema,
	siteExplorerDomainRating: SiteExplorerDomainRatingInputSchema,
	siteExplorerDomainRatingHistory: SiteExplorerDomainRatingHistoryInputSchema,
	siteExplorerAllBacklinks: SiteExplorerAllBacklinksInputSchema,
	siteExplorerBrokenBacklinks: SiteExplorerBrokenBacklinksInputSchema,
	siteExplorerReferringDomains: SiteExplorerReferringDomainsInputSchema,
	siteExplorerCountryMetrics: SiteExplorerCountryMetricsInputSchema,
	siteExplorerLinkedAnchorsExternal: SiteExplorerLinkedAnchorsExternalInputSchema,
	siteExplorerUrlRatingHistory: SiteExplorerUrlRatingHistoryInputSchema,
	siteExplorerLinkedAnchors: SiteExplorerLinkedAnchorsInputSchema,
	siteExplorerBestByExternalLinks: SiteExplorerBestByExternalLinksInputSchema,
	siteExplorerPagesByTraffic: SiteExplorerPagesByTrafficInputSchema,
	siteExplorerAnchorData: SiteExplorerAnchorDataInputSchema,
	siteExplorerBestByInternalLinks: SiteExplorerBestByInternalLinksInputSchema,
	siteExplorerOrganicCompetitors: SiteExplorerOrganicCompetitorsInputSchema,
	siteExplorerOrganicKeywords: SiteExplorerOrganicKeywordsInputSchema,
	siteExplorerOutlinksStats: SiteExplorerOutlinksStatsInputSchema,
	siteExplorerPaidPages: SiteExplorerPaidPagesInputSchema,
	siteExplorerKeywordsHistory: SiteExplorerKeywordsHistoryInputSchema,
	siteExplorerMetrics: SiteExplorerMetricsInputSchema,
	siteExplorerMetricsHistory: SiteExplorerMetricsHistoryInputSchema,
	siteExplorerPagesHistory: SiteExplorerPagesHistoryInputSchema,
	siteExplorerReferringDomainsHistory: SiteExplorerReferringDomainsHistoryInputSchema,
	siteExplorerTopPages: SiteExplorerTopPagesInputSchema,
	siteExplorerLinkedDomains: SiteExplorerLinkedDomainsInputSchema,
	// Keywords Explorer
	keywordsExplorerOverview: KeywordsExplorerOverviewInputSchema,
	keywordsExplorerVolumeByCountry: KeywordsExplorerVolumeByCountryInputSchema,
	keywordsExplorerMatchingTerms: KeywordsExplorerMatchingTermsInputSchema,
	keywordsExplorerTotalSearchVolumeHistory: KeywordsExplorerTotalSearchVolumeHistoryInputSchema,
	keywordsExplorerRelatedTerms: KeywordsExplorerRelatedTermsInputSchema,
	keywordsExplorerVolumeHistory: KeywordsExplorerVolumeHistoryInputSchema,
	keywordsExplorerSearchSuggestions: KeywordsExplorerSearchSuggestionsInputSchema,
	// Rank Tracker
	rankTrackerCompetitorsOverview: RankTrackerCompetitorsOverviewInputSchema,
	rankTrackerOverview: RankTrackerOverviewInputSchema,
	// SERP
	serpOverview: SerpOverviewInputSchema,
	// Site Audit
	siteAuditProjects: SiteAuditProjectsInputSchema,
	// Subscription
	subscriptionLimitsAndUsage: SubscriptionLimitsAndUsageInputSchema,
	// Crawler
	crawlerIpRanges: CrawlerIpRangesInputSchema,
	crawlerPublicIps: CrawlerPublicIpsInputSchema,
} as const;

export const AhrefsEndpointOutputSchemas = {
	// Site Explorer
	siteExplorerBacklinksStats: SiteExplorerBacklinksStatsOutputSchema,
	siteExplorerBatchUrlAnalysis: SiteExplorerBatchUrlAnalysisOutputSchema,
	siteExplorerDomainRating: SiteExplorerDomainRatingOutputSchema,
	siteExplorerDomainRatingHistory: SiteExplorerDomainRatingHistoryOutputSchema,
	siteExplorerAllBacklinks: SiteExplorerAllBacklinksOutputSchema,
	siteExplorerBrokenBacklinks: SiteExplorerBrokenBacklinksOutputSchema,
	siteExplorerReferringDomains: SiteExplorerReferringDomainsOutputSchema,
	siteExplorerCountryMetrics: SiteExplorerCountryMetricsOutputSchema,
	siteExplorerLinkedAnchorsExternal: SiteExplorerLinkedAnchorsExternalOutputSchema,
	siteExplorerUrlRatingHistory: SiteExplorerUrlRatingHistoryOutputSchema,
	siteExplorerLinkedAnchors: SiteExplorerLinkedAnchorsOutputSchema,
	siteExplorerBestByExternalLinks: SiteExplorerBestByExternalLinksOutputSchema,
	siteExplorerPagesByTraffic: SiteExplorerPagesByTrafficOutputSchema,
	siteExplorerAnchorData: SiteExplorerAnchorDataOutputSchema,
	siteExplorerBestByInternalLinks: SiteExplorerBestByInternalLinksOutputSchema,
	siteExplorerOrganicCompetitors: SiteExplorerOrganicCompetitorsOutputSchema,
	siteExplorerOrganicKeywords: SiteExplorerOrganicKeywordsOutputSchema,
	siteExplorerOutlinksStats: SiteExplorerOutlinksStatsOutputSchema,
	siteExplorerPaidPages: SiteExplorerPaidPagesOutputSchema,
	siteExplorerKeywordsHistory: SiteExplorerKeywordsHistoryOutputSchema,
	siteExplorerMetrics: SiteExplorerMetricsOutputSchema,
	siteExplorerMetricsHistory: SiteExplorerMetricsHistoryOutputSchema,
	siteExplorerPagesHistory: SiteExplorerPagesHistoryOutputSchema,
	siteExplorerReferringDomainsHistory: SiteExplorerReferringDomainsHistoryOutputSchema,
	siteExplorerTopPages: SiteExplorerTopPagesOutputSchema,
	siteExplorerLinkedDomains: SiteExplorerLinkedDomainsOutputSchema,
	// Keywords Explorer
	keywordsExplorerOverview: KeywordsExplorerOverviewOutputSchema,
	keywordsExplorerVolumeByCountry: KeywordsExplorerVolumeByCountryOutputSchema,
	keywordsExplorerMatchingTerms: KeywordsExplorerMatchingTermsOutputSchema,
	keywordsExplorerTotalSearchVolumeHistory: KeywordsExplorerTotalSearchVolumeHistoryOutputSchema,
	keywordsExplorerRelatedTerms: KeywordsExplorerRelatedTermsOutputSchema,
	keywordsExplorerVolumeHistory: KeywordsExplorerVolumeHistoryOutputSchema,
	keywordsExplorerSearchSuggestions: KeywordsExplorerSearchSuggestionsOutputSchema,
	// Rank Tracker
	rankTrackerCompetitorsOverview: RankTrackerCompetitorsOverviewOutputSchema,
	rankTrackerOverview: RankTrackerOverviewOutputSchema,
	// SERP
	serpOverview: SerpOverviewOutputSchema,
	// Site Audit
	siteAuditProjects: SiteAuditProjectsOutputSchema,
	// Subscription
	subscriptionLimitsAndUsage: SubscriptionLimitsAndUsageOutputSchema,
	// Crawler
	crawlerIpRanges: CrawlerIpRangesOutputSchema,
	crawlerPublicIps: CrawlerPublicIpsOutputSchema,
} as const;

// ── Named response types for export ──────────────────────────────────────────

export type SiteExplorerBacklinksStatsResponse = AhrefsEndpointOutputs['siteExplorerBacklinksStats'];
export type SiteExplorerBatchUrlAnalysisResponse = AhrefsEndpointOutputs['siteExplorerBatchUrlAnalysis'];
export type SiteExplorerDomainRatingResponse = AhrefsEndpointOutputs['siteExplorerDomainRating'];
export type SiteExplorerDomainRatingHistoryResponse = AhrefsEndpointOutputs['siteExplorerDomainRatingHistory'];
export type SiteExplorerAllBacklinksResponse = AhrefsEndpointOutputs['siteExplorerAllBacklinks'];
export type SiteExplorerBrokenBacklinksResponse = AhrefsEndpointOutputs['siteExplorerBrokenBacklinks'];
export type SiteExplorerReferringDomainsResponse = AhrefsEndpointOutputs['siteExplorerReferringDomains'];
export type SiteExplorerCountryMetricsResponse = AhrefsEndpointOutputs['siteExplorerCountryMetrics'];
export type SiteExplorerLinkedAnchorsExternalResponse = AhrefsEndpointOutputs['siteExplorerLinkedAnchorsExternal'];
export type SiteExplorerUrlRatingHistoryResponse = AhrefsEndpointOutputs['siteExplorerUrlRatingHistory'];
export type SiteExplorerLinkedAnchorsResponse = AhrefsEndpointOutputs['siteExplorerLinkedAnchors'];
export type SiteExplorerBestByExternalLinksResponse = AhrefsEndpointOutputs['siteExplorerBestByExternalLinks'];
export type SiteExplorerPagesByTrafficResponse = AhrefsEndpointOutputs['siteExplorerPagesByTraffic'];
export type SiteExplorerAnchorDataResponse = AhrefsEndpointOutputs['siteExplorerAnchorData'];
export type SiteExplorerBestByInternalLinksResponse = AhrefsEndpointOutputs['siteExplorerBestByInternalLinks'];
export type SiteExplorerOrganicCompetitorsResponse = AhrefsEndpointOutputs['siteExplorerOrganicCompetitors'];
export type SiteExplorerOrganicKeywordsResponse = AhrefsEndpointOutputs['siteExplorerOrganicKeywords'];
export type SiteExplorerOutlinksStatsResponse = AhrefsEndpointOutputs['siteExplorerOutlinksStats'];
export type SiteExplorerPaidPagesResponse = AhrefsEndpointOutputs['siteExplorerPaidPages'];
export type SiteExplorerKeywordsHistoryResponse = AhrefsEndpointOutputs['siteExplorerKeywordsHistory'];
export type SiteExplorerMetricsResponse = AhrefsEndpointOutputs['siteExplorerMetrics'];
export type SiteExplorerMetricsHistoryResponse = AhrefsEndpointOutputs['siteExplorerMetricsHistory'];
export type SiteExplorerPagesHistoryResponse = AhrefsEndpointOutputs['siteExplorerPagesHistory'];
export type SiteExplorerReferringDomainsHistoryResponse = AhrefsEndpointOutputs['siteExplorerReferringDomainsHistory'];
export type SiteExplorerTopPagesResponse = AhrefsEndpointOutputs['siteExplorerTopPages'];
export type SiteExplorerLinkedDomainsResponse = AhrefsEndpointOutputs['siteExplorerLinkedDomains'];
export type KeywordsExplorerOverviewResponse = AhrefsEndpointOutputs['keywordsExplorerOverview'];
export type KeywordsExplorerVolumeByCountryResponse = AhrefsEndpointOutputs['keywordsExplorerVolumeByCountry'];
export type KeywordsExplorerMatchingTermsResponse = AhrefsEndpointOutputs['keywordsExplorerMatchingTerms'];
export type KeywordsExplorerTotalSearchVolumeHistoryResponse = AhrefsEndpointOutputs['keywordsExplorerTotalSearchVolumeHistory'];
export type KeywordsExplorerRelatedTermsResponse = AhrefsEndpointOutputs['keywordsExplorerRelatedTerms'];
export type KeywordsExplorerVolumeHistoryResponse = AhrefsEndpointOutputs['keywordsExplorerVolumeHistory'];
export type KeywordsExplorerSearchSuggestionsResponse = AhrefsEndpointOutputs['keywordsExplorerSearchSuggestions'];
export type RankTrackerCompetitorsOverviewResponse = AhrefsEndpointOutputs['rankTrackerCompetitorsOverview'];
export type RankTrackerOverviewResponse = AhrefsEndpointOutputs['rankTrackerOverview'];
export type SerpOverviewResponse = AhrefsEndpointOutputs['serpOverview'];
export type SiteAuditProjectsResponse = AhrefsEndpointOutputs['siteAuditProjects'];
export type SubscriptionLimitsAndUsageResponse = AhrefsEndpointOutputs['subscriptionLimitsAndUsage'];
export type CrawlerIpRangesResponse = AhrefsEndpointOutputs['crawlerIpRanges'];
export type CrawlerPublicIpsResponse = AhrefsEndpointOutputs['crawlerPublicIps'];
