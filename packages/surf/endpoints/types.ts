import { z } from 'zod';

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

export const DexTokenPriceOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				close: z.number(),
				high: z.number(),
				low: z.number(),
				open: z.number(),
				timestamp: z.number().int(),
				volume_usd: z.number(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
	}),
});

export const EquityBalanceSheetOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				accumulated_oci: z.looseObject({}),
				calculated_at: z.number().int().optional(),
				cash_and_equivalents: z.looseObject({}),
				currency: z.string(),
				current_assets: z.looseObject({}),
				current_debt: z.looseObject({}),
				current_investments: z.looseObject({}),
				current_liabilities: z.looseObject({}),
				deferred_revenue: z.looseObject({}),
				deposit_liabilities: z.looseObject({}),
				duration_days: z.number().int().optional(),
				duration_months: z.number().int().optional(),
				fiscal_period: z.string().nullable(),
				fiscal_quarter: z.number().int().optional(),
				fiscal_year: z.number().int().optional(),
				formula_version: z.string().optional(),
				goodwill_and_intangible_assets: z.looseObject({}),
				inventory: z.looseObject({}),
				liabilities_and_equity: z.looseObject({}),
				net_debt: z.looseObject({}),
				non_current_assets: z.looseObject({}),
				non_current_debt: z.looseObject({}),
				non_current_investments: z.looseObject({}),
				non_current_liabilities: z.looseObject({}),
				other_current_liabilities: z.looseObject({}),
				other_non_current_assets: z.looseObject({}),
				other_non_current_liabilities: z.looseObject({}),
				outstanding_shares: z.looseObject({}),
				payables: z.looseObject({}),
				period: z.enum(['quarterly', 'ytd', 'annual', 'ttm']),
				period_start: z.string().optional(),
				property_plant_and_equipment: z.looseObject({}),
				receivables: z.looseObject({}),
				report_period: z.string(),
				retained_earnings: z.looseObject({}),
				shareholders_equity: z.looseObject({}),
				source_updated_at: z.number().int().optional(),
				symbol: z.string(),
				tax_assets: z.looseObject({}),
				tax_liabilities: z.looseObject({}),
				total_assets: z.looseObject({}),
				total_debt: z.looseObject({}),
				total_liabilities: z.looseObject({}),
				working_capital: z.looseObject({}),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const EquityCandlesOutput = z.looseObject({
	data: z.looseObject({
		candles: z.array(z.looseObject({})).nullable(),
		end_date: z.string().optional(),
		interval: z.string(),
		interval_multiplier: z.number().int(),
		latest_price: z.looseObject({
			day_change: z.number().optional(),
			day_change_percent: z.number().optional(),
			price: z.number(),
			timestamp: z.number().int(),
		}),
		latest_price_available: z.boolean(),
		start_date: z.string().optional(),
		symbol: z.string(),
	}),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
	}),
});

export const EquityCashFlowOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				beginning_cash: z.looseObject({}),
				business_acquisitions_and_disposals: z.looseObject({}),
				calculated_at: z.number().int().optional(),
				capital_expenditure: z.looseObject({}),
				change_in_cash: z.looseObject({}),
				currency: z.string(),
				debt_issuance_repayment: z.looseObject({}),
				depreciation_and_amortization: z.looseObject({}),
				dividends_and_distributions: z.looseObject({}),
				duration_days: z.number().int().optional(),
				duration_months: z.number().int().optional(),
				ending_cash: z.looseObject({}),
				equity_issuance_purchase: z.looseObject({}),
				financing_cash_flow: z.looseObject({}),
				fiscal_period: z.string().nullable(),
				fiscal_quarter: z.number().int().optional(),
				fiscal_year: z.number().int().optional(),
				formula_version: z.string().optional(),
				free_cash_flow: z.looseObject({}),
				fx_effect: z.looseObject({}),
				investing_cash_flow: z.looseObject({}),
				investment_acquisitions_and_disposals: z.looseObject({}),
				net_income: z.looseObject({}),
				operating_cash_flow: z.looseObject({}),
				period: z.enum(['quarterly', 'ytd', 'annual', 'ttm']),
				period_start: z.string().optional(),
				report_period: z.string(),
				share_based_compensation: z.looseObject({}),
				source_updated_at: z.number().int().optional(),
				symbol: z.string(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const EquityEtfHoldingsOutput = z.looseObject({
	data: z.looseObject({
		available_periods: z.array(z.looseObject({})).nullable(),
		snapshots: z.array(z.looseObject({})).nullable(),
		symbol: z.string(),
	}),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
	}),
});

export const EquityFilingsOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				accepted_at: z.number().int().optional(),
				accession: z.string(),
				filed_on: z.string(),
				financial_metric_count: z.number().int(),
				form_type: z.string(),
				normalized_statement_field_count: z.number().int(),
				report_periods: z.array(z.string()).nullable(),
				sec_url: z.string(),
				source_observed_at: z.number().int().optional(),
				source_revision_ids: z.array(z.string()).nullable(),
				source_statement_ids: z.array(z.string()).nullable(),
				statement_types: z.array(z.string()).nullable(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const EquityIncomeStatementOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				calculated_at: z.number().int().optional(),
				cost_of_revenue: z.looseObject({}),
				currency: z.string(),
				dividends_per_common_share: z.looseObject({}),
				duration_days: z.number().int().optional(),
				duration_months: z.number().int().optional(),
				ebit: z.looseObject({}),
				ebitda: z.looseObject({}),
				eps_basic: z.looseObject({}),
				eps_calculation_method: z.string().optional(),
				eps_diluted: z.looseObject({}),
				fiscal_period: z.string().nullable(),
				fiscal_quarter: z.number().int().optional(),
				fiscal_year: z.number().int().optional(),
				formula_version: z.string().optional(),
				gross_profit: z.looseObject({}),
				income_tax_expense: z.looseObject({}),
				interest_expense: z.looseObject({}),
				net_income: z.looseObject({}),
				net_income_common_stock: z.looseObject({}),
				net_income_discontinued_operations: z.looseObject({}),
				net_income_non_controlling_interests: z.looseObject({}),
				net_income_yoy: z.looseObject({}),
				operating_expense: z.looseObject({}),
				operating_income: z.looseObject({}),
				operating_income_yoy: z.looseObject({}),
				period: z.enum(['quarterly', 'ytd', 'annual', 'ttm']),
				period_start: z.string().optional(),
				report_period: z.string(),
				research_and_development: z.looseObject({}),
				revenue: z.looseObject({}),
				revenue_yoy: z.looseObject({}),
				sga_expense: z.looseObject({}),
				source_updated_at: z.number().int().optional(),
				symbol: z.string(),
				total_operating_costs: z.looseObject({}),
				weighted_average_shares: z.looseObject({}),
				weighted_average_shares_diluted: z.looseObject({}),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const EquityLatestFilingsOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				accepted_at: z.number().int().optional(),
				company_name: z.string(),
				coverage_fields: z.number().int(),
				filed_on: z.string(),
				financial_metric_count: z.number().int(),
				form_type: z.string(),
				logo_url: z.string(),
				report_period: z.string(),
				sec_url: z.string(),
				symbol: z.string(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const EquityLatestFinancialsOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				company_name: z.string(),
				duration_days: z.number().int().optional(),
				duration_months: z.number().int().optional(),
				filed_on: z.string(),
				free_cash_flow: z.looseObject({}),
				gross_margin: z.looseObject({}),
				logo_url: z.string(),
				operating_margin: z.looseObject({}),
				pe_ttm: z.looseObject({}),
				period_start: z.string().optional(),
				report_period: z.string(),
				return_on_equity: z.looseObject({}),
				revenue_growth: z.looseObject({}),
				source_updated_at: z.number().int().optional(),
				symbol: z.string(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const EquityListingsOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				financial_serving_reason: z
					.enum([
						'reporting_series_missing',
						'publication_missing',
						'publication_terminal_excluded',
					])
					.optional(),
				financial_serving_status: z.string(),
				is_current: z.boolean(),
				is_primary: z.boolean(),
				issuer_cik: z.string(),
				issuer_company_id: z.string(),
				issuer_legal_name: z.string(),
				listing_currency: z.string().optional(),
				listing_exchange_code: z.string().optional(),
				listing_id: z.string(),
				listing_lifecycle_status: z.string(),
				listing_symbol_id: z.string(),
				reporting_series_display_name: z.string().optional(),
				reporting_series_id: z.string().optional(),
				security_id: z.string(),
				security_name: z.string().optional(),
				security_type: z.string(),
				share_class: z.string().optional(),
				stock_type: z.string(),
				symbol_exchange_code: z.string().optional(),
				symbol_identity_status: z.string(),
				ticker: z.string(),
				valid_from: z.string().optional(),
				valid_to: z.string().optional(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const EquityMetaOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				currency: z.string(),
				day_change: z.number().optional(),
				day_change_percent: z.number().optional(),
				logo_url: z.string(),
				name: z.string(),
				price: z.number(),
				price_timestamp: z.number().int(),
				symbol: z.string(),
				tokenized: z.array(z.looseObject({})).nullable().optional(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
	}),
});

export const EquityMetricsOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				asset_turnover: z.looseObject({}),
				book_value_growth: z.looseObject({}),
				book_value_per_share: z.looseObject({}),
				calculated_at: z.number().int().optional(),
				cash_ratio: z.looseObject({}),
				change_in_cash_per_share: z.looseObject({}),
				currency: z.string(),
				current_ratio: z.looseObject({}),
				days_sales_outstanding: z.looseObject({}),
				debt_to_assets: z.looseObject({}),
				debt_to_equity: z.looseObject({}),
				duration_days: z.number().int().optional(),
				duration_months: z.number().int().optional(),
				earnings_growth: z.looseObject({}),
				earnings_per_share: z.looseObject({}),
				earnings_per_share_growth: z.looseObject({}),
				ebit_margin: z.looseObject({}),
				ebitda: z.looseObject({}),
				ebitda_growth: z.looseObject({}),
				ebitda_margin: z.looseObject({}),
				enterprise_value: z.looseObject({}),
				enterprise_value_to_ebitda_ratio: z.looseObject({}),
				enterprise_value_to_revenue_ratio: z.looseObject({}),
				fiscal_period: z.string().nullable(),
				fiscal_quarter: z.number().int().optional(),
				fiscal_year: z.number().int().optional(),
				free_cash_flow_growth: z.looseObject({}),
				free_cash_flow_margin: z.looseObject({}),
				free_cash_flow_per_share: z.looseObject({}),
				free_cash_flow_yield: z.looseObject({}),
				gross_margin: z.looseObject({}),
				interest_coverage: z.looseObject({}),
				inventory_turnover: z.looseObject({}),
				liabilities_to_assets: z.looseObject({}),
				market_cap: z.looseObject({}),
				net_debt: z.looseObject({}),
				net_margin: z.looseObject({}),
				operating_cash_flow_per_share: z.looseObject({}),
				operating_cash_flow_ratio: z.looseObject({}),
				operating_cycle: z.looseObject({}),
				operating_income_growth: z.looseObject({}),
				operating_margin: z.looseObject({}),
				payout_ratio: z.looseObject({}),
				peg_ratio: z.looseObject({}),
				period: z.enum(['quarterly', 'annual', 'ttm']),
				period_start: z.string().optional(),
				price_to_book_ratio: z.looseObject({}),
				price_to_earnings_ratio: z.looseObject({}),
				price_to_sales_ratio: z.looseObject({}),
				quick_ratio: z.looseObject({}),
				receivables_turnover: z.looseObject({}),
				report_period: z.string(),
				return_on_assets: z.looseObject({}),
				return_on_equity: z.looseObject({}),
				return_on_invested_capital: z.looseObject({}),
				revenue_growth: z.looseObject({}),
				source_updated_at: z.number().int().optional(),
				symbol: z.string(),
				working_capital_turnover: z.looseObject({}),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const EquityOverviewOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				calculated_at: z.number().int().optional(),
				cash_and_equivalents: z.looseObject({}),
				company_name: z.string(),
				currency: z.string(),
				current_ratio: z.looseObject({}),
				debt_to_equity: z.looseObject({}),
				duration_days: z.number().int().optional(),
				duration_months: z.number().int().optional(),
				ebit: z.looseObject({}),
				ebit_margin: z.looseObject({}),
				ebitda: z.looseObject({}),
				ebitda_margin: z.looseObject({}),
				eps_basic: z.looseObject({}),
				eps_diluted: z.looseObject({}),
				exchange: z.string(),
				fiscal_period: z.string().nullable(),
				fiscal_quarter: z.number().int().optional(),
				fiscal_year: z.number().int().optional(),
				formula_version: z.string().optional(),
				free_cash_flow: z.looseObject({}),
				gross_margin: z.looseObject({}),
				gross_profit: z.looseObject({}),
				industry: z.string().optional(),
				liabilities_to_assets: z.looseObject({}),
				net_debt: z.looseObject({}),
				net_income: z.looseObject({}),
				net_margin: z.looseObject({}),
				operating_cash_flow: z.looseObject({}),
				operating_income: z.looseObject({}),
				operating_margin: z.looseObject({}),
				pb_mrq: z.looseObject({}),
				pe_lyr: z.looseObject({}),
				pe_ttm: z.looseObject({}),
				period: z.enum(['quarterly', 'ytd', 'annual', 'ttm']),
				period_start: z.string().optional(),
				ps_ttm: z.looseObject({}),
				report_period: z.string(),
				return_on_assets: z.looseObject({}),
				return_on_equity: z.looseObject({}),
				return_on_invested_capital: z.looseObject({}),
				revenue: z.looseObject({}),
				revenue_yoy: z.looseObject({}),
				sector: z.string().optional(),
				shareholders_equity: z.looseObject({}),
				source_updated_at: z.number().int().optional(),
				symbol: z.string(),
				total_assets: z.looseObject({}),
				total_debt: z.looseObject({}),
				total_liabilities: z.looseObject({}),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const EquityProfileOutput = z.looseObject({
	data: z.looseObject({
		cik: z.string().optional(),
		company_name: z.string(),
		description: z.string().optional(),
		employee_count: z.number().int().optional(),
		exchange: z.string(),
		industry: z.string().optional(),
		is_active: z.boolean(),
		listing_date: z.string().optional(),
		location: z.string().optional(),
		sec_filings_url: z.string().optional(),
		sector: z.string().optional(),
		sic_code: z.string().optional(),
		sic_industry: z.string().optional(),
		sic_sector: z.string().optional(),
		source_updated_at: z.number().int().optional(),
		symbol: z.string(),
		website_url: z.string().optional(),
	}),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
	}),
});

export const EquitySegmentsOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				calculated_at: z.number().int().optional(),
				currency: z.string().optional(),
				dimension_type: z.enum(['product', 'segment']),
				fiscal_quarter: z.number().int().optional(),
				fiscal_year: z.number().int().optional(),
				label: z.string(),
				label_key: z.string(),
				materialized_at: z.number().int().optional(),
				metric_code: z.string(),
				period: z.enum(['quarterly', 'annual']),
				presentation_period: z.enum(['single_quarter', 'annual']),
				reason_code: z.string().optional(),
				report_period: z.string(),
				source_accessions: z.array(z.string()).nullable().optional(),
				source_observed_at: z.number().int().optional(),
				source_provider_tickers: z.array(z.string()).nullable().optional(),
				statement_type: z.enum(['income', 'balance_sheet', 'cash_flow']),
				status: z.enum(['reported', 'source_null', 'source_missing']),
				symbol: z.string(),
				unit: z.string().optional(),
				value: z.number().nullable(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const ExchangeCandlesOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				close: z.number(),
				close_time: z.number().int(),
				exchange: z.string(),
				high: z.number(),
				interval: z.string(),
				is_synthetic: z.boolean(),
				low: z.number(),
				open: z.number(),
				pair: z.string(),
				region: z.string(),
				timestamp: z.number().int(),
				trade_count: z.number().int().optional(),
				volume_base: z.number().optional(),
				volume_quote: z.number().optional(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const ExchangeCoverageOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				active: z.boolean(),
				base: z.string(),
				change_24h_abs: z.number().optional(),
				change_24h_pct: z.number().optional(),
				data_actionability: z.string().optional(),
				data_status: z.string().optional(),
				exchange: z.string(),
				high_24h: z.number().optional(),
				latest_4h_candle_at: z.number().int().optional(),
				latest_5m_candle_at: z.number().int().optional(),
				latest_candle_at: z.number().int().optional(),
				latest_price: z.number().optional(),
				latest_ticker_at: z.number().int().optional(),
				latest_weekly_candle_at: z.number().int().optional(),
				listing_date: z.number().int().optional(),
				low_24h: z.number().optional(),
				open_24h: z.number().optional(),
				pair: z.string(),
				prev_close: z.number().optional(),
				quote: z.string(),
				region: z.string(),
				status: z.string(),
				technical_score: z.number().optional(),
				technical_score_at: z.number().int().optional(),
				technical_score_label: z.string().optional(),
				type: z.string(),
				volume_24h_base: z.number().optional(),
				volume_24h_quote: z.number().optional(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const ExchangeDepthOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				ask_depth: z.number().nullable(),
				asks: z.array(z.looseObject({})).nullable(),
				bid_depth: z.number().nullable(),
				bids: z.array(z.looseObject({})).nullable(),
				exchange: z.string(),
				mid_price: z.number().nullable(),
				pair: z.string(),
				spread: z.number().nullable(),
				spread_pct: z.number().nullable(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
	}),
});

export const ExchangeFundingHistoryOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				exchange: z.string(),
				funding_interval_hours: z.number().int().nullable(),
				funding_rate: z.number().nullable(),
				funding_rate_1h: z.number().optional(),
				funding_rate_8h: z.number().optional(),
				funding_rate_annualized: z.number().optional(),
				funding_rate_raw: z.number().optional(),
				pair: z.string(),
				timestamp: z.number().int().nullable(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
	}),
});

export const ExchangeKlinesOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				candles: z.array(z.looseObject({})).nullable(),
				count: z.number().int(),
				exchange: z.string(),
				interval: z.string(),
				pair: z.string(),
				period_end: z.string().nullable(),
				period_high: z.number().nullable(),
				period_low: z.number().nullable(),
				period_start: z.string().nullable(),
				period_volume: z.number().nullable(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
	}),
});

export const ExchangeLongShortRatioOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				exchange: z.string(),
				long_short_ratio: z.number().nullable(),
				pair: z.string(),
				timestamp: z.number().int().nullable(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
	}),
});

export const ExchangeMarketsOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				active: z.boolean().nullable(),
				base: z.string().nullable(),
				exchange: z.string(),
				maker_fee: z.number().nullable(),
				pair: z.string(),
				quote: z.string().nullable(),
				taker_fee: z.number().nullable(),
				type: z.string().nullable(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
	}),
});

export const ExchangePerpOutput = z.looseObject({
	data: z.looseObject({
		exchange: z.string(),
		funding: z.looseObject({
			exchange: z.string(),
			funding_interval_hours: z.number().int().nullable(),
			funding_rate: z.number().nullable(),
			funding_rate_1h: z.number().optional(),
			funding_rate_8h: z.number().optional(),
			funding_rate_annualized: z.number().optional(),
			funding_rate_raw: z.number().optional(),
			index_price: z.number().nullable(),
			interval: z.string().nullable(),
			mark_price: z.number().nullable(),
			next_funding: z.string().nullable(),
			pair: z.string(),
		}),
		open_interest: z.looseObject({
			exchange: z.string(),
			open_interest_amount: z.number().nullable(),
			open_interest_usd: z.number().nullable(),
			pair: z.string(),
			timestamp: z.number().int().nullable(),
		}),
		pair: z.string(),
	}),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
	}),
});

export const ExchangePriceOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				ask: z.number().nullable(),
				bid: z.number().nullable(),
				change_24h_pct: z.number().nullable(),
				exchange: z.string(),
				high_24h: z.number().nullable(),
				last: z.number().nullable(),
				low_24h: z.number().nullable(),
				pair: z.string(),
				timestamp: z.number().int().nullable(),
				volume_24h_base: z.number().nullable(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
	}),
});

export const FundDetailOutput = z.looseObject({
	data: z.looseObject({
		description: z.string().optional(),
		id: z.string(),
		image: z.string().optional(),
		invested_projects_count: z.number().int(),
		jurisdiction: z.string().optional(),
		links: z.array(z.looseObject({})).nullable(),
		members: z.array(z.looseObject({})).nullable(),
		name: z.string(),
		recent_researches: z.array(z.looseObject({})).nullable(),
		tier: z.number().int(),
		type: z.string().optional(),
		x_accounts: z.array(z.looseObject({})).nullable(),
	}),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
	}),
});

export const FundPortfolioOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				invested_at: z.number().int().optional(),
				is_lead: z.boolean(),
				project_id: z.string(),
				project_logo: z.string().optional(),
				project_name: z.string(),
				project_slug: z.string().optional(),
				recent_raise: z.number().optional(),
				total_raise: z.number().optional(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const FundRankingOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				id: z.string(),
				image: z.string().optional(),
				invested_projects_count: z.number().int(),
				name: z.string(),
				tier: z.number().int(),
				top_projects: z.array(z.looseObject({})).nullable(),
				type: z.string().optional(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const HeatscoreDetailOutput = z.looseObject({
	data: z.looseObject({
		ai_summary: z.looseObject({}).optional(),
		baseline: z.number().optional(),
		change_percent: z.number().optional(),
		change_vs_previous_percent: z.number().optional(),
		computed_hour: z.number().int().optional(),
		core_state: z.looseObject({
			driver: z.string().optional(),
			priority: z.number().int().optional(),
			reason: z.string().optional(),
			state: z.string().optional(),
			state_type: z.string().optional(),
			strength: z.string().optional(),
		}),
		driver: z.string().optional(),
		evidence_score: z.number().optional(),
		heat_dimensions: z.looseObject({
			derivative: z.number().optional(),
			derivative_components: z.array(z.looseObject({})).nullable().optional(),
			flow: z.number().optional(),
			movement: z.number().optional(),
			social: z.number().optional(),
		}),
		heat_score: z.number().optional(),
		heat_score_by_range: z.looseObject({}).optional(),
		heat_score_change_vs_previous_percent_by_range: z
			.looseObject({})
			.optional(),
		heat_score_previous_by_range: z.looseObject({}).optional(),
		liquidation_long_24h: z.number().optional(),
		liquidation_long_short_ratio_24h: z.number().optional(),
		liquidation_short_24h: z.number().optional(),
		logo: z.string().optional(),
		market_relevance: z.number().optional(),
		metric: z.string().optional(),
		name: z.string().optional(),
		open_interest: z.number().optional(),
		points_used: z.number().int().optional(),
		previous_value: z.number().optional(),
		price: z.number().optional(),
		price_change_percent: z.looseObject({
			'1h': z.number().optional(),
			'24h': z.number().optional(),
			'7d': z.number().optional(),
		}),
		project_id: z.string().optional(),
		project_slug: z.string().optional(),
		rank: z.number().int().optional(),
		score: z.number().optional(),
		signed_z: z.number().optional(),
		symbol: z.string().optional(),
		time_range: z.string().optional(),
		token_id: z.string().optional(),
		token_signals: z.looseObject({}).optional(),
		updated_at: z.number().int().optional(),
		value: z.number().optional(),
		volume_24h: z.number().optional(),
		volume_24h_change_percent: z.number().optional(),
	}),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
	}),
});

export const HeatscoreProjectsOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				ai_summary: z.looseObject({}).optional(),
				baseline: z.number().optional(),
				change_percent: z.number().optional(),
				change_vs_previous_percent: z.number().optional(),
				computed_hour: z.number().int().optional(),
				core_state: z.looseObject({}),
				driver: z.string().optional(),
				evidence_score: z.number().optional(),
				heat_dimensions: z.looseObject({}),
				heat_score: z.number().optional(),
				heat_score_by_range: z.looseObject({}).optional(),
				heat_score_change_vs_previous_percent_by_range: z
					.looseObject({})
					.optional(),
				heat_score_previous_by_range: z.looseObject({}).optional(),
				liquidation_long_24h: z.number().optional(),
				liquidation_long_short_ratio_24h: z.number().optional(),
				liquidation_short_24h: z.number().optional(),
				logo: z.string().optional(),
				market_relevance: z.number().optional(),
				metric: z.string().optional(),
				name: z.string().optional(),
				open_interest: z.number().optional(),
				points_used: z.number().int().optional(),
				previous_value: z.number().optional(),
				price: z.number().optional(),
				price_change_percent: z.looseObject({}),
				project_id: z.string().optional(),
				project_slug: z.string().optional(),
				rank: z.number().int().optional(),
				score: z.number().optional(),
				signed_z: z.number().optional(),
				symbol: z.string().optional(),
				time_range: z.string().optional(),
				token_id: z.string().optional(),
				token_signals: z.looseObject({}).optional(),
				updated_at: z.number().int().optional(),
				value: z.number().optional(),
				volume_24h: z.number().optional(),
				volume_24h_change_percent: z.number().optional(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const HeatscoreTokenOfTheDayOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				ai_summary: z.looseObject({}).optional(),
				baseline: z.number().optional(),
				change_percent: z.number().optional(),
				change_vs_previous_percent: z.number().optional(),
				computed_hour: z.number().int().optional(),
				core_state: z.looseObject({}),
				driver: z.string().optional(),
				evidence_score: z.number().optional(),
				heat_dimensions: z.looseObject({}),
				heat_score: z.number().optional(),
				heat_score_by_range: z.looseObject({}).optional(),
				heat_score_change_vs_previous_percent_by_range: z
					.looseObject({})
					.optional(),
				heat_score_previous_by_range: z.looseObject({}).optional(),
				liquidation_long_24h: z.number().optional(),
				liquidation_long_short_ratio_24h: z.number().optional(),
				liquidation_short_24h: z.number().optional(),
				logo: z.string().optional(),
				market_relevance: z.number().optional(),
				metric: z.string().optional(),
				name: z.string().optional(),
				open_interest: z.number().optional(),
				points_used: z.number().int().optional(),
				previous_value: z.number().optional(),
				price: z.number().optional(),
				price_change_percent: z.looseObject({}),
				project_id: z.string().optional(),
				project_slug: z.string().optional(),
				rank: z.number().int().optional(),
				score: z.number().optional(),
				signed_z: z.number().optional(),
				symbol: z.string().optional(),
				time_range: z.string().optional(),
				token_id: z.string().optional(),
				token_signals: z.looseObject({}).optional(),
				updated_at: z.number().int().optional(),
				value: z.number().optional(),
				volume_24h: z.number().optional(),
				volume_24h_change_percent: z.number().optional(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const HeatscoreTokenOfWeekOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				ai_summary: z.looseObject({}).optional(),
				baseline: z.number().optional(),
				change_percent: z.number().optional(),
				change_vs_previous_percent: z.number().optional(),
				computed_hour: z.number().int().optional(),
				core_state: z.looseObject({}),
				driver: z.string().optional(),
				evidence_score: z.number().optional(),
				heat_dimensions: z.looseObject({}),
				heat_score: z.number().optional(),
				heat_score_by_range: z.looseObject({}).optional(),
				heat_score_change_vs_previous_percent_by_range: z
					.looseObject({})
					.optional(),
				heat_score_previous_by_range: z.looseObject({}).optional(),
				liquidation_long_24h: z.number().optional(),
				liquidation_long_short_ratio_24h: z.number().optional(),
				liquidation_short_24h: z.number().optional(),
				logo: z.string().optional(),
				market_relevance: z.number().optional(),
				metric: z.string().optional(),
				name: z.string().optional(),
				open_interest: z.number().optional(),
				points_used: z.number().int().optional(),
				previous_value: z.number().optional(),
				price: z.number().optional(),
				price_change_percent: z.looseObject({}),
				project_id: z.string().optional(),
				project_slug: z.string().optional(),
				rank: z.number().int().optional(),
				score: z.number().optional(),
				signed_z: z.number().optional(),
				symbol: z.string().optional(),
				time_range: z.string().optional(),
				token_id: z.string().optional(),
				token_signals: z.looseObject({}).optional(),
				updated_at: z.number().int().optional(),
				value: z.number().optional(),
				volume_24h: z.number().optional(),
				volume_24h_change_percent: z.number().optional(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const HyperliquidAccountOutput = z.looseObject({
	data: z.looseObject({
		address: z.string(),
		as_of: z.number().int(),
		errors: z.array(z.looseObject({})).nullable().optional(),
		perp: z
			.looseObject({
				account_value: z.number(),
				open_position_count: z.number().int(),
				total_margin_used: z.number(),
				withdrawable: z.number(),
			})
			.optional(),
		spot: z
			.looseObject({ balances: z.array(z.looseObject({})).nullable() })
			.optional(),
		staking: z
			.looseObject({
				delegated_hype: z.number(),
				pending_withdrawal_count: z.number().int(),
				total_pending_withdrawal_hype: z.number(),
				undelegated_hype: z.number(),
			})
			.optional(),
		total_value_usd: z.number().optional(),
		unpriced_token_count: z.number().int(),
		vaults: z
			.looseObject({
				positions: z.array(z.looseObject({})).nullable(),
				total_equity: z.number(),
			})
			.optional(),
	}),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
	}),
});

export const HyperliquidCandlesOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				close: z.number(),
				close_time: z.number().int(),
				closed: z.boolean(),
				high: z.number(),
				interval: z.string(),
				low: z.number(),
				open: z.number(),
				open_time: z.number().int(),
				quote: z.number().nullable(),
				symbol: z.string(),
				trades: z.number().int(),
				volume: z.number(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const HyperliquidFillsOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				closed_pnl: z.number(),
				crossed: z.boolean(),
				direction: z.string(),
				fee: z.number(),
				fee_token: z.string(),
				fill_id: z.string(),
				hash: z.string(),
				is_internal: z.boolean(),
				price: z.number(),
				side: z.string(),
				size: z.number(),
				start_position: z.number(),
				symbol: z.string(),
				time: z.number().int(),
				time_ms: z.number().int(),
				tx_index: z.number().int(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean(),
		limit: z.number().int(),
		next_cursor: z.string().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const HyperliquidLeaderboardOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				account_age_days: z.number().int().optional(),
				address: z.string(),
				days_active: z.number().int(),
				human_score: z.number().int(),
				rank: z.number().int(),
				total_fees: z.number(),
				total_funding: z.number(),
				total_pnl: z.number(),
				total_trades: z.number().int(),
				traded_pairs: z.array(z.string()).nullable(),
				volume_traded: z.number(),
				win_rate: z.number(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const HyperliquidOrdersOutput = z.looseObject({
	data: z.looseObject({
		address: z.string(),
		as_of: z.number().int(),
		errors: z.array(z.looseObject({})).nullable().optional(),
		historical: z.array(z.looseObject({})).nullable(),
		historical_total: z.number().int(),
		open: z.array(z.looseObject({})).nullable(),
		open_total: z.number().int(),
	}),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
	}),
});

export const HyperliquidPerformanceOutput = z.looseObject({
	data: z.looseObject({
		account_value: z.number().optional(),
		address: z.string(),
		errors: z.array(z.looseObject({})).nullable().optional(),
		open_positions: z.array(z.looseObject({})).nullable(),
		partial: z.boolean(),
		performance: z
			.looseObject({
				avg_loss: z.number().optional(),
				avg_win: z.number().optional(),
				fees: z.number(),
				first_trade: z.number().int(),
				gross_pnl: z.number(),
				last_trade: z.number().int(),
				losses: z.number().int(),
				net_pnl: z.number(),
				profit_factor: z.number().optional(),
				scratches: z.number().int(),
				trades: z.number().int(),
				volume_usd: z.number(),
				win_rate: z.number(),
				wins: z.number().int(),
			})
			.optional(),
		total_unrealized_pnl: z.number().optional(),
		traded_pairs: z.number().int(),
		watermark: z.number().int(),
	}),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
	}),
});

export const HyperliquidPositionsOutput = z.looseObject({
	data: z.looseObject({
		account_value: z.number(),
		address: z.string(),
		cross_maintenance_margin_used: z.number(),
		margin_ratio: z.number(),
		positions: z.array(z.looseObject({})).nullable(),
		timestamp: z.number().int(),
		total_margin_used: z.number(),
		total_notional_pos: z.number(),
		total_raw_usd: z.number(),
		withdrawable: z.number(),
	}),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
	}),
});

export const HyperliquidTradesOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				close_time: z.number().int(),
				direction: z.string(),
				entry_px: z.number(),
				episode_id: z.string().optional(),
				exit_px: z.number(),
				fees: z.number(),
				funding_pnl: z.number(),
				funding_status: z.enum(['complete', 'partial', 'unavailable']),
				gross_pnl: z.number(),
				hold_seconds: z.number().int(),
				is_win: z.boolean(),
				leverage: z.number().int().optional(),
				leverage_semantics: z.enum(['completed_trade_reported']).optional(),
				leverage_type: z.enum(['cross', 'isolated']).optional(),
				net_pnl: z.number(),
				notional_usd: z.number(),
				open_time: z.number().int(),
				opened_sz: z.number(),
				reported_leverage: z.number().int().optional(),
				reported_leverage_type: z.enum(['cross', 'isolated']).optional(),
				source: z.string(),
				symbol: z.string(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean(),
		limit: z.number().int(),
		next_cursor: z.string().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const HyperliquidTradesAggregateOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				avg_loss: z.number().optional(),
				avg_win: z.number().optional(),
				fees: z.number(),
				funding_pnl: z.number(),
				funding_status: z.enum(['complete', 'partial', 'unavailable']),
				gross_pnl: z.number(),
				key: z.string(),
				net_pnl: z.number(),
				trade_count: z.number().int(),
				volume_usd: z.number(),
				win_rate: z.number(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const HyperliquidTradesContextOutput = z.looseObject({
	data: z.looseObject({
		funding_pnl: z.number().optional(),
		funding_status: z.enum(['complete', 'partial', 'unavailable']),
		leverage: z.number().int().optional(),
		leverage_semantics: z.enum(['completed_trade_reported']).optional(),
		leverage_type: z.enum(['cross', 'isolated']).optional(),
		reported_leverage: z.number().int().optional(),
		reported_leverage_type: z.enum(['cross', 'isolated']).optional(),
	}),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
	}),
});

export const MarketEtfOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				etfs: z.array(z.looseObject({})).nullable().optional(),
				flow_usd: z.number(),
				price_usd: z.number(),
				project_id: z.string().optional(),
				settled: z.boolean(),
				symbol: z.string().optional(),
				timestamp: z.number().int(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
	}),
});

export const MarketExchangeFlowExchangesOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				name: z.string(),
				supported_flow_filter: z.boolean(),
				symbol: z.string(),
				type: z.string(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const MarketFearGreedOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				classification: z.string(),
				price: z.number(),
				timestamp: z.number().int(),
				value: z.number().int(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
	}),
});

export const MarketFuturesOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				funding_rate: z.number(),
				long_short_ratio: z.number(),
				open_interest: z.number(),
				project_id: z.string().optional(),
				symbol: z.string(),
				updated_at: z.number().int(),
				volume_24h: z.number(),
				volume_change_24h: z.number(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
	}),
});

export const MarketLiquidationChartOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				contributing_exchanges: z.array(z.string()).nullable().optional(),
				excluded_exchanges: z.array(z.string()).nullable().optional(),
				long_liquidation_usd: z.number(),
				short_liquidation_usd: z.number(),
				timestamp: z.number().int(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
	}),
});

export const MarketLiquidationExchangeListOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				exchange: z.string(),
				liquidation_usd: z.number(),
				long_liquidation_usd: z.number(),
				short_liquidation_usd: z.number(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
	}),
});

export const MarketLiquidationOrderOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				base_asset: z.string(),
				exchange: z.string(),
				order_id: z.string(),
				price: z.number(),
				side: z.string(),
				symbol: z.string(),
				timestamp: z.number().int(),
				usd_value: z.number(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const MarketListingOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				base_symbol: z.string().optional(),
				effective_at: z.number().int(),
				event_type: z.string(),
				exchange_name: z.string(),
				product: z.string(),
				published_at: z.number().int().optional(),
				quote_symbol: z.string().optional(),
				trading_pair: z.string(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const MarketOnchainIndicatorOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				exchange: z.string().optional(),
				exchange_name: z.string().optional(),
				metric: z.string().optional(),
				project_id: z.string().optional(),
				symbol: z.string().optional(),
				timestamp: z.number().int(),
				value: z.number(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const MarketOptionsOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				exchange: z.string(),
				max_pain_price: z.number().optional(),
				open_interest: z.number(),
				project_id: z.string().optional(),
				put_call_ratio: z.number().optional(),
				symbol: z.string(),
				updated_at: z.number().int(),
				volume_24h: z.number(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
	}),
});

export const MarketPriceOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				exchange: z.string().optional(),
				exchange_name: z.string().optional(),
				metric: z.string().optional(),
				project_id: z.string().optional(),
				symbol: z.string().optional(),
				timestamp: z.number().int(),
				value: z.number(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
	}),
	project_id: z.string().optional(),
	summary: z.looseObject({
		change_abs: z.number(),
		change_pct: z.number(),
		first: z.number(),
		high: z.number(),
		last: z.number(),
		latest_dt: z.number().int(),
		low: z.number(),
		n_points: z.number().int(),
	}),
	symbol: z.string().optional(),
});

export const MarketPriceIndicatorOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				interval: z.string(),
				name: z.string(),
				project_id: z.string().optional(),
				symbol: z.string(),
				timestamp: z.number().int().optional(),
				updated_at: z.number().int().optional(),
				value: z.number(),
				values: z.looseObject({}).optional(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const MarketPublicSaleOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				allocation_of_supply: z.number().optional(),
				ath_roi: z.number().optional(),
				crowdsale_end_date: z.number().int().optional(),
				crowdsale_price: z.number().optional(),
				crowdsale_raise: z.number().optional(),
				crowdsale_start_date: z.number().int().optional(),
				crowdsale_status: z.string().optional(),
				crowdsale_type: z.string().optional(),
				launchpad_name: z.string().optional(),
				name: z.string().optional(),
				project_id: z.string().optional(),
				symbol: z.string().optional(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const MarketRankingOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				ath: z.number().optional(),
				ath_date: z.number().int().optional(),
				atl: z.number().optional(),
				atl_date: z.number().int().optional(),
				change_24h_pct: z.number(),
				circulating_supply: z.number().optional(),
				fdv: z.number().optional(),
				high_24h: z.number(),
				id: z.string().optional(),
				image: z.string().optional(),
				low_24h: z.number(),
				market_cap_usd: z.number(),
				max_supply: z.number().optional(),
				name: z.string(),
				price_usd: z.number(),
				rank: z.number().int(),
				slug: z.string().optional(),
				symbol: z.string(),
				total_supply: z.number().optional(),
				volume_24h_usd: z.number(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const MarketTgeOutput = z.looseObject({
	data: z.looseObject({
		current_status: z.string(),
		exchanges: z.array(z.string()).nullable().optional(),
		last_event_time: z.number().int().optional(),
		project_id: z.string(),
		project_name: z.string().optional(),
	}),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
	}),
});

export const NewsDetailOutput = z.looseObject({
	data: z.looseObject({
		content: z.string(),
		id: z.string(),
		project_id: z.string().optional(),
		project_name: z.string().optional(),
		published_at: z.number().int(),
		source: z.string().optional(),
		summary: z.string().optional(),
		title: z.string(),
		url: z.string().optional(),
	}),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
	}),
});

export const NewsFeedOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				highlights: z.looseObject({}).optional(),
				id: z.string(),
				project_id: z.string().optional(),
				project_name: z.string().optional(),
				published_at: z.number().int(),
				source: z.string().optional(),
				summary: z.string().optional(),
				title: z.string(),
				url: z.string().optional(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const OnchainBridgeRankingOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				project: z.string(),
				tx_count: z.number().int(),
				volume_usd: z.number(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const OnchainDexActivityOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				active_traders: z.number().int(),
				enriched_ratio: z.number().optional(),
				timestamp: z.number().int().optional(),
				trades: z.number().int(),
				volume_usd: z.number().optional(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const OnchainGasPriceOutput = z.looseObject({
	data: z.looseObject({
		chain: z.string(),
		gas_price: z.string(),
		gas_price_gwei: z.number(),
	}),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
	}),
});

export const OnchainQueryOutput = z.looseObject({
	data: z.array(z.looseObject({})).nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const OnchainSchemaOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				columns: z.array(z.looseObject({})).nullable(),
				database: z.string(),
				engine: z.string().optional(),
				partition_key: z.string().optional(),
				physical_sources: z.array(z.looseObject({})).nullable().optional(),
				primary_key: z.string().optional(),
				sorting_key: z.string().optional(),
				table: z.string(),
				total_bytes: z.number().int().optional(),
				total_rows: z.number().int().optional(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const OnchainSqlOutput = z.looseObject({
	data: z.array(z.looseObject({})).nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const OnchainSqlJobsOutput = z.looseObject({
	data: z.looseObject({
		cancellation_requested: z.boolean(),
		created_at: z.number().int(),
		csv_url: z.string().optional(),
		elapsed_ms: z.number().int(),
		error: z.looseObject({ code: z.string(), message: z.string() }).optional(),
		estimated_bytes: z.number().int().optional(),
		estimated_rows: z.number().int().optional(),
		executed_sql: z.string(),
		expires_at: z.number().int(),
		external_request_id: z.string().optional(),
		finished_at: z.number().int().optional(),
		job_id: z.string(),
		max_rows: z.number().int(),
		parameters: z.looseObject({}),
		poll_url: z.string().optional(),
		processed_bytes: z.number().int(),
		processed_rows: z.number().int(),
		progress_percent: z.number().optional(),
		query_id: z.string(),
		recommended_action: z.string(),
		request_id: z.string(),
		result_url: z.string().optional(),
		retry_after_ms: z.number().int().optional(),
		retryable: z.boolean(),
		row_count: z.number().int().optional(),
		sql: z.string(),
		started_at: z.number().int().optional(),
		status: z.enum(['queued', 'running', 'succeeded', 'failed', 'canceled']),
	}),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
	}),
});

export const OnchainSqlJobsJobIdOutput = z.looseObject({
	data: z.looseObject({
		cancellation_requested: z.boolean(),
		created_at: z.number().int(),
		csv_url: z.string().optional(),
		elapsed_ms: z.number().int(),
		error: z.looseObject({ code: z.string(), message: z.string() }).optional(),
		estimated_bytes: z.number().int().optional(),
		estimated_rows: z.number().int().optional(),
		executed_sql: z.string(),
		expires_at: z.number().int(),
		external_request_id: z.string().optional(),
		finished_at: z.number().int().optional(),
		job_id: z.string(),
		max_rows: z.number().int(),
		parameters: z.looseObject({}),
		poll_url: z.string().optional(),
		processed_bytes: z.number().int(),
		processed_rows: z.number().int(),
		progress_percent: z.number().optional(),
		query_id: z.string(),
		recommended_action: z.string(),
		request_id: z.string(),
		result_url: z.string().optional(),
		retry_after_ms: z.number().int().optional(),
		retryable: z.boolean(),
		row_count: z.number().int().optional(),
		sql: z.string(),
		started_at: z.number().int().optional(),
		status: z.enum(['queued', 'running', 'succeeded', 'failed', 'canceled']),
	}),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
	}),
});

export const GetOnchainSqlJobsJobIdOutput = z.looseObject({
	data: z.looseObject({
		cancellation_requested: z.boolean(),
		created_at: z.number().int(),
		csv_url: z.string().optional(),
		elapsed_ms: z.number().int(),
		error: z.looseObject({ code: z.string(), message: z.string() }).optional(),
		estimated_bytes: z.number().int().optional(),
		estimated_rows: z.number().int().optional(),
		executed_sql: z.string(),
		expires_at: z.number().int(),
		external_request_id: z.string().optional(),
		finished_at: z.number().int().optional(),
		job_id: z.string(),
		max_rows: z.number().int(),
		parameters: z.looseObject({}),
		poll_url: z.string().optional(),
		processed_bytes: z.number().int(),
		processed_rows: z.number().int(),
		progress_percent: z.number().optional(),
		query_id: z.string(),
		recommended_action: z.string(),
		request_id: z.string(),
		result_url: z.string().optional(),
		retry_after_ms: z.number().int().optional(),
		retryable: z.boolean(),
		row_count: z.number().int().optional(),
		sql: z.string(),
		started_at: z.number().int().optional(),
		status: z.enum(['queued', 'running', 'succeeded', 'failed', 'canceled']),
	}),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
	}),
});

// JSON results are the row envelope. A text/csv download is the raw string.
// The columns are whatever the caller selected, so each row stays open.
export const OnchainSqlJobsJobIdResultsOutput = z.union([
	z.looseObject({
		data: z.array(z.looseObject({})).nullable(),
		meta: z.looseObject({
			cached: z.boolean(),
			credits_used: z.number().int(),
			empty_reason: z.string().optional(),
			has_more: z.boolean().optional(),
			limit: z.number().int(),
			offset: z.number().int(),
			total: z.number().int().optional(),
			watermark: z.number().int().optional(),
		}),
	}),
	z.string(),
]);

export const OnchainSqlPreflightOutput = z.looseObject({
	data: z.looseObject({
		accepted: z.boolean(),
		budget: z.looseObject({
			max_bytes_to_read: z.number().int(),
			max_execution_time_seconds: z.number().int(),
			max_rows_to_read: z.number().int(),
		}),
		estimate: z.looseObject({
			by_table: z.array(z.looseObject({})).nullable(),
			bytes: z.number().int(),
			marks: z.number().int(),
			parts: z.number().int(),
			rows: z.number().int(),
		}),
		executed_sql: z.string(),
		query_id: z.string(),
		request_id: z.string(),
		sql: z.string(),
		tables: z.array(z.looseObject({})).nullable(),
		warnings: z.array(z.looseObject({})).nullable(),
	}),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
	}),
});

export const OnchainTxOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				accessList: z.array(z.looseObject({})).nullable(),
				blobVersionedHashes: z.array(z.string()).nullable().optional(),
				blockHash: z.string().nullable(),
				blockNumber: z.string().nullable(),
				chainId: z.string().optional(),
				from: z.string(),
				from_label: z.looseObject({}).optional(),
				gas: z.string(),
				gasPrice: z.string().optional(),
				hash: z.string(),
				input: z.string(),
				maxFeePerBlobGas: z.string().optional(),
				maxFeePerGas: z.string().optional(),
				maxPriorityFeePerGas: z.string().optional(),
				nonce: z.string(),
				r: z.string(),
				s: z.string(),
				to: z.string().nullable(),
				to_label: z.looseObject({}).optional(),
				transactionIndex: z.string().nullable(),
				type: z.string(),
				v: z.string(),
				value: z.string(),
				yParity: z.string().optional(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const OnchainYieldRankingOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				apy: z.number(),
				apy_base: z.number(),
				apy_reward: z.number(),
				pool_address: z.string(),
				project: z.string(),
				symbol: z.string(),
				token_address: z.string(),
				tvl_usd: z.number(),
				version: z.string(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const PortfolioWalletsOutput = z.looseObject({
	data: z.looseObject({ wallets: z.array(z.looseObject({})).nullable() }),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
	}),
});

export const PredictionMarketAnalyticsOutput = z.looseObject({
	data: z.looseObject({
		category_trends: z.array(z.looseObject({})).nullable(),
		momentum_markets: z.array(z.looseObject({})).nullable(),
		momentum_summary: z.looseObject({
			confirming_down: z.number().int(),
			confirming_up: z.number().int(),
			diverging_down: z.number().int(),
			diverging_up: z.number().int(),
			neutral: z.number().int(),
			total_active: z.number().int(),
			volume_decreasing: z.number().int(),
			volume_increasing: z.number().int(),
		}),
		top_markets: z.array(z.looseObject({})).nullable(),
	}),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
	}),
});

export const PredictionMarketCorrelationsOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				category: z.string(),
				correlation: z.number(),
				market_a_condition_id: z.string(),
				market_a_question: z.string().optional(),
				market_b_condition_id: z.string(),
				market_b_question: z.string().optional(),
				overlapping_days: z.number().int(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const PredictionMarketKalshiEventsOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				event_subtitle: z.string().optional(),
				event_ticker: z.string(),
				event_title: z.string(),
				market_count: z.number().int(),
				markets: z.array(z.looseObject({})).nullable(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const PredictionMarketKalshiMarketsOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				category: z.string().optional(),
				close_time: z.number().int().optional(),
				end_time: z.number().int().optional(),
				event_ticker: z.string(),
				event_title: z.string().optional(),
				last_day_open_interest: z.number(),
				market_ticker: z.string(),
				notional_volume_usd: z.number(),
				open_interest: z.number(),
				payout_type: z.string(),
				result: z.string().optional(),
				start_time: z.number().int().optional(),
				status: z.string(),
				subcategory: z.string().optional(),
				title: z.string(),
				total_volume: z.number().int(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const PredictionMarketKalshiOpenInterestOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({ open_interest: z.number(), timestamp: z.number().int() }),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const PredictionMarketKalshiOrderbooksOutput = z.looseObject({
	pagination: z.looseObject({
		count: z.number().int(),
		has_more: z.boolean(),
		limit: z.number().int(),
		pagination_key: z.string().optional(),
	}),
	snapshots: z
		.array(
			z.looseObject({
				ask_depth: z.number().int(),
				best_ask: z.number().int(),
				best_bid: z.number().int(),
				bid_depth: z.number().int(),
				sequence: z.number().int(),
				ticker: z.string(),
				timestamp: z.number().int(),
				yes_asks: z.array(z.looseObject({})).nullable(),
				yes_bids: z.array(z.looseObject({})).nullable(),
			}),
		)
		.nullable(),
});

export const PredictionMarketKalshiPricesOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				high: z.number(),
				low: z.number(),
				open: z.number().optional(),
				side_a: z.looseObject({}),
				side_b: z.looseObject({}),
				timestamp: z.number().int(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const PredictionMarketKalshiTradesOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				market_ticker: z.string(),
				no_price: z.number(),
				notional_volume_usd: z.number().int(),
				taker_side: z.string(),
				timestamp: z.number().int(),
				trade_id: z.string(),
				yes_price: z.number(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const PredictionMarketKalshiVolumesOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				notional_volume_usd: z.number(),
				timestamp: z.number().int(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const PredictionMarketMatchingDailyOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				kalshi_oi_contracts: z.number(),
				kalshi_volume_contracts: z.number(),
				polymarket_oi_usd: z.number(),
				polymarket_volume_usd: z.number(),
				timestamp: z.number().int(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const PredictionMarketMatchingPairsOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				category: z.string(),
				confidence: z.number().int(),
				kalshi: z.looseObject({}),
				kalshi_price: z.number().optional(),
				match_type: z.string(),
				polymarket: z.looseObject({}),
				polymarket_price: z.number().optional(),
				spread_pct: z.number().optional(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const PredictionMarketPolymarketEventsOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				category: z.string().optional(),
				description: z.string().optional(),
				end_time: z.number().int().optional(),
				event_slug: z.string(),
				image: z.string().optional(),
				market_count: z.number().int(),
				markets: z.array(z.looseObject({})).nullable(),
				settlement_sources: z.string().optional(),
				start_time: z.number().int().optional(),
				status: z.string(),
				subcategory: z.string().optional(),
				tags: z.array(z.string()).nullable().optional(),
				title: z.string(),
				volume_total: z.number(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const PredictionMarketPolymarketLeaderboardOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				address: z.string(),
				pnl: z.number(),
				positions: z.number().int(),
				positions_lost: z.number().int(),
				positions_open: z.number().int(),
				positions_won: z.number().int(),
				trade_count: z.number().int(),
				volume: z.number(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const PredictionMarketPolymarketMarketsOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				category: z.string().optional(),
				close_time: z.number().int().optional(),
				completed_time: z.number().int().optional(),
				condition_id: z.string(),
				description: z.string().optional(),
				end_time: z.number().int().optional(),
				event_slug: z.string().optional(),
				game_start_time: z.number().int().optional(),
				image: z.string().optional(),
				market_slug: z.string(),
				negative_risk_id: z.string().optional(),
				polymarket_link: z.string().optional(),
				resolution_source: z.string().optional(),
				side_a: z.looseObject({}).optional(),
				side_b: z.looseObject({}).optional(),
				start_time: z.number().int().optional(),
				status: z.string(),
				subcategory: z.string().optional(),
				tags: z.array(z.string()).nullable().optional(),
				title: z.string(),
				volume_1_month: z.number(),
				volume_1_week: z.number(),
				volume_1_year: z.number(),
				volume_total: z.number(),
				winning_side: z.string().optional(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const PredictionMarketPolymarketOpenInterestOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				daily_net_change_usd: z.number(),
				open_interest_usd: z.number(),
				timestamp: z.number().int(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const PredictionMarketPolymarketOrderbooksOutput = z.looseObject({
	pagination: z.looseObject({
		count: z.number().int(),
		has_more: z.boolean(),
		limit: z.number().int(),
		pagination_key: z.string().optional(),
	}),
	snapshots: z
		.array(
			z.looseObject({
				asks: z.array(z.looseObject({})).nullable(),
				assetId: z.string(),
				bids: z.array(z.looseObject({})).nullable(),
				hash: z.string(),
				indexedAt: z.number().int(),
				market: z.string(),
				tickSize: z.string(),
				timestamp: z.number().int(),
			}),
		)
		.nullable(),
});

export const PredictionMarketPolymarketPositionsOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				avg_price: z.number(),
				cash_pnl: z.number(),
				condition_id: z.string(),
				cur_price: z.number(),
				current_value: z.number(),
				outcome_label: z.string(),
				question: z.string(),
				realized_pnl: z.number(),
				redeemable: z.boolean(),
				size: z.number(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const PredictionMarketPolymarketPriceOhlcvConditionIdOutput =
	z.looseObject({
		candles: z
			.array(
				z.looseObject({
					close: z.number(),
					end_period_ts: z.number().int(),
					high: z.number(),
					low: z.number(),
					open: z.number(),
					timestamp: z.number().int(),
					trades_count: z.number().int(),
					volume: z.number(),
				}),
			)
			.nullable(),
		condition_id: z.string(),
		interval: z.number().int(),
	});

export const PredictionMarketPolymarketPricesOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				side_a: z.looseObject({}).optional(),
				side_b: z.looseObject({}).optional(),
				timestamp: z.number().int(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const PredictionMarketPolymarketSmartMoneyOutput = z.looseObject({
	data: z.array(z.string()).nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const PredictionMarketPolymarketTradesOutput = z.looseObject({
	data: z.array(z.string()).nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const PredictionMarketPolymarketVolumeSplitConditionIdOutput =
	z.looseObject({
		condition_id: z.string(),
		data_points: z
			.array(
				z.looseObject({
					no_volume: z.number(),
					timestamp: z.number().int(),
					total_volume: z.number(),
					trades_count: z.number().int(),
					yes_volume: z.number(),
				}),
			)
			.nullable(),
		end_time: z.number().int(),
		granularity: z.string(),
		start_time: z.number().int(),
	});

export const PredictionMarketPolymarketVolumesOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				buy_volume: z.number().optional(),
				notional_volume_usd: z.number(),
				sell_volume: z.number().optional(),
				timestamp: z.number().int(),
				trade_count: z.number().int(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const ProjectAiNewsOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				id: z.string(),
				signal_type: z.string(),
				slug: z.string().optional(),
				sources: z.array(z.string()).nullable().optional(),
				subtitle: z.string().optional(),
				timestamp: z.number().int(),
				title: z.string(),
				tldr: z.array(z.string()).nullable().optional(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const ProjectDefiMetricsOutput = z.looseObject({
	data: z
		.array(z.looseObject({ timestamp: z.number().int(), value: z.number() }))
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const ProjectDefiRankingOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				fees: z.number().optional(),
				id: z.string().optional(),
				logo_url: z.string().optional(),
				name: z.string(),
				revenue: z.number().optional(),
				slug: z.string().optional(),
				symbol: z.string().optional(),
				tvl: z.number().optional(),
				users: z.number().int().optional(),
				volume: z.number().optional(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const ProjectDetailOutput = z.looseObject({
	data: z.looseObject({
		contracts: z
			.looseObject({
				contracts: z.array(z.looseObject({})).nullable().optional(),
			})
			.optional(),
		funding: z
			.looseObject({
				rounds: z.array(z.looseObject({})).nullable().optional(),
				total_raise: z.number().optional(),
			})
			.optional(),
		overview: z
			.looseObject({
				chains: z.array(z.string()).nullable().optional(),
				description: z.string().optional(),
				exchanges: z.array(z.string()).nullable().optional(),
				id: z.string(),
				logo_url: z.string().optional(),
				name: z.string(),
				slug: z.string().optional(),
				tags: z.array(z.string()).nullable().optional(),
				tge_status: z.string().optional(),
				token_symbol: z.string().optional(),
				website: z.string().optional(),
				x_followers: z.number().int(),
				x_handle: z.string().optional(),
				x_id: z.string().optional(),
			})
			.optional(),
		social: z
			.looseObject({
				discord: z.looseObject({}).optional(),
				github: z.looseObject({}).optional(),
				telegram: z.looseObject({}).optional(),
				twitter: z.looseObject({}).optional(),
			})
			.optional(),
		team: z
			.looseObject({
				members: z.array(z.looseObject({})).nullable().optional(),
			})
			.optional(),
		tge_status: z
			.looseObject({
				current_status: z.string().optional(),
				exchanges: z.array(z.string()).nullable().optional(),
				last_event_time: z.number().int().optional(),
			})
			.optional(),
		token_info: z
			.looseObject({
				all_time_high: z.number().optional(),
				all_time_high_date: z.number().int().optional(),
				all_time_low: z.number().optional(),
				all_time_low_date: z.number().int().optional(),
				circulating_supply: z.number().optional(),
				fdv: z.number().optional(),
				high_24h: z.number().optional(),
				image: z.string().optional(),
				low_24h: z.number().optional(),
				market_cap_usd: z.number().optional(),
				name: z.string(),
				price_change_24h: z.number().optional(),
				price_change_30d: z.number().optional(),
				price_change_7d: z.number().optional(),
				price_usd: z.number().optional(),
				symbol: z.string(),
				total_supply: z.number().optional(),
				volume_24h: z.number().optional(),
			})
			.optional(),
		tokenomics: z
			.looseObject({
				circulating_supply: z.number().optional(),
				fdv: z.number().optional(),
				market_cap_usd: z.number().optional(),
				total_supply: z.number().optional(),
			})
			.optional(),
	}),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
	}),
});

export const SearchAirdropOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				coin_symbol: z.string().optional(),
				followers_count: z.number().int(),
				last_status_update: z.number().int(),
				logo_url: z.string().optional(),
				project_id: z.string().optional(),
				project_name: z.string(),
				reward_date: z.number().int(),
				reward_type: z.string().optional(),
				status: z.string(),
				task_summary: z.looseObject({}).optional(),
				tasks: z.array(z.looseObject({})).nullable().optional(),
				total_raise: z.number().int(),
				xscore: z.number().int(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const SearchAirdropActivitiesOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				coin_name: z.string(),
				coin_symbol: z.string().optional(),
				created_at: z.number().int(),
				followers_count: z.string().optional(),
				id: z.string(),
				reward: z.string(),
				reward_date: z.string().optional(),
				reward_type: z.string(),
				status: z.string(),
				total_raise: z.number().int().optional(),
				updated_at: z.number().int(),
				xscore: z.string().optional(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const SearchEventsOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				date: z.string().optional(),
				description: z.string().optional(),
				logo_url: z.string().optional(),
				title: z.string(),
				type: z.string(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const SearchFundOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				id: z.string(),
				image: z.string().optional(),
				invested_projects_count: z.number().int(),
				name: z.string(),
				tier: z.number().int(),
				top_projects: z.array(z.looseObject({})).nullable(),
				type: z.string().optional(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const SearchFundraisingOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				event_at: z.number().int(),
				id: z.string(),
				importance: z.number().int().optional(),
				published_at: z.number().int(),
				source: z.looseObject({}),
				source_count: z.number().int(),
				summary: z.string(),
				title: z.string(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const SearchNewsOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				highlights: z.looseObject({}).optional(),
				id: z.string(),
				project_id: z.string().optional(),
				project_name: z.string().optional(),
				published_at: z.number().int(),
				source: z.string().optional(),
				summary: z.string().optional(),
				title: z.string(),
				url: z.string().optional(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const SearchPredictionMarketOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				category: z.string(),
				condition_id: z.string().optional(),
				days_to_resolution: z.number().int().optional(),
				event_group_slug: z.string().optional(),
				event_slug: z.string().optional(),
				event_ticker: z.string().optional(),
				event_title: z.string().optional(),
				latest_price: z.number().optional(),
				market_link: z.string().optional(),
				market_slug: z.string().optional(),
				market_ticker: z.string().optional(),
				matched_counterpart: z.string().optional(),
				open_interest_usd: z.number(),
				outcome_label: z.string().optional(),
				platform: z.string(),
				question: z.string(),
				smart_money_direction: z.string().optional(),
				status: z.string(),
				subcategory: z.string().optional(),
				token_id: z.string().optional(),
				trade_count_7d: z.number().int(),
				volume_1d: z.number(),
				volume_30d: z.number(),
				volume_7d: z.number(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const SearchProjectOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				chains: z.array(z.string()).nullable().optional(),
				description: z.string().optional(),
				id: z.string(),
				logo_url: z.string().optional(),
				name: z.string(),
				slug: z.string().optional(),
				symbol: z.string().optional(),
				tags: z.array(z.string()).nullable().optional(),
				tokens: z.array(z.looseObject({})).nullable().optional(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const SearchTokenOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				address: z.string(),
				chain: z.string(),
				decimals: z.number().int(),
				symbol: z.string(),
				volume_usd: z.number(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const SearchWalletOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				address: z.string().optional(),
				addresses: z.array(z.looseObject({})).nullable().optional(),
				chain: z.string().optional(),
				entity_name: z.string().optional(),
				entity_type: z.string().optional(),
				label: z.string().optional(),
				num_addresses: z.number().int().optional(),
				twitter: z.string().optional(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const SearchWebOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				content: z.string(),
				description: z.string(),
				title: z.string(),
				url: z.string(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const TokenDexTradesOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				amount_usd: z.number(),
				block_time: z.number().int(),
				project: z.string(),
				taker: z.string(),
				taker_label: z.looseObject({}).optional(),
				token_bought_address: z.string().optional(),
				token_bought_amount: z.number(),
				token_bought_symbol: z.string(),
				token_pair: z.string(),
				token_sold_address: z.string().optional(),
				token_sold_amount: z.number(),
				token_sold_symbol: z.string(),
				tx_hash: z.string(),
				version: z.string(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const TokenHoldersOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				address: z.string(),
				balance: z.string(),
				entity_name: z.string().optional(),
				entity_type: z.string().optional(),
				label: z.looseObject({}).optional(),
				percentage: z.number().optional(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const TokenTokenomicsOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				allocations: z.array(z.looseObject({})).nullable().optional(),
				cumulative_unlocked_amount: z.number(),
				timestamp: z.number().int(),
				total_supply: z.number().optional(),
				unlock_amount: z.number(),
				unlocked_percentage_of_total_supply: z.number().optional(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const TokenTransferCounterpartiesOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				amount: z.string(),
				amount_usd: z.number().optional(),
				counterparty_address: z.string(),
				first_transfer_at: z.number().int(),
				label: z.looseObject({}).optional(),
				last_transfer_at: z.number().int(),
				transfer_count: z.number().int(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const TokenTransferStatsOutput = z.looseObject({
	data: z.looseObject({
		enriched_ratio: z.number().optional(),
		first_transfer_at: z.number().int(),
		last_transfer_at: z.number().int(),
		series: z.array(z.looseObject({})).nullable().optional(),
		total_amount: z.string(),
		total_amount_usd: z.number().optional(),
		total_transfers: z.number().int(),
		unique_receivers: z.number().int(),
		unique_senders: z.number().int(),
	}),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		enriched_ratio: z.number().optional(),
	}),
});

export const TokenTransfersOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				amount: z.string(),
				amount_usd: z.number().optional(),
				block_number: z.number().int(),
				from_address: z.string(),
				from_label: z.looseObject({}).optional(),
				symbol: z.string().optional(),
				timestamp: z.number().int(),
				to_address: z.string(),
				to_label: z.looseObject({}).optional(),
				tx_hash: z.string(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const WalletDetailOutput = z.looseObject({
	data: z.looseObject({
		active_chains: z.array(z.looseObject({})).nullable().optional(),
		approvals: z.array(z.looseObject({})).nullable().optional(),
		errors: z.array(z.looseObject({})).nullable().optional(),
		evm_balance: z
			.looseObject({
				address: z.string(),
				chain_balances: z.array(z.looseObject({})).nullable().optional(),
				total_usd: z.number(),
			})
			.optional(),
		evm_tokens: z.array(z.looseObject({})).nullable().optional(),
		labels: z
			.looseObject({
				address: z.string(),
				entity_name: z.string().optional(),
				entity_type: z.string().optional(),
				labels: z.array(z.looseObject({})).nullable(),
			})
			.optional(),
		nft: z.array(z.looseObject({})).nullable().optional(),
		sol_balance: z
			.looseObject({ address: z.string(), sol_balance: z.string() })
			.optional(),
		sol_tokens: z.array(z.looseObject({})).nullable().optional(),
	}),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
	}),
});

export const WalletHistoryOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				from_address: z.string(),
				from_label: z.looseObject({}).optional(),
				timestamp: z.number().int(),
				to_address: z.string(),
				to_label: z.looseObject({}).optional(),
				tx_hash: z.string(),
				tx_type: z.string().optional(),
				value: z.string(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const WalletLabelsBatchOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				address: z.string(),
				entity_name: z.string().optional(),
				entity_type: z.string().optional(),
				labels: z.array(z.looseObject({})).nullable(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const WalletNetWorthOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({ timestamp: z.number().int(), usd_value: z.number() }),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const WalletProtocolsOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				chain: z.string(),
				logo_url: z.string().optional(),
				positions: z.array(z.looseObject({})).nullable(),
				protocol_name: z.string(),
				site_url: z.string().optional(),
				total_usd: z.number(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const WalletTransfersOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				activity_type: z.string().optional(),
				amount: z.string(),
				amount_usd: z.number().optional(),
				flow: z.string().optional(),
				from_address: z.string(),
				from_label: z.looseObject({}).optional(),
				timestamp: z.number().int(),
				to_address: z.string(),
				to_label: z.looseObject({}).optional(),
				token_address: z.string().optional(),
				token_symbol: z.string().optional(),
				tx_hash: z.string(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

export const WebFetchOutput = z.looseObject({
	data: z.looseObject({
		content: z.string(),
		title: z.string().optional(),
		url: z.string(),
	}),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
	}),
});

export const XTweetsOutput = z.looseObject({
	data: z
		.array(
			z.looseObject({
				author: z.looseObject({}),
				cover_image_url: z.string().optional(),
				created_at: z.number().int(),
				lang: z.string().optional(),
				media: z.array(z.looseObject({})).nullable().optional(),
				stats: z.looseObject({}),
				text: z.string(),
				title: z.string().optional(),
				tweet_id: z.string(),
				type: z.string().optional(),
				url: z.string(),
			}),
		)
		.nullable(),
	meta: z.looseObject({
		cached: z.boolean(),
		credits_used: z.number().int(),
		empty_reason: z.string().optional(),
		has_more: z.boolean().optional(),
		limit: z.number().int(),
		offset: z.number().int(),
		total: z.number().int().optional(),
		watermark: z.number().int().optional(),
	}),
});

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
	dexTokenPrice: DexTokenPriceOutput,
	equityBalanceSheet: EquityBalanceSheetOutput,
	equityCandles: EquityCandlesOutput,
	equityCashFlow: EquityCashFlowOutput,
	equityEtfHoldings: EquityEtfHoldingsOutput,
	equityFilings: EquityFilingsOutput,
	equityIncomeStatement: EquityIncomeStatementOutput,
	equityLatestFilings: EquityLatestFilingsOutput,
	equityLatestFinancials: EquityLatestFinancialsOutput,
	equityListings: EquityListingsOutput,
	equityMeta: EquityMetaOutput,
	equityMetrics: EquityMetricsOutput,
	equityOverview: EquityOverviewOutput,
	equityProfile: EquityProfileOutput,
	equitySegments: EquitySegmentsOutput,
	exchangeCandles: ExchangeCandlesOutput,
	exchangeCoverage: ExchangeCoverageOutput,
	exchangeDepth: ExchangeDepthOutput,
	exchangeFundingHistory: ExchangeFundingHistoryOutput,
	exchangeKlines: ExchangeKlinesOutput,
	exchangeLongShortRatio: ExchangeLongShortRatioOutput,
	exchangeMarkets: ExchangeMarketsOutput,
	exchangePerp: ExchangePerpOutput,
	exchangePrice: ExchangePriceOutput,
	fundDetail: FundDetailOutput,
	fundPortfolio: FundPortfolioOutput,
	fundRanking: FundRankingOutput,
	heatscoreDetail: HeatscoreDetailOutput,
	heatscoreProjects: HeatscoreProjectsOutput,
	heatscoreTokenOfTheDay: HeatscoreTokenOfTheDayOutput,
	heatscoreTokenOfWeek: HeatscoreTokenOfWeekOutput,
	hyperliquidAccount: HyperliquidAccountOutput,
	hyperliquidCandles: HyperliquidCandlesOutput,
	hyperliquidFills: HyperliquidFillsOutput,
	hyperliquidLeaderboard: HyperliquidLeaderboardOutput,
	hyperliquidOrders: HyperliquidOrdersOutput,
	hyperliquidPerformance: HyperliquidPerformanceOutput,
	hyperliquidPositions: HyperliquidPositionsOutput,
	hyperliquidTrades: HyperliquidTradesOutput,
	hyperliquidTradesAggregate: HyperliquidTradesAggregateOutput,
	hyperliquidTradesContext: HyperliquidTradesContextOutput,
	marketEtf: MarketEtfOutput,
	marketExchangeFlowExchanges: MarketExchangeFlowExchangesOutput,
	marketFearGreed: MarketFearGreedOutput,
	marketFutures: MarketFuturesOutput,
	marketLiquidationChart: MarketLiquidationChartOutput,
	marketLiquidationExchangeList: MarketLiquidationExchangeListOutput,
	marketLiquidationOrder: MarketLiquidationOrderOutput,
	marketListing: MarketListingOutput,
	marketOnchainIndicator: MarketOnchainIndicatorOutput,
	marketOptions: MarketOptionsOutput,
	marketPrice: MarketPriceOutput,
	marketPriceIndicator: MarketPriceIndicatorOutput,
	marketPublicSale: MarketPublicSaleOutput,
	marketRanking: MarketRankingOutput,
	marketTge: MarketTgeOutput,
	newsDetail: NewsDetailOutput,
	newsFeed: NewsFeedOutput,
	onchainBridgeRanking: OnchainBridgeRankingOutput,
	onchainDexActivity: OnchainDexActivityOutput,
	onchainGasPrice: OnchainGasPriceOutput,
	onchainQuery: OnchainQueryOutput,
	onchainSchema: OnchainSchemaOutput,
	onchainSql: OnchainSqlOutput,
	onchainSqlJobs: OnchainSqlJobsOutput,
	onchainSqlJobsJobId: OnchainSqlJobsJobIdOutput,
	getOnchainSqlJobsJobId: GetOnchainSqlJobsJobIdOutput,
	onchainSqlJobsJobIdResults: OnchainSqlJobsJobIdResultsOutput,
	onchainSqlPreflight: OnchainSqlPreflightOutput,
	onchainTx: OnchainTxOutput,
	onchainYieldRanking: OnchainYieldRankingOutput,
	portfolioWallets: PortfolioWalletsOutput,
	predictionMarketAnalytics: PredictionMarketAnalyticsOutput,
	predictionMarketCorrelations: PredictionMarketCorrelationsOutput,
	predictionMarketKalshiEvents: PredictionMarketKalshiEventsOutput,
	predictionMarketKalshiMarkets: PredictionMarketKalshiMarketsOutput,
	predictionMarketKalshiOpenInterest: PredictionMarketKalshiOpenInterestOutput,
	predictionMarketKalshiOrderbooks: PredictionMarketKalshiOrderbooksOutput,
	predictionMarketKalshiPrices: PredictionMarketKalshiPricesOutput,
	predictionMarketKalshiTrades: PredictionMarketKalshiTradesOutput,
	predictionMarketKalshiVolumes: PredictionMarketKalshiVolumesOutput,
	predictionMarketMatchingDaily: PredictionMarketMatchingDailyOutput,
	predictionMarketMatchingPairs: PredictionMarketMatchingPairsOutput,
	predictionMarketPolymarketEvents: PredictionMarketPolymarketEventsOutput,
	predictionMarketPolymarketLeaderboard:
		PredictionMarketPolymarketLeaderboardOutput,
	predictionMarketPolymarketMarkets: PredictionMarketPolymarketMarketsOutput,
	predictionMarketPolymarketOpenInterest:
		PredictionMarketPolymarketOpenInterestOutput,
	predictionMarketPolymarketOrderbooks:
		PredictionMarketPolymarketOrderbooksOutput,
	predictionMarketPolymarketPositions:
		PredictionMarketPolymarketPositionsOutput,
	predictionMarketPolymarketPriceOhlcvConditionId:
		PredictionMarketPolymarketPriceOhlcvConditionIdOutput,
	predictionMarketPolymarketPrices: PredictionMarketPolymarketPricesOutput,
	predictionMarketPolymarketSmartMoney:
		PredictionMarketPolymarketSmartMoneyOutput,
	predictionMarketPolymarketTrades: PredictionMarketPolymarketTradesOutput,
	predictionMarketPolymarketVolumeSplitConditionId:
		PredictionMarketPolymarketVolumeSplitConditionIdOutput,
	predictionMarketPolymarketVolumes: PredictionMarketPolymarketVolumesOutput,
	projectAiNews: ProjectAiNewsOutput,
	projectDefiMetrics: ProjectDefiMetricsOutput,
	projectDefiRanking: ProjectDefiRankingOutput,
	projectDetail: ProjectDetailOutput,
	searchAirdrop: SearchAirdropOutput,
	searchAirdropActivities: SearchAirdropActivitiesOutput,
	searchEvents: SearchEventsOutput,
	searchFund: SearchFundOutput,
	searchFundraising: SearchFundraisingOutput,
	searchNews: SearchNewsOutput,
	searchPredictionMarket: SearchPredictionMarketOutput,
	searchProject: SearchProjectOutput,
	searchToken: SearchTokenOutput,
	searchWallet: SearchWalletOutput,
	searchWeb: SearchWebOutput,
	tokenDexTrades: TokenDexTradesOutput,
	tokenHolders: TokenHoldersOutput,
	tokenTokenomics: TokenTokenomicsOutput,
	tokenTransferCounterparties: TokenTransferCounterpartiesOutput,
	tokenTransferStats: TokenTransferStatsOutput,
	tokenTransfers: TokenTransfersOutput,
	walletDetail: WalletDetailOutput,
	walletHistory: WalletHistoryOutput,
	walletLabelsBatch: WalletLabelsBatchOutput,
	walletNetWorth: WalletNetWorthOutput,
	walletProtocols: WalletProtocolsOutput,
	walletTransfers: WalletTransfersOutput,
	webFetch: WebFetchOutput,
	xTweets: XTweetsOutput,
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
