import { z } from 'zod';
import { AlphaVantageCompanyOverview as CompanyOverviewFields } from '../schema/database';

/**
 * Input and output schemas for every Alpha Vantage operation.
 *
 * Two provider conventions shape almost everything here:
 *
 * 1. **Numbers arrive as strings.** `"185.9200"`, `"4468987"`, `"23850.442"`.
 *    They are kept as strings rather than coerced, so a price is never silently
 *    rounded by a float conversion and the caller decides how to parse.
 * 2. **Object keys are prose.** `"Time Series (Daily)"`, `"01. symbol"`,
 *    `"Realtime Currency Exchange Rate"`. Where the key itself varies with the
 *    request (the series key changes per function), the shape is modelled with
 *    `catchall` rather than enumerating every possible key.
 *
 * Response shapes below were captured from the live API rather than transcribed
 * from the documentation, except for the two premium-only operations noted at
 * their definitions.
 */

/* -------------------------------------------------------------------------- */
/* Shared primitives                                                           */
/* -------------------------------------------------------------------------- */

/** A ticker as Alpha Vantage spells it, e.g. `IBM` or `TSCO.LON`. */
const SymbolSchema = z.string().min(1);

/**
 * Alpha Vantage renders every numeric field as a string. A few fields also use
 * the literal `"None"` or `"-"` in place of a value.
 */
const NumericString = z.string();

/**
 * Alpha Vantage exposes a `datatype` parameter that switches a response between
 * JSON and CSV. It is deliberately not offered here: this plugin decodes every
 * response into typed data, and letting a caller ask for CSV on a JSON
 * operation would return something the declared output schema cannot describe.
 * The three operations that are CSV-only upstream are decoded into rows instead.
 */

const IntradayIntervalSchema = z.enum([
	'1min',
	'5min',
	'15min',
	'30min',
	'60min',
]);

const OutputSizeSchema = z
	.enum(['compact', 'full'])
	.describe('compact returns the latest 100 points, full the full history.');

/**
 * Meta Data values are usually strings, but technical indicators return
 * numbers for `Time Period`. The punctuation of the numbered prefix also
 * differs between families — time series use `"1. Information"` while
 * indicators use `"1: Symbol"` — so the keys are not enumerated.
 */
const MetaDataSchema = z.record(z.string(), z.union([z.string(), z.number()]));

/**
 * The envelope shared by every time-series, crypto and technical-indicator
 * response: a `Meta Data` block plus exactly one series object whose key names
 * the series (`"Time Series (Daily)"`, `"Weekly Adjusted Time Series"`,
 * `"Technical Analysis: RSI"`, …). The series maps a timestamp to a record of
 * string-valued fields.
 */
const SeriesEnvelopeSchema = z
	.object({
		'Meta Data': MetaDataSchema.optional(),
	})
	.catchall(z.record(z.string(), z.record(z.string(), NumericString)));

/**
 * The envelope shared by all nine commodity operations and all ten economic
 * indicator operations — 19 of the 56 operations return exactly this.
 */
const IndicatorSeriesSchema = z
	.object({
		name: z.string(),
		interval: z.string(),
		unit: z.string(),
		data: z.array(
			z
				.object({
					date: z.string(),
					/** `"."` appears in place of a value for gaps in some series. */
					value: NumericString,
				})
				.loose(),
		),
	})
	.loose();

/** Operations that take no parameters at all. */
const EmptyInputSchema = z.object({});

/** Commodity and economic series that expose an interval selector. */
const intervalInput = <T extends readonly [string, ...string[]]>(
	intervals: T,
	description: string,
) =>
	z.object({
		interval: z.enum(intervals).optional().describe(description),
	});

/** Commodities priced monthly and up. */
const MonthlyCommodityInput = intervalInput(
	['monthly', 'quarterly', 'annual'],
	'Sampling interval. Defaults to monthly.',
);

/* -------------------------------------------------------------------------- */
/* Input schemas                                                               */
/* -------------------------------------------------------------------------- */

export const AlphaVantageEndpointInputSchemas = {
	/* --- timeSeries ------------------------------------------------------- */
	timeSeriesIntraday: z.object({
		symbol: SymbolSchema,
		interval: IntradayIntervalSchema,
		adjusted: z.boolean().optional(),
		extended_hours: z.boolean().optional(),
		/** `YYYY-MM` selects a specific historical month. */
		month: z
			.string()
			.regex(/^\d{4}-\d{2}$/, 'month must be formatted YYYY-MM')
			.optional(),
		outputsize: OutputSizeSchema.optional(),
	}),
	timeSeriesIntradayExtended: z.object({
		symbol: SymbolSchema,
		interval: IntradayIntervalSchema,
		/**
		 * The historical slice, `year1month1` through `year2month12`. Alpha
		 * Vantage has folded this into `TIME_SERIES_INTRADAY`'s `month`
		 * parameter; see the note on the handler.
		 */
		slice: z
			.string()
			.regex(
				/^year[12]month([1-9]|1[0-2])$/,
				'slice must look like year1month1',
			)
			.optional(),
		month: z
			.string()
			.regex(/^\d{4}-\d{2}$/, 'month must be formatted YYYY-MM')
			.optional(),
		adjusted: z.boolean().optional(),
	}),
	timeSeriesDaily: z.object({
		symbol: SymbolSchema,
		outputsize: OutputSizeSchema.optional(),
	}),
	timeSeriesWeekly: z.object({
		symbol: SymbolSchema,
	}),
	timeSeriesWeeklyAdjusted: z.object({
		symbol: SymbolSchema,
	}),
	timeSeriesMonthly: z.object({
		symbol: SymbolSchema,
	}),
	timeSeriesMonthlyAdjusted: z.object({
		symbol: SymbolSchema,
	}),
	timeSeriesGlobalQuote: z.object({
		symbol: SymbolSchema,
	}),
	timeSeriesRealtimeBulkQuotes: z.object({
		/** Up to 100 tickers. */
		symbols: z
			.array(SymbolSchema)
			.min(1)
			.max(100)
			.describe(
				'Up to 100 tickers, sent to the API as a comma-separated list.',
			),
	}),

	/* --- market ----------------------------------------------------------- */
	marketSymbolSearch: z.object({
		keywords: z.string().min(1),
	}),
	marketStatus: EmptyInputSchema,
	marketTopGainersLosers: EmptyInputSchema,
	marketListingStatus: z.object({
		/** `YYYY-MM-DD`, any date from 2010-01-01 onwards. */
		date: z
			.string()
			.regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be formatted YYYY-MM-DD')
			.optional(),
		state: z.enum(['active', 'delisted']).optional(),
	}),
	marketSector: EmptyInputSchema,

	/* --- fundamentals ----------------------------------------------------- */
	fundamentalsCompanyOverview: z.object({ symbol: SymbolSchema }),
	fundamentalsIncomeStatement: z.object({ symbol: SymbolSchema }),
	fundamentalsBalanceSheet: z.object({ symbol: SymbolSchema }),
	fundamentalsCashFlow: z.object({ symbol: SymbolSchema }),
	fundamentalsEarnings: z.object({ symbol: SymbolSchema }),
	fundamentalsEarningsCalendar: z.object({
		symbol: SymbolSchema.optional(),
		horizon: z.enum(['3month', '6month', '12month']).optional(),
	}),
	fundamentalsEarningsCallTranscript: z.object({
		symbol: SymbolSchema,
		/** Fiscal quarter as `YYYYQM`, e.g. `2024Q1`. */
		quarter: z
			.string()
			.regex(/^\d{4}Q[1-4]$/, 'quarter must be formatted YYYYQn, e.g. 2024Q1'),
	}),
	fundamentalsIpoCalendar: EmptyInputSchema,
	fundamentalsDividends: z.object({ symbol: SymbolSchema }),
	fundamentalsSplits: z.object({ symbol: SymbolSchema }),

	/* --- forex ------------------------------------------------------------ */
	forexExchangeRate: z.object({
		from_currency: z.string().min(1),
		to_currency: z.string().min(1),
	}),
	forexIntraday: z.object({
		from_symbol: z.string().min(1),
		to_symbol: z.string().min(1),
		interval: IntradayIntervalSchema,
		outputsize: OutputSizeSchema.optional(),
	}),
	forexDaily: z.object({
		from_symbol: z.string().min(1),
		to_symbol: z.string().min(1),
		outputsize: OutputSizeSchema.optional(),
	}),
	forexWeekly: z.object({
		from_symbol: z.string().min(1),
		to_symbol: z.string().min(1),
	}),
	forexMonthly: z.object({
		from_symbol: z.string().min(1),
		to_symbol: z.string().min(1),
	}),

	/* --- crypto ----------------------------------------------------------- */
	cryptoIntraday: z.object({
		symbol: SymbolSchema.describe('Crypto ticker, e.g. BTC.'),
		market: z.string().min(1).describe('Quote currency, e.g. USD.'),
		interval: IntradayIntervalSchema,
		outputsize: OutputSizeSchema.optional(),
	}),
	cryptoDaily: z.object({
		symbol: SymbolSchema,
		market: z.string().min(1),
	}),
	cryptoWeekly: z.object({
		symbol: SymbolSchema,
		market: z.string().min(1),
	}),
	cryptoMonthly: z.object({
		symbol: SymbolSchema,
		market: z.string().min(1),
	}),

	/* --- commodities ------------------------------------------------------ */
	commoditiesAll: MonthlyCommodityInput,
	commoditiesAluminum: MonthlyCommodityInput,
	commoditiesBrent: intervalInput(
		['daily', 'weekly', 'monthly'],
		'Sampling interval. Defaults to monthly.',
	),
	commoditiesCoffee: MonthlyCommodityInput,
	commoditiesCopper: MonthlyCommodityInput,
	commoditiesCorn: MonthlyCommodityInput,
	commoditiesCotton: MonthlyCommodityInput,
	commoditiesSugar: MonthlyCommodityInput,
	commoditiesWheat: MonthlyCommodityInput,

	/* --- economic --------------------------------------------------------- */
	economicRealGdp: intervalInput(
		['quarterly', 'annual'],
		'Sampling interval. Defaults to annual.',
	),
	economicRealGdpPerCapita: EmptyInputSchema,
	economicTreasuryYield: z.object({
		interval: z.enum(['daily', 'weekly', 'monthly']).optional(),
		maturity: z
			.enum(['3month', '2year', '5year', '7year', '10year', '30year'])
			.optional(),
	}),
	economicFederalFundsRate: intervalInput(
		['daily', 'weekly', 'monthly'],
		'Sampling interval. Defaults to monthly.',
	),
	economicCpi: intervalInput(
		['monthly', 'semiannual'],
		'Sampling interval. Defaults to monthly.',
	),
	economicInflation: EmptyInputSchema,
	economicRetailSales: EmptyInputSchema,
	economicDurables: EmptyInputSchema,
	economicNonfarmPayroll: EmptyInputSchema,
	economicUnemployment: EmptyInputSchema,

	/* --- intelligence ----------------------------------------------------- */
	intelligenceNewsSentiment: z
		.object({
			tickers: z.array(SymbolSchema).optional(),
			topics: z.array(z.string()).optional(),
			/** `YYYYMMDDTHHMM`. */
			time_from: z
				.string()
				.regex(/^\d{8}T\d{4}$/, 'time_from must be formatted YYYYMMDDTHHMM')
				.optional(),
			time_to: z
				.string()
				.regex(/^\d{8}T\d{4}$/, 'time_to must be formatted YYYYMMDDTHHMM')
				.optional(),
			sort: z.enum(['LATEST', 'EARLIEST', 'RELEVANCE']).optional(),
			limit: z.number().int().min(1).max(1000).optional(),
		})
		.refine(
			(input) =>
				input.time_from === undefined ||
				input.time_to === undefined ||
				input.time_from <= input.time_to,
			{
				message: 'time_from must not be later than time_to',
				path: ['time_from'],
			},
		),
	intelligenceSlidingWindowAnalytics: z.object({
		symbols: z.array(SymbolSchema).min(1),
		range: z
			.string()
			.min(1)
			.describe('Lookback window, e.g. 2month, 6month, full.'),
		interval: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']),
		window_size: z.number().int().min(10),
		calculations: z
			.array(z.string().min(1))
			.min(1)
			.describe('e.g. MEAN, STDDEV, CORRELATION.'),
		ohlc: z.enum(['open', 'high', 'low', 'close']).optional(),
	}),
	intelligenceHistoricalOptions: z.object({
		symbol: SymbolSchema,
		/** `YYYY-MM-DD`; defaults to the previous trading session. */
		date: z
			.string()
			.regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be formatted YYYY-MM-DD')
			.optional(),
	}),

	/* --- technical -------------------------------------------------------- */
	technicalIndicator: z
		.object({
			/**
			 * The indicator function name, e.g. `SMA`, `EMA`, `RSI`, `MACD`,
			 * `BBANDS`, `STOCH`. The catalog collapses roughly fifty separate
			 * provider functions into this one operation.
			 */
			// Digits are allowed after the first character: several Alpha Vantage
			// indicator functions carry one, such as `T3` (triple exponential
			// moving average). A letters-only pattern would reject them.
			indicator: z
				.string()
				.min(1)
				.regex(
					/^[A-Z][A-Z0-9_]*$/,
					'indicator must be upper-case and start with a letter, e.g. RSI or T3',
				),
			symbol: SymbolSchema,
			interval: z.enum([
				'1min',
				'5min',
				'15min',
				'30min',
				'60min',
				'daily',
				'weekly',
				'monthly',
			]),
			time_period: z.number().int().min(1).optional(),
			series_type: z.enum(['close', 'open', 'high', 'low']).optional(),
			month: z
				.string()
				.regex(/^\d{4}-\d{2}$/, 'month must be formatted YYYY-MM')
				.optional(),
			/** Indicator-specific extras such as `fastperiod` or `nbdevup`. */
			extra_params: z
				.record(z.string(), z.union([z.string(), z.number()]))
				.optional(),
		})
		.refine(
			(input) =>
				![
					'SMA',
					'EMA',
					'RSI',
					'WMA',
					'DEMA',
					'TEMA',
					'MOM',
					'ROC',
					'STOCHRSI',
					'T3',
				].includes(input.indicator) || input.time_period !== undefined,
			{
				message: 'time_period is required for this indicator',
				path: ['time_period'],
			},
		)
		.refine(
			(input) =>
				!['RSI', 'MACD', 'STOCHRSI', 'T3'].includes(input.indicator) ||
				input.series_type !== undefined,
			{
				message: 'series_type is required for this indicator',
				path: ['series_type'],
			},
		),
} as const;

/* -------------------------------------------------------------------------- */
/* Output schemas                                                              */
/* -------------------------------------------------------------------------- */

/** `GLOBAL_QUOTE` — every field is a numbered, space-separated key. */
export const GlobalQuoteSchema = z
	.object({
		'01. symbol': z.string(),
		'02. open': NumericString,
		'03. high': NumericString,
		'04. low': NumericString,
		'05. price': NumericString,
		'06. volume': NumericString,
		'07. latest trading day': z.string(),
		'08. previous close': NumericString,
		'09. change': NumericString,
		'10. change percent': z.string(),
	})
	.loose();

const GlobalQuoteResponseSchema = z
	.object({
		/**
		 * Alpha Vantage answers an unknown ticker with an empty object here rather
		 * than an error, so the inner object is optional and the handler raises
		 * the not-found itself.
		 */
		'Global Quote': z.union([GlobalQuoteSchema, z.object({}).strict()]),
	})
	.loose();

const SymbolMatchSchema = z
	.object({
		'1. symbol': z.string(),
		'2. name': z.string(),
		'3. type': z.string(),
		'4. region': z.string(),
		'5. marketOpen': z.string(),
		'6. marketClose': z.string(),
		'7. timezone': z.string(),
		'8. currency': z.string(),
		'9. matchScore': NumericString,
	})
	.loose();

const MarketStatusEntrySchema = z
	.object({
		market_type: z.string(),
		region: z.string(),
		primary_exchanges: z.string(),
		local_open: z.string(),
		local_close: z.string(),
		current_status: z.string(),
		notes: z.string().optional(),
	})
	.loose();

const MoverSchema = z
	.object({
		ticker: z.string(),
		price: NumericString,
		change_amount: NumericString,
		change_percentage: z.string(),
		volume: NumericString,
	})
	.loose();

/**
 * `OVERVIEW` — official PascalCase keys from live IBM 2026-08-13.
 * Only `Symbol` is required; other fields are frequently empty or absent.
 * Extra keys are kept (`.loose`) so a newly added official field is not dropped.
 */
export const CompanyOverviewSchema = CompanyOverviewFields.loose();

/**
 * `INCOME_STATEMENT`, `BALANCE_SHEET` and `CASH_FLOW` share this envelope. The
 * individual line items differ per statement and run to ~30 fields each, all
 * string-encoded, so they are left to the loose record rather than enumerated.
 */
const FinancialStatementSchema = z
	.object({
		symbol: z.string(),
		annualReports: z.array(
			z
				.object({
					fiscalDateEnding: z.string(),
					reportedCurrency: z.string(),
				})
				.loose(),
		),
		quarterlyReports: z.array(
			z
				.object({
					fiscalDateEnding: z.string(),
					reportedCurrency: z.string(),
				})
				.loose(),
		),
	})
	.loose();

const EarningsSchema = z
	.object({
		symbol: z.string(),
		annualEarnings: z.array(
			z
				.object({
					fiscalDateEnding: z.string(),
					reportedEPS: NumericString,
				})
				.loose(),
		),
		quarterlyEarnings: z.array(
			z
				.object({
					fiscalDateEnding: z.string(),
					reportedDate: z.string(),
					reportedEPS: NumericString,
				})
				.loose(),
		),
	})
	.loose();

/** `DIVIDENDS` and `SPLITS` share a `{symbol, data[]}` envelope. */
const DividendsSchema = z
	.object({
		symbol: z.string(),
		data: z.array(
			z
				.object({
					ex_dividend_date: z.string(),
					declaration_date: z.string().optional(),
					record_date: z.string().optional(),
					payment_date: z.string().optional(),
					amount: NumericString,
				})
				.loose(),
		),
	})
	.loose();

const SplitsSchema = z
	.object({
		symbol: z.string(),
		data: z.array(
			z
				.object({
					effective_date: z.string(),
					split_factor: NumericString,
				})
				.loose(),
		),
	})
	.loose();

const ExchangeRateSchema = z
	.object({
		'Realtime Currency Exchange Rate': z
			.object({
				'1. From_Currency Code': z.string(),
				'2. From_Currency Name': z.string(),
				'3. To_Currency Code': z.string(),
				'4. To_Currency Name': z.string(),
				'5. Exchange Rate': NumericString,
				'6. Last Refreshed': z.string(),
				'7. Time Zone': z.string(),
				'8. Bid Price': NumericString.optional(),
				'9. Ask Price': NumericString.optional(),
			})
			.loose(),
	})
	.loose();

const NewsSentimentSchema = z
	.object({
		items: NumericString,
		sentiment_score_definition: z.string(),
		relevance_score_definition: z.string(),
		feed: z.array(
			z
				.object({
					title: z.string(),
					url: z.string(),
					time_published: z.string(),
					summary: z.string(),
					source: z.string(),
					overall_sentiment_score: z.number(),
					overall_sentiment_label: z.string(),
					ticker_sentiment: z
						.array(
							z
								.object({
									ticker: z.string(),
									relevance_score: NumericString,
									ticker_sentiment_score: NumericString,
									ticker_sentiment_label: z.string(),
								})
								.loose(),
						)
						.optional(),
				})
				.loose(),
		),
	})
	.loose();

const SlidingWindowAnalyticsSchema = z
	.object({
		meta_data: z
			.object({
				symbols: z.string(),
				window_size: z.number(),
				min_dt: z.string(),
				max_dt: z.string(),
				ohlc: z.string(),
				interval: z.string(),
			})
			.loose(),
		payload: z.record(z.string(), z.unknown()),
	})
	.loose();

/** Rows parsed from a CSV payload. Keys come from the CSV header. */
const CsvRowsSchema = z.array(z.record(z.string(), z.string()));

/**
 * Six of the 56 operations require a paid Alpha Vantage plan. Verified against
 * the live API on 2026-08-13: each answers a free-tier key with
 * `{"Information": "... This is a premium endpoint ..."}` and HTTP 200.
 *
 *   TIME_SERIES_INTRADAY, TIME_SERIES_INTRADAY_EXTENDED, FX_INTRADAY,
 *   CRYPTO_INTRADAY, REALTIME_BULK_QUOTES, HISTORICAL_OPTIONS
 *
 * In short: everything intraday, plus bulk quotes and the options chain.
 *
 * The four intraday operations still return the ordinary series envelope, which
 * is confirmed from their daily and weekly siblings, so their schemas are not
 * guesswork. The two below are different — their shapes could not be observed
 * at all, and for bulk quotes the provider explicitly warns that the sample
 * payload accompanying the notice is *artificial*. They are modelled loosely
 * from the documentation and are the only schemas in this file not confirmed
 * against a real response.
 */
const BulkQuotesSchema = z
	.object({
		endpoint: z.string().optional(),
		message: z.string().optional(),
		data: z
			.array(
				z
					.object({
						symbol: z.string(),
					})
					.loose(),
			)
			.optional(),
	})
	.loose();

const HistoricalOptionsSchema = z
	.object({
		endpoint: z.string().optional(),
		message: z.string().optional(),
		data: z
			.array(
				z
					.object({
						contractID: z.string(),
						symbol: z.string(),
						expiration: z.string(),
						strike: NumericString,
						type: z.string(),
					})
					.loose(),
			)
			.optional(),
	})
	.loose();

export const AlphaVantageEndpointOutputSchemas = {
	/* --- timeSeries ------------------------------------------------------- */
	timeSeriesIntraday: SeriesEnvelopeSchema,
	timeSeriesIntradayExtended: SeriesEnvelopeSchema,
	timeSeriesDaily: SeriesEnvelopeSchema,
	timeSeriesWeekly: SeriesEnvelopeSchema,
	timeSeriesWeeklyAdjusted: SeriesEnvelopeSchema,
	timeSeriesMonthly: SeriesEnvelopeSchema,
	timeSeriesMonthlyAdjusted: SeriesEnvelopeSchema,
	timeSeriesGlobalQuote: GlobalQuoteResponseSchema,
	timeSeriesRealtimeBulkQuotes: BulkQuotesSchema,

	/* --- market ----------------------------------------------------------- */
	marketSymbolSearch: z
		.object({ bestMatches: z.array(SymbolMatchSchema) })
		.loose(),
	marketStatus: z
		.object({
			endpoint: z.string(),
			markets: z.array(MarketStatusEntrySchema),
		})
		.loose(),
	marketTopGainersLosers: z
		.object({
			metadata: z.string(),
			last_updated: z.string(),
			top_gainers: z.array(MoverSchema),
			top_losers: z.array(MoverSchema),
			most_actively_traded: z.array(MoverSchema),
		})
		.loose(),
	marketListingStatus: CsvRowsSchema,
	/**
	 * `SECTOR` is deprecated upstream and now answers with an empty object, so
	 * the schema cannot be tightened beyond this without failing on live data.
	 */
	marketSector: z.record(z.string(), z.unknown()),

	/* --- fundamentals ----------------------------------------------------- */
	fundamentalsCompanyOverview: CompanyOverviewSchema,
	fundamentalsIncomeStatement: FinancialStatementSchema,
	fundamentalsBalanceSheet: FinancialStatementSchema,
	fundamentalsCashFlow: FinancialStatementSchema,
	fundamentalsEarnings: EarningsSchema,
	fundamentalsEarningsCalendar: CsvRowsSchema,
	fundamentalsEarningsCallTranscript: z
		.object({
			symbol: z.string(),
			quarter: z.string(),
			transcript: z.array(
				z
					.object({
						speaker: z.string(),
						title: z.string().optional(),
						content: z.string(),
						sentiment: NumericString.optional(),
					})
					.loose(),
			),
		})
		.loose(),
	fundamentalsIpoCalendar: CsvRowsSchema,
	fundamentalsDividends: DividendsSchema,
	fundamentalsSplits: SplitsSchema,

	/* --- forex ------------------------------------------------------------ */
	forexExchangeRate: ExchangeRateSchema,
	forexIntraday: SeriesEnvelopeSchema,
	forexDaily: SeriesEnvelopeSchema,
	forexWeekly: SeriesEnvelopeSchema,
	forexMonthly: SeriesEnvelopeSchema,

	/* --- crypto ----------------------------------------------------------- */
	cryptoIntraday: SeriesEnvelopeSchema,
	cryptoDaily: SeriesEnvelopeSchema,
	cryptoWeekly: SeriesEnvelopeSchema,
	cryptoMonthly: SeriesEnvelopeSchema,

	/* --- commodities ------------------------------------------------------ */
	commoditiesAll: IndicatorSeriesSchema,
	commoditiesAluminum: IndicatorSeriesSchema,
	commoditiesBrent: IndicatorSeriesSchema,
	commoditiesCoffee: IndicatorSeriesSchema,
	commoditiesCopper: IndicatorSeriesSchema,
	commoditiesCorn: IndicatorSeriesSchema,
	commoditiesCotton: IndicatorSeriesSchema,
	commoditiesSugar: IndicatorSeriesSchema,
	commoditiesWheat: IndicatorSeriesSchema,

	/* --- economic --------------------------------------------------------- */
	economicRealGdp: IndicatorSeriesSchema,
	economicRealGdpPerCapita: IndicatorSeriesSchema,
	economicTreasuryYield: IndicatorSeriesSchema,
	economicFederalFundsRate: IndicatorSeriesSchema,
	economicCpi: IndicatorSeriesSchema,
	economicInflation: IndicatorSeriesSchema,
	economicRetailSales: IndicatorSeriesSchema,
	economicDurables: IndicatorSeriesSchema,
	economicNonfarmPayroll: IndicatorSeriesSchema,
	economicUnemployment: IndicatorSeriesSchema,

	/* --- intelligence ----------------------------------------------------- */
	intelligenceNewsSentiment: NewsSentimentSchema,
	intelligenceSlidingWindowAnalytics: SlidingWindowAnalyticsSchema,
	intelligenceHistoricalOptions: HistoricalOptionsSchema,

	/* --- technical -------------------------------------------------------- */
	technicalIndicator: SeriesEnvelopeSchema,
} as const;

/* -------------------------------------------------------------------------- */
/* Inferred types                                                              */
/* -------------------------------------------------------------------------- */

export type AlphaVantageEndpointInputs = {
	[K in keyof typeof AlphaVantageEndpointInputSchemas]: z.infer<
		(typeof AlphaVantageEndpointInputSchemas)[K]
	>;
};

export type AlphaVantageEndpointOutputs = {
	[K in keyof typeof AlphaVantageEndpointOutputSchemas]: z.infer<
		(typeof AlphaVantageEndpointOutputSchemas)[K]
	>;
};

export type AlphaVantageGlobalQuote = z.infer<typeof GlobalQuoteSchema>;
export type AlphaVantageCompanyOverview = z.infer<typeof CompanyOverviewSchema>;
export type AlphaVantageSeriesEnvelope = z.infer<typeof SeriesEnvelopeSchema>;
export type AlphaVantageIndicatorSeries = z.infer<typeof IndicatorSeriesSchema>;
export type AlphaVantageSymbolMatch = z.infer<typeof SymbolMatchSchema>;
export type AlphaVantageNewsSentiment = z.infer<typeof NewsSentimentSchema>;
export type AlphaVantageCsvRows = z.infer<typeof CsvRowsSchema>;
