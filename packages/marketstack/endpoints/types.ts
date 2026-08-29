import { z } from 'zod';

const DateStringSchema = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected a date in YYYY-MM-DD format');

const LimitSchema = z
	.number()
	.int()
	.min(1)
	.max(1000)
	.optional()
	.describe('Maximum number of results to return (default 100, max 1000)');

const OffsetSchema = z
	.number()
	.int()
	.min(0)
	.optional()
	.describe('Number of results to skip, for pagination (default 0)');

const SortSchema = z
	.enum(['ASC', 'DESC'])
	.optional()
	.describe('Sort order by date (default DESC)');

const SymbolsSchema = z
	.array(z.string().min(1))
	.min(1)
	.max(100)
	.describe('Ticker symbols to fetch, e.g. ["AAPL", "MSFT"] (max 100)');

export const PaginationSchema = z.object({
	limit: z.number(),
	offset: z.number(),
	count: z.number(),
	total: z.number(),
});

export const EodBarSchema = z.object({
	open: z.number().nullable(),
	high: z.number().nullable(),
	low: z.number().nullable(),
	close: z.number().nullable(),
	volume: z.number().nullable(),
	adj_high: z.number().nullable().optional(),
	adj_low: z.number().nullable().optional(),
	adj_close: z.number().nullable().optional(),
	adj_open: z.number().nullable().optional(),
	adj_volume: z.number().nullable().optional(),
	split_factor: z.number().nullable().optional(),
	dividend: z.number().nullable().optional(),
	symbol: z.string(),
	exchange: z.string().optional(),
	date: z.string(),
});

export type EodBar = z.infer<typeof EodBarSchema>;

export const DividendSchema = z.object({
	symbol: z.string(),
	date: z.string(),
	dividend: z.number(),
});

export type Dividend = z.infer<typeof DividendSchema>;

export const SplitSchema = z.object({
	symbol: z.string(),
	date: z.string(),
	split_factor: z.number(),
});

export type Split = z.infer<typeof SplitSchema>;

export const StockExchangeRefSchema = z.object({
	name: z.string().optional(),
	acronym: z.string().nullable().optional(),
	mic: z.string().optional(),
	country: z.string().nullable().optional(),
	country_code: z.string().nullable().optional(),
	city: z.string().nullable().optional(),
	website: z.string().nullable().optional(),
});

export const TickerSchema = z.object({
	name: z.string().optional(),
	symbol: z.string(),
	has_intraday: z.boolean().optional(),
	has_eod: z.boolean().optional(),
	country: z.string().nullable().optional(),
	stock_exchange: StockExchangeRefSchema.optional(),
});

export type Ticker = z.infer<typeof TickerSchema>;

export const ExchangeSchema = z.object({
	name: z.string().optional(),
	acronym: z.string().nullable().optional(),
	mic: z.string(),
	country: z.string().nullable().optional(),
	country_code: z.string().nullable().optional(),
	city: z.string().nullable().optional(),
	website: z.string().nullable().optional(),
});

export type Exchange = z.infer<typeof ExchangeSchema>;

export const CurrencySchema = z.object({
	code: z.string(),
	symbol: z.string().optional(),
	name: z.string().optional(),
	symbol_native: z.string().optional(),
});

export type Currency = z.infer<typeof CurrencySchema>;

// GET /eod
export const GetEodInputSchema = z.object({
	symbols: SymbolsSchema,
	exchange: z.string().optional().describe('Filter by stock exchange MIC'),
	sort: SortSchema,
	dateFrom: DateStringSchema.optional().describe(
		'Only return data on or after this date (YYYY-MM-DD)',
	),
	dateTo: DateStringSchema.optional().describe(
		'Only return data on or before this date (YYYY-MM-DD)',
	),
	limit: LimitSchema,
	offset: OffsetSchema,
});

export type GetEodInput = z.infer<typeof GetEodInputSchema>;

export const GetEodResponseSchema = z.object({
	pagination: PaginationSchema,
	data: z.array(EodBarSchema),
});

export type GetEodResponse = z.infer<typeof GetEodResponseSchema>;

// GET /tickers/{symbol}/eod
export const GetTickerEodInputSchema = z.object({
	symbol: z.string().min(1).describe('Ticker symbol, e.g. "AAPL"'),
	sort: SortSchema,
	dateFrom: DateStringSchema.optional().describe(
		'Only return data on or after this date (YYYY-MM-DD)',
	),
	dateTo: DateStringSchema.optional().describe(
		'Only return data on or before this date (YYYY-MM-DD)',
	),
	limit: LimitSchema,
	offset: OffsetSchema,
});

export type GetTickerEodInput = z.infer<typeof GetTickerEodInputSchema>;

export const GetTickerEodResponseSchema = z.object({
	pagination: PaginationSchema,
	data: z.array(EodBarSchema),
});

export type GetTickerEodResponse = z.infer<typeof GetTickerEodResponseSchema>;

// GET /tickers/{symbol}/eod/latest
export const GetTickerEodLatestInputSchema = z.object({
	symbol: z.string().min(1).describe('Ticker symbol, e.g. "AAPL"'),
});

export type GetTickerEodLatestInput = z.infer<
	typeof GetTickerEodLatestInputSchema
>;

export const GetTickerEodLatestResponseSchema = EodBarSchema;

export type GetTickerEodLatestResponse = z.infer<
	typeof GetTickerEodLatestResponseSchema
>;

// GET /tickers/{symbol}
export const GetTickerInfoInputSchema = z.object({
	symbol: z.string().min(1).describe('Ticker symbol, e.g. "AAPL"'),
});

export type GetTickerInfoInput = z.infer<typeof GetTickerInfoInputSchema>;

export const GetTickerInfoResponseSchema = TickerSchema;

export type GetTickerInfoResponse = z.infer<typeof GetTickerInfoResponseSchema>;

// GET /tickers
export const ListTickersInputSchema = z.object({
	search: z
		.string()
		.optional()
		.describe('Search tickers by name or symbol, e.g. "Apple"'),
	exchange: z.string().optional().describe('Filter by stock exchange MIC'),
	limit: LimitSchema,
	offset: OffsetSchema,
});

export type ListTickersInput = z.infer<typeof ListTickersInputSchema>;

export const ListTickersResponseSchema = z.object({
	pagination: PaginationSchema,
	data: z.array(TickerSchema),
});

export type ListTickersResponse = z.infer<typeof ListTickersResponseSchema>;

// GET /exchanges/{mic}
export const GetExchangeInputSchema = z.object({
	mic: z
		.string()
		.min(1)
		.describe('Market Identifier Code of the exchange, e.g. "XNAS"'),
});

export type GetExchangeInput = z.infer<typeof GetExchangeInputSchema>;

export const GetExchangeResponseSchema = ExchangeSchema;

export type GetExchangeResponse = z.infer<typeof GetExchangeResponseSchema>;

// GET /exchanges
export const ListExchangesInputSchema = z.object({
	search: z
		.string()
		.optional()
		.describe('Search exchanges by name, acronym, or MIC'),
	limit: LimitSchema,
	offset: OffsetSchema,
});

export type ListExchangesInput = z.infer<typeof ListExchangesInputSchema>;

export const ListExchangesResponseSchema = z.object({
	pagination: PaginationSchema,
	data: z.array(ExchangeSchema),
});

export type ListExchangesResponse = z.infer<typeof ListExchangesResponseSchema>;

// GET /currencies
export const ListCurrenciesInputSchema = z.object({
	limit: LimitSchema,
	offset: OffsetSchema,
});

export type ListCurrenciesInput = z.infer<typeof ListCurrenciesInputSchema>;

export const ListCurrenciesResponseSchema = z.object({
	pagination: PaginationSchema,
	data: z.array(CurrencySchema),
});

export type ListCurrenciesResponse = z.infer<
	typeof ListCurrenciesResponseSchema
>;

// GET /dividends
export const GetDividendsInputSchema = z.object({
	symbols: SymbolsSchema,
	dateFrom: DateStringSchema.optional().describe(
		'Only return dividends on or after this date (YYYY-MM-DD)',
	),
	dateTo: DateStringSchema.optional().describe(
		'Only return dividends on or before this date (YYYY-MM-DD)',
	),
	limit: LimitSchema,
	offset: OffsetSchema,
});

export type GetDividendsInput = z.infer<typeof GetDividendsInputSchema>;

export const GetDividendsResponseSchema = z.object({
	pagination: PaginationSchema,
	data: z.array(DividendSchema),
});

export type GetDividendsResponse = z.infer<typeof GetDividendsResponseSchema>;

// GET /splits
export const GetSplitsInputSchema = z.object({
	symbols: SymbolsSchema,
	dateFrom: DateStringSchema.optional().describe(
		'Only return splits on or after this date (YYYY-MM-DD)',
	),
	dateTo: DateStringSchema.optional().describe(
		'Only return splits on or before this date (YYYY-MM-DD)',
	),
	limit: LimitSchema,
	offset: OffsetSchema,
});

export type GetSplitsInput = z.infer<typeof GetSplitsInputSchema>;

export const GetSplitsResponseSchema = z.object({
	pagination: PaginationSchema,
	data: z.array(SplitSchema),
});

export type GetSplitsResponse = z.infer<typeof GetSplitsResponseSchema>;

export type MarketstackEndpointInputs = {
	getEod: GetEodInput;
	getTickerEod: GetTickerEodInput;
	getTickerEodLatest: GetTickerEodLatestInput;
	getTickerInfo: GetTickerInfoInput;
	listTickers: ListTickersInput;
	getExchange: GetExchangeInput;
	listExchanges: ListExchangesInput;
	listCurrencies: ListCurrenciesInput;
	getDividends: GetDividendsInput;
	getSplits: GetSplitsInput;
};

export type MarketstackEndpointOutputs = {
	getEod: GetEodResponse;
	getTickerEod: GetTickerEodResponse;
	getTickerEodLatest: GetTickerEodLatestResponse;
	getTickerInfo: GetTickerInfoResponse;
	listTickers: ListTickersResponse;
	getExchange: GetExchangeResponse;
	listExchanges: ListExchangesResponse;
	listCurrencies: ListCurrenciesResponse;
	getDividends: GetDividendsResponse;
	getSplits: GetSplitsResponse;
};

export const MarketstackEndpointInputSchemas = {
	getEod: GetEodInputSchema,
	getTickerEod: GetTickerEodInputSchema,
	getTickerEodLatest: GetTickerEodLatestInputSchema,
	getTickerInfo: GetTickerInfoInputSchema,
	listTickers: ListTickersInputSchema,
	getExchange: GetExchangeInputSchema,
	listExchanges: ListExchangesInputSchema,
	listCurrencies: ListCurrenciesInputSchema,
	getDividends: GetDividendsInputSchema,
	getSplits: GetSplitsInputSchema,
} as const;

export const MarketstackEndpointOutputSchemas = {
	getEod: GetEodResponseSchema,
	getTickerEod: GetTickerEodResponseSchema,
	getTickerEodLatest: GetTickerEodLatestResponseSchema,
	getTickerInfo: GetTickerInfoResponseSchema,
	listTickers: ListTickersResponseSchema,
	getExchange: GetExchangeResponseSchema,
	listExchanges: ListExchangesResponseSchema,
	listCurrencies: ListCurrenciesResponseSchema,
	getDividends: GetDividendsResponseSchema,
	getSplits: GetSplitsResponseSchema,
} as const;
