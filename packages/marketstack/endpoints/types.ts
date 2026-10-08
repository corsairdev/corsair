import { z } from 'zod';
import {
	MarketstackCurrency,
	MarketstackDividend,
	MarketstackEodBar,
	MarketstackExchange,
	MarketstackSplit,
	MarketstackStockExchangeRef,
	MarketstackTicker,
} from '../schema/database';

const DateStringSchema = z.iso.date();

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

export const EodBarSchema = MarketstackEodBar;
export type EodBar = z.infer<typeof EodBarSchema>;

export const DividendSchema = MarketstackDividend;
export type Dividend = z.infer<typeof DividendSchema>;

export const SplitSchema = MarketstackSplit;
export type Split = z.infer<typeof SplitSchema>;

export const StockExchangeRefSchema = MarketstackStockExchangeRef;

export const TickerSchema = MarketstackTicker;
export type Ticker = z.infer<typeof TickerSchema>;

export const ExchangeSchema = MarketstackExchange;
export type Exchange = z.infer<typeof ExchangeSchema>;

export const CurrencySchema = MarketstackCurrency;
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

// v2 nests a ticker's EOD bars under `data.eod` instead of returning them as
// `data` directly; this is the wire shape, remapped onto
// GetTickerEodResponseSchema by the endpoint.
export const GetTickerEodWireResponseSchema = z.object({
	pagination: PaginationSchema,
	data: z
		.object({
			name: z.string().optional(),
			symbol: z.string().optional(),
			has_intraday: z.boolean().optional(),
			has_eod: z.boolean().optional(),
			country: z.string().nullable().optional(),
			eod: z.array(EodBarSchema),
		})
		.loose(),
});

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

// v2's /tickerslist keys each result by `ticker` instead of `symbol`; this is
// the wire shape, remapped onto ListTickersResponseSchema by the endpoint so
// results stay consistent with the rest of the plugin's `symbol` fields.
export const ListTickersWireResponseSchema = z.object({
	pagination: PaginationSchema,
	data: z.array(
		MarketstackTicker.omit({ symbol: true }).extend({
			ticker: z.string(),
		}),
	),
});

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

// v2 wraps a single exchange lookup in a `data` envelope instead of returning
// it directly; this is the wire shape, unwrapped onto
// GetExchangeResponseSchema by the endpoint.
export const GetExchangeWireResponseSchema = z.object({
	data: ExchangeSchema,
});

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
