import { z } from 'zod';

/**
 * Similarweb's own names are used throughout. Outputs are `.loose()` and their
 * optional fields `.nullish()` so a field Similarweb adds or omits cannot fail
 * a read that already succeeded.
 *
 * Contract: the OpenAPI block embedded in each page under
 * https://developers.similarweb.com/reference
 */

// ── Shared output pieces ──────────────────────────────────────────────────

/**
 * Every Similarweb answer carries the request it understood and a status. A
 * `status` other than `Success` is worth surfacing rather than swallowing, so
 * it stays a string.
 */
const MetaSchema = z
	.object({
		request: z.record(z.string(), z.unknown()).nullish(), // unknown: echoes input
		status: z.string().nullish(),
		last_updated: z.string().nullish(),
	})
	.loose();

const GlobalRankPointSchema = z
	.object({
		date: z.string().describe('The month, as YYYY-MM.'),
		global_rank: z.number().nullish(),
	})
	.loose();

const CountryRankPointSchema = z
	.object({
		date: z.string().describe('The month, as YYYY-MM.'),
		country_rank: z.number().nullish(),
	})
	.loose();

const AppRankPointSchema = z
	.object({
		date: z.string().describe('The day, as YYYY-MM-DD.'),
		value: z.number().nullish(),
	})
	.loose();

/**
 * Similarweb documents `YYYY-MM` for the month bounds. The API also accepts a
 * day, which the examples echo back as `2023-01-01`, so both are allowed rather
 * than rejecting a value the API takes.
 */
const Month = z
	.string()
	.regex(
		/^\d{4}-\d{2}(-\d{2})?$/,
		'A month as YYYY-MM, or a day as YYYY-MM-DD',
	);

const DomainName = z
	.string()
	.min(1)
	.describe(
		"The domain without 'www.' or brackets, lower case, such as cnn.com. A path or capital letters make Similarweb answer 401.",
	);

// ── websites.globalRank ───────────────────────────────────────────────────

const DateRangeInput = {
	domain: DomainName,
	start_date: Month.optional().describe(
		'The first month. Omit both dates for the last 28 days.',
	),
	end_date: Month.optional().describe('The last month.'),
	main_domain_only: z
		.boolean()
		.optional()
		.describe(
			'True for the main domain only, false to include subdomains. Defaults to false.',
		),
};

const GlobalRankInputSchema = z
	.object(DateRangeInput)
	.superRefine(requireBothOrNeither('start_date', 'end_date'));

export type GlobalRankInput = z.infer<typeof GlobalRankInputSchema>;

const GlobalRankResponseSchema = z.object({
	meta: MetaSchema,
	global_rank: z
		.array(GlobalRankPointSchema)
		.describe('One entry per month, oldest first.'),
});

export type GlobalRankResponse = z.infer<typeof GlobalRankResponseSchema>;

// ── websites.countryRank ──────────────────────────────────────────────────

const CountryRankInputSchema = z
	.object({
		...DateRangeInput,
		country: z
			.string()
			.min(2)
			.describe(
				'A two-letter ISO country code. Which countries are available depends on the subscription; capabilities.get lists them. Worldwide is not supported here; use websites.globalRank.',
			)
			.refine((value) => value.toLowerCase() !== 'world', {
				message:
					'Country rank does not support world; use websites.globalRank for the worldwide rank.',
			}),
	})
	.superRefine(requireBothOrNeither('start_date', 'end_date'));

export type CountryRankInput = z.infer<typeof CountryRankInputSchema>;

const CountryRankResponseSchema = z.object({
	meta: MetaSchema,
	country_rank: z
		.array(CountryRankPointSchema)
		.describe('One entry per month, oldest first.'),
});

export type CountryRankResponse = z.infer<typeof CountryRankResponseSchema>;

// ── websites.industryRank ─────────────────────────────────────────────────

const IndustryRankInputSchema = z.object({
	domain: DomainName,
});

export type IndustryRankInput = z.infer<typeof IndustryRankInputSchema>;

/**
 * This route answers a single category and rank with no date range, so it is
 * the "current" reading rather than a series.
 */
const IndustryRankResponseSchema = z.object({
	meta: MetaSchema,
	category: z
		.string()
		.nullish()
		.describe(
			'The industry path, such as E-commerce_and_Shopping/Marketplace.',
		),
	rank: z
		.number()
		.nullish()
		.describe('The rank within that industry, worldwide.'),
});

export type IndustryRankResponse = z.infer<typeof IndustryRankResponseSchema>;

// ── websites.topSites ─────────────────────────────────────────────────────

const TopSitesInputSchema = z.object({
	limit: z
		.number()
		.int()
		.min(1)
		.max(5000)
		.optional()
		.describe('How many sites to return, up to 5000. Defaults to 10.'),
});

export type TopSitesInput = z.infer<typeof TopSitesInputSchema>;

const TopSitesResponseSchema = z.object({
	meta: MetaSchema,
	top_sites: z.array(
		z
			.object({
				domain: z.string(),
				rank: z.number().nullish(),
			})
			.loose(),
	),
});

export type TopSitesResponse = z.infer<typeof TopSitesResponseSchema>;

// ── apps.rank ─────────────────────────────────────────────────────────────

/**
 * The store names Similarweb accepts in its examples are capitalised (`Google`,
 * `Apple`), while `apps.describe` reports them in lower case. The query keeps
 * the documented values and normalises the case in the endpoint.
 */
const AppStoreSchema = z
	.enum(['Google', 'Apple'])
	.describe('Google for Android, Apple for iOS.');

const AppDeviceSchema = z
	.enum(['androidphone', 'iphone', 'ipad'])
	.describe(
		'androidphone for an Android app, iphone or ipad for iOS. A store and device that disagree return no data.',
	);

const AppRankInputSchema = z
	.object({
		store: AppStoreSchema,
		app_id: z
			.string()
			.min(1)
			.describe('The store id, such as com.whatsapp or 310633997.'),
		country: z.string().min(2).describe('A two-letter ISO code, or world.'),
		category: z
			.string()
			.optional()
			.describe('An app category, or all. Sent as all when omitted.'),
		mode: z
			.string()
			.optional()
			.describe(
				'The chart to read, such as free, paid, topselling_free or topgrossing. apps.describe lists every accepted value per store. Sent as topselling_free when omitted, which both stores accept.',
			),
		device: AppDeviceSchema.optional().describe(
			"androidphone, iphone or ipad. Sent as the store's phone (androidphone or iphone) when omitted.",
		),
		duration: z
			.number()
			.int()
			.min(1)
			.optional()
			.describe('Days back from today. Sent as 90 when omitted.'),
	})
	.superRefine((value, ctx) => {
		// An Android device with the Apple store, or the reverse, is a valid
		// request that answers no data, so it fails here instead of costing a
		// call and returning an empty series.
		if (!value.device) return;
		const android = value.device === 'androidphone';
		const appleStore = value.store === 'Apple';
		if (android === appleStore) {
			ctx.addIssue({
				code: 'custom',
				path: ['device'],
				message: `device ${value.device} does not belong to the ${value.store} store. Use androidphone for Google, iphone or ipad for Apple.`,
			});
		}
	});

export type AppRankInput = z.infer<typeof AppRankInputSchema>;

const AppRankResponseSchema = z.object({
	meta: MetaSchema,
	ranks: z
		.array(AppRankPointSchema)
		.describe('One entry per day, oldest first.'),
});

export type AppRankResponse = z.infer<typeof AppRankResponseSchema>;

// ── apps.describe ─────────────────────────────────────────────────────────

const AppDescribeInputSchema = z.object({});

export type AppDescribeInput = z.infer<typeof AppDescribeInputSchema>;

const AppDescribeResponseSchema = z.object({
	app_rank: z
		.object({
			countries: z
				.array(z.string())
				.describe('Every country code the API accepts.'),
			stores: z.array(
				z
					.object({
						store: z.string(),
						mode: z.string(),
						device: z.string(),
					})
					.loose(),
			),
		})
		.loose(),
});

export type AppDescribeResponse = z.infer<typeof AppDescribeResponseSchema>;

// ── categories.list ───────────────────────────────────────────────────────

const CategoriesListInputSchema = z.object({});

export type CategoriesListInput = z.infer<typeof CategoriesListInputSchema>;

/**
 * The answer is a category tree: the top level maps a name to its children,
 * and each child maps to the `Parent~Child` value the rank routes accept. Some
 * top levels are empty objects, so both an object and no children are valid.
 */
const CategoriesListResponseSchema = z.object({
	categories: z
		.record(z.string(), z.record(z.string(), z.string()))
		.describe(
			'Top-level category to its children, each child mapping to the Parent~Child slug. A top level with no children is an empty object.',
		),
});

export type CategoriesListResponse = z.infer<
	typeof CategoriesListResponseSchema
>;

// ── capabilities ──────────────────────────────────────────────────────────

const CapabilitiesInputSchema = z.object({});

export type CapabilitiesInput = z.infer<typeof CapabilitiesInputSchema>;

/** The capability map is provider-defined and differs per subscription tier. */
const CapabilitiesResponseSchema = z.object({
	capabilities: z
		.record(z.string(), z.unknown()) // unknown: capability map per tier
		.describe(
			'What the account is entitled to, keyed by capability name. The keys depend on the subscription.',
		),
});

export type CapabilitiesResponse = z.infer<typeof CapabilitiesResponseSchema>;

// ── usage ─────────────────────────────────────────────────────────────────

const UsageInputSchema = z.object({});

export type UsageInput = z.infer<typeof UsageInputSchema>;

/**
 * Only users with an allocated allowance get numbers here. Similarweb's
 * documented example is `{ "allowance": 10000, "user_remaining": 4989 }`.
 */
const UsageResponseSchema = z.object({
	allowance: z
		.number()
		.nullish()
		.describe('Credits allocated to this user for the period.'),
	user_remaining: z.number().nullish().describe('Credits this user has left.'),
	/** Derived here so a caller does not have to subtract two fields. */
	used: z
		.number()
		.nullish()
		.describe('allowance minus user_remaining, when both are present.'),
});

export type UsageResponse = z.infer<typeof UsageResponseSchema>;

// ── Helpers ───────────────────────────────────────────────────────────────

/**
 * Similarweb needs both dates or neither: one without the other is accepted but
 * silently answered with the default window, which looks like a successful
 * query for the wrong months.
 */
function requireBothOrNeither(start: string, end: string) {
	return (
		value: Record<string, unknown>, // unknown: the object under refinement
		ctx: z.RefinementCtx,
	): void => {
		const hasStart = value[start] !== undefined;
		const hasEnd = value[end] !== undefined;
		if (hasStart !== hasEnd) {
			ctx.addIssue({
				code: 'custom',
				path: [hasStart ? end : start],
				message: `Supply both ${start} and ${end}, or neither for the last 28 days.`,
			});
		}
	};
}

// ── Registry ──────────────────────────────────────────────────────────────

export type SimilarwebEndpointInputs = {
	websitesGlobalRank: GlobalRankInput;
	websitesCountryRank: CountryRankInput;
	websitesIndustryRank: IndustryRankInput;
	websitesTopSites: TopSitesInput;
	appsRank: AppRankInput;
	appsDescribe: AppDescribeInput;
	categoriesList: CategoriesListInput;
	capabilitiesGet: CapabilitiesInput;
	usageGet: UsageInput;
};

export type SimilarwebEndpointOutputs = {
	websitesGlobalRank: GlobalRankResponse;
	websitesCountryRank: CountryRankResponse;
	websitesIndustryRank: IndustryRankResponse;
	websitesTopSites: TopSitesResponse;
	appsRank: AppRankResponse;
	appsDescribe: AppDescribeResponse;
	categoriesList: CategoriesListResponse;
	capabilitiesGet: CapabilitiesResponse;
	usageGet: UsageResponse;
};

export const SimilarwebEndpointInputSchemas = {
	websitesGlobalRank: GlobalRankInputSchema,
	websitesCountryRank: CountryRankInputSchema,
	websitesIndustryRank: IndustryRankInputSchema,
	websitesTopSites: TopSitesInputSchema,
	appsRank: AppRankInputSchema,
	appsDescribe: AppDescribeInputSchema,
	categoriesList: CategoriesListInputSchema,
	capabilitiesGet: CapabilitiesInputSchema,
	usageGet: UsageInputSchema,
} as const;

export const SimilarwebEndpointOutputSchemas = {
	websitesGlobalRank: GlobalRankResponseSchema,
	websitesCountryRank: CountryRankResponseSchema,
	websitesIndustryRank: IndustryRankResponseSchema,
	websitesTopSites: TopSitesResponseSchema,
	appsRank: AppRankResponseSchema,
	appsDescribe: AppDescribeResponseSchema,
	categoriesList: CategoriesListResponseSchema,
	capabilitiesGet: CapabilitiesResponseSchema,
	usageGet: UsageResponseSchema,
} as const;
