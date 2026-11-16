import { z } from 'zod';

/**
 * Twelve Data answers three shapes:
 *
 * - a reference list: `{ data: [...] }`, typed from the live responses below
 * - a quote or price: a flat object of strings, because every number arrives as
 *   a decimal string (`"211.66"`)
 * - a time series: `{ meta, values: [...], status }`, with each value's OHLC as
 *   strings too
 *
 * The `status` field is `ok` or `error`, and an error answer can still be a 200,
 * so the endpoints call `assertOk` on every body.
 */

/** Every price and volume Twelve Data sends is a decimal string. */
const DecimalSchema = z.string().describe('A decimal number, sent as a string');

const StatusSchema = {
	status: z.string().nullish().describe('ok or error'),
	code: z.number().nullish(),
	message: z.string().nullish(),
};

/** A reference-list entry, as `/stocks` returns it. */
const StockSchema = z
	.object({
		symbol: z.string(),
		name: z.string().nullish(),
		currency: z.string().nullish(),
		exchange: z.string().nullish(),
		mic_code: z.string().nullish(),
		country: z.string().nullish(),
		type: z.string().nullish().describe('Common Stock, ETF, and so on'),
		figi_code: z.string().nullish(),
		cfi_code: z.string().nullish(),
		isin: z.string().nullish(),
		cusip: z.string().nullish(),
	})
	.loose();
export type StockOutput = z.output<typeof StockSchema>;

/** A forex pair, as `/forex_pairs` returns it. */
const ForexPairSchema = z
	.object({
		symbol: z.string(),
		currency_group: z.string().nullish(),
		currency_base: z.string().nullish(),
		currency_quote: z.string().nullish(),
	})
	.loose();
export type ForexPairOutput = z.output<typeof ForexPairSchema>;

/** A cryptocurrency pair. */
const CryptoSchema = z
	.object({
		symbol: z.string(),
		available_exchanges: z.array(z.string()).nullish(),
		currency_base: z.string().nullish(),
		currency_quote: z.string().nullish(),
	})
	.loose();

/** An exchange, as `/exchanges` returns it. */
const ExchangeSchema = z
	.object({
		title: z.string().nullish(),
		name: z.string().nullish(),
		code: z.string().nullish(),
		country: z.string().nullish(),
		timezone: z.string().nullish(),
	})
	.loose();
export type ExchangeOutput = z.output<typeof ExchangeSchema>;

const DataList = <T extends z.ZodType>(item: T) =>
	z.object({ data: z.array(item) }).loose();

/**
 * ETFs answer the `{ data }` envelope that `stocks` uses. Funds and bonds answer
 * a different one, `{ result: { count, list } }`, which is why they need their own
 * schemas rather than sharing the stock one.
 */
const etf = StockSchema;

const fund = StockSchema;

const bond = StockSchema;

const ResultList = <T extends z.ZodType>(item: T) =>
	z
		.object({
			result: z
				.object({
					count: z.number().nullish(),
					list: z.array(item),
				})
				.loose(),
			...StatusSchema,
		})
		.loose();

/** A quote: every field arrives as a string. */
const QuoteSchema = z
	.object({
		symbol: z.string().nullish(),
		name: z.string().nullish(),
		exchange: z.string().nullish(),
		mic_code: z.string().nullish(),
		currency: z.string().nullish(),
		datetime: z.string().nullish(),
		timestamp: z.union([z.number(), z.string()]).nullish(),
		open: DecimalSchema.nullish(),
		high: DecimalSchema.nullish(),
		low: DecimalSchema.nullish(),
		close: DecimalSchema.nullish(),
		volume: DecimalSchema.nullish(),
		previous_close: DecimalSchema.nullish(),
		change: DecimalSchema.nullish(),
		percent_change: DecimalSchema.nullish(),
		average_volume: DecimalSchema.nullish(),
		is_market_open: z.boolean().nullish(),
		fifty_two_week: z
			.object({
				low: DecimalSchema.nullish(),
				high: DecimalSchema.nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();
export type QuoteOutput = z.output<typeof QuoteSchema>;

/** `price` is the smallest answer: one symbol and one value. */
const PriceSchema = z
	.object({
		// Required: a price answer whose payload is absent is not a price of
		// unknown value, it is a body that lost its only field.
		price: DecimalSchema,
	})
	.passthrough();
export type PriceOutput = z.output<typeof PriceSchema>;

/** One candle in a time series. */
const SeriesValueSchema = z
	.object({
		datetime: z.string(),
		open: DecimalSchema,
		high: DecimalSchema,
		low: DecimalSchema,
		close: DecimalSchema,
		volume: DecimalSchema.nullish(),
	})
	.loose();
export type SeriesValueOutput = z.output<typeof SeriesValueSchema>;

const TimeSeriesSchema = z
	.object({
		meta: z
			.object({
				symbol: z.string().nullish(),
				interval: z.string().nullish(),
				currency: z.string().nullish(),
				exchange: z.string().nullish(),
				type: z.string().nullish(),
			})
			.loose()
			.nullish(),
		values: z.array(SeriesValueSchema),
		...StatusSchema,
	})
	.loose();
export type TimeSeriesOutput = z.output<typeof TimeSeriesSchema>;

/** An exchange rate. Unlike the quote routes, `rate` comes back as a JSON number. */
const ExchangeRateSchema = z
	.object({
		symbol: z.string().nullish(),
		rate: z.union([z.number(), DecimalSchema]).nullish(),
		timestamp: z.union([z.number(), z.string()]).nullish(),
	})
	.passthrough();
export type ExchangeRateOutput = z.output<typeof ExchangeRateSchema>;

/**
 * A technical indicator. Each one answers a different set of fields as decimal
 * strings, plus a `datetime`, so the response is an open record of strings rather
 * than a schema per indicator.
 */
const IndicatorSchema = z
	.object({
		meta: z
			.object({
				symbol: z.string().nullish(),
				interval: z.string().nullish(),
				// An object such as { name, series_type, time_period } describing the indicator.
				// unknown because each indicator lists its own parameters here.
				indicator: z
					.union([z.string(), z.record(z.string(), z.unknown())])
					.nullish(),
			})
			.loose()
			.nullish(),
		values: z.array(z.record(z.string(), z.string().nullish())).nullish(),
		...StatusSchema,
	})
	.loose();
export type IndicatorOutput = z.output<typeof IndicatorSchema>;

/** The `api_usage` answer: a count of the calls made. */
const ApiUsageSchema = z
	.object({
		timestamp: z.string().nullish(),
		current_usage: z.number().nullish(),
		plan_limit: z.number().nullish(),
	})
	.loose();
export type ApiUsageOutput = z.output<typeof ApiUsageSchema>;

/**
 * One symbol: for a comma list Twelve Data answers a map keyed by symbol, which
 * the single-result output schemas read as an empty result.
 */
const SingleSymbolSchema = z
	.string()
	.min(1)
	.refine((value) => !value.includes(','), {
		message: 'Pass one symbol; call once per symbol for several',
	});

/** Shared request fields for the market-data routes. */
const SymbolFields = {
	symbol: SingleSymbolSchema.describe('One symbol, such as AAPL or EUR/USD'),
	exchange: z.string().optional().describe('Narrow to one exchange'),
	country: z.string().optional().describe('Narrow to one country'),
};

const IntervalSchema = z
	.enum([
		'1min',
		'5min',
		'15min',
		'30min',
		'45min',
		'1h',
		'2h',
		'4h',
		'1day',
		'1week',
		'1month',
	])
	.describe('Candle size');

// ---------------------------------------------------------------------------
// market data
// ---------------------------------------------------------------------------

const QuoteInputSchema = z.object({ ...SymbolFields });
export type QuoteInput = z.input<typeof QuoteInputSchema>;

const PriceInputSchema = z.object({ ...SymbolFields });
export type PriceInput = z.input<typeof PriceInputSchema>;

const TimeSeriesInputSchema = z.object({
	symbol: SingleSymbolSchema,
	interval: IntervalSchema,
	exchange: z.string().optional(),
	outputsize: z
		.number()
		.int()
		.min(1)
		.max(5000)
		.optional()
		.describe('How many candles; default 30, plan-dependent above 5000'),
	start_date: z.string().optional().describe('ISO date or date-time'),
	end_date: z.string().optional().describe('ISO date or date-time'),
	order: z.enum(['asc', 'desc']).optional().describe('Default desc'),
	timezone: z.string().optional().describe('Exchange timezone, or UTC'),
});
export type TimeSeriesInput = z.input<typeof TimeSeriesInputSchema>;

const ExchangeRateInputSchema = z.object({
	symbol: SingleSymbolSchema.describe('A pair such as EUR/USD'),
});
export type ExchangeRateInput = z.input<typeof ExchangeRateInputSchema>;

const IndicatorInputSchema = z.object({
	symbol: z.string().min(1),
	interval: IntervalSchema,
	time_period: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe(
			'Look-back period; the provider default depends on the indicator',
		),
	series_type: z
		.enum(['close', 'open', 'high', 'low'])
		.optional()
		.describe('Which price the indicator reads; default close'),
	outputsize: z.number().int().min(1).optional(),
	exchange: z.string().optional(),
});
export type IndicatorInput = z.input<typeof IndicatorInputSchema>;

const SeriesTypeSchema = z.enum(['close', 'open', 'high', 'low']);

/**
 * `beta` and `correl` compare two price series of the symbol. Twelve Data reads
 * `series_type_1` and `series_type_2` (defaults open and close) and ignores
 * `series_type` on these routes.
 */
const TwoSeriesIndicatorInputSchema = IndicatorInputSchema.omit({
	series_type: true,
})
	.extend({
		series_type_1: SeriesTypeSchema.optional().describe(
			'First price series; default open',
		),
		series_type_2: SeriesTypeSchema.optional().describe(
			'Second price series; default close',
		),
	})
	// strict so a caller's single `series_type` fails loudly instead of being ignored.
	.strict();
export type TwoSeriesIndicatorInput = z.input<
	typeof TwoSeriesIndicatorInputSchema
>;

// ---------------------------------------------------------------------------
// reference data
// ---------------------------------------------------------------------------

const ListStocksInputSchema = z.object({
	symbol: z
		.string()
		.optional()
		.describe('One symbol, or several separated by commas'),
	exchange: z.string().optional(),
	country: z.string().optional(),
	type: z
		.string()
		.optional()
		.describe('Common Stock, ETF, Depository Receipt, and so on'),
});
export type ListStocksInput = z.input<typeof ListStocksInputSchema>;

const ListForexPairsInputSchema = z.object({
	currency_base: z.string().optional(),
	currency_quote: z.string().optional(),
});
export type ListForexPairsInput = z.input<typeof ListForexPairsInputSchema>;

const ListCryptocurrenciesInputSchema = z.object({
	symbol: z.string().optional(),
	exchange: z.string().optional(),
});
export type ListCryptocurrenciesInput = z.input<
	typeof ListCryptocurrenciesInputSchema
>;

const ListExchangesInputSchema = z.object({
	country: z.string().optional(),
});

const ListEtfInputSchema = z.object({
	symbol: z
		.string()
		.optional()
		.describe('One symbol, or several separated by commas'),
	exchange: z.string().optional(),
	country: z.string().optional(),
});

/** The funds and bonds lists are paged; Twelve Data documents `page` and `outputsize`. */
const ListPageFields = {
	page: z.number().int().min(1).optional().describe('Page number; default 1'),
	outputsize: z
		.number()
		.int()
		.min(1)
		.max(50)
		.optional()
		.describe('Rows per page; default 50'),
};

const ListFundsInputSchema = z.object({
	country: z.string().optional(),
	symbol: z.string().optional(),
	...ListPageFields,
});

const ListBondsInputSchema = z.object({
	symbol: z.string().optional(),
	exchange: z.string().optional(),
	country: z.string().optional(),
	...ListPageFields,
});

export type ListEtfInput = z.input<typeof ListEtfInputSchema>;
export type ListFundsInput = z.input<typeof ListFundsInputSchema>;
export type ListBondsInput = z.input<typeof ListBondsInputSchema>;
export type ListExchangesInput = z.input<typeof ListExchangesInputSchema>;

const ApiUsageInputSchema = z.object({});
export type ApiUsageInput = z.input<typeof ApiUsageInputSchema>;

export type TwelveDataEndpointInputs = {
	quote: QuoteInput;
	price: PriceInput;
	timeSeries: TimeSeriesInput;
	exchangeRate: ExchangeRateInput;
	apiUsage: ApiUsageInput;
	listStocks: ListStocksInput;
	listForexPairs: ListForexPairsInput;
	listCryptocurrencies: ListCryptocurrenciesInput;
	listExchanges: ListExchangesInput;
	listEtf: ListEtfInput;
	listFunds: ListFundsInput;
	listBonds: ListBondsInput;
	rsi: IndicatorInput;
	macd: IndicatorInput;
	sma: IndicatorInput;
	ema: IndicatorInput;
	bbands: IndicatorInput;
	stoch: IndicatorInput;
	atr: IndicatorInput;
	adx: IndicatorInput;
	cci: IndicatorInput;
	willr: IndicatorInput;
	mfi: IndicatorInput;
	roc: IndicatorInput;
	supertrend: IndicatorInput;
	apo: IndicatorInput;
	ppo: IndicatorInput;
	stochrsi: IndicatorInput;
	ultosc: IndicatorInput;
	wma: IndicatorInput;
	min: IndicatorInput;
	max: IndicatorInput;
	stddev: IndicatorInput;
	beta: TwoSeriesIndicatorInput;
	correl: TwoSeriesIndicatorInput;
	tsf: IndicatorInput;
};

export type TwelveDataEndpointOutputs = {
	quote: QuoteOutput;
	price: PriceOutput;
	timeSeries: TimeSeriesOutput;
	exchangeRate: ExchangeRateOutput;
	apiUsage: ApiUsageOutput;
	listStocks: z.output<ReturnType<typeof DataList<typeof StockSchema>>>;
	listForexPairs: z.output<ReturnType<typeof DataList<typeof ForexPairSchema>>>;
	listCryptocurrencies: z.output<
		ReturnType<typeof DataList<typeof CryptoSchema>>
	>;
	listExchanges: z.output<ReturnType<typeof DataList<typeof ExchangeSchema>>>;
	listEtf: z.output<ReturnType<typeof DataList<typeof etf>>>;
	listFunds: z.output<ReturnType<typeof ResultList<typeof fund>>>;
	listBonds: z.output<ReturnType<typeof ResultList<typeof bond>>>;
	rsi: IndicatorOutput;
	macd: IndicatorOutput;
	sma: IndicatorOutput;
	ema: IndicatorOutput;
	bbands: IndicatorOutput;
	stoch: IndicatorOutput;
	atr: IndicatorOutput;
	adx: IndicatorOutput;
	cci: IndicatorOutput;
	willr: IndicatorOutput;
	mfi: IndicatorOutput;
	roc: IndicatorOutput;
	supertrend: IndicatorOutput;
	apo: IndicatorOutput;
	ppo: IndicatorOutput;
	stochrsi: IndicatorOutput;
	ultosc: IndicatorOutput;
	wma: IndicatorOutput;
	min: IndicatorOutput;
	max: IndicatorOutput;
	stddev: IndicatorOutput;
	beta: IndicatorOutput;
	correl: IndicatorOutput;
	tsf: IndicatorOutput;
};

const StocksListSchema = DataList(StockSchema);
const ForexPairsListSchema = DataList(ForexPairSchema);
const CryptoListSchema = DataList(CryptoSchema);
const ExchangesListSchema = DataList(ExchangeSchema);
const EtfListSchema = DataList(etf);
const FundsListSchema = ResultList(fund);
const BondsListSchema = ResultList(bond);

export const TwelveDataEndpointInputSchemas = {
	quote: QuoteInputSchema,
	price: PriceInputSchema,
	timeSeries: TimeSeriesInputSchema,
	exchangeRate: ExchangeRateInputSchema,
	apiUsage: ApiUsageInputSchema,
	listStocks: ListStocksInputSchema,
	listForexPairs: ListForexPairsInputSchema,
	listCryptocurrencies: ListCryptocurrenciesInputSchema,
	listExchanges: ListExchangesInputSchema,
	listEtf: ListEtfInputSchema,
	listFunds: ListFundsInputSchema,
	listBonds: ListBondsInputSchema,
	rsi: IndicatorInputSchema,
	macd: IndicatorInputSchema,
	sma: IndicatorInputSchema,
	ema: IndicatorInputSchema,
	bbands: IndicatorInputSchema,
	stoch: IndicatorInputSchema,
	atr: IndicatorInputSchema,
	adx: IndicatorInputSchema,
	cci: IndicatorInputSchema,
	willr: IndicatorInputSchema,
	mfi: IndicatorInputSchema,
	roc: IndicatorInputSchema,
	supertrend: IndicatorInputSchema,
	apo: IndicatorInputSchema,
	ppo: IndicatorInputSchema,
	stochrsi: IndicatorInputSchema,
	ultosc: IndicatorInputSchema,
	wma: IndicatorInputSchema,
	min: IndicatorInputSchema,
	max: IndicatorInputSchema,
	stddev: IndicatorInputSchema,
	beta: TwoSeriesIndicatorInputSchema,
	correl: TwoSeriesIndicatorInputSchema,
	tsf: IndicatorInputSchema,
} as const;

export const TwelveDataEndpointOutputSchemas = {
	quote: QuoteSchema,
	price: PriceSchema,
	timeSeries: TimeSeriesSchema,
	exchangeRate: ExchangeRateSchema,
	apiUsage: ApiUsageSchema,
	listStocks: StocksListSchema,
	listForexPairs: ForexPairsListSchema,
	listCryptocurrencies: CryptoListSchema,
	listExchanges: ExchangesListSchema,
	listEtf: EtfListSchema,
	listFunds: FundsListSchema,
	listBonds: BondsListSchema,
	rsi: IndicatorSchema,
	macd: IndicatorSchema,
	sma: IndicatorSchema,
	ema: IndicatorSchema,
	bbands: IndicatorSchema,
	stoch: IndicatorSchema,
	atr: IndicatorSchema,
	adx: IndicatorSchema,
	cci: IndicatorSchema,
	willr: IndicatorSchema,
	mfi: IndicatorSchema,
	roc: IndicatorSchema,
	supertrend: IndicatorSchema,
	apo: IndicatorSchema,
	ppo: IndicatorSchema,
	stochrsi: IndicatorSchema,
	ultosc: IndicatorSchema,
	wma: IndicatorSchema,
	min: IndicatorSchema,
	max: IndicatorSchema,
	stddev: IndicatorSchema,
	beta: IndicatorSchema,
	correl: IndicatorSchema,
	tsf: IndicatorSchema,
} as const;

export { StockSchema, ForexPairSchema, ExchangeSchema, TimeSeriesSchema };
