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
} from './index';
import { SurfEndpointInputSchemas, SurfEndpointOutputSchemas } from './types';

export const surfEndpointsNested = {
	dex: {
		tokenPrice: Dex.tokenPrice,
	},
	equity: {
		balanceSheet: Equity.balanceSheet,
		candles: Equity.candles,
		cashFlow: Equity.cashFlow,
		etfHoldings: Equity.etfHoldings,
		filings: Equity.filings,
		incomeStatement: Equity.incomeStatement,
		latestFilings: Equity.latestFilings,
		latestFinancials: Equity.latestFinancials,
		listings: Equity.listings,
		meta: Equity.meta,
		metrics: Equity.metrics,
		overview: Equity.overview,
		profile: Equity.profile,
		segments: Equity.segments,
	},
	exchange: {
		candles: Exchange.candles,
		coverage: Exchange.coverage,
		depth: Exchange.depth,
		fundingHistory: Exchange.fundingHistory,
		klines: Exchange.klines,
		longShortRatio: Exchange.longShortRatio,
		markets: Exchange.markets,
		perp: Exchange.perp,
		price: Exchange.price,
	},
	fund: {
		detail: Fund.detail,
		portfolio: Fund.portfolio,
		ranking: Fund.ranking,
	},
	heatscore: {
		detail: Heatscore.detail,
		projects: Heatscore.projects,
		tokenOfTheDay: Heatscore.tokenOfTheDay,
		tokenOfWeek: Heatscore.tokenOfWeek,
	},
	hyperliquid: {
		account: Hyperliquid.account,
		candles: Hyperliquid.candles,
		fills: Hyperliquid.fills,
		leaderboard: Hyperliquid.leaderboard,
		orders: Hyperliquid.orders,
		performance: Hyperliquid.performance,
		positions: Hyperliquid.positions,
		trades: Hyperliquid.trades,
		tradesAggregate: Hyperliquid.tradesAggregate,
		tradesContext: Hyperliquid.tradesContext,
	},
	market: {
		etf: Market.etf,
		exchangeFlowExchanges: Market.exchangeFlowExchanges,
		fearGreed: Market.fearGreed,
		futures: Market.futures,
		liquidationChart: Market.liquidationChart,
		liquidationExchangeList: Market.liquidationExchangeList,
		liquidationOrder: Market.liquidationOrder,
		listing: Market.listing,
		onchainIndicator: Market.onchainIndicator,
		options: Market.options,
		price: Market.price,
		priceIndicator: Market.priceIndicator,
		publicSale: Market.publicSale,
		ranking: Market.ranking,
		tge: Market.tge,
	},
	news: {
		detail: News.detail,
		feed: News.feed,
	},
	onchain: {
		bridgeRanking: Onchain.bridgeRanking,
		dexActivity: Onchain.dexActivity,
		gasPrice: Onchain.gasPrice,
		query: Onchain.query,
		schema: Onchain.schema,
		sql: Onchain.sql,
		sqlJobs: Onchain.sqlJobs,
		sqlJobsJobId: Onchain.sqlJobsJobId,
		getSqlJobsJobId: Onchain.getSqlJobsJobId,
		sqlJobsJobIdResults: Onchain.sqlJobsJobIdResults,
		sqlPreflight: Onchain.sqlPreflight,
		tx: Onchain.tx,
		yieldRanking: Onchain.yieldRanking,
	},
	portfolio: {
		wallets: Portfolio.wallets,
	},
	predictionMarket: {
		analytics: PredictionMarket.analytics,
		correlations: PredictionMarket.correlations,
		kalshiEvents: PredictionMarket.kalshiEvents,
		kalshiMarkets: PredictionMarket.kalshiMarkets,
		kalshiOpenInterest: PredictionMarket.kalshiOpenInterest,
		kalshiOrderbooks: PredictionMarket.kalshiOrderbooks,
		kalshiPrices: PredictionMarket.kalshiPrices,
		kalshiTrades: PredictionMarket.kalshiTrades,
		kalshiVolumes: PredictionMarket.kalshiVolumes,
		matchingDaily: PredictionMarket.matchingDaily,
		matchingPairs: PredictionMarket.matchingPairs,
		polymarketEvents: PredictionMarket.polymarketEvents,
		polymarketLeaderboard: PredictionMarket.polymarketLeaderboard,
		polymarketMarkets: PredictionMarket.polymarketMarkets,
		polymarketOpenInterest: PredictionMarket.polymarketOpenInterest,
		polymarketOrderbooks: PredictionMarket.polymarketOrderbooks,
		polymarketPositions: PredictionMarket.polymarketPositions,
		polymarketPriceOhlcvConditionId:
			PredictionMarket.polymarketPriceOhlcvConditionId,
		polymarketPrices: PredictionMarket.polymarketPrices,
		polymarketSmartMoney: PredictionMarket.polymarketSmartMoney,
		polymarketTrades: PredictionMarket.polymarketTrades,
		polymarketVolumeSplitConditionId:
			PredictionMarket.polymarketVolumeSplitConditionId,
		polymarketVolumes: PredictionMarket.polymarketVolumes,
	},
	project: {
		aiNews: Project.aiNews,
		defiMetrics: Project.defiMetrics,
		defiRanking: Project.defiRanking,
		detail: Project.detail,
	},
	search: {
		airdrop: Search.airdrop,
		airdropActivities: Search.airdropActivities,
		events: Search.events,
		fund: Search.fund,
		fundraising: Search.fundraising,
		news: Search.news,
		predictionMarket: Search.predictionMarket,
		project: Search.project,
		token: Search.token,
		wallet: Search.wallet,
		web: Search.web,
	},
	token: {
		dexTrades: Token.dexTrades,
		holders: Token.holders,
		tokenomics: Token.tokenomics,
		transferCounterparties: Token.transferCounterparties,
		transferStats: Token.transferStats,
		transfers: Token.transfers,
	},
	wallet: {
		detail: Wallet.detail,
		history: Wallet.history,
		labelsBatch: Wallet.labelsBatch,
		netWorth: Wallet.netWorth,
		protocols: Wallet.protocols,
		transfers: Wallet.transfers,
	},
	web: {
		fetch: Web.fetch,
	},
	x: {
		tweets: X.tweets,
	},
} as const;

export const surfEndpointSchemas = {
	'dex.tokenPrice': {
		input: SurfEndpointInputSchemas.dexTokenPrice,
		output: SurfEndpointOutputSchemas.dexTokenPrice,
	},
	'equity.balanceSheet': {
		input: SurfEndpointInputSchemas.equityBalanceSheet,
		output: SurfEndpointOutputSchemas.equityBalanceSheet,
	},
	'equity.candles': {
		input: SurfEndpointInputSchemas.equityCandles,
		output: SurfEndpointOutputSchemas.equityCandles,
	},
	'equity.cashFlow': {
		input: SurfEndpointInputSchemas.equityCashFlow,
		output: SurfEndpointOutputSchemas.equityCashFlow,
	},
	'equity.etfHoldings': {
		input: SurfEndpointInputSchemas.equityEtfHoldings,
		output: SurfEndpointOutputSchemas.equityEtfHoldings,
	},
	'equity.filings': {
		input: SurfEndpointInputSchemas.equityFilings,
		output: SurfEndpointOutputSchemas.equityFilings,
	},
	'equity.incomeStatement': {
		input: SurfEndpointInputSchemas.equityIncomeStatement,
		output: SurfEndpointOutputSchemas.equityIncomeStatement,
	},
	'equity.latestFilings': {
		input: SurfEndpointInputSchemas.equityLatestFilings,
		output: SurfEndpointOutputSchemas.equityLatestFilings,
	},
	'equity.latestFinancials': {
		input: SurfEndpointInputSchemas.equityLatestFinancials,
		output: SurfEndpointOutputSchemas.equityLatestFinancials,
	},
	'equity.listings': {
		input: SurfEndpointInputSchemas.equityListings,
		output: SurfEndpointOutputSchemas.equityListings,
	},
	'equity.meta': {
		input: SurfEndpointInputSchemas.equityMeta,
		output: SurfEndpointOutputSchemas.equityMeta,
	},
	'equity.metrics': {
		input: SurfEndpointInputSchemas.equityMetrics,
		output: SurfEndpointOutputSchemas.equityMetrics,
	},
	'equity.overview': {
		input: SurfEndpointInputSchemas.equityOverview,
		output: SurfEndpointOutputSchemas.equityOverview,
	},
	'equity.profile': {
		input: SurfEndpointInputSchemas.equityProfile,
		output: SurfEndpointOutputSchemas.equityProfile,
	},
	'equity.segments': {
		input: SurfEndpointInputSchemas.equitySegments,
		output: SurfEndpointOutputSchemas.equitySegments,
	},
	'exchange.candles': {
		input: SurfEndpointInputSchemas.exchangeCandles,
		output: SurfEndpointOutputSchemas.exchangeCandles,
	},
	'exchange.coverage': {
		input: SurfEndpointInputSchemas.exchangeCoverage,
		output: SurfEndpointOutputSchemas.exchangeCoverage,
	},
	'exchange.depth': {
		input: SurfEndpointInputSchemas.exchangeDepth,
		output: SurfEndpointOutputSchemas.exchangeDepth,
	},
	'exchange.fundingHistory': {
		input: SurfEndpointInputSchemas.exchangeFundingHistory,
		output: SurfEndpointOutputSchemas.exchangeFundingHistory,
	},
	'exchange.klines': {
		input: SurfEndpointInputSchemas.exchangeKlines,
		output: SurfEndpointOutputSchemas.exchangeKlines,
	},
	'exchange.longShortRatio': {
		input: SurfEndpointInputSchemas.exchangeLongShortRatio,
		output: SurfEndpointOutputSchemas.exchangeLongShortRatio,
	},
	'exchange.markets': {
		input: SurfEndpointInputSchemas.exchangeMarkets,
		output: SurfEndpointOutputSchemas.exchangeMarkets,
	},
	'exchange.perp': {
		input: SurfEndpointInputSchemas.exchangePerp,
		output: SurfEndpointOutputSchemas.exchangePerp,
	},
	'exchange.price': {
		input: SurfEndpointInputSchemas.exchangePrice,
		output: SurfEndpointOutputSchemas.exchangePrice,
	},
	'fund.detail': {
		input: SurfEndpointInputSchemas.fundDetail,
		output: SurfEndpointOutputSchemas.fundDetail,
	},
	'fund.portfolio': {
		input: SurfEndpointInputSchemas.fundPortfolio,
		output: SurfEndpointOutputSchemas.fundPortfolio,
	},
	'fund.ranking': {
		input: SurfEndpointInputSchemas.fundRanking,
		output: SurfEndpointOutputSchemas.fundRanking,
	},
	'heatscore.detail': {
		input: SurfEndpointInputSchemas.heatscoreDetail,
		output: SurfEndpointOutputSchemas.heatscoreDetail,
	},
	'heatscore.projects': {
		input: SurfEndpointInputSchemas.heatscoreProjects,
		output: SurfEndpointOutputSchemas.heatscoreProjects,
	},
	'heatscore.tokenOfTheDay': {
		input: SurfEndpointInputSchemas.heatscoreTokenOfTheDay,
		output: SurfEndpointOutputSchemas.heatscoreTokenOfTheDay,
	},
	'heatscore.tokenOfWeek': {
		input: SurfEndpointInputSchemas.heatscoreTokenOfWeek,
		output: SurfEndpointOutputSchemas.heatscoreTokenOfWeek,
	},
	'hyperliquid.account': {
		input: SurfEndpointInputSchemas.hyperliquidAccount,
		output: SurfEndpointOutputSchemas.hyperliquidAccount,
	},
	'hyperliquid.candles': {
		input: SurfEndpointInputSchemas.hyperliquidCandles,
		output: SurfEndpointOutputSchemas.hyperliquidCandles,
	},
	'hyperliquid.fills': {
		input: SurfEndpointInputSchemas.hyperliquidFills,
		output: SurfEndpointOutputSchemas.hyperliquidFills,
	},
	'hyperliquid.leaderboard': {
		input: SurfEndpointInputSchemas.hyperliquidLeaderboard,
		output: SurfEndpointOutputSchemas.hyperliquidLeaderboard,
	},
	'hyperliquid.orders': {
		input: SurfEndpointInputSchemas.hyperliquidOrders,
		output: SurfEndpointOutputSchemas.hyperliquidOrders,
	},
	'hyperliquid.performance': {
		input: SurfEndpointInputSchemas.hyperliquidPerformance,
		output: SurfEndpointOutputSchemas.hyperliquidPerformance,
	},
	'hyperliquid.positions': {
		input: SurfEndpointInputSchemas.hyperliquidPositions,
		output: SurfEndpointOutputSchemas.hyperliquidPositions,
	},
	'hyperliquid.trades': {
		input: SurfEndpointInputSchemas.hyperliquidTrades,
		output: SurfEndpointOutputSchemas.hyperliquidTrades,
	},
	'hyperliquid.tradesAggregate': {
		input: SurfEndpointInputSchemas.hyperliquidTradesAggregate,
		output: SurfEndpointOutputSchemas.hyperliquidTradesAggregate,
	},
	'hyperliquid.tradesContext': {
		input: SurfEndpointInputSchemas.hyperliquidTradesContext,
		output: SurfEndpointOutputSchemas.hyperliquidTradesContext,
	},
	'market.etf': {
		input: SurfEndpointInputSchemas.marketEtf,
		output: SurfEndpointOutputSchemas.marketEtf,
	},
	'market.exchangeFlowExchanges': {
		input: SurfEndpointInputSchemas.marketExchangeFlowExchanges,
		output: SurfEndpointOutputSchemas.marketExchangeFlowExchanges,
	},
	'market.fearGreed': {
		input: SurfEndpointInputSchemas.marketFearGreed,
		output: SurfEndpointOutputSchemas.marketFearGreed,
	},
	'market.futures': {
		input: SurfEndpointInputSchemas.marketFutures,
		output: SurfEndpointOutputSchemas.marketFutures,
	},
	'market.liquidationChart': {
		input: SurfEndpointInputSchemas.marketLiquidationChart,
		output: SurfEndpointOutputSchemas.marketLiquidationChart,
	},
	'market.liquidationExchangeList': {
		input: SurfEndpointInputSchemas.marketLiquidationExchangeList,
		output: SurfEndpointOutputSchemas.marketLiquidationExchangeList,
	},
	'market.liquidationOrder': {
		input: SurfEndpointInputSchemas.marketLiquidationOrder,
		output: SurfEndpointOutputSchemas.marketLiquidationOrder,
	},
	'market.listing': {
		input: SurfEndpointInputSchemas.marketListing,
		output: SurfEndpointOutputSchemas.marketListing,
	},
	'market.onchainIndicator': {
		input: SurfEndpointInputSchemas.marketOnchainIndicator,
		output: SurfEndpointOutputSchemas.marketOnchainIndicator,
	},
	'market.options': {
		input: SurfEndpointInputSchemas.marketOptions,
		output: SurfEndpointOutputSchemas.marketOptions,
	},
	'market.price': {
		input: SurfEndpointInputSchemas.marketPrice,
		output: SurfEndpointOutputSchemas.marketPrice,
	},
	'market.priceIndicator': {
		input: SurfEndpointInputSchemas.marketPriceIndicator,
		output: SurfEndpointOutputSchemas.marketPriceIndicator,
	},
	'market.publicSale': {
		input: SurfEndpointInputSchemas.marketPublicSale,
		output: SurfEndpointOutputSchemas.marketPublicSale,
	},
	'market.ranking': {
		input: SurfEndpointInputSchemas.marketRanking,
		output: SurfEndpointOutputSchemas.marketRanking,
	},
	'market.tge': {
		input: SurfEndpointInputSchemas.marketTge,
		output: SurfEndpointOutputSchemas.marketTge,
	},
	'news.detail': {
		input: SurfEndpointInputSchemas.newsDetail,
		output: SurfEndpointOutputSchemas.newsDetail,
	},
	'news.feed': {
		input: SurfEndpointInputSchemas.newsFeed,
		output: SurfEndpointOutputSchemas.newsFeed,
	},
	'onchain.bridgeRanking': {
		input: SurfEndpointInputSchemas.onchainBridgeRanking,
		output: SurfEndpointOutputSchemas.onchainBridgeRanking,
	},
	'onchain.dexActivity': {
		input: SurfEndpointInputSchemas.onchainDexActivity,
		output: SurfEndpointOutputSchemas.onchainDexActivity,
	},
	'onchain.gasPrice': {
		input: SurfEndpointInputSchemas.onchainGasPrice,
		output: SurfEndpointOutputSchemas.onchainGasPrice,
	},
	'onchain.query': {
		input: SurfEndpointInputSchemas.onchainQuery,
		output: SurfEndpointOutputSchemas.onchainQuery,
	},
	'onchain.schema': {
		input: SurfEndpointInputSchemas.onchainSchema,
		output: SurfEndpointOutputSchemas.onchainSchema,
	},
	'onchain.sql': {
		input: SurfEndpointInputSchemas.onchainSql,
		output: SurfEndpointOutputSchemas.onchainSql,
	},
	'onchain.sqlJobs': {
		input: SurfEndpointInputSchemas.onchainSqlJobs,
		output: SurfEndpointOutputSchemas.onchainSqlJobs,
	},
	'onchain.sqlJobsJobId': {
		input: SurfEndpointInputSchemas.onchainSqlJobsJobId,
		output: SurfEndpointOutputSchemas.onchainSqlJobsJobId,
	},
	'onchain.getSqlJobsJobId': {
		input: SurfEndpointInputSchemas.getOnchainSqlJobsJobId,
		output: SurfEndpointOutputSchemas.getOnchainSqlJobsJobId,
	},
	'onchain.sqlJobsJobIdResults': {
		input: SurfEndpointInputSchemas.onchainSqlJobsJobIdResults,
		output: SurfEndpointOutputSchemas.onchainSqlJobsJobIdResults,
	},
	'onchain.sqlPreflight': {
		input: SurfEndpointInputSchemas.onchainSqlPreflight,
		output: SurfEndpointOutputSchemas.onchainSqlPreflight,
	},
	'onchain.tx': {
		input: SurfEndpointInputSchemas.onchainTx,
		output: SurfEndpointOutputSchemas.onchainTx,
	},
	'onchain.yieldRanking': {
		input: SurfEndpointInputSchemas.onchainYieldRanking,
		output: SurfEndpointOutputSchemas.onchainYieldRanking,
	},
	'portfolio.wallets': {
		input: SurfEndpointInputSchemas.portfolioWallets,
		output: SurfEndpointOutputSchemas.portfolioWallets,
	},
	'predictionMarket.analytics': {
		input: SurfEndpointInputSchemas.predictionMarketAnalytics,
		output: SurfEndpointOutputSchemas.predictionMarketAnalytics,
	},
	'predictionMarket.correlations': {
		input: SurfEndpointInputSchemas.predictionMarketCorrelations,
		output: SurfEndpointOutputSchemas.predictionMarketCorrelations,
	},
	'predictionMarket.kalshiEvents': {
		input: SurfEndpointInputSchemas.predictionMarketKalshiEvents,
		output: SurfEndpointOutputSchemas.predictionMarketKalshiEvents,
	},
	'predictionMarket.kalshiMarkets': {
		input: SurfEndpointInputSchemas.predictionMarketKalshiMarkets,
		output: SurfEndpointOutputSchemas.predictionMarketKalshiMarkets,
	},
	'predictionMarket.kalshiOpenInterest': {
		input: SurfEndpointInputSchemas.predictionMarketKalshiOpenInterest,
		output: SurfEndpointOutputSchemas.predictionMarketKalshiOpenInterest,
	},
	'predictionMarket.kalshiOrderbooks': {
		input: SurfEndpointInputSchemas.predictionMarketKalshiOrderbooks,
		output: SurfEndpointOutputSchemas.predictionMarketKalshiOrderbooks,
	},
	'predictionMarket.kalshiPrices': {
		input: SurfEndpointInputSchemas.predictionMarketKalshiPrices,
		output: SurfEndpointOutputSchemas.predictionMarketKalshiPrices,
	},
	'predictionMarket.kalshiTrades': {
		input: SurfEndpointInputSchemas.predictionMarketKalshiTrades,
		output: SurfEndpointOutputSchemas.predictionMarketKalshiTrades,
	},
	'predictionMarket.kalshiVolumes': {
		input: SurfEndpointInputSchemas.predictionMarketKalshiVolumes,
		output: SurfEndpointOutputSchemas.predictionMarketKalshiVolumes,
	},
	'predictionMarket.matchingDaily': {
		input: SurfEndpointInputSchemas.predictionMarketMatchingDaily,
		output: SurfEndpointOutputSchemas.predictionMarketMatchingDaily,
	},
	'predictionMarket.matchingPairs': {
		input: SurfEndpointInputSchemas.predictionMarketMatchingPairs,
		output: SurfEndpointOutputSchemas.predictionMarketMatchingPairs,
	},
	'predictionMarket.polymarketEvents': {
		input: SurfEndpointInputSchemas.predictionMarketPolymarketEvents,
		output: SurfEndpointOutputSchemas.predictionMarketPolymarketEvents,
	},
	'predictionMarket.polymarketLeaderboard': {
		input: SurfEndpointInputSchemas.predictionMarketPolymarketLeaderboard,
		output: SurfEndpointOutputSchemas.predictionMarketPolymarketLeaderboard,
	},
	'predictionMarket.polymarketMarkets': {
		input: SurfEndpointInputSchemas.predictionMarketPolymarketMarkets,
		output: SurfEndpointOutputSchemas.predictionMarketPolymarketMarkets,
	},
	'predictionMarket.polymarketOpenInterest': {
		input: SurfEndpointInputSchemas.predictionMarketPolymarketOpenInterest,
		output: SurfEndpointOutputSchemas.predictionMarketPolymarketOpenInterest,
	},
	'predictionMarket.polymarketOrderbooks': {
		input: SurfEndpointInputSchemas.predictionMarketPolymarketOrderbooks,
		output: SurfEndpointOutputSchemas.predictionMarketPolymarketOrderbooks,
	},
	'predictionMarket.polymarketPositions': {
		input: SurfEndpointInputSchemas.predictionMarketPolymarketPositions,
		output: SurfEndpointOutputSchemas.predictionMarketPolymarketPositions,
	},
	'predictionMarket.polymarketPriceOhlcvConditionId': {
		input:
			SurfEndpointInputSchemas.predictionMarketPolymarketPriceOhlcvConditionId,
		output:
			SurfEndpointOutputSchemas.predictionMarketPolymarketPriceOhlcvConditionId,
	},
	'predictionMarket.polymarketPrices': {
		input: SurfEndpointInputSchemas.predictionMarketPolymarketPrices,
		output: SurfEndpointOutputSchemas.predictionMarketPolymarketPrices,
	},
	'predictionMarket.polymarketSmartMoney': {
		input: SurfEndpointInputSchemas.predictionMarketPolymarketSmartMoney,
		output: SurfEndpointOutputSchemas.predictionMarketPolymarketSmartMoney,
	},
	'predictionMarket.polymarketTrades': {
		input: SurfEndpointInputSchemas.predictionMarketPolymarketTrades,
		output: SurfEndpointOutputSchemas.predictionMarketPolymarketTrades,
	},
	'predictionMarket.polymarketVolumeSplitConditionId': {
		input:
			SurfEndpointInputSchemas.predictionMarketPolymarketVolumeSplitConditionId,
		output:
			SurfEndpointOutputSchemas.predictionMarketPolymarketVolumeSplitConditionId,
	},
	'predictionMarket.polymarketVolumes': {
		input: SurfEndpointInputSchemas.predictionMarketPolymarketVolumes,
		output: SurfEndpointOutputSchemas.predictionMarketPolymarketVolumes,
	},
	'project.aiNews': {
		input: SurfEndpointInputSchemas.projectAiNews,
		output: SurfEndpointOutputSchemas.projectAiNews,
	},
	'project.defiMetrics': {
		input: SurfEndpointInputSchemas.projectDefiMetrics,
		output: SurfEndpointOutputSchemas.projectDefiMetrics,
	},
	'project.defiRanking': {
		input: SurfEndpointInputSchemas.projectDefiRanking,
		output: SurfEndpointOutputSchemas.projectDefiRanking,
	},
	'project.detail': {
		input: SurfEndpointInputSchemas.projectDetail,
		output: SurfEndpointOutputSchemas.projectDetail,
	},
	'search.airdrop': {
		input: SurfEndpointInputSchemas.searchAirdrop,
		output: SurfEndpointOutputSchemas.searchAirdrop,
	},
	'search.airdropActivities': {
		input: SurfEndpointInputSchemas.searchAirdropActivities,
		output: SurfEndpointOutputSchemas.searchAirdropActivities,
	},
	'search.events': {
		input: SurfEndpointInputSchemas.searchEvents,
		output: SurfEndpointOutputSchemas.searchEvents,
	},
	'search.fund': {
		input: SurfEndpointInputSchemas.searchFund,
		output: SurfEndpointOutputSchemas.searchFund,
	},
	'search.fundraising': {
		input: SurfEndpointInputSchemas.searchFundraising,
		output: SurfEndpointOutputSchemas.searchFundraising,
	},
	'search.news': {
		input: SurfEndpointInputSchemas.searchNews,
		output: SurfEndpointOutputSchemas.searchNews,
	},
	'search.predictionMarket': {
		input: SurfEndpointInputSchemas.searchPredictionMarket,
		output: SurfEndpointOutputSchemas.searchPredictionMarket,
	},
	'search.project': {
		input: SurfEndpointInputSchemas.searchProject,
		output: SurfEndpointOutputSchemas.searchProject,
	},
	'search.token': {
		input: SurfEndpointInputSchemas.searchToken,
		output: SurfEndpointOutputSchemas.searchToken,
	},
	'search.wallet': {
		input: SurfEndpointInputSchemas.searchWallet,
		output: SurfEndpointOutputSchemas.searchWallet,
	},
	'search.web': {
		input: SurfEndpointInputSchemas.searchWeb,
		output: SurfEndpointOutputSchemas.searchWeb,
	},
	'token.dexTrades': {
		input: SurfEndpointInputSchemas.tokenDexTrades,
		output: SurfEndpointOutputSchemas.tokenDexTrades,
	},
	'token.holders': {
		input: SurfEndpointInputSchemas.tokenHolders,
		output: SurfEndpointOutputSchemas.tokenHolders,
	},
	'token.tokenomics': {
		input: SurfEndpointInputSchemas.tokenTokenomics,
		output: SurfEndpointOutputSchemas.tokenTokenomics,
	},
	'token.transferCounterparties': {
		input: SurfEndpointInputSchemas.tokenTransferCounterparties,
		output: SurfEndpointOutputSchemas.tokenTransferCounterparties,
	},
	'token.transferStats': {
		input: SurfEndpointInputSchemas.tokenTransferStats,
		output: SurfEndpointOutputSchemas.tokenTransferStats,
	},
	'token.transfers': {
		input: SurfEndpointInputSchemas.tokenTransfers,
		output: SurfEndpointOutputSchemas.tokenTransfers,
	},
	'wallet.detail': {
		input: SurfEndpointInputSchemas.walletDetail,
		output: SurfEndpointOutputSchemas.walletDetail,
	},
	'wallet.history': {
		input: SurfEndpointInputSchemas.walletHistory,
		output: SurfEndpointOutputSchemas.walletHistory,
	},
	'wallet.labelsBatch': {
		input: SurfEndpointInputSchemas.walletLabelsBatch,
		output: SurfEndpointOutputSchemas.walletLabelsBatch,
	},
	'wallet.netWorth': {
		input: SurfEndpointInputSchemas.walletNetWorth,
		output: SurfEndpointOutputSchemas.walletNetWorth,
	},
	'wallet.protocols': {
		input: SurfEndpointInputSchemas.walletProtocols,
		output: SurfEndpointOutputSchemas.walletProtocols,
	},
	'wallet.transfers': {
		input: SurfEndpointInputSchemas.walletTransfers,
		output: SurfEndpointOutputSchemas.walletTransfers,
	},
	'web.fetch': {
		input: SurfEndpointInputSchemas.webFetch,
		output: SurfEndpointOutputSchemas.webFetch,
	},
	'x.tweets': {
		input: SurfEndpointInputSchemas.xTweets,
		output: SurfEndpointOutputSchemas.xTweets,
	},
} as const;

export const surfEndpointMeta = {
	'dex.tokenPrice': { riskLevel: 'read', description: 'DEX Token OHLCV Price' },
	'equity.balanceSheet': {
		riskLevel: 'read',
		description: 'Equity Balance Sheet',
	},
	'equity.candles': { riskLevel: 'read', description: 'Equity Price Candles' },
	'equity.cashFlow': { riskLevel: 'read', description: 'Equity Cash Flow' },
	'equity.etfHoldings': { riskLevel: 'read', description: 'ETF Holdings' },
	'equity.filings': { riskLevel: 'read', description: 'Equity SEC Filings' },
	'equity.incomeStatement': {
		riskLevel: 'read',
		description: 'Equity Income Statement',
	},
	'equity.latestFilings': {
		riskLevel: 'read',
		description: 'Latest Equity Filings',
	},
	'equity.latestFinancials': {
		riskLevel: 'read',
		description: 'Latest Equity Financials',
	},
	'equity.listings': { riskLevel: 'read', description: 'Equity Listings' },
	'equity.meta': { riskLevel: 'read', description: 'Equity Metadata' },
	'equity.metrics': {
		riskLevel: 'read',
		description: 'Equity Financial Metrics',
	},
	'equity.overview': {
		riskLevel: 'read',
		description: 'Equity Financial Overview',
	},
	'equity.profile': { riskLevel: 'read', description: 'Equity Profile' },
	'equity.segments': {
		riskLevel: 'read',
		description: 'Equity Segment Financials',
	},
	'exchange.candles': {
		riskLevel: 'read',
		description: 'Exchange Historical Candles',
	},
	'exchange.coverage': {
		riskLevel: 'read',
		description: 'Exchange Market Coverage',
	},
	'exchange.depth': {
		riskLevel: 'read',
		description: 'Exchange Order Book Depth',
	},
	'exchange.fundingHistory': {
		riskLevel: 'read',
		description: 'Exchange Funding Rate History',
	},
	'exchange.klines': {
		riskLevel: 'read',
		description: 'Exchange OHLCV Candlesticks',
	},
	'exchange.longShortRatio': {
		riskLevel: 'read',
		description: 'Exchange Long/Short Ratio History',
	},
	'exchange.markets': {
		riskLevel: 'read',
		description: 'Exchange Trading Pairs',
	},
	'exchange.perp': {
		riskLevel: 'read',
		description: 'Exchange Perpetual Contract Snapshot',
	},
	'exchange.price': { riskLevel: 'read', description: 'Exchange Ticker Price' },
	'fund.detail': { riskLevel: 'read', description: 'Fund Profile Detail' },
	'fund.portfolio': { riskLevel: 'read', description: 'Fund Portfolio' },
	'fund.ranking': { riskLevel: 'read', description: 'Fund Ranking' },
	'heatscore.detail': { riskLevel: 'read', description: 'Signal Detail' },
	'heatscore.projects': { riskLevel: 'read', description: 'Signal Projects' },
	'heatscore.tokenOfTheDay': {
		riskLevel: 'read',
		description: 'Signal Token Of The Day',
	},
	'heatscore.tokenOfWeek': {
		riskLevel: 'read',
		description: 'Signal Token Of The Week',
	},
	'hyperliquid.account': {
		riskLevel: 'read',
		description: 'Account Portfolio',
	},
	'hyperliquid.candles': { riskLevel: 'read', description: 'Market Candles' },
	'hyperliquid.fills': { riskLevel: 'read', description: 'Fills' },
	'hyperliquid.leaderboard': {
		riskLevel: 'read',
		description: 'Trader Leaderboard',
	},
	'hyperliquid.orders': {
		riskLevel: 'read',
		description: 'Open & Recent Orders',
	},
	'hyperliquid.performance': {
		riskLevel: 'read',
		description: 'Trading Performance',
	},
	'hyperliquid.positions': { riskLevel: 'read', description: 'Open Positions' },
	'hyperliquid.trades': { riskLevel: 'read', description: 'Closed Trades' },
	'hyperliquid.tradesAggregate': {
		riskLevel: 'read',
		description: 'Closed Trades Aggregate',
	},
	'hyperliquid.tradesContext': {
		riskLevel: 'read',
		description: 'Closed Trade Funding and Leverage',
	},
	'market.etf': { riskLevel: 'read', description: 'ETF Flow History' },
	'market.exchangeFlowExchanges': {
		riskLevel: 'read',
		description: 'Exchange Flow Exchanges',
	},
	'market.fearGreed': {
		riskLevel: 'read',
		description: 'Fear & Greed Index History',
	},
	'market.futures': {
		riskLevel: 'read',
		description: 'Futures Market Overview',
	},
	'market.liquidationChart': {
		riskLevel: 'read',
		description: 'Liquidation Chart',
	},
	'market.liquidationExchangeList': {
		riskLevel: 'read',
		description: 'Liquidation by Exchange',
	},
	'market.liquidationOrder': {
		riskLevel: 'read',
		description: 'Large Liquidation Orders',
	},
	'market.listing': {
		riskLevel: 'read',
		description: 'Exchange Listing Events',
	},
	'market.onchainIndicator': {
		riskLevel: 'read',
		description: 'On-Chain Indicator',
	},
	'market.options': { riskLevel: 'read', description: 'Options Market Data' },
	'market.price': { riskLevel: 'read', description: 'Token Price History' },
	'market.priceIndicator': {
		riskLevel: 'read',
		description: 'Technical Indicator',
	},
	'market.publicSale': {
		riskLevel: 'read',
		description: 'Public Sale / Crowdsale',
	},
	'market.ranking': { riskLevel: 'read', description: 'Token Rankings' },
	'market.tge': { riskLevel: 'read', description: 'Token Generation Event' },
	'news.detail': { riskLevel: 'read', description: 'News Article Detail' },
	'news.feed': { riskLevel: 'read', description: 'Crypto News Feed' },
	'onchain.bridgeRanking': {
		riskLevel: 'read',
		description: 'Bridge Protocol Ranking',
	},
	'onchain.dexActivity': {
		riskLevel: 'read',
		description: 'DEX Protocol Activity',
	},
	'onchain.gasPrice': { riskLevel: 'read', description: 'Current Gas Price' },
	'onchain.query': {
		riskLevel: 'write',
		description: 'Blockchain Structured Query',
	},
	'onchain.schema': { riskLevel: 'read', description: 'On-Chain Table Schema' },
	'onchain.sql': { riskLevel: 'write', description: 'Blockchain SQL Query' },
	'onchain.sqlJobs': {
		riskLevel: 'write',
		description: 'Submit Asynchronous Blockchain SQL Job',
	},
	'onchain.sqlJobsJobId': {
		riskLevel: 'destructive',
		description: 'Cancel Asynchronous Blockchain SQL Job',
	},
	'onchain.getSqlJobsJobId': {
		riskLevel: 'read',
		description: 'Get Asynchronous Blockchain SQL Job',
	},
	'onchain.sqlJobsJobIdResults': {
		riskLevel: 'read',
		description: 'Download Asynchronous Blockchain SQL Results',
	},
	'onchain.sqlPreflight': {
		riskLevel: 'write',
		description: 'Preflight Blockchain SQL Query',
	},
	'onchain.tx': {
		riskLevel: 'read',
		description: 'Transaction Details by Hash',
	},
	'onchain.yieldRanking': {
		riskLevel: 'read',
		description: 'Yield Pool Ranking',
	},
	'portfolio.wallets': {
		riskLevel: 'read',
		description: 'Current User Portfolio Wallets',
	},
	'predictionMarket.analytics': {
		riskLevel: 'read',
		description: 'Prediction Market Analytics',
	},
	'predictionMarket.correlations': {
		riskLevel: 'read',
		description: 'Market Correlations',
	},
	'predictionMarket.kalshiEvents': {
		riskLevel: 'read',
		description: 'Kalshi Events',
	},
	'predictionMarket.kalshiMarkets': {
		riskLevel: 'read',
		description: 'Kalshi Markets',
	},
	'predictionMarket.kalshiOpenInterest': {
		riskLevel: 'read',
		description: 'Kalshi Open Interest History',
	},
	'predictionMarket.kalshiOrderbooks': {
		riskLevel: 'read',
		description: 'Kalshi Orderbook History',
	},
	'predictionMarket.kalshiPrices': {
		riskLevel: 'read',
		description: 'Kalshi Price History',
	},
	'predictionMarket.kalshiTrades': {
		riskLevel: 'read',
		description: 'Kalshi Trades',
	},
	'predictionMarket.kalshiVolumes': {
		riskLevel: 'read',
		description: 'Kalshi Volume History',
	},
	'predictionMarket.matchingDaily': {
		riskLevel: 'read',
		description: 'Cross-Platform Daily Comparison (Polymarket <> Kalshi)',
	},
	'predictionMarket.matchingPairs': {
		riskLevel: 'read',
		description:
			'Cross-Platform Prediction Market Matcher (Polymarket <> Kalshi)',
	},
	'predictionMarket.polymarketEvents': {
		riskLevel: 'read',
		description: 'Polymarket Events',
	},
	'predictionMarket.polymarketLeaderboard': {
		riskLevel: 'read',
		description: 'Polymarket Leaderboard',
	},
	'predictionMarket.polymarketMarkets': {
		riskLevel: 'read',
		description: 'Polymarket Markets',
	},
	'predictionMarket.polymarketOpenInterest': {
		riskLevel: 'read',
		description: 'Polymarket Open Interest History',
	},
	'predictionMarket.polymarketOrderbooks': {
		riskLevel: 'read',
		description: 'Polymarket Orderbook History',
	},
	'predictionMarket.polymarketPositions': {
		riskLevel: 'read',
		description: 'Polymarket Wallet Positions',
	},
	'predictionMarket.polymarketPriceOhlcvConditionId': {
		riskLevel: 'read',
		description: 'Polymarket OHLCV Candlesticks',
	},
	'predictionMarket.polymarketPrices': {
		riskLevel: 'read',
		description: 'Polymarket Price History',
	},
	'predictionMarket.polymarketSmartMoney': {
		riskLevel: 'read',
		description: 'Polymarket Smart Money',
	},
	'predictionMarket.polymarketTrades': {
		riskLevel: 'read',
		description: 'Polymarket Trades',
	},
	'predictionMarket.polymarketVolumeSplitConditionId': {
		riskLevel: 'read',
		description: 'Polymarket Volume Split (YES/NO)',
	},
	'predictionMarket.polymarketVolumes': {
		riskLevel: 'read',
		description: 'Polymarket Volume History',
	},
	'project.aiNews': { riskLevel: 'read', description: 'Project AI News' },
	'project.defiMetrics': {
		riskLevel: 'read',
		description: 'Project DeFi Metrics',
	},
	'project.defiRanking': {
		riskLevel: 'read',
		description: 'DeFi Protocol Ranking',
	},
	'project.detail': {
		riskLevel: 'read',
		description: 'Aggregated Project Detail',
	},
	'search.airdrop': { riskLevel: 'read', description: 'Airdrop Search' },
	'search.airdropActivities': {
		riskLevel: 'read',
		description: 'Airdrop Activities',
	},
	'search.events': { riskLevel: 'read', description: 'Project Event Search' },
	'search.fund': { riskLevel: 'read', description: 'Fund Search' },
	'search.fundraising': {
		riskLevel: 'read',
		description: 'Fundraising Event Search',
	},
	'search.news': { riskLevel: 'read', description: 'News Article Search' },
	'search.predictionMarket': {
		riskLevel: 'read',
		description: 'Search Prediction Markets',
	},
	'search.project': { riskLevel: 'read', description: 'Project Search' },
	'search.token': { riskLevel: 'read', description: 'Token Symbol Resolution' },
	'search.wallet': { riskLevel: 'read', description: 'Wallet Search' },
	'search.web': { riskLevel: 'read', description: 'Web Search' },
	'token.dexTrades': {
		riskLevel: 'read',
		description: 'Token DEX Trade History',
	},
	'token.holders': { riskLevel: 'read', description: 'Token Holders' },
	'token.tokenomics': {
		riskLevel: 'read',
		description: 'Token Unlock Schedule',
	},
	'token.transferCounterparties': {
		riskLevel: 'read',
		description: 'Top Transfer Counterparties',
	},
	'token.transferStats': {
		riskLevel: 'read',
		description: 'Token Transfer Activity Summary',
	},
	'token.transfers': {
		riskLevel: 'read',
		description: 'Token Transfer History',
	},
	'wallet.detail': {
		riskLevel: 'read',
		description: 'Aggregated Wallet Detail',
	},
	'wallet.history': {
		riskLevel: 'read',
		description: 'Wallet Transaction History',
	},
	'wallet.labelsBatch': {
		riskLevel: 'read',
		description: 'Wallet Labels (Batch)',
	},
	'wallet.netWorth': {
		riskLevel: 'read',
		description: 'Wallet Net Worth History',
	},
	'wallet.protocols': {
		riskLevel: 'read',
		description: 'Wallet DeFi Protocol Positions',
	},
	'wallet.transfers': {
		riskLevel: 'read',
		description: 'Wallet Transfer History',
	},
	'web.fetch': { riskLevel: 'read', description: 'Web Page Fetch' },
	'x.tweets': { riskLevel: 'read', description: 'X Tweets by IDs' },
} as const;
