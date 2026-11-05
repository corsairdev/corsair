import { z } from 'zod';

// Inputs follow https://api.getanyapi.com/openapi.json. Every run answers with
// the same envelope ({ output: { found, data }, costUsd, items, resultId, ... });
// the `data` schemas below type the fields agents use, checked against live
// responses, and pass everything else through (`.loose()`), because AnyAPI
// normalizes several sources per endpoint and fields are often null.

const str = z.string().nullish();
const num = z.number().nullish();
const bool = z.boolean().nullish();
// unknown: nested lists (experience, media, hours) differ by source and are
// passed through as returned.
const list = z.array(z.unknown()).nullish();

const Sku = z
	.string()
	.regex(
		/^[a-z0-9_]+(\.[a-z0-9_]+)+$/,
		'Expected an AnyAPI SKU like linkedin.company',
	)
	.describe('AnyAPI endpoint id, e.g. linkedin.company or google.search');

// Options every run accepts. Neither changes the result.
const RunControls = {
	maxCostUsd: z
		.number()
		.positive()
		.optional()
		.describe(
			'Most this call may cost in USD. Sources priced above it are skipped; if none fits, the call is refused without charge.',
		),
	idempotencyKey: z
		.string()
		.min(1)
		.max(255)
		.optional()
		.describe(
			'Reuse the same key to retry a call without paying twice. Scoped to your account for 24 hours.',
		),
};

// Trimming controls: they shrink what comes back, never what is charged.
const ShapeControls = {
	fields: z
		.string()
		.optional()
		.describe(
			'Comma-separated keys to keep on each result item, e.g. name,followerCount',
		),
	maxItems: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('Cap the number of result rows returned'),
	summary: z
		.boolean()
		.optional()
		.describe('Return only an outline of the result with per-field sizes'),
	jq: z
		.string()
		.optional()
		.describe(
			'jq expression applied to the result; its output replaces `output`',
		),
};

// unknown: AnyAPI echoes free-form error and result objects on snapshots.
const RequestSnapshotSchema = z
	.object({
		requestId: z.string(),
		sku: z.string(),
		status: z.enum(['queued', 'running', 'succeeded', 'failed', 'expired']),
		createdAt: z.string(),
		completedAt: str,
		expiresAt: str,
		retryAfterSeconds: num,
		serviceOutcome: str,
		settlementState: str,
		resultExpired: bool,
		result: z.record(z.string(), z.unknown()).nullish(),
		error: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

const SourceSchema = z.object({ id: z.string(), name: str, kind: str }).loose();

const envelopeFields = {
	provider: str,
	costUsd: z.number().describe('USD charged for this call'),
	items: num,
	replayed: bool,
	source: SourceSchema.nullish(),
	resultId: str.describe(
		'Re-read and re-shape this result for free with results.get for about 15 minutes',
	),
	hint: str,
	jqError: str,
};

function runResult<T extends z.ZodType>(data: T) {
	return z
		.object({
			output: z
				.object({
					found: z
						.boolean()
						.describe(
							'False when the target does not exist; data is then null',
						),
					data: data.nullable(),
				})
				.loose(),
			...envelopeFields,
		})
		.loose();
}

// ── Catalog ───────────────────────────────────────────────────────────────

// unknown: catalog entries carry nested pricing, lanes and schemas that
// AnyAPI extends often; the fields agents pick an API by are typed.
const CatalogEntrySchema = z
	.object({
		slug: z.string(),
		name: str,
		description: str,
		category: str,
		platformId: str,
		execution: z.object({ mode: z.string() }).loose().nullish(),
		pricing: z.record(z.string(), z.unknown()).nullish(),
		failover: bool,
	})
	.loose();

const ApisSearchInputSchema = z.object({
	query: z
		.string()
		.min(1)
		.optional()
		.describe('What you need, in your own words, e.g. "linkedin company page"'),
	category: z
		.string()
		.optional()
		.describe('Limit to one category, e.g. social'),
	platform: z
		.string()
		.optional()
		.describe('Limit to one platform, e.g. linkedin'),
	limit: z.number().int().min(1).optional(),
});

const ApisSearchResponseSchema = z
	.object({ results: z.array(CatalogEntrySchema), total: num })
	.loose();

const ApisListInputSchema = z.object({
	category: z
		.string()
		.optional()
		.describe('Limit to one category, e.g. search'),
});

const ApisListResponseSchema = z
	.object({ apis: z.array(CatalogEntrySchema) })
	.loose();

const ApisGetInputSchema = z.object({ sku: Sku });

// unknown: inputSchema and outputSchema are JSON Schema documents.
const ApisGetResponseSchema = CatalogEntrySchema.extend({
	inputSchema: z.record(z.string(), z.unknown()).nullish(),
	outputSchema: z.record(z.string(), z.unknown()).nullish(),
	latency: z
		.object({ p50Ms: num, p95Ms: num, p99Ms: num, sample: num })
		.loose()
		.nullish(),
}).loose();

// unknown: each SKU defines its own input, read from apis.get.
const SkuInput = z
	.record(z.string(), z.unknown())
	.default({})
	.describe("The endpoint's input, matching its inputSchema from apis.get");

const ApisQuoteInputSchema = z.object({ sku: Sku, input: SkuInput });

const ApisQuoteResponseSchema = z
	.object({
		maxCostUsd: z.number(),
		minCostUsd: num,
		baseUsd: num,
		perItemUsd: num,
		exact: bool,
		pricing: str,
	})
	.loose();

const ApisRunInputSchema = z.object({
	sku: Sku,
	input: SkuInput,
	...ShapeControls,
	...RunControls,
});

// unknown: `output` is the endpoint's own result, or whatever jq, fields or
// summary reshaped it into.
const ApisRunResultSchema = z
	.object({ output: z.unknown(), ...envelopeFields })
	.loose();

// A re-read is free but echoes the original run's costUsd.
const ResultsGetResponseSchema = ApisRunResultSchema.extend({
	costUsd: z
		.number()
		.describe(
			'USD charged for the original run. The re-read itself is free, so do not add this to a running total.',
		),
});

// A durable endpoint that is still working answers with a request snapshot.
const ApisRunResponseSchema = z.union([
	ApisRunResultSchema,
	RequestSnapshotSchema,
]);

const ResultsGetInputSchema = z.object({
	resultId: z.string().min(1).describe('resultId from an earlier run'),
	...ShapeControls,
});

const RequestsGetInputSchema = z.object({
	requestId: z
		.string()
		.min(1)
		.describe('requestId from a durable run that answered queued or running'),
});

const AccountGetBalanceInputSchema = z.object({});

const AccountGetBalanceResponseSchema = z
	.object({ usd: z.number().describe('Remaining wallet balance in USD') })
	.loose();

// ── Typed endpoints ───────────────────────────────────────────────────────

const GoogleSearchInputSchema = z.object({
	query: z.string().min(1).describe('The Google search query'),
	page: z.number().int().min(1).optional().describe('Results page, from 1'),
	limit: z.number().int().min(1).max(100).optional(),
	gl: z.string().optional().describe('Two-letter country code, e.g. us'),
	hl: z.string().optional().describe('Two-letter language code, e.g. en'),
	location: z
		.string()
		.optional()
		.describe('Finer location than gl, e.g. Austin, Texas, United States'),
	timeframe: z.enum(['1h', '1d', '7d', '1y', 'all']).optional(),
	autocorrect: z.boolean().optional(),
	...RunControls,
});

const GoogleSearchDataSchema = z
	.object({
		query: str,
		results: z
			.array(
				z
					.object({ position: num, title: str, link: str, snippet: str })
					.loose(),
			)
			.nullish(),
		nextCursor: str,
	})
	.loose();

const WebScrapeInputSchema = z.object({
	url: z.url().describe('Full page URL, including https://'),
	formats: z
		.array(z.enum(['markdown', 'html', 'rawHtml']))
		.optional()
		.describe('Defaults to markdown and html'),
	onlyMainContent: z
		.boolean()
		.optional()
		.describe('Drop navigation, headers and footers'),
	includeTags: z.array(z.string()).optional().describe('CSS selectors to keep'),
	excludeTags: z.array(z.string()).optional().describe('CSS selectors to drop'),
	waitFor: z
		.number()
		.int()
		.min(0)
		.max(15000)
		.optional()
		.describe('Milliseconds to wait for the page to render'),
	mobile: z.boolean().optional(),
	blockAds: z.boolean().optional(),
	...RunControls,
});

const WebScrapeDataSchema = z
	.object({
		url: str,
		statusCode: num,
		title: str,
		description: str,
		language: str,
		markdown: str,
		html: str,
		rawHtml: str,
	})
	.loose();

const LinkedInUrlInput = (what: string) =>
	z.object({
		url: z.string().min(1).describe(`Full LinkedIn ${what} URL`),
		...RunControls,
	});

const LinkedInGetProfileInputSchema = LinkedInUrlInput('profile');

const LinkedInProfileDataSchema = z
	.object({
		id: str,
		publicIdentifier: str,
		url: str,
		firstName: str,
		lastName: str,
		headline: str,
		about: str,
		location: str,
		city: str,
		country: str,
		followerCount: num,
		connectionsCount: num,
		openToWork: bool,
		currentPosition: list,
		experience: list,
		education: list,
		skills: list,
	})
	.loose();

const LinkedInGetCompanyInputSchema = LinkedInUrlInput('company page');

const LinkedInCompanyDataSchema = z
	.object({
		id: str,
		name: str,
		universalName: str,
		linkedinUrl: str,
		website: str,
		tagline: str,
		description: str,
		industry: str,
		companyType: str,
		employeeCount: num,
		followerCount: num,
		specialities: list,
		locations: list,
	})
	.loose();

const TwitterSearchInputSchema = z.object({
	query: z
		.string()
		.min(1)
		.describe(
			'X advanced-search query. Bare words are ANDed; quote phrases and group OR terms in brackets.',
		),
	queryType: z.enum(['Latest', 'Top', 'Photos', 'Videos']).optional(),
	limit: z.number().int().min(1).max(50).optional(),
	cursor: z.string().optional().describe('nextCursor from the previous page'),
	...RunControls,
});

const TwitterSearchDataSchema = z
	.object({
		items: z
			.array(
				z
					.object({
						id: str,
						url: str,
						text: str,
						createdUtc: num,
						authorUsername: str,
						authorName: str,
						likeCount: num,
						retweetCount: num,
						replyCount: num,
						viewCount: num,
					})
					.loose(),
			)
			.nullish(),
		nextCursor: str,
	})
	.loose();

const RedditSearchInputSchema = z.object({
	query: z.string().min(1).describe('Search across all of Reddit'),
	sort: z.enum(['relevance', 'hot', 'top', 'new', 'comments']).optional(),
	timeframe: z.enum(['hour', 'day', 'week', 'month', 'year', 'all']).optional(),
	cursor: z.string().optional().describe('nextCursor from the previous page'),
	...RunControls,
});

const RedditSearchDataSchema = z
	.object({
		posts: z
			.array(
				z
					.object({
						id: str,
						title: str,
						subreddit: str,
						author: str,
						score: num,
						numComments: num,
						permalink: str,
						url: str,
						selftext: str,
						createdUtc: num,
					})
					.loose(),
			)
			.nullish(),
		nextCursor: str,
	})
	.loose();

const InstagramGetProfileInputSchema = z.object({
	handle: z.string().min(1).describe('Instagram username without the @'),
	...RunControls,
});

const InstagramProfileDataSchema = z
	.object({
		userId: str,
		handle: str,
		displayName: str,
		bio: str,
		followers: num,
		following: num,
		posts: num,
		verified: bool,
		private: bool,
		isBusiness: bool,
		avatarUrl: str,
	})
	.loose();

const MapsSearchInputSchema = z.object({
	query: z
		.string()
		.min(1)
		.describe('What you would type in Google Maps, e.g. coffee shop'),
	location: z.string().min(1).describe('City plus country, e.g. Austin, USA'),
	limit: z.number().int().min(1).max(20).optional(),
	language: z.string().optional().describe('Two-letter language code'),
	placeMinimumStars: z
		.enum(['two', 'twoAndHalf', 'three', 'threeAndHalf', 'four', 'fourAndHalf'])
		.optional(),
	website: z.enum(['allPlaces', 'withWebsite', 'withoutWebsite']).optional(),
	categoryFilterWords: z
		.array(z.string())
		.optional()
		.describe('Google Maps category names to keep'),
	...RunControls,
});

const MapsSearchDataSchema = z
	.object({
		items: z
			.array(
				z
					.object({
						placeId: str,
						name: str,
						category: str,
						address: str,
						city: str,
						phone: str,
						website: str,
						url: str,
						rating: num,
						reviewCount: num,
						latitude: num,
						longitude: num,
						permanentlyClosed: bool,
					})
					.loose(),
			)
			.nullish(),
		nextCursor: str,
	})
	.loose();

// ── Exports ───────────────────────────────────────────────────────────────

export const AnyApiEndpointInputSchemas = {
	apisSearch: ApisSearchInputSchema,
	apisList: ApisListInputSchema,
	apisGet: ApisGetInputSchema,
	apisQuote: ApisQuoteInputSchema,
	apisRun: ApisRunInputSchema,
	resultsGet: ResultsGetInputSchema,
	requestsGet: RequestsGetInputSchema,
	accountGetBalance: AccountGetBalanceInputSchema,
	googleSearch: GoogleSearchInputSchema,
	webScrape: WebScrapeInputSchema,
	linkedinGetProfile: LinkedInGetProfileInputSchema,
	linkedinGetCompany: LinkedInGetCompanyInputSchema,
	twitterSearch: TwitterSearchInputSchema,
	redditSearch: RedditSearchInputSchema,
	instagramGetProfile: InstagramGetProfileInputSchema,
	mapsSearch: MapsSearchInputSchema,
} as const;

export const AnyApiEndpointOutputSchemas = {
	apisSearch: ApisSearchResponseSchema,
	apisList: ApisListResponseSchema,
	apisGet: ApisGetResponseSchema,
	apisQuote: ApisQuoteResponseSchema,
	apisRun: ApisRunResponseSchema,
	resultsGet: ResultsGetResponseSchema,
	requestsGet: RequestSnapshotSchema,
	accountGetBalance: AccountGetBalanceResponseSchema,
	googleSearch: runResult(GoogleSearchDataSchema),
	webScrape: runResult(WebScrapeDataSchema),
	linkedinGetProfile: runResult(LinkedInProfileDataSchema),
	linkedinGetCompany: runResult(LinkedInCompanyDataSchema),
	twitterSearch: runResult(TwitterSearchDataSchema),
	redditSearch: runResult(RedditSearchDataSchema),
	instagramGetProfile: runResult(InstagramProfileDataSchema),
	mapsSearch: runResult(MapsSearchDataSchema),
} as const;

export type AnyApiOperation = keyof typeof AnyApiEndpointInputSchemas;

export type AnyApiEndpointInputs = {
	[K in AnyApiOperation]: z.input<(typeof AnyApiEndpointInputSchemas)[K]>;
};

export type AnyApiEndpointOutputs = {
	[K in AnyApiOperation]: z.infer<(typeof AnyApiEndpointOutputSchemas)[K]>;
};

export type ApisRunInput = AnyApiEndpointInputs['apisRun'];
export type ApisRunResponse = AnyApiEndpointOutputs['apisRun'];
export type RequestSnapshot = z.infer<typeof RequestSnapshotSchema>;
