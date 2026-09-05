import { z } from 'zod';

/**
 * Benzinga uses `YYYY-MM-DD` calendar dates across the news and calendar APIs
 * (https://docs.benzinga.com/api-reference/news-api/get-news-items,
 * https://docs.benzinga.com/api-reference/calendar-api/get-earnings).
 * The refine rejects impossible dates (e.g. 2026-02-30) that pass the format
 * check, including leap-year handling via UTC component comparison.
 */
const CalendarDateSchema = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD')
	.refine(
		(value) => {
			const [year, month, day] = value.split('-').map(Number);
			if (
				year === undefined ||
				month === undefined ||
				day === undefined ||
				month < 1 ||
				month > 12 ||
				day < 1 ||
				day > 31
			) {
				return false;
			}
			const utc = new Date(Date.UTC(year, month - 1, day));
			return (
				utc.getUTCFullYear() === year &&
				utc.getUTCMonth() === month - 1 &&
				utc.getUTCDate() === day
			);
		},
		{ message: 'Expected a real calendar date (YYYY-MM-DD)' },
	);

const NewsSortSchema = z.enum([
	'id:asc',
	'id:desc',
	'created:asc',
	'created:desc',
	'updated:asc',
	'updated:desc',
]);

const DisplayOutputSchema = z.enum(['full', 'abstract', 'headline']);

const NewsImportanceSchema = z.enum(['low', 'medium', 'high']);

// ─── news.get ───
// GET /api/v2/news
// https://docs.benzinga.com/api-reference/news-api/get-news-items
const GetNewsInputSchema = z.object({
	page: z.number().int().min(0).max(100000).optional(),
	pageSize: z.number().int().min(1).max(100).optional(),
	displayOutput: DisplayOutputSchema.optional(),
	date: CalendarDateSchema.optional(),
	dateFrom: CalendarDateSchema.optional(),
	dateTo: CalendarDateSchema.optional(),
	updatedSince: z.number().int().optional(),
	publishedSince: z.number().int().optional(),
	sort: NewsSortSchema.optional(),
	isin: z.string().optional(),
	cusips: z.string().optional(),
	tickers: z.string().optional(),
	primaryTickers: z.string().optional(),
	channels: z.string().optional(),
	topics: z.string().optional(),
	topic_group_by: z.enum(['and', 'or']).optional(),
	authors: z.string().optional(),
	content_types: z.string().optional(),
	format: z.enum(['text']).optional(),
	importance: NewsImportanceSchema.optional(),
	importanceRank: z.number().int().min(1).max(5).optional(),
	region: z.string().optional(),
});

export type GetNewsInput = z.infer<typeof GetNewsInputSchema>;

const BenzingaImageSchema = z.object({
	size: z.string(),
	url: z.string(),
	alt: z.string().optional(),
});

const BenzingaChannelSchema = z.object({
	name: z.string(),
});

const BenzingaStockSchema = z.object({
	name: z.string(),
	cusip: z.string().optional(),
	isin: z.string().optional(),
	exchange: z.string().optional(),
});

const BenzingaTagSchema = z.object({
	name: z.string(),
});

const GetNewsResponseSchema = z.array(
	z.object({
		id: z.number(),
		author: z.string(),
		created: z.string(),
		updated: z.string(),
		title: z.string(),
		teaser: z.string(),
		body: z.string(),
		url: z.string(),
		image: z.array(BenzingaImageSchema).optional(),
		channels: z.array(BenzingaChannelSchema).optional(),
		stocks: z.array(BenzingaStockSchema).optional(),
		tags: z.array(BenzingaTagSchema).optional(),
		importance_rank: z.number().optional(),
		original_id: z.number().optional(),
	}),
);

export type GetNewsResponse = z.infer<typeof GetNewsResponseSchema>;

// ─── news.listChannels ───
// GET /api/v2.1/news/channels
// https://docs.benzinga.com/api-reference/news-api/channels/get-available-news-channels
const ListNewsChannelsInputSchema = z.object({});

export type ListNewsChannelsInput = z.infer<typeof ListNewsChannelsInputSchema>;

const NewsChannelSchema = z
	.object({
		id: z.number(),
		parent: z.number(),
		channel: z.string(),
		weight: z.number(),
	})
	.loose();

const ListNewsChannelsResponseSchema = z
	.object({
		ok: z.boolean(),
		data: z.array(NewsChannelSchema),
	})
	.loose();

export type ListNewsChannelsResponse = z.infer<
	typeof ListNewsChannelsResponseSchema
>;

// Shared calendar pagination + filters.
// Calendar endpoints page with `page` (0-100000) and `pagesize` (max 1000);
// (https://docs.benzinga.com/api-reference/calendar-api/get-earnings).
const CalendarPaginationSchema = z.object({
	page: z.number().int().min(0).max(100000).optional(),
	pagesize: z.number().int().min(1).max(1000).optional(),
});

const CalendarImportanceSchema = z.number().int().min(0).max(5);

const CalendarDateFiltersSchema = z.object({
	date: CalendarDateSchema.optional(),
	dateFrom: CalendarDateSchema.optional(),
	dateTo: CalendarDateSchema.optional(),
	tickers: z.string().optional(),
	importance: CalendarImportanceSchema.optional(),
	updated: z.number().int().optional(),
});

// ─── calendar.listEarnings ───
// GET /api/v2.1/calendar/earnings
// https://docs.benzinga.com/api-reference/calendar-api/get-earnings
const ListEarningsInputSchema = CalendarPaginationSchema.extend(
	CalendarDateFiltersSchema.shape,
).extend({
	dateSort: z.enum(['date']).optional(),
});

export type ListEarningsInput = z.infer<typeof ListEarningsInputSchema>;

const EarningSchema = z
	.object({
		id: z.string(),
		date: z.string(),
		ticker: z.string(),
		name: z.string(),
		exchange: z.string().optional(),
		currency: z.string().optional(),
		period: z.string().optional(),
		period_year: z.number().optional(),
		eps: z.string().optional(),
		eps_est: z.string().optional(),
		eps_prior: z.string().optional(),
		eps_surprise: z.string().optional(),
		eps_surprise_percent: z.string().optional(),
		eps_type: z.string().optional(),
		revenue: z.string().optional(),
		revenue_est: z.string().optional(),
		revenue_prior: z.string().optional(),
		revenue_surprise: z.string().optional(),
		revenue_surprise_percent: z.string().optional(),
		revenue_type: z.string().optional(),
		importance: z.number().optional(),
		time: z.string().optional(),
		updated: z.number().optional(),
		notes: z.string().optional(),
	})
	.loose();

const ListEarningsResponseSchema = z.object({
	earnings: z.array(EarningSchema),
});

export type ListEarningsResponse = z.infer<typeof ListEarningsResponseSchema>;

// ─── calendar.listDividends ───
// GET /api/v2.2/calendar/dividends
// https://docs.benzinga.com/api-reference/calendar-api/get-dividends
const ListDividendsInputSchema = CalendarPaginationSchema.extend(
	CalendarDateFiltersSchema.shape,
).extend({
	dateSort: z.enum(['announced', 'ex', 'payable', 'record']).optional(),
	dividend_yield: z.number().optional(),
	dividend_yield_operation: z.enum(['gt', 'gte', 'eq', 'lte', 'lt']).optional(),
});

export type ListDividendsInput = z.infer<typeof ListDividendsInputSchema>;

const DividendSchema = z
	.object({
		id: z.string(),
		date: z.string(),
		ticker: z.string(),
		name: z.string(),
		exchange: z.string().optional(),
		currency: z.string().optional(),
		dividend: z.string().optional(),
		dividend_prior: z.string().optional(),
		dividend_type: z.string().optional(),
		dividend_yield: z.string().optional(),
		ex_dividend_date: z.string().optional(),
		payable_date: z.string().optional(),
		record_date: z.string().optional(),
		frequency: z.number().optional(),
		confirmed: z.boolean().optional(),
		period: z.string().optional(),
		year: z.number().optional(),
		importance: z.number().optional(),
		updated: z.number().optional(),
		notes: z.string().optional(),
	})
	.loose();

const ListDividendsResponseSchema = z.object({
	dividends: z.array(DividendSchema),
});

export type ListDividendsResponse = z.infer<typeof ListDividendsResponseSchema>;

// ─── calendar.listRatings ───
// GET /api/v2.1/calendar/ratings
// https://docs.benzinga.com/api-reference/calendar-api/get-ratings
const RatingsActionSchema = z.enum([
	'Downgrades',
	'Maintains',
	'Reinstates',
	'Reiterates',
	'Upgrades',
	'Assumes',
	'Initiates Coverage On',
	'Terminates Coverage On',
	'Removes',
	'Suspends',
	'Firm Dissolved',
]);

const ListRatingsInputSchema = CalendarPaginationSchema.extend(
	CalendarDateFiltersSchema.shape,
).extend({
	fields: z.string().optional(),
	analyst_id: z.string().optional(),
	firm_id: z.string().optional(),
	action: RatingsActionSchema.optional(),
	analyst: z.string().optional(),
	firm: z.string().optional(),
	simplify: z.boolean().optional(),
});

export type ListRatingsInput = z.infer<typeof ListRatingsInputSchema>;

const RatingSchema = z
	.object({
		id: z.string(),
		date: z.string(),
		ticker: z.string(),
		name: z.string(),
		analyst: z.string().optional(),
		analyst_id: z.string().optional(),
		analyst_name: z.string().optional(),
		firm_id: z.string().optional(),
		action_company: z.string().optional(),
		action_pt: z.string().optional(),
		rating_current: z.string().optional(),
		rating_prior: z.string().optional(),
		pt_current: z.string().optional(),
		pt_prior: z.string().optional(),
		pt_pct_change: z.string().optional(),
		currency: z.string().optional(),
		importance: z.number().optional(),
		time: z.string().optional(),
		updated: z.number().optional(),
		url: z.string().optional(),
		notes: z.string().optional(),
	})
	.loose();

const ListRatingsResponseSchema = z.object({
	ratings: z.array(RatingSchema),
});

export type ListRatingsResponse = z.infer<typeof ListRatingsResponseSchema>;

// ─── calendar.listGuidance ───
// GET /api/v2.1/calendar/guidance
// https://docs.benzinga.com/api-reference/calendar-api/get-guidance
const ListGuidanceInputSchema = CalendarPaginationSchema.extend(
	CalendarDateFiltersSchema.shape,
).extend({
	is_primary: z.enum(['Y', 'N', 'All']).optional(),
});

export type ListGuidanceInput = z.infer<typeof ListGuidanceInputSchema>;

const GuidanceSchema = z
	.object({
		id: z.string(),
		date: z.string(),
		ticker: z.string(),
		name: z.string(),
		exchange: z.string().optional(),
		currency: z.string().optional(),
		period: z.string().optional(),
		period_year: z.number().optional(),
		eps_guidance_min: z.string().optional(),
		eps_guidance_max: z.string().optional(),
		eps_guidance_est: z.string().optional(),
		revenue_guidance_min: z.string().optional(),
		revenue_guidance_max: z.string().optional(),
		revenue_guidance_est: z.string().optional(),
		is_primary: z.string().optional(),
		importance: z.number().optional(),
		time: z.string().optional(),
		updated: z.number().optional(),
		notes: z.string().optional(),
	})
	.loose();

const ListGuidanceResponseSchema = z.object({
	guidance: z.array(GuidanceSchema),
});

export type ListGuidanceResponse = z.infer<typeof ListGuidanceResponseSchema>;

// ─── calendar.listIpos ───
// GET /api/v2.1/calendar/ipos
// https://docs.benzinga.com/api-reference/calendar-api/get-ipos
const ListIposInputSchema = z.object({
	page: z.number().int().min(0).max(100000).optional(),
	pagesize: z.number().int().min(1).max(1000).optional(),
	ipo_date: CalendarDateSchema.optional(),
	date_from: CalendarDateSchema.optional(),
	date_to: CalendarDateSchema.optional(),
	tickers: z.string().optional(),
	ipo_type: z.string().optional(),
	updated: z.number().int().optional(),
});

export type ListIposInput = z.infer<typeof ListIposInputSchema>;

export const IpoSchema = z
	.object({
		id: z.string(),
		date: z.string(),
		ticker: z.string(),
		name: z.string(),
		exchange: z.string().optional(),
		deal_status: z.string().optional(),
		ipo_type: z.string().optional(),
		price_public_offering: z.string().optional(),
		price_min: z.string().optional(),
		price_max: z.string().optional(),
		offering_shares: z.number().optional(),
		updated: z.number().optional(),
		notes: z.string().optional(),
	})
	.loose();

export type Ipo = z.infer<typeof IpoSchema>;

const ListIposResponseSchema = z.object({
	ipos: z.array(IpoSchema),
});

export type ListIposResponse = z.infer<typeof ListIposResponseSchema>;

/**
 * The IPOs endpoint is documented as `{ ipos: [...] }`
 * (https://docs.benzinga.com/api-reference/calendar-api/get-ipos) but the
 * live API returns a bare array. Both shapes are accepted, then normalized
 * to `{ ipos }` in `endpoints/ipos.ts`.
 */
export const ListIposRawResponseSchema = z.union([
	ListIposResponseSchema,
	z.array(IpoSchema),
]);

export type ListIposRawResponse = z.infer<typeof ListIposRawResponseSchema>;

// ─── calendar.listSplits ───
// GET /api/v2.1/calendar/splits
// https://docs.benzinga.com/api-reference/calendar-api/get-splits
const ListSplitsInputSchema = CalendarPaginationSchema.extend(
	CalendarDateFiltersSchema.shape,
).extend({
	date_search_field: z.enum(['announced', 'ex']).optional(),
});

export type ListSplitsInput = z.infer<typeof ListSplitsInputSchema>;

const SplitSchema = z
	.object({
		id: z.string(),
		ticker: z.string(),
		name: z.string(),
		exchange: z.string().optional(),
		ratio: z.string().optional(),
		split_type: z.string().optional(),
		date_announced: z.string().optional(),
		date_ex: z.string().optional(),
		date_distribution: z.string().optional(),
		date_recorded: z.string().optional(),
		optionable: z.boolean().optional(),
		importance: z.number().optional(),
		updated: z.number().optional(),
		notes: z.string().optional(),
	})
	.loose();

const ListSplitsResponseSchema = z.object({
	splits: z.array(SplitSchema),
});

export type ListSplitsResponse = z.infer<typeof ListSplitsResponseSchema>;

// ─── calendar.listEconomics ───
// GET /api/v2.1/calendar/economics
// https://docs.benzinga.com/api-reference/calendar-api/get-economics
const ListEconomicsInputSchema = CalendarPaginationSchema.extend(
	CalendarDateFiltersSchema.shape,
).extend({
	country: z.string().optional(),
	event_name: z.string().optional(),
	event_category: z.string().optional(),
});

export type ListEconomicsInput = z.infer<typeof ListEconomicsInputSchema>;

const EconomicSchema = z
	.object({
		id: z.string(),
		date: z.string(),
		event_name: z.string(),
		event_category: z.string().optional(),
		country: z.string().optional(),
		actual: z.string().optional(),
		consensus: z.string().optional(),
		prior: z.string().optional(),
		period_year: z.number().optional(),
		importance: z.number().optional(),
		time: z.string().optional(),
		updated: z.number().optional(),
		description: z.string().optional(),
		notes: z.string().optional(),
	})
	.loose();

const ListEconomicsResponseSchema = z.object({
	economics: z.array(EconomicSchema),
});

export type ListEconomicsResponse = z.infer<typeof ListEconomicsResponseSchema>;

export type BenzingaEndpointInputs = {
	getNews: GetNewsInput;
	listNewsChannels: ListNewsChannelsInput;
	listEarnings: ListEarningsInput;
	listDividends: ListDividendsInput;
	listRatings: ListRatingsInput;
	listGuidance: ListGuidanceInput;
	listIpos: ListIposInput;
	listSplits: ListSplitsInput;
	listEconomics: ListEconomicsInput;
};

export type BenzingaEndpointOutputs = {
	getNews: GetNewsResponse;
	listNewsChannels: ListNewsChannelsResponse;
	listEarnings: ListEarningsResponse;
	listDividends: ListDividendsResponse;
	listRatings: ListRatingsResponse;
	listGuidance: ListGuidanceResponse;
	listIpos: ListIposResponse;
	listSplits: ListSplitsResponse;
	listEconomics: ListEconomicsResponse;
};

export const BenzingaEndpointInputSchemas = {
	getNews: GetNewsInputSchema,
	listNewsChannels: ListNewsChannelsInputSchema,
	listEarnings: ListEarningsInputSchema,
	listDividends: ListDividendsInputSchema,
	listRatings: ListRatingsInputSchema,
	listGuidance: ListGuidanceInputSchema,
	listIpos: ListIposInputSchema,
	listSplits: ListSplitsInputSchema,
	listEconomics: ListEconomicsInputSchema,
} as const;

export const BenzingaEndpointOutputSchemas = {
	getNews: GetNewsResponseSchema,
	listNewsChannels: ListNewsChannelsResponseSchema,
	listEarnings: ListEarningsResponseSchema,
	listDividends: ListDividendsResponseSchema,
	listRatings: ListRatingsResponseSchema,
	listGuidance: ListGuidanceResponseSchema,
	listIpos: ListIposResponseSchema,
	listSplits: ListSplitsResponseSchema,
	listEconomics: ListEconomicsResponseSchema,
} as const;
