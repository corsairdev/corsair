import { z } from 'zod';

/**
 * PHP DateTime object on ticker-embedded exchanges.
 * Official: TickerExchange.date_* — https://marketstack.com/documentation_v2
 * Live GET /v2/tickers/{symbol} returns { date, timezone_type, timezone }.
 */
export const MarketstackExchangeDateTime = z
	.object({
		date: z.string().optional(),
		timezone_type: z.number().optional(),
		timezone: z.string().optional(),
	})
	.loose();

export type MarketstackExchangeDateTime = z.infer<
	typeof MarketstackExchangeDateTime
>;

const ExchangeDateField = z
	.union([z.string(), MarketstackExchangeDateTime])
	.nullable();

/**
 * Stock exchange (MIC record).
 * Official: GET /v2/exchanges, GET /v2/exchanges/{mic}
 * https://marketstack.com/documentation_v2
 */
export const MarketstackExchange = z
	.object({
		name: z.string().optional(),
		acronym: z.string().nullable().optional(),
		mic: z.string(),
		country: z.string().nullable().optional(),
		country_code: z.string().nullable().optional(),
		city: z.string().nullable().optional(),
		website: z.string().nullable().optional(),
		operating_mic: z.string().optional(),
		oprt_sgmt: z.string().optional(),
		legal_entity_name: z.string().optional(),
		exchange_lei: z.string().optional(),
		market_category_code: z.string().optional(),
		exchange_status: z.string().optional(),
		date_creation: ExchangeDateField.optional(),
		date_last_update: ExchangeDateField.optional(),
		date_last_validation: ExchangeDateField.optional(),
		date_expiry: ExchangeDateField.optional(),
		comments: z.string().nullable().optional(),
	})
	.loose();

export type MarketstackExchange = z.infer<typeof MarketstackExchange>;

/**
 * Exchange object nested on ticker payloads.
 * Official: TickerExchange — https://marketstack.com/documentation_v2
 * Live GET /v2/tickerslist returns a subset (name, acronym, mic).
 */
export const MarketstackStockExchangeRef = MarketstackExchange.partial().extend(
	{
		mic: z.string().optional(),
	},
);

export type MarketstackStockExchangeRef = z.infer<
	typeof MarketstackStockExchangeRef
>;

/**
 * End-of-day OHLCV bar.
 * Official: GET /v2/eod, GET /v2/tickers/{symbol}/eod, GET /v2/tickers/{symbol}/eod/latest
 * https://marketstack.com/documentation_v2
 */
export const MarketstackEodBar = z
	.object({
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
		name: z.string().optional(),
		exchange_code: z.string().optional(),
		asset_type: z.string().optional(),
		price_currency: z.string().optional(),
		symbol: z.string(),
		exchange: z.string().optional(),
		date: z.string(),
	})
	.loose();

export type MarketstackEodBar = z.infer<typeof MarketstackEodBar>;

/**
 * Dividend event.
 * Official: GET /v2/dividends — https://marketstack.com/documentation_v2
 */
export const MarketstackDividend = z
	.object({
		symbol: z.string(),
		date: z.string(),
		dividend: z.number(),
		payment_date: z.string().nullable().optional(),
		record_date: z.string().nullable().optional(),
		declaration_date: z.string().nullable().optional(),
		distr_freq: z.string().nullable().optional(),
	})
	.loose();

export type MarketstackDividend = z.infer<typeof MarketstackDividend>;

/**
 * Stock split event.
 * Official: GET /v2/splits — https://marketstack.com/documentation_v2
 */
export const MarketstackSplit = z
	.object({
		symbol: z.string(),
		date: z.string(),
		split_factor: z.number(),
		stock_split: z.string().nullable().optional(),
	})
	.loose();

export type MarketstackSplit = z.infer<typeof MarketstackSplit>;

/**
 * Ticker metadata (GET /v2/tickers/{symbol}).
 * Official TickerResponse — https://marketstack.com/documentation_v2
 * /v2/tickerslist items use `ticker` on the wire; handlers map that to `symbol`.
 */
export const MarketstackTicker = z
	.object({
		name: z.string().optional(),
		symbol: z.string(),
		has_intraday: z.boolean().optional(),
		has_eod: z.boolean().optional(),
		country: z.string().nullable().optional(),
		cik: z.string().optional(),
		isin: z.string().optional(),
		cusip: z.string().optional(),
		ein_employer_id: z.string().optional(),
		lei: z.string().optional(),
		series_id: z.string().optional(),
		item_type: z.string().optional(),
		sector: z.string().optional(),
		industry: z.string().optional(),
		sic_code: z.string().optional(),
		sic_name: z.string().optional(),
		stock_exchange: MarketstackStockExchangeRef.optional(),
	})
	.loose();

export type MarketstackTicker = z.infer<typeof MarketstackTicker>;

/**
 * Supported currency.
 * Official: GET /v2/currencies — https://marketstack.com/documentation_v2
 */
export const MarketstackCurrency = z
	.object({
		code: z.string(),
		symbol: z.string().optional(),
		name: z.string().optional(),
		symbol_native: z.string().optional(),
	})
	.loose();

export type MarketstackCurrency = z.infer<typeof MarketstackCurrency>;
