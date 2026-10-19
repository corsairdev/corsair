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
		mockRequest.mockResolvedValue({ data: [] });
		jest.mocked(logEventFromContext).mockReset();
	});

	const cases: Array<{
		name: string;
		// Each case calls a different endpoint, so there is no single return type.
		run: () => Promise<unknown>;
		method: string;
		url: string;
	}> = [
		{
			name: 'dex.tokenPrice',
			run: () =>
				groups.Dex.tokenPrice(ctx(), {
					chain: 'ethereum',
					address: '0x0000000000000000000000000000000000000001',
				}),
			method: 'GET',
			url: '/gateway/v1/dex/token/price',
		},
		{
			name: 'equity.balanceSheet',
			run: () => groups.Equity.balanceSheet(ctx(), { symbol: 'BTC' }),
			method: 'GET',
			url: '/gateway/v1/equity/balance-sheet',
		},
		{
			name: 'equity.candles',
			run: () => groups.Equity.candles(ctx(), { symbol: 'BTC' }),
			method: 'GET',
			url: '/gateway/v1/equity/candles',
		},
		{
			name: 'equity.cashFlow',
			run: () => groups.Equity.cashFlow(ctx(), { symbol: 'BTC' }),
			method: 'GET',
			url: '/gateway/v1/equity/cash-flow',
		},
		{
			name: 'equity.etfHoldings',
			run: () => groups.Equity.etfHoldings(ctx(), { symbol: 'BTC' }),
			method: 'GET',
			url: '/gateway/v1/equity/etf/holdings',
		},
		{
			name: 'equity.filings',
			run: () => groups.Equity.filings(ctx(), { symbol: 'BTC' }),
			method: 'GET',
			url: '/gateway/v1/equity/filings',
		},
		{
			name: 'equity.incomeStatement',
			run: () => groups.Equity.incomeStatement(ctx(), { symbol: 'BTC' }),
			method: 'GET',
			url: '/gateway/v1/equity/income-statement',
		},
		{
			name: 'equity.latestFilings',
			run: () => groups.Equity.latestFilings(ctx(), {}),
			method: 'GET',
			url: '/gateway/v1/equity/latest-filings',
		},
		{
			name: 'equity.latestFinancials',
			run: () => groups.Equity.latestFinancials(ctx(), {}),
			method: 'GET',
			url: '/gateway/v1/equity/latest-financials',
		},
		{
			name: 'equity.listings',
			run: () => groups.Equity.listings(ctx(), { symbol: 'BTC' }),
			method: 'GET',
			url: '/gateway/v1/equity/listings',
		},
		{
			name: 'equity.meta',
			run: () => groups.Equity.meta(ctx(), { symbol: 'BTC' }),
			method: 'GET',
			url: '/gateway/v1/equity/meta',
		},
		{
			name: 'equity.metrics',
			run: () => groups.Equity.metrics(ctx(), { symbol: 'BTC' }),
			method: 'GET',
			url: '/gateway/v1/equity/metrics',
		},
		{
			name: 'equity.overview',
			run: () => groups.Equity.overview(ctx(), { symbol: 'BTC' }),
			method: 'GET',
			url: '/gateway/v1/equity/overview',
		},
		{
			name: 'equity.profile',
			run: () => groups.Equity.profile(ctx(), { symbol: 'BTC' }),
			method: 'GET',
			url: '/gateway/v1/equity/profile',
		},
		{
			name: 'equity.segments',
			run: () => groups.Equity.segments(ctx(), { symbol: 'BTC' }),
			method: 'GET',
			url: '/gateway/v1/equity/segments',
		},
		{
			name: 'exchange.candles',
			run: () =>
				groups.Exchange.candles(ctx(), { exchange: 'bithumb', pair: 'x' }),
			method: 'GET',
			url: '/gateway/v1/exchange/candles',
		},
		{
			name: 'exchange.coverage',
			run: () => groups.Exchange.coverage(ctx(), {}),
			method: 'GET',
			url: '/gateway/v1/exchange/coverage',
		},
		{
			name: 'exchange.depth',
			run: () => groups.Exchange.depth(ctx(), { pair: 'x' }),
			method: 'GET',
			url: '/gateway/v1/exchange/depth',
		},
		{
			name: 'exchange.fundingHistory',
			run: () => groups.Exchange.fundingHistory(ctx(), { pair: 'x' }),
			method: 'GET',
			url: '/gateway/v1/exchange/funding-history',
		},
		{
			name: 'exchange.klines',
			run: () => groups.Exchange.klines(ctx(), { pair: 'x' }),
			method: 'GET',
			url: '/gateway/v1/exchange/klines',
		},
		{
			name: 'exchange.longShortRatio',
			run: () => groups.Exchange.longShortRatio(ctx(), { pair: 'x' }),
			method: 'GET',
			url: '/gateway/v1/exchange/long-short-ratio',
		},
		{
			name: 'exchange.markets',
			run: () => groups.Exchange.markets(ctx(), {}),
			method: 'GET',
			url: '/gateway/v1/exchange/markets',
		},
		{
			name: 'exchange.perp',
			run: () => groups.Exchange.perp(ctx(), { pair: 'x' }),
			method: 'GET',
			url: '/gateway/v1/exchange/perp',
		},
		{
			name: 'exchange.price',
			run: () => groups.Exchange.price(ctx(), { pair: 'x' }),
			method: 'GET',
			url: '/gateway/v1/exchange/price',
		},
		{
			name: 'fund.detail',
			run: () => groups.Fund.detail(ctx(), {}),
			method: 'GET',
			url: '/gateway/v1/fund/detail',
		},
		{
			name: 'fund.portfolio',
			run: () => groups.Fund.portfolio(ctx(), {}),
			method: 'GET',
			url: '/gateway/v1/fund/portfolio',
		},
		{
			name: 'fund.ranking',
			run: () => groups.Fund.ranking(ctx(), { metric: 'tier' }),
			method: 'GET',
			url: '/gateway/v1/fund/ranking',
		},
		{
			name: 'heatscore.detail',
			run: () => groups.Heatscore.detail(ctx(), {}),
			method: 'GET',
			url: '/gateway/v1/heatscore/detail',
		},
		{
			name: 'heatscore.projects',
			run: () => groups.Heatscore.projects(ctx(), {}),
			method: 'GET',
			url: '/gateway/v1/heatscore/projects',
		},
		{
			name: 'heatscore.tokenOfTheDay',
			run: () => groups.Heatscore.tokenOfTheDay(ctx(), {}),
			method: 'GET',
			url: '/gateway/v1/heatscore/token-of-the-day',
		},
		{
			name: 'heatscore.tokenOfWeek',
			run: () => groups.Heatscore.tokenOfWeek(ctx(), {}),
			method: 'GET',
			url: '/gateway/v1/heatscore/token-of-week',
		},
		{
			name: 'hyperliquid.account',
			run: () =>
				groups.Hyperliquid.account(ctx(), {
					address: '0x0000000000000000000000000000000000000001',
				}),
			method: 'GET',
			url: '/gateway/v1/hyperliquid/account',
		},
		{
			name: 'hyperliquid.candles',
			run: () =>
				groups.Hyperliquid.candles(ctx(), {
					symbol: 'BTC',
					from: 'x',
					to: 'x',
				}),
			method: 'GET',
			url: '/gateway/v1/hyperliquid/candles',
		},
		{
			name: 'hyperliquid.fills',
			run: () =>
				groups.Hyperliquid.fills(ctx(), {
					address: '0x0000000000000000000000000000000000000001',
				}),
			method: 'GET',
			url: '/gateway/v1/hyperliquid/fills',
		},
		{
			name: 'hyperliquid.leaderboard',
			run: () => groups.Hyperliquid.leaderboard(ctx(), {}),
			method: 'GET',
			url: '/gateway/v1/hyperliquid/leaderboard',
		},
		{
			name: 'hyperliquid.orders',
			run: () =>
				groups.Hyperliquid.orders(ctx(), {
					address: '0x0000000000000000000000000000000000000001',
				}),
			method: 'GET',
			url: '/gateway/v1/hyperliquid/orders',
		},
		{
			name: 'hyperliquid.performance',
			run: () =>
				groups.Hyperliquid.performance(ctx(), {
					address: '0x0000000000000000000000000000000000000001',
				}),
			method: 'GET',
			url: '/gateway/v1/hyperliquid/performance',
		},
		{
			name: 'hyperliquid.positions',
			run: () =>
				groups.Hyperliquid.positions(ctx(), {
					address: '0x0000000000000000000000000000000000000001',
				}),
			method: 'GET',
			url: '/gateway/v1/hyperliquid/positions',
		},
		{
			name: 'hyperliquid.trades',
			run: () =>
				groups.Hyperliquid.trades(ctx(), {
					address: '0x0000000000000000000000000000000000000001',
				}),
			method: 'GET',
			url: '/gateway/v1/hyperliquid/trades',
		},
		{
			name: 'hyperliquid.tradesAggregate',
			run: () =>
				groups.Hyperliquid.tradesAggregate(ctx(), {
					address: '0x0000000000000000000000000000000000000001',
				}),
			method: 'GET',
			url: '/gateway/v1/hyperliquid/trades/aggregate',
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
			method: 'GET',
			url: '/gateway/v1/hyperliquid/trades/context',
		},
		{
			name: 'market.etf',
			run: () => groups.Market.etf(ctx(), { symbol: 'BTC' }),
			method: 'GET',
			url: '/gateway/v1/market/etf',
		},
		{
			name: 'market.exchangeFlowExchanges',
			run: () => groups.Market.exchangeFlowExchanges(ctx(), { symbol: 'BTC' }),
			method: 'GET',
			url: '/gateway/v1/market/exchange-flow/exchanges',
		},
		{
			name: 'market.fearGreed',
			run: () => groups.Market.fearGreed(ctx(), {}),
			method: 'GET',
			url: '/gateway/v1/market/fear-greed',
		},
		{
			name: 'market.futures',
			run: () => groups.Market.futures(ctx(), {}),
			method: 'GET',
			url: '/gateway/v1/market/futures',
		},
		{
			name: 'market.liquidationChart',
			run: () => groups.Market.liquidationChart(ctx(), { symbol: 'BTC' }),
			method: 'GET',
			url: '/gateway/v1/market/liquidation/chart',
		},
		{
			name: 'market.liquidationExchangeList',
			run: () => groups.Market.liquidationExchangeList(ctx(), {}),
			method: 'GET',
			url: '/gateway/v1/market/liquidation/exchange-list',
		},
		{
			name: 'market.liquidationOrder',
			run: () => groups.Market.liquidationOrder(ctx(), {}),
			method: 'GET',
			url: '/gateway/v1/market/liquidation/order',
		},
		{
			name: 'market.listing',
			run: () => groups.Market.listing(ctx(), { from: 'x' }),
			method: 'GET',
			url: '/gateway/v1/market/listing',
		},
		{
			name: 'market.onchainIndicator',
			run: () =>
				groups.Market.onchainIndicator(ctx(), {
					symbol: 'BTC',
					metric: 'nupl',
				}),
			method: 'GET',
			url: '/gateway/v1/market/onchain-indicator',
		},
		{
			name: 'market.options',
			run: () => groups.Market.options(ctx(), { symbol: 'BTC' }),
			method: 'GET',
			url: '/gateway/v1/market/options',
		},
		{
			name: 'market.price',
			run: () => groups.Market.price(ctx(), { symbol: 'BTC' }),
			method: 'GET',
			url: '/gateway/v1/market/price',
		},
		{
			name: 'market.priceIndicator',
			run: () =>
				groups.Market.priceIndicator(ctx(), {
					indicator: 'rsi',
					symbol: 'BTC',
				}),
			method: 'GET',
			url: '/gateway/v1/market/price-indicator',
		},
		{
			name: 'market.publicSale',
			run: () => groups.Market.publicSale(ctx(), {}),
			method: 'GET',
			url: '/gateway/v1/market/public-sale',
		},
		{
			name: 'market.ranking',
			run: () => groups.Market.ranking(ctx(), {}),
			method: 'GET',
			url: '/gateway/v1/market/ranking',
		},
		{
			name: 'market.tge',
			run: () => groups.Market.tge(ctx(), {}),
			method: 'GET',
			url: '/gateway/v1/market/tge',
		},
		{
			name: 'news.detail',
			run: () => groups.News.detail(ctx(), { id: 'x' }),
			method: 'GET',
			url: '/gateway/v1/news/detail',
		},
		{
			name: 'news.feed',
			run: () => groups.News.feed(ctx(), {}),
			method: 'GET',
			url: '/gateway/v1/news/feed',
		},
		{
			name: 'onchain.bridgeRanking',
			run: () => groups.Onchain.bridgeRanking(ctx(), {}),
			method: 'GET',
			url: '/gateway/v1/onchain/bridge/ranking',
		},
		{
			name: 'onchain.dexActivity',
			run: () => groups.Onchain.dexActivity(ctx(), { chain: 'ethereum' }),
			method: 'GET',
			url: '/gateway/v1/onchain/dex/activity',
		},
		{
			name: 'onchain.gasPrice',
			run: () => groups.Onchain.gasPrice(ctx(), { chain: 'ethereum' }),
			method: 'GET',
			url: '/gateway/v1/onchain/gas-price',
		},
		{
			name: 'onchain.query',
			run: () => groups.Onchain.query(ctx(), { source: 'x' }),
			method: 'POST',
			url: '/gateway/v1/onchain/query',
		},
		{
			name: 'onchain.schema',
			run: () => groups.Onchain.schema(ctx(), {}),
			method: 'GET',
			url: '/gateway/v1/onchain/schema',
		},
		{
			name: 'onchain.sql',
			run: () => groups.Onchain.sql(ctx(), { sql: 'select 1' }),
			method: 'POST',
			url: '/gateway/v1/onchain/sql',
		},
		{
			name: 'onchain.sqlJobs',
			run: () => groups.Onchain.sqlJobs(ctx(), { sql: 'select 1' }),
			method: 'POST',
			url: '/gateway/v1/onchain/sql/jobs',
		},
		{
			name: 'onchain.sqlJobsJobId',
			run: () =>
				groups.Onchain.sqlJobsJobId(ctx(), {
					job_id: '00000000-0000-4000-8000-000000000001',
				}),
			method: 'DELETE',
			url: '/gateway/v1/onchain/sql/jobs/{job_id}',
		},
		{
			name: 'onchain.getSqlJobsJobId',
			run: () =>
				groups.Onchain.getSqlJobsJobId(ctx(), {
					job_id: '00000000-0000-4000-8000-000000000001',
				}),
			method: 'GET',
			url: '/gateway/v1/onchain/sql/jobs/{job_id}',
		},
		{
			name: 'onchain.sqlJobsJobIdResults',
			run: () =>
				groups.Onchain.sqlJobsJobIdResults(ctx(), {
					job_id: '00000000-0000-4000-8000-000000000001',
				}),
			method: 'GET',
			url: '/gateway/v1/onchain/sql/jobs/{job_id}/results',
		},
		{
			name: 'onchain.sqlPreflight',
			run: () => groups.Onchain.sqlPreflight(ctx(), { sql: 'select 1' }),
			method: 'POST',
			url: '/gateway/v1/onchain/sql/preflight',
		},
		{
			name: 'onchain.tx',
			run: () => groups.Onchain.tx(ctx(), { hash: 'x', chain: 'ethereum' }),
			method: 'GET',
			url: '/gateway/v1/onchain/tx',
		},
		{
			name: 'onchain.yieldRanking',
			run: () => groups.Onchain.yieldRanking(ctx(), {}),
			method: 'GET',
			url: '/gateway/v1/onchain/yield/ranking',
		},
		{
			name: 'portfolio.wallets',
			run: () => groups.Portfolio.wallets(ctx(), {}),
			method: 'GET',
			url: '/gateway/v1/portfolio/wallets',
		},
		{
			name: 'predictionMarket.analytics',
			run: () => groups.PredictionMarket.analytics(ctx(), {}),
			method: 'GET',
			url: '/gateway/v1/prediction-market/analytics',
		},
		{
			name: 'predictionMarket.correlations',
			run: () =>
				groups.PredictionMarket.correlations(ctx(), { category: 'crypto' }),
			method: 'GET',
			url: '/gateway/v1/prediction-market/correlations',
		},
		{
			name: 'predictionMarket.kalshiEvents',
			run: () => groups.PredictionMarket.kalshiEvents(ctx(), {}),
			method: 'GET',
			url: '/gateway/v1/prediction-market/kalshi/events',
		},
		{
			name: 'predictionMarket.kalshiMarkets',
			run: () => groups.PredictionMarket.kalshiMarkets(ctx(), {}),
			method: 'GET',
			url: '/gateway/v1/prediction-market/kalshi/markets',
		},
		{
			name: 'predictionMarket.kalshiOpenInterest',
			run: () =>
				groups.PredictionMarket.kalshiOpenInterest(ctx(), { ticker: 'x' }),
			method: 'GET',
			url: '/gateway/v1/prediction-market/kalshi/open-interest',
		},
		{
			name: 'predictionMarket.kalshiOrderbooks',
			run: () =>
				groups.PredictionMarket.kalshiOrderbooks(ctx(), { ticker: 'x' }),
			method: 'GET',
			url: '/gateway/v1/prediction-market/kalshi/orderbooks',
		},
		{
			name: 'predictionMarket.kalshiPrices',
			run: () => groups.PredictionMarket.kalshiPrices(ctx(), { ticker: 'x' }),
			method: 'GET',
			url: '/gateway/v1/prediction-market/kalshi/prices',
		},
		{
			name: 'predictionMarket.kalshiTrades',
			run: () => groups.PredictionMarket.kalshiTrades(ctx(), { ticker: 'x' }),
			method: 'GET',
			url: '/gateway/v1/prediction-market/kalshi/trades',
		},
		{
			name: 'predictionMarket.kalshiVolumes',
			run: () => groups.PredictionMarket.kalshiVolumes(ctx(), { ticker: 'x' }),
			method: 'GET',
			url: '/gateway/v1/prediction-market/kalshi/volumes',
		},
		{
			name: 'predictionMarket.matchingDaily',
			run: () =>
				groups.PredictionMarket.matchingDaily(ctx(), {
					polymarket_condition_id: '00000000-0000-4000-8000-000000000001',
					kalshi_market_ticker: 'x',
				}),
			method: 'GET',
			url: '/gateway/v1/prediction-market/matching/daily',
		},
		{
			name: 'predictionMarket.matchingPairs',
			run: () => groups.PredictionMarket.matchingPairs(ctx(), {}),
			method: 'GET',
			url: '/gateway/v1/prediction-market/matching/pairs',
		},
		{
			name: 'predictionMarket.polymarketEvents',
			run: () =>
				groups.PredictionMarket.polymarketEvents(ctx(), { event_slug: 'x' }),
			method: 'GET',
			url: '/gateway/v1/prediction-market/polymarket/events',
		},
		{
			name: 'predictionMarket.polymarketLeaderboard',
			run: () => groups.PredictionMarket.polymarketLeaderboard(ctx(), {}),
			method: 'GET',
			url: '/gateway/v1/prediction-market/polymarket/leaderboard',
		},
		{
			name: 'predictionMarket.polymarketMarkets',
			run: () =>
				groups.PredictionMarket.polymarketMarkets(ctx(), { market_slug: 'x' }),
			method: 'GET',
			url: '/gateway/v1/prediction-market/polymarket/markets',
		},
		{
			name: 'predictionMarket.polymarketOpenInterest',
			run: () =>
				groups.PredictionMarket.polymarketOpenInterest(ctx(), {
					condition_id: '00000000-0000-4000-8000-000000000001',
				}),
			method: 'GET',
			url: '/gateway/v1/prediction-market/polymarket/open-interest',
		},
		{
			name: 'predictionMarket.polymarketOrderbooks',
			run: () =>
				groups.PredictionMarket.polymarketOrderbooks(ctx(), {
					token_id: '00000000-0000-4000-8000-000000000001',
				}),
			method: 'GET',
			url: '/gateway/v1/prediction-market/polymarket/orderbooks',
		},
		{
			name: 'predictionMarket.polymarketPositions',
			run: () =>
				groups.PredictionMarket.polymarketPositions(ctx(), {
					address: '0x0000000000000000000000000000000000000001',
				}),
			method: 'GET',
			url: '/gateway/v1/prediction-market/polymarket/positions',
		},
		{
			name: 'predictionMarket.polymarketPriceOhlcvConditionId',
			run: () =>
				groups.PredictionMarket.polymarketPriceOhlcvConditionId(ctx(), {
					condition_id: '00000000-0000-4000-8000-000000000001',
				}),
			method: 'GET',
			url: '/gateway/v1/prediction-market/polymarket/price-ohlcv/{condition_id}',
		},
		{
			name: 'predictionMarket.polymarketPrices',
			run: () =>
				groups.PredictionMarket.polymarketPrices(ctx(), {
					condition_id: '00000000-0000-4000-8000-000000000001',
				}),
			method: 'GET',
			url: '/gateway/v1/prediction-market/polymarket/prices',
		},
		{
			name: 'predictionMarket.polymarketSmartMoney',
			run: () => groups.PredictionMarket.polymarketSmartMoney(ctx(), {}),
			method: 'GET',
			url: '/gateway/v1/prediction-market/polymarket/smart-money',
		},
		{
			name: 'predictionMarket.polymarketTrades',
			run: () => groups.PredictionMarket.polymarketTrades(ctx(), {}),
			method: 'GET',
			url: '/gateway/v1/prediction-market/polymarket/trades',
		},
		{
			name: 'predictionMarket.polymarketVolumeSplitConditionId',
			run: () =>
				groups.PredictionMarket.polymarketVolumeSplitConditionId(ctx(), {
					condition_id: '00000000-0000-4000-8000-000000000001',
				}),
			method: 'GET',
			url: '/gateway/v1/prediction-market/polymarket/volume-split/{condition_id}',
		},
		{
			name: 'predictionMarket.polymarketVolumes',
			run: () => groups.PredictionMarket.polymarketVolumes(ctx(), {}),
			method: 'GET',
			url: '/gateway/v1/prediction-market/polymarket/volumes',
		},
		{
			name: 'project.aiNews',
			run: () => groups.Project.aiNews(ctx(), {}),
			method: 'GET',
			url: '/gateway/v1/project/ai-news',
		},
		{
			name: 'project.defiMetrics',
			run: () => groups.Project.defiMetrics(ctx(), {}),
			method: 'GET',
			url: '/gateway/v1/project/defi/metrics',
		},
		{
			name: 'project.defiRanking',
			run: () => groups.Project.defiRanking(ctx(), { metric: 'tvl' }),
			method: 'GET',
			url: '/gateway/v1/project/defi/ranking',
		},
		{
			name: 'project.detail',
			run: () => groups.Project.detail(ctx(), {}),
			method: 'GET',
			url: '/gateway/v1/project/detail',
		},
		{
			name: 'search.airdrop',
			run: () => groups.Search.airdrop(ctx(), {}),
			method: 'GET',
			url: '/gateway/v1/search/airdrop',
		},
		{
			name: 'search.airdropActivities',
			run: () => groups.Search.airdropActivities(ctx(), {}),
			method: 'GET',
			url: '/gateway/v1/search/airdrop/activities',
		},
		{
			name: 'search.events',
			run: () => groups.Search.events(ctx(), {}),
			method: 'GET',
			url: '/gateway/v1/search/events',
		},
		{
			name: 'search.fund',
			run: () => groups.Search.fund(ctx(), { q: 'bitcoin' }),
			method: 'GET',
			url: '/gateway/v1/search/fund',
		},
		{
			name: 'search.fundraising',
			run: () => groups.Search.fundraising(ctx(), {}),
			method: 'GET',
			url: '/gateway/v1/search/fundraising',
		},
		{
			name: 'search.news',
			run: () => groups.Search.news(ctx(), { q: 'bitcoin' }),
			method: 'GET',
			url: '/gateway/v1/search/news',
		},
		{
			name: 'search.predictionMarket',
			run: () => groups.Search.predictionMarket(ctx(), {}),
			method: 'GET',
			url: '/gateway/v1/search/prediction-market',
		},
		{
			name: 'search.project',
			run: () => groups.Search.project(ctx(), { q: 'bitcoin' }),
			method: 'GET',
			url: '/gateway/v1/search/project',
		},
		{
			name: 'search.token',
			run: () => groups.Search.token(ctx(), { q: 'bitcoin' }),
			method: 'GET',
			url: '/gateway/v1/search/token',
		},
		{
			name: 'search.wallet',
			run: () => groups.Search.wallet(ctx(), { q: 'bitcoin' }),
			method: 'GET',
			url: '/gateway/v1/search/wallet',
		},
		{
			name: 'search.web',
			run: () => groups.Search.web(ctx(), { q: 'bitcoin' }),
			method: 'GET',
			url: '/gateway/v1/search/web',
		},
		{
			name: 'token.dexTrades',
			run: () =>
				groups.Token.dexTrades(ctx(), {
					address: '0x0000000000000000000000000000000000000001',
				}),
			method: 'GET',
			url: '/gateway/v1/token/dex-trades',
		},
		{
			name: 'token.holders',
			run: () =>
				groups.Token.holders(ctx(), {
					address: '0x0000000000000000000000000000000000000001',
					chain: 'ethereum',
				}),
			method: 'GET',
			url: '/gateway/v1/token/holders',
		},
		{
			name: 'token.tokenomics',
			run: () => groups.Token.tokenomics(ctx(), {}),
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
			method: 'GET',
			url: '/gateway/v1/token/transfer-counterparties',
		},
		{
			name: 'token.transferStats',
			run: () =>
				groups.Token.transferStats(ctx(), {
					address: '0x0000000000000000000000000000000000000001',
					chain: 'ethereum',
				}),
			method: 'GET',
			url: '/gateway/v1/token/transfer-stats',
		},
		{
			name: 'token.transfers',
			run: () =>
				groups.Token.transfers(ctx(), {
					address: '0x0000000000000000000000000000000000000001',
					chain: 'ethereum',
				}),
			method: 'GET',
			url: '/gateway/v1/token/transfers',
		},
		{
			name: 'wallet.detail',
			run: () =>
				groups.Wallet.detail(ctx(), {
					address: '0x0000000000000000000000000000000000000001',
				}),
			method: 'GET',
			url: '/gateway/v1/wallet/detail',
		},
		{
			name: 'wallet.history',
			run: () =>
				groups.Wallet.history(ctx(), {
					address: '0x0000000000000000000000000000000000000001',
				}),
			method: 'GET',
			url: '/gateway/v1/wallet/history',
		},
		{
			name: 'wallet.labelsBatch',
			run: () => groups.Wallet.labelsBatch(ctx(), { addresses: 'x' }),
			method: 'GET',
			url: '/gateway/v1/wallet/labels/batch',
		},
		{
			name: 'wallet.netWorth',
			run: () =>
				groups.Wallet.netWorth(ctx(), {
					address: '0x0000000000000000000000000000000000000001',
				}),
			method: 'GET',
			url: '/gateway/v1/wallet/net-worth',
		},
		{
			name: 'wallet.protocols',
			run: () =>
				groups.Wallet.protocols(ctx(), {
					address: '0x0000000000000000000000000000000000000001',
				}),
			method: 'GET',
			url: '/gateway/v1/wallet/protocols',
		},
		{
			name: 'wallet.transfers',
			run: () =>
				groups.Wallet.transfers(ctx(), {
					address: '0x0000000000000000000000000000000000000001',
				}),
			method: 'GET',
			url: '/gateway/v1/wallet/transfers',
		},
		{
			name: 'web.fetch',
			run: () => groups.Web.fetch(ctx(), { url: 'x' }),
			method: 'GET',
			url: '/gateway/v1/web/fetch',
		},
		{
			name: 'x.tweets',
			run: () => groups.X.tweets(ctx(), { ids: 'x' }),
			method: 'GET',
			url: '/gateway/v1/x/tweets',
		},
	];

	it.each(cases)('$name calls $method $url', async ({ run, method, url }) => {
		await run();
		expect(mockRequest).toHaveBeenCalledWith(
			url,
			'x_key_test',
			expect.objectContaining({ method }),
		);
		expect(logEventFromContext).toHaveBeenCalled();
	});
});
