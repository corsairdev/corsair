import { logEventFromContext } from 'corsair/core';
import { makeSurfRequest } from './client';
import {
	Dex,
	Equity,
	Exchange,
	Fund,
	Heatscore,
	Hyperliquid,
	Market,
	News,
	Onchain,
	Portfolio,
	PredictionMarket,
	Project,
	Search,
	Token,
	Wallet,
	Web,
	X,
} from './endpoints';
import type { SurfContext } from './index';

jest.mock('./client', () => ({
	makeSurfRequest: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

const mockRequest = makeSurfRequest as jest.MockedFunction<
	typeof makeSurfRequest
>;

function ctx(): SurfContext {
	// Routing only needs the API key. The rest of the plugin context is unused.
	return { key: 'x_key_test', options: {} } as SurfContext;
}

const groups = {
	Dex,
	Equity,
	Exchange,
	Fund,
	Heatscore,
	Hyperliquid,
	Market,
	News,
	Onchain,
	Portfolio,
	PredictionMarket,
	Project,
	Search,
	Token,
	Wallet,
	Web,
	X,
} as const;

describe('surf routing', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		jest.mocked(logEventFromContext).mockReset();
	});

	const cases: Array<{
		name: string;
		// Each case calls a different endpoint, so there is no single return type.
		run: () => Promise<unknown>;
		// The mock body matches that route's output schema.
		response: unknown;
		method: string;
		url: string;
		query?: Record<string, string | number | boolean>;
		path?: Record<string, string>;
		body?: Record<string, string | number | boolean>;
	}> = [
		{
			name: 'dex.tokenPrice',
			run: () =>
				groups.Dex.tokenPrice(ctx(), {
					chain: 'ethereum',
					address: '0x0000000000000000000000000000000000000001',
				}),
			response: { data: [], meta: { cached: false, credits_used: 0 } },
			method: 'GET',
			url: '/gateway/v1/dex/token/price',
			query: {
				chain: 'ethereum',
				address: '0x0000000000000000000000000000000000000001',
			},
		},
		{
			name: 'equity.balanceSheet',
			run: () => groups.Equity.balanceSheet(ctx(), { symbol: 'BTC' }),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/equity/balance-sheet',
			query: { symbol: 'BTC' },
		},
		{
			name: 'equity.candles',
			run: () => groups.Equity.candles(ctx(), { symbol: 'BTC' }),
			response: {
				data: {
					candles: [],
					interval: 'x',
					interval_multiplier: 0,
					latest_price: { price: 0, timestamp: 0 },
					latest_price_available: false,
					symbol: 'x',
				},
				meta: { cached: false, credits_used: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/equity/candles',
			query: { symbol: 'BTC' },
		},
		{
			name: 'equity.cashFlow',
			run: () => groups.Equity.cashFlow(ctx(), { symbol: 'BTC' }),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/equity/cash-flow',
			query: { symbol: 'BTC' },
		},
		{
			name: 'equity.etfHoldings',
			run: () => groups.Equity.etfHoldings(ctx(), { symbol: 'BTC' }),
			response: {
				data: { available_periods: [], snapshots: [], symbol: 'x' },
				meta: { cached: false, credits_used: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/equity/etf/holdings',
			query: { symbol: 'BTC' },
		},
		{
			name: 'equity.filings',
			run: () => groups.Equity.filings(ctx(), { symbol: 'BTC' }),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/equity/filings',
			query: { symbol: 'BTC' },
		},
		{
			name: 'equity.incomeStatement',
			run: () => groups.Equity.incomeStatement(ctx(), { symbol: 'BTC' }),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/equity/income-statement',
			query: { symbol: 'BTC' },
		},
		{
			name: 'equity.latestFilings',
			run: () => groups.Equity.latestFilings(ctx(), {}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/equity/latest-filings',
		},
		{
			name: 'equity.latestFinancials',
			run: () => groups.Equity.latestFinancials(ctx(), {}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/equity/latest-financials',
		},
		{
			name: 'equity.listings',
			run: () => groups.Equity.listings(ctx(), { symbol: 'BTC' }),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/equity/listings',
			query: { symbol: 'BTC' },
		},
		{
			name: 'equity.meta',
			run: () => groups.Equity.meta(ctx(), { symbol: 'BTC' }),
			response: { data: [], meta: { cached: false, credits_used: 0 } },
			method: 'GET',
			url: '/gateway/v1/equity/meta',
			query: { symbol: 'BTC' },
		},
		{
			name: 'equity.metrics',
			run: () => groups.Equity.metrics(ctx(), { symbol: 'BTC' }),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/equity/metrics',
			query: { symbol: 'BTC' },
		},
		{
			name: 'equity.overview',
			run: () => groups.Equity.overview(ctx(), { symbol: 'BTC' }),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/equity/overview',
			query: { symbol: 'BTC' },
		},
		{
			name: 'equity.profile',
			run: () => groups.Equity.profile(ctx(), { symbol: 'BTC' }),
			response: {
				data: {
					company_name: 'x',
					exchange: 'x',
					is_active: false,
					symbol: 'x',
				},
				meta: { cached: false, credits_used: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/equity/profile',
			query: { symbol: 'BTC' },
		},
		{
			name: 'equity.segments',
			run: () => groups.Equity.segments(ctx(), { symbol: 'BTC' }),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/equity/segments',
			query: { symbol: 'BTC' },
		},
		{
			name: 'exchange.candles',
			run: () =>
				groups.Exchange.candles(ctx(), { exchange: 'bithumb', pair: 'x' }),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/exchange/candles',
			query: { exchange: 'bithumb', pair: 'x' },
		},
		{
			name: 'exchange.coverage',
			run: () => groups.Exchange.coverage(ctx(), {}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/exchange/coverage',
		},
		{
			name: 'exchange.depth',
			run: () => groups.Exchange.depth(ctx(), { pair: 'x' }),
			response: { data: [], meta: { cached: false, credits_used: 0 } },
			method: 'GET',
			url: '/gateway/v1/exchange/depth',
			query: { pair: 'x' },
		},
		{
			name: 'exchange.fundingHistory',
			run: () => groups.Exchange.fundingHistory(ctx(), { pair: 'x' }),
			response: { data: [], meta: { cached: false, credits_used: 0 } },
			method: 'GET',
			url: '/gateway/v1/exchange/funding-history',
			query: { pair: 'x' },
		},
		{
			name: 'exchange.klines',
			run: () => groups.Exchange.klines(ctx(), { pair: 'x' }),
			response: { data: [], meta: { cached: false, credits_used: 0 } },
			method: 'GET',
			url: '/gateway/v1/exchange/klines',
			query: { pair: 'x' },
		},
		{
			name: 'exchange.longShortRatio',
			run: () => groups.Exchange.longShortRatio(ctx(), { pair: 'x' }),
			response: { data: [], meta: { cached: false, credits_used: 0 } },
			method: 'GET',
			url: '/gateway/v1/exchange/long-short-ratio',
			query: { pair: 'x' },
		},
		{
			name: 'exchange.markets',
			run: () => groups.Exchange.markets(ctx(), {}),
			response: { data: [], meta: { cached: false, credits_used: 0 } },
			method: 'GET',
			url: '/gateway/v1/exchange/markets',
		},
		{
			name: 'exchange.perp',
			run: () => groups.Exchange.perp(ctx(), { pair: 'x' }),
			response: {
				data: {
					exchange: 'x',
					funding: {
						exchange: 'x',
						funding_interval_hours: 0,
						funding_rate: 0,
						index_price: 0,
						interval: null,
						mark_price: 0,
						next_funding: null,
						pair: 'x',
					},
					open_interest: {
						exchange: 'x',
						open_interest_amount: 0,
						open_interest_usd: 0,
						pair: 'x',
						timestamp: 0,
					},
					pair: 'x',
				},
				meta: { cached: false, credits_used: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/exchange/perp',
			query: { pair: 'x' },
		},
		{
			name: 'exchange.price',
			run: () => groups.Exchange.price(ctx(), { pair: 'x' }),
			response: { data: [], meta: { cached: false, credits_used: 0 } },
			method: 'GET',
			url: '/gateway/v1/exchange/price',
			query: { pair: 'x' },
		},
		{
			name: 'fund.detail',
			run: () => groups.Fund.detail(ctx(), {}),
			response: {
				data: {
					id: 'x',
					invested_projects_count: 0,
					links: [],
					members: [],
					name: 'x',
					recent_researches: [],
					tier: 0,
					x_accounts: [],
				},
				meta: { cached: false, credits_used: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/fund/detail',
		},
		{
			name: 'fund.portfolio',
			run: () => groups.Fund.portfolio(ctx(), {}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/fund/portfolio',
		},
		{
			name: 'fund.ranking',
			run: () => groups.Fund.ranking(ctx(), { metric: 'tier' }),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/fund/ranking',
			query: { metric: 'tier' },
		},
		{
			name: 'heatscore.detail',
			run: () => groups.Heatscore.detail(ctx(), {}),
			response: {
				data: { core_state: {}, heat_dimensions: {}, price_change_percent: {} },
				meta: { cached: false, credits_used: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/heatscore/detail',
		},
		{
			name: 'heatscore.projects',
			run: () => groups.Heatscore.projects(ctx(), {}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/heatscore/projects',
		},
		{
			name: 'heatscore.tokenOfTheDay',
			run: () => groups.Heatscore.tokenOfTheDay(ctx(), {}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/heatscore/token-of-the-day',
		},
		{
			name: 'heatscore.tokenOfWeek',
			run: () => groups.Heatscore.tokenOfWeek(ctx(), {}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/heatscore/token-of-week',
		},
		{
			name: 'hyperliquid.account',
			run: () =>
				groups.Hyperliquid.account(ctx(), {
					address: '0x0000000000000000000000000000000000000001',
				}),
			response: {
				data: { address: 'x', as_of: 0, unpriced_token_count: 0 },
				meta: { cached: false, credits_used: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/hyperliquid/account',
			query: { address: '0x0000000000000000000000000000000000000001' },
		},
		{
			name: 'hyperliquid.candles',
			run: () =>
				groups.Hyperliquid.candles(ctx(), {
					symbol: 'BTC',
					from: 'x',
					to: 'x',
				}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/hyperliquid/candles',
			query: { symbol: 'BTC', from: 'x', to: 'x' },
		},
		{
			name: 'hyperliquid.fills',
			run: () =>
				groups.Hyperliquid.fills(ctx(), {
					address: '0x0000000000000000000000000000000000000001',
				}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, has_more: false, limit: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/hyperliquid/fills',
			query: { address: '0x0000000000000000000000000000000000000001' },
		},
		{
			name: 'hyperliquid.leaderboard',
			run: () => groups.Hyperliquid.leaderboard(ctx(), {}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/hyperliquid/leaderboard',
		},
		{
			name: 'hyperliquid.orders',
			run: () =>
				groups.Hyperliquid.orders(ctx(), {
					address: '0x0000000000000000000000000000000000000001',
				}),
			response: {
				data: {
					address: 'x',
					as_of: 0,
					historical: [],
					historical_total: 0,
					open: [],
					open_total: 0,
				},
				meta: { cached: false, credits_used: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/hyperliquid/orders',
			query: { address: '0x0000000000000000000000000000000000000001' },
		},
		{
			name: 'hyperliquid.performance',
			run: () =>
				groups.Hyperliquid.performance(ctx(), {
					address: '0x0000000000000000000000000000000000000001',
				}),
			response: {
				data: {
					address: 'x',
					open_positions: [],
					partial: false,
					traded_pairs: 0,
					watermark: 0,
				},
				meta: { cached: false, credits_used: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/hyperliquid/performance',
			query: { address: '0x0000000000000000000000000000000000000001' },
		},
		{
			name: 'hyperliquid.positions',
			run: () =>
				groups.Hyperliquid.positions(ctx(), {
					address: '0x0000000000000000000000000000000000000001',
				}),
			response: {
				data: {
					account_value: 0,
					address: 'x',
					cross_maintenance_margin_used: 0,
					margin_ratio: 0,
					positions: [],
					timestamp: 0,
					total_margin_used: 0,
					total_notional_pos: 0,
					total_raw_usd: 0,
					withdrawable: 0,
				},
				meta: { cached: false, credits_used: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/hyperliquid/positions',
			query: { address: '0x0000000000000000000000000000000000000001' },
		},
		{
			name: 'hyperliquid.trades',
			run: () =>
				groups.Hyperliquid.trades(ctx(), {
					address: '0x0000000000000000000000000000000000000001',
				}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, has_more: false, limit: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/hyperliquid/trades',
			query: { address: '0x0000000000000000000000000000000000000001' },
		},
		{
			name: 'hyperliquid.tradesAggregate',
			run: () =>
				groups.Hyperliquid.tradesAggregate(ctx(), {
					address: '0x0000000000000000000000000000000000000001',
				}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/hyperliquid/trades/aggregate',
			query: { address: '0x0000000000000000000000000000000000000001' },
		},
		{
			name: 'hyperliquid.tradesContext',
			run: () =>
				groups.Hyperliquid.tradesContext(ctx(), {
					address: '0x0000000000000000000000000000000000000001',
					symbol: 'BTC',
					direction: 'long',
					open_time: 1,
					close_time: 1,
				}),
			response: {
				data: { funding_status: 'complete' },
				meta: { cached: false, credits_used: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/hyperliquid/trades/context',
			query: {
				address: '0x0000000000000000000000000000000000000001',
				symbol: 'BTC',
				direction: 'long',
				open_time: 1,
				close_time: 1,
			},
		},
		{
			name: 'market.etf',
			run: () => groups.Market.etf(ctx(), { symbol: 'BTC' }),
			response: { data: [], meta: { cached: false, credits_used: 0 } },
			method: 'GET',
			url: '/gateway/v1/market/etf',
			query: { symbol: 'BTC' },
		},
		{
			name: 'market.exchangeFlowExchanges',
			run: () => groups.Market.exchangeFlowExchanges(ctx(), { symbol: 'BTC' }),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/market/exchange-flow/exchanges',
			query: { symbol: 'BTC' },
		},
		{
			name: 'market.fearGreed',
			run: () => groups.Market.fearGreed(ctx(), {}),
			response: { data: [], meta: { cached: false, credits_used: 0 } },
			method: 'GET',
			url: '/gateway/v1/market/fear-greed',
		},
		{
			name: 'market.futures',
			run: () => groups.Market.futures(ctx(), {}),
			response: { data: [], meta: { cached: false, credits_used: 0 } },
			method: 'GET',
			url: '/gateway/v1/market/futures',
		},
		{
			name: 'market.liquidationChart',
			run: () => groups.Market.liquidationChart(ctx(), { symbol: 'BTC' }),
			response: { data: [], meta: { cached: false, credits_used: 0 } },
			method: 'GET',
			url: '/gateway/v1/market/liquidation/chart',
			query: { symbol: 'BTC' },
		},
		{
			name: 'market.liquidationExchangeList',
			run: () => groups.Market.liquidationExchangeList(ctx(), {}),
			response: { data: [], meta: { cached: false, credits_used: 0 } },
			method: 'GET',
			url: '/gateway/v1/market/liquidation/exchange-list',
		},
		{
			name: 'market.liquidationOrder',
			run: () => groups.Market.liquidationOrder(ctx(), {}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/market/liquidation/order',
		},
		{
			name: 'market.listing',
			run: () => groups.Market.listing(ctx(), { from: 'x' }),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/market/listing',
			query: { from: 'x' },
		},
		{
			name: 'market.onchainIndicator',
			run: () =>
				groups.Market.onchainIndicator(ctx(), {
					symbol: 'BTC',
					metric: 'nupl',
				}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/market/onchain-indicator',
			query: { symbol: 'BTC', metric: 'nupl' },
		},
		{
			name: 'market.options',
			run: () => groups.Market.options(ctx(), { symbol: 'BTC' }),
			response: { data: [], meta: { cached: false, credits_used: 0 } },
			method: 'GET',
			url: '/gateway/v1/market/options',
			query: { symbol: 'BTC' },
		},
		{
			name: 'market.price',
			run: () => groups.Market.price(ctx(), { symbol: 'BTC' }),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0 },
				summary: {
					change_abs: 0,
					change_pct: 0,
					first: 0,
					high: 0,
					last: 0,
					latest_dt: 0,
					low: 0,
					n_points: 0,
				},
			},
			method: 'GET',
			url: '/gateway/v1/market/price',
			query: { symbol: 'BTC' },
		},
		{
			name: 'market.priceIndicator',
			run: () =>
				groups.Market.priceIndicator(ctx(), {
					indicator: 'rsi',
					symbol: 'BTC',
				}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/market/price-indicator',
			query: { indicator: 'rsi', symbol: 'BTC' },
		},
		{
			name: 'market.publicSale',
			run: () => groups.Market.publicSale(ctx(), {}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/market/public-sale',
		},
		{
			name: 'market.ranking',
			run: () => groups.Market.ranking(ctx(), {}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/market/ranking',
		},
		{
			name: 'market.tge',
			run: () => groups.Market.tge(ctx(), {}),
			response: {
				data: { current_status: 'x', project_id: 'x' },
				meta: { cached: false, credits_used: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/market/tge',
		},
		{
			name: 'news.detail',
			run: () => groups.News.detail(ctx(), { id: 'x' }),
			response: {
				data: { content: 'x', id: 'x', published_at: 0, title: 'x' },
				meta: { cached: false, credits_used: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/news/detail',
			query: { id: 'x' },
		},
		{
			name: 'news.feed',
			run: () => groups.News.feed(ctx(), {}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/news/feed',
		},
		{
			name: 'onchain.bridgeRanking',
			run: () => groups.Onchain.bridgeRanking(ctx(), {}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/onchain/bridge/ranking',
		},
		{
			name: 'onchain.dexActivity',
			run: () => groups.Onchain.dexActivity(ctx(), { chain: 'ethereum' }),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/onchain/dex/activity',
			query: { chain: 'ethereum' },
		},
		{
			name: 'onchain.gasPrice',
			run: () => groups.Onchain.gasPrice(ctx(), { chain: 'ethereum' }),
			response: {
				data: { chain: 'x', gas_price: 'x', gas_price_gwei: 0 },
				meta: { cached: false, credits_used: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/onchain/gas-price',
			query: { chain: 'ethereum' },
		},
		{
			name: 'onchain.query',
			run: () => groups.Onchain.query(ctx(), { source: 'x' }),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'POST',
			url: '/gateway/v1/onchain/query',
			body: { source: 'x' },
		},
		{
			name: 'onchain.schema',
			run: () => groups.Onchain.schema(ctx(), {}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/onchain/schema',
		},
		{
			name: 'onchain.sql',
			run: () => groups.Onchain.sql(ctx(), { sql: 'select 1' }),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'POST',
			url: '/gateway/v1/onchain/sql',
			body: { sql: 'select 1' },
		},
		{
			name: 'onchain.sqlJobs',
			run: () => groups.Onchain.sqlJobs(ctx(), { sql: 'select 1' }),
			response: {
				data: {
					cancellation_requested: false,
					created_at: 0,
					elapsed_ms: 0,
					executed_sql: 'x',
					expires_at: 0,
					job_id: 'x',
					max_rows: 0,
					parameters: {},
					processed_bytes: 0,
					processed_rows: 0,
					query_id: 'x',
					recommended_action: 'x',
					request_id: 'x',
					retryable: false,
					sql: 'x',
					status: 'queued',
				},
				meta: { cached: false, credits_used: 0 },
			},
			method: 'POST',
			url: '/gateway/v1/onchain/sql/jobs',
			body: { sql: 'select 1' },
		},
		{
			name: 'onchain.sqlJobsJobId',
			run: () =>
				groups.Onchain.sqlJobsJobId(ctx(), {
					job_id: '00000000-0000-4000-8000-000000000001',
				}),
			response: {
				data: {
					cancellation_requested: false,
					created_at: 0,
					elapsed_ms: 0,
					executed_sql: 'x',
					expires_at: 0,
					job_id: 'x',
					max_rows: 0,
					parameters: {},
					processed_bytes: 0,
					processed_rows: 0,
					query_id: 'x',
					recommended_action: 'x',
					request_id: 'x',
					retryable: false,
					sql: 'x',
					status: 'queued',
				},
				meta: { cached: false, credits_used: 0 },
			},
			method: 'DELETE',
			url: '/gateway/v1/onchain/sql/jobs/{job_id}',
			path: { job_id: '00000000-0000-4000-8000-000000000001' },
		},
		{
			name: 'onchain.getSqlJobsJobId',
			run: () =>
				groups.Onchain.getSqlJobsJobId(ctx(), {
					job_id: '00000000-0000-4000-8000-000000000001',
				}),
			response: {
				data: {
					cancellation_requested: false,
					created_at: 0,
					elapsed_ms: 0,
					executed_sql: 'x',
					expires_at: 0,
					job_id: 'x',
					max_rows: 0,
					parameters: {},
					processed_bytes: 0,
					processed_rows: 0,
					query_id: 'x',
					recommended_action: 'x',
					request_id: 'x',
					retryable: false,
					sql: 'x',
					status: 'queued',
				},
				meta: { cached: false, credits_used: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/onchain/sql/jobs/{job_id}',
			path: { job_id: '00000000-0000-4000-8000-000000000001' },
		},
		{
			name: 'onchain.sqlJobsJobIdResults',
			run: () =>
				groups.Onchain.sqlJobsJobIdResults(ctx(), {
					job_id: '00000000-0000-4000-8000-000000000001',
				}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/onchain/sql/jobs/{job_id}/results',
			path: { job_id: '00000000-0000-4000-8000-000000000001' },
		},
		{
			name: 'onchain.sqlPreflight',
			run: () => groups.Onchain.sqlPreflight(ctx(), { sql: 'select 1' }),
			response: {
				data: {
					accepted: false,
					budget: {
						max_bytes_to_read: 0,
						max_execution_time_seconds: 0,
						max_rows_to_read: 0,
					},
					estimate: { by_table: [], bytes: 0, marks: 0, parts: 0, rows: 0 },
					executed_sql: 'x',
					query_id: 'x',
					request_id: 'x',
					sql: 'x',
					tables: [],
					warnings: [],
				},
				meta: { cached: false, credits_used: 0 },
			},
			method: 'POST',
			url: '/gateway/v1/onchain/sql/preflight',
			body: { sql: 'select 1' },
		},
		{
			name: 'onchain.tx',
			run: () => groups.Onchain.tx(ctx(), { hash: 'x', chain: 'ethereum' }),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/onchain/tx',
			query: { hash: 'x', chain: 'ethereum' },
		},
		{
			name: 'onchain.yieldRanking',
			run: () => groups.Onchain.yieldRanking(ctx(), {}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/onchain/yield/ranking',
		},
		{
			name: 'portfolio.wallets',
			run: () => groups.Portfolio.wallets(ctx(), {}),
			response: {
				data: { wallets: [] },
				meta: { cached: false, credits_used: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/portfolio/wallets',
		},
		{
			name: 'predictionMarket.analytics',
			run: () => groups.PredictionMarket.analytics(ctx(), {}),
			response: {
				data: {
					category_trends: [],
					momentum_markets: [],
					momentum_summary: {
						confirming_down: 0,
						confirming_up: 0,
						diverging_down: 0,
						diverging_up: 0,
						neutral: 0,
						total_active: 0,
						volume_decreasing: 0,
						volume_increasing: 0,
					},
					top_markets: [],
				},
				meta: { cached: false, credits_used: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/prediction-market/analytics',
		},
		{
			name: 'predictionMarket.correlations',
			run: () =>
				groups.PredictionMarket.correlations(ctx(), { category: 'crypto' }),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/prediction-market/correlations',
			query: { category: 'crypto' },
		},
		{
			name: 'predictionMarket.kalshiEvents',
			run: () => groups.PredictionMarket.kalshiEvents(ctx(), {}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/prediction-market/kalshi/events',
		},
		{
			name: 'predictionMarket.kalshiMarkets',
			run: () => groups.PredictionMarket.kalshiMarkets(ctx(), {}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/prediction-market/kalshi/markets',
		},
		{
			name: 'predictionMarket.kalshiOpenInterest',
			run: () =>
				groups.PredictionMarket.kalshiOpenInterest(ctx(), { ticker: 'x' }),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/prediction-market/kalshi/open-interest',
			query: { ticker: 'x' },
		},
		{
			name: 'predictionMarket.kalshiOrderbooks',
			run: () =>
				groups.PredictionMarket.kalshiOrderbooks(ctx(), { ticker: 'x' }),
			response: {
				pagination: { count: 0, has_more: false, limit: 0 },
				snapshots: [],
			},
			method: 'GET',
			url: '/gateway/v1/prediction-market/kalshi/orderbooks',
			query: { ticker: 'x' },
		},
		{
			name: 'predictionMarket.kalshiPrices',
			run: () => groups.PredictionMarket.kalshiPrices(ctx(), { ticker: 'x' }),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/prediction-market/kalshi/prices',
			query: { ticker: 'x' },
		},
		{
			name: 'predictionMarket.kalshiTrades',
			run: () => groups.PredictionMarket.kalshiTrades(ctx(), { ticker: 'x' }),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/prediction-market/kalshi/trades',
			query: { ticker: 'x' },
		},
		{
			name: 'predictionMarket.kalshiVolumes',
			run: () => groups.PredictionMarket.kalshiVolumes(ctx(), { ticker: 'x' }),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/prediction-market/kalshi/volumes',
			query: { ticker: 'x' },
		},
		{
			name: 'predictionMarket.matchingDaily',
			run: () =>
				groups.PredictionMarket.matchingDaily(ctx(), {
					polymarket_condition_id: '00000000-0000-4000-8000-000000000001',
					kalshi_market_ticker: 'x',
				}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/prediction-market/matching/daily',
			query: {
				polymarket_condition_id: '00000000-0000-4000-8000-000000000001',
				kalshi_market_ticker: 'x',
			},
		},
		{
			name: 'predictionMarket.matchingPairs',
			run: () => groups.PredictionMarket.matchingPairs(ctx(), {}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/prediction-market/matching/pairs',
		},
		{
			name: 'predictionMarket.polymarketEvents',
			run: () =>
				groups.PredictionMarket.polymarketEvents(ctx(), { event_slug: 'x' }),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/prediction-market/polymarket/events',
			query: { event_slug: 'x' },
		},
		{
			name: 'predictionMarket.polymarketLeaderboard',
			run: () => groups.PredictionMarket.polymarketLeaderboard(ctx(), {}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/prediction-market/polymarket/leaderboard',
		},
		{
			name: 'predictionMarket.polymarketMarkets',
			run: () =>
				groups.PredictionMarket.polymarketMarkets(ctx(), { market_slug: 'x' }),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/prediction-market/polymarket/markets',
			query: { market_slug: 'x' },
		},
		{
			name: 'predictionMarket.polymarketOpenInterest',
			run: () =>
				groups.PredictionMarket.polymarketOpenInterest(ctx(), {
					condition_id: '00000000-0000-4000-8000-000000000001',
				}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/prediction-market/polymarket/open-interest',
			query: { condition_id: '00000000-0000-4000-8000-000000000001' },
		},
		{
			name: 'predictionMarket.polymarketOrderbooks',
			run: () =>
				groups.PredictionMarket.polymarketOrderbooks(ctx(), {
					token_id: '00000000-0000-4000-8000-000000000001',
				}),
			response: {
				pagination: { count: 0, has_more: false, limit: 0 },
				snapshots: [],
			},
			method: 'GET',
			url: '/gateway/v1/prediction-market/polymarket/orderbooks',
			query: { token_id: '00000000-0000-4000-8000-000000000001' },
		},
		{
			name: 'predictionMarket.polymarketPositions',
			run: () =>
				groups.PredictionMarket.polymarketPositions(ctx(), {
					address: '0x0000000000000000000000000000000000000001',
				}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/prediction-market/polymarket/positions',
			query: { address: '0x0000000000000000000000000000000000000001' },
		},
		{
			name: 'predictionMarket.polymarketPriceOhlcvConditionId',
			run: () =>
				groups.PredictionMarket.polymarketPriceOhlcvConditionId(ctx(), {
					condition_id: '00000000-0000-4000-8000-000000000001',
				}),
			response: { candles: [], condition_id: 'x', interval: 0 },
			method: 'GET',
			url: '/gateway/v1/prediction-market/polymarket/price-ohlcv/{condition_id}',
			path: { condition_id: '00000000-0000-4000-8000-000000000001' },
		},
		{
			name: 'predictionMarket.polymarketPrices',
			run: () =>
				groups.PredictionMarket.polymarketPrices(ctx(), {
					condition_id: '00000000-0000-4000-8000-000000000001',
				}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/prediction-market/polymarket/prices',
			query: { condition_id: '00000000-0000-4000-8000-000000000001' },
		},
		{
			name: 'predictionMarket.polymarketSmartMoney',
			run: () => groups.PredictionMarket.polymarketSmartMoney(ctx(), {}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/prediction-market/polymarket/smart-money',
		},
		{
			name: 'predictionMarket.polymarketTrades',
			run: () => groups.PredictionMarket.polymarketTrades(ctx(), {}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/prediction-market/polymarket/trades',
		},
		{
			name: 'predictionMarket.polymarketVolumeSplitConditionId',
			run: () =>
				groups.PredictionMarket.polymarketVolumeSplitConditionId(ctx(), {
					condition_id: '00000000-0000-4000-8000-000000000001',
				}),
			response: {
				condition_id: 'x',
				data_points: [],
				end_time: 0,
				granularity: 'x',
				start_time: 0,
			},
			method: 'GET',
			url: '/gateway/v1/prediction-market/polymarket/volume-split/{condition_id}',
			path: { condition_id: '00000000-0000-4000-8000-000000000001' },
		},
		{
			name: 'predictionMarket.polymarketVolumes',
			run: () => groups.PredictionMarket.polymarketVolumes(ctx(), {}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/prediction-market/polymarket/volumes',
		},
		{
			name: 'project.aiNews',
			run: () => groups.Project.aiNews(ctx(), {}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/project/ai-news',
		},
		{
			name: 'project.defiMetrics',
			run: () => groups.Project.defiMetrics(ctx(), {}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/project/defi/metrics',
		},
		{
			name: 'project.defiRanking',
			run: () => groups.Project.defiRanking(ctx(), { metric: 'tvl' }),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/project/defi/ranking',
			query: { metric: 'tvl' },
		},
		{
			name: 'project.detail',
			run: () => groups.Project.detail(ctx(), {}),
			response: { data: {}, meta: { cached: false, credits_used: 0 } },
			method: 'GET',
			url: '/gateway/v1/project/detail',
		},
		{
			name: 'search.airdrop',
			run: () => groups.Search.airdrop(ctx(), {}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/search/airdrop',
		},
		{
			name: 'search.airdropActivities',
			run: () => groups.Search.airdropActivities(ctx(), {}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/search/airdrop/activities',
		},
		{
			name: 'search.events',
			run: () => groups.Search.events(ctx(), {}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/search/events',
		},
		{
			name: 'search.fund',
			run: () => groups.Search.fund(ctx(), { q: 'bitcoin' }),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/search/fund',
			query: { q: 'bitcoin' },
		},
		{
			name: 'search.fundraising',
			run: () => groups.Search.fundraising(ctx(), {}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/search/fundraising',
		},
		{
			name: 'search.news',
			run: () => groups.Search.news(ctx(), { q: 'bitcoin' }),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/search/news',
			query: { q: 'bitcoin' },
		},
		{
			name: 'search.predictionMarket',
			run: () => groups.Search.predictionMarket(ctx(), {}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/search/prediction-market',
		},
		{
			name: 'search.project',
			run: () => groups.Search.project(ctx(), { q: 'bitcoin' }),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/search/project',
			query: { q: 'bitcoin' },
		},
		{
			name: 'search.token',
			run: () => groups.Search.token(ctx(), { q: 'bitcoin' }),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/search/token',
			query: { q: 'bitcoin' },
		},
		{
			name: 'search.wallet',
			run: () => groups.Search.wallet(ctx(), { q: 'bitcoin' }),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/search/wallet',
			query: { q: 'bitcoin' },
		},
		{
			name: 'search.web',
			run: () => groups.Search.web(ctx(), { q: 'bitcoin' }),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/search/web',
			query: { q: 'bitcoin' },
		},
		{
			name: 'token.dexTrades',
			run: () =>
				groups.Token.dexTrades(ctx(), {
					address: '0x0000000000000000000000000000000000000001',
				}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/token/dex-trades',
			query: { address: '0x0000000000000000000000000000000000000001' },
		},
		{
			name: 'token.holders',
			run: () =>
				groups.Token.holders(ctx(), {
					address: '0x0000000000000000000000000000000000000001',
					chain: 'ethereum',
				}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/token/holders',
			query: {
				address: '0x0000000000000000000000000000000000000001',
				chain: 'ethereum',
			},
		},
		{
			name: 'token.tokenomics',
			run: () => groups.Token.tokenomics(ctx(), {}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/token/tokenomics',
		},
		{
			name: 'token.transferCounterparties',
			run: () =>
				groups.Token.transferCounterparties(ctx(), {
					address: '0x0000000000000000000000000000000000000001',
					chain: 'ethereum',
					direction: 'to',
				}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/token/transfer-counterparties',
			query: {
				address: '0x0000000000000000000000000000000000000001',
				chain: 'ethereum',
				direction: 'to',
			},
		},
		{
			name: 'token.transferStats',
			run: () =>
				groups.Token.transferStats(ctx(), {
					address: '0x0000000000000000000000000000000000000001',
					chain: 'ethereum',
				}),
			response: {
				data: {
					first_transfer_at: 0,
					last_transfer_at: 0,
					total_amount: 'x',
					total_transfers: 0,
					unique_receivers: 0,
					unique_senders: 0,
				},
				meta: { cached: false, credits_used: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/token/transfer-stats',
			query: {
				address: '0x0000000000000000000000000000000000000001',
				chain: 'ethereum',
			},
		},
		{
			name: 'token.transfers',
			run: () =>
				groups.Token.transfers(ctx(), {
					address: '0x0000000000000000000000000000000000000001',
					chain: 'ethereum',
				}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/token/transfers',
			query: {
				address: '0x0000000000000000000000000000000000000001',
				chain: 'ethereum',
			},
		},
		{
			name: 'wallet.detail',
			run: () =>
				groups.Wallet.detail(ctx(), {
					address: '0x0000000000000000000000000000000000000001',
				}),
			response: { data: {}, meta: { cached: false, credits_used: 0 } },
			method: 'GET',
			url: '/gateway/v1/wallet/detail',
			query: { address: '0x0000000000000000000000000000000000000001' },
		},
		{
			name: 'wallet.history',
			run: () =>
				groups.Wallet.history(ctx(), {
					address: '0x0000000000000000000000000000000000000001',
				}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/wallet/history',
			query: { address: '0x0000000000000000000000000000000000000001' },
		},
		{
			name: 'wallet.labelsBatch',
			run: () => groups.Wallet.labelsBatch(ctx(), { addresses: 'x' }),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/wallet/labels/batch',
			query: { addresses: 'x' },
		},
		{
			name: 'wallet.netWorth',
			run: () =>
				groups.Wallet.netWorth(ctx(), {
					address: '0x0000000000000000000000000000000000000001',
				}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/wallet/net-worth',
			query: { address: '0x0000000000000000000000000000000000000001' },
		},
		{
			name: 'wallet.protocols',
			run: () =>
				groups.Wallet.protocols(ctx(), {
					address: '0x0000000000000000000000000000000000000001',
				}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/wallet/protocols',
			query: { address: '0x0000000000000000000000000000000000000001' },
		},
		{
			name: 'wallet.transfers',
			run: () =>
				groups.Wallet.transfers(ctx(), {
					address: '0x0000000000000000000000000000000000000001',
				}),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/wallet/transfers',
			query: { address: '0x0000000000000000000000000000000000000001' },
		},
		{
			name: 'web.fetch',
			run: () => groups.Web.fetch(ctx(), { url: 'x' }),
			response: {
				data: { content: 'x', url: 'x' },
				meta: { cached: false, credits_used: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/web/fetch',
			query: { url: 'x' },
		},
		{
			name: 'x.tweets',
			run: () => groups.X.tweets(ctx(), { ids: 'x' }),
			response: {
				data: [],
				meta: { cached: false, credits_used: 0, limit: 0, offset: 0 },
			},
			method: 'GET',
			url: '/gateway/v1/x/tweets',
			query: { ids: 'x' },
		},
	];

	it.each(cases)(
		'$name calls $method $url',
		async ({ run, response, method, url, query, path, body }) => {
			mockRequest.mockResolvedValue(response);
			await run();
			expect(mockRequest).toHaveBeenCalledWith(
				url,
				'x_key_test',
				expect.objectContaining({
					method,
					...(query ? { query } : {}),
					...(path ? { path } : {}),
					...(body ? { body } : {}),
				}),
			);
			expect(logEventFromContext).toHaveBeenCalled();
		},
	);
});
