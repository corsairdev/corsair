import { z } from 'zod';

// Every Surf data response is an envelope. data is an array, an object, or null
// depending on the route, so the shared output stays loose.
export const SurfResponse = z.looseObject({
	data: z
		.union([z.array(z.looseObject({})), z.looseObject({}), z.null()])
		.optional(),
	meta: z.looseObject({ credits_used: z.number().optional() }).optional(),
	symbol: z.string().optional(),
	project_id: z.string().optional(),
});

export const DexTokenPriceInput = z
	.object({
		chain: z.enum([
			'ethereum',
			'base',
			'bsc',
			'arbitrum',
			'optimism',
			'polygon',
			'avalanche',
			'solana',
		]),
		address: z.string(),
		interval: z
			.enum(['1m', '5m', '15m', '30m', '1h', '4h', '12h', '1d', '7d'])
			.optional(),
		time_range: z
			.enum([
				'1h',
				'6h',
				'12h',
				'24h',
				'7d',
				'30d',
				'90d',
				'180d',
				'365d',
				'max',
			])
			.optional(),
		from: z.string().optional(),
		to: z.string().optional(),
	})
	.strict()
	.superRefine((value, context) => {
		const hasFrom = value.from !== undefined;
		const hasTo = value.to !== undefined;
		if (hasFrom !== hasTo) {
			context.addIssue({
				code: 'custom',
				message: 'from and to must be sent together',
			});
		}
	});

export const EquityBalanceSheetInput = z
	.object({
		symbol: z.string(),
		period: z.enum(['quarterly', 'annual']).optional(),
		end_date: z.string().optional(),
		limit: z.number().int().min(1).max(100).optional(),
	})
	.strict();

export const EquityCandlesInput = z
	.object({
		symbol: z.string().min(1).max(20),
		interval: z.enum(['day', 'week', 'month', 'year']).optional(),
		interval_multiplier: z.number().int().min(1).max(100).optional(),
		start_date: z.string().optional(),
		end_date: z.string().optional(),
	})
	.strict();

export const EquityCashFlowInput = z
	.object({
		symbol: z.string(),
		period: z.enum(['quarterly', 'ytd', 'annual', 'ttm']).optional(),
		end_date: z.string().optional(),
		limit: z.number().int().min(1).max(100).optional(),
	})
	.strict();

export const EquityEtfHoldingsInput = z
	.object({
		symbol: z.string().min(1).max(20),
		as_of: z.string().optional(),
		asset_class: z.enum(['equity', 'bond']).optional(),
		limit: z.number().int().min(1).max(1000).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();

export const EquityFilingsInput = z
	.object({
		symbol: z.string(),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();

export const EquityIncomeStatementInput = z
	.object({
		symbol: z.string(),
		period: z.enum(['quarterly', 'ytd', 'annual', 'ttm']).optional(),
		end_date: z.string().optional(),
		limit: z.number().int().min(1).max(100).optional(),
	})
	.strict();

export const EquityLatestFilingsInput = z
	.object({
		limit: z.number().int().min(1).max(20).optional(),
	})
	.strict();

export const EquityLatestFinancialsInput = z
	.object({
		limit: z.number().int().min(1).max(20).optional(),
		market_cap_min: z.number().min(0).nullable().optional(),
	})
	.strict();

export const EquityListingsInput = z
	.object({
		symbol: z.string(),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();

export const EquityMetaInput = z
	.object({
		symbol: z.string().min(1).max(419),
		include_tokenized: z.boolean().optional(),
	})
	.strict();

export const EquityMetricsInput = z
	.object({
		symbol: z.string(),
		period: z.enum(['quarterly', 'annual', 'ttm']).optional(),
		end_date: z.string().optional(),
		limit: z.number().int().min(1).max(100).optional(),
	})
	.strict();

export const EquityOverviewInput = z
	.object({
		symbol: z.string(),
		period: z.enum(['quarterly', 'ytd', 'annual', 'ttm']).optional(),
		end_date: z.string().optional(),
		limit: z.number().int().min(1).max(100).optional(),
	})
	.strict();

export const EquityProfileInput = z
	.object({
		symbol: z.string(),
	})
	.strict();

export const EquitySegmentsInput = z
	.object({
		symbol: z.string(),
		period: z.enum(['quarterly', 'annual']).optional(),
		statement_type: z.enum(['income', 'balance_sheet', 'cash_flow']).optional(),
		metric_code: z.string().optional(),
		dimension_type: z.string().optional(),
		label: z.string().optional(),
		start_date: z.string().optional(),
		end_date: z.string().optional(),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();

export const ExchangeCandlesInput = z
	.object({
		exchange: z.enum([
			'bithumb',
			'upbit',
			'hashkey',
			'bitflyer',
			'coinone',
			'korbit',
		]),
		pair: z.string(),
		interval: z.enum(['5m', '4h', '1w']).optional(),
		from: z.string().optional(),
		to: z.string().optional(),
		include_synthetic: z.boolean().optional(),
		limit: z.number().int().min(1).max(300).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict()
	.superRefine((value, context) => {
		const hasFrom = value.from !== undefined;
		const hasTo = value.to !== undefined;
		if (hasFrom !== hasTo) {
			context.addIssue({
				code: 'custom',
				message: 'from and to must be sent together',
			});
		}
	});

export const ExchangeCoverageInput = z
	.object({
		exchange: z
			.enum(['bithumb', 'upbit', 'hashkey', 'bitflyer', 'coinone', 'korbit'])
			.optional(),
		q: z.string().optional(),
		quote: z.string().optional(),
		type: z.enum(['spot']).optional(),
		status: z.enum(['active', 'inactive']).optional(),
		data_status: z
			.enum([
				'covered',
				'official_empty_all',
				'official_empty_ticker',
				'official_empty_5m',
				'official_empty_weekly',
				'stale_gt_7d',
				'stale_30m_to_7d',
				'recent_but_lt_min_ta_candles',
				'missing_4h',
				'missing_latest_ta',
			])
			.optional(),
		sort_by: z
			.enum([
				'pair',
				'price',
				'change_24h',
				'volume_24h',
				'technical_score',
				'latest_candle_at',
				'status',
			])
			.optional(),
		order: z.enum(['asc', 'desc']).optional(),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();

export const ExchangeDepthInput = z
	.object({
		pair: z.string(),
		type: z.enum(['spot', 'swap', 'perpetual', 'perp']).optional(),
		limit: z.number().int().min(1).max(100).optional(),
		exchange: z
			.enum([
				'binance',
				'okx',
				'bybit',
				'bitget',
				'coinbase',
				'kraken',
				'gate',
				'mexc',
				'upbit',
				'bitstamp',
				'deribit',
				'bitmex',
				'bithumb',
				'hyperliquid',
			])
			.optional(),
	})
	.strict();

export const ExchangeFundingHistoryInput = z
	.object({
		pair: z.string(),
		from: z.string().optional(),
		limit: z.number().int().min(1).max(500).optional(),
		exchange: z
			.enum([
				'binance',
				'okx',
				'bybit',
				'bitget',
				'gate',
				'htx',
				'mexc',
				'bitfinex',
				'bitmex',
				'hyperliquid',
			])
			.optional(),
	})
	.strict();

export const ExchangeKlinesInput = z
	.object({
		pair: z.string(),
		type: z.enum(['spot', 'swap', 'perpetual', 'perp']).optional(),
		interval: z
			.enum([
				'1m',
				'3m',
				'5m',
				'15m',
				'30m',
				'1h',
				'2h',
				'4h',
				'6h',
				'8h',
				'12h',
				'1d',
				'3d',
				'1w',
				'1M',
			])
			.optional(),
		from: z.string().optional(),
		limit: z.number().int().min(1).max(1000).optional(),
		exchange: z
			.enum([
				'binance',
				'okx',
				'bybit',
				'bitget',
				'coinbase',
				'kraken',
				'gate',
				'htx',
				'kucoin',
				'mexc',
				'upbit',
				'bitfinex',
				'bitstamp',
				'deribit',
				'bitmex',
				'bithumb',
				'hyperliquid',
			])
			.optional(),
	})
	.strict();

export const ExchangeLongShortRatioInput = z
	.object({
		pair: z.string(),
		interval: z.enum(['1h', '4h', '1d']).optional(),
		from: z.string().optional(),
		limit: z.number().int().min(1).max(500).optional(),
		exchange: z.enum(['binance', 'okx', 'bybit', 'bitget']).optional(),
	})
	.strict();

export const ExchangeMarketsInput = z
	.object({
		exchange: z
			.enum([
				'binance',
				'okx',
				'bybit',
				'bitget',
				'coinbase',
				'kraken',
				'gate',
				'htx',
				'kucoin',
				'mexc',
				'upbit',
				'bitfinex',
				'bitstamp',
				'deribit',
				'bitmex',
				'bithumb',
				'hyperliquid',
			])
			.optional(),
		type: z
			.enum(['spot', 'swap', 'future', 'option', 'perpetual', 'perp'])
			.optional(),
		base: z.string().optional(),
		quote: z.string().optional(),
		search: z.string().optional(),
		limit: z.number().int().min(1).max(5000).optional(),
	})
	.strict();

export const ExchangePerpInput = z
	.object({
		pair: z.string(),
		fields: z.string().optional(),
		exchange: z
			.enum([
				'binance',
				'okx',
				'bybit',
				'bitget',
				'htx',
				'bitfinex',
				'bitmex',
				'hyperliquid',
			])
			.optional(),
	})
	.strict();

export const ExchangePriceInput = z
	.object({
		pair: z.string(),
		type: z.enum(['spot', 'swap', 'perpetual', 'perp']).optional(),
		exchange: z
			.enum([
				'binance',
				'okx',
				'bybit',
				'bitget',
				'coinbase',
				'kraken',
				'gate',
				'htx',
				'kucoin',
				'mexc',
				'upbit',
				'bitfinex',
				'bitstamp',
				'deribit',
				'bitmex',
				'bithumb',
				'hyperliquid',
			])
			.optional(),
	})
	.strict();

export const FundDetailInput = z
	.object({
		id: z.string().optional(),
		q: z.string().max(100).optional(),
	})
	.strict();

export const FundPortfolioInput = z
	.object({
		id: z.string().optional(),
		q: z.string().max(100).optional(),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
		is_lead: z.enum(['true', 'false', '']).optional(),
		invested_after: z.number().int().optional(),
		invested_before: z.number().int().optional(),
		sort_by: z.enum(['invested_at', 'recent_raise', 'total_raise']).optional(),
		order: z.enum(['asc', 'desc']).optional(),
	})
	.strict();

export const FundRankingInput = z
	.object({
		metric: z.enum(['tier', 'portfolio_count']),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();

export const HeatscoreDetailInput = z
	.object({
		id: z.string().optional(),
		project_slug: z.string().optional(),
		time_range: z.enum(['24h', '7d']).optional(),
	})
	.strict();

export const HeatscoreProjectsInput = z
	.object({
		time_range: z.enum(['24h', '7d']).optional(),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();

export const HeatscoreTokenOfTheDayInput = z
	.object({
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();

export const HeatscoreTokenOfWeekInput = z
	.object({
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();

export const HyperliquidAccountInput = z
	.object({
		address: z.string(),
	})
	.strict();

export const HyperliquidCandlesInput = z
	.object({
		symbol: z.string(),
		interval: z
			.enum([
				'1m',
				'3m',
				'5m',
				'15m',
				'30m',
				'1h',
				'2h',
				'4h',
				'8h',
				'12h',
				'1d',
				'3d',
				'1w',
				'1M',
			])
			.optional(),
		from: z.string(),
		to: z.string(),
	})
	.strict();

export const HyperliquidFillsInput = z
	.object({
		address: z.string(),
		from: z.string().optional(),
		to: z.string().optional(),
		to_ms: z.number().int().min(0).optional(),
		to_fill_id: z.string().optional(),
		order: z.enum(['desc', 'asc']).optional(),
		cursor: z.string().optional(),
		symbol: z.string().optional(),
		limit: z.number().int().min(1).max(100).optional(),
	})
	.strict()
	.superRefine((value, context) => {
		const hasFrom = value.from !== undefined;
		const hasTo = value.to !== undefined;
		if (hasFrom !== hasTo) {
			context.addIssue({
				code: 'custom',
				message: 'from and to must be sent together',
			});
		}
	});

export const HyperliquidLeaderboardInput = z
	.object({
		time_range: z.enum(['1d', '7d', '30d', '90d', 'all']).optional(),
		sort_by: z.enum(['total_pnl', 'win_rate', 'volume_traded']).optional(),
		min_trades: z.number().int().min(0).optional(),
		min_days_active: z.number().int().min(0).optional(),
		min_account_age_days: z.number().int().min(0).optional(),
		min_human_score: z.number().int().min(0).max(100).optional(),
		dex: z
			.enum([
				'main_dex',
				'xyz',
				'flx',
				'vntl',
				'hyna',
				'km',
				'abcd',
				'cash',
				'para',
				'mkts',
			])
			.optional(),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();

export const HyperliquidOrdersInput = z
	.object({
		address: z.string(),
		open_limit: z.number().int().min(1).max(2000).optional(),
		historical_limit: z.number().int().min(1).max(2000).optional(),
	})
	.strict();

export const HyperliquidPerformanceInput = z
	.object({
		address: z.string(),
		dex: z.string().optional(),
	})
	.strict();

export const HyperliquidPositionsInput = z
	.object({
		address: z.string(),
		dex: z
			.enum([
				'main_dex',
				'xyz',
				'flx',
				'vntl',
				'hyna',
				'km',
				'abcd',
				'cash',
				'para',
				'mkts',
			])
			.optional(),
	})
	.strict();

export const HyperliquidTradesInput = z
	.object({
		address: z.string(),
		symbol: z.string().optional(),
		direction: z.enum(['long', 'short']).optional(),
		dex: z.string().optional(),
		from: z.string().optional(),
		to: z.string().optional(),
		cursor: z.string().optional(),
		limit: z.number().int().min(1).max(100).optional(),
	})
	.strict()
	.superRefine((value, context) => {
		const hasFrom = value.from !== undefined;
		const hasTo = value.to !== undefined;
		if (hasFrom !== hasTo) {
			context.addIssue({
				code: 'custom',
				message: 'from and to must be sent together',
			});
		}
	});

export const HyperliquidTradesAggregateInput = z
	.object({
		address: z.string(),
		group_by: z
			.enum(['day', 'symbol', 'direction', 'size_bucket', 'hold_bucket'])
			.optional(),
		from: z.string().optional(),
		to: z.string().optional(),
		dex: z
			.enum([
				'main_dex',
				'xyz',
				'flx',
				'vntl',
				'hyna',
				'km',
				'abcd',
				'cash',
				'para',
				'mkts',
			])
			.optional(),
		fill_gaps: z.boolean().optional(),
	})
	.strict()
	.superRefine((value, context) => {
		const hasFrom = value.from !== undefined;
		const hasTo = value.to !== undefined;
		if (hasFrom !== hasTo) {
			context.addIssue({
				code: 'custom',
				message: 'from and to must be sent together',
			});
		}
	});

export const HyperliquidTradesContextInput = z
	.object({
		address: z.string(),
		symbol: z.string(),
		direction: z.enum(['long', 'short']),
		open_time: z.number().int().min(1),
		close_time: z.number().int().min(1),
	})
	.strict();

export const MarketEtfInput = z
	.object({
		symbol: z.enum(['BTC', 'ETH', 'XRP', 'SOL', 'HYPE']),
		sort_by: z.enum(['flow_usd', 'timestamp']).optional(),
		order: z.enum(['asc', 'desc']).optional(),
		from: z.string().optional(),
		to: z.string().optional(),
	})
	.strict()
	.superRefine((value, context) => {
		const hasFrom = value.from !== undefined;
		const hasTo = value.to !== undefined;
		if (hasFrom !== hasTo) {
			context.addIssue({
				code: 'custom',
				message: 'from and to must be sent together',
			});
		}
	});

export const MarketExchangeFlowExchangesInput = z
	.object({
		symbol: z.enum(['BTC', 'ETH']),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();

export const MarketFearGreedInput = z
	.object({
		from: z.string().optional(),
		to: z.string().optional(),
	})
	.strict()
	.superRefine((value, context) => {
		const hasFrom = value.from !== undefined;
		const hasTo = value.to !== undefined;
		if (hasFrom !== hasTo) {
			context.addIssue({
				code: 'custom',
				message: 'from and to must be sent together',
			});
		}
	});

export const MarketFuturesInput = z
	.object({
		sort_by: z
			.enum(['open_interest', 'funding_rate', 'volume_24h', 'long_short_ratio'])
			.optional(),
		order: z.enum(['asc', 'desc']).optional(),
	})
	.strict();

export const MarketLiquidationChartInput = z
	.object({
		symbol: z.string(),
		interval: z
			.enum([
				'1m',
				'3m',
				'5m',
				'15m',
				'30m',
				'1h',
				'4h',
				'6h',
				'8h',
				'12h',
				'1d',
				'1w',
			])
			.optional(),
		exchange: z
			.enum([
				'Binance',
				'OKX',
				'Bybit',
				'Bitget',
				'Hyperliquid',
				'Gate',
				'HTX',
				'Bitmex',
				'Bitfinex',
				'CoinEx',
				'Aster',
				'Lighter',
			])
			.optional(),
		limit: z.number().int().min(1).max(4500).optional(),
		from: z.string().optional(),
		to: z.string().optional(),
	})
	.strict()
	.superRefine((value, context) => {
		const hasFrom = value.from !== undefined;
		const hasTo = value.to !== undefined;
		if (hasFrom !== hasTo) {
			context.addIssue({
				code: 'custom',
				message: 'from and to must be sent together',
			});
		}
	});

export const MarketLiquidationExchangeListInput = z
	.object({
		symbol: z.string().optional(),
		time_range: z.enum(['1h', '4h', '12h', '24h']).optional(),
		sort_by: z
			.enum([
				'liquidation_usd',
				'long_liquidation_usd',
				'short_liquidation_usd',
			])
			.optional(),
		order: z.enum(['asc', 'desc']).optional(),
	})
	.strict();

export const MarketLiquidationOrderInput = z
	.object({
		exchange: z
			.enum([
				'Binance',
				'OKX',
				'Bybit',
				'Bitget',
				'Hyperliquid',
				'Gate',
				'HTX',
				'Bitmex',
				'Bitfinex',
				'CoinEx',
				'Aster',
				'Lighter',
			])
			.optional(),
		symbol: z.string().optional(),
		min_amount: z.string().optional(),
		side: z.enum(['long', 'short']).optional(),
		sort_by: z.enum(['usd_value', 'timestamp', 'price']).optional(),
		order: z.enum(['asc', 'desc']).optional(),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
		from: z.string().optional(),
		to: z.string().optional(),
	})
	.strict()
	.superRefine((value, context) => {
		const hasFrom = value.from !== undefined;
		const hasTo = value.to !== undefined;
		if (hasFrom !== hasTo) {
			context.addIssue({
				code: 'custom',
				message: 'from and to must be sent together',
			});
		}
	});

export const MarketListingInput = z
	.object({
		from: z.string(),
		to: z.string().optional(),
		symbol: z.string().optional(),
		exchange: z.string().optional(),
		product: z
			.enum(['spot', 'margin', 'perp', 'pre_market_perp', 'all'])
			.optional(),
		type: z
			.enum(['listing', 'delisting', 'cancelled', 'advanced', 'postponed'])
			.optional(),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();

export const MarketOnchainIndicatorInput = z
	.object({
		symbol: z.enum(['BTC', 'ETH']),
		metric: z.enum([
			'nupl',
			'sopr',
			'mvrv',
			'puell-multiple',
			'nvm',
			'nvt',
			'nvt-golden-cross',
			'exchange-flows/inflow',
			'exchange-flows/outflow',
			'exchange-flows/netflow',
			'exchange-flows/reserve',
		]),
		granularity: z.enum(['day']).optional(),
		from: z.string().optional(),
		to: z.string().optional(),
		exchange: z
			.enum([
				'all_exchange',
				'spot_exchange',
				'derivative_exchange',
				'coinbase_prime',
				'binance',
				'coinbase_advanced',
				'okx',
				'kraken',
				'bybit',
				'bitstamp',
				'gemini',
				'bitget',
				'kucoin',
				'bitfinex',
				'gate_io',
				'deribit',
				'mexc',
				'htx_global',
				'bitflyer',
				'coinone',
				'bithumb',
				'upbit',
				'hashkey_exchange',
			])
			.optional(),
	})
	.strict()
	.superRefine((value, context) => {
		const hasFrom = value.from !== undefined;
		const hasTo = value.to !== undefined;
		if (hasFrom !== hasTo) {
			context.addIssue({
				code: 'custom',
				message: 'from and to must be sent together',
			});
		}
	});

export const MarketOptionsInput = z
	.object({
		symbol: z.enum(['BTC', 'ETH', 'SOL', 'XRP', 'BNB', 'DOGE', 'ADA', 'AVAX']),
		sort_by: z.enum(['open_interest', 'volume_24h']).optional(),
		order: z.enum(['asc', 'desc']).optional(),
	})
	.strict();

export const MarketPriceInput = z
	.object({
		symbol: z.string(),
		time_range: z
			.enum(['1d', '7d', '14d', '30d', '90d', '180d', '365d', 'max'])
			.optional(),
		from: z.string().optional(),
		to: z.string().optional(),
		currency: z.string().optional(),
	})
	.strict()
	.superRefine((value, context) => {
		const hasFrom = value.from !== undefined;
		const hasTo = value.to !== undefined;
		if (hasFrom !== hasTo) {
			context.addIssue({
				code: 'custom',
				message: 'from and to must be sent together',
			});
		}
	});

export const MarketPriceIndicatorInput = z
	.object({
		indicator: z.enum([
			'rsi',
			'macd',
			'ema',
			'sma',
			'bbands',
			'stoch',
			'adx',
			'atr',
			'cci',
			'obv',
			'vwap',
			'dmi',
			'ichimoku',
			'supertrend',
		]),
		symbol: z.string(),
		interval: z
			.enum(['1m', '5m', '15m', '30m', '1h', '2h', '4h', '12h', '1d', '1w'])
			.optional(),
		exchange: z.enum(['binance', 'bybit', 'coinbase', 'kraken']).optional(),
		from: z.string().optional(),
		to: z.string().optional(),
		options: z.string().optional(),
	})
	.strict()
	.superRefine((value, context) => {
		const hasFrom = value.from !== undefined;
		const hasTo = value.to !== undefined;
		if (hasFrom !== hasTo) {
			context.addIssue({
				code: 'custom',
				message: 'from and to must be sent together',
			});
		}
	});

export const MarketPublicSaleInput = z
	.object({
		id: z.string().optional(),
		q: z.string().optional(),
	})
	.strict();

export const MarketRankingInput = z
	.object({
		sort_by: z.enum(['market_cap', 'change_24h', 'volume_24h']).optional(),
		order: z.enum(['asc', 'desc']).optional(),
		category: z
			.enum([
				'MEME',
				'AI',
				'AI_AGENTS',
				'L1',
				'L2',
				'DEFI',
				'GAMING',
				'STABLECOIN',
				'RWA',
				'DEPIN',
				'SOL_ECO',
				'BASE_ECO',
				'LST',
			])
			.optional(),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();

export const MarketTgeInput = z
	.object({
		id: z.string().optional(),
		q: z.string().optional(),
	})
	.strict();

export const NewsDetailInput = z
	.object({
		id: z.string(),
	})
	.strict();

export const NewsFeedInput = z
	.object({
		source: z
			.enum([
				'coindesk',
				'cointelegraph',
				'theblock',
				'decrypt',
				'dlnews',
				'blockbeats',
				'bitcoincom',
				'coinpedia',
				'ambcrypto',
				'cryptodaily',
				'cryptopotato',
				'phemex',
				'panews',
				'odaily',
				'tradingview',
				'chaincatcher',
				'techflow',
			])
			.optional(),
		project: z.string().optional(),
		from: z.string().optional(),
		to: z.string().optional(),
		sort_by: z.enum(['recency', 'trending']).optional(),
		limit: z.number().int().min(1).max(50).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict()
	.superRefine((value, context) => {
		const hasFrom = value.from !== undefined;
		const hasTo = value.to !== undefined;
		if (hasFrom !== hasTo) {
			context.addIssue({
				code: 'custom',
				message: 'from and to must be sent together',
			});
		}
	});

export const OnchainBridgeRankingInput = z
	.object({
		time_range: z.enum(['7d', '30d', '90d', '180d', '1y', 'all']).optional(),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();

export const OnchainDexActivityInput = z
	.object({
		chain: z.enum(['ethereum', 'base', 'bsc', 'arbitrum', 'tron']),
		project: z.string().optional(),
		address: z.string().optional(),
		time_range: z.enum(['1d', '7d', '30d', '90d']).optional(),
		from: z.string().optional(),
		to: z.string().optional(),
		group_by: z.enum(['total', 'day']).optional(),
	})
	.strict()
	.superRefine((value, context) => {
		const hasFrom = value.from !== undefined;
		const hasTo = value.to !== undefined;
		if (hasFrom !== hasTo) {
			context.addIssue({
				code: 'custom',
				message: 'from and to must be sent together',
			});
		}
	});

export const OnchainGasPriceInput = z
	.object({
		chain: z.enum([
			'ethereum',
			'polygon',
			'bsc',
			'arbitrum',
			'optimism',
			'base',
			'avalanche',
			'fantom',
			'linea',
			'cyber',
		]),
	})
	.strict();

export const OnchainQueryInput = z
	.object({
		fields: z.array(z.string()).nullable().optional(),
		filters: z
			.array(
				z
					.object({
						field: z.string(),
						op: z.string(),
						value: z.string(),
					})
					.strict(),
			)
			.nullable()
			.optional(),
		limit: z.number().int().optional(),
		offset: z.number().int().optional(),
		sort: z
			.array(
				z
					.object({
						field: z.string(),
						order: z.string().optional(),
					})
					.strict(),
			)
			.nullable()
			.optional(),
		source: z.string(),
	})
	.strict();

export const OnchainSchemaInput = z
	.object({
		table: z.string().optional(),
	})
	.strict();

export const OnchainSqlInput = z
	.object({
		max_rows: z.number().int().min(1).max(10000).optional(),
		sql: z.string(),
	})
	.strict();

export const OnchainSqlJobsInput = z
	.object({
		max_rows: z.number().int().min(1).max(10000).optional(),
		sql: z.string(),
	})
	.strict();

export const OnchainSqlJobsJobIdInput = z
	.object({
		job_id: z.string().uuid(),
	})
	.strict();

export const GetOnchainSqlJobsJobIdInput = z
	.object({
		job_id: z.string().uuid(),
	})
	.strict();

export const OnchainSqlJobsJobIdResultsInput = z
	.object({
		job_id: z.string().uuid(),
		format: z.enum(['json', 'csv']).optional(),
	})
	.strict();

export const OnchainSqlPreflightInput = z
	.object({
		max_rows: z.number().int().min(1).max(10000).optional(),
		sql: z.string(),
	})
	.strict();

export const OnchainTxInput = z
	.object({
		hash: z.string(),
		chain: z.enum([
			'ethereum',
			'polygon',
			'bsc',
			'arbitrum',
			'optimism',
			'base',
			'avalanche',
			'fantom',
			'linea',
			'cyber',
		]),
		include: z.string().optional(),
	})
	.strict();

export const OnchainYieldRankingInput = z
	.object({
		project: z.string().optional(),
		sort_by: z.enum(['apy', 'tvl_usd']).optional(),
		order: z.enum(['asc', 'desc']).optional(),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();

export const PortfolioWalletsInput = z.object({}).strict();

export const PredictionMarketAnalyticsInput = z
	.object({
		category: z
			.enum([
				'crypto',
				'culture',
				'economics',
				'financials',
				'politics',
				'stem',
				'sports',
			])
			.optional(),
		platform: z.enum(['polymarket', 'kalshi']).optional(),
		time_range: z.enum(['7d', '30d', '90d', '180d', '1y']).optional(),
		top_n: z.number().int().min(1).max(50).optional(),
		sort_by: z
			.enum([
				'volume_7d',
				'whale_flow_net_7d',
				'price_change_7d',
				'oi_change_7d',
			])
			.optional(),
		order: z.enum(['asc', 'desc']).optional(),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();

export const PredictionMarketCorrelationsInput = z
	.object({
		category: z.enum([
			'crypto',
			'culture',
			'economics',
			'financials',
			'politics',
			'stem',
			'sports',
		]),
		condition_id: z.string().optional(),
		min_correlation: z.number().optional(),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();

export const PredictionMarketKalshiEventsInput = z
	.object({
		event_ticker: z.string().optional(),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();

export const PredictionMarketKalshiMarketsInput = z
	.object({
		market_ticker: z.string().optional(),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();

export const PredictionMarketKalshiOpenInterestInput = z
	.object({
		ticker: z.string(),
		time_range: z.enum(['7d', '30d', '90d', '180d', '1y']).optional(),
	})
	.strict();

export const PredictionMarketKalshiOrderbooksInput = z
	.object({
		ticker: z.string(),
		start_time: z.number().int().optional(),
		end_time: z.number().int().optional(),
		limit: z.number().int().min(1).max(200).optional(),
		pagination_key: z.string().optional(),
	})
	.strict();

export const PredictionMarketKalshiPricesInput = z
	.object({
		ticker: z.string(),
		time_range: z.enum(['7d', '30d', '90d', '180d', '1y']).optional(),
		interval: z.enum(['1h', '1d', 'latest']).optional(),
	})
	.strict();

export const PredictionMarketKalshiTradesInput = z
	.object({
		ticker: z.string(),
		taker_side: z.enum(['yes', 'no']).optional(),
		min_amount: z.number().int().min(0).optional(),
		from: z.string().optional(),
		to: z.string().optional(),
		sort_by: z.enum(['timestamp', 'notional_volume_usd']).optional(),
		order: z.enum(['asc', 'desc']).optional(),
		limit: z.number().int().min(1).max(500).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict()
	.superRefine((value, context) => {
		const hasFrom = value.from !== undefined;
		const hasTo = value.to !== undefined;
		if (hasFrom !== hasTo) {
			context.addIssue({
				code: 'custom',
				message: 'from and to must be sent together',
			});
		}
	});

export const PredictionMarketKalshiVolumesInput = z
	.object({
		ticker: z.string(),
		time_range: z.enum(['7d', '30d', '90d', '180d', '1y']).optional(),
	})
	.strict();

export const PredictionMarketMatchingDailyInput = z
	.object({
		polymarket_condition_id: z.string(),
		kalshi_market_ticker: z.string(),
		time_range: z
			.enum(['1d', '7d', '30d', '90d', '180d', '1y', 'all'])
			.optional(),
		limit: z.number().int().min(1).max(10000).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();

export const PredictionMarketMatchingPairsInput = z
	.object({
		category: z
			.enum([
				'crypto',
				'culture',
				'economics',
				'financials',
				'politics',
				'stem',
				'sports',
			])
			.optional(),
		match_type: z.enum(['exact', 'related']).optional(),
		active_only: z.boolean().optional(),
		min_confidence: z.number().int().min(0).max(100).optional(),
		polymarket_condition_id: z.string().optional(),
		kalshi_market_ticker: z.string().optional(),
		sort_by: z
			.enum(['confidence', 'polymarket_volume', 'kalshi_volume', 'spread_pct'])
			.optional(),
		order: z.enum(['asc', 'desc']).optional(),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();

export const PredictionMarketPolymarketEventsInput = z
	.object({
		event_slug: z.string(),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();

export const PredictionMarketPolymarketLeaderboardInput = z
	.object({
		sort_by: z.enum(['pnl', 'volume', 'trade_count']).optional(),
		order: z.enum(['asc', 'desc']).optional(),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();

export const PredictionMarketPolymarketMarketsInput = z
	.object({
		market_slug: z.string(),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();

export const PredictionMarketPolymarketOpenInterestInput = z
	.object({
		condition_id: z.string(),
		time_range: z.enum(['7d', '30d', '90d', '180d', '1y']).optional(),
	})
	.strict();

export const PredictionMarketPolymarketOrderbooksInput = z
	.object({
		token_id: z.string(),
		start_time: z.number().int().optional(),
		end_time: z.number().int().optional(),
		limit: z.number().int().min(1).max(200).optional(),
		pagination_key: z.string().optional(),
	})
	.strict();

export const PredictionMarketPolymarketPositionsInput = z
	.object({
		address: z.string(),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();

export const PredictionMarketPolymarketPriceOhlcvConditionIdInput = z
	.object({
		condition_id: z.string(),
		start_time: z.number().int().min(0).optional(),
		end_time: z.number().int().min(0).optional(),
		interval: z.number().int().min(1).max(1440).optional(),
	})
	.strict();

export const PredictionMarketPolymarketPricesInput = z
	.object({
		condition_id: z.string(),
		time_range: z.enum(['7d', '30d', '90d', '180d', '1y']).optional(),
		interval: z.enum(['1h', '1d', 'latest']).optional(),
	})
	.strict();

export const PredictionMarketPolymarketSmartMoneyInput = z
	.object({
		view: z.enum(['positioning', 'trades']).optional(),
		condition_id: z.string().optional(),
		category: z
			.enum([
				'crypto',
				'culture',
				'economics',
				'financials',
				'politics',
				'stem',
				'sports',
			])
			.optional(),
		direction: z.enum(['bullish', 'bearish', 'neutral']).optional(),
		whale_tier: z.enum(['whale', 'large', 'mega']).optional(),
		from: z.string().optional(),
		to: z.string().optional(),
		sort_by: z
			.enum([
				'smart_wallets_involved',
				'smart_buy_volume_usd',
				'smart_sell_volume_usd',
				'amount_usd',
				'block_time',
			])
			.optional(),
		order: z.enum(['asc', 'desc']).optional(),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict()
	.superRefine((value, context) => {
		const hasFrom = value.from !== undefined;
		const hasTo = value.to !== undefined;
		if (hasFrom !== hasTo) {
			context.addIssue({
				code: 'custom',
				message: 'from and to must be sent together',
			});
		}
	});

export const PredictionMarketPolymarketTradesInput = z
	.object({
		condition_id: z.string().optional(),
		address: z.string().optional(),
		type: z.enum(['trade', 'redemption', 'all']).optional(),
		outcome_label: z.enum(['Yes', 'No']).optional(),
		min_amount: z.number().min(0).optional(),
		from: z.string().optional(),
		to: z.string().optional(),
		sort_by: z.enum(['timestamp', 'notional_volume_usd']).optional(),
		limit: z.number().int().min(1).max(500).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict()
	.superRefine((value, context) => {
		const hasFrom = value.from !== undefined;
		const hasTo = value.to !== undefined;
		if (hasFrom !== hasTo) {
			context.addIssue({
				code: 'custom',
				message: 'from and to must be sent together',
			});
		}
	});

export const PredictionMarketPolymarketVolumeSplitConditionIdInput = z
	.object({
		condition_id: z.string(),
		granularity: z.enum(['hour', 'day', 'week']).optional(),
		start_time: z.number().int().min(0).optional(),
		end_time: z.number().int().min(0).optional(),
	})
	.strict();

export const PredictionMarketPolymarketVolumesInput = z
	.object({
		condition_id: z.string().optional(),
		token_id: z.string().optional(),
		time_range: z.enum(['7d', '30d', '90d', '180d', '1y']).optional(),
		interval: z.enum(['1h', '1d']).optional(),
		granularity: z.enum(['day', 'week', 'month', 'year', 'all']).optional(),
		start_time: z.number().int().optional(),
		end_time: z.number().int().optional(),
	})
	.strict();

export const ProjectAiNewsInput = z
	.object({
		id: z.string().optional(),
		q: z.string().optional(),
		limit: z.number().int().min(1).max(50).optional(),
		offset: z.number().int().min(0).optional(),
		lang: z.enum(['en', 'zh', 'ja', 'kr']).optional(),
	})
	.strict();

export const ProjectDefiMetricsInput = z
	.object({
		id: z.string().optional(),
		q: z.string().optional(),
		metric: z
			.enum(['volume', 'fee', 'fees', 'revenue', 'tvl', 'users'])
			.optional(),
		from: z.string().optional(),
		to: z.string().optional(),
		chain: z
			.enum([
				'ethereum',
				'polygon',
				'bsc',
				'arbitrum',
				'optimism',
				'base',
				'avalanche',
				'fantom',
				'solana',
			])
			.optional(),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict()
	.superRefine((value, context) => {
		const hasFrom = value.from !== undefined;
		const hasTo = value.to !== undefined;
		if (hasFrom !== hasTo) {
			context.addIssue({
				code: 'custom',
				message: 'from and to must be sent together',
			});
		}
	});

export const ProjectDefiRankingInput = z
	.object({
		metric: z.enum(['tvl', 'revenue', 'fees', 'volume', 'users']),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();

export const ProjectDetailInput = z
	.object({
		id: z.string().optional(),
		x_id: z.string().optional(),
		handle: z.string().optional(),
		q: z.string().optional(),
		fields: z.string().optional(),
	})
	.strict();

export const SearchAirdropInput = z
	.object({
		q: z.string().max(100).optional(),
		phase: z.string().optional(),
		reward_type: z
			.enum(['airdrop', 'points', 'whitelist', 'nft', 'role', 'ambassador'])
			.optional(),
		task_type: z
			.enum([
				'social',
				'bounty-platforms',
				'testnet',
				'mainnet',
				'role',
				'form',
				'liquidity',
				'mint-nft',
				'game',
				'trading',
				'staking',
				'depin',
				'node',
				'ambassador',
				'hold',
				'check-wallet',
				'mint-domain',
				'predictions',
				'deploy',
			])
			.optional(),
		has_open: z.boolean().optional(),
		sort_by: z.enum(['total_raise', 'xscore', 'last_status_update']).optional(),
		order: z.enum(['asc', 'desc']).optional(),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
		include_tasks: z.boolean().optional(),
	})
	.strict();

export const SearchAirdropActivitiesInput = z
	.object({
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();

export const SearchEventsInput = z
	.object({
		id: z.string().optional(),
		q: z.string().optional(),
		type: z
			.enum([
				'launch',
				'upgrade',
				'partnership',
				'news',
				'airdrop',
				'listing',
				'twitter',
			])
			.optional(),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();

export const SearchFundInput = z
	.object({
		q: z.string().max(100),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();

export const SearchFundraisingInput = z
	.object({
		q: z.string().min(2).max(100).optional(),
		from: z.string().optional(),
		to: z.string().optional(),
		source: z.enum(['social', 'news']).optional(),
		lang: z.enum(['en', 'zh', 'ja', 'kr', 'ko']).optional(),
		min_importance: z.number().int().min(1).max(5).optional(),
		sort_by: z.enum(['recency', 'relevance', 'importance']).optional(),
		order: z.enum(['asc', 'desc']).optional(),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict()
	.superRefine((value, context) => {
		const hasFrom = value.from !== undefined;
		const hasTo = value.to !== undefined;
		if (hasFrom !== hasTo) {
			context.addIssue({
				code: 'custom',
				message: 'from and to must be sent together',
			});
		}
	});

export const SearchNewsInput = z
	.object({
		q: z.string(),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();

export const SearchPredictionMarketInput = z
	.object({
		condition_id: z.string().optional(),
		market_ticker: z.string().optional(),
		platform: z.enum(['polymarket', 'kalshi']).optional(),
		category: z
			.enum([
				'crypto',
				'culture',
				'economics',
				'financials',
				'politics',
				'stem',
				'sports',
			])
			.optional(),
		status: z.enum(['active', 'closed', 'finalized']).optional(),
		sort_by: z
			.enum([
				'volume_1d',
				'volume_7d',
				'volume_30d',
				'open_interest',
				'trade_count_7d',
				'days_to_resolution',
			])
			.optional(),
		order: z.enum(['asc', 'desc']).optional(),
		smart_money: z.enum(['bullish', 'bearish']).optional(),
		q: z.string().optional(),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();

export const SearchProjectInput = z
	.object({
		q: z.string().max(100),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();

export const SearchTokenInput = z
	.object({
		q: z.string().max(50),
		chain: z
			.enum([
				'ethereum',
				'base',
				'bsc',
				'arbitrum',
				'solana',
				'polygon',
				'optimism',
				'avalanche',
				'fantom',
				'tron',
				'linea',
				'mantle',
				'blast',
				'gnosis',
				'zksync',
				'scroll',
			])
			.optional(),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();

export const SearchWalletInput = z
	.object({
		q: z.string(),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();

export const SearchWebInput = z
	.object({
		q: z.string(),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
		site: z.string().optional(),
		include_content: z.boolean().optional(),
	})
	.strict();

export const TokenDexTradesInput = z
	.object({
		address: z.string(),
		chain: z.enum(['ethereum', 'base', 'bsc', 'arbitrum', 'tron']).optional(),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
		include: z.string().optional(),
	})
	.strict();

export const TokenHoldersInput = z
	.object({
		address: z.string(),
		chain: z.enum([
			'ethereum',
			'polygon',
			'bsc',
			'solana',
			'avalanche',
			'arbitrum',
			'optimism',
			'base',
		]),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
		include: z.string().optional(),
	})
	.strict();

export const TokenTokenomicsInput = z
	.object({
		id: z.string().optional(),
		symbol: z.string().optional(),
		from: z.string().optional(),
		to: z.string().optional(),
	})
	.strict()
	.superRefine((value, context) => {
		const hasFrom = value.from !== undefined;
		const hasTo = value.to !== undefined;
		if (hasFrom !== hasTo) {
			context.addIssue({
				code: 'custom',
				message: 'from and to must be sent together',
			});
		}
	});

export const TokenTransferCounterpartiesInput = z
	.object({
		address: z.string(),
		chain: z.enum(['ethereum', 'base', 'bsc', 'arbitrum', 'tron']),
		direction: z.enum(['to', 'from']),
		metric: z.enum(['count', 'amount', 'amount_usd']).optional(),
		time_range: z.enum(['1d', '7d', '30d', '90d']).optional(),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
		include: z.string().optional(),
		exclude_labels: z.string().optional(),
	})
	.strict();

export const TokenTransferStatsInput = z
	.object({
		address: z.string(),
		chain: z.enum(['ethereum', 'base', 'bsc', 'arbitrum', 'tron']),
		time_range: z.enum(['1d', '7d', '30d', '90d']).optional(),
		include: z.string().optional(),
	})
	.strict();

export const TokenTransfersInput = z
	.object({
		address: z.string(),
		chain: z.enum(['ethereum', 'base', 'solana', 'tron', 'bsc', 'arbitrum']),
		from: z.string().optional(),
		to: z.string().optional(),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
		include: z.string().optional(),
	})
	.strict()
	.superRefine((value, context) => {
		const hasFrom = value.from !== undefined;
		const hasTo = value.to !== undefined;
		if (hasFrom !== hasTo) {
			context.addIssue({
				code: 'custom',
				message: 'from and to must be sent together',
			});
		}
	});

export const WalletDetailInput = z
	.object({
		address: z.string(),
		chain: z
			.enum([
				'ethereum',
				'polygon',
				'bsc',
				'avalanche',
				'arbitrum',
				'optimism',
				'fantom',
				'base',
				'solana',
			])
			.optional(),
		fields: z.string().optional(),
	})
	.strict();

export const WalletHistoryInput = z
	.object({
		address: z.string(),
		chain: z
			.enum([
				'ethereum',
				'polygon',
				'bsc',
				'avalanche',
				'arbitrum',
				'optimism',
				'fantom',
				'base',
			])
			.optional(),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
		before: z.number().int().min(0).optional(),
		sort_by: z.enum(['timestamp', 'value']).optional(),
		order: z.enum(['asc', 'desc']).optional(),
		include: z.string().optional(),
	})
	.strict();

export const WalletLabelsBatchInput = z
	.object({
		addresses: z.string(),
	})
	.strict();

export const WalletNetWorthInput = z
	.object({
		address: z.string(),
	})
	.strict();

export const WalletProtocolsInput = z
	.object({
		address: z.string(),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();

export const WalletTransfersInput = z
	.object({
		address: z.string(),
		chain: z
			.enum(['ethereum', 'base', 'solana', 'tron', 'bsc', 'arbitrum'])
			.optional(),
		flow: z.enum(['in', 'out']).optional(),
		token: z.string().optional(),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
		include: z.string().optional(),
	})
	.strict();

export const WebFetchInput = z
	.object({
		url: z.string(),
		target_selector: z.string().optional(),
		remove_selector: z.string().optional(),
		wait_for_selector: z.string().optional(),
		timeout: z.number().int().min(1000).max(60000).optional(),
	})
	.strict();

export const XTweetsInput = z
	.object({
		ids: z.string().min(1).max(1999),
	})
	.strict();

export const SurfEndpointInputSchemas = {
	dexTokenPrice: DexTokenPriceInput,
	equityBalanceSheet: EquityBalanceSheetInput,
	equityCandles: EquityCandlesInput,
	equityCashFlow: EquityCashFlowInput,
	equityEtfHoldings: EquityEtfHoldingsInput,
	equityFilings: EquityFilingsInput,
	equityIncomeStatement: EquityIncomeStatementInput,
	equityLatestFilings: EquityLatestFilingsInput,
	equityLatestFinancials: EquityLatestFinancialsInput,
	equityListings: EquityListingsInput,
	equityMeta: EquityMetaInput,
	equityMetrics: EquityMetricsInput,
	equityOverview: EquityOverviewInput,
	equityProfile: EquityProfileInput,
	equitySegments: EquitySegmentsInput,
	exchangeCandles: ExchangeCandlesInput,
	exchangeCoverage: ExchangeCoverageInput,
	exchangeDepth: ExchangeDepthInput,
	exchangeFundingHistory: ExchangeFundingHistoryInput,
	exchangeKlines: ExchangeKlinesInput,
	exchangeLongShortRatio: ExchangeLongShortRatioInput,
	exchangeMarkets: ExchangeMarketsInput,
	exchangePerp: ExchangePerpInput,
	exchangePrice: ExchangePriceInput,
	fundDetail: FundDetailInput,
	fundPortfolio: FundPortfolioInput,
	fundRanking: FundRankingInput,
	heatscoreDetail: HeatscoreDetailInput,
	heatscoreProjects: HeatscoreProjectsInput,
	heatscoreTokenOfTheDay: HeatscoreTokenOfTheDayInput,
	heatscoreTokenOfWeek: HeatscoreTokenOfWeekInput,
	hyperliquidAccount: HyperliquidAccountInput,
	hyperliquidCandles: HyperliquidCandlesInput,
	hyperliquidFills: HyperliquidFillsInput,
	hyperliquidLeaderboard: HyperliquidLeaderboardInput,
	hyperliquidOrders: HyperliquidOrdersInput,
	hyperliquidPerformance: HyperliquidPerformanceInput,
	hyperliquidPositions: HyperliquidPositionsInput,
	hyperliquidTrades: HyperliquidTradesInput,
	hyperliquidTradesAggregate: HyperliquidTradesAggregateInput,
	hyperliquidTradesContext: HyperliquidTradesContextInput,
	marketEtf: MarketEtfInput,
	marketExchangeFlowExchanges: MarketExchangeFlowExchangesInput,
	marketFearGreed: MarketFearGreedInput,
	marketFutures: MarketFuturesInput,
	marketLiquidationChart: MarketLiquidationChartInput,
	marketLiquidationExchangeList: MarketLiquidationExchangeListInput,
	marketLiquidationOrder: MarketLiquidationOrderInput,
	marketListing: MarketListingInput,
	marketOnchainIndicator: MarketOnchainIndicatorInput,
	marketOptions: MarketOptionsInput,
	marketPrice: MarketPriceInput,
	marketPriceIndicator: MarketPriceIndicatorInput,
	marketPublicSale: MarketPublicSaleInput,
	marketRanking: MarketRankingInput,
	marketTge: MarketTgeInput,
	newsDetail: NewsDetailInput,
	newsFeed: NewsFeedInput,
	onchainBridgeRanking: OnchainBridgeRankingInput,
	onchainDexActivity: OnchainDexActivityInput,
	onchainGasPrice: OnchainGasPriceInput,
	onchainQuery: OnchainQueryInput,
	onchainSchema: OnchainSchemaInput,
	onchainSql: OnchainSqlInput,
	onchainSqlJobs: OnchainSqlJobsInput,
	onchainSqlJobsJobId: OnchainSqlJobsJobIdInput,
	getOnchainSqlJobsJobId: GetOnchainSqlJobsJobIdInput,
	onchainSqlJobsJobIdResults: OnchainSqlJobsJobIdResultsInput,
	onchainSqlPreflight: OnchainSqlPreflightInput,
	onchainTx: OnchainTxInput,
	onchainYieldRanking: OnchainYieldRankingInput,
	portfolioWallets: PortfolioWalletsInput,
	predictionMarketAnalytics: PredictionMarketAnalyticsInput,
	predictionMarketCorrelations: PredictionMarketCorrelationsInput,
	predictionMarketKalshiEvents: PredictionMarketKalshiEventsInput,
	predictionMarketKalshiMarkets: PredictionMarketKalshiMarketsInput,
	predictionMarketKalshiOpenInterest: PredictionMarketKalshiOpenInterestInput,
	predictionMarketKalshiOrderbooks: PredictionMarketKalshiOrderbooksInput,
	predictionMarketKalshiPrices: PredictionMarketKalshiPricesInput,
	predictionMarketKalshiTrades: PredictionMarketKalshiTradesInput,
	predictionMarketKalshiVolumes: PredictionMarketKalshiVolumesInput,
	predictionMarketMatchingDaily: PredictionMarketMatchingDailyInput,
	predictionMarketMatchingPairs: PredictionMarketMatchingPairsInput,
	predictionMarketPolymarketEvents: PredictionMarketPolymarketEventsInput,
	predictionMarketPolymarketLeaderboard:
		PredictionMarketPolymarketLeaderboardInput,
	predictionMarketPolymarketMarkets: PredictionMarketPolymarketMarketsInput,
	predictionMarketPolymarketOpenInterest:
		PredictionMarketPolymarketOpenInterestInput,
	predictionMarketPolymarketOrderbooks:
		PredictionMarketPolymarketOrderbooksInput,
	predictionMarketPolymarketPositions: PredictionMarketPolymarketPositionsInput,
	predictionMarketPolymarketPriceOhlcvConditionId:
		PredictionMarketPolymarketPriceOhlcvConditionIdInput,
	predictionMarketPolymarketPrices: PredictionMarketPolymarketPricesInput,
	predictionMarketPolymarketSmartMoney:
		PredictionMarketPolymarketSmartMoneyInput,
	predictionMarketPolymarketTrades: PredictionMarketPolymarketTradesInput,
	predictionMarketPolymarketVolumeSplitConditionId:
		PredictionMarketPolymarketVolumeSplitConditionIdInput,
	predictionMarketPolymarketVolumes: PredictionMarketPolymarketVolumesInput,
	projectAiNews: ProjectAiNewsInput,
	projectDefiMetrics: ProjectDefiMetricsInput,
	projectDefiRanking: ProjectDefiRankingInput,
	projectDetail: ProjectDetailInput,
	searchAirdrop: SearchAirdropInput,
	searchAirdropActivities: SearchAirdropActivitiesInput,
	searchEvents: SearchEventsInput,
	searchFund: SearchFundInput,
	searchFundraising: SearchFundraisingInput,
	searchNews: SearchNewsInput,
	searchPredictionMarket: SearchPredictionMarketInput,
	searchProject: SearchProjectInput,
	searchToken: SearchTokenInput,
	searchWallet: SearchWalletInput,
	searchWeb: SearchWebInput,
	tokenDexTrades: TokenDexTradesInput,
	tokenHolders: TokenHoldersInput,
	tokenTokenomics: TokenTokenomicsInput,
	tokenTransferCounterparties: TokenTransferCounterpartiesInput,
	tokenTransferStats: TokenTransferStatsInput,
	tokenTransfers: TokenTransfersInput,
	walletDetail: WalletDetailInput,
	walletHistory: WalletHistoryInput,
	walletLabelsBatch: WalletLabelsBatchInput,
	walletNetWorth: WalletNetWorthInput,
	walletProtocols: WalletProtocolsInput,
	walletTransfers: WalletTransfersInput,
	webFetch: WebFetchInput,
	xTweets: XTweetsInput,
} as const;

export const SurfEndpointOutputSchemas = {
	dexTokenPrice: SurfResponse,
	equityBalanceSheet: SurfResponse,
	equityCandles: SurfResponse,
	equityCashFlow: SurfResponse,
	equityEtfHoldings: SurfResponse,
	equityFilings: SurfResponse,
	equityIncomeStatement: SurfResponse,
	equityLatestFilings: SurfResponse,
	equityLatestFinancials: SurfResponse,
	equityListings: SurfResponse,
	equityMeta: SurfResponse,
	equityMetrics: SurfResponse,
	equityOverview: SurfResponse,
	equityProfile: SurfResponse,
	equitySegments: SurfResponse,
	exchangeCandles: SurfResponse,
	exchangeCoverage: SurfResponse,
	exchangeDepth: SurfResponse,
	exchangeFundingHistory: SurfResponse,
	exchangeKlines: SurfResponse,
	exchangeLongShortRatio: SurfResponse,
	exchangeMarkets: SurfResponse,
	exchangePerp: SurfResponse,
	exchangePrice: SurfResponse,
	fundDetail: SurfResponse,
	fundPortfolio: SurfResponse,
	fundRanking: SurfResponse,
	heatscoreDetail: SurfResponse,
	heatscoreProjects: SurfResponse,
	heatscoreTokenOfTheDay: SurfResponse,
	heatscoreTokenOfWeek: SurfResponse,
	hyperliquidAccount: SurfResponse,
	hyperliquidCandles: SurfResponse,
	hyperliquidFills: SurfResponse,
	hyperliquidLeaderboard: SurfResponse,
	hyperliquidOrders: SurfResponse,
	hyperliquidPerformance: SurfResponse,
	hyperliquidPositions: SurfResponse,
	hyperliquidTrades: SurfResponse,
	hyperliquidTradesAggregate: SurfResponse,
	hyperliquidTradesContext: SurfResponse,
	marketEtf: SurfResponse,
	marketExchangeFlowExchanges: SurfResponse,
	marketFearGreed: SurfResponse,
	marketFutures: SurfResponse,
	marketLiquidationChart: SurfResponse,
	marketLiquidationExchangeList: SurfResponse,
	marketLiquidationOrder: SurfResponse,
	marketListing: SurfResponse,
	marketOnchainIndicator: SurfResponse,
	marketOptions: SurfResponse,
	marketPrice: SurfResponse,
	marketPriceIndicator: SurfResponse,
	marketPublicSale: SurfResponse,
	marketRanking: SurfResponse,
	marketTge: SurfResponse,
	newsDetail: SurfResponse,
	newsFeed: SurfResponse,
	onchainBridgeRanking: SurfResponse,
	onchainDexActivity: SurfResponse,
	onchainGasPrice: SurfResponse,
	onchainQuery: SurfResponse,
	onchainSchema: SurfResponse,
	onchainSql: SurfResponse,
	onchainSqlJobs: SurfResponse,
	onchainSqlJobsJobId: SurfResponse,
	getOnchainSqlJobsJobId: SurfResponse,
	onchainSqlJobsJobIdResults: SurfResponse,
	onchainSqlPreflight: SurfResponse,
	onchainTx: SurfResponse,
	onchainYieldRanking: SurfResponse,
	portfolioWallets: SurfResponse,
	predictionMarketAnalytics: SurfResponse,
	predictionMarketCorrelations: SurfResponse,
	predictionMarketKalshiEvents: SurfResponse,
	predictionMarketKalshiMarkets: SurfResponse,
	predictionMarketKalshiOpenInterest: SurfResponse,
	predictionMarketKalshiOrderbooks: SurfResponse,
	predictionMarketKalshiPrices: SurfResponse,
	predictionMarketKalshiTrades: SurfResponse,
	predictionMarketKalshiVolumes: SurfResponse,
	predictionMarketMatchingDaily: SurfResponse,
	predictionMarketMatchingPairs: SurfResponse,
	predictionMarketPolymarketEvents: SurfResponse,
	predictionMarketPolymarketLeaderboard: SurfResponse,
	predictionMarketPolymarketMarkets: SurfResponse,
	predictionMarketPolymarketOpenInterest: SurfResponse,
	predictionMarketPolymarketOrderbooks: SurfResponse,
	predictionMarketPolymarketPositions: SurfResponse,
	predictionMarketPolymarketPriceOhlcvConditionId: SurfResponse,
	predictionMarketPolymarketPrices: SurfResponse,
	predictionMarketPolymarketSmartMoney: SurfResponse,
	predictionMarketPolymarketTrades: SurfResponse,
	predictionMarketPolymarketVolumeSplitConditionId: SurfResponse,
	predictionMarketPolymarketVolumes: SurfResponse,
	projectAiNews: SurfResponse,
	projectDefiMetrics: SurfResponse,
	projectDefiRanking: SurfResponse,
	projectDetail: SurfResponse,
	searchAirdrop: SurfResponse,
	searchAirdropActivities: SurfResponse,
	searchEvents: SurfResponse,
	searchFund: SurfResponse,
	searchFundraising: SurfResponse,
	searchNews: SurfResponse,
	searchPredictionMarket: SurfResponse,
	searchProject: SurfResponse,
	searchToken: SurfResponse,
	searchWallet: SurfResponse,
	searchWeb: SurfResponse,
	tokenDexTrades: SurfResponse,
	tokenHolders: SurfResponse,
	tokenTokenomics: SurfResponse,
	tokenTransferCounterparties: SurfResponse,
	tokenTransferStats: SurfResponse,
	tokenTransfers: SurfResponse,
	walletDetail: SurfResponse,
	walletHistory: SurfResponse,
	walletLabelsBatch: SurfResponse,
	walletNetWorth: SurfResponse,
	walletProtocols: SurfResponse,
	walletTransfers: SurfResponse,
	webFetch: SurfResponse,
	xTweets: SurfResponse,
} as const;

export type SurfEndpointInputs = {
	[K in keyof typeof SurfEndpointInputSchemas]: z.input<
		(typeof SurfEndpointInputSchemas)[K]
	>;
};
export type SurfEndpointOutputs = {
	[K in keyof typeof SurfEndpointOutputSchemas]: z.infer<
		(typeof SurfEndpointOutputSchemas)[K]
	>;
};
