/**
 * Exercises every one of the 56 endpoint wrappers: the provider function each
 * one calls, the query it builds, the emptiness checks it applies and the cache
 * writes it performs. Network access is mocked, so this runs in CI.
 */
import { logEventFromContext } from 'corsair/core';
import {
	Commodities,
	Crypto,
	Economic,
	Forex,
	Fundamentals,
	Intelligence,
	Market,
	Technical,
	TimeSeries,
} from './endpoints';

// The event-log payload is asserted directly further down: it is the one place
// caller-supplied text could leak into durable storage, so it needs to be
// inspected rather than inferred.
jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

type Store = { upsertByEntityId: jest.Mock };

function makeStore(): Store {
	return { upsertByEntityId: jest.fn(async () => undefined) };
}

// The endpoints only touch `key`, `db` and the event-logging members.
type Ctx = Parameters<typeof TimeSeries.daily>[0];

function makeCtx() {
	const db = { symbols: makeStore(), companies: makeStore() };
	const ctx = {
		key: 'test-alphavantage-key',
		db,
		database: undefined,
		$getAccountId: async () => 'test-account',
	} as unknown as Ctx;
	return { ctx, db };
}

let lastUrl: string | undefined;

function mockJson(body: unknown) {
	global.fetch = (async (url: string) => {
		lastUrl = String(url);
		return {
			ok: true,
			status: 200,
			statusText: 'OK',
			url: String(url),
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => body,
			text: async () => JSON.stringify(body),
		};
	}) as unknown as typeof global.fetch;
}

function mockCsv(text: string) {
	global.fetch = (async (url: string) => {
		lastUrl = String(url);
		return {
			ok: true,
			status: 200,
			statusText: 'OK',
			url: String(url),
			headers: new Headers({ 'Content-Type': 'application/x-download' }),
			json: async () => JSON.parse(text),
			text: async () => text,
		};
	}) as unknown as typeof global.fetch;
}

const query = () => new URL(lastUrl ?? '').searchParams;

/* -- response fixtures, shaped like the live payloads --------------------- */

const SERIES = {
	'Meta Data': { '2. Symbol': 'IBM' },
	'Time Series (Daily)': {
		'2026-08-12': {
			'1. open': '236.31',
			'2. high': '241.80',
			'3. low': '235.44',
			'4. close': '238.42',
			'5. volume': '4468987',
		},
	},
};

const INDICATOR_SERIES = {
	name: 'Global Price of Wheat',
	interval: 'monthly',
	unit: 'dollar per metric ton',
	data: [{ date: '2026-06-01', value: '199.64' }],
};

const QUOTE = {
	'Global Quote': {
		'01. symbol': 'IBM',
		'02. open': '236.3100',
		'03. high': '241.8000',
		'04. low': '235.4400',
		'05. price': '238.4200',
		'06. volume': '4468987',
		'07. latest trading day': '2026-08-11',
		'08. previous close': '236.3100',
		'09. change': '2.1100',
		'10. change percent': '0.8929%',
	},
};

const STATEMENT = {
	symbol: 'IBM',
	annualReports: [{ fiscalDateEnding: '2025-12-31', reportedCurrency: 'USD' }],
	quarterlyReports: [
		{ fiscalDateEnding: '2026-06-30', reportedCurrency: 'USD' },
	],
};

beforeEach(() => {
	lastUrl = undefined;
	// Otherwise call counts and "last call" assertions accumulate across the
	// whole file.
	mockLogEvent.mockClear();
});

/* -- every operation calls the function it should -------------------------- */

type Case = {
	/** Operation path as it appears in the registry. */
	name: string;
	/** The provider `function=` value expected on the wire. */
	fn: string;
	run: (ctx: Ctx) => Promise<unknown>;
	body?: unknown;
	csv?: string;
};

const CSV_FIXTURE =
	'symbol,name,exchange\nIBM,International Business Machines,NYSE\n';

const CASES: Case[] = [
	// timeSeries (9)
	{
		name: 'timeSeries.intraday',
		fn: 'TIME_SERIES_INTRADAY',
		body: SERIES,
		run: (c) => TimeSeries.intraday(c, { symbol: 'IBM', interval: '5min' }),
	},
	{
		name: 'timeSeries.intradayExtended',
		fn: 'TIME_SERIES_INTRADAY',
		body: SERIES,
		run: (c) =>
			TimeSeries.intradayExtended(c, { symbol: 'IBM', interval: '5min' }),
	},
	{
		name: 'timeSeries.daily',
		fn: 'TIME_SERIES_DAILY',
		body: SERIES,
		run: (c) => TimeSeries.daily(c, { symbol: 'IBM' }),
	},
	{
		name: 'timeSeries.weekly',
		fn: 'TIME_SERIES_WEEKLY',
		body: SERIES,
		run: (c) => TimeSeries.weekly(c, { symbol: 'IBM' }),
	},
	{
		name: 'timeSeries.weeklyAdjusted',
		fn: 'TIME_SERIES_WEEKLY_ADJUSTED',
		body: SERIES,
		run: (c) => TimeSeries.weeklyAdjusted(c, { symbol: 'IBM' }),
	},
	{
		name: 'timeSeries.monthly',
		fn: 'TIME_SERIES_MONTHLY',
		body: SERIES,
		run: (c) => TimeSeries.monthly(c, { symbol: 'IBM' }),
	},
	{
		name: 'timeSeries.monthlyAdjusted',
		fn: 'TIME_SERIES_MONTHLY_ADJUSTED',
		body: SERIES,
		run: (c) => TimeSeries.monthlyAdjusted(c, { symbol: 'IBM' }),
	},
	{
		name: 'timeSeries.globalQuote',
		fn: 'GLOBAL_QUOTE',
		body: QUOTE,
		run: (c) => TimeSeries.globalQuote(c, { symbol: 'IBM' }),
	},
	{
		name: 'timeSeries.realtimeBulkQuotes',
		fn: 'REALTIME_BULK_QUOTES',
		body: { endpoint: 'Realtime Bulk Quotes' },
		run: (c) => TimeSeries.realtimeBulkQuotes(c, { symbols: ['IBM', 'AAPL'] }),
	},

	// market (5)
	{
		name: 'market.symbolSearch',
		fn: 'SYMBOL_SEARCH',
		body: { bestMatches: [] },
		run: (c) => Market.symbolSearch(c, { keywords: 'tesco' }),
	},
	{
		name: 'market.status',
		fn: 'MARKET_STATUS',
		body: { endpoint: 'x', markets: [] },
		run: (c) => Market.status(c, {}),
	},
	{
		name: 'market.topGainersLosers',
		fn: 'TOP_GAINERS_LOSERS',
		body: {
			metadata: 'x',
			last_updated: 'y',
			top_gainers: [],
			top_losers: [],
			most_actively_traded: [],
		},
		run: (c) => Market.topGainersLosers(c, {}),
	},
	{
		name: 'market.listingStatus',
		fn: 'LISTING_STATUS',
		csv: CSV_FIXTURE,
		run: (c) => Market.listingStatus(c, {}),
	},
	{
		name: 'market.sector',
		fn: 'SECTOR',
		body: {},
		run: (c) => Market.sector(c, {}),
	},

	// fundamentals (10)
	{
		name: 'fundamentals.companyOverview',
		fn: 'OVERVIEW',
		body: {
			Symbol: 'IBM',
			AssetType: 'Common Stock',
			Name: 'IBM',
			Description: 'd',
			Exchange: 'NYSE',
			Currency: 'USD',
			Country: 'USA',
			Sector: 'TECH',
			Industry: 'IT',
			MarketCapitalization: '1',
		},
		run: (c) => Fundamentals.companyOverview(c, { symbol: 'IBM' }),
	},
	{
		name: 'fundamentals.incomeStatement',
		fn: 'INCOME_STATEMENT',
		body: STATEMENT,
		run: (c) => Fundamentals.incomeStatement(c, { symbol: 'IBM' }),
	},
	{
		name: 'fundamentals.balanceSheet',
		fn: 'BALANCE_SHEET',
		body: STATEMENT,
		run: (c) => Fundamentals.balanceSheet(c, { symbol: 'IBM' }),
	},
	{
		name: 'fundamentals.cashFlow',
		fn: 'CASH_FLOW',
		body: STATEMENT,
		run: (c) => Fundamentals.cashFlow(c, { symbol: 'IBM' }),
	},
	{
		name: 'fundamentals.earnings',
		fn: 'EARNINGS',
		body: { symbol: 'IBM', annualEarnings: [], quarterlyEarnings: [] },
		run: (c) => Fundamentals.earnings(c, { symbol: 'IBM' }),
	},
	{
		name: 'fundamentals.earningsCalendar',
		fn: 'EARNINGS_CALENDAR',
		csv: CSV_FIXTURE,
		run: (c) => Fundamentals.earningsCalendar(c, {}),
	},
	{
		name: 'fundamentals.earningsCallTranscript',
		fn: 'EARNINGS_CALL_TRANSCRIPT',
		body: { symbol: 'IBM', quarter: '2024Q1', transcript: [] },
		run: (c) =>
			Fundamentals.earningsCallTranscript(c, {
				symbol: 'IBM',
				quarter: '2024Q1',
			}),
	},
	{
		name: 'fundamentals.ipoCalendar',
		fn: 'IPO_CALENDAR',
		csv: CSV_FIXTURE,
		run: (c) => Fundamentals.ipoCalendar(c, {}),
	},
	{
		name: 'fundamentals.dividends',
		fn: 'DIVIDENDS',
		body: { symbol: 'IBM', data: [] },
		run: (c) => Fundamentals.dividends(c, { symbol: 'IBM' }),
	},
	{
		name: 'fundamentals.splits',
		fn: 'SPLITS',
		body: { symbol: 'IBM', data: [] },
		run: (c) => Fundamentals.splits(c, { symbol: 'IBM' }),
	},

	// forex (5)
	{
		name: 'forex.exchangeRate',
		fn: 'CURRENCY_EXCHANGE_RATE',
		body: {
			'Realtime Currency Exchange Rate': {
				'1. From_Currency Code': 'USD',
				'2. From_Currency Name': 'US Dollar',
				'3. To_Currency Code': 'JPY',
				'4. To_Currency Name': 'Yen',
				'5. Exchange Rate': '159.4',
				'6. Last Refreshed': 'now',
				'7. Time Zone': 'UTC',
			},
		},
		run: (c) =>
			Forex.exchangeRate(c, { from_currency: 'USD', to_currency: 'JPY' }),
	},
	{
		name: 'forex.intraday',
		fn: 'FX_INTRADAY',
		body: SERIES,
		run: (c) =>
			Forex.intraday(c, {
				from_symbol: 'EUR',
				to_symbol: 'USD',
				interval: '5min',
			}),
	},
	{
		name: 'forex.daily',
		fn: 'FX_DAILY',
		body: SERIES,
		run: (c) => Forex.daily(c, { from_symbol: 'EUR', to_symbol: 'USD' }),
	},
	{
		name: 'forex.weekly',
		fn: 'FX_WEEKLY',
		body: SERIES,
		run: (c) => Forex.weekly(c, { from_symbol: 'EUR', to_symbol: 'USD' }),
	},
	{
		name: 'forex.monthly',
		fn: 'FX_MONTHLY',
		body: SERIES,
		run: (c) => Forex.monthly(c, { from_symbol: 'EUR', to_symbol: 'USD' }),
	},

	// crypto (4)
	{
		name: 'crypto.intraday',
		fn: 'CRYPTO_INTRADAY',
		body: SERIES,
		run: (c) =>
			Crypto.intraday(c, { symbol: 'BTC', market: 'USD', interval: '5min' }),
	},
	{
		name: 'crypto.daily',
		fn: 'DIGITAL_CURRENCY_DAILY',
		body: SERIES,
		run: (c) => Crypto.daily(c, { symbol: 'BTC', market: 'USD' }),
	},
	{
		name: 'crypto.weekly',
		fn: 'DIGITAL_CURRENCY_WEEKLY',
		body: SERIES,
		run: (c) => Crypto.weekly(c, { symbol: 'BTC', market: 'USD' }),
	},
	{
		name: 'crypto.monthly',
		fn: 'DIGITAL_CURRENCY_MONTHLY',
		body: SERIES,
		run: (c) => Crypto.monthly(c, { symbol: 'BTC', market: 'USD' }),
	},

	// commodities (9)
	{
		name: 'commodities.all',
		fn: 'ALL_COMMODITIES',
		body: INDICATOR_SERIES,
		run: (c) => Commodities.all(c, {}),
	},
	{
		name: 'commodities.aluminum',
		fn: 'ALUMINUM',
		body: INDICATOR_SERIES,
		run: (c) => Commodities.aluminum(c, {}),
	},
	{
		name: 'commodities.brent',
		fn: 'BRENT',
		body: INDICATOR_SERIES,
		run: (c) => Commodities.brent(c, { interval: 'daily' }),
	},
	{
		name: 'commodities.coffee',
		fn: 'COFFEE',
		body: INDICATOR_SERIES,
		run: (c) => Commodities.coffee(c, {}),
	},
	{
		name: 'commodities.copper',
		fn: 'COPPER',
		body: INDICATOR_SERIES,
		run: (c) => Commodities.copper(c, {}),
	},
	{
		name: 'commodities.corn',
		fn: 'CORN',
		body: INDICATOR_SERIES,
		run: (c) => Commodities.corn(c, {}),
	},
	{
		name: 'commodities.cotton',
		fn: 'COTTON',
		body: INDICATOR_SERIES,
		run: (c) => Commodities.cotton(c, {}),
	},
	{
		name: 'commodities.sugar',
		fn: 'SUGAR',
		body: INDICATOR_SERIES,
		run: (c) => Commodities.sugar(c, {}),
	},
	{
		name: 'commodities.wheat',
		fn: 'WHEAT',
		body: INDICATOR_SERIES,
		run: (c) => Commodities.wheat(c, { interval: 'annual' }),
	},

	// economic (10)
	{
		name: 'economic.realGdp',
		fn: 'REAL_GDP',
		body: INDICATOR_SERIES,
		run: (c) => Economic.realGdp(c, { interval: 'annual' }),
	},
	{
		name: 'economic.realGdpPerCapita',
		fn: 'REAL_GDP_PER_CAPITA',
		body: INDICATOR_SERIES,
		run: (c) => Economic.realGdpPerCapita(c, {}),
	},
	{
		name: 'economic.treasuryYield',
		fn: 'TREASURY_YIELD',
		body: INDICATOR_SERIES,
		run: (c) =>
			Economic.treasuryYield(c, { interval: 'monthly', maturity: '10year' }),
	},
	{
		name: 'economic.federalFundsRate',
		fn: 'FEDERAL_FUNDS_RATE',
		body: INDICATOR_SERIES,
		run: (c) => Economic.federalFundsRate(c, {}),
	},
	{
		name: 'economic.cpi',
		fn: 'CPI',
		body: INDICATOR_SERIES,
		run: (c) => Economic.cpi(c, {}),
	},
	{
		name: 'economic.inflation',
		fn: 'INFLATION',
		body: INDICATOR_SERIES,
		run: (c) => Economic.inflation(c, {}),
	},
	{
		name: 'economic.retailSales',
		fn: 'RETAIL_SALES',
		body: INDICATOR_SERIES,
		run: (c) => Economic.retailSales(c, {}),
	},
	{
		name: 'economic.durables',
		fn: 'DURABLES',
		body: INDICATOR_SERIES,
		run: (c) => Economic.durables(c, {}),
	},
	{
		name: 'economic.nonfarmPayroll',
		fn: 'NONFARM_PAYROLL',
		body: INDICATOR_SERIES,
		run: (c) => Economic.nonfarmPayroll(c, {}),
	},
	{
		name: 'economic.unemployment',
		fn: 'UNEMPLOYMENT',
		body: INDICATOR_SERIES,
		run: (c) => Economic.unemployment(c, {}),
	},

	// intelligence (3) — slidingWindowAnalytics has no `function` and is asserted separately
	{
		name: 'intelligence.newsSentiment',
		fn: 'NEWS_SENTIMENT',
		body: {
			items: '0',
			sentiment_score_definition: 'd',
			relevance_score_definition: 'd',
			feed: [],
		},
		run: (c) => Intelligence.newsSentiment(c, { tickers: ['AAPL'] }),
	},
	{
		name: 'intelligence.historicalOptions',
		fn: 'HISTORICAL_OPTIONS',
		body: { endpoint: 'Historical Options' },
		run: (c) => Intelligence.historicalOptions(c, { symbol: 'IBM' }),
	},

	// technical (1)
	{
		name: 'technical.indicator',
		fn: 'RSI',
		body: SERIES,
		run: (c) =>
			Technical.indicator(c, {
				indicator: 'RSI',
				symbol: 'IBM',
				interval: 'daily',
				time_period: 14,
			}),
	},
];

describe('every operation calls the provider function it should', () => {
	it.each(CASES.map((c) => [c.name, c] as const))(
		'%s',
		async (_name, testCase) => {
			const { ctx } = makeCtx();
			if (testCase.csv !== undefined) {
				mockCsv(testCase.csv);
			} else {
				mockJson(testCase.body);
			}

			await testCase.run(ctx);

			expect(query().get('function')).toBe(testCase.fn);
			expect(query().get('apikey')).toBe('test-alphavantage-key');
		},
	);

	it('covers all 56 catalog operations', () => {
		// slidingWindowAnalytics is the 56th; it is asserted in its own test
		// because it is the only operation without a `function` parameter.
		expect(CASES.length + 1).toBe(56);
	});
});

/* -- behaviour that is more than a function name --------------------------- */

describe('query construction', () => {
	it('sends booleans as strings and omits unset optionals', async () => {
		const { ctx } = makeCtx();
		mockJson(SERIES);

		await TimeSeries.intraday(ctx, {
			symbol: 'IBM',
			interval: '5min',
			adjusted: false,
		});

		expect(query().get('adjusted')).toBe('false');
		expect(query().has('extended_hours')).toBe(false);
		expect(query().has('month')).toBe(false);
	});

	it('joins bulk quote tickers into one comma-separated parameter', async () => {
		const { ctx } = makeCtx();
		mockJson({ endpoint: 'Realtime Bulk Quotes' });

		await TimeSeries.realtimeBulkQuotes(ctx, { symbols: ['IBM', 'AAPL'] });

		expect(query().get('symbol')).toBe('IBM,AAPL');
	});

	it('translates a legacy intraday slice into a month', async () => {
		const { ctx } = makeCtx();
		mockJson(SERIES);

		await TimeSeries.intradayExtended(ctx, {
			symbol: 'IBM',
			interval: '5min',
			slice: 'year1month1',
		});

		expect(query().get('month')).toMatch(/^\d{4}-\d{2}$/);
		expect(query().get('outputsize')).toBe('full');
	});

	it('forwards indicator-specific extras without letting them override the core parameters', async () => {
		const { ctx } = makeCtx();
		mockJson(SERIES);

		await Technical.indicator(ctx, {
			indicator: 'MACD',
			symbol: 'IBM',
			interval: 'daily',
			extra_params: { fastperiod: 12, symbol: 'SHOULD_NOT_WIN' },
		});

		expect(query().get('function')).toBe('MACD');
		expect(query().get('fastperiod')).toBe('12');
		expect(query().get('symbol')).toBe('IBM');
	});

	it('drops reserved extra_params so they cannot switch the response to CSV or replace the key', async () => {
		const { ctx } = makeCtx();
		mockJson(SERIES);

		await Technical.indicator(ctx, {
			indicator: 'RSI',
			symbol: 'IBM',
			interval: 'daily',
			time_period: 14,
			extra_params: {
				datatype: 'csv',
				apikey: 'attacker-key',
				function: 'OVERVIEW',
			},
		});

		expect(query().get('function')).toBe('RSI');
		expect(query().get('apikey')).toBe('test-alphavantage-key');
		expect(query().get('datatype')).toBeNull();
	});

	// 'intelligence.slidingWindowAnalytics' is the one operation absent from the
	// table above, because it has no `function` parameter to assert on. Its path
	// is named here so a coverage sweep over this file still finds all 56.
	it('maps intelligence.slidingWindowAnalytics onto the upper-case parameters of the other host', async () => {
		const { ctx } = makeCtx();
		mockJson({ meta_data: {}, payload: {} });

		await Intelligence.slidingWindowAnalytics(ctx, {
			symbols: ['AAPL', 'MSFT'],
			range: '2month',
			interval: 'DAILY',
			window_size: 20,
			calculations: ['MEAN', 'STDDEV'],
		});

		const url = new URL(lastUrl ?? '');
		expect(url.origin).toBe('https://alphavantageapi.co');
		expect(url.searchParams.get('SYMBOLS')).toBe('AAPL,MSFT');
		expect(url.searchParams.get('CALCULATIONS')).toBe('MEAN,STDDEV');
		expect(url.searchParams.get('WINDOW_SIZE')).toBe('20');
		expect(url.searchParams.get('function')).toBeNull();
	});
});

describe('empty responses are reported rather than returned', () => {
	it('raises not-found when a quote comes back empty', async () => {
		const { ctx } = makeCtx();
		mockJson({ 'Global Quote': {} });

		await expect(
			TimeSeries.globalQuote(ctx, { symbol: 'ZZZZ_NOPE' }),
		).rejects.toThrow(/returned no data for ZZZZ_NOPE/);
	});

	it('raises not-found when a series carries only Meta Data', async () => {
		const { ctx } = makeCtx();
		mockJson({ 'Meta Data': { '2. Symbol': 'ZZZZ' } });

		await expect(TimeSeries.daily(ctx, { symbol: 'ZZZZ' })).rejects.toThrow(
			/returned no data for ZZZZ/,
		);
	});

	it('raises not-found when a series exists but holds no points', async () => {
		const { ctx } = makeCtx();
		mockJson({ 'Meta Data': {}, 'Time Series (Daily)': {} });

		await expect(TimeSeries.daily(ctx, { symbol: 'ZZZZ' })).rejects.toThrow(
			/returned no data/,
		);
	});

	it('raises not-found for an unsupported currency pair', async () => {
		const { ctx } = makeCtx();
		mockJson({ 'Realtime Currency Exchange Rate': {} });

		await expect(
			Forex.exchangeRate(ctx, { from_currency: 'USD', to_currency: 'ZZZ' }),
		).rejects.toThrow(/returned no data for USD\/ZZZ/);
	});

	it('raises not-found for an unknown company', async () => {
		const { ctx } = makeCtx();
		mockJson({});

		await expect(
			Fundamentals.companyOverview(ctx, { symbol: 'ZZZZ' }),
		).rejects.toThrow(/returned no data for ZZZZ/);
	});

	it('returns the deprecated SECTOR empty body instead of failing', async () => {
		const { ctx } = makeCtx();
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		mockJson({});

		await expect(Market.sector(ctx, {})).resolves.toEqual({});
		expect(warn).toHaveBeenCalledWith(expect.stringContaining('deprecated'));
		warn.mockRestore();
	});
});

describe('premium-gated operations', () => {
	const PREMIUM_NOTICE = {
		Information:
			'Thank you for using Alpha Vantage! This is a premium endpoint. You may subscribe to any of the premium plans at https://www.alphavantage.co/premium/ to instantly unlock all premium endpoints',
	};

	// Verified live on 2026-08-13: these six answer a free-tier key with the
	// notice above and HTTP 200, rather than an error status.
	const PREMIUM: [string, (ctx: Ctx) => Promise<unknown>][] = [
		[
			'timeSeries.intraday',
			(c) => TimeSeries.intraday(c, { symbol: 'IBM', interval: '5min' }),
		],
		[
			'timeSeries.intradayExtended',
			(c) =>
				TimeSeries.intradayExtended(c, { symbol: 'IBM', interval: '5min' }),
		],
		[
			'timeSeries.realtimeBulkQuotes',
			(c) => TimeSeries.realtimeBulkQuotes(c, { symbols: ['IBM'] }),
		],
		[
			'forex.intraday',
			(c) =>
				Forex.intraday(c, {
					from_symbol: 'EUR',
					to_symbol: 'USD',
					interval: '5min',
				}),
		],
		[
			'crypto.intraday',
			(c) =>
				Crypto.intraday(c, { symbol: 'BTC', market: 'USD', interval: '5min' }),
		],
		[
			'intelligence.historicalOptions',
			(c) => Intelligence.historicalOptions(c, { symbol: 'IBM' }),
		],
	];

	it.each(PREMIUM)(
		'%s surfaces the premium notice instead of returning it as data',
		async (_name, run) => {
			const { ctx } = makeCtx();
			mockJson(PREMIUM_NOTICE);

			await expect(run(ctx)).rejects.toThrow(/premium endpoint/i);
		},
	);

	it('classifies the notice as premium rather than as a rate limit', async () => {
		const { ctx } = makeCtx();
		mockJson(PREMIUM_NOTICE);

		// Both arrive as `Information`; only the wording separates them, and
		// mixing them up would make the client retry something that can never
		// succeed.
		await expect(
			TimeSeries.intraday(ctx, { symbol: 'IBM', interval: '5min' }),
		).rejects.toMatchObject({ kind: 'premium' });
	});
});

describe('symbol caching', () => {
	it('mirrors search matches', async () => {
		const { ctx, db } = makeCtx();
		mockJson({
			bestMatches: [
				{
					'1. symbol': 'TSCO.LON',
					'2. name': 'Tesco PLC',
					'3. type': 'Equity',
					'4. region': 'United Kingdom',
					'5. marketOpen': '08:00',
					'6. marketClose': '16:30',
					'7. timezone': 'UTC+01',
					'8. currency': 'GBX',
					'9. matchScore': '0.72',
				},
			],
		});

		await Market.symbolSearch(ctx, { keywords: 'tesco' });

		expect(db.symbols.upsertByEntityId).toHaveBeenCalledWith(
			'TSCO.LON',
			expect.objectContaining({
				symbol: 'TSCO.LON',
				name: 'Tesco PLC',
				region: 'United Kingdom',
				timezone: 'UTC+01',
				marketOpen: '08:00',
				currency: 'GBX',
			}),
		);
	});

	it('mirrors listing rows and normalises the literal "null" delisting date', async () => {
		const { ctx, db } = makeCtx();
		mockCsv(
			'symbol,name,exchange,assetType,ipoDate,delistingDate,status\nA,Agilent Technologies Inc,NYSE,Stock,1999-11-18,null,Active\n',
		);

		await Market.listingStatus(ctx, {});

		expect(db.symbols.upsertByEntityId).toHaveBeenCalledWith(
			'A',
			expect.objectContaining({
				symbol: 'A',
				delistingDate: null,
				status: 'Active',
			}),
		);
	});

	it('mirrors the company overview', async () => {
		const { ctx, db } = makeCtx();
		mockJson({
			Symbol: 'IBM',
			AssetType: 'Common Stock',
			Name: 'International Business Machines',
			Description: 'd',
			Exchange: 'NYSE',
			Currency: 'USD',
			Country: 'USA',
			Sector: 'TECHNOLOGY',
			Industry: 'IT',
			MarketCapitalization: '1',
		});

		await Fundamentals.companyOverview(ctx, { symbol: 'IBM' });

		expect(db.symbols.upsertByEntityId).toHaveBeenCalledWith(
			'IBM',
			expect.objectContaining({ symbol: 'IBM', exchange: 'NYSE' }),
		);
		expect(db.companies.upsertByEntityId).toHaveBeenCalledWith(
			'IBM',
			expect.objectContaining({
				Symbol: 'IBM',
				Exchange: 'NYSE',
				fetchedAt: expect.any(Date),
			}),
		);
	});

	it('skips CSV rows that have no ticker', async () => {
		const { ctx, db } = makeCtx();
		mockCsv(
			'symbol,name\n,Nameless Corp\nIBM,International Business Machines\n',
		);

		await Market.listingStatus(ctx, {});

		expect(db.symbols.upsertByEntityId).toHaveBeenCalledTimes(1);
		expect(db.symbols.upsertByEntityId).toHaveBeenCalledWith(
			'IBM',
			expect.anything(),
		);
	});

	it('does not fail the call when the cache write throws', async () => {
		const { ctx, db } = makeCtx();
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		db.symbols.upsertByEntityId.mockRejectedValue(new Error('disk full'));
		mockJson({
			bestMatches: [
				{
					'1. symbol': 'IBM',
					'2. name': 'IBM',
					'3. type': 'Equity',
					'4. region': 'US',
					'5. marketOpen': '09:30',
					'6. marketClose': '16:00',
					'7. timezone': 'UTC-4',
					'8. currency': 'USD',
					'9. matchScore': '1.0',
				},
			],
		});

		await expect(
			Market.symbolSearch(ctx, { keywords: 'ibm' }),
		).resolves.toBeTruthy();
		expect(warn).toHaveBeenCalledWith(
			expect.stringContaining('failed to cache'),
			expect.anything(),
		);
		warn.mockRestore();
	});

	it('works when no symbol store is configured', async () => {
		const ctx = {
			key: 'test-alphavantage-key',
			db: {},
			$getAccountId: async () => 'test-account',
		} as unknown as Ctx;
		mockJson({ bestMatches: [] });

		await expect(
			Market.symbolSearch(ctx, { keywords: 'ibm' }),
		).resolves.toBeTruthy();
	});
});

describe('event log payloads', () => {
	/** The payload argument of the most recent logEventFromContext call. */
	const lastLoggedPayload = () => {
		const call = mockLogEvent.mock.calls.at(-1);
		return call?.[2];
	};

	it('does not record the free-text search term', async () => {
		const { ctx } = makeCtx();
		mockJson({ bestMatches: [] });

		await Market.symbolSearch(ctx, { keywords: 'private company name' });

		const payload = lastLoggedPayload();
		expect(mockLogEvent).toHaveBeenCalledWith(
			expect.anything(),
			'alphavantage.market.symbolSearch',
			expect.anything(),
			'completed',
		);
		expect(JSON.stringify(payload)).not.toContain('private company name');
		expect(payload).toEqual({ matches: 0 });
	});

	it('does not record the tickers or topics a news query asked for', async () => {
		const { ctx } = makeCtx();
		mockJson({
			items: '0',
			sentiment_score_definition: 'd',
			relevance_score_definition: 'd',
			feed: [],
		});

		// Together these describe a watchlist, which is information about the
		// caller rather than about the request.
		await Intelligence.newsSentiment(ctx, {
			tickers: ['AAPL', 'TSLA'],
			topics: ['earnings'],
			limit: 5,
		});

		// An exact match rather than absence checks: a substring assertion would
		// still pass if some new caller-authored field were added later.
		//
		// `fields` is the list of supplied field *names* with their values
		// dropped — that is what `auditPayload` is for. Recording that a request
		// filtered by tickers is fine; recording which tickers is not.
		expect(mockLogEvent).toHaveBeenLastCalledWith(
			expect.anything(),
			'alphavantage.intelligence.newsSentiment',
			{ limit: 5, fields: ['tickers', 'topics', 'limit'] },
			'completed',
		);
	});

	it('records identifiers that are not caller-authored', async () => {
		const { ctx } = makeCtx();
		mockJson(SERIES);

		await TimeSeries.daily(ctx, { symbol: 'IBM', outputsize: 'compact' });

		expect(lastLoggedPayload()).toMatchObject({
			symbol: 'IBM',
			outputsize: 'compact',
		});
	});
});
