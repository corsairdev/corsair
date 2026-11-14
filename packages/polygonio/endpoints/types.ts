import { z } from 'zod';

// Polygon.io is the US market-data API that now publishes as Massive; the hosts
// and routes below are the ones both names serve. Every response carries a
// `status`, and a list carries `results` plus, while another page exists,
// `next_url`. Output objects are `.loose()` with documented fields nullish so a
// field the API adds or omits cannot fail a call that has already happened.
// Reference: https://massive.com/docs/rest/stocks/overview

/** The API's own status values, plus the unset one older payloads omit. */
export const POLYGONIO_STATUSES = ['OK', 'DELAYED', 'ERROR'] as const;

const StatusSchema = z
	.string()
	.nullish()
	.describe('`OK`, `DELAYED` when the plan delays data, or `ERROR`.');

/**
 * The fields every list response shares. `next_url` is absolute and already
 * carries the cursor, so it is passed to `nextPage` as the whole next request.
 */
const listEnvelopeFields = {
	status: StatusSchema,
	request_id: z.string().nullish(),
	count: z.number().nullish().describe('The total number of matching rows.'),
	next_url: z
		.string()
		.nullish()
		.describe(
			'Present while another page exists; pass it to the matching `nextPage`.',
		),
};

// ── aggregates ────────────────────────────────────────────────────────────

/** The time windows the aggregates routes accept. */
export const POLYGONIO_TIMESPANS = [
	'minute',
	'hour',
	'day',
	'week',
	'month',
	'quarter',
	'year',
] as const;

/** One OHLC bar. The API uses single-letter keys, which are kept as sent. */
export const AggregateBarSchema = z
	.object({
		o: z.number().nullish().describe('Open price.'),
		h: z.number().nullish().describe('High price.'),
		l: z.number().nullish().describe('Low price.'),
		c: z.number().nullish().describe('Close price.'),
		v: z.number().nullish().describe('Volume.'),
		vw: z.number().nullish().describe('Volume-weighted average price.'),
		n: z.number().nullish().describe('Number of transactions in the window.'),
		t: z
			.number()
			.nullish()
			.describe('Unix millisecond timestamp at the start of the window.'),
		T: z.string().nullish().describe('The ticker, on single-bar answers.'),
		otc: z
			.boolean()
			.nullish()
			.describe('True for an OTC ticker; the API leaves it off when false.'),
	})
	.loose();

export type PolygonioAggregateBar = z.infer<typeof AggregateBarSchema>;

const aggregatesInputFields = {
	adjusted: z
		.boolean()
		.optional()
		.describe(
			'Whether prices are adjusted for splits. The API adjusts by default.',
		),
	sort: z
		.enum(['asc', 'desc'])
		.optional()
		.describe('Order by timestamp. The API defaults to ascending.'),
	limit: z
		.number()
		.int()
		.min(1)
		.max(50_000)
		.optional()
		.describe(
			'How many base aggregates to read. Defaults to 5000, and the maximum is 50000.',
		),
};

/**
 * The five filters a first bars page needs. They are optional because a
 * `nextUrl` page needs none of them: the URL already carries the range and the
 * cursor. The refinement below requires one form or the other, so a call that
 * names neither is still rejected before anything is sent.
 */
const BARS_FILTER_KEYS = [
	'ticker',
	'multiplier',
	'timespan',
	'from',
	'to',
] as const;

export const BarsInputSchema = z
	.object({
		nextUrl: z
			.string()
			.min(1)
			.optional()
			.describe(
				"The previous answer's `next_url`. When set, the other parameters are ignored and that exact page is fetched, so none of them is required.",
			),
		ticker: z
			.string()
			.min(1)
			.optional()
			.describe('A case-sensitive ticker, such as AAPL.'),
		multiplier: z
			.number()
			.int()
			.positive()
			.optional()
			.describe('The size of each window, such as 5 for a 5-minute bar.'),
		timespan: z
			.enum(POLYGONIO_TIMESPANS)
			.optional()
			.describe('The unit of the window.'),
		from: z
			.string()
			.min(1)
			.optional()
			.describe(
				'Start of the range, as YYYY-MM-DD or a millisecond timestamp.',
			),
		to: z
			.string()
			.min(1)
			.optional()
			.describe(
				'End of the range, inclusive, as YYYY-MM-DD or a millisecond timestamp.',
			),
		...aggregatesInputFields,
	})
	.superRefine((value, ctx) => {
		if (value.nextUrl !== undefined) return;
		for (const key of BARS_FILTER_KEYS) {
			if (value[key] === undefined) {
				ctx.addIssue({
					code: 'custom',
					message: `Supply nextUrl, or all of ${BARS_FILTER_KEYS.join(', ')}. ${key} is missing.`,
					path: [key],
				});
			}
		}
	});

export type BarsInput = z.infer<typeof BarsInputSchema>;

const BarsOutputSchema = z
	.object({
		ticker: z.string().nullish(),
		adjusted: z.boolean().nullish(),
		queryCount: z.number().nullish(),
		resultsCount: z.number().nullish(),
		...listEnvelopeFields,
		// The provider marks `results` optional: a custom-bars or grouped-summary
		// window with no qualifying trades comes back without it, and that is a
		// valid empty result rather than a malformed response.
		results: z.array(AggregateBarSchema).nullish(),
	})
	.loose();

export type BarsOutput = z.infer<typeof BarsOutputSchema>;

const PreviousDayInputSchema = z.object({
	ticker: z.string().min(1).describe('A case-sensitive ticker, such as AAPL.'),
	adjusted: z
		.boolean()
		.optional()
		.describe(
			'Whether prices are adjusted for splits. The API adjusts by default.',
		),
});

export type PreviousDayInput = z.infer<typeof PreviousDayInputSchema>;

const DailySummaryInputSchema = z.object({
	ticker: z.string().min(1).describe('A case-sensitive ticker, such as AAPL.'),
	date: z.string().min(1).describe('The trading date, as YYYY-MM-DD.'),
	adjusted: z
		.boolean()
		.optional()
		.describe(
			'Whether prices are adjusted for splits. The API adjusts by default.',
		),
});

export type DailySummaryInput = z.infer<typeof DailySummaryInputSchema>;

const DailySummaryOutputSchema = z
	.object({
		status: StatusSchema,
		request_id: z.string().nullish(),
		symbol: z.string().nullish(),
		from: z.string().nullish().describe('The trading date OMS resolved.'),
		open: z.number().nullish(),
		high: z.number().nullish(),
		low: z.number().nullish(),
		close: z.number().nullish(),
		volume: z.number().nullish(),
		afterHours: z.number().nullish(),
		preMarket: z.number().nullish(),
	})
	.loose();

export type DailySummaryOutput = z.infer<typeof DailySummaryOutputSchema>;

const MarketSummaryInputSchema = z
	.object({
		nextUrl: z
			.string()
			.min(1)
			.optional()
			.describe(
				"The previous answer's `next_url`. When set, the other parameters are ignored and that exact page is fetched, so `date` is not required.",
			),
		date: z
			.string()
			.min(1)
			.optional()
			.describe(
				'The trading date, as YYYY-MM-DD. A non-trading date returns no rows.',
			),
		...aggregatesInputFields,
	})
	.superRefine((value, ctx) => {
		if (value.nextUrl === undefined && value.date === undefined) {
			ctx.addIssue({
				code: 'custom',
				message: 'Supply nextUrl or date.',
				path: ['date'],
			});
		}
	});

export type MarketSummaryInput = z.infer<typeof MarketSummaryInputSchema>;

// ── snapshots ─────────────────────────────────────────────────────────────

/**
 * The most recent trade. The API uses single-letter keys and sends condition
 * codes as an array of numbers, so the documented members are typed and the
 * rest passes through.
 */
export const SnapshotTradeSchema = z
	.object({
		T: z.string().nullish().describe('The ticker.'),
		p: z.number().nullish().describe('Price.'),
		s: z.number().nullish().describe('Size, in shares.'),
		x: z.number().nullish().describe('The exchange id.'),
		i: z.string().nullish().describe('The trade id.'),
		t: z.number().nullish().describe('Unix nanosecond timestamp.'),
		c: z.array(z.number()).nullish().describe('Trade condition codes.'),
		z: z.number().nullish().describe('The tape.'),
	})
	.loose();

export type PolygonioSnapshotTrade = z.infer<typeof SnapshotTradeSchema>;

/** The most recent quote, with `P`/`S` as the ask and `p`/`s` as the bid. */
export const SnapshotQuoteSchema = z
	.object({
		P: z.number().nullish().describe('Ask price.'),
		S: z.number().nullish().describe('Ask size.'),
		p: z.number().nullish().describe('Bid price.'),
		s: z.number().nullish().describe('Bid size.'),
		t: z.number().nullish().describe('Unix nanosecond timestamp.'),
	})
	.loose();

export type PolygonioSnapshotQuote = z.infer<typeof SnapshotQuoteSchema>;

export const SnapshotTickerSchema = z
	.object({
		ticker: z.string().nullish(),
		todaysChange: z.number().nullish(),
		todaysChangePerc: z.number().nullish(),
		updated: z.number().nullish().describe('Unix nanosecond timestamp.'),
		day: AggregateBarSchema.nullish().describe('The most recent daily bar.'),
		min: AggregateBarSchema.nullish().describe('The most recent minute bar.'),
		prevDay: AggregateBarSchema.nullish().describe("The previous day's bar."),
		lastTrade: SnapshotTradeSchema.nullish(),
		lastQuote: SnapshotQuoteSchema.nullish(),
		fmv: z
			.number()
			.nullish()
			.describe('Fair market value, available only on business plans.'),
	})
	.loose();

export type PolygonioSnapshotTicker = z.infer<typeof SnapshotTickerSchema>;

const SnapshotInputSchema = z.object({
	ticker: z.string().min(1).describe('A case-sensitive ticker, such as AAPL.'),
});

export type SnapshotInput = z.infer<typeof SnapshotInputSchema>;

const SnapshotOutputSchema = z
	.object({
		status: StatusSchema,
		request_id: z.string().nullish(),
		ticker: SnapshotTickerSchema,
	})
	.loose();

export type SnapshotOutput = z.infer<typeof SnapshotOutputSchema>;

export const POLYGONIO_MOVER_DIRECTIONS = ['gainers', 'losers'] as const;

const MoversInputSchema = z.object({
	direction: z
		.enum(POLYGONIO_MOVER_DIRECTIONS)
		.describe('Whether to return the top gainers or the top losers.'),
	include_otc: z
		.boolean()
		.optional()
		.describe('Include OTC securities. The API excludes them by default.'),
});

export type MoversInput = z.infer<typeof MoversInputSchema>;

const MoversOutputSchema = z
	.object({
		status: StatusSchema,
		request_id: z.string().nullish(),
		tickers: z.array(SnapshotTickerSchema),
	})
	.loose();

export type MoversOutput = z.infer<typeof MoversOutputSchema>;

// ── tickers ───────────────────────────────────────────────────────────────

export const TickerSchema = z
	.object({
		ticker: z.string().nullish(),
		name: z.string().nullish(),
		active: z.boolean().nullish().describe('False once the asset is delisted.'),
		type: z.string().nullish().describe('A ticker type code, such as CS.'),
		market: z.string().nullish().describe('`stocks`, `crypto`, `fx` or `otc`.'),
		locale: z.string().nullish().describe('`us` or `global`.'),
		primary_exchange: z.string().nullish().describe('An ISO 10383 MIC.'),
		currency_name: z.string().nullish(),
		cik: z.string().nullish().describe('The SEC Central Index Key.'),
		composite_figi: z.string().nullish(),
		share_class_figi: z.string().nullish(),
		list_date: z.string().nullish().describe('YYYY-MM-DD.'),
		delisted_utc: z.string().nullish(),
		last_updated_utc: z.string().nullish(),
	})
	.loose();

export type PolygonioTicker = z.infer<typeof TickerSchema>;

/** All-tickers filter names are the API's own, so they are kept verbatim. */
export const TickersListInputSchema = z.object({
	nextUrl: z
		.string()
		.min(1)
		.optional()
		.describe(
			"The previous answer's `next_url`. When set, the other parameters are ignored and that exact page is fetched.",
		),
	ticker: z.string().min(1).optional().describe('One exact ticker symbol.'),
	type: z
		.string()
		.min(1)
		.optional()
		.describe('A ticker type code, as `tickerTypes.list` reports them.'),
	market: z
		.string()
		.min(1)
		.optional()
		.describe('A market, such as `stocks`, `crypto`, `fx` or `otc`.'),
	exchange: z
		.string()
		.min(1)
		.optional()
		.describe('An ISO 10383 Market Identifier Code, such as XNYS.'),
	cusip: z
		.string()
		.min(1)
		.optional()
		.describe('A CUSIP. The API accepts it but never returns it.'),
	cik: z.string().min(1).optional().describe('An SEC Central Index Key.'),
	date: z
		.string()
		.min(1)
		.optional()
		.describe('Tickers as they were on this date. Defaults to the latest.'),
	search: z
		.string()
		.min(1)
		.optional()
		.describe('Matches within the ticker and the company name.'),
	active: z
		.boolean()
		.optional()
		.describe(
			'Whether to return only actively traded tickers. Defaults to true.',
		),
	// The API's own parameter names are dotted (`ticker.gte`); a dot cannot be a
	// TypeScript identifier, so these map back to it in the endpoint.
	tickerGte: z
		.string()
		.min(1)
		.optional()
		.describe('Ticker at or after this value.'),
	tickerGt: z.string().min(1).optional().describe('Ticker after this value.'),
	tickerLte: z
		.string()
		.min(1)
		.optional()
		.describe('Ticker at or before this value.'),
	tickerLt: z.string().min(1).optional().describe('Ticker before this value.'),
	order: z
		.enum(['asc', 'desc'])
		.optional()
		.describe('Order by the `sort` field.'),
	sort: z
		.string()
		.min(1)
		.optional()
		.describe('The field to sort on, such as `ticker`.'),
	limit: z
		.number()
		.int()
		.min(1)
		.max(1000)
		.optional()
		.describe('Page size. Defaults to 100, and the maximum is 1000.'),
});

export type TickersListInput = z.infer<typeof TickersListInputSchema>;

const TickersListOutputSchema = z
	.object({
		...listEnvelopeFields,
		results: z.array(TickerSchema),
	})
	.loose();

export type TickersListOutput = z.infer<typeof TickersListOutputSchema>;

const TickerOverviewInputSchema = z.object({
	ticker: z.string().min(1).describe('A case-sensitive ticker, such as AAPL.'),
	date: z
		.string()
		.min(1)
		.optional()
		.describe(
			'Read the ticker as it was on this date, which matters when a symbol was reused. Defaults to the latest.',
		),
});

export type TickerOverviewInput = z.infer<typeof TickerOverviewInputSchema>;

const TickerOverviewOutputSchema = z
	.object({
		...listEnvelopeFields,
		results: TickerSchema,
	})
	.loose();

export type TickerOverviewOutput = z.infer<typeof TickerOverviewOutputSchema>;

const TickerTypesInputSchema = z.object({
	asset_class: z
		.string()
		.min(1)
		.optional()
		.describe('`stocks`, `options`, `crypto`, `fx` or `indices`.'),
	locale: z.string().min(1).optional().describe('`us` or `global`.'),
});

export type TickerTypesInput = z.infer<typeof TickerTypesInputSchema>;

export const TickerTypeSchema = z
	.object({
		code: z.string().nullish(),
		description: z.string().nullish(),
		asset_class: z.string().nullish(),
		locale: z.string().nullish(),
	})
	.loose();

export type PolygonioTickerType = z.infer<typeof TickerTypeSchema>;

const TickerTypesOutputSchema = z
	.object({
		...listEnvelopeFields,
		results: z.array(TickerTypeSchema),
	})
	.loose();

export type TickerTypesOutput = z.infer<typeof TickerTypesOutputSchema>;

// ── market operations ─────────────────────────────────────────────────────

const MarketStatusInputSchema = z.object({});

export type MarketStatusInput = z.infer<typeof MarketStatusInputSchema>;

const MarketStatusOutputSchema = z
	.object({
		// The API sends its own status values here, not the envelope's `OK`.
		market: z
			.string()
			.nullish()
			.describe('`open`, `closed`, `extended-hours` or `early-close`.'),
		earlyHours: z.boolean().nullish(),
		afterHours: z.boolean().nullish(),
		serverTime: z.string().nullish(),
		exchanges: z.record(z.string(), z.string()).nullish(),
		currencies: z.record(z.string(), z.string()).nullish(),
		indicesGroups: z.record(z.string(), z.string()).nullish(),
	})
	.loose();

export type MarketStatusOutput = z.infer<typeof MarketStatusOutputSchema>;

const MarketHolidaysInputSchema = z.object({});

export type MarketHolidaysInput = z.infer<typeof MarketHolidaysInputSchema>;

/**
 * The holidays route answers a bare array rather than the usual envelope, so the
 * output is the array itself. `close` and `open` are only present on a day the
 * exchange shortens.
 */
export const MarketHolidaySchema = z
	.object({
		date: z.string().nullish(),
		exchange: z.string().nullish(),
		name: z.string().nullish(),
		status: z.string().nullish().describe('`closed` or `early-close`.'),
		open: z.string().nullish(),
		close: z.string().nullish(),
	})
	.loose();

export type PolygonioMarketHoliday = z.infer<typeof MarketHolidaySchema>;

const MarketHolidaysOutputSchema = z.object({
	holidays: z.array(MarketHolidaySchema),
});

export type MarketHolidaysOutput = z.infer<typeof MarketHolidaysOutputSchema>;

const ExchangesInputSchema = z.object({
	nextUrl: z
		.string()
		.min(1)
		.optional()
		.describe(
			"The previous answer's `next_url`. When set, the other parameters are ignored and that exact page is fetched.",
		),
	asset_class: z.string().min(1).optional().describe('Filter by asset class.'),
	locale: z.string().min(1).optional().describe('Filter by locale.'),
});

export type ExchangesInput = z.infer<typeof ExchangesInputSchema>;

export const ExchangeSchema = z
	.object({
		id: z.number().nullish(),
		type: z.string().nullish(),
		asset_class: z.string().nullish(),
		locale: z.string().nullish(),
		name: z.string().nullish(),
		acronym: z.string().nullish(),
		mic: z.string().nullish(),
		operating_mic: z.string().nullish(),
		participant_id: z.string().nullish(),
		url: z.string().nullish(),
	})
	.loose();

export type PolygonioExchange = z.infer<typeof ExchangeSchema>;

const ExchangesOutputSchema = z
	.object({
		...listEnvelopeFields,
		results: z.array(ExchangeSchema),
	})
	.loose();

export type ExchangesOutput = z.infer<typeof ExchangesOutputSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type PolygonioEndpointInputs = {
	bars: BarsInput;
	previousDay: PreviousDayInput;
	dailySummary: DailySummaryInput;
	marketSummary: MarketSummaryInput;
	snapshot: SnapshotInput;
	movers: MoversInput;
	tickersList: TickersListInput;
	tickerOverview: TickerOverviewInput;
	tickerTypes: TickerTypesInput;
	marketStatus: MarketStatusInput;
	marketHolidays: MarketHolidaysInput;
	exchanges: ExchangesInput;
};

export type PolygonioEndpointOutputs = {
	bars: BarsOutput;
	previousDay: BarsOutput;
	dailySummary: DailySummaryOutput;
	marketSummary: BarsOutput;
	snapshot: SnapshotOutput;
	movers: MoversOutput;
	tickersList: TickersListOutput;
	tickerOverview: TickerOverviewOutput;
	tickerTypes: TickerTypesOutput;
	marketStatus: MarketStatusOutput;
	marketHolidays: MarketHolidaysOutput;
	exchanges: ExchangesOutput;
};

export const PolygonioEndpointInputSchemas = {
	bars: BarsInputSchema,
	previousDay: PreviousDayInputSchema,
	dailySummary: DailySummaryInputSchema,
	marketSummary: MarketSummaryInputSchema,
	snapshot: SnapshotInputSchema,
	movers: MoversInputSchema,
	tickersList: TickersListInputSchema,
	tickerOverview: TickerOverviewInputSchema,
	tickerTypes: TickerTypesInputSchema,
	marketStatus: MarketStatusInputSchema,
	marketHolidays: MarketHolidaysInputSchema,
	exchanges: ExchangesInputSchema,
} as const;

export const PolygonioEndpointOutputSchemas = {
	bars: BarsOutputSchema,
	previousDay: BarsOutputSchema,
	dailySummary: DailySummaryOutputSchema,
	marketSummary: BarsOutputSchema,
	snapshot: SnapshotOutputSchema,
	movers: MoversOutputSchema,
	tickersList: TickersListOutputSchema,
	tickerOverview: TickerOverviewOutputSchema,
	tickerTypes: TickerTypesOutputSchema,
	marketStatus: MarketStatusOutputSchema,
	marketHolidays: MarketHolidaysOutputSchema,
	exchanges: ExchangesOutputSchema,
} as const;
