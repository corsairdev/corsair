import { z } from 'zod';

// Shapes come from the method pages' embedded JSON Schema at
// https://moz.com/api/docs (moz.com/api/docs/methods/*). Every response
// object is `.loose()` and optional response fields are `.nullish()`
// because providers send JSON null.

// ── Shared pieces ──────────────────────────────────────────────────────────

const MozScopeSchema = z.enum(['domain', 'subdomain', 'subfolder', 'url']);

const SiteQueryInputSchema = z.object({
	query: z.string().min(1).describe('A URL to query for.'),
	scope: MozScopeSchema.describe(
		'The scope to parse the query with. Providing a less detailed scope than the provided URL will alter the input, e.g. moz.com/foo/bar with a scope of domain resolves to moz.com.',
	),
});

export type SiteQueryInput = z.input<typeof SiteQueryInputSchema>;

const SiteQuerySuggestionSchema = z
	.object({
		query: z.string(),
		scope: MozScopeSchema,
		explanation: z.string(),
		issue: z.string(),
	})
	.loose();

/**
 * The parsed site query every site method echoes back: the original query,
 * what Moz resolved it to, and an optional suggestion for a better target.
 */
const SiteQueryResultSchema = z
	.object({
		query: z.string(),
		scope: MozScopeSchema,
		original_site_query: z
			.object({ query: z.string(), scope: MozScopeSchema })
			.loose(),
		site_query_suggestion: SiteQuerySuggestionSchema.nullish(),
	})
	.loose();

export type SiteQueryResult = z.infer<typeof SiteQueryResultSchema>;

const OffsetInputSchema = z.object({
	token: z
		.string()
		.min(1)
		.optional()
		.describe(
			'The next-page token from the previous request. Exclude or provide null to start at the beginning of a set of results.',
		),
	limit: z
		.number()
		.int()
		.min(1)
		.max(50)
		.optional()
		.describe('The number of results to return. Must be between 1 and 50.'),
});

export type OffsetInput = z.input<typeof OffsetInputSchema>;

const OffsetResultSchema = z
	.object({
		provided_token: z.string().nullish(),
		token: z
			.string()
			.nullish()
			.describe(
				'The next token for more results. Null when not available; pass it as offset.token on the next call.',
			),
		limit: z.number(),
	})
	.loose();

export type OffsetResult = z.infer<typeof OffsetResultSchema>;

// ── Site metrics (the DA/PA/Spam Score object) ─────────────────────────────

const SiteMetricsSchema = z
	.object({
		page: z.string(),
		subdomain: z.string(),
		root_domain: z.string(),
		title: z.string(),
		last_crawled: z.string(),
		http_code: z.number(),
		pages_to_page: z.number(),
		nofollow_pages_to_page: z.number(),
		redirect_pages_to_page: z.number(),
		external_pages_to_page: z.number(),
		external_nofollow_pages_to_page: z.number(),
		external_redirect_pages_to_page: z.number(),
		deleted_pages_to_page: z.number(),
		root_domains_to_page: z.number(),
		indirect_root_domains_to_page: z.number(),
		deleted_root_domains_to_page: z.number(),
		nofollow_root_domains_to_page: z.number(),
		pages_to_subdomain: z.number(),
		nofollow_pages_to_subdomain: z.number(),
		redirect_pages_to_subdomain: z.number(),
		external_pages_to_subdomain: z.number(),
		external_nofollow_pages_to_subdomain: z.number(),
		external_redirect_pages_to_subdomain: z.number(),
		deleted_pages_to_subdomain: z.number(),
		root_domains_to_subdomain: z.number(),
		deleted_root_domains_to_subdomain: z.number(),
		nofollow_root_domains_to_subdomain: z.number(),
		pages_to_root_domain: z.number(),
		nofollow_pages_to_root_domain: z.number(),
		redirect_pages_to_root_domain: z.number(),
		external_pages_to_root_domain: z.number(),
		external_indirect_pages_to_root_domain: z.number(),
		external_nofollow_pages_to_root_domain: z.number(),
		external_redirect_pages_to_root_domain: z.number(),
		deleted_pages_to_root_domain: z.number(),
		root_domains_to_root_domain: z.number(),
		indirect_root_domains_to_root_domain: z.number(),
		deleted_root_domains_to_root_domain: z.number(),
		nofollow_root_domains_to_root_domain: z.number(),
		page_authority: z.number(),
		domain_authority: z.number(),
		link_propensity: z.number(),
		spam_score: z.number(),
		root_domains_from_page: z.number(),
		nofollow_root_domains_from_page: z.number(),
		pages_from_page: z.number(),
		nofollow_pages_from_page: z.number(),
		root_domains_from_root_domain: z.number(),
		nofollow_root_domains_from_root_domain: z.number(),
		pages_from_root_domain: z.number(),
		nofollow_pages_from_root_domain: z.number(),
		pages_crawled_from_root_domain: z.number(),
	})
	.loose();

export type SiteMetrics = z.infer<typeof SiteMetricsSchema>;

// ── Async call receipt (competitor.fetch and jobs.lookup) ──────────────────

const AsyncStatusSchema = z.enum(['pending', 'processing', 'complete']);

/**
 * A failure that happened after Moz accepted the work: the lookup answers
 * 200 and the error rides inside the completed async_call instead of the
 * envelope. Same shape as a top-level error member.
 */
const AsyncErrorSchema = z
	.object({
		message: z.string(),
		code: z.number(),
		status: z.number(),
		data: z
			.object({
				explanation: z.string().optional(),
				issue: z.string().optional(),
				key: z.string().optional(),
				// unknown: the guide says value is "where echoing it back is
				// useful", which can be any JSON value.
				value: z.unknown().optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

const AsyncCallSchema = z
	.object({
		id: z.string(),
		action: z.string(),
		status: AsyncStatusSchema,
		ttl: z.number(),
		// unknown: the result shape depends on which async method started the
		// call; each caller narrows it (competitors.read parses competitors).
		result: z.unknown().nullish(),
		error: AsyncErrorSchema.nullish(),
	})
	.loose();

export type AsyncCall = z.infer<typeof AsyncCallSchema>;

// ── quota.lookup ────────────────────────────────────────────────────────────

const QuotaPathSchema = z.enum([
	'api.limits.mozscape.rows',
	'api.limits.data.rows',
	'api.limits.beta.rows',
]);

const QuotaLookupInputSchema = z.object({
	path: QuotaPathSchema.describe(
		'The quota to look up: api.limits.mozscape.rows (competitor fetches), api.limits.data.rows (everything else) or api.limits.beta.rows (beta methods).',
	),
});

export type QuotaLookupInput = z.input<typeof QuotaLookupInputSchema>;

const QuotaLookupResponseSchema = z
	.object({
		quota: z
			.object({
				path: z.string(),
				account_id: z.number(),
				allotted: z.number(),
				used: z.number(),
				report: z.enum(['month', 'week', 'day', 'hour', 'minute']),
				reset: z.enum(['never', 'month', 'week', 'day', 'hour', 'minute']),
				overage: z.boolean(),
				period_start: z.number().nullish(),
				period_reset: z.number().nullish(),
			})
			.loose(),
	})
	.loose();

export type QuotaLookupResponse = z.infer<typeof QuotaLookupResponseSchema>;

// ── locales.list ────────────────────────────────────────────────────────────

const EngineSchema = z.enum(['google', 'bing', 'yahoo']);

const LocalesListInputSchema = z.object({
	engine: EngineSchema.describe(
		'The search engine to list supported locales for; each engine supports a different set.',
	),
});

export type LocalesListInput = z.input<typeof LocalesListInputSchema>;

const LocalesListResponseSchema = z
	.object({
		engine: EngineSchema,
		locales: z
			.array(z.string())
			.describe(
				'Every locale the engine supports, e.g. en-US; some have a regional variant such as es-419-AR.',
			),
	})
	.loose();

export type LocalesListResponse = z.infer<typeof LocalesListResponseSchema>;

// ── metrics.fetch ───────────────────────────────────────────────────────────

const MetricsFetchInputSchema = z.object({
	site_query: SiteQueryInputSchema,
});

export type MetricsFetchInput = z.input<typeof MetricsFetchInputSchema>;

const MetricsFetchResponseSchema = z
	.object({
		site_query: SiteQueryResultSchema,
		site_metrics: SiteMetricsSchema,
	})
	.loose();

export type MetricsFetchResponse = z.infer<typeof MetricsFetchResponseSchema>;

// ── metrics.fetchMultiple ───────────────────────────────────────────────────

const MetricsFetchMultipleInputSchema = z.object({
	site_queries: z
		.array(SiteQueryInputSchema)
		.min(1)
		.describe('The targets to fetch metrics for, one or more.'),
});

export type MetricsFetchMultipleInput = z.input<
	typeof MetricsFetchMultipleInputSchema
>;

// A per-target failure keeps the per-target query and reports why it failed;
// field names differ from the top-level error envelope (httpStatus and
// jsonrpcCode instead of status and code).
const SiteErrorSchema = z
	.object({
		message: z.string(),
		name: z.string(),
		data: z
			.object({
				key: z.string().optional(),
				value: z.string().optional(),
			})
			.loose()
			.optional(),
		httpStatus: z.number(),
		jsonrpcCode: z.number(),
	})
	.loose();

const MetricsFetchMultipleResponseSchema = z
	.object({
		results_by_site: z
			.array(
				z
					.object({
						site_query: SiteQueryResultSchema,
						site_metrics: SiteMetricsSchema,
					})
					.loose(),
			)
			.describe('The fetched metrics for the targets that succeeded.'),
		errors_by_site: z
			.array(
				z
					.object({
						site_query: SiteQueryResultSchema,
						error: SiteErrorSchema,
					})
					.loose(),
			)
			.describe('The targets that failed, each with the reason.'),
	})
	.loose();

export type MetricsFetchMultipleResponse = z.infer<
	typeof MetricsFetchMultipleResponseSchema
>;

// ── links.list ──────────────────────────────────────────────────────────────

const LinkListSortSchema = z.enum([
	'root_domains_to_source_root_domain',
	'root_domains_to_source_page',
	'source_page_authority',
	'source_domain_authority',
	'source_link_propensity',
	'source_spam_score',
]);

const LinkFilterSchema = z.enum([
	'external',
	'follow',
	'nofollow',
	'deleted',
	'not_deleted',
	'redirect',
	'not_redirect',
	'rel_canonical',
	'not_rel_canonical',
	'via_redirect',
	'not_via_redirect',
	'via_rel_canonical',
	'not_via_rel_canonical',
	'gained_last_60_days',
	'lost_last_60_days',
]);

const LinkListOptionsInputSchema = z
	.object({
		scope: z
			.enum(['subdomain', 'domain', 'page'])
			.optional()
			.describe(
				'Return only the best link from each source at this scope, ordered by sort. The default is page.',
			),
		subdomains_limited_to_one: z
			.array(z.string())
			.optional()
			.describe(
				'Return at most one link (the top link per sort) from each of these subdomains. Requires sort when set.',
			),
		sort: LinkListSortSchema.optional(),
		filters: z.array(LinkFilterSchema).optional(),
	})
	.superRefine((value, ctx) => {
		if (value.subdomains_limited_to_one !== undefined && !value.sort) {
			ctx.addIssue({
				code: 'custom',
				path: ['sort'],
				message: 'sort is required when subdomains_limited_to_one is set.',
			});
		}
	});

export type LinkListOptionsInput = z.input<typeof LinkListOptionsInputSchema>;

const LinkListInputSchema = z.object({
	site_query: SiteQueryInputSchema,
	options: LinkListOptionsInputSchema.optional(),
	offset: OffsetInputSchema.optional(),
});

export type LinkListInput = z.input<typeof LinkListInputSchema>;

const LinkItemSchema = z
	.object({
		source_site_metrics: SiteMetricsSchema,
		target_site_metrics: SiteMetricsSchema,
		anchor_text: z.string(),
		date_first_seen: z.string(),
		date_last_seen: z.string(),
		// The guide types this string | null; the live example shows "" when
		// the link is still present, so accept both.
		date_disappeared: z.string().nullish(),
		nofollow: z.boolean(),
		redirect: z.boolean(),
		rel_canonical: z.boolean(),
		via_redirect: z.boolean(),
		via_rel_canonical: z.boolean(),
	})
	.loose();

export type LinkItem = z.infer<typeof LinkItemSchema>;

const LinkListResponseSchema = z
	.object({
		site_query: SiteQueryResultSchema,
		offset: OffsetResultSchema,
		links: z.array(LinkItemSchema),
		options: z
			.object({
				scope: z.enum(['subdomain', 'domain', 'page']).optional(),
				subdomains_limited_to_one: z.array(z.string()).optional(),
				sort: LinkListSortSchema.optional(),
				filters: z.array(LinkFilterSchema).optional(),
			})
			.loose(),
	})
	.loose();

export type LinkListResponse = z.infer<typeof LinkListResponseSchema>;

// ── linkingDomains.list ─────────────────────────────────────────────────────

const LinkingDomainSortSchema = z.enum([
	'source_domain_authority',
	'source_link_propensity',
	'source_spam_score',
]);

const LinkingDomainFilterSchema = z.enum([
	'external',
	'follow',
	'nofollow',
	'deleted',
	'not_deleted',
]);

const LinkingDomainOptionsInputSchema = z
	.object({
		sort: LinkingDomainSortSchema.optional(),
		filters: z.array(LinkingDomainFilterSchema).optional(),
	})
	.superRefine((value, ctx) => {
		// Documented rule: with several filters, `external` must be one of
		// them; a single non-external filter is accepted as-is.
		if (value.filters !== undefined && value.filters.length > 1) {
			if (!value.filters.includes('external')) {
				ctx.addIssue({
					code: 'custom',
					path: ['filters'],
					message: 'external must be included when providing multiple filters.',
				});
			}
		}
	});

export type LinkingDomainOptionsInput = z.input<
	typeof LinkingDomainOptionsInputSchema
>;

const LinkingDomainListInputSchema = z.object({
	site_query: SiteQueryInputSchema,
	options: LinkingDomainOptionsInputSchema.optional(),
	offset: OffsetInputSchema.optional(),
});

export type LinkingDomainListInput = z.input<
	typeof LinkingDomainListInputSchema
>;

const LinkingDomainItemSchema = z
	.object({
		site_metrics: SiteMetricsSchema,
		link_propensity: z.number(),
		targeted_pages: z.number(),
		targeted_nofollow_pages: z.number(),
	})
	.loose();

export type LinkingDomainItem = z.infer<typeof LinkingDomainItemSchema>;

const LinkingDomainListResponseSchema = z
	.object({
		site_query: SiteQueryResultSchema,
		offset: OffsetResultSchema,
		linking_domains: z.array(LinkingDomainItemSchema),
		options: z
			.object({
				sort: LinkingDomainSortSchema.optional(),
				filters: z.array(LinkingDomainFilterSchema).optional(),
			})
			.loose(),
	})
	.loose();

export type LinkingDomainListResponse = z.infer<
	typeof LinkingDomainListResponseSchema
>;

// ── anchorText.list ─────────────────────────────────────────────────────────

const AnchorTextListInputSchema = z.object({
	site_query: SiteQueryInputSchema,
	offset: OffsetInputSchema.optional(),
});

export type AnchorTextListInput = z.input<typeof AnchorTextListInputSchema>;

const AnchorTextItemSchema = z
	.object({
		text: z
			.string()
			.describe(
				'The anchor text after normalisation: HTML tags stripped, whitespace collapsed, lowercase. The null character (\\u0000) requests links with no anchor text.',
			),
		external_root_domains: z.number(),
		external_pages: z.number(),
	})
	.loose();

export type AnchorTextItem = z.infer<typeof AnchorTextItemSchema>;

const AnchorTextListResponseSchema = z
	.object({
		site_query: SiteQueryResultSchema,
		offset: OffsetResultSchema,
		anchor_texts: z.array(AnchorTextItemSchema),
	})
	.loose();

export type AnchorTextListResponse = z.infer<
	typeof AnchorTextListResponseSchema
>;

// ── topPages.list ───────────────────────────────────────────────────────────

const TopPageInputSchema = z.object({
	query: z.string().min(1).describe('A URL to query for.'),
	scope: z
		.enum(['domain', 'subdomain'])
		.describe('Top pages supports only the domain and subdomain scopes.'),
});

export type TopPageQueryInput = z.input<typeof TopPageInputSchema>;

const TopPageOptionsInputSchema = z
	.object({
		filter: z
			.enum([
				'all',
				'status_200',
				'status_301',
				'status_302',
				'status_4xx',
				'status_5xx',
			])
			.optional(),
		sort: z
			.enum([
				'page_authority',
				'root_domains_to_page',
				'external_pages_to_page',
			])
			.optional(),
	})
	.loose();

export type TopPageOptionsInput = z.input<typeof TopPageOptionsInputSchema>;

const TopPageListInputSchema = z.object({
	site_query: TopPageInputSchema,
	options: TopPageOptionsInputSchema.optional(),
	offset: OffsetInputSchema.optional(),
});

export type TopPageListInput = z.input<typeof TopPageListInputSchema>;

const TopPageListResponseSchema = z
	.object({
		site_query: SiteQueryResultSchema,
		offset: OffsetResultSchema,
		options: z
			.object({
				filter: z
					.enum([
						'all',
						'status_200',
						'status_301',
						'status_302',
						'status_4xx',
						'status_5xx',
					])
					.optional(),
				sort: z
					.enum([
						'page_authority',
						'root_domains_to_page',
						'external_pages_to_page',
					])
					.optional(),
			})
			.loose(),
		top_pages: z.array(SiteMetricsSchema),
	})
	.loose();

export type TopPageListResponse = z.infer<typeof TopPageListResponseSchema>;

// ── competitors.fetch (async job) ───────────────────────────────────────────

const CompetitorTargetQueryInputSchema = z.object({
	query: z.string().min(1).describe('A URL to query for.'),
	scope: z
		.enum(['domain', 'subdomain', 'subfolder'])
		.describe('Competitor fetches support only these scopes.'),
	locale: z
		.enum(['en-US', 'en-GB', 'en-CA', 'en-AU'])
		.describe(
			'The locale to search in; only a limited subset of locales is supported for target queries.',
		),
});

export type CompetitorTargetQueryInput = z.input<
	typeof CompetitorTargetQueryInputSchema
>;

const CompetitorsFetchInputSchema = z.object({
	target_query: CompetitorTargetQueryInputSchema,
});

export type CompetitorsFetchInput = z.input<typeof CompetitorsFetchInputSchema>;

const CompetitorItemSchema = z
	.object({
		domain: z.string(),
		domain_authority: z.number(),
		proximity: z.number(),
		overlap: z.number(),
		relevance: z.number(),
		rivalry: z.number(),
		keywords: z.array(z.string()),
	})
	.loose();

export type CompetitorItem = z.infer<typeof CompetitorItemSchema>;

const CompetitorsResultSchema = z
	.object({
		target_query: z
			.object({
				query: z.string(),
				scope: z.enum(['domain', 'subdomain', 'subfolder', 'url']),
				locale: z.enum(['en-US', 'en-GB', 'en-CA', 'en-AU']),
				original_target_query: z
					.object({
						query: z.string(),
						scope: z.enum(['domain', 'subdomain', 'subfolder', 'url']),
						locale: z.enum(['en-US', 'en-GB', 'en-CA', 'en-AU']),
					})
					.loose(),
				suggestion: z
					.object({
						query: z.string(),
						scope: z.enum(['domain', 'subdomain', 'subfolder', 'url']),
						locale: z.enum(['en-US', 'en-GB', 'en-CA', 'en-AU']),
						explanation: z.string(),
						issue: z.string(),
					})
					.loose()
					.nullish(),
			})
			.loose(),
		competitors: z
			.array(CompetitorItemSchema)
			.describe('The ranking competitors, sorted by rivalry descending.'),
	})
	.loose();

export type CompetitorsResult = z.infer<typeof CompetitorsResultSchema>;

const CompetitorsFetchResponseSchema = z
	.object({
		async_call: AsyncCallSchema,
	})
	.loose();

export type CompetitorsFetchResponse = z.infer<
	typeof CompetitorsFetchResponseSchema
>;

// ── links.intersect ─────────────────────────────────────────────────────────

const LinkIntersectOptionsInputSchema = z
	.object({
		minimum_matching_targets: z
			.number()
			.int()
			.min(1)
			.optional()
			.describe(
				'The minimum number of positive targets a result must match, between 1 and the length of is_linking_to. Blank means 1.',
			),
		scope: z.enum(['page', 'domain']).optional(),
		sort: z
			.enum([
				'matching_target_count',
				'source_spam_score',
				'source_domain_authority',
			])
			.optional(),
	})
	.loose();

export type LinkIntersectOptionsInput = z.input<
	typeof LinkIntersectOptionsInputSchema
>;

const LinkIntersectInputSchema = z
	.object({
		is_linking_to: z
			.array(SiteQueryInputSchema)
			.min(1)
			.describe(
				'Get sources that link to at least one of these sites, or more if minimum_matching_targets is set.',
			),
		not_linking_to: z
			.array(SiteQueryInputSchema)
			.optional()
			.describe(
				'Optionally, ensure that the returned sources do not link to any of these sites.',
			),
		options: LinkIntersectOptionsInputSchema.optional(),
		offset: OffsetInputSchema.optional(),
	})
	.superRefine((value, ctx) => {
		const total =
			value.is_linking_to.length + (value.not_linking_to?.length ?? 0);
		if (total > 6) {
			ctx.addIssue({
				code: 'custom',
				path: ['is_linking_to'],
				message:
					'Up to 6 total targets may be specified in is_linking_to and not_linking_to combined.',
			});
		}
		const minimum = value.options?.minimum_matching_targets;
		if (minimum !== undefined && minimum > value.is_linking_to.length) {
			ctx.addIssue({
				code: 'custom',
				path: ['options', 'minimum_matching_targets'],
				message:
					'minimum_matching_targets can be at most the length of is_linking_to.',
			});
		}
	});

export type LinkIntersectInput = z.input<typeof LinkIntersectInputSchema>;

const LinkIntersectResponseSchema = z
	.object({
		is_linking_to: z.array(SiteQueryResultSchema),
		not_linking_to: z.array(SiteQueryResultSchema),
		options: z
			.object({
				minimum_matching_targets: z.number().nullish(),
				scope: z.enum(['page', 'domain']).optional(),
				sort: z
					.enum([
						'matching_target_count',
						'source_spam_score',
						'source_domain_authority',
					])
					.optional(),
			})
			.loose(),
		offset: OffsetResultSchema,
		link_intersects: z
			.array(
				z
					.object({
						page: z.string(),
						title: z.string(),
						domain_authority: z.number(),
						spam_score: z.number(),
						matching_target_indexes: z.array(z.number()).optional(),
						matching_source_pages: z
							.array(
								z
									.object({
										page: z.string(),
										page_authority: z.number(),
									})
									.loose(),
							)
							.optional(),
					})
					.loose(),
			)
			.describe('Sources matching the intersect, one entry per source page.'),
	})
	.loose();

export type LinkIntersectResponse = z.infer<typeof LinkIntersectResponseSchema>;

// ── jobs.lookup ─────────────────────────────────────────────────────────────

const JobsLookupInputSchema = z.object({
	id: z
		.string()
		.min(1)
		.describe(
			'The async_call.id returned by the asynchronous action that started the request.',
		),
});

export type JobsLookupInput = z.input<typeof JobsLookupInputSchema>;

const JobsLookupResponseSchema = z
	.object({
		async_call: AsyncCallSchema,
	})
	.loose();

export type JobsLookupResponse = z.infer<typeof JobsLookupResponseSchema>;

// ── Registry ────────────────────────────────────────────────────────────────

export type MozEndpointInputs = {
	quotaLookup: QuotaLookupInput;
	localesList: LocalesListInput;
	metricsFetch: MetricsFetchInput;
	metricsFetchMultiple: MetricsFetchMultipleInput;
	linksList: LinkListInput;
	linksIntersect: LinkIntersectInput;
	linkingDomainsList: LinkingDomainListInput;
	anchorTextList: AnchorTextListInput;
	topPagesList: TopPageListInput;
	competitorsFetch: CompetitorsFetchInput;
	jobsLookup: JobsLookupInput;
};

export type MozEndpointOutputs = {
	quotaLookup: QuotaLookupResponse;
	localesList: LocalesListResponse;
	metricsFetch: MetricsFetchResponse;
	metricsFetchMultiple: MetricsFetchMultipleResponse;
	linksList: LinkListResponse;
	linksIntersect: LinkIntersectResponse;
	linkingDomainsList: LinkingDomainListResponse;
	anchorTextList: AnchorTextListResponse;
	topPagesList: TopPageListResponse;
	competitorsFetch: CompetitorsFetchResponse;
	jobsLookup: JobsLookupResponse;
};

export const MozEndpointInputSchemas = {
	quotaLookup: QuotaLookupInputSchema,
	localesList: LocalesListInputSchema,
	metricsFetch: MetricsFetchInputSchema,
	metricsFetchMultiple: MetricsFetchMultipleInputSchema,
	linksList: LinkListInputSchema,
	linksIntersect: LinkIntersectInputSchema,
	linkingDomainsList: LinkingDomainListInputSchema,
	anchorTextList: AnchorTextListInputSchema,
	topPagesList: TopPageListInputSchema,
	competitorsFetch: CompetitorsFetchInputSchema,
	jobsLookup: JobsLookupInputSchema,
} as const;

export const MozEndpointOutputSchemas = {
	quotaLookup: QuotaLookupResponseSchema,
	localesList: LocalesListResponseSchema,
	metricsFetch: MetricsFetchResponseSchema,
	metricsFetchMultiple: MetricsFetchMultipleResponseSchema,
	linksList: LinkListResponseSchema,
	linksIntersect: LinkIntersectResponseSchema,
	linkingDomainsList: LinkingDomainListResponseSchema,
	anchorTextList: AnchorTextListResponseSchema,
	topPagesList: TopPageListResponseSchema,
	competitorsFetch: CompetitorsFetchResponseSchema,
	jobsLookup: JobsLookupResponseSchema,
} as const;
