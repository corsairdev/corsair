import { z } from 'zod';
import {
	BenzingaConferenceCall,
	BenzingaConsensusRating,
	BenzingaDividend,
	BenzingaEarning,
	BenzingaEconomic,
	BenzingaGuidance,
	BenzingaIpo,
	BenzingaNewsArticle,
	BenzingaNewsChannel,
	BenzingaRating,
	BenzingaRemovedCalendarEvent,
	BenzingaRemovedNewsItem,
	BenzingaSplit,
} from '../schema/database';

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

const GetNewsResponseSchema = z.array(BenzingaNewsArticle);

export type GetNewsResponse = z.infer<typeof GetNewsResponseSchema>;

// ─── news.listChannels ───
// GET /api/v2.1/news/channels
// https://docs.benzinga.com/api-reference/news-api/channels/get-available-news-channels
const ListNewsChannelsInputSchema = z.object({});

export type ListNewsChannelsInput = z.infer<typeof ListNewsChannelsInputSchema>;

const ListNewsChannelsResponseSchema = z
	.object({
		ok: z.boolean(),
		data: z.array(BenzingaNewsChannel),
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
const EconomicsImportanceSchema = z.number().int().min(1).max(3);

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

const ListEarningsResponseSchema = z.object({
	earnings: z.array(BenzingaEarning),
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

const ListDividendsResponseSchema = z.object({
	dividends: z.array(BenzingaDividend),
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

const ListRatingsResponseSchema = z.object({
	ratings: z.array(BenzingaRating),
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

const ListGuidanceResponseSchema = z.object({
	guidance: z.array(BenzingaGuidance),
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

export const IpoSchema = BenzingaIpo;

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

const ListSplitsResponseSchema = z.object({
	splits: z.array(BenzingaSplit),
});

export type ListSplitsResponse = z.infer<typeof ListSplitsResponseSchema>;

// ─── calendar.listEconomics ───
// GET /api/v2.1/calendar/economics
// https://docs.benzinga.com/api-reference/calendar-api/get-economics
const ListEconomicsInputSchema = CalendarPaginationSchema.extend(
	CalendarDateFiltersSchema.omit({ tickers: true }).shape,
).extend({
	importance: EconomicsImportanceSchema.optional(),
	country: z.string().optional(),
	event_name: z.string().optional(),
	event_category: z.string().optional(),
});

export type ListEconomicsInput = z.infer<typeof ListEconomicsInputSchema>;

const ListEconomicsResponseSchema = z.object({
	economics: z.array(BenzingaEconomic),
});

export type ListEconomicsResponse = z.infer<typeof ListEconomicsResponseSchema>;

// ─── calendar.listConferenceCalls ───
// GET /api/v2.1/calendar/conference-calls
// https://docs.benzinga.com/api-reference/calendar-api/get-conference-calls
const ListConferenceCallsInputSchema = CalendarPaginationSchema.extend({
	date: CalendarDateSchema.optional(),
	dateFrom: CalendarDateSchema.optional(),
	dateTo: CalendarDateSchema.optional(),
	tickers: z.string().optional(),
	updated: z.number().int().optional(),
});

export type ListConferenceCallsInput = z.infer<
	typeof ListConferenceCallsInputSchema
>;

const ListConferenceCallsResponseSchema = z.object({
	conference: z.array(BenzingaConferenceCall),
});

export type ListConferenceCallsResponse = z.infer<
	typeof ListConferenceCallsResponseSchema
>;

/**
 * The OpenAPI schema names the array `conference-calls`, while the documented
 * 200 example (and the live API) uses `conference`. Both keys are accepted and
 * normalized to `{ conference }` in `endpoints/conference-calls.ts`.
 */
export const ListConferenceCallsRawResponseSchema = z.object({
	conference: z.array(BenzingaConferenceCall).optional(),
	'conference-calls': z.array(BenzingaConferenceCall).optional(),
});

export type ListConferenceCallsRawResponse = z.infer<
	typeof ListConferenceCallsRawResponseSchema
>;

// ─── calendar.getConsensusRatings ───
// GET /api/v1/consensus-ratings
// https://docs.benzinga.com/api-reference/calendar-api/get-consensus-ratings
const GetConsensusRatingsInputSchema = z.object({
	ticker: z.string().min(1),
	pagesize: z.number().int().min(1).max(1000).optional(),
	dateFrom: CalendarDateSchema.optional(),
	dateTo: CalendarDateSchema.optional(),
	simplify: z.boolean().optional(),
	aggregateType: z.enum(['number', 'percentage']).optional(),
});

export type GetConsensusRatingsInput = z.infer<
	typeof GetConsensusRatingsInputSchema
>;

const GetConsensusRatingsResponseSchema = BenzingaConsensusRating.omit({
	ticker: true,
}).loose();

export type GetConsensusRatingsResponse = z.infer<
	typeof GetConsensusRatingsResponseSchema
>;

// ─── calendar.listRemoved ───
// GET /api/v2.1/calendar-removed/
// https://docs.benzinga.com/api-reference/calendar-api/get-removed
const RemovedCalendarTypeSchema = z.enum([
	'ratings',
	'earnings',
	'dividends',
	'splits',
	'ipos',
	'offerings',
	'economics',
	'guidance',
	'ma',
	'conference calls',
]);

const ListRemovedCalendarEventsInputSchema = z.object({
	page: z.number().int().min(0).max(100000).optional(),
	pageSize: z.number().int().min(1).max(1000).optional(),
	type: RemovedCalendarTypeSchema.optional(),
	updated: z.number().int().optional(),
});

export type ListRemovedCalendarEventsInput = z.infer<
	typeof ListRemovedCalendarEventsInputSchema
>;

const ListRemovedCalendarEventsResponseSchema = z.object({
	removed: z.array(BenzingaRemovedCalendarEvent),
});

export type ListRemovedCalendarEventsResponse = z.infer<
	typeof ListRemovedCalendarEventsResponseSchema
>;

// ─── news.listRemoved ───
// GET /api/v2/news-removed
// https://docs.benzinga.com/api-reference/news-api/get-removed-news
const ListRemovedNewsInputSchema = z.object({
	page: z.number().int().min(0).optional(),
	pageSize: z.number().int().min(1).max(1000).optional(),
	updatedSince: z.number().int().optional(),
});

export type ListRemovedNewsInput = z.infer<typeof ListRemovedNewsInputSchema>;

/**
 * Documented as an object whose keys each hold an array of removed items
 * (`additionalProperties: array<api.NewsRemovedItem>`). `updated` is an
 * RFC 2822 timestamp string.
 */
const ListRemovedNewsResponseSchema = z.record(
	z.string(),
	z.array(BenzingaRemovedNewsItem),
);

export type ListRemovedNewsResponse = z.infer<
	typeof ListRemovedNewsResponseSchema
>;

// ─── WebSocket stream connection details ───
// Benzinga streams are WebSocket-only, so these endpoints make no HTTP call.
// They return the connection URL (filters applied, API key left out so it
// never lands in logs or tool output) for the caller to open with
// `token=<api key>` appended.
// https://docs.benzinga.com/ws-reference/data-websocket/get-calendar-earnings-stream
// https://docs.benzinga.com/ws-reference/data-websocket/get-news-stream
const StreamConnectionSchema = z.object({
	url: z.string(),
	authQueryParam: z.literal('token'),
	commands: z.array(z.enum(['ping', 'replay'])),
});

export type StreamConnection = z.infer<typeof StreamConnectionSchema>;

// ─── calendar.getEarningsStream ───
const GetEarningsStreamInputSchema = z.object({
	tickers: z.string().optional(),
	isins: z.string().optional(),
});

export type GetEarningsStreamInput = z.infer<
	typeof GetEarningsStreamInputSchema
>;

// ─── news.getStream ───
const GetNewsStreamInputSchema = z.object({
	tickers: z.string().optional(),
	channels: z.string().optional(),
});

export type GetNewsStreamInput = z.infer<typeof GetNewsStreamInputSchema>;

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
	listConferenceCalls: ListConferenceCallsInput;
	getConsensusRatings: GetConsensusRatingsInput;
	listRemovedCalendarEvents: ListRemovedCalendarEventsInput;
	listRemovedNews: ListRemovedNewsInput;
	getEarningsStream: GetEarningsStreamInput;
	getNewsStream: GetNewsStreamInput;
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
	listConferenceCalls: ListConferenceCallsResponse;
	getConsensusRatings: GetConsensusRatingsResponse;
	listRemovedCalendarEvents: ListRemovedCalendarEventsResponse;
	listRemovedNews: ListRemovedNewsResponse;
	getEarningsStream: StreamConnection;
	getNewsStream: StreamConnection;
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
	listConferenceCalls: ListConferenceCallsInputSchema,
	getConsensusRatings: GetConsensusRatingsInputSchema,
	listRemovedCalendarEvents: ListRemovedCalendarEventsInputSchema,
	listRemovedNews: ListRemovedNewsInputSchema,
	getEarningsStream: GetEarningsStreamInputSchema,
	getNewsStream: GetNewsStreamInputSchema,
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
	listConferenceCalls: ListConferenceCallsResponseSchema,
	getConsensusRatings: GetConsensusRatingsResponseSchema,
	listRemovedCalendarEvents: ListRemovedCalendarEventsResponseSchema,
	listRemovedNews: ListRemovedNewsResponseSchema,
	getEarningsStream: StreamConnectionSchema,
	getNewsStream: StreamConnectionSchema,
} as const;
