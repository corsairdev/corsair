import { z } from 'zod';

// Prerender.io serves pre-rendered HTML to crawlers, and its REST API controls
// that cache. Seven routes, each taking the token in the JSON body except the
// status route, which takes it in the path. Outputs are `.loose()` with
// documented fields nullish, so a field Prerender adds or omits cannot fail a
// call that has already happened.
// Reference: https://docs.prerender.io/docs/6-api

/** The two device variants a page can be cached for. */
export const PRERENDER_ADAPTIVE_TYPES = ['desktop', 'mobile'] as const;

const AdaptiveTypeSchema = z
	.enum(PRERENDER_ADAPTIVE_TYPES)
	.optional()
	.describe('Which cached variant to act on. Defaults to desktop.');

const UrlSchema = z
	.string()
	.min(1)
	.describe('An absolute URL, including its scheme.');

// ── recache ───────────────────────────────────────────────────────────────

/**
 * Recache takes either one `url` or a `urls` list, never both. The API caps a
 * list at 1000.
 */
export const RecacheInputSchema = z
	.object({
		url: UrlSchema.optional(),
		urls: z
			.array(UrlSchema)
			.min(1)
			.max(1000)
			.optional()
			.describe('Up to 1000 URLs, which is the API limit per request.'),
		adaptiveType: AdaptiveTypeSchema,
	})
	.superRefine((value, ctx) => {
		if (value.url === undefined && value.urls === undefined) {
			ctx.addIssue({
				code: 'custom',
				message: 'Supply `url` or `urls`.',
				path: ['url'],
			});
		}
		if (value.url !== undefined && value.urls !== undefined) {
			ctx.addIssue({
				code: 'custom',
				message: 'Supply `url` or `urls`, not both.',
				path: ['urls'],
			});
		}
	});

export type RecacheInput = z.infer<typeof RecacheInputSchema>;

/**
 * The route answers a short confirmation. Its exact words are not documented, so
 * the schema accepts a message and treats the absence of an error as success.
 */
const ConfirmationSchema = z
	.object({
		message: z.string().nullish(),
		success: z.boolean().nullish(),
	})
	.loose();

export type PrerenderConfirmation = z.infer<typeof ConfirmationSchema>;

// ── search ────────────────────────────────────────────────────────────────

export const SearchInputSchema = z
	.object({
		query: z
			.string()
			.min(1)
			.optional()
			.describe('A substring match against the cached URLs.'),
		exactMatch: z
			.string()
			.min(1)
			.optional()
			.describe(
				'Only the URL identical to this. When both are given, only this is used.',
			),
		start: z
			.number()
			.int()
			.min(0)
			.optional()
			.describe('Paging offset. Each page holds 200 URLs.'),
		adaptiveType: AdaptiveTypeSchema,
	})
	.superRefine((value, ctx) => {
		// A search with neither filter would return the whole cache, which is a
		// different intent from the one the route documents.
		if (value.query === undefined && value.exactMatch === undefined) {
			ctx.addIssue({
				code: 'custom',
				message: 'Supply `query` or `exactMatch`.',
				path: ['query'],
			});
		}
	});

export type SearchInput = z.infer<typeof SearchInputSchema>;

/** One cached URL. The docs name the fields this way and pass extras through. */
export const CachedUrlSchema = z
	.object({
		url: z.string().nullish(),
		cachedUrl: z
			.string()
			.nullish()
			.describe('The cached copy, when the API returns one.'),
		status: z
			.string()
			.nullish()
			.describe('The cache status, such as `Cached` or `Not Cached`.'),
		lastCached: z.string().nullish(),
		expires: z.string().nullish(),
		adaptiveType: z.string().nullish(),
	})
	.loose();

export type PrerenderCachedUrl = z.infer<typeof CachedUrlSchema>;

const SearchOutputSchema = z
	.object({
		urls: z.array(CachedUrlSchema),
		// The API also answers a bare count on some plans; keeping both optional
		// means either shape parses without inventing a page.
		totalCount: z.number().nullish(),
	})
	.loose();

export type SearchOutput = z.infer<typeof SearchOutputSchema>;

// ── sitemap ───────────────────────────────────────────────────────────────

const SitemapInputSchema = z.object({
	url: UrlSchema.describe('The sitemap XML URL to read new URLs from.'),
	adaptiveType: AdaptiveTypeSchema,
});

export type SitemapInput = z.infer<typeof SitemapInputSchema>;

// ── cache clear ───────────────────────────────────────────────────────────

export const CacheClearInputSchema = z.object({
	query: z
		.string()
		.min(1)
		.describe(
			'A SQL-like pattern: `%` matches any run of characters, `?` matches one. A trailing `%` clears everything under that prefix.',
		),
});

export type CacheClearInput = z.infer<typeof CacheClearInputSchema>;

const CacheClearOutputSchema = z
	.object({
		message: z.string().nullish(),
		success: z.boolean().nullish(),
	})
	.loose();

export type CacheClearOutput = z.infer<typeof CacheClearOutputSchema>;

const CacheClearStatusInputSchema = z.object({});

export type CacheClearStatusInput = z.infer<typeof CacheClearStatusInputSchema>;

/**
 * The status route answers 200 when no job is queued and 403 while one runs, so
 * a 403 here is a state rather than a failure. The client raises it as an error
 * like any other, and the returned body carries whatever text accompanied it.
 */
const CacheClearStatusOutputSchema = z
	.object({
		message: z.string().nullish(),
		inProgress: z
			.boolean()
			.nullish()
			.describe('True while a clear job is running.'),
	})
	.loose();

export type CacheClearStatusOutput = z.infer<
	typeof CacheClearStatusOutputSchema
>;

// ── recache speed ─────────────────────────────────────────────────────────

/** The documented bounds on a manual speed, with `0` meaning automatic. */
export const PRERENDER_MIN_URLS_PER_HOUR = 3600;
export const PRERENDER_MAX_URLS_PER_HOUR = 36_000;

export const ChangeSpeedInputSchema = z.object({
	urlsPerHour: z
		.number()
		.int()
		.min(0)
		.max(PRERENDER_MAX_URLS_PER_HOUR)
		.superRefine((value, ctx) => {
			// The docs allow either 0 for automatic delay or a value in the manual
			// band; anything between 1 and 3599 is rejected by the API.
			if (
				value !== 0 &&
				(value < PRERENDER_MIN_URLS_PER_HOUR ||
					value > PRERENDER_MAX_URLS_PER_HOUR)
			) {
				ctx.addIssue({
					code: 'custom',
					message: `Use 0 for automatic delay, or a value from ${PRERENDER_MIN_URLS_PER_HOUR} to ${PRERENDER_MAX_URLS_PER_HOUR}.`,
				});
			}
		})
		.describe(
			'How many URLs to recache per hour. `0` restores the automatic delay.',
		),
});

export type ChangeSpeedInput = z.infer<typeof ChangeSpeedInputSchema>;

/** How many pages the chosen speed will cache in each window. */
export const RecacheMetricsSchema = z
	.object({
		delayBetweenURLs: z.number().nullish(),
		num10Sec: z.number().nullish(),
		num30Sec: z.number().nullish(),
		num1Min: z.number().nullish(),
		num10Min: z.number().nullish(),
		num1Hour: z.number().nullish(),
		num1Day: z.number().nullish(),
	})
	.loose();

export type PrerenderRecacheMetrics = z.infer<typeof RecacheMetricsSchema>;

const ChangeSpeedOutputSchema = z.object({
	success: z.boolean(),
	recacheMetrics: RecacheMetricsSchema.nullish(),
	isAutomaticDelay: z.boolean(),
});

export type ChangeSpeedOutput = z.infer<typeof ChangeSpeedOutputSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type PrerenderEndpointInputs = {
	recache: RecacheInput;
	search: SearchInput;
	sitemap: SitemapInput;
	cacheClear: CacheClearInput;
	cacheClearStatus: CacheClearStatusInput;
	changeSpeed: ChangeSpeedInput;
};

export type PrerenderEndpointOutputs = {
	recache: PrerenderConfirmation;
	search: SearchOutput;
	sitemap: PrerenderConfirmation;
	cacheClear: CacheClearOutput;
	cacheClearStatus: CacheClearStatusOutput;
	changeSpeed: ChangeSpeedOutput;
};

export const PrerenderEndpointInputSchemas = {
	recache: RecacheInputSchema,
	search: SearchInputSchema,
	sitemap: SitemapInputSchema,
	cacheClear: CacheClearInputSchema,
	cacheClearStatus: CacheClearStatusInputSchema,
	changeSpeed: ChangeSpeedInputSchema,
} as const;

export const PrerenderEndpointOutputSchemas = {
	recache: ConfirmationSchema,
	search: SearchOutputSchema,
	sitemap: ConfirmationSchema,
	cacheClear: CacheClearOutputSchema,
	cacheClearStatus: CacheClearStatusOutputSchema,
	changeSpeed: ChangeSpeedOutputSchema,
} as const;
