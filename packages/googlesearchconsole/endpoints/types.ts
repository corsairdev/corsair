import { z } from 'zod';

// Search Console is query-shaped: one analytics query, one inspection call, and
// small collections of sites and sitemaps. Outputs are `.loose()`, and optional
// fields are `.nullish()` so a field Google adds or omits does not break a read.
//
// Sources: the discovery document at
// https://searchconsole.googleapis.com/$discovery/rest?version=v1 for every
// method and message; https://developers.google.com/webmaster-tools/v1/
// searchanalytics/query for the query body and its ranges;
// https://developers.google.com/webmaster-tools/limits for the 1,200 QPM and
// URL-inspection quotas; and the reference page for urlInspection.index.inspect
// for the inspection request.

// ── shared ──────────────────────────────────────────────────────────────────

const siteUrl = z
	.string()
	.min(1)
	.describe(
		'The property as Search Console names it: `https://example.com/` for a URL-prefix property, or `sc-domain:example.com` for a domain property',
	);

/** The date format the analytics API takes and returns: YYYY-MM-DD in PT. */
const ReportDateSchema = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}$/, 'expected YYYY-MM-DD')
	.describe("YYYY-MM-DD, in Pacific Time (the API's own time zone)");

// ── search analytics ────────────────────────────────────────────────────────

/** The dimensions a query may group by. */
export const SEARCH_ANALYTICS_DIMENSIONS = [
	'DATE',
	'QUERY',
	'PAGE',
	'COUNTRY',
	'DEVICE',
	'SEARCH_APPEARANCE',
	'HOUR',
	'BRANDED_CLASSIFICATION',
] as const;

/** The search types a report may cover. */
export const SEARCH_TYPES = [
	'WEB',
	'IMAGE',
	'VIDEO',
	'NEWS',
	'DISCOVER',
	'GOOGLE_NEWS',
	'WEB_MULTIMODAL',
] as const;

/** The filter dimensions the API accepts, from the discovery enum. */
export const FILTER_DIMENSIONS = [
	'QUERY',
	'PAGE',
	'COUNTRY',
	'DEVICE',
	'SEARCH_APPEARANCE',
	'BRANDED_CLASSIFICATION',
] as const;

const FilterOperatorSchema = z.enum([
	'EQUALS',
	'NOT_EQUALS',
	'CONTAINS',
	'NOT_CONTAINS',
	'INCLUDING_REGEX',
	'EXCLUDING_REGEX',
]);

const DimensionFilterSchema = z
	.object({
		dimension: z.enum(FILTER_DIMENSIONS),
		operator: FilterOperatorSchema,
		expression: z
			.string()
			.describe(
				'For `COUNTRY`, a 3-letter ISO 3166-1 alpha-3 code; for `DEVICE`, `DESKTOP`, `MOBILE` or `TABLET`',
			),
	})
	.strict();

/** A multi-value filter: one dimension with several accepted values. */
const DimensionFilterListSchema = z
	.object({
		dimension: z
			.enum(FILTER_DIMENSIONS)
			.describe(
				'The discovery document lists this as supported for COUNTRY and DEVICE',
			),
		expressions: z.array(z.string().min(1)).min(1),
	})
	.strict();

const DimensionFilterGroupSchema = z
	.object({
		groupType: z
			.enum(['AND'])
			.nullish()
			.describe('Filters inside a group are combined with AND'),
		filters: z.array(DimensionFilterSchema).nullish(),
		filterLists: z.array(DimensionFilterListSchema).nullish(),
	})
	.strict();

const SearchAnalyticsQueryInputSchema = z
	.object({
		siteUrl,
		startDate: ReportDateSchema,
		endDate: ReportDateSchema,
		dimensions: z
			.array(z.enum(SEARCH_ANALYTICS_DIMENSIONS))
			.nullish()
			.describe(
				'Zero or more dimensions to group by. `HOUR` requires dataState HOURLY_ALL',
			),
		type: z.enum(SEARCH_TYPES).nullish().describe('Defaults to `WEB`'),
		searchType: z
			.enum(SEARCH_TYPES)
			.nullish()
			.describe(
				'The older spelling of `type`, with the same values and default. Send one, not both',
			),
		dimensionFilterGroups: z
			.array(DimensionFilterGroupSchema)
			.nullish()
			.describe('Filters applied to the grouped values'),
		aggregationType: z
			.enum(['AUTO', 'BY_PROPERTY', 'BY_PAGE', 'BY_NEWS_SHOWCASE_PANEL'])
			.nullish()
			.describe(
				'`BY_PROPERTY` merges data across properties; `BY_PAGE` groups by URI. Neither is supported for DISCOVER or GOOGLE_NEWS',
			),
		rowLimit: z
			.number()
			.int()
			.min(1)
			.max(25_000)
			.nullish()
			.describe('1 to 25,000. The API default is 1,000'),
		startRow: z
			.number()
			.int()
			.min(0)
			.nullish()
			.describe(
				'Zero-based row to start at, which is how a caller pages. Past the end, the answer is a successful empty page',
			),
		dataState: z
			.enum(['DATA_STATE_UNSPECIFIED', 'FINAL', 'ALL', 'HOURLY_ALL'])
			.nullish()
			.describe(
				'`ALL` includes fresh, unfinalized data; `FINAL` is the default; `HOURLY_ALL` is required for the HOUR dimension',
			),
	})
	.strict()
	.superRefine((value, ctx) => {
		// Two fields for one setting would send both and leave which wins to the
		// API, so only one may be set.
		if (value.type && value.searchType) {
			ctx.addIssue({
				code: 'custom',
				path: ['searchType'],
				message: 'Send `type` or `searchType`, not both',
			});
		}
		// A grouped-by-hour report reads partial data by design, so the API
		// requires the state that says so.
		if (
			value.dimensions?.includes('HOUR') &&
			value.dataState !== 'HOURLY_ALL'
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['dataState'],
				message: 'Grouping by HOUR requires dataState HOURLY_ALL',
			});
		}
	});

const ApiDataRowSchema = z
	.object({
		keys: z
			.array(z.string())
			.nullish()
			.describe(
				'One value per requested dimension, in the order they were asked for',
			),
		clicks: z.number().nullish(),
		impressions: z.number().nullish(),
		ctr: z.number().nullish().describe('A fraction: 0.05 is 5%'),
		position: z.number().nullish().describe('Average position in the results'),
	})
	.loose();

const SearchAnalyticsQueryOutputSchema = z.object({
	rows: z
		.array(ApiDataRowSchema)
		.nullish()
		.describe(
			'Grouped rows, sorted by clicks descending. Absent when nothing matched',
		),
	responseAggregationType: z
		.string()
		.nullish()
		.describe(
			'How the rows were aggregated, which can differ from what was asked',
		),
	metadata: z
		.object({
			firstIncompleteDate: z.string().nullish(),
			firstIncompleteHour: z.string().nullish(),
		})
		.loose()
		.nullish()
		.describe('The date or hour still being processed'),
});

// ── sites ───────────────────────────────────────────────────────────────────

const WmxSiteSchema = z
	.object({
		siteUrl: z.string().nullish(),
		permissionLevel: z
			.enum([
				'SITE_PERMISSION_LEVEL_UNSPECIFIED',
				'SITE_OWNER',
				'SITE_FULL_USER',
				'SITE_RESTRICTED_USER',
				'SITE_UNVERIFIED_USER',
			])
			.nullish()
			.describe(
				'What this credential may do on the property. Only a level above UNVERIFIED can read its data',
			),
	})
	.loose();

const SitesListInputSchema = z.object({}).strict();

const SitesGetInputSchema = z.object({ siteUrl }).strict();

const SitesAddInputSchema = z
	.object({
		siteUrl,
	})
	.strict()
	.describe(
		'Adding a property requires the credential to be allowed to manage it in Search Console; the site must already be verified by the account',
	);

const SitesDeleteInputSchema = z.object({ siteUrl }).strict();

const SitesListOutputSchema = z.object({
	siteEntry: z
		.array(WmxSiteSchema)
		.nullish()
		.describe('Absent when the credential can reach no properties'),
});

// ── sitemaps ────────────────────────────────────────────────────────────────

const feedpath = z
	.string()
	.url()
	.describe(
		"The sitemap's own URL, e.g. `https://example.com/sitemap.xml`. It is a URL, not a path",
	);

const WmxSitemapContentSchema = z
	.object({
		type: z
			.enum([
				'WEB',
				'IMAGE',
				'VIDEO',
				'NEWS',
				'MOBILE',
				'ANDROID_APP',
				'PATTERN',
				'IOS_APP',
				'DATA_FEED_ELEMENT',
			])
			.nullish(),
		submitted: z
			.string()
			.nullish()
			.describe('int64 as a string: the number of URLs of this type'),
		indexed: z
			.string()
			.nullish()
			.describe('Deprecated by the API; do not rely on it'),
	})
	.loose();

const WmxSitemapSchema = z
	.object({
		path: z.string().nullish(),
		lastSubmitted: z.string().nullish().describe('RFC 3339'),
		lastDownloaded: z.string().nullish().describe('RFC 3339'),
		isPending: z.boolean().nullish(),
		isSitemapsIndex: z
			.boolean()
			.nullish()
			.describe('True when this sitemap is a collection of other sitemaps'),
		type: z
			.enum([
				'NOT_SITEMAP',
				'URL_LIST',
				'SITEMAP',
				'RSS_FEED',
				'ATOM_FEED',
				'PATTERN_SITEMAP',
				'OCEANFRONT',
			])
			.nullish(),
		warnings: z.string().nullish().describe('int64 as a string'),
		errors: z.string().nullish().describe('int64 as a string'),
		contents: z.array(WmxSitemapContentSchema).nullish(),
	})
	.loose();

const SitemapsListInputSchema = z
	.object({
		siteUrl,
		sitemapIndex: z
			.string()
			.url()
			.nullish()
			.describe('List only the sitemaps named inside this sitemap index'),
	})
	.strict();

const SitemapsGetInputSchema = z.object({ siteUrl, feedpath }).strict();

/**
 * sitemaps.submit is a PUT of the sitemap's URL, not of its contents. The URL
 * must resolve; Google fetches it.
 */
const SitemapsSubmitInputSchema = z.object({ siteUrl, feedpath }).strict();

const SitemapsDeleteInputSchema = z.object({ siteUrl, feedpath }).strict();

const SitemapsListOutputSchema = z.object({
	sitemap: z.array(WmxSitemapSchema).nullish(),
});

// ── URL inspection ──────────────────────────────────────────────────────────

const InspectUrlInputSchema = z
	.object({
		siteUrl,
		inspectionUrl: z
			.string()
			.url()
			.describe('The URL to inspect. It must be under the property in siteUrl'),
		languageCode: z
			.string()
			.nullish()
			.describe(
				'IETF BCP-47 language for the localized issue messages, e.g. `en-US`',
			),
	})
	.strict();

const IndexStatusInspectionResultSchema = z
	.object({
		verdict: z
			.enum(['VERDICT_UNSPECIFIED', 'PASS', 'PARTIAL', 'FAIL', 'NEUTRAL'])
			.nullish(),
		coverageState: z
			.string()
			.nullish()
			.describe(
				'The indexing state as Search Console words it, e.g. "Submitted and indexed"',
			),
		robotsTxtState: z
			.enum(['ROBOTS_TXT_STATE_UNSPECIFIED', 'ALLOWED', 'DISALLOWED'])
			.nullish(),
		indexingState: z
			.enum([
				'INDEXING_STATE_UNSPECIFIED',
				'INDEXING_ALLOWED',
				'BLOCKED_BY_META_TAG',
				'BLOCKED_BY_HTTP_HEADER',
				'BLOCKED_BY_ROBOTS_TXT',
			])
			.nullish(),
		lastCrawlTime: z.string().nullish(),
		pageFetchState: z
			.enum([
				'PAGE_FETCH_STATE_UNSPECIFIED',
				'SUCCESSFUL',
				'SOFT_404',
				'BLOCKED_ROBOTS_TXT',
				'NOT_FOUND',
				'ACCESS_DENIED',
				'SERVER_ERROR',
				'REDIRECT_ERROR',
				'ACCESS_FORBIDDEN',
				'BLOCKED_4XX',
				'INTERNAL_CRAWL_ERROR',
				'INVALID_URL',
			])
			.nullish(),
		googleCanonical: z.string().nullish(),
		userCanonical: z.string().nullish(),
		crawledAs: z
			.enum(['CRAWLING_USER_AGENT_UNSPECIFIED', 'DESKTOP', 'MOBILE'])
			.nullish(),
		referringUrls: z.array(z.string()).nullish(),
		sitemap: z.array(z.string()).nullish(),
	})
	.loose();

const MobileUsabilityIssueSchema = z
	.object({
		message: z.string().nullish(),
		issueType: z.string().nullish(),
		severity: z.string().nullish(),
	})
	.loose();

const MobileUsabilityInspectionResultSchema = z
	.object({
		verdict: z
			.enum(['VERDICT_UNSPECIFIED', 'PASS', 'PARTIAL', 'FAIL', 'NEUTRAL'])
			.nullish(),
		issues: z.array(MobileUsabilityIssueSchema).nullish(),
	})
	.loose();

const RichResultsInspectionResultSchema = z
	.object({
		verdict: z
			.enum(['VERDICT_UNSPECIFIED', 'PASS', 'PARTIAL', 'FAIL', 'NEUTRAL'])
			.nullish(),
		detectedItems: z
			.array(z.record(z.string(), z.unknown())) // unknown: provider-shaped items.
			.nullish()
			.describe('The rich result types found and their issues'),
	})
	.loose();

const AmpInspectionResultSchema = z
	.object({
		verdict: z
			.enum(['VERDICT_UNSPECIFIED', 'PASS', 'PARTIAL', 'FAIL', 'NEUTRAL'])
			.nullish(),
		ampUrl: z.string().nullish(),
		robotsTxtState: z
			.enum(['ROBOTS_TXT_STATE_UNSPECIFIED', 'ALLOWED', 'DISALLOWED'])
			.nullish(),
		indexingState: z
			.enum([
				'AMP_INDEXING_STATE_UNSPECIFIED',
				'AMP_INDEXING_ALLOWED',
				'BLOCKED_DUE_TO_NOINDEX',
				'BLOCKED_DUE_TO_EXPIRED_UNAVAILABLE_AFTER',
			])
			.nullish(),
		pageFetchState: z.string().nullish(),
		lastCrawlTime: z.string().nullish(),
		issues: z.array(z.record(z.string(), z.unknown())).nullish(), // unknown: provider-shaped.
	})
	.loose();

const InspectUrlOutputSchema = z.object({
	inspectionResult: z
		.object({
			inspectionResultLink: z.string().nullish(),
			indexStatusResult: IndexStatusInspectionResultSchema.nullish(),
			mobileUsabilityResult: MobileUsabilityInspectionResultSchema.nullish(),
			richResultsResult: RichResultsInspectionResultSchema.nullish(),
			ampResult: AmpInspectionResultSchema.nullish().describe(
				'Absent when the page is not an AMP page',
			),
		})
		.loose()
		.nullish(),
});

// ── exports ─────────────────────────────────────────────────────────────────

export type GoogleSearchConsoleEndpointInputs = {
	searchanalyticsQuery: z.input<typeof SearchAnalyticsQueryInputSchema>;
	sitesList: z.input<typeof SitesListInputSchema>;
	sitesGet: z.input<typeof SitesGetInputSchema>;
	sitesAdd: z.input<typeof SitesAddInputSchema>;
	sitesDelete: z.input<typeof SitesDeleteInputSchema>;
	sitemapsList: z.input<typeof SitemapsListInputSchema>;
	sitemapsGet: z.input<typeof SitemapsGetInputSchema>;
	sitemapsSubmit: z.input<typeof SitemapsSubmitInputSchema>;
	sitemapsDelete: z.input<typeof SitemapsDeleteInputSchema>;
	urlInspectionInspect: z.input<typeof InspectUrlInputSchema>;
};

export type GoogleSearchConsoleEndpointOutputs = {
	searchanalyticsQuery: z.output<typeof SearchAnalyticsQueryOutputSchema>;
	sitesList: z.output<typeof SitesListOutputSchema>;
	sitesGet: z.output<typeof WmxSiteSchema>;
	sitesAdd: void;
	sitesDelete: void;
	sitemapsList: z.output<typeof SitemapsListOutputSchema>;
	sitemapsGet: z.output<typeof WmxSitemapSchema>;
	sitemapsSubmit: void;
	sitemapsDelete: void;
	urlInspectionInspect: z.output<typeof InspectUrlOutputSchema>;
};

export const GoogleSearchConsoleEndpointInputSchemas = {
	searchanalyticsQuery: SearchAnalyticsQueryInputSchema,
	sitesList: SitesListInputSchema,
	sitesGet: SitesGetInputSchema,
	sitesAdd: SitesAddInputSchema,
	sitesDelete: SitesDeleteInputSchema,
	sitemapsList: SitemapsListInputSchema,
	sitemapsGet: SitemapsGetInputSchema,
	sitemapsSubmit: SitemapsSubmitInputSchema,
	sitemapsDelete: SitemapsDeleteInputSchema,
	urlInspectionInspect: InspectUrlInputSchema,
} as const;

export const GoogleSearchConsoleEndpointOutputSchemas = {
	searchanalyticsQuery: SearchAnalyticsQueryOutputSchema,
	sitesList: SitesListOutputSchema,
	sitesGet: WmxSiteSchema,
	sitesAdd: z.void(),
	sitesDelete: z.void(),
	sitemapsList: SitemapsListOutputSchema,
	sitemapsGet: WmxSitemapSchema,
	sitemapsSubmit: z.void(),
	sitemapsDelete: z.void(),
	urlInspectionInspect: InspectUrlOutputSchema,
} as const;

export { DimensionFilterGroupSchema, WmxSitemapSchema };
