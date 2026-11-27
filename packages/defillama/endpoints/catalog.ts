// Generated with endpoints/operation-types.ts from DefiLlama's OpenAPI specs (api-docs.defillama.com):
// one entry per operation in defillama-manifest.json. Risk levels follow
// .github/PLUGIN_PR_RULES.md (R8).
import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { defillamaSchemaEntry } from './openapi-schema';
import { createDefillamaOperation as op } from './operations';

export const defillamaEndpointsNested = {
	account: {
		usage: op('account.usage'),
	},
	bridges: {
		dayStats: op('bridges.dayStats'),
		get: op('bridges.get'),
		list: op('bridges.list'),
		transactions: op('bridges.transactions'),
		volume: op('bridges.volume'),
	},
	coins: {
		batchHistorical: op('coins.batchHistorical'),
		block: op('coins.block'),
		chart: op('coins.chart'),
		current: op('coins.current'),
		first: op('coins.first'),
		historical: op('coins.historical'),
		percentageChange: op('coins.percentageChange'),
	},
	dat: {
		institution: op('dat.institution'),
		institutions: op('dat.institutions'),
	},
	dimensions: {
		categories: op('dimensions.categories'),
		categoryChainChart: op('dimensions.categoryChainChart'),
		categoryChainChartByProtocol: op('dimensions.categoryChainChartByProtocol'),
		categoryChainMetrics: op('dimensions.categoryChainMetrics'),
		categoryChart: op('dimensions.categoryChart'),
		categoryChartByChain: op('dimensions.categoryChartByChain'),
		categoryChartByProtocol: op('dimensions.categoryChartByProtocol'),
		categoryMetrics: op('dimensions.categoryMetrics'),
		chainChart: op('dimensions.chainChart'),
		chainChartByProtocol: op('dimensions.chainChartByProtocol'),
		chainMetrics: op('dimensions.chainMetrics'),
		chart: op('dimensions.chart'),
		chartByChain: op('dimensions.chartByChain'),
		chartByProtocol: op('dimensions.chartByProtocol'),
		metrics: op('dimensions.metrics'),
		protocolChart: op('dimensions.protocolChart'),
		protocolChartByChain: op('dimensions.protocolChartByChain'),
		protocolChartByLabel: op('dimensions.protocolChartByLabel'),
		protocolChartByVersion: op('dimensions.protocolChartByVersion'),
		protocolMetrics: op('dimensions.protocolMetrics'),
	},
	equities: {
		companies: op('equities.companies'),
		dimensions: op('equities.dimensions'),
		earningsCalendar: op('equities.earningsCalendar'),
		filings: op('equities.filings'),
		industries: op('equities.industries'),
		ohlcv: op('equities.ohlcv'),
		onchain: op('equities.onchain'),
		priceHistory: op('equities.priceHistory'),
		sector: op('equities.sector'),
		sectors: op('equities.sectors'),
		sectorsOverview: op('equities.sectorsOverview'),
		statements: op('equities.statements'),
		summary: op('equities.summary'),
	},
	etfs: {
		flows: op('etfs.flows'),
		snapshot: op('etfs.snapshot'),
	},
	fees: {
		byChain: op('fees.byChain'),
		overview: op('fees.overview'),
		summary: op('fees.summary'),
	},
	financialStatements: {
		get: op('financialStatements.get'),
	},
	forks: {
		chartByProtocol: op('forks.chartByProtocol'),
		metrics: op('forks.metrics'),
		protocolChart: op('forks.protocolChart'),
	},
	narratives: {
		performance: op('narratives.performance'),
	},
	oracles: {
		chainChart: op('oracles.chainChart'),
		chainChartByProtocol: op('oracles.chainChartByProtocol'),
		chart: op('oracles.chart'),
		chartByChain: op('oracles.chartByChain'),
		chartByProtocol: op('oracles.chartByProtocol'),
		metrics: op('oracles.metrics'),
		protocolChart: op('oracles.protocolChart'),
		protocolChartByChain: op('oracles.protocolChartByChain'),
	},
	overview: {
		categories: op('overview.categories'),
		entities: op('overview.entities'),
		forks: op('overview.forks'),
		hacks: op('overview.hacks'),
		oracles: op('overview.oracles'),
		raises: op('overview.raises'),
		treasuries: op('overview.treasuries'),
	},
	perps: {
		derivatives: op('perps.derivatives'),
		derivativesSummary: op('perps.derivativesSummary'),
		openInterest: op('perps.openInterest'),
	},
	preIpo: {
		companies: op('preIpo.companies'),
		integrations: op('preIpo.integrations'),
		raises: op('preIpo.raises'),
		summary: op('preIpo.summary'),
		valuations: op('preIpo.valuations'),
	},
	rwa: {
		chain: op('rwa.chain'),
		chainChart: op('rwa.chainChart'),
		chartByChain: op('rwa.chartByChain'),
		current: op('rwa.current'),
		list: op('rwa.list'),
		stats: op('rwa.stats'),
	},
	stablecoins: {
		chains: op('stablecoins.chains'),
		chartAll: op('stablecoins.chartAll'),
		chartByChain: op('stablecoins.chartByChain'),
		dominance: op('stablecoins.dominance'),
		get: op('stablecoins.get'),
		list: op('stablecoins.list'),
		prices: op('stablecoins.prices'),
	},
	tokenLiquidity: {
		history: op('tokenLiquidity.history'),
	},
	treasury: {
		chart: op('treasury.chart'),
		chartByChain: op('treasury.chartByChain'),
		chartByToken: op('treasury.chartByToken'),
		metrics: op('treasury.metrics'),
	},
	tvl: {
		chainAssets: op('tvl.chainAssets'),
		chains: op('tvl.chains'),
		chart: op('tvl.chart'),
		chartByChain: op('tvl.chartByChain'),
		chartByToken: op('tvl.chartByToken'),
		current: op('tvl.current'),
		historicalChainTvl: op('tvl.historicalChainTvl'),
		historicalChainTvlByChain: op('tvl.historicalChainTvlByChain'),
		inflows: op('tvl.inflows'),
		metrics: op('tvl.metrics'),
		protocol: op('tvl.protocol'),
		protocols: op('tvl.protocols'),
		tokenProtocols: op('tvl.tokenProtocols'),
	},
	unlocks: {
		get: op('unlocks.get'),
		list: op('unlocks.list'),
	},
	volumes: {
		dexSummary: op('volumes.dexSummary'),
		dexs: op('volumes.dexs'),
		dexsByChain: op('volumes.dexsByChain'),
		options: op('volumes.options'),
		optionsByChain: op('volumes.optionsByChain'),
		optionsSummary: op('volumes.optionsSummary'),
	},
	yields: {
		borrow: {
			marketHistory: op('yields.borrow.marketHistory'),
			markets: op('yields.borrow.markets'),
			routes: op('yields.borrow.routes'),
		},
		borrowPools: op('yields.borrowPools'),
		earn: {
			history: op('yields.earn.history'),
			list: op('yields.earn.list'),
			query: op('yields.earn.query'),
			verified: op('yields.earn.verified'),
			verifiedGet: op('yields.earn.verifiedGet'),
			verifiedHistory: op('yields.earn.verifiedHistory'),
		},
		lendBorrowChart: op('yields.lendBorrowChart'),
		loops: op('yields.loops'),
		lstRates: op('yields.lstRates'),
		perpFundingRates: op('yields.perpFundingRates'),
		poolChart: op('yields.poolChart'),
		pools: op('yields.pools'),
	},
} as const;

export const defillamaEndpointSchemas = {
	'account.usage': defillamaSchemaEntry('account.usage'),
	'bridges.dayStats': defillamaSchemaEntry('bridges.dayStats'),
	'bridges.get': defillamaSchemaEntry('bridges.get'),
	'bridges.list': defillamaSchemaEntry('bridges.list'),
	'bridges.transactions': defillamaSchemaEntry('bridges.transactions'),
	'bridges.volume': defillamaSchemaEntry('bridges.volume'),
	'coins.batchHistorical': defillamaSchemaEntry('coins.batchHistorical'),
	'coins.block': defillamaSchemaEntry('coins.block'),
	'coins.chart': defillamaSchemaEntry('coins.chart'),
	'coins.current': defillamaSchemaEntry('coins.current'),
	'coins.first': defillamaSchemaEntry('coins.first'),
	'coins.historical': defillamaSchemaEntry('coins.historical'),
	'coins.percentageChange': defillamaSchemaEntry('coins.percentageChange'),
	'dat.institution': defillamaSchemaEntry('dat.institution'),
	'dat.institutions': defillamaSchemaEntry('dat.institutions'),
	'dimensions.categories': defillamaSchemaEntry('dimensions.categories'),
	'dimensions.categoryChainChart': defillamaSchemaEntry(
		'dimensions.categoryChainChart',
	),
	'dimensions.categoryChainChartByProtocol': defillamaSchemaEntry(
		'dimensions.categoryChainChartByProtocol',
	),
	'dimensions.categoryChainMetrics': defillamaSchemaEntry(
		'dimensions.categoryChainMetrics',
	),
	'dimensions.categoryChart': defillamaSchemaEntry('dimensions.categoryChart'),
	'dimensions.categoryChartByChain': defillamaSchemaEntry(
		'dimensions.categoryChartByChain',
	),
	'dimensions.categoryChartByProtocol': defillamaSchemaEntry(
		'dimensions.categoryChartByProtocol',
	),
	'dimensions.categoryMetrics': defillamaSchemaEntry(
		'dimensions.categoryMetrics',
	),
	'dimensions.chainChart': defillamaSchemaEntry('dimensions.chainChart'),
	'dimensions.chainChartByProtocol': defillamaSchemaEntry(
		'dimensions.chainChartByProtocol',
	),
	'dimensions.chainMetrics': defillamaSchemaEntry('dimensions.chainMetrics'),
	'dimensions.chart': defillamaSchemaEntry('dimensions.chart'),
	'dimensions.chartByChain': defillamaSchemaEntry('dimensions.chartByChain'),
	'dimensions.chartByProtocol': defillamaSchemaEntry(
		'dimensions.chartByProtocol',
	),
	'dimensions.metrics': defillamaSchemaEntry('dimensions.metrics'),
	'dimensions.protocolChart': defillamaSchemaEntry('dimensions.protocolChart'),
	'dimensions.protocolChartByChain': defillamaSchemaEntry(
		'dimensions.protocolChartByChain',
	),
	'dimensions.protocolChartByLabel': defillamaSchemaEntry(
		'dimensions.protocolChartByLabel',
	),
	'dimensions.protocolChartByVersion': defillamaSchemaEntry(
		'dimensions.protocolChartByVersion',
	),
	'dimensions.protocolMetrics': defillamaSchemaEntry(
		'dimensions.protocolMetrics',
	),
	'equities.companies': defillamaSchemaEntry('equities.companies'),
	'equities.dimensions': defillamaSchemaEntry('equities.dimensions'),
	'equities.earningsCalendar': defillamaSchemaEntry(
		'equities.earningsCalendar',
	),
	'equities.filings': defillamaSchemaEntry('equities.filings'),
	'equities.industries': defillamaSchemaEntry('equities.industries'),
	'equities.ohlcv': defillamaSchemaEntry('equities.ohlcv'),
	'equities.onchain': defillamaSchemaEntry('equities.onchain'),
	'equities.priceHistory': defillamaSchemaEntry('equities.priceHistory'),
	'equities.sector': defillamaSchemaEntry('equities.sector'),
	'equities.sectors': defillamaSchemaEntry('equities.sectors'),
	'equities.sectorsOverview': defillamaSchemaEntry('equities.sectorsOverview'),
	'equities.statements': defillamaSchemaEntry('equities.statements'),
	'equities.summary': defillamaSchemaEntry('equities.summary'),
	'etfs.flows': defillamaSchemaEntry('etfs.flows'),
	'etfs.snapshot': defillamaSchemaEntry('etfs.snapshot'),
	'fees.byChain': defillamaSchemaEntry('fees.byChain'),
	'fees.overview': defillamaSchemaEntry('fees.overview'),
	'fees.summary': defillamaSchemaEntry('fees.summary'),
	'financialStatements.get': defillamaSchemaEntry('financialStatements.get'),
	'forks.chartByProtocol': defillamaSchemaEntry('forks.chartByProtocol'),
	'forks.metrics': defillamaSchemaEntry('forks.metrics'),
	'forks.protocolChart': defillamaSchemaEntry('forks.protocolChart'),
	'narratives.performance': defillamaSchemaEntry('narratives.performance'),
	'oracles.chainChart': defillamaSchemaEntry('oracles.chainChart'),
	'oracles.chainChartByProtocol': defillamaSchemaEntry(
		'oracles.chainChartByProtocol',
	),
	'oracles.chart': defillamaSchemaEntry('oracles.chart'),
	'oracles.chartByChain': defillamaSchemaEntry('oracles.chartByChain'),
	'oracles.chartByProtocol': defillamaSchemaEntry('oracles.chartByProtocol'),
	'oracles.metrics': defillamaSchemaEntry('oracles.metrics'),
	'oracles.protocolChart': defillamaSchemaEntry('oracles.protocolChart'),
	'oracles.protocolChartByChain': defillamaSchemaEntry(
		'oracles.protocolChartByChain',
	),
	'overview.categories': defillamaSchemaEntry('overview.categories'),
	'overview.entities': defillamaSchemaEntry('overview.entities'),
	'overview.forks': defillamaSchemaEntry('overview.forks'),
	'overview.hacks': defillamaSchemaEntry('overview.hacks'),
	'overview.oracles': defillamaSchemaEntry('overview.oracles'),
	'overview.raises': defillamaSchemaEntry('overview.raises'),
	'overview.treasuries': defillamaSchemaEntry('overview.treasuries'),
	'perps.derivatives': defillamaSchemaEntry('perps.derivatives'),
	'perps.derivativesSummary': defillamaSchemaEntry('perps.derivativesSummary'),
	'perps.openInterest': defillamaSchemaEntry('perps.openInterest'),
	'preIpo.companies': defillamaSchemaEntry('preIpo.companies'),
	'preIpo.integrations': defillamaSchemaEntry('preIpo.integrations'),
	'preIpo.raises': defillamaSchemaEntry('preIpo.raises'),
	'preIpo.summary': defillamaSchemaEntry('preIpo.summary'),
	'preIpo.valuations': defillamaSchemaEntry('preIpo.valuations'),
	'rwa.chain': defillamaSchemaEntry('rwa.chain'),
	'rwa.chainChart': defillamaSchemaEntry('rwa.chainChart'),
	'rwa.chartByChain': defillamaSchemaEntry('rwa.chartByChain'),
	'rwa.current': defillamaSchemaEntry('rwa.current'),
	'rwa.list': defillamaSchemaEntry('rwa.list'),
	'rwa.stats': defillamaSchemaEntry('rwa.stats'),
	'stablecoins.chains': defillamaSchemaEntry('stablecoins.chains'),
	'stablecoins.chartAll': defillamaSchemaEntry('stablecoins.chartAll'),
	'stablecoins.chartByChain': defillamaSchemaEntry('stablecoins.chartByChain'),
	'stablecoins.dominance': defillamaSchemaEntry('stablecoins.dominance'),
	'stablecoins.get': defillamaSchemaEntry('stablecoins.get'),
	'stablecoins.list': defillamaSchemaEntry('stablecoins.list'),
	'stablecoins.prices': defillamaSchemaEntry('stablecoins.prices'),
	'tokenLiquidity.history': defillamaSchemaEntry('tokenLiquidity.history'),
	'treasury.chart': defillamaSchemaEntry('treasury.chart'),
	'treasury.chartByChain': defillamaSchemaEntry('treasury.chartByChain'),
	'treasury.chartByToken': defillamaSchemaEntry('treasury.chartByToken'),
	'treasury.metrics': defillamaSchemaEntry('treasury.metrics'),
	'tvl.chainAssets': defillamaSchemaEntry('tvl.chainAssets'),
	'tvl.chains': defillamaSchemaEntry('tvl.chains'),
	'tvl.chart': defillamaSchemaEntry('tvl.chart'),
	'tvl.chartByChain': defillamaSchemaEntry('tvl.chartByChain'),
	'tvl.chartByToken': defillamaSchemaEntry('tvl.chartByToken'),
	'tvl.current': defillamaSchemaEntry('tvl.current'),
	'tvl.historicalChainTvl': defillamaSchemaEntry('tvl.historicalChainTvl'),
	'tvl.historicalChainTvlByChain': defillamaSchemaEntry(
		'tvl.historicalChainTvlByChain',
	),
	'tvl.inflows': defillamaSchemaEntry('tvl.inflows'),
	'tvl.metrics': defillamaSchemaEntry('tvl.metrics'),
	'tvl.protocol': defillamaSchemaEntry('tvl.protocol'),
	'tvl.protocols': defillamaSchemaEntry('tvl.protocols'),
	'tvl.tokenProtocols': defillamaSchemaEntry('tvl.tokenProtocols'),
	'unlocks.get': defillamaSchemaEntry('unlocks.get'),
	'unlocks.list': defillamaSchemaEntry('unlocks.list'),
	'volumes.dexSummary': defillamaSchemaEntry('volumes.dexSummary'),
	'volumes.dexs': defillamaSchemaEntry('volumes.dexs'),
	'volumes.dexsByChain': defillamaSchemaEntry('volumes.dexsByChain'),
	'volumes.options': defillamaSchemaEntry('volumes.options'),
	'volumes.optionsByChain': defillamaSchemaEntry('volumes.optionsByChain'),
	'volumes.optionsSummary': defillamaSchemaEntry('volumes.optionsSummary'),
	'yields.borrow.marketHistory': defillamaSchemaEntry(
		'yields.borrow.marketHistory',
	),
	'yields.borrow.markets': defillamaSchemaEntry('yields.borrow.markets'),
	'yields.borrow.routes': defillamaSchemaEntry('yields.borrow.routes'),
	'yields.borrowPools': defillamaSchemaEntry('yields.borrowPools'),
	'yields.earn.history': defillamaSchemaEntry('yields.earn.history'),
	'yields.earn.list': defillamaSchemaEntry('yields.earn.list'),
	'yields.earn.query': defillamaSchemaEntry('yields.earn.query'),
	'yields.earn.verified': defillamaSchemaEntry('yields.earn.verified'),
	'yields.earn.verifiedGet': defillamaSchemaEntry('yields.earn.verifiedGet'),
	'yields.earn.verifiedHistory': defillamaSchemaEntry(
		'yields.earn.verifiedHistory',
	),
	'yields.lendBorrowChart': defillamaSchemaEntry('yields.lendBorrowChart'),
	'yields.loops': defillamaSchemaEntry('yields.loops'),
	'yields.lstRates': defillamaSchemaEntry('yields.lstRates'),
	'yields.perpFundingRates': defillamaSchemaEntry('yields.perpFundingRates'),
	'yields.poolChart': defillamaSchemaEntry('yields.poolChart'),
	'yields.pools': defillamaSchemaEntry('yields.pools'),
} satisfies RequiredPluginEndpointSchemas<typeof defillamaEndpointsNested>;

export const defillamaEndpointMeta = {
	'account.usage': {
		riskLevel: 'read',
		description:
			'Get amount of credits left in the api key, these reset on the 1st of each month (needs a DefiLlama Pro key)',
	},
	'bridges.dayStats': {
		riskLevel: 'read',
		description:
			'Get a 24hr token and address volume breakdown for a bridge (needs a DefiLlama Pro key)',
	},
	'bridges.get': {
		riskLevel: 'read',
		description:
			'Get summary of bridge volume and volume breakdown by chain (needs a DefiLlama Pro key)',
	},
	'bridges.list': {
		riskLevel: 'read',
		description:
			'List all bridges along with summaries of recent bridge volumes (needs a DefiLlama Pro key)',
	},
	'bridges.transactions': {
		riskLevel: 'read',
		description:
			'Get all transactions for a bridge within a date range (needs a DefiLlama Pro key)',
	},
	'bridges.volume': {
		riskLevel: 'read',
		description:
			'Get historical volumes for a bridge, chain, or bridge on a particular chain (needs a DefiLlama Pro key)',
	},
	'coins.batchHistorical': {
		riskLevel: 'read',
		description:
			'Get historical prices for multiple tokens at multiple different timestamps',
	},
	'coins.block': {
		riskLevel: 'read',
		description: 'Get the closest block to a timestamp',
	},
	'coins.chart': {
		riskLevel: 'read',
		description: 'Get token prices at regular time intervals',
	},
	'coins.current': {
		riskLevel: 'read',
		description: 'Get current prices of tokens by contract address',
	},
	'coins.first': {
		riskLevel: 'read',
		description: 'Get earliest timestamp price record for coins',
	},
	'coins.historical': {
		riskLevel: 'read',
		description: 'Get historical prices of tokens by contract address',
	},
	'coins.percentageChange': {
		riskLevel: 'read',
		description: 'Get percentage change in price over time',
	},
	'dat.institution': {
		riskLevel: 'read',
		description:
			'Get individual institution Digital Asset Treasury details (needs a DefiLlama Pro key)',
	},
	'dat.institutions': {
		riskLevel: 'read',
		description:
			'Get list of all institutions with Digital Asset Treasury data (needs a DefiLlama Pro key)',
	},
	'dimensions.categories': {
		riskLevel: 'read',
		description: 'Get categories available for a dimension',
	},
	'dimensions.categoryChainChart': {
		riskLevel: 'read',
		description: 'Get category chain historical timeseries chart data',
	},
	'dimensions.categoryChainChartByProtocol': {
		riskLevel: 'read',
		description:
			'Get category chain timeseries chart data breakdown by protocol',
	},
	'dimensions.categoryChainMetrics': {
		riskLevel: 'read',
		description: 'Get category chain dimension data overview',
	},
	'dimensions.categoryChart': {
		riskLevel: 'read',
		description: 'Get category historical timeseries chart data',
	},
	'dimensions.categoryChartByChain': {
		riskLevel: 'read',
		description: 'Get category timeseries chart data breakdown by chain',
	},
	'dimensions.categoryChartByProtocol': {
		riskLevel: 'read',
		description: 'Get category timeseries chart data breakdown by protocol',
	},
	'dimensions.categoryMetrics': {
		riskLevel: 'read',
		description: 'Get category dimension data overview',
	},
	'dimensions.chainChart': {
		riskLevel: 'read',
		description: 'Get chain historical timeseries chart data',
	},
	'dimensions.chainChartByProtocol': {
		riskLevel: 'read',
		description: 'Get chain timeseries chart data breakdown by protocol',
	},
	'dimensions.chainMetrics': {
		riskLevel: 'read',
		description: 'Get chain dimension data overview',
	},
	'dimensions.chart': {
		riskLevel: 'read',
		description: 'Get historical timeseries chart data',
	},
	'dimensions.chartByChain': {
		riskLevel: 'read',
		description: 'Get historical timeseries chart data breakdown by chain',
	},
	'dimensions.chartByProtocol': {
		riskLevel: 'read',
		description: 'Get historical timeseries chart data breakdown by protocol',
	},
	'dimensions.metrics': {
		riskLevel: 'read',
		description: 'Get dimension data overview',
	},
	'dimensions.protocolChart': {
		riskLevel: 'read',
		description: 'Get protocol historical timeseries chart data',
	},
	'dimensions.protocolChartByChain': {
		riskLevel: 'read',
		description: 'Get protocol timeseries chart data breakdown by chain',
	},
	'dimensions.protocolChartByLabel': {
		riskLevel: 'read',
		description: 'Get protocol timeseries chart data breakdown by label',
	},
	'dimensions.protocolChartByVersion': {
		riskLevel: 'read',
		description: 'Get protocol timeseries chart data breakdown by version',
	},
	'dimensions.protocolMetrics': {
		riskLevel: 'read',
		description: 'Get protocol dimension data overview',
	},
	'equities.companies': {
		riskLevel: 'read',
		description:
			'Get list of all tracked public companies (needs a DefiLlama Pro key)',
	},
	'equities.dimensions': {
		riskLevel: 'read',
		description:
			'Get financial dimensions for a company (needs a DefiLlama Pro key)',
	},
	'equities.earningsCalendar': {
		riskLevel: 'read',
		description: 'Get earnings calendar (needs a DefiLlama Pro key)',
	},
	'equities.filings': {
		riskLevel: 'read',
		description: 'Get filings for a company (needs a DefiLlama Pro key)',
	},
	'equities.industries': {
		riskLevel: 'read',
		description: 'Get industries (needs a DefiLlama Pro key)',
	},
	'equities.ohlcv': {
		riskLevel: 'read',
		description:
			'Get OHLCV candle data for a company (needs a DefiLlama Pro key)',
	},
	'equities.onchain': {
		riskLevel: 'read',
		description:
			'Get on-chain tradeable markets for a company (needs a DefiLlama Pro key)',
	},
	'equities.priceHistory': {
		riskLevel: 'read',
		description:
			'Get historical price data for a company (needs a DefiLlama Pro key)',
	},
	'equities.sector': {
		riskLevel: 'read',
		description: 'Get details for one sector (needs a DefiLlama Pro key)',
	},
	'equities.sectors': {
		riskLevel: 'read',
		description: 'Get all sectors (needs a DefiLlama Pro key)',
	},
	'equities.sectorsOverview': {
		riskLevel: 'read',
		description: 'Get market-wide sector overview (needs a DefiLlama Pro key)',
	},
	'equities.statements': {
		riskLevel: 'read',
		description:
			'Get financial statements for a company (needs a DefiLlama Pro key)',
	},
	'equities.summary': {
		riskLevel: 'read',
		description:
			'Get live market summary for a company (needs a DefiLlama Pro key)',
	},
	'etfs.flows': {
		riskLevel: 'read',
		description:
			'Historical Flows at the Asset Level (needs a DefiLlama Pro key)',
	},
	'etfs.snapshot': {
		riskLevel: 'read',
		description:
			'Get ETFs and their metrics (aum, flows, fees...) (needs a DefiLlama Pro key)',
	},
	'fees.byChain': {
		riskLevel: 'read',
		description:
			'List all protocols along with summaries of their fees and revenue and dataType history data by chain',
	},
	'fees.overview': {
		riskLevel: 'read',
		description:
			'List all protocols along with summaries of their fees and revenue and dataType history data',
	},
	'fees.summary': {
		riskLevel: 'read',
		description:
			'Get summary of protocol fees and revenue with historical data',
	},
	'financialStatements.get': {
		riskLevel: 'read',
		description:
			'Get protocol income statement report (needs a DefiLlama Pro key)',
	},
	'forks.chartByProtocol': {
		riskLevel: 'read',
		description: 'Get timeseries chart data breakdown by protocol',
	},
	'forks.metrics': {
		riskLevel: 'read',
		description: 'Get fork data overview',
	},
	'forks.protocolChart': {
		riskLevel: 'read',
		description: 'Get timeseries chart data by protocol',
	},
	'narratives.performance': {
		riskLevel: 'read',
		description:
			'Get chart of narratives based on category performance (with individual coins weighted by mcap) (needs a DefiLlama Pro key)',
	},
	'oracles.chainChart': {
		riskLevel: 'read',
		description: 'Get timeseries chart data by chain',
	},
	'oracles.chainChartByProtocol': {
		riskLevel: 'read',
		description: 'Get protocol breakdown timeseries chart data by chain',
	},
	'oracles.chart': {
		riskLevel: 'read',
		description: 'Get timeseries chart data for all oracles',
	},
	'oracles.chartByChain': {
		riskLevel: 'read',
		description: 'Get timeseries chart data breakdown by chain',
	},
	'oracles.chartByProtocol': {
		riskLevel: 'read',
		description: 'Get timeseries chart data breakdown by protocol',
	},
	'oracles.metrics': {
		riskLevel: 'read',
		description: 'Get oracle data overview',
	},
	'oracles.protocolChart': {
		riskLevel: 'read',
		description: 'Get timeseries chart data by protocol/oracle',
	},
	'oracles.protocolChartByChain': {
		riskLevel: 'read',
		description: 'Get chain breakdown timeseries chart data by protocol/oracle',
	},
	'overview.categories': {
		riskLevel: 'read',
		description:
			'Overview of all categories accross all protocols (needs a DefiLlama Pro key)',
	},
	'overview.entities': {
		riskLevel: 'read',
		description: 'List all entities (needs a DefiLlama Pro key)',
	},
	'overview.forks': {
		riskLevel: 'read',
		description:
			'Overview of all forks accross all protocols (needs a DefiLlama Pro key)',
	},
	'overview.hacks': {
		riskLevel: 'read',
		description: 'Overview of all hacks on our Hacks dashboard',
	},
	'overview.oracles': {
		riskLevel: 'read',
		description:
			'Overview of all oracles accross all protocols (needs a DefiLlama Pro key)',
	},
	'overview.raises': {
		riskLevel: 'read',
		description:
			'Overview of all raises on our Raises dashboard (needs a DefiLlama Pro key)',
	},
	'overview.treasuries': {
		riskLevel: 'read',
		description:
			'List all protocols on our Treasuries dashboard (needs a DefiLlama Pro key)',
	},
	'perps.derivatives': {
		riskLevel: 'read',
		description:
			'Lists all derivatives along summaries of their volumes filtering by chain (needs a DefiLlama Pro key)',
	},
	'perps.derivativesSummary': {
		riskLevel: 'read',
		description:
			'Volume Details about a specific perp protocol (needs a DefiLlama Pro key)',
	},
	'perps.openInterest': {
		riskLevel: 'read',
		description:
			'List all open interest dex exchanges along with summaries of their open interest',
	},
	'preIpo.companies': {
		riskLevel: 'read',
		description:
			'Get list of all tracked pre-IPO companies (needs a DefiLlama Pro key)',
	},
	'preIpo.integrations': {
		riskLevel: 'read',
		description:
			'Get tradeable markets for a pre-IPO company (needs a DefiLlama Pro key)',
	},
	'preIpo.raises': {
		riskLevel: 'read',
		description:
			'Get funding rounds for a pre-IPO company (needs a DefiLlama Pro key)',
	},
	'preIpo.summary': {
		riskLevel: 'read',
		description:
			'Get profile and latest valuation for a pre-IPO company (needs a DefiLlama Pro key)',
	},
	'preIpo.valuations': {
		riskLevel: 'read',
		description:
			'Get valuation history for a pre-IPO company (needs a DefiLlama Pro key)',
	},
	'rwa.chain': {
		riskLevel: 'read',
		description:
			'List current RWA assets on a chain (needs a DefiLlama Pro key)',
	},
	'rwa.chainChart': {
		riskLevel: 'read',
		description:
			'Get historical RWA chart data for a chain (needs a DefiLlama Pro key)',
	},
	'rwa.chartByChain': {
		riskLevel: 'read',
		description:
			'Get historical RWA metric breakdown by chain (needs a DefiLlama Pro key)',
	},
	'rwa.current': {
		riskLevel: 'read',
		description: 'List all current RWA assets (needs a DefiLlama Pro key)',
	},
	'rwa.list': {
		riskLevel: 'read',
		description: 'List RWA ids and filter values (needs a DefiLlama Pro key)',
	},
	'rwa.stats': {
		riskLevel: 'read',
		description:
			'Get aggregate RWA stats by chain, category, platform, and asset group',
	},
	'stablecoins.chains': {
		riskLevel: 'read',
		description: 'Get current mcap sum of all stablecoins on each chain',
	},
	'stablecoins.chartAll': {
		riskLevel: 'read',
		description: 'Get historical mcap sum of all stablecoins',
	},
	'stablecoins.chartByChain': {
		riskLevel: 'read',
		description: 'Get historical mcap sum of all stablecoins in a chain',
	},
	'stablecoins.dominance': {
		riskLevel: 'read',
		description:
			'Get stablecoin dominance per chain along with the info about the larges coin in a chain',
	},
	'stablecoins.get': {
		riskLevel: 'read',
		description:
			'Get historical mcap and historical chain distribution of a stablecoin',
	},
	'stablecoins.list': {
		riskLevel: 'read',
		description: 'List all stablecoins along with their circulating amounts',
	},
	'stablecoins.prices': {
		riskLevel: 'read',
		description: 'Get historical prices of all stablecoins',
	},
	'tokenLiquidity.history': {
		riskLevel: 'read',
		description:
			'Provides the name of contracts on a determined chain (needs a DefiLlama Pro key)',
	},
	'treasury.chart': {
		riskLevel: 'read',
		description: 'Get historical treasury chart for a protocol',
	},
	'treasury.chartByChain': {
		riskLevel: 'read',
		description:
			'Get historical treasury chart for a protocol broken down by chain',
	},
	'treasury.chartByToken': {
		riskLevel: 'read',
		description:
			'Get historical treasury chart for a protocol broken down by token',
	},
	'treasury.metrics': {
		riskLevel: 'read',
		description: 'Get aggregate treasury metrics for a protocol',
	},
	'tvl.chainAssets': {
		riskLevel: 'read',
		description: 'Get assets of all chains (needs a DefiLlama Pro key)',
	},
	'tvl.chains': {
		riskLevel: 'read',
		description: 'Get current TVL of all chains',
	},
	'tvl.chart': {
		riskLevel: 'read',
		description: 'Get historical TVL chart for a protocol',
	},
	'tvl.chartByChain': {
		riskLevel: 'read',
		description: 'Get historical TVL chart for a protocol broken down by chain',
	},
	'tvl.chartByToken': {
		riskLevel: 'read',
		description: 'Get historical TVL chart for a protocol broken down by token',
	},
	'tvl.current': {
		riskLevel: 'read',
		description: 'Simplified endpoint to get current TVL of a protocol',
	},
	'tvl.historicalChainTvl': {
		riskLevel: 'read',
		description:
			'Get historical TVL (excludes liquid staking and double counted tvl) of DeFi on all chains',
	},
	'tvl.historicalChainTvlByChain': {
		riskLevel: 'read',
		description:
			'Get historical TVL (excludes liquid staking and double counted tvl) of a chain',
	},
	'tvl.inflows': {
		riskLevel: 'read',
		description:
			'Lists the amount of inflows and outflows for a protocol at a given date (needs a DefiLlama Pro key)',
	},
	'tvl.metrics': {
		riskLevel: 'read',
		description: 'Get aggregate TVL metrics for a protocol',
	},
	'tvl.protocol': {
		riskLevel: 'read',
		description:
			'Get historical TVL of a protocol and breakdowns by token and chain',
	},
	'tvl.protocols': {
		riskLevel: 'read',
		description: 'List all protocols on defillama along with their tvl',
	},
	'tvl.tokenProtocols': {
		riskLevel: 'read',
		description:
			'Lists the amount of a certain token within all protocols. Data for the Token Usage page (needs a DefiLlama Pro key)',
	},
	'unlocks.get': {
		riskLevel: 'read',
		description:
			'Unlocks data for a given token/protocol. You can find a list of available slugs to query by querying /emissions and then extracting the key `gecko_id` (needs a DefiLlama Pro key)',
	},
	'unlocks.list': {
		riskLevel: 'read',
		description:
			'List of all tokens along with basic info for each (needs a DefiLlama Pro key)',
	},
	'volumes.dexSummary': {
		riskLevel: 'read',
		description: 'Get summary of dex volume with historical data',
	},
	'volumes.dexs': {
		riskLevel: 'read',
		description:
			'List all dexs along with summaries of their volumes and dataType history data',
	},
	'volumes.dexsByChain': {
		riskLevel: 'read',
		description:
			'List all dexs along with summaries of their volumes and dataType history data filtering by chain',
	},
	'volumes.options': {
		riskLevel: 'read',
		description:
			'List all options dexs along with summaries of their volumes and dataType history data',
	},
	'volumes.optionsByChain': {
		riskLevel: 'read',
		description:
			'List all options dexs along with summaries of their volumes and dataType history data filtering by chain',
	},
	'volumes.optionsSummary': {
		riskLevel: 'read',
		description: 'Get summary of options dex volume with historical data',
	},
	'yields.borrow.marketHistory': {
		riskLevel: 'read',
		description:
			'Retrieve daily borrow-side history for a borrow market (needs a DefiLlama Pro key)',
	},
	'yields.borrow.markets': {
		riskLevel: 'read',
		description:
			'Retrieve the latest data for all borrow markets (needs a DefiLlama Pro key)',
	},
	'yields.borrow.routes': {
		riskLevel: 'read',
		description:
			'Retrieve the latest data for all borrow routes (needs a DefiLlama Pro key)',
	},
	'yields.borrowPools': {
		riskLevel: 'read',
		description:
			'Borrow costs APY of assets from lending markets in the legacy v1 response format (needs a DefiLlama Pro key)',
	},
	'yields.earn.history': {
		riskLevel: 'read',
		description:
			'Retrieve daily history for an earn pool (needs a DefiLlama Pro key)',
	},
	'yields.earn.list': {
		riskLevel: 'read',
		description:
			'Retrieve the latest data for all earn pools (needs a DefiLlama Pro key)',
	},
	'yields.earn.query': {
		riskLevel: 'read',
		description:
			'Retrieve a filtered, paginated page of earn pools (needs a DefiLlama Pro key)',
	},
	'yields.earn.verified': {
		riskLevel: 'read',
		description:
			'Retrieve the latest verified data for all measured earn pools (needs a DefiLlama Pro key)',
	},
	'yields.earn.verifiedGet': {
		riskLevel: 'read',
		description:
			'Retrieve the latest verified data for one earn pool (needs a DefiLlama Pro key)',
	},
	'yields.earn.verifiedHistory': {
		riskLevel: 'read',
		description:
			'Retrieve daily verified history for an earn pool (needs a DefiLlama Pro key)',
	},
	'yields.lendBorrowChart': {
		riskLevel: 'read',
		description:
			'Historical borrow cost APY from a pool on a lending market in the legacy v1 response format (needs a DefiLlama Pro key)',
	},
	'yields.loops': {
		riskLevel: 'read',
		description:
			'Retrieve the latest data for all loop strategies (needs a DefiLlama Pro key)',
	},
	'yields.lstRates': {
		riskLevel: 'read',
		description:
			'Exchange rates and ETH peg of liquid staking tokens (needs a DefiLlama Pro key)',
	},
	'yields.perpFundingRates': {
		riskLevel: 'read',
		description:
			'Funding rates and open interest of perpetual futures (needs a DefiLlama Pro key)',
	},
	'yields.poolChart': {
		riskLevel: 'read',
		description:
			'Get historical APY and TVL of a pool in the legacy v1 response format',
	},
	'yields.pools': {
		riskLevel: 'read',
		description:
			'Retrieve the latest data for all pools in the legacy v1 response format',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof defillamaEndpointsNested
>;
