// Generated from DefiLlama's OpenAPI specs (api-docs.defillama.com)
// (fetched 2026-11-27); defillama-manifest.json is the same contract as JSON.
// Inputs are the parameters and body fields in one object. Outputs
// make every field optional and nullable and keep unknown fields, matching how
// the zod output schemas parse. Regenerate rather than edit.

export type DefillamaJsonValue =
	| null
	| boolean
	| number
	| string
	| DefillamaJsonValue[]
	| { [key: string]: DefillamaJsonValue | undefined };

export const DEFILLAMA_OPERATION_IDS = [
	'account.usage',
	'bridges.dayStats',
	'bridges.get',
	'bridges.list',
	'bridges.transactions',
	'bridges.volume',
	'coins.batchHistorical',
	'coins.block',
	'coins.chart',
	'coins.current',
	'coins.first',
	'coins.historical',
	'coins.percentageChange',
	'dat.institution',
	'dat.institutions',
	'dimensions.categories',
	'dimensions.categoryChainChart',
	'dimensions.categoryChainChartByProtocol',
	'dimensions.categoryChainMetrics',
	'dimensions.categoryChart',
	'dimensions.categoryChartByChain',
	'dimensions.categoryChartByProtocol',
	'dimensions.categoryMetrics',
	'dimensions.chainChart',
	'dimensions.chainChartByProtocol',
	'dimensions.chainMetrics',
	'dimensions.chart',
	'dimensions.chartByChain',
	'dimensions.chartByProtocol',
	'dimensions.metrics',
	'dimensions.protocolChart',
	'dimensions.protocolChartByChain',
	'dimensions.protocolChartByLabel',
	'dimensions.protocolChartByVersion',
	'dimensions.protocolMetrics',
	'equities.companies',
	'equities.dimensions',
	'equities.earningsCalendar',
	'equities.filings',
	'equities.industries',
	'equities.ohlcv',
	'equities.onchain',
	'equities.priceHistory',
	'equities.sector',
	'equities.sectors',
	'equities.sectorsOverview',
	'equities.statements',
	'equities.summary',
	'etfs.flows',
	'etfs.snapshot',
	'fees.byChain',
	'fees.overview',
	'fees.summary',
	'financialStatements.get',
	'forks.chartByProtocol',
	'forks.metrics',
	'forks.protocolChart',
	'narratives.performance',
	'oracles.chainChart',
	'oracles.chainChartByProtocol',
	'oracles.chart',
	'oracles.chartByChain',
	'oracles.chartByProtocol',
	'oracles.metrics',
	'oracles.protocolChart',
	'oracles.protocolChartByChain',
	'overview.categories',
	'overview.entities',
	'overview.forks',
	'overview.hacks',
	'overview.oracles',
	'overview.raises',
	'overview.treasuries',
	'perps.derivatives',
	'perps.derivativesSummary',
	'perps.openInterest',
	'preIpo.companies',
	'preIpo.integrations',
	'preIpo.raises',
	'preIpo.summary',
	'preIpo.valuations',
	'rwa.chain',
	'rwa.chainChart',
	'rwa.chartByChain',
	'rwa.current',
	'rwa.list',
	'rwa.stats',
	'stablecoins.chains',
	'stablecoins.chartAll',
	'stablecoins.chartByChain',
	'stablecoins.dominance',
	'stablecoins.get',
	'stablecoins.list',
	'stablecoins.prices',
	'tokenLiquidity.history',
	'treasury.chart',
	'treasury.chartByChain',
	'treasury.chartByToken',
	'treasury.metrics',
	'tvl.chainAssets',
	'tvl.chains',
	'tvl.chart',
	'tvl.chartByChain',
	'tvl.chartByToken',
	'tvl.current',
	'tvl.historicalChainTvl',
	'tvl.historicalChainTvlByChain',
	'tvl.inflows',
	'tvl.metrics',
	'tvl.protocol',
	'tvl.protocols',
	'tvl.tokenProtocols',
	'unlocks.get',
	'unlocks.list',
	'volumes.dexSummary',
	'volumes.dexs',
	'volumes.dexsByChain',
	'volumes.options',
	'volumes.optionsByChain',
	'volumes.optionsSummary',
	'yields.borrow.marketHistory',
	'yields.borrow.markets',
	'yields.borrow.routes',
	'yields.borrowPools',
	'yields.earn.history',
	'yields.earn.list',
	'yields.earn.query',
	'yields.earn.verified',
	'yields.earn.verifiedGet',
	'yields.earn.verifiedHistory',
	'yields.lendBorrowChart',
	'yields.loops',
	'yields.lstRates',
	'yields.perpFundingRates',
	'yields.poolChart',
	'yields.pools',
] as const;

export type DefillamaOperationId = (typeof DEFILLAMA_OPERATION_IDS)[number];

export type DefillamaOperationInputs = {
	'account.usage': Record<string, never>;
	'bridges.dayStats': {
		/** Unix timestamp. Data returned will be for the 24hr period starting at 00:00 UTC that the timestamp lands in. */
		timestamp: number;
		/** chain slug, you can get these from /chains. */
		chain: string;
		/** bridge ID, you can get these from /bridges */
		id?: number;
	};
	'bridges.get': {
		/** bridge ID, you can get these from /bridges */
		id: number;
	};
	'bridges.list': {
		/** set whether to include current previous day volume breakdown by chain */
		includeChains?: boolean;
	};
	'bridges.transactions': {
		/** bridge ID, you can get these from /bridges */
		id: number;
		/** start timestamp (Unix Timestamp) for date range */
		starttimestamp?: number;
		/** end timestamp (Unix timestamp) for date range */
		endtimestamp?: number;
		/** Returns only transactions that are bridging from the specified source chain. */
		sourcechain?: string;
		/** Returns only transactions with specified address as "from" or "to". Addresses are quried in the form {chain}:{address}, where chain is an identifier such as ethereum, bsc, polygon, avax... . */
		address?: string;
		/** limit to number of transactions returned, maximum is 6000 */
		limit?: number;
	};
	'bridges.volume': {
		/** chain slug, you can get these from /chains. Call also use 'all' for volume on all chains. */
		chain: string;
		/** bridge ID, you can get these from /bridges */
		id?: number;
	};
	'coins.batchHistorical': {
		/** object where keys are coins in the form {chain}:{address}, and values are arrays of requested timestamps */
		coins: string;
	};
	'coins.block': {
		/** Chain which you want to get the block from */
		chain: string;
		/** UNIX timestamp of the block you are searching for */
		timestamp: number;
	};
	'coins.chart': {
		/** set of comma-separated tokens defined as {chain}:{address} */
		coins: string;
		/** unix timestamp of earliest data point requested */
		start?: number;
		/** unix timestamp of latest data point requested */
		end?: number;
		/** number of data points returned, defaults to 0 */
		span?: number;
		/** duration between data points, defaults to 24 hours */
		period?: string;
	};
	'coins.current': {
		/** set of comma-separated tokens defined as {chain}:{address} */
		coins: string;
	};
	'coins.first': {
		/** set of comma-separated tokens defined as {chain}:{address} */
		coins: string;
	};
	'coins.historical': {
		/** set of comma-separated tokens defined as {chain}:{address} */
		coins: string;
		/** UNIX timestamp of time when you want historical prices */
		timestamp: number;
	};
	'coins.percentageChange': {
		/** set of comma-separated tokens defined as {chain}:{address} */
		coins: string;
		/** timestamp of data point requested, defaults to time now */
		timestamp?: number;
		/** whether you want the duration after your given timestamp or not, defaults to false (looking back) */
		lookForward?: boolean;
		/** duration between data points, defaults to 24 hours */
		period?: string;
	};
	'dat.institution': {
		/** Institution ticker symbol (e.g., MSTR for MicroStrategy) */
		symbol: string;
	};
	'dat.institutions': Record<string, never>;
	'dimensions.categories': {
		/** The dimension metric type */
		metric:
			| 'fees'
			| 'liquidations'
			| 'dexs'
			| 'derivatives'
			| 'options'
			| 'aggregators'
			| 'bridge-aggregators'
			| 'bridges'
			| 'open-interest'
			| 'normalized-volume'
			| 'active-users';
		/** Metric-specific data type to return. Supported values per metric: - **fees**: dailyFees (default), dailyRevenue, dailySupplySideRevenue, dailyHoldersRevenue, dailyProtocolRevenue - **liquidations**: dailyLiquidationsVolume (default), dailyCollateralLiquidated - **dexs**: dailyVolume (default),… */
		dataType?: string;
	};
	'dimensions.categoryChainChart': {
		/** The dimension metric type */
		metric:
			| 'fees'
			| 'liquidations'
			| 'dexs'
			| 'derivatives'
			| 'options'
			| 'aggregators'
			| 'bridge-aggregators'
			| 'bridges'
			| 'open-interest'
			| 'normalized-volume';
		/** category slug (slugified category name, e.g. 'dexs', 'prediction-market', 'options') */
		category: string;
		/** chain name */
		chain: string;
		/** Metric-specific data type to return. Supported values per metric: - **fees**: dailyFees (default), dailyRevenue, dailySupplySideRevenue, dailyHoldersRevenue, dailyProtocolRevenue - **liquidations**: dailyLiquidationsVolume (default), dailyCollateralLiquidated - **dexs**: dailyVolume (default),… */
		dataType?: string;
	};
	'dimensions.categoryChainChartByProtocol': {
		/** The dimension metric type */
		metric:
			| 'fees'
			| 'liquidations'
			| 'dexs'
			| 'derivatives'
			| 'options'
			| 'aggregators'
			| 'bridge-aggregators'
			| 'bridges'
			| 'open-interest'
			| 'normalized-volume';
		/** category slug (slugified category name, e.g. 'dexs', 'prediction-market', 'options') */
		category: string;
		/** chain name */
		chain: string;
		/** Metric-specific data type to return. Supported values per metric: - **fees**: dailyFees (default), dailyRevenue, dailySupplySideRevenue, dailyHoldersRevenue, dailyProtocolRevenue - **liquidations**: dailyLiquidationsVolume (default), dailyCollateralLiquidated - **dexs**: dailyVolume (default),… */
		dataType?: string;
	};
	'dimensions.categoryChainMetrics': {
		/** The dimension metric type */
		metric:
			| 'fees'
			| 'liquidations'
			| 'dexs'
			| 'derivatives'
			| 'options'
			| 'aggregators'
			| 'bridge-aggregators'
			| 'bridges'
			| 'open-interest'
			| 'normalized-volume';
		/** category slug (slugified category name, e.g. 'dexs', 'prediction-market', 'options') */
		category: string;
		/** chain name */
		chain: string;
		/** Metric-specific data type to return. Supported values per metric: - **fees**: dailyFees (default), dailyRevenue, dailySupplySideRevenue, dailyHoldersRevenue, dailyProtocolRevenue - **liquidations**: dailyLiquidationsVolume (default), dailyCollateralLiquidated - **dexs**: dailyVolume (default),… */
		dataType?: string;
	};
	'dimensions.categoryChart': {
		/** The dimension metric type */
		metric:
			| 'fees'
			| 'liquidations'
			| 'dexs'
			| 'derivatives'
			| 'options'
			| 'aggregators'
			| 'bridge-aggregators'
			| 'bridges'
			| 'open-interest'
			| 'normalized-volume';
		/** category slug (slugified category name, e.g. 'dexs', 'prediction-market', 'options') */
		category: string;
		/** Metric-specific data type to return. Supported values per metric: - **fees**: dailyFees (default), dailyRevenue, dailySupplySideRevenue, dailyHoldersRevenue, dailyProtocolRevenue - **liquidations**: dailyLiquidationsVolume (default), dailyCollateralLiquidated - **dexs**: dailyVolume (default),… */
		dataType?: string;
	};
	'dimensions.categoryChartByChain': {
		/** The dimension metric type */
		metric:
			| 'fees'
			| 'liquidations'
			| 'dexs'
			| 'derivatives'
			| 'options'
			| 'aggregators'
			| 'bridge-aggregators'
			| 'bridges'
			| 'open-interest'
			| 'normalized-volume';
		/** category slug (slugified category name, e.g. 'dexs', 'prediction-market', 'options') */
		category: string;
		/** Metric-specific data type to return. Supported values per metric: - **fees**: dailyFees (default), dailyRevenue, dailySupplySideRevenue, dailyHoldersRevenue, dailyProtocolRevenue - **liquidations**: dailyLiquidationsVolume (default), dailyCollateralLiquidated - **dexs**: dailyVolume (default),… */
		dataType?: string;
	};
	'dimensions.categoryChartByProtocol': {
		/** The dimension metric type */
		metric:
			| 'fees'
			| 'liquidations'
			| 'dexs'
			| 'derivatives'
			| 'options'
			| 'aggregators'
			| 'bridge-aggregators'
			| 'bridges'
			| 'open-interest'
			| 'normalized-volume';
		/** category slug (slugified category name, e.g. 'dexs', 'prediction-market', 'options') */
		category: string;
		/** Metric-specific data type to return. Supported values per metric: - **fees**: dailyFees (default), dailyRevenue, dailySupplySideRevenue, dailyHoldersRevenue, dailyProtocolRevenue - **liquidations**: dailyLiquidationsVolume (default), dailyCollateralLiquidated - **dexs**: dailyVolume (default),… */
		dataType?: string;
	};
	'dimensions.categoryMetrics': {
		/** The dimension metric type */
		metric:
			| 'fees'
			| 'liquidations'
			| 'dexs'
			| 'derivatives'
			| 'options'
			| 'aggregators'
			| 'bridge-aggregators'
			| 'bridges'
			| 'open-interest'
			| 'normalized-volume';
		/** category slug (slugified category name, e.g. 'dexs', 'prediction-market', 'options') */
		category: string;
		/** Metric-specific data type to return. Supported values per metric: - **fees**: dailyFees (default), dailyRevenue, dailySupplySideRevenue, dailyHoldersRevenue, dailyProtocolRevenue - **liquidations**: dailyLiquidationsVolume (default), dailyCollateralLiquidated - **dexs**: dailyVolume (default),… */
		dataType?: string;
	};
	'dimensions.chainChart': {
		/** The dimension metric type */
		metric:
			| 'fees'
			| 'liquidations'
			| 'dexs'
			| 'derivatives'
			| 'options'
			| 'aggregators'
			| 'bridge-aggregators'
			| 'bridges'
			| 'open-interest'
			| 'normalized-volume';
		/** chain name */
		chain: string;
		/** Metric-specific data type to return. Supported values per metric: - **fees**: dailyFees (default), dailyRevenue, dailySupplySideRevenue, dailyHoldersRevenue, dailyProtocolRevenue - **liquidations**: dailyLiquidationsVolume (default), dailyCollateralLiquidated - **dexs**: dailyVolume (default),… */
		dataType?: string;
	};
	'dimensions.chainChartByProtocol': {
		/** The dimension metric type */
		metric:
			| 'fees'
			| 'liquidations'
			| 'dexs'
			| 'derivatives'
			| 'options'
			| 'aggregators'
			| 'bridge-aggregators'
			| 'bridges'
			| 'open-interest'
			| 'normalized-volume';
		/** chain name */
		chain: string;
		/** Metric-specific data type to return. Supported values per metric: - **fees**: dailyFees (default), dailyRevenue, dailySupplySideRevenue, dailyHoldersRevenue, dailyProtocolRevenue - **liquidations**: dailyLiquidationsVolume (default), dailyCollateralLiquidated - **dexs**: dailyVolume (default),… */
		dataType?: string;
	};
	'dimensions.chainMetrics': {
		/** The dimension metric type */
		metric:
			| 'fees'
			| 'liquidations'
			| 'dexs'
			| 'derivatives'
			| 'options'
			| 'aggregators'
			| 'bridge-aggregators'
			| 'bridges'
			| 'open-interest'
			| 'normalized-volume';
		/** chain name */
		chain: string;
		/** Metric-specific data type to return. Supported values per metric: - **fees**: dailyFees (default), dailyRevenue, dailySupplySideRevenue, dailyHoldersRevenue, dailyProtocolRevenue - **liquidations**: dailyLiquidationsVolume (default), dailyCollateralLiquidated - **dexs**: dailyVolume (default),… */
		dataType?: string;
	};
	'dimensions.chart': {
		/** The dimension metric type */
		metric:
			| 'fees'
			| 'liquidations'
			| 'dexs'
			| 'derivatives'
			| 'options'
			| 'aggregators'
			| 'bridge-aggregators'
			| 'bridges'
			| 'open-interest'
			| 'normalized-volume'
			| 'active-users';
		/** Metric-specific data type to return. Supported values per metric: - **fees**: dailyFees (default), dailyRevenue, dailySupplySideRevenue, dailyHoldersRevenue, dailyProtocolRevenue - **liquidations**: dailyLiquidationsVolume (default), dailyCollateralLiquidated - **dexs**: dailyVolume (default),… */
		dataType?: string;
	};
	'dimensions.chartByChain': {
		/** The dimension metric type */
		metric:
			| 'fees'
			| 'liquidations'
			| 'dexs'
			| 'derivatives'
			| 'options'
			| 'aggregators'
			| 'bridge-aggregators'
			| 'bridges'
			| 'open-interest'
			| 'normalized-volume'
			| 'active-users';
		/** Metric-specific data type to return. Supported values per metric: - **fees**: dailyFees (default), dailyRevenue, dailySupplySideRevenue, dailyHoldersRevenue, dailyProtocolRevenue - **liquidations**: dailyLiquidationsVolume (default), dailyCollateralLiquidated - **dexs**: dailyVolume (default),… */
		dataType?: string;
	};
	'dimensions.chartByProtocol': {
		/** The dimension metric type */
		metric:
			| 'fees'
			| 'liquidations'
			| 'dexs'
			| 'derivatives'
			| 'options'
			| 'aggregators'
			| 'bridge-aggregators'
			| 'bridges'
			| 'open-interest'
			| 'normalized-volume';
		/** Metric-specific data type to return. Supported values per metric: - **fees**: dailyFees (default), dailyRevenue, dailySupplySideRevenue, dailyHoldersRevenue, dailyProtocolRevenue - **liquidations**: dailyLiquidationsVolume (default), dailyCollateralLiquidated - **dexs**: dailyVolume (default),… */
		dataType?: string;
	};
	'dimensions.metrics': {
		/** The dimension metric type */
		metric:
			| 'fees'
			| 'liquidations'
			| 'dexs'
			| 'derivatives'
			| 'options'
			| 'aggregators'
			| 'bridge-aggregators'
			| 'bridges'
			| 'open-interest'
			| 'normalized-volume'
			| 'active-users';
		/** Metric-specific data type to return. Supported values per metric: - **fees**: dailyFees (default), dailyRevenue, dailySupplySideRevenue, dailyHoldersRevenue, dailyProtocolRevenue - **liquidations**: dailyLiquidationsVolume (default), dailyCollateralLiquidated - **dexs**: dailyVolume (default),… */
		dataType?: string;
	};
	'dimensions.protocolChart': {
		/** The dimension metric type */
		metric:
			| 'fees'
			| 'liquidations'
			| 'dexs'
			| 'derivatives'
			| 'options'
			| 'aggregators'
			| 'bridge-aggregators'
			| 'bridges'
			| 'open-interest'
			| 'normalized-volume';
		/** protocol slug (slugified protocol name) */
		protocol: string;
		/** Metric-specific data type to return. Supported values per metric: - **fees**: dailyFees (default), dailyRevenue, dailySupplySideRevenue, dailyHoldersRevenue, dailyProtocolRevenue - **liquidations**: dailyLiquidationsVolume (default), dailyCollateralLiquidated - **dexs**: dailyVolume (default),… */
		dataType?: string;
	};
	'dimensions.protocolChartByChain': {
		/** The dimension metric type */
		metric:
			| 'fees'
			| 'liquidations'
			| 'dexs'
			| 'derivatives'
			| 'options'
			| 'aggregators'
			| 'bridge-aggregators'
			| 'bridges'
			| 'open-interest'
			| 'normalized-volume';
		/** protocol slug (slugified protocol name) */
		protocol: string;
		/** Metric-specific data type to return. Supported values per metric: - **fees**: dailyFees (default), dailyRevenue, dailySupplySideRevenue, dailyHoldersRevenue, dailyProtocolRevenue - **liquidations**: dailyLiquidationsVolume (default), dailyCollateralLiquidated - **dexs**: dailyVolume (default),… */
		dataType?: string;
	};
	'dimensions.protocolChartByLabel': {
		/** The dimension metric type */
		metric:
			| 'fees'
			| 'liquidations'
			| 'dexs'
			| 'derivatives'
			| 'options'
			| 'aggregators'
			| 'bridge-aggregators'
			| 'open-interest'
			| 'normalized-volume';
		/** protocol slug (slugified protocol name) */
		protocol: string;
		/** Metric-specific data type to return. Supported values per metric: - **fees**: dailyFees (default), dailyRevenue, dailySupplySideRevenue, dailyHoldersRevenue, dailyProtocolRevenue - **liquidations**: dailyLiquidationsVolume (default), dailyCollateralLiquidated - **dexs**: dailyVolume (default),… */
		dataType?: string;
	};
	'dimensions.protocolChartByVersion': {
		/** The dimension metric type */
		metric:
			| 'fees'
			| 'liquidations'
			| 'dexs'
			| 'derivatives'
			| 'options'
			| 'aggregators'
			| 'bridge-aggregators'
			| 'bridges'
			| 'open-interest'
			| 'normalized-volume';
		/** protocol slug (slugified protocol name) */
		protocol: string;
		/** Metric-specific data type to return. Supported values per metric: - **fees**: dailyFees (default), dailyRevenue, dailySupplySideRevenue, dailyHoldersRevenue, dailyProtocolRevenue - **liquidations**: dailyLiquidationsVolume (default), dailyCollateralLiquidated - **dexs**: dailyVolume (default),… */
		dataType?: string;
	};
	'dimensions.protocolMetrics': {
		/** The dimension metric type */
		metric:
			| 'fees'
			| 'liquidations'
			| 'dexs'
			| 'derivatives'
			| 'options'
			| 'aggregators'
			| 'bridge-aggregators'
			| 'bridges'
			| 'open-interest'
			| 'normalized-volume';
		/** protocol slug (slugified protocol name) */
		protocol: string;
		/** Metric-specific data type to return. Supported values per metric: - **fees**: dailyFees (default), dailyRevenue, dailySupplySideRevenue, dailyHoldersRevenue, dailyProtocolRevenue - **liquidations**: dailyLiquidationsVolume (default), dailyCollateralLiquidated - **dexs**: dailyVolume (default),… */
		dataType?: string;
	};
	'equities.companies': {
		/** Only return companies in this sector, as a slug (`technology`, `financial-services`) or as its label in any case (`Financial Services`). Valid values are the `sectorSlug`s returned by `GET /equities/v1/sectors`. An unknown value returns an empty list. */
		sector?: string;
		/** Only return companies in this industry, as a slug (`semiconductors`) or as its label in any case. Valid values are the `industrySlug`s returned by `GET /equities/v1/industries`. An unknown value returns an empty list. */
		industry?: string;
	};
	'equities.dimensions': {
		/** Stock ticker symbol (case-insensitive) */
		ticker: string;
		/** Two-letter country code (ISO 3166-1 alpha-2) for the company, as returned by `GET /equities/v1/companies-list` (case-insensitive). */
		country: string;
	};
	'equities.earningsCalendar': {
		/** Stock ticker symbol (case-insensitive). When set, returns that company's full calendar. */
		ticker?: string;
		/** Earliest `report_date` to include, as `YYYY-MM-DD` (inclusive). */
		from?: string;
		/** Latest `report_date` to include, as `YYYY-MM-DD` (inclusive). */
		to?: string;
		/** Only return rows with this `date_status` (case-insensitive). `confirmed` is accepted but nothing produces it yet, so it returns an empty list. */
		status?: 'reported' | 'inferred' | 'confirmed' | 'estimated';
		/** Maximum rows to return, taken from the earliest `report_date`. Positive integer; values above 20000 are capped at 20000. */
		limit?: number;
	};
	'equities.filings': {
		/** Stock ticker symbol (case-insensitive) */
		ticker: string;
		/** Two-letter country code (ISO 3166-1 alpha-2) for the company, as returned by `GET /equities/v1/companies-list` (case-insensitive). */
		country: string;
	};
	'equities.industries': {
		/** Only return industries in this sector, as a slug (`technology`, `financial-services`) or as its label in any case (`Financial Services`). Valid values are the `sectorSlug`s returned by `GET /equities/v1/sectors`. An unknown value returns an empty list. */
		sector?: string;
		/** Only return this industry, as a slug (`semiconductors`) or as its label in any case (`Semiconductors`). An unknown value returns an empty list. */
		industry?: string;
	};
	'equities.ohlcv': {
		/** Stock ticker symbol (case-insensitive) */
		ticker: string;
		/** Two-letter country code (ISO 3166-1 alpha-2) for the company, as returned by `GET /equities/v1/companies-list` (case-insensitive). */
		country: string;
		/** Optional lookback window (case-insensitive), same values as price history. `1D` returns the most recent trading session and `7D`/`1W` (aliases) the last 7 days, both as 5-minute bars; `1M` and longer are daily bars. `YTD` runs from January 1 of the current year. Omit or empty for full history… */
		timeframe?:
			| '1D'
			| '7D'
			| '1W'
			| '1M'
			| '3M'
			| '6M'
			| 'YTD'
			| '1Y'
			| '5Y'
			| 'MAX';
	};
	'equities.onchain': {
		/** Stock ticker symbol (case-insensitive) */
		ticker: string;
		/** Two-letter country code (ISO 3166-1 alpha-2) for the company, as returned by `GET /equities/v1/companies-list` (case-insensitive). */
		country: string;
	};
	'equities.priceHistory': {
		/** Stock ticker symbol (case-insensitive) */
		ticker: string;
		/** Two-letter country code (ISO 3166-1 alpha-2) for the company, as returned by `GET /equities/v1/companies-list` (case-insensitive). */
		country: string;
		/** Optional lookback window (case-insensitive). `1D` returns the most recent trading session and `7D`/`1W` (aliases) the last 7 days, both at 5-minute resolution; `1M` and longer are daily. `YTD` runs from January 1 of the current year. Omit or empty for full history (`MAX`). Intraday coverage is… */
		timeframe?:
			| '1D'
			| '7D'
			| '1W'
			| '1M'
			| '3M'
			| '6M'
			| 'YTD'
			| '1Y'
			| '5Y'
			| 'MAX';
	};
	'equities.sector': {
		/** Sector to return, as a slug (`technology`, `financial-services`) or as its label in any case (`Financial Services`). Valid values are the `sectorSlug`s returned by `GET /equities/v1/sectors`. */
		sector: string;
	};
	'equities.sectors': Record<string, never>;
	'equities.sectorsOverview': Record<string, never>;
	'equities.statements': {
		/** Stock ticker symbol (case-insensitive) */
		ticker: string;
		/** Two-letter country code (ISO 3166-1 alpha-2) for the company, as returned by `GET /equities/v1/companies-list` (case-insensitive). */
		country: string;
	};
	'equities.summary': {
		/** Stock ticker symbol (case-insensitive) */
		ticker: string;
		/** Two-letter country code (ISO 3166-1 alpha-2) for the company, as returned by `GET /equities/v1/companies-list` (case-insensitive). */
		country: string;
	};
	'etfs.flows': Record<string, never>;
	'etfs.snapshot': Record<string, never>;
	'fees.byChain': {
		/** chain name, list of all supported chains can be found under allChains attribute in /overview/fees response */
		chain: string;
		/** true to exclude aggregated chart from response */
		excludeTotalDataChart: boolean;
		/** true to exclude broken down chart from response */
		excludeTotalDataChartBreakdown: boolean;
		/** Desired data type, dailyFees by default. */
		dataType?: 'dailyFees' | 'dailyRevenue' | 'dailyHoldersRevenue';
	};
	'fees.overview': {
		/** true to exclude aggregated chart from response */
		excludeTotalDataChart: boolean;
		/** true to exclude broken down chart from response */
		excludeTotalDataChartBreakdown: boolean;
		/** Desired data type, dailyFees by default. */
		dataType?: 'dailyFees' | 'dailyRevenue' | 'dailyHoldersRevenue';
	};
	'fees.summary': {
		/** protocol slug */
		protocol: string;
		/** Desired data type, dailyFees by default. */
		dataType?: 'dailyFees' | 'dailyRevenue' | 'dailyHoldersRevenue';
	};
	'financialStatements.get': {
		/** protocol slug (e.g. aave-v3, hyperliquid) */
		protocol: string;
	};
	'forks.chartByProtocol': Record<string, never>;
	'forks.metrics': Record<string, never>;
	'forks.protocolChart': {
		/** protocol slug */
		protocol: string;
	};
	'narratives.performance': {
		/** One of ['7', '30', 'ytd', '365'] */
		period: string;
	};
	'oracles.chainChart': {
		/** chain name */
		chain: string;
	};
	'oracles.chainChartByProtocol': {
		/** chain name */
		chain: string;
	};
	'oracles.chart': Record<string, never>;
	'oracles.chartByChain': Record<string, never>;
	'oracles.chartByProtocol': Record<string, never>;
	'oracles.metrics': Record<string, never>;
	'oracles.protocolChart': {
		/** oracle/protocol name */
		protocol: string;
	};
	'oracles.protocolChartByChain': {
		/** oracle/protocol name */
		protocol: string;
	};
	'overview.categories': Record<string, never>;
	'overview.entities': Record<string, never>;
	'overview.forks': Record<string, never>;
	'overview.hacks': Record<string, never>;
	'overview.oracles': Record<string, never>;
	'overview.raises': Record<string, never>;
	'overview.treasuries': Record<string, never>;
	'perps.derivatives': {
		/** true to exclude aggregated chart from response */
		excludeTotalDataChart: boolean;
		/** true to exclude broken down chart from response */
		excludeTotalDataChartBreakdown: boolean;
	};
	'perps.derivativesSummary': {
		/** protocol slug */
		protocol: string;
		/** true to exclude aggregated chart from response */
		excludeTotalDataChart: boolean;
		/** true to exclude broken down chart from response */
		excludeTotalDataChartBreakdown: boolean;
	};
	'perps.openInterest': {
		/** true to exclude aggregated chart from response */
		excludeTotalDataChart: boolean;
		/** true to exclude broken down chart from response */
		excludeTotalDataChartBreakdown: boolean;
	};
	'preIpo.companies': Record<string, never>;
	'preIpo.integrations': {
		/** Company id from `GET /pre-ipo/v1/companies-list` (case-insensitive). The display `name` is not accepted. */
		company: string;
	};
	'preIpo.raises': {
		/** Company id from `GET /pre-ipo/v1/companies-list` (case-insensitive). The display `name` is not accepted. */
		company: string;
	};
	'preIpo.summary': {
		/** Company id from `GET /pre-ipo/v1/companies-list` (case-insensitive). The display `name` is not accepted. */
		company: string;
	};
	'preIpo.valuations': {
		/** Company id from `GET /pre-ipo/v1/companies-list` (case-insensitive). The display `name` is not accepted. */
		company: string;
	};
	'rwa.chain': {
		/** Chain display name, case-insensitive. */
		chain: string;
	};
	'rwa.chainChart': {
		/** Chain display name. The API normalizes it to the internal RWA slug. */
		chain: string;
	};
	'rwa.chartByChain': {
		/** Metric to break down by chain, defaults to `onChainMcap`. `onChainMcap` is Onchain AUM, `activeAum` is Active AUM and `defiActiveTvl` is DeFi Active TVL. The retired spelling `activeMcap` is still accepted here. */
		key?: 'onChainMcap' | 'activeAum' | 'defiActiveTvl';
	};
	'rwa.current': Record<string, never>;
	'rwa.list': Record<string, never>;
	'rwa.stats': Record<string, never>;
	'stablecoins.chains': Record<string, never>;
	'stablecoins.chartAll': {
		/** stablecoin ID, you can get these from /stablecoins */
		stablecoin?: number;
	};
	'stablecoins.chartByChain': {
		/** chain slug, you can get these from /chains or the chains property on /protocols */
		chain: string;
		/** stablecoin ID, you can get these from /stablecoins */
		stablecoin?: number;
	};
	'stablecoins.dominance': {
		/** chain slug, you can get these from /chains or the chains property on /protocols */
		chain: string;
		/** stablecoin ID, you can get these from /stablecoins */
		stablecoin?: number;
	};
	'stablecoins.get': {
		/** stablecoin ID, you can get these from /stablecoins */
		asset: number;
	};
	'stablecoins.list': {
		/** set whether to include current stablecoin prices */
		includePrices?: boolean;
	};
	'stablecoins.prices': Record<string, never>;
	'tokenLiquidity.history': {
		/** token slug */
		token: string;
	};
	'treasury.chart': {
		/** protocol slug */
		protocol: string;
		/** Token filter. Omit to exclude OwnTokens (default). Use "OwnTokens" to return only the protocol's own tokens, or "all" for the sum of all tokens including OwnTokens. */
		key?: 'OwnTokens' | 'all';
	};
	'treasury.chartByChain': {
		/** protocol slug */
		protocol: string;
		/** Token filter. Omit to exclude OwnTokens (default). Use "OwnTokens" to return only the protocol's own tokens, or "all" for the sum of all tokens including OwnTokens. */
		key?: 'OwnTokens' | 'all';
	};
	'treasury.chartByToken': {
		/** protocol slug */
		protocol: string;
		/** Token filter. Omit to exclude OwnTokens (default). Use "OwnTokens" to return only the protocol's own tokens, or "all" for the sum of all tokens including OwnTokens. */
		key?: 'OwnTokens' | 'all';
		/** Set to "tokens" to return values denominated in raw token amounts instead of USD */
		currency?: 'usd' | 'token' | 'raw';
	};
	'treasury.metrics': {
		/** protocol slug */
		protocol: string;
	};
	'tvl.chainAssets': Record<string, never>;
	'tvl.chains': Record<string, never>;
	'tvl.chart': {
		/** protocol slug */
		protocol: string;
		/** Metric to return. Omit for default TVL. Use "all" for the sum of tvl+borrowed+staking+pool2+vesting, or a specific metric like "staking", "borrowed", "vesting", "pool2". */
		key?: 'all' | 'staking' | 'borrowed' | 'vesting' | 'pool2';
	};
	'tvl.chartByChain': {
		/** protocol slug */
		protocol: string;
		/** Metric to return. Omit for default TVL. Use "all" for the sum of tvl+borrowed+staking+pool2+vesting, or a specific metric like "staking", "borrowed", "vesting", "pool2". */
		key?: 'all' | 'staking' | 'borrowed' | 'vesting' | 'pool2';
	};
	'tvl.chartByToken': {
		/** protocol slug */
		protocol: string;
		/** Metric to return. Omit for default TVL. Use "all" for the sum of tvl+borrowed+staking+pool2+vesting, or a specific metric like "staking", "borrowed", "vesting", "pool2". */
		key?: 'all' | 'staking' | 'borrowed' | 'vesting' | 'pool2';
		/** Set to "tokens" to return values denominated in raw token amounts instead of USD */
		currency?: 'usd' | 'token' | 'raw';
	};
	'tvl.current': {
		/** protocol slug */
		protocol: string;
	};
	'tvl.historicalChainTvl': Record<string, never>;
	'tvl.historicalChainTvlByChain': {
		/** chain slug, you can get these from /chains or the chains property on /protocols */
		chain: string;
	};
	'tvl.inflows': {
		/** protocol slug */
		protocol: string;
		/** unix timestamp */
		timestamp: number;
	};
	'tvl.metrics': {
		/** protocol slug */
		protocol: string;
	};
	'tvl.protocol': {
		/** protocol slug */
		protocol: string;
	};
	'tvl.protocols': Record<string, never>;
	'tvl.tokenProtocols': {
		/** token slug */
		symbol: string;
	};
	'unlocks.get': {
		/** protocol slug */
		protocol: string;
	};
	'unlocks.list': Record<string, never>;
	'volumes.dexSummary': {
		/** protocol slug */
		protocol: string;
		/** true to exclude aggregated chart from response */
		excludeTotalDataChart: boolean;
		/** true to exclude broken down chart from response */
		excludeTotalDataChartBreakdown: boolean;
	};
	'volumes.dexs': {
		/** true to exclude aggregated chart from response */
		excludeTotalDataChart: boolean;
		/** true to exclude broken down chart from response */
		excludeTotalDataChartBreakdown: boolean;
	};
	'volumes.dexsByChain': {
		/** chain name, list of all supported chains can be found under allChains attribute in /overview/dexs response */
		chain: string;
		/** true to exclude aggregated chart from response */
		excludeTotalDataChart: boolean;
		/** true to exclude broken down chart from response */
		excludeTotalDataChartBreakdown: boolean;
	};
	'volumes.options': {
		/** true to exclude aggregated chart from response */
		excludeTotalDataChart: boolean;
		/** true to exclude broken down chart from response */
		excludeTotalDataChartBreakdown: boolean;
		/** Desired data type, dailyNotionalVolume by default. */
		dataType?: 'dailyPremiumVolume' | 'dailyNotionalVolume';
	};
	'volumes.optionsByChain': {
		/** chain name, list of all supported chains can be found under allChains attribute in /overview/options response */
		chain: string;
		/** true to exclude aggregated chart from response */
		excludeTotalDataChart: boolean;
		/** true to exclude broken down chart from response */
		excludeTotalDataChartBreakdown: boolean;
		/** Desired data type, dailyNotionalVolume by default. */
		dataType?: 'dailyPremiumVolume' | 'dailyNotionalVolume';
	};
	'volumes.optionsSummary': {
		/** protocol slug */
		protocol: string;
		/** Desired data type, dailyNotionalVolume by default. */
		dataType?: 'dailyPremiumVolume' | 'dailyNotionalVolume';
	};
	'yields.borrow.marketHistory': {
		/** Borrow market id (UUID) */
		id: string;
		/** History window; defaults to max (the full series) */
		range?: '30d' | '90d' | 'max';
	};
	'yields.borrow.markets': Record<string, never>;
	'yields.borrow.routes': Record<string, never>;
	'yields.borrowPools': Record<string, never>;
	'yields.earn.history': {
		/** Earn pool id (UUID) */
		id: string;
		/** History window; defaults to max (the full series) */
		range?: '30d' | '90d' | 'max';
	};
	'yields.earn.list': Record<string, never>;
	'yields.earn.query': {
		/** Chain slug (lowercase). Repeat the parameter to match any of several chains, e.g. chain=ethereum&chain=arbitrum (at most 20 values) */
		chain?: string;
		/** Protocol slug (lowercase, e.g. aave-v3). Repeat the parameter to match any of several protocols (at most 20 values) */
		protocol?: string;
		/** true keeps only pools whose assets are all stablecoins, false only the rest */
		stablecoin?: boolean;
		/** true keeps only pools exposed to a single asset, false only the rest */
		single_asset_exposure?: boolean;
		/** true keeps only pools with impermanent loss risk, false only the rest */
		impermanent_loss_risk?: boolean;
		/** Minimum pool TVL in USD (inclusive) */
		min_tvl?: number;
		/** 1-based page number; default 1 */
		page?: number;
		/** Page size between 1 and 300; default 100. Values above 300 are rejected, not clamped */
		limit?: number;
	};
	'yields.earn.verified': Record<string, never>;
	'yields.earn.verifiedGet': {
		/** Earn pool id (UUID) */
		id: string;
	};
	'yields.earn.verifiedHistory': {
		/** Earn pool id (UUID) */
		id: string;
		/** History window; defaults to max (the full series) */
		range?: '30d' | '90d' | 'max';
	};
	'yields.lendBorrowChart': {
		/** pool id (UUID), from /yields/v1/poolsBorrow (property is called pool) */
		pool: string;
	};
	'yields.loops': Record<string, never>;
	'yields.lstRates': Record<string, never>;
	'yields.perpFundingRates': Record<string, never>;
	'yields.poolChart': {
		/** pool id (UUID), from /yields/v1/pools (property is called pool) */
		pool: string;
	};
	'yields.pools': Record<string, never>;
};

export type DefillamaOperationOutputs = {
	'account.usage': DefillamaJsonValue;
	'bridges.dayStats': {
		/** Date timestamp */
		date?: number | null;
		/** Total tokens deposited with their details */
		totalTokensDeposited?: Record<
			string,
			{
				/** USD value of the token */
				usdValue?: number | null;
				/** Token amount as string */
				amount?: string | null;
				/** Token symbol */
				symbol?: string | null;
				/** Token decimals */
				decimals?: number | null;
				[key: string]: unknown;
			}
		> | null;
		/** Total tokens withdrawn with their details */
		totalTokensWithdrawn?: Record<
			string,
			{
				/** USD value of the token */
				usdValue?: number | null;
				/** Token amount as string */
				amount?: string | null;
				/** Token symbol */
				symbol?: string | null;
				/** Token decimals */
				decimals?: number | null;
				[key: string]: unknown;
			}
		> | null;
		/** Total addresses that deposited with their details */
		totalAddressDeposited?: Record<
			string,
			{
				/** Total USD value deposited by this address */
				usdValue?: number | null;
				/** Number of transactions from this address */
				txs?: number | null;
				[key: string]: unknown;
			}
		> | null;
		/** Total addresses that withdrew with their details */
		totalAddressWithdrawn?: Record<
			string,
			{
				/** Total USD value withdrawn by this address */
				usdValue?: number | null;
				/** Number of transactions from this address */
				txs?: number | null;
				[key: string]: unknown;
			}
		> | null;
		[key: string]: unknown;
	};
	'bridges.get': {
		/** Bridge ID */
		id?: number | null;
		/** Bridge name */
		name?: string | null;
		/** Bridge display name */
		displayName?: string | null;
		/** Last hourly volume */
		lastHourlyVolume?: number | null;
		/** Current day volume */
		currentDayVolume?: number | null;
		/** Last daily volume */
		lastDailyVolume?: number | null;
		/** Day before last volume */
		dayBeforeLastVolume?: number | null;
		/** Weekly volume */
		weeklyVolume?: number | null;
		/** Monthly volume */
		monthlyVolume?: number | null;
		/** Last hourly transactions */
		lastHourlyTxs?: {
			/** Number of deposits */
			deposits?: number | null;
			/** Number of withdrawals */
			withdrawals?: number | null;
			[key: string]: unknown;
		} | null;
		/** Current day transactions */
		currentDayTxs?: {
			/** Number of deposits */
			deposits?: number | null;
			/** Number of withdrawals */
			withdrawals?: number | null;
			[key: string]: unknown;
		} | null;
		/** Previous day transactions */
		prevDayTxs?: {
			/** Number of deposits */
			deposits?: number | null;
			/** Number of withdrawals */
			withdrawals?: number | null;
			[key: string]: unknown;
		} | null;
		/** Day before last transactions */
		dayBeforeLastTxs?: {
			/** Number of deposits */
			deposits?: number | null;
			/** Number of withdrawals */
			withdrawals?: number | null;
			[key: string]: unknown;
		} | null;
		/** Weekly transactions */
		weeklyTxs?: {
			/** Number of deposits */
			deposits?: number | null;
			/** Number of withdrawals */
			withdrawals?: number | null;
			[key: string]: unknown;
		} | null;
		/** Monthly transactions */
		monthlyTxs?: {
			/** Number of deposits */
			deposits?: number | null;
			/** Number of withdrawals */
			withdrawals?: number | null;
			[key: string]: unknown;
		} | null;
		/** Volume breakdown by chain */
		chainBreakdown?: Record<string, DefillamaJsonValue> | null;
		/** Destination chain */
		destinationChain?: string | null;
		[key: string]: unknown;
	};
	'bridges.list': {
		/** List of bridges */
		bridges?: Array<{
			/** Bridge ID */
			id?: number | null;
			/** Bridge name */
			name?: string | null;
			/** Bridge display name */
			displayName?: string | null;
			/** Bridge icon */
			icon?: string | null;
			/** Previous day volume */
			volumePrevDay?: number | null;
			/** Previous 2 days volume */
			volumePrev2Day?: number | null;
			/** Last hourly volume */
			lastHourlyVolume?: number | null;
			/** Last 24 hours volume */
			last24hVolume?: number | null;
			/** Last daily volume */
			lastDailyVolume?: number | null;
			/** Day before last volume */
			dayBeforeLastVolume?: number | null;
			/** Weekly volume */
			weeklyVolume?: number | null;
			/** Monthly volume */
			monthlyVolume?: number | null;
			/** Supported chains */
			chains?: Array<string> | null;
			/** Destination chain */
			destinationChain?: string | null;
			/** Bridge URL */
			url?: string | null;
			/** Bridge slug */
			slug?: string | null;
			[key: string]: unknown;
		}> | null;
		[key: string]: unknown;
	};
	'bridges.transactions':
		| {
				/** Bridge ID */
				id?: number | null;
				/** Bridge name */
				name?: string | null;
				/** Bridge display name */
				displayName?: string | null;
				/** Last hourly volume */
				lastHourlyVolume?: number | null;
				/** Current day volume */
				currentDayVolume?: number | null;
				/** Last daily volume */
				lastDailyVolume?: number | null;
				/** Day before last volume */
				dayBeforeLastVolume?: number | null;
				/** Weekly volume */
				weeklyVolume?: number | null;
				/** Monthly volume */
				monthlyVolume?: number | null;
				lastHourlyTxs?: {
					/** Number of deposit transactions */
					deposits?: number | null;
					/** Number of withdrawal transactions */
					withdrawals?: number | null;
					[key: string]: unknown;
				} | null;
				currentDayTxs?: {
					/** Number of deposit transactions */
					deposits?: number | null;
					/** Number of withdrawal transactions */
					withdrawals?: number | null;
					[key: string]: unknown;
				} | null;
				prevDayTxs?: {
					/** Number of deposit transactions */
					deposits?: number | null;
					/** Number of withdrawal transactions */
					withdrawals?: number | null;
					[key: string]: unknown;
				} | null;
				dayBeforeLastTxs?: {
					/** Number of deposit transactions */
					deposits?: number | null;
					/** Number of withdrawal transactions */
					withdrawals?: number | null;
					[key: string]: unknown;
				} | null;
				weeklyTxs?: {
					/** Number of deposit transactions */
					deposits?: number | null;
					/** Number of withdrawal transactions */
					withdrawals?: number | null;
					[key: string]: unknown;
				} | null;
				monthlyTxs?: {
					/** Number of deposit transactions */
					deposits?: number | null;
					/** Number of withdrawal transactions */
					withdrawals?: number | null;
					[key: string]: unknown;
				} | null;
				chainBreakdown?: Record<
					string,
					{
						/** Last hourly volume */
						lastHourlyVolume?: number | null;
						/** Current day volume */
						currentDayVolume?: number | null;
						/** Last daily volume */
						lastDailyVolume?: number | null;
						/** Day before last volume */
						dayBeforeLastVolume?: number | null;
						/** Weekly volume */
						weeklyVolume?: number | null;
						/** Monthly volume */
						monthlyVolume?: number | null;
						/** Last 24 hour volume */
						last24hVolume?: number | null;
						lastHourlyTxs?: {
							/** Number of deposit transactions */
							deposits?: number | null;
							/** Number of withdrawal transactions */
							withdrawals?: number | null;
							[key: string]: unknown;
						} | null;
						currentDayTxs?: {
							/** Number of deposit transactions */
							deposits?: number | null;
							/** Number of withdrawal transactions */
							withdrawals?: number | null;
							[key: string]: unknown;
						} | null;
						prevDayTxs?: {
							/** Number of deposit transactions */
							deposits?: number | null;
							/** Number of withdrawal transactions */
							withdrawals?: number | null;
							[key: string]: unknown;
						} | null;
						dayBeforeLastTxs?: {
							/** Number of deposit transactions */
							deposits?: number | null;
							/** Number of withdrawal transactions */
							withdrawals?: number | null;
							[key: string]: unknown;
						} | null;
						weeklyTxs?: {
							/** Number of deposit transactions */
							deposits?: number | null;
							/** Number of withdrawal transactions */
							withdrawals?: number | null;
							[key: string]: unknown;
						} | null;
						monthlyTxs?: {
							/** Number of deposit transactions */
							deposits?: number | null;
							/** Number of withdrawal transactions */
							withdrawals?: number | null;
							[key: string]: unknown;
						} | null;
						[key: string]: unknown;
					}
				> | null;
				/** Destination chain */
				destinationChain?: string | null;
				[key: string]: unknown;
		  }
		| Array<{
				/** Transaction hash */
				tx_hash?: string | null;
				/** Timestamp in ISO format */
				ts?: string | null;
				/** Block number */
				tx_block?: number | null;
				/** From address */
				tx_from?: string | null;
				/** To address */
				tx_to?: string | null;
				/** Token contract address */
				token?: string | null;
				/** Transaction amount */
				amount?: string | null;
				/** Blockchain name */
				chain?: string | null;
				/** Bridge name */
				bridge_name?: string | null;
				/** USD value of transaction */
				usd_value?: number | null;
				/** Source chain name */
				sourceChain?: string | null;
				[key: string]: unknown;
		  }>;
	'bridges.volume': Array<{
		/** Date timestamp */
		date?: string | null;
		/** Deposit volume in USD */
		depositUSD?: number | null;
		/** Withdrawal volume in USD */
		withdrawUSD?: number | null;
		/** Number of deposit transactions */
		depositTxs?: number | null;
		/** Number of withdrawal transactions */
		withdrawTxs?: number | null;
		[key: string]: unknown;
	}>;
	'coins.batchHistorical': {
		coins?: {
			'avax:0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e'?: {
				symbol?: string | null;
				prices?: Array<{
					timestamp?: number | null;
					price?: number | null;
					confidence?: number | null;
					[key: string]: unknown;
				}> | null;
				[key: string]: unknown;
			} | null;
			[key: string]: unknown;
		} | null;
		[key: string]: unknown;
	};
	'coins.block': {
		height?: number | null;
		timestamp?: number | null;
		[key: string]: unknown;
	};
	'coins.chart': {
		coins?: {
			'ethereum:0xdF574c24545E5FfEcb9a659c229253D4111d87e1'?: {
				/** Token decimals. Omitted for coingecko-native assets (e.g. coingecko:ethereum). */
				decimals?: number | null;
				/** Confidence score between 0 and 1 indicating the reliability of the price. */
				confidence?: number | null;
				prices?: Array<{
					timestamp?: number | null;
					price?: number | null;
					[key: string]: unknown;
				}> | null;
				symbol?: string | null;
				[key: string]: unknown;
			} | null;
			[key: string]: unknown;
		} | null;
		[key: string]: unknown;
	};
	'coins.current': {
		coins?: {
			'ethereum:0xdF574c24545E5FfEcb9a659c229253D4111d87e1'?: {
				/** Token decimals. Omitted for coingecko-native assets (e.g. coingecko:ethereum). */
				decimals?: number | null;
				price?: number | null;
				symbol?: string | null;
				timestamp?: number | null;
				/** Confidence score between 0 and 1 indicating the reliability of the price. */
				confidence?: number | null;
				[key: string]: unknown;
			} | null;
			[key: string]: unknown;
		} | null;
		[key: string]: unknown;
	};
	'coins.first': {
		coins?: {
			'ethereum:0xdF574c24545E5FfEcb9a659c229253D4111d87e1'?: {
				price?: number | null;
				symbol?: string | null;
				timestamp?: number | null;
				[key: string]: unknown;
			} | null;
			[key: string]: unknown;
		} | null;
		[key: string]: unknown;
	};
	'coins.historical': {
		coins?: {
			'ethereum:0xdF574c24545E5FfEcb9a659c229253D4111d87e1'?: {
				/** Token decimals. Omitted for coingecko-native assets (e.g. coingecko:ethereum). */
				decimals?: number | null;
				price?: number | null;
				symbol?: string | null;
				timestamp?: number | null;
				/** Confidence score between 0 and 1 indicating the reliability of the price. */
				confidence?: number | null;
				[key: string]: unknown;
			} | null;
			[key: string]: unknown;
		} | null;
		[key: string]: unknown;
	};
	'coins.percentageChange': {
		coins?: {
			'ethereum:0xdF574c24545E5FfEcb9a659c229253D4111d87e1'?: number | null;
			[key: string]: unknown;
		} | null;
		[key: string]: unknown;
	};
	'dat.institution': {
		/** Unique institution identifier */
		institutionId?: number | null;
		/** Institution ticker symbol */
		ticker?: string | null;
		/** Institution name */
		name?: string | null;
		/** Institution type */
		type?: string | null;
		/** Institution rank */
		rank?: number | null;
		/** Current share price */
		price?: number | null;
		/** 24h price change percentage */
		priceChange24h?: number | null;
		/** 24h trading volume */
		volume24h?: number | null;
		/** Fully diluted shares - realized count */
		fd_realized?: string | null;
		/** Fully diluted shares - realistic count */
		fd_realistic?: string | null;
		/** Fully diluted shares - maximum count */
		fd_max?: string | null;
		/** Market cap using realized share count */
		mcap_realized?: number | null;
		/** Market cap using realistic share count */
		mcap_realistic?: number | null;
		/** Market cap using maximum share count */
		mcap_max?: number | null;
		/** Realized mNAV ratio */
		realized_mNAV?: number | null;
		/** Realistic mNAV ratio */
		realistic_mNAV?: number | null;
		/** Maximum mNAV ratio */
		max_mNAV?: number | null;
		/** Total cost basis of crypto holdings */
		totalCost?: number | null;
		/** Total USD value of crypto holdings */
		totalUsdValue?: number | null;
		/** Asset holdings by asset type */
		assets?: Record<
			string,
			{
				/** Amount of asset held */
				amount?: number | null;
				/** Average purchase price */
				avgPrice?: number | null;
				/** Current USD value */
				usdValue?: number | null;
				/** Total cost basis */
				cost?: number | null;
				[key: string]: unknown;
			}
		> | null;
		/** Metadata for assets held */
		assetsMeta?: Record<
			string,
			{
				/** Asset name */
				name?: string | null;
				/** Asset ticker */
				ticker?: string | null;
				[key: string]: unknown;
			}
		> | null;
		/** Historical OHLCV data */
		ohlcv?: Array<Array<DefillamaJsonValue>> | null;
		/** Historical asset value data */
		assetValue?: Array<Array<DefillamaJsonValue>> | null;
		/** Compact historical stats: [timestamp, fd_realized, fd_realistic, fd_maximum, mcap_realized, mcap_realistic, mcap_max, mnav_realized, mnav_realistic, mnav_max] */
		stats?: Array<Array<DefillamaJsonValue>> | null;
		/** Transaction history */
		transactions?: Array<{
			/** Transaction ID */
			id?: number | null;
			/** Asset type */
			asset?: string | null;
			/** Amount transacted */
			amount?: string | null;
			/** Average price per unit */
			avg_price?: string | null;
			/** Total USD value */
			usd_value?: string | null;
			/** Transaction start date */
			start_date?: string | null;
			/** Transaction end date */
			end_date?: string | null;
			/** Report date */
			report_date?: string | null;
			/** Transaction type */
			type?: string | null;
			/** Source type */
			source_type?: string | null;
			/** Source URL */
			source_url?: string | null;
			/** Source note with transaction details */
			source_note?: string | null;
			/** Whether transaction is approved */
			is_approved?: boolean | null;
			/** Rejection reason if not approved */
			reject_reason?: string | null;
			/** Last update timestamp */
			last_updated?: string | null;
			/** Institution ticker */
			ticker?: string | null;
			/** Asset name */
			assetName?: string | null;
			/** Asset ticker */
			assetTicker?: string | null;
			[key: string]: unknown;
		}> | null;
		/** Last update timestamp */
		lastUpdated?: string | null;
		[key: string]: unknown;
	};
	'dat.institutions': {
		institutionMetadata?: Record<
			string,
			{
				/** Unique institution identifier */
				institutionId?: number | null;
				/** Institution ticker symbol */
				ticker?: string | null;
				/** Institution name */
				name?: string | null;
				/** Institution type */
				type?: string | null;
				/** Current share price */
				price?: number | null;
				/** 24h price change percentage */
				priceChange24h?: number | null;
				/** 24h trading volume */
				volume24h?: number | null;
				/** Market cap using current outstanding shares */
				mcapRealized?: number | null;
				/** Market cap accounting for unavoidable dilution */
				mcapRealistic?: number | null;
				/** Market cap under maximum dilution scenario */
				mcapMax?: number | null;
				/** Ratio of marketcap to crypto treasury using current shares */
				realized_mNAV?: number | null;
				/** Ratio accounting for unavoidable dilution */
				realistic_mNAV?: number | null;
				/** Ratio under maximum dilution scenario */
				max_mNAV?: number | null;
				/** Total USD value of crypto holdings */
				totalUsdValue?: number | null;
				/** Total cost basis of crypto holdings */
				totalCost?: number | null;
				holdings?: Record<
					string,
					{
						/** Amount of asset held */
						amount?: number | null;
						/** Average purchase price */
						avgPrice?: number | null;
						/** Current USD value */
						usdValue?: number | null;
						/** Total cost basis */
						cost?: number | null;
						/** Number of transactions */
						transactionCount?: number | null;
						/** Date of first announcement */
						firstAnnouncementDate?: string | null;
						/** Date of last announcement */
						lastAnnouncementDate?: string | null;
						/** Percentage of total supply held */
						supplyPercentage?: number | null;
						[key: string]: unknown;
					}
				> | null;
				[key: string]: unknown;
			}
		> | null;
		assetMetadata?: Record<
			string,
			{
				/** Asset name */
				name?: string | null;
				/** Asset ticker */
				ticker?: string | null;
				/** CoinGecko ID */
				geckoId?: string | null;
				/** Number of companies holding this asset */
				companies?: number | null;
				/** Total amount held across all institutions */
				totalAmount?: number | null;
				/** Total USD value across all institutions */
				totalUsdValue?: number | null;
				/** Percentage of circulating supply held */
				circSupplyPerc?: number | null;
				[key: string]: unknown;
			}
		> | null;
		institutions?: Array<{
			/** Institution ID */
			institutionId?: number | null;
			/** Total USD value of holdings */
			totalUsdValue?: number | null;
			/** Total cost basis */
			totalCost?: number | null;
			[key: string]: unknown;
		}> | null;
		assets?: Record<
			string,
			Array<{
				/** Institution ID */
				institutionId?: number | null;
				/** USD value of holding */
				usdValue?: number | null;
				/** Amount held */
				amount?: number | null;
				[key: string]: unknown;
			}>
		> | null;
		/** Total number of companies tracked */
		totalCompanies?: number | null;
		flows?: Record<string, Array<Array<DefillamaJsonValue>>> | null;
		mNAV?: Record<
			string,
			Record<string, Array<Array<DefillamaJsonValue>>>
		> | null;
		/** Last update timestamp */
		lastUpdated?: string | null;
		[key: string]: unknown;
	};
	'dimensions.categories': Array<{
		category?: string | null;
		total24h?: number | null;
		total7d?: number | null;
		total30d?: number | null;
		chains?: Array<string> | null;
		[key: string]: unknown;
	}>;
	'dimensions.categoryChainChart': Array<Array<number>>;
	'dimensions.categoryChainChartByProtocol': Array<DefillamaJsonValue>;
	'dimensions.categoryChainMetrics': {
		allChains?: Array<string> | null;
		total24h?: number | null;
		total48hto24h?: number | null;
		total7d?: number | null;
		total14dto7d?: number | null;
		total60dto30d?: number | null;
		total30d?: number | null;
		total1y?: number | null;
		change_1d?: number | null;
		change_7d?: number | null;
		change_1m?: number | null;
		change_7dover7d?: number | null;
		change_30dover30d?: number | null;
		category?: string | null;
		allCategories?: Array<string> | null;
		chain?: string | null;
		[key: string]: unknown;
	};
	'dimensions.categoryChart': Array<Array<number>>;
	'dimensions.categoryChartByChain': Array<DefillamaJsonValue>;
	'dimensions.categoryChartByProtocol': Array<DefillamaJsonValue>;
	'dimensions.categoryMetrics': {
		allChains?: Array<string> | null;
		total24h?: number | null;
		total48hto24h?: number | null;
		total7d?: number | null;
		total14dto7d?: number | null;
		total60dto30d?: number | null;
		total30d?: number | null;
		total1y?: number | null;
		change_1d?: number | null;
		change_7d?: number | null;
		change_1m?: number | null;
		change_7dover7d?: number | null;
		change_30dover30d?: number | null;
		category?: string | null;
		allCategories?: Array<string> | null;
		[key: string]: unknown;
	};
	'dimensions.chainChart': Array<Array<number>>;
	'dimensions.chainChartByProtocol': Array<DefillamaJsonValue>;
	'dimensions.chainMetrics': {
		allChains?: Array<string> | null;
		total24h?: number | null;
		total48hto24h?: number | null;
		total7d?: number | null;
		total14dto7d?: number | null;
		total60dto30d?: number | null;
		total30d?: number | null;
		total1y?: number | null;
		change_1d?: number | null;
		change_7d?: number | null;
		change_1m?: number | null;
		change_7dover7d?: number | null;
		change_30dover30d?: number | null;
		chain?: string | null;
		[key: string]: unknown;
	};
	'dimensions.chart': Array<Array<number>>;
	'dimensions.chartByChain': Array<DefillamaJsonValue>;
	'dimensions.chartByProtocol': Array<DefillamaJsonValue>;
	'dimensions.metrics': {
		allChains?: Array<string> | null;
		total24h?: number | null;
		total48hto24h?: number | null;
		total7d?: number | null;
		total14dto7d?: number | null;
		total60dto30d?: number | null;
		total30d?: number | null;
		total1y?: number | null;
		change_1d?: number | null;
		change_7d?: number | null;
		change_1m?: number | null;
		change_7dover7d?: number | null;
		change_30dover30d?: number | null;
		[key: string]: unknown;
	};
	'dimensions.protocolChart': Array<Array<number>>;
	'dimensions.protocolChartByChain': Array<DefillamaJsonValue>;
	'dimensions.protocolChartByLabel': Array<DefillamaJsonValue>;
	'dimensions.protocolChartByVersion': Array<DefillamaJsonValue>;
	'dimensions.protocolMetrics': {
		id?: string | null;
		name?: string | null;
		url?: string | null;
		description?: string | null;
		logo?: string | null;
		chains?: Array<string> | null;
		gecko_id?: string | null;
		cmcId?: string | null;
		symbol?: string | null;
		twitter?: string | null;
		github?: Array<string> | null;
		treasury?: string | null;
		governanceID?: Array<string> | null;
		wrongLiquidity?: boolean | null;
		stablecoins?: Array<string> | null;
		total24h?: number | null;
		total48hto24h?: number | null;
		total7d?: number | null;
		total30d?: number | null;
		total1y?: number | null;
		change_1d?: number | null;
		change_7d?: number | null;
		change_1m?: number | null;
		[key: string]: unknown;
	};
	'equities.companies': Array<{
		ticker?: string | null;
		companyName?: string | null;
		country?: string | null;
		countryName?: string | null;
		/** Sector id, the same value `GET /equities/v1/sectors` returns. `unknown` when the vendor left the company unclassified. */
		sectorSlug?: string | null;
		/** Industry id, the same value `GET /equities/v1/industries` returns. */
		industrySlug?: string | null;
		[key: string]: unknown;
	}>;
	'equities.dimensions': Record<
		string,
		{
			/** Annual data points, newest first. Each item is `[periodEnding, value]`. */
			annual?: Array<Array<string | number>> | null;
			/** Quarterly data points, newest first. Each item is `[periodEnding, value]`. */
			quarterly?: Array<Array<string | number>> | null;
			[key: string]: unknown;
		}
	>;
	'equities.earningsCalendar': Array<{
		ticker?: string | null;
		iso2_country_code?: string | null;
		/** SEC CIK of the registrant that filed the row. Differs from the company's current CIK for rows inherited from a predecessor after a reorganisation. */
		cik?: string | null;
		/** `<fiscal_year>-<fiscal_period>`, the row's identity. When the report arrives, its row replaces the estimate with the same key. */
		event_key?: string | null;
		/** `reported`: an earnings release (8-K Item 2.02) was filed. `inferred`: no release that quarter, so the date comes from the 10-Q or 10-K (filing-backed, but weaker). `estimated`: projected from the company's past cadence. `confirmed`: announced by the company; not produced yet. */
		date_status?: string | null;
		/** US Eastern date of the report, from the SEC acceptance timestamp rather than EDGAR's filing date. */
		report_date?: string | null;
		/** `bmo`: before 09:30 ET. `dmt`: during market hours. `amc`: after 16:00 ET. `unknown`: no timestamp, as on estimates. Taken from the SEC acceptance time, not the newswire. */
		report_time?: string | null;
		/** Raw SEC acceptance timestamp, in UTC. Empty on estimates. */
		accepted_at?: string | null;
		/** Fiscal year the quarter belongs to, named for the calendar year it ends in. */
		fiscal_year?: number | null;
		fiscal_period?: string | null;
		/** Last day of the fiscal period the report covers. Empty for a release whose 10-Q has not been filed yet, and for estimates projected from one. */
		period_end?: string | null;
		/** `8k_item_202`: an earnings release. `periodic_filing`: a 10-Q or 10-K, used when there was no release. `cadence_model`: an estimate. */
		source?: string | null;
		/** SEC form the date comes from, such as `8-K`, `10-Q` or `10-K`. Empty on estimates. */
		source_form?: string | null;
		/** SEC accession number of that filing. Empty on estimates. */
		accession_number?: string | null;
		/** On estimates, how many days either side of `report_date` the real date may land. 96% of real dates fell inside this range when tested against past reports. Wider for small caps and short histories. `null` on filing-backed rows. */
		max_drift_days?: number | null;
		/** When this `event_key` was first published (`YYYY-MM-DD HH:MM:SS.sss`). */
		first_published_at?: string | null;
		/** How many times the filing-backed date has moved since it was first published. */
		revision_count?: number | null;
		/** The `report_date` before the most recent move. Empty if it never moved. */
		previous_report_date?: string | null;
		/** When this row was last written (`YYYY-MM-DD HH:MM:SS.sss`). */
		inserted_at?: string | null;
		[key: string]: unknown;
	}>;
	'equities.filings': Array<{
		filingDate?: string | null;
		reportDate?: string | null;
		form?: string | null;
		primaryDocumentUrl?: string | null;
		documentDescription?: string | null;
		[key: string]: unknown;
	}>;
	'equities.industries': Array<{
		/** Industry name as the data vendor labels it. */
		industry?: string | null;
		/** URL-safe industry id. Pass it as `industry` to filter. */
		industrySlug?: string | null;
		/** Sector name as the data vendor labels it (not GICS). Companies the vendor left unclassified roll up into `Unknown`. */
		sector?: string | null;
		/** URL-safe sector id. Pass it as `sector` to the other equities endpoints. */
		sectorSlug?: string | null;
		/** Position by market cap, starting at 1. See the note on ranking above. */
		rank?: number | null;
		/** Share of all tracked US equity market cap, in percent. */
		weight?: number | null;
		/** Share of the parent sector's market cap, in percent. */
		sectorWeight?: number | null;
		/** Share of all tracked US value traded in the latest session, in percent. */
		dollarVolumeShare24h?: number | null;
		/** Total market cap of the constituents, in USD. */
		marketCap?: number | null;
		/** Change in total market cap over the latest session, in USD. Reconciles exactly with `priceChangePercentage1d`. */
		marketCapChange1d?: number | null;
		/** Value traded in the latest session (shares traded × price, summed), in USD. Reads low while a session is still open; `volumeAsOf` says when it was taken. */
		dollarVolume24h?: number | null;
		/** Total trailing twelve month revenue, in USD. */
		revenueTTM?: number | null;
		/** Total trailing twelve month earnings, in USD. */
		earningsTTM?: number | null;
		/** Total trailing twelve month EBITDA, in USD. */
		ebitdaTTM?: number | null;
		/** Total enterprise value, in USD. */
		enterpriseValue?: number | null;
		/** Total employees across the constituents that report a headcount. `null` when none do. */
		employeeCount?: number | null;
		/** Aggregate price to earnings: total market cap / total TTM earnings. `null` when total earnings are zero or negative; use `earningsYield` then. */
		trailingPE?: number | null;
		/** 100 × total TTM earnings / total market cap, in percent. Signed, so it stays defined when `trailingPE` is `null` for a loss-making group. */
		earningsYield?: number | null;
		/** Aggregate price to sales: total market cap / total TTM revenue. */
		priceToRevenue?: number | null;
		/** Aggregate price to book: total market cap / total shareholders' equity. */
		priceToBook?: number | null;
		/** Aggregate EV/EBITDA: total enterprise value / total TTM EBITDA. */
		enterpriseValueToEbitda?: number | null;
		/** 100 × total TTM dividends / total market cap, in percent. */
		dividendYield?: number | null;
		/** 100 × total TTM holders' revenue (dividends plus buybacks, net of share issuance) / total market cap, in percent. */
		holdersYield?: number | null;
		/** Total TTM operating income / total TTM revenue, in percent. Weighted by revenue, not market cap. */
		operatingProfitMarginTTM?: number | null;
		/** Cap-weighted price change over the latest session, in percent (`0.86` is +0.86%). */
		priceChangePercentage1d?: number | null;
		/** Cap-weighted price change over the last 7 days, in percent. */
		priceChangePercentage7d?: number | null;
		/** Cap-weighted price change over the last 30 days, in percent. */
		priceChangePercentage1m?: number | null;
		/** Cap-weighted price change over the last 3 calendar months, in percent. */
		priceChangePercentage3m?: number | null;
		/** Cap-weighted price change over the last 6 calendar months, in percent. */
		priceChangePercentage6m?: number | null;
		/** Cap-weighted price change since January 1, in percent. */
		priceChangePercentageYtd?: number | null;
		/** Cap-weighted price change over the last year, in percent. */
		priceChangePercentage1y?: number | null;
		/** Number of constituents. */
		companyCount?: number | null;
		/** Share of the constituents' market cap that supplied each metric's inputs, from 0 to 1, keyed by metric name. A ratio is served as `null` when its coverage is below 0.6, rather than as a figure computed over the wrong subset. */
		coverage?: Record<string, number> | null;
		/** Most recent quote time across the constituents. */
		updatedAt?: string | null;
		/** When `dollarVolume24h` was taken. */
		volumeAsOf?: string | null;
		/** The three largest constituents by market cap. */
		topHoldings?: Array<{
			ticker?: string | null;
			name?: string | null;
			/** Market cap, in USD. */
			marketCap?: number | null;
			/** Share of this industry's market cap, in percent. The name matches the sector holdings. */
			sectorWeight?: number | null;
			/** Price change over the latest session, in percent. */
			priceChangePercentage1d?: number | null;
			[key: string]: unknown;
		}> | null;
		[key: string]: unknown;
	}>;
	'equities.ohlcv': Array<Array<number>>;
	'equities.onchain': {
		/** Perpetual futures markets tracking the stock. */
		perps?: Array<{
			/** Market pair as the venue names it. */
			pair?: string | null;
			/** Last traded price of the contract, in USD. */
			price?: number | null;
			/** 24 hour volume, in USD. */
			volume24h?: number | null;
			/** Open interest, in USD. */
			openInterest?: number | null;
			/** Annualised funding rate, in percent, so `-70.13` is -70.13% a year. Negative means shorts pay longs. */
			annualizedFundingRate?: number | null;
			/** Direct link to the market on the venue. */
			tradeUrl?: string | null;
			/** DefiLlama market identifier, `{venue}:{symbol}`. */
			contractSlug?: string | null;
			/** DefiLlama protocol slug for the exchange, when it has one. */
			exchangeProtocolSlug?: string | null;
			/** DefiLlama RWA platform slug for the venue, when it has one. */
			rwaPlatformSlug?: string | null;
			/** Whether the venue is a centralised or an on-chain exchange. */
			exchangeType?: string | null;
			/** When this market was last refreshed. */
			updatedAt?: string | null;
			[key: string]: unknown;
		}> | null;
		/** Tokenised equity products tracking the stock. */
		tokens?: Array<{
			/** Legal entity issuing the tokenised share, not the listed company. */
			issuer?: string | null;
			/** DefiLlama RWA platform slug for the issuer. */
			issuerRwaPlatformSlug?: string | null;
			/** Token price, in USD. */
			price?: number | null;
			/** Token symbol as the issuer lists it. */
			assetSlug?: string | null;
			/** Market cap of the token across active markets, in USD. `null` when no market reports one. */
			activeMarketcap?: number | null;
			[key: string]: unknown;
		}> | null;
		[key: string]: unknown;
	};
	'equities.priceHistory': Array<Array<string | number>>;
	'equities.sector': {
		/** Sector name as the data vendor labels it (not GICS). Companies the vendor left unclassified roll up into `Unknown`. */
		sector?: string | null;
		/** URL-safe sector id. Pass it as `sector` to the other equities endpoints. */
		sectorSlug?: string | null;
		/** Position by market cap, starting at 1. */
		rank?: number | null;
		/** Share of all tracked US equity market cap, in percent. Sums to 100 across sectors, `Unknown` included. */
		weight?: number | null;
		/** Share of all tracked US value traded in the latest session, in percent. */
		dollarVolumeShare24h?: number | null;
		/** Number of distinct industries in the sector. */
		industryCount?: number | null;
		/** Total market cap of the constituents, in USD. */
		marketCap?: number | null;
		/** Change in total market cap over the latest session, in USD. Reconciles exactly with `priceChangePercentage1d`. */
		marketCapChange1d?: number | null;
		/** Value traded in the latest session (shares traded × price, summed), in USD. Reads low while a session is still open; `volumeAsOf` says when it was taken. */
		dollarVolume24h?: number | null;
		/** Total trailing twelve month revenue, in USD. */
		revenueTTM?: number | null;
		/** Total trailing twelve month earnings, in USD. */
		earningsTTM?: number | null;
		/** Total trailing twelve month EBITDA, in USD. */
		ebitdaTTM?: number | null;
		/** Total enterprise value, in USD. */
		enterpriseValue?: number | null;
		/** Total employees across the constituents that report a headcount. `null` when none do. */
		employeeCount?: number | null;
		/** Aggregate price to earnings: total market cap / total TTM earnings. `null` when total earnings are zero or negative; use `earningsYield` then. */
		trailingPE?: number | null;
		/** 100 × total TTM earnings / total market cap, in percent. Signed, so it stays defined when `trailingPE` is `null` for a loss-making group. */
		earningsYield?: number | null;
		/** Aggregate price to sales: total market cap / total TTM revenue. */
		priceToRevenue?: number | null;
		/** Aggregate price to book: total market cap / total shareholders' equity. */
		priceToBook?: number | null;
		/** Aggregate EV/EBITDA: total enterprise value / total TTM EBITDA. */
		enterpriseValueToEbitda?: number | null;
		/** 100 × total TTM dividends / total market cap, in percent. */
		dividendYield?: number | null;
		/** 100 × total TTM holders' revenue (dividends plus buybacks, net of share issuance) / total market cap, in percent. */
		holdersYield?: number | null;
		/** Total TTM operating income / total TTM revenue, in percent. Weighted by revenue, not market cap. */
		operatingProfitMarginTTM?: number | null;
		/** Cap-weighted price change over the latest session, in percent (`0.86` is +0.86%). */
		priceChangePercentage1d?: number | null;
		/** Cap-weighted price change over the last 7 days, in percent. */
		priceChangePercentage7d?: number | null;
		/** Cap-weighted price change over the last 30 days, in percent. */
		priceChangePercentage1m?: number | null;
		/** Cap-weighted price change over the last 3 calendar months, in percent. */
		priceChangePercentage3m?: number | null;
		/** Cap-weighted price change over the last 6 calendar months, in percent. */
		priceChangePercentage6m?: number | null;
		/** Cap-weighted price change since January 1, in percent. */
		priceChangePercentageYtd?: number | null;
		/** Cap-weighted price change over the last year, in percent. */
		priceChangePercentage1y?: number | null;
		/** Number of constituents. */
		companyCount?: number | null;
		/** Share of the constituents' market cap that supplied each metric's inputs, from 0 to 1, keyed by metric name. A ratio is served as `null` when its coverage is below 0.6, rather than as a figure computed over the wrong subset. */
		coverage?: Record<string, number> | null;
		/** Most recent quote time across the constituents. */
		updatedAt?: string | null;
		/** When `dollarVolume24h` was taken. */
		volumeAsOf?: string | null;
		/** The ten largest constituents by market cap. */
		topHoldings?: Array<{
			ticker?: string | null;
			name?: string | null;
			/** Market cap, in USD. */
			marketCap?: number | null;
			/** Share of this sector's market cap, in percent. */
			sectorWeight?: number | null;
			/** Price change over the latest session, in percent. */
			priceChangePercentage1d?: number | null;
			[key: string]: unknown;
		}> | null;
		/** Short description of what the sector covers. */
		description?: string | null;
		/** The sector's aggregate ratios (same values as the top-level fields) next to the median of its constituents' own ratios. Compare aggregate with aggregate and median with median, for example against `GET /equities/v1/sectors-overview`. */
		valuation?: {
			/** Aggregate P/E. */
			trailingPE?: number | null;
			/** Aggregate earnings yield, in percent. */
			earningsYield?: number | null;
			/** Aggregate price to sales. */
			priceToRevenue?: number | null;
			/** Aggregate price to book. */
			priceToBook?: number | null;
			/** Aggregate EV/EBITDA. */
			enterpriseValueToEbitda?: number | null;
			/** Revenue-weighted TTM operating margin, in percent. */
			operatingProfitMarginTTM?: number | null;
			/** Aggregate dividend yield, in percent. */
			dividendYield?: number | null;
			/** Median of the constituents' own P/E, over those with a positive one. */
			medianTrailingPE?: number | null;
			/** Median of the constituents' own price to sales, over those with a positive one. */
			medianPriceToRevenue?: number | null;
			/** Median of the constituents' own price to book, over those with a positive one. */
			medianPriceToBook?: number | null;
			/** Median of the constituents' own EV/EBITDA, over those with a positive one. */
			medianEnterpriseValueToEbitda?: number | null;
			/** Median of the constituents' own TTM operating margin, in percent. */
			medianOperatingProfitMarginTTM?: number | null;
			/** Median of the constituents' own dividend yield, in percent. */
			medianDividendYield?: number | null;
			[key: string]: unknown;
		} | null;
		/** How much of the sector's market cap sits in its largest constituents. */
		concentration?: {
			/** Share of the sector's market cap held by its ten largest constituents, in percent. */
			top10MarketCapShare?: number | null;
			/** Herfindahl-Hirschman index over the constituents' percentage shares of sector market cap, from 0 to 10,000. A single-company sector is 10,000 and ten equal constituents are 1,000. */
			hhi?: number | null;
			/** Number of constituents with a market cap of at least `megaCapThreshold`. */
			megaCapCount?: number | null;
			/** Market cap, in USD, from which a company counts as mega cap. */
			megaCapThreshold?: number | null;
			/** Median constituent market cap, in USD. */
			medianMarketCap?: number | null;
			[key: string]: unknown;
		} | null;
		[key: string]: unknown;
	};
	'equities.sectors': Array<{
		/** Sector name as the data vendor labels it (not GICS). Companies the vendor left unclassified roll up into `Unknown`. */
		sector?: string | null;
		/** URL-safe sector id. Pass it as `sector` to the other equities endpoints. */
		sectorSlug?: string | null;
		/** Position by market cap, starting at 1. */
		rank?: number | null;
		/** Share of all tracked US equity market cap, in percent. Sums to 100 across sectors, `Unknown` included. */
		weight?: number | null;
		/** Share of all tracked US value traded in the latest session, in percent. */
		dollarVolumeShare24h?: number | null;
		/** Number of distinct industries in the sector. */
		industryCount?: number | null;
		/** Total market cap of the constituents, in USD. */
		marketCap?: number | null;
		/** Change in total market cap over the latest session, in USD. Reconciles exactly with `priceChangePercentage1d`. */
		marketCapChange1d?: number | null;
		/** Value traded in the latest session (shares traded × price, summed), in USD. Reads low while a session is still open; `volumeAsOf` says when it was taken. */
		dollarVolume24h?: number | null;
		/** Total trailing twelve month revenue, in USD. */
		revenueTTM?: number | null;
		/** Total trailing twelve month earnings, in USD. */
		earningsTTM?: number | null;
		/** Total trailing twelve month EBITDA, in USD. */
		ebitdaTTM?: number | null;
		/** Total enterprise value, in USD. */
		enterpriseValue?: number | null;
		/** Total employees across the constituents that report a headcount. `null` when none do. */
		employeeCount?: number | null;
		/** Aggregate price to earnings: total market cap / total TTM earnings. `null` when total earnings are zero or negative; use `earningsYield` then. */
		trailingPE?: number | null;
		/** 100 × total TTM earnings / total market cap, in percent. Signed, so it stays defined when `trailingPE` is `null` for a loss-making group. */
		earningsYield?: number | null;
		/** Aggregate price to sales: total market cap / total TTM revenue. */
		priceToRevenue?: number | null;
		/** Aggregate price to book: total market cap / total shareholders' equity. */
		priceToBook?: number | null;
		/** Aggregate EV/EBITDA: total enterprise value / total TTM EBITDA. */
		enterpriseValueToEbitda?: number | null;
		/** 100 × total TTM dividends / total market cap, in percent. */
		dividendYield?: number | null;
		/** 100 × total TTM holders' revenue (dividends plus buybacks, net of share issuance) / total market cap, in percent. */
		holdersYield?: number | null;
		/** Total TTM operating income / total TTM revenue, in percent. Weighted by revenue, not market cap. */
		operatingProfitMarginTTM?: number | null;
		/** Cap-weighted price change over the latest session, in percent (`0.86` is +0.86%). */
		priceChangePercentage1d?: number | null;
		/** Cap-weighted price change over the last 7 days, in percent. */
		priceChangePercentage7d?: number | null;
		/** Cap-weighted price change over the last 30 days, in percent. */
		priceChangePercentage1m?: number | null;
		/** Cap-weighted price change over the last 3 calendar months, in percent. */
		priceChangePercentage3m?: number | null;
		/** Cap-weighted price change over the last 6 calendar months, in percent. */
		priceChangePercentage6m?: number | null;
		/** Cap-weighted price change since January 1, in percent. */
		priceChangePercentageYtd?: number | null;
		/** Cap-weighted price change over the last year, in percent. */
		priceChangePercentage1y?: number | null;
		/** Number of constituents. */
		companyCount?: number | null;
		/** Share of the constituents' market cap that supplied each metric's inputs, from 0 to 1, keyed by metric name. A ratio is served as `null` when its coverage is below 0.6, rather than as a figure computed over the wrong subset. */
		coverage?: Record<string, number> | null;
		/** Most recent quote time across the constituents. */
		updatedAt?: string | null;
		/** When `dollarVolume24h` was taken. */
		volumeAsOf?: string | null;
		/** The three largest constituents by market cap. `GET /equities/v1/sector` returns ten. */
		topHoldings?: Array<{
			ticker?: string | null;
			name?: string | null;
			/** Market cap, in USD. */
			marketCap?: number | null;
			/** Share of this sector's market cap, in percent. */
			sectorWeight?: number | null;
			/** Price change over the latest session, in percent. */
			priceChangePercentage1d?: number | null;
			[key: string]: unknown;
		}> | null;
		[key: string]: unknown;
	}>;
	'equities.sectorsOverview': {
		/** Total market cap of the constituents, in USD. */
		marketCap?: number | null;
		/** Change in total market cap over the latest session, in USD. Reconciles exactly with `priceChangePercentage1d`. */
		marketCapChange1d?: number | null;
		/** Value traded in the latest session (shares traded × price, summed), in USD. Reads low while a session is still open; `volumeAsOf` says when it was taken. */
		dollarVolume24h?: number | null;
		/** Total trailing twelve month revenue, in USD. */
		revenueTTM?: number | null;
		/** Total trailing twelve month earnings, in USD. */
		earningsTTM?: number | null;
		/** Total trailing twelve month EBITDA, in USD. */
		ebitdaTTM?: number | null;
		/** Total enterprise value, in USD. */
		enterpriseValue?: number | null;
		/** Total employees across the constituents that report a headcount. `null` when none do. */
		employeeCount?: number | null;
		/** Aggregate price to earnings: total market cap / total TTM earnings. `null` when total earnings are zero or negative; use `earningsYield` then. */
		trailingPE?: number | null;
		/** 100 × total TTM earnings / total market cap, in percent. Signed, so it stays defined when `trailingPE` is `null` for a loss-making group. */
		earningsYield?: number | null;
		/** Aggregate price to sales: total market cap / total TTM revenue. */
		priceToRevenue?: number | null;
		/** Aggregate price to book: total market cap / total shareholders' equity. */
		priceToBook?: number | null;
		/** Aggregate EV/EBITDA: total enterprise value / total TTM EBITDA. */
		enterpriseValueToEbitda?: number | null;
		/** 100 × total TTM dividends / total market cap, in percent. */
		dividendYield?: number | null;
		/** 100 × total TTM holders' revenue (dividends plus buybacks, net of share issuance) / total market cap, in percent. */
		holdersYield?: number | null;
		/** Total TTM operating income / total TTM revenue, in percent. Weighted by revenue, not market cap. */
		operatingProfitMarginTTM?: number | null;
		/** Cap-weighted price change over the latest session, in percent (`0.86` is +0.86%). */
		priceChangePercentage1d?: number | null;
		/** Cap-weighted price change over the last 7 days, in percent. */
		priceChangePercentage7d?: number | null;
		/** Cap-weighted price change over the last 30 days, in percent. */
		priceChangePercentage1m?: number | null;
		/** Cap-weighted price change over the last 3 calendar months, in percent. */
		priceChangePercentage3m?: number | null;
		/** Cap-weighted price change over the last 6 calendar months, in percent. */
		priceChangePercentage6m?: number | null;
		/** Cap-weighted price change since January 1, in percent. */
		priceChangePercentageYtd?: number | null;
		/** Cap-weighted price change over the last year, in percent. */
		priceChangePercentage1y?: number | null;
		/** Number of constituents. */
		companyCount?: number | null;
		/** Share of the constituents' market cap that supplied each metric's inputs, from 0 to 1, keyed by metric name. A ratio is served as `null` when its coverage is below 0.6, rather than as a figure computed over the wrong subset. */
		coverage?: Record<string, number> | null;
		/** Most recent quote time across the constituents. */
		updatedAt?: string | null;
		/** When `dollarVolume24h` was taken. */
		volumeAsOf?: string | null;
		/** Median of the constituents' own P/E, over those with a positive one. */
		medianTrailingPE?: number | null;
		/** Median of the constituents' own price to sales, over those with a positive one. */
		medianPriceToRevenue?: number | null;
		/** Median of the constituents' own price to book, over those with a positive one. */
		medianPriceToBook?: number | null;
		/** Median of the constituents' own EV/EBITDA, over those with a positive one. */
		medianEnterpriseValueToEbitda?: number | null;
		/** Median of the constituents' own TTM operating margin, in percent. */
		medianOperatingProfitMarginTTM?: number | null;
		/** Median of the constituents' own dividend yield, in percent. */
		medianDividendYield?: number | null;
		/** Median constituent market cap, in USD. */
		medianMarketCap?: number | null;
		/** Number of sectors, not counting `Unknown`. */
		sectorCount?: number | null;
		/** Number of distinct industries. */
		industryCount?: number | null;
		/** Sector with the highest `priceChangePercentage1d`. Never `Unknown`. */
		bestSector1d?: {
			/** Sector name as the data vendor labels it (not GICS). Companies the vendor left unclassified roll up into `Unknown`. */
			sector?: string | null;
			/** URL-safe sector id. Pass it as `sector` to the other equities endpoints. */
			sectorSlug?: string | null;
			/** Cap-weighted price change over the latest session, in percent. */
			priceChangePercentage1d?: number | null;
			/** Share of all tracked US equity market cap, in percent. */
			weight?: number | null;
			[key: string]: unknown;
		} | null;
		/** Sector with the lowest `priceChangePercentage1d`. Never `Unknown`. */
		worstSector1d?: {
			/** Sector name as the data vendor labels it (not GICS). Companies the vendor left unclassified roll up into `Unknown`. */
			sector?: string | null;
			/** URL-safe sector id. Pass it as `sector` to the other equities endpoints. */
			sectorSlug?: string | null;
			/** Cap-weighted price change over the latest session, in percent. */
			priceChangePercentage1d?: number | null;
			/** Share of all tracked US equity market cap, in percent. */
			weight?: number | null;
			[key: string]: unknown;
		} | null;
		/** Sector with the largest market cap. Never `Unknown`. */
		largestSector?: {
			/** Sector name as the data vendor labels it (not GICS). Companies the vendor left unclassified roll up into `Unknown`. */
			sector?: string | null;
			/** URL-safe sector id. Pass it as `sector` to the other equities endpoints. */
			sectorSlug?: string | null;
			/** Cap-weighted price change over the latest session, in percent. */
			priceChangePercentage1d?: number | null;
			/** Share of all tracked US equity market cap, in percent. */
			weight?: number | null;
			[key: string]: unknown;
		} | null;
		[key: string]: unknown;
	};
	'equities.statements': {
		/** Income statement data. The `labels` array defines the rows; `values` is a parallel array of arrays where each inner array holds one row's values across all periods. */
		incomeStatement?: {
			/** Ordered list of income statement line items. Each index corresponds to an inner array in `quarterly.values` and `annual.values`. */
			labels?: Array<string> | null;
			/** Metadata describing which top-level labels have child breakdowns and what those child labels are, separately for quarterly and annual periods. */
			children?: {
				/** Child label definitions for quarterly data. Keys are parent label names from `labels`. */
				quarterly?: Record<
					string,
					{
						/** Child line item names for this parent. Each index corresponds to an inner array in `quarterly.children[label].values`. */
						labels?: Array<string> | null;
						[key: string]: unknown;
					}
				> | null;
				/** Child label definitions for annual data. Keys are parent label names from `labels`. */
				annual?: Record<
					string,
					{
						labels?: Array<string> | null;
						[key: string]: unknown;
					}
				> | null;
				[key: string]: unknown;
			} | null;
			/** Quarterly period data for the income statement. */
			quarterly?: {
				/** ISO 8601 date each quarter ended. */
				periodEnding?: Array<string> | null;
				/** Parallel to `labels`. Each inner array contains the values for that row across all `periodEnding` entries. Values may be `null` when not reported. */
				values?: Array<Array<number | null>> | null;
				/** Breakdown data for parent labels that have sub-components. Keys match parent label names. Child labels are defined in `children.quarterly[label].labels`. */
				children?: Record<
					string,
					{
						/** One inner array per child label, each containing values across all periods. Values may be `null`. */
						values?: Array<Array<number | null>> | null;
						[key: string]: unknown;
					}
				> | null;
				[key: string]: unknown;
			} | null;
			/** Annual period data for the income statement. */
			annual?: {
				/** ISO 8601 date each fiscal year ended. */
				periodEnding?: Array<string> | null;
				/** Parallel to `labels`. Each inner array contains the values for that row across all `periodEnding` entries. Values may be `null`. */
				values?: Array<Array<number | null>> | null;
				/** Breakdown data for parent labels that have sub-components. Child labels are defined in `children.annual[label].labels`. */
				children?: Record<
					string,
					{
						values?: Array<Array<number | null>> | null;
						[key: string]: unknown;
					}
				> | null;
				[key: string]: unknown;
			} | null;
			[key: string]: unknown;
		} | null;
		/** Balance sheet data. Follows the same structure as `incomeStatement`: top-level `labels`, `children` metadata, and `quarterly`/`annual` period objects each containing `periodEnding`, `values`, and `children`. */
		balanceSheet?: {
			/** Ordered list of balance sheet line items. */
			labels?: Array<string> | null;
			children?: {
				quarterly?: Record<
					string,
					{
						labels?: Array<string> | null;
						[key: string]: unknown;
					}
				> | null;
				annual?: Record<
					string,
					{
						labels?: Array<string> | null;
						[key: string]: unknown;
					}
				> | null;
				[key: string]: unknown;
			} | null;
			quarterly?: {
				periodEnding?: Array<string> | null;
				values?: Array<Array<number | null>> | null;
				children?: Record<
					string,
					{
						values?: Array<Array<number | null>> | null;
						[key: string]: unknown;
					}
				> | null;
				[key: string]: unknown;
			} | null;
			annual?: {
				periodEnding?: Array<string> | null;
				values?: Array<Array<number | null>> | null;
				children?: Record<
					string,
					{
						values?: Array<Array<number | null>> | null;
						[key: string]: unknown;
					}
				> | null;
				[key: string]: unknown;
			} | null;
			[key: string]: unknown;
		} | null;
		/** Cash flow statement data. Follows the same structure as `incomeStatement`: top-level `labels`, `children` metadata, and `quarterly`/`annual` period objects each containing `periodEnding`, `values`, and `children`. */
		cashflow?: {
			/** Ordered list of cash flow line items. */
			labels?: Array<string> | null;
			children?: {
				quarterly?: Record<
					string,
					{
						labels?: Array<string> | null;
						[key: string]: unknown;
					}
				> | null;
				annual?: Record<
					string,
					{
						labels?: Array<string> | null;
						[key: string]: unknown;
					}
				> | null;
				[key: string]: unknown;
			} | null;
			quarterly?: {
				periodEnding?: Array<string> | null;
				values?: Array<Array<number | null>> | null;
				children?: Record<
					string,
					{
						values?: Array<Array<number | null>> | null;
						[key: string]: unknown;
					}
				> | null;
				[key: string]: unknown;
			} | null;
			annual?: {
				periodEnding?: Array<string> | null;
				values?: Array<Array<number | null>> | null;
				children?: Record<
					string,
					{
						values?: Array<Array<number | null>> | null;
						[key: string]: unknown;
					}
				> | null;
				[key: string]: unknown;
			} | null;
			[key: string]: unknown;
		} | null;
		[key: string]: unknown;
	};
	'equities.summary': {
		currentPrice?: number | null;
		volume?: number | null;
		marketCap?: number | null;
		circulatingMarketCap?: number | null;
		enterpriseValue?: number | null;
		fiftyTwoWeekHigh?: number | null;
		fiftyTwoWeekLow?: number | null;
		dividendYield?: number | null;
		trailingPE?: number | null;
		priceToRevenue?: number | null;
		priceChangePercentage1d?: number | null;
		priceChangePercentage7d?: number | null;
		priceChangePercentage1m?: number | null;
		priceChange1d?: number | null;
		marketCapChange1d?: number | null;
		priceToBook?: number | null;
		enterpriseValueToEbitda?: number | null;
		holdersYield?: number | null;
		updatedAt?: string | null;
		revenueTTM?: number | null;
		grossProfitTTM?: number | null;
		earningsTTM?: number | null;
		ebitdaTTM?: number | null;
		operatingProfitMarginTTM?: number | null;
		holdersRevenueTTM?: number | null;
		holderEarningsTTM?: number | null;
		dividendsTTM?: number | null;
		stockRepurchaseTTM?: number | null;
		stockIssuanceTTM?: number | null;
		stockBasedCompensationTTM?: number | null;
		cashAndCashEquivalents?: number | null;
		totalAssets?: number | null;
		totalLiabilities?: number | null;
		totalShareholdersEquity?: number | null;
		totalDebt?: number | null;
		circulatingSupply?: number | null;
		totalSupply?: number | null;
		employeeCount?: number | null;
		[key: string]: unknown;
	};
	'etfs.flows': Array<{
		/** CoinGecko ID */
		gecko_id?: string | null;
		/** Day */
		day?: string | null;
		/** Sum of all USD flows per asset */
		total_flow_usd?: number | null;
		[key: string]: unknown;
	}>;
	'etfs.snapshot': Array<{
		/** ETF ticker symbol */
		ticker?: string | null;
		/** Current timestamp */
		timestamp?: number | null;
		/** Asset name */
		asset?: string | null;
		/** ETF issuer name */
		issuer?: string | null;
		/** Full ETF name */
		etf_name?: string | null;
		/** Custodian name */
		custodian?: string | null;
		/** Percentage fee */
		pct_fee?: number | null;
		/** ETF URL */
		url?: string | null;
		/** Net flows */
		flows?: number | null;
		/** Assets under management */
		aum?: number | null;
		/** Trading volume */
		volume?: number | null;
		[key: string]: unknown;
	}>;
	'fees.byChain': {
		protocols?: Array<{
			name?: string | null;
			total24h?: number | null;
			change_1d?: number | null;
			chains?: Array<string> | null;
			[key: string]: unknown;
		}> | null;
		totalDataChart?: Array<Array<DefillamaJsonValue>> | null;
		totalDataChartBreakdown?: Array<Array<DefillamaJsonValue>> | null;
		[key: string]: unknown;
	};
	'fees.overview': {
		protocols?: Array<{
			name?: string | null;
			total24h?: number | null;
			change_1d?: number | null;
			chains?: Array<string> | null;
			[key: string]: unknown;
		}> | null;
		totalDataChart?: Array<Array<DefillamaJsonValue>> | null;
		totalDataChartBreakdown?: Array<Array<DefillamaJsonValue>> | null;
		[key: string]: unknown;
	};
	'fees.summary': {
		/** Protocol ID */
		id?: string | null;
		/** Protocol name */
		name?: string | null;
		/** Protocol URL */
		url?: string | null;
		/** Referral URL */
		referralUrl?: string | null;
		/** Protocol description */
		description?: string | null;
		/** Protocol logo URL */
		logo?: string | null;
		/** CoinGecko ID */
		gecko_id?: string | null;
		/** CoinMarketCap ID */
		cmcId?: string | null;
		/** Supported chains */
		chains?: Array<string> | null;
		/** Twitter handle */
		twitter?: string | null;
		/** GitHub repositories */
		github?: Array<string> | null;
		/** Token symbol */
		symbol?: string | null;
		/** Protocol address */
		address?: string | null;
		/** Child protocols */
		childProtocols?: Array<Record<string, DefillamaJsonValue>> | null;
		/** Linked protocols */
		linkedProtocols?: Array<string> | null;
		/** DefiLlama protocol ID */
		defillamaId?: string | null;
		/** Whether protocol is disabled */
		disabled?: boolean | null;
		/** Display name */
		displayName?: string | null;
		/** Module name */
		module?: string | null;
		/** Protocol category */
		category?: string | null;
		/** Methodology URL */
		methodologyURL?: string | null;
		/** Methodology details */
		methodology?: Record<string, DefillamaJsonValue> | null;
		/** Forked from protocol */
		forkedFrom?: string | null;
		/** Audit information */
		audits?: string | null;
		/** Audit links */
		audit_links?: Array<DefillamaJsonValue> | null;
		/** Version key */
		versionKey?: string | null;
		/** Governance IDs */
		governanceID?: Array<string> | null;
		/** Treasury address */
		treasury?: string | null;
		/** Parent protocol */
		parentProtocol?: string | null;
		/** Previous names */
		previousNames?: Array<DefillamaJsonValue> | null;
		/** Protocol slug */
		slug?: string | null;
		/** Protocol type */
		protocolType?: string | null;
		/** 24 hour fees */
		total24h?: number | null;
		/** 48h to 24h fees */
		total48hto24h?: number | null;
		/** 7 day fees */
		total7d?: number | null;
		/** All time fees */
		totalAllTime?: number | null;
		/** 1 day change percentage */
		change_1d?: number | null;
		/** Total data chart with timestamps and fees */
		totalDataChart?: Array<Array<number>> | null;
		/** Total data chart breakdown by chain and protocol */
		totalDataChartBreakdown?: Array<
			Array<number | Record<string, DefillamaJsonValue>>
		> | null;
		[key: string]: unknown;
	};
	'financialStatements.get': {
		/** Protocol ID. Parent protocols use 'parent#slug' format. */
		id?: string | null;
		name?: string | null;
		address?: string | null;
		symbol?: string | null;
		url?: string | null;
		description?: string | null;
		/** Primary chain (present for child protocols) */
		chain?: string | null;
		logo?: string | null;
		audits?: string | null;
		audit_links?: Array<string> | null;
		/** Protocol category (present for child protocols) */
		category?: string | null;
		chains?: Array<string> | null;
		/** Oracles used by the protocol */
		oraclesBreakdown?: Array<{
			name?: string | null;
			type?: string | null;
			proof?: Array<string> | null;
			[key: string]: unknown;
		}> | null;
		module?: string | null;
		twitter?: string | null;
		github?: Array<string> | null;
		/** Unix timestamp when protocol was listed */
		listedAt?: number | null;
		/** Parent protocol ID (present for child protocols) */
		parentProtocol?: string | null;
		/** Available dimension adapters for this protocol */
		dimensions?: Record<
			string,
			| string
			| {
					adapter?: string | null;
					genuineSpikes?: Array<DefillamaJsonValue> | null;
					[key: string]: unknown;
			  }
		> | null;
		/** Maps line item names to descriptions. Present at top level for child protocols, inside childProtocols for parent protocols. */
		methodology?: Record<string, string> | null;
		/** Maps line item names to objects mapping label names to descriptions. Present at top level for child protocols, inside childProtocols for parent protocols. */
		breakdownMethodology?: Record<string, Record<string, string>> | null;
		methodologyURL?: string | null;
		tvlCodePath?: string | null;
		/** Notable events as [timestamp, description] pairs */
		hallmarks?: Array<Array<DefillamaJsonValue>> | null;
		linkedProtocols?: Array<string> | null;
		/** Child protocol versions with their methodology details. Only present for parent protocols. */
		childProtocols?: Array<{
			name?: string | null;
			defillamaId?: string | null;
			displayName?: string | null;
			methodologyURL?: string | null;
			methodology?: Record<string, string> | null;
			breakdownMethodology?: Record<string, Record<string, string>> | null;
			[key: string]: unknown;
		}> | null;
		hasLabelBreakdown?: boolean | null;
		defillamaId?: string | null;
		displayName?: string | null;
		slug?: string | null;
		protocolType?: string | null;
		/** Financial data aggregated by time period */
		aggregates?: {
			/** Keyed by year (e.g. '2024'). Each value is an object of line items. */
			yearly?: Record<
				string,
				Record<
					string,
					{
						/** Total USD value for this line item in the period */
						value?: number | null;
						/** Breakdown by label (e.g. Borrow Interest, Liquidation Fees, Flash Loans). Not present for all line items. */
						'by-label'?: Record<string, number> | null;
						[key: string]: unknown;
					}
				>
			> | null;
			/** Keyed by quarter (e.g. '2024-Q1'). Each value is an object of line items. */
			quarterly?: Record<
				string,
				Record<
					string,
					{
						/** Total USD value for this line item in the period */
						value?: number | null;
						/** Breakdown by label. Not present for all line items. */
						'by-label'?: Record<string, number> | null;
						[key: string]: unknown;
					}
				>
			> | null;
			/** Keyed by month (e.g. '2024-01'). Each value is an object of line items. */
			monthly?: Record<
				string,
				Record<
					string,
					{
						/** Total USD value for this line item in the period */
						value?: number | null;
						/** Breakdown by label. Not present for all line items. */
						'by-label'?: Record<string, number> | null;
						[key: string]: unknown;
					}
				>
			> | null;
			[key: string]: unknown;
		} | null;
		[key: string]: unknown;
	};
	'forks.chartByProtocol': Array<{
		/** Unix timestamp */
		timestamp?: number | null;
		[key: string]: unknown;
	}>;
	'forks.metrics': Record<string, Array<string>>;
	'forks.protocolChart': Array<Array<number>>;
	'narratives.performance': Array<{
		/** Date timestamp */
		date?: number | null;
		/** Analytics category performance */
		Analytics?: number | null;
		/** AI category performance */
		'Artificial Intelligence (AI)'?: number | null;
		/** Bitcoin category performance */
		Bitcoin?: number | null;
		/** Bridge governance tokens category performance */
		'Bridge Governance Tokens'?: number | null;
		/** CEX token category performance */
		'Centralized Exchange (CEX) Token'?: number | null;
		/** Data availability category performance */
		'Data Availability'?: number | null;
		/** DeFi category performance */
		'Decentralized Finance (DeFi)'?: number | null;
		/** DID category performance */
		'Decentralized Identifier (DID)'?: number | null;
		/** DePIN category performance */
		DePIN?: number | null;
		/** Ethereum category performance */
		Ethereum?: number | null;
		/** Gaming category performance */
		'Gaming (GameFi)'?: number | null;
		/** Liquid staking governance tokens category performance */
		'Liquid Staking Governance Tokens'?: number | null;
		/** Meme category performance */
		Meme?: number | null;
		/** NFT marketplace category performance */
		'NFT Marketplace'?: number | null;
		/** Oracle category performance */
		Oracle?: number | null;
		/** PolitiFi category performance */
		PolitiFi?: number | null;
		/** Prediction markets category performance */
		'Prediction Markets'?: number | null;
		/** RWA category performance */
		'Real World Assets (RWA)'?: number | null;
		/** Rollup category performance */
		Rollup?: number | null;
		/** Smart contract platform category performance */
		'Smart Contract Platform'?: number | null;
		/** SocialFi category performance */
		SocialFi?: number | null;
		/** Solana category performance */
		Solana?: number | null;
		[key: string]: unknown;
	}>;
	'oracles.chainChart': Array<Array<number>>;
	'oracles.chainChartByProtocol': Array<{
		/** Unix timestamp */
		timestamp?: number | null;
		[key: string]: unknown;
	}>;
	'oracles.chart': Array<Array<number>>;
	'oracles.chartByChain': Array<{
		/** Unix timestamp */
		timestamp?: number | null;
		[key: string]: unknown;
	}>;
	'oracles.chartByProtocol': Array<{
		/** Unix timestamp */
		timestamp?: number | null;
		[key: string]: unknown;
	}>;
	'oracles.metrics': {
		/** Mapping of oracle names to arrays of protocol names using that oracle */
		oracles?: Record<string, Array<string>> | null;
		[key: string]: unknown;
	};
	'oracles.protocolChart': Array<Array<number>>;
	'oracles.protocolChartByChain': Array<{
		/** Unix timestamp */
		timestamp?: number | null;
		[key: string]: unknown;
	}>;
	'overview.categories': {
		chart?: Record<
			string,
			Record<
				string,
				{
					tvl?: number | null;
					staking?: number | null;
					pool2?: number | null;
					doublecounted?: number | null;
					borrowed?: number | null;
					offers?: number | null;
					vesting?: number | null;
					treasury?: number | null;
					liquidstaking?: number | null;
					dcAndLsOverlap?: number | null;
					[key: string]: unknown;
				}
			>
		> | null;
		categories?: Record<string, Array<string>> | null;
		[key: string]: unknown;
	};
	'overview.entities': Array<{
		id?: string | null;
		name?: string | null;
		url?: string | null;
		description?: string | null;
		logo?: string | null;
		category?: string | null;
		module?: string | null;
		twitter?: string | null;
		symbol?: string | null;
		chain?: string | null;
		gecko_id?: string | null;
		cmcId?: string | null;
		chains?: Array<string> | null;
		slug?: string | null;
		tvl?: number | null;
		chainTvls?: Record<string, number> | null;
		change_1h?: number | null;
		change_1d?: number | null;
		change_7d?: number | null;
		tokenBreakdowns?: {
			ownTokens?: number | null;
			stablecoins?: number | null;
			majors?: number | null;
			others?: number | null;
			[key: string]: unknown;
		} | null;
		mcap?: number | null;
		[key: string]: unknown;
	}>;
	'overview.forks': {
		chart?: Record<
			string,
			Record<
				string,
				{
					staking?: number | null;
					tvl?: number | null;
					pool2?: number | null;
					doublecounted?: number | null;
					borrowed?: number | null;
					vesting?: number | null;
					liquidstaking?: number | null;
					dcAndLsOverlap?: number | null;
					[key: string]: unknown;
				}
			>
		> | null;
		forks?: Record<string, Array<string>> | null;
		[key: string]: unknown;
	};
	'overview.hacks': Array<{
		date?: number | null;
		name?: string | null;
		classification?: string | null;
		technique?: string | null;
		amount?: number | null;
		chain?: Array<string> | null;
		bridgeHack?: boolean | null;
		targetType?: string | null;
		source?: string | null;
		returnedFunds?: number | null;
		defillamaId?: (number | string) | null;
		language?: string | null;
		[key: string]: unknown;
	}>;
	'overview.oracles': {
		chart?: Record<
			string,
			Record<
				string,
				{
					tvl?: number | null;
					staking?: number | null;
					pool2?: number | null;
					borrowed?: number | null;
					treasury?: number | null;
					vesting?: number | null;
					[key: string]: unknown;
				}
			>
		> | null;
		oracles?: Record<string, Array<string>> | null;
		chainsByOracle?: Record<string, Array<string>> | null;
		[key: string]: unknown;
	};
	'overview.raises': {
		raises?: Array<{
			date?: number | null;
			name?: string | null;
			round?: string | null;
			amount?: number | null;
			chains?: Array<string> | null;
			sector?: string | null;
			category?: string | null;
			categoryGroup?: string | null;
			source?: string | null;
			leadInvestors?: Array<string> | null;
			otherInvestors?: Array<string> | null;
			valuation?: number | null;
			defillamaId?: string | null;
			[key: string]: unknown;
		}> | null;
		[key: string]: unknown;
	};
	'overview.treasuries': Array<{
		id?: string | null;
		name?: string | null;
		address?: string | null;
		symbol?: string | null;
		url?: string | null;
		description?: string | null;
		chain?: string | null;
		logo?: string | null;
		audits?: string | null;
		audit_note?: string | null;
		gecko_id?: string | null;
		cmcId?: string | null;
		category?: string | null;
		chains?: Array<string> | null;
		module?: string | null;
		treasury?: string | null;
		forkedFromIds?: Array<string> | null;
		twitter?: string | null;
		slug?: string | null;
		tvl?: number | null;
		chainTvls?: Record<string, number> | null;
		change_1h?: number | null;
		change_1d?: number | null;
		change_7d?: number | null;
		tokenBreakdowns?: {
			ownTokens?: number | null;
			stablecoins?: number | null;
			majors?: number | null;
			others?: number | null;
			[key: string]: unknown;
		} | null;
		mcap?: number | null;
		[key: string]: unknown;
	}>;
	'perps.derivatives': {
		/** Total data chart with timestamps and volumes */
		totalDataChart?: Array<Array<DefillamaJsonValue>> | null;
		/** Total data chart breakdown by protocol */
		totalDataChartBreakdown?: Array<Array<DefillamaJsonValue>> | null;
		/** 24 hour breakdown */
		breakdown24h?: Record<string, DefillamaJsonValue> | null;
		/** 30 day breakdown */
		breakdown30d?: Record<string, DefillamaJsonValue> | null;
		/** Chain filter */
		chain?: string | null;
		/** All available chains */
		allChains?: Array<string> | null;
		/** Total 24 hour volume */
		total24h?: number | null;
		/** Total 48h to 24h volume */
		total48hto24h?: number | null;
		/** Total 7 day volume */
		total7d?: number | null;
		/** Total 14d to 7d volume */
		total14dto7d?: number | null;
		/** Total 60d to 30d volume */
		total60dto30d?: number | null;
		/** Total 30 day volume */
		total30d?: number | null;
		/** Total 1 year volume */
		total1y?: number | null;
		/** 1 day change percentage */
		change_1d?: number | null;
		/** 7 day change percentage */
		change_7d?: number | null;
		/** 1 month change percentage */
		change_1m?: number | null;
		/** 7d over 7d change percentage */
		change_7dover7d?: number | null;
		/** 30d over 30d change percentage */
		change_30dover30d?: number | null;
		/** Total volume 7 days ago */
		total7DaysAgo?: number | null;
		/** Total volume 30 days ago */
		total30DaysAgo?: number | null;
		/** Total all time volume */
		totalAllTime?: number | null;
		/** List of protocols */
		protocols?: Array<{
			/** Protocol 24 hour volume */
			total24h?: number | null;
			/** Protocol 48h to 24h volume */
			total48hto24h?: number | null;
			/** Protocol 7 day volume */
			total7d?: number | null;
			/** Protocol 14d to 7d volume */
			total14dto7d?: number | null;
			/** Protocol 60d to 30d volume */
			total60dto30d?: number | null;
			/** Protocol 30 day volume */
			total30d?: number | null;
			/** Protocol 1 year volume */
			total1y?: number | null;
			/** Protocol all time volume */
			totalAllTime?: number | null;
			/** Protocol average 1 year volume */
			average1y?: number | null;
			/** Protocol 1 day change percentage */
			change_1d?: number | null;
			/** Protocol 7 day change percentage */
			change_7d?: number | null;
			/** Protocol 1 month change percentage */
			change_1m?: number | null;
			/** Protocol 7d over 7d change percentage */
			change_7dover7d?: number | null;
			/** Protocol 30d over 30d change percentage */
			change_30dover30d?: number | null;
			/** Protocol 24 hour breakdown */
			breakdown24h?: Record<string, DefillamaJsonValue> | null;
			/** Protocol 30 day breakdown */
			breakdown30d?: Record<string, DefillamaJsonValue> | null;
			/** Protocol volume 7 days ago */
			total7DaysAgo?: number | null;
			/** Protocol volume 30 days ago */
			total30DaysAgo?: number | null;
			/** DefiLlama protocol ID */
			defillamaId?: string | null;
			/** Protocol name */
			name?: string | null;
			/** Protocol display name */
			displayName?: string | null;
			/** Protocol module */
			module?: string | null;
			/** Protocol category */
			category?: string | null;
			/** Protocol logo URL */
			logo?: string | null;
			/** Protocol chains */
			chains?: Array<string> | null;
			/** Protocol type */
			protocolType?: string | null;
			/** Methodology URL */
			methodologyURL?: string | null;
			/** Methodology details */
			methodology?: Record<string, DefillamaJsonValue> | null;
			/** Latest fetch status */
			latestFetchIsOk?: boolean | null;
			/** Parent protocol */
			parentProtocol?: string | null;
			/** Protocol slug */
			slug?: string | null;
			/** Linked protocols */
			linkedProtocols?: Array<string> | null;
			/** Protocol ID */
			id?: string | null;
			[key: string]: unknown;
		}> | null;
		[key: string]: unknown;
	};
	'perps.derivativesSummary': {
		/** Protocol ID */
		id?: string | null;
		/** Protocol name */
		name?: string | null;
		/** Protocol URL */
		url?: string | null;
		/** Referral URL */
		referralUrl?: string | null;
		/** Protocol description */
		description?: string | null;
		/** Protocol logo URL */
		logo?: string | null;
		/** CoinGecko ID */
		gecko_id?: string | null;
		/** CoinMarketCap ID */
		cmcId?: string | null;
		/** Supported chains */
		chains?: Array<string> | null;
		/** Twitter handle */
		twitter?: string | null;
		/** GitHub repositories */
		github?: Array<string> | null;
		/** Token symbol */
		symbol?: string | null;
		/** Protocol address */
		address?: string | null;
		/** Child protocols */
		childProtocols?: Array<Record<string, DefillamaJsonValue>> | null;
		/** Linked protocols */
		linkedProtocols?: Array<string> | null;
		/** DefiLlama protocol ID */
		defillamaId?: string | null;
		/** Whether protocol is disabled */
		disabled?: boolean | null;
		/** Display name */
		displayName?: string | null;
		/** Module name */
		module?: string | null;
		/** Protocol category */
		category?: string | null;
		/** Methodology URL */
		methodologyURL?: string | null;
		/** Methodology details */
		methodology?: Record<string, DefillamaJsonValue> | null;
		/** Forked from protocol */
		forkedFrom?: string | null;
		/** Audit information */
		audits?: Array<DefillamaJsonValue> | null;
		/** Audit links */
		audit_links?: Array<DefillamaJsonValue> | null;
		/** Version key */
		versionKey?: string | null;
		/** Governance ID */
		governanceID?: string | null;
		/** Treasury address */
		treasury?: string | null;
		/** Parent protocol */
		parentProtocol?: string | null;
		/** Previous names */
		previousNames?: Array<DefillamaJsonValue> | null;
		/** Latest fetch status */
		latestFetchIsOk?: boolean | null;
		/** Protocol slug */
		slug?: string | null;
		/** Protocol type */
		protocolType?: string | null;
		/** 24 hour volume */
		total24h?: number | null;
		/** 48h to 24h volume */
		total48hto24h?: number | null;
		/** 7 day volume */
		total7d?: number | null;
		/** All time volume */
		totalAllTime?: number | null;
		/** Total data chart with timestamps and volumes */
		totalDataChart?: Array<Array<DefillamaJsonValue>> | null;
		/** Total data chart breakdown by chain and protocol */
		totalDataChartBreakdown?: Array<Array<DefillamaJsonValue>> | null;
		/** 1 day change percentage */
		change_1d?: number | null;
		[key: string]: unknown;
	};
	'perps.openInterest': {
		protocols?: Array<{
			name?: string | null;
			displayName?: string | null;
			total24h?: number | null;
			total7d?: number | null;
			change_1d?: number | null;
			change_7d?: number | null;
			chains?: Array<string> | null;
			[key: string]: unknown;
		}> | null;
		totalDataChart?: Array<
			Array<number | Record<string, DefillamaJsonValue>>
		> | null;
		allChains?: Array<string> | null;
		[key: string]: unknown;
	};
	'preIpo.companies': {
		/** When this snapshot was generated. */
		updatedAt?: string | null;
		data?: Array<{
			/** Company id. Pass this as the `company` query parameter on the other pre-IPO endpoints. */
			id?: string | null;
			name?: string | null;
			description?: string | null;
			website?: string | null;
			sector?: string | null;
			/** Most recent monthly secondary-market estimate, in USD. Falls back to the latest funding round post-money valuation when no marketplace lists the company. */
			latestEstimatedValuation?: number | null;
			/** Amount raised in the most recent funding round, in USD. */
			latestRaise?: number | null;
			/** Post-money valuation of the most recent funding round, in USD. */
			latestFundingValuation?: number | null;
			latestFundingDate?: string | null;
			/** Date of the most recent secondary mark behind `latestEstimatedValuation`. */
			lastValuationDate?: string | null;
			/** Sum of all disclosed funding rounds, in USD. */
			totalRaised?: number | null;
			/** Change in the secondary estimate against the same month a year earlier, in percent. `null` when the company has no secondary marks. */
			valuationChange1YPercentage?: number | null;
			/** Premium of the secondary estimate over the latest round post-money valuation, in percent. `null` when the company has no secondary marks. */
			premiumVsLatestFundingPercentage?: number | null;
			[key: string]: unknown;
		}> | null;
		[key: string]: unknown;
	};
	'preIpo.integrations': {
		/** When this snapshot was generated. */
		updatedAt?: string | null;
		data?: {
			/** Perpetual futures markets tracking the company. */
			perps?: Array<{
				exchangeName?: string | null;
				/** DefiLlama slug for the venue. */
				platformSlug?: string | null;
				/** DefiLlama market identifier, `{venue}:{pair}`. */
				defillamaContract?: string | null;
				/** Whether the venue is a centralised or an on-chain exchange. */
				exchangeType?: string | null;
				/** Open interest, in USD. */
				openInterest?: number | null;
				/** 24 hour volume, in USD. */
				volume?: number | null;
				/** Last traded price of the contract, in USD. */
				price?: number | null;
				/** Annualised funding rate, in percent, so `5.2` is 5.2% a year. Negative means shorts pay longs. */
				annualizedFundingRate?: number | null;
				tradeUrl?: string | null;
				/** Company valuation implied by this venue's price, in USD. */
				estimatedValuation?: number | null;
				[key: string]: unknown;
			}> | null;
			/** Tokenised exposure to the company's private shares. */
			tokenIssuers?: Array<{
				/** The token issuer, not the private company. */
				issuerName?: string | null;
				/** DefiLlama RWA platform slug for the issuer, when it has one. */
				slug?: string | null;
				/** What the token is a claim on, ordered from the most direct claim on the underlying shares to the least. `Direct shares` and `Trust-held SPV` are asset-backed and bankruptcy-remote, `SPV interest` is asset-backed but held one layer removed through a vehicle, and `Unsecured note` and `Synthetic`… */
				backing?: string | null;
				productUrl?: string | null;
				/** Token price, in USD. */
				price?: number | null;
				/** Market cap of the token, in USD. Only populated for issuers that publish one. */
				marketCap?: number | null;
				/** Company valuation implied by the token price, in USD. */
				estimatedValuation?: number | null;
				[key: string]: unknown;
			}> | null;
			[key: string]: unknown;
		} | null;
		[key: string]: unknown;
	};
	'preIpo.raises': {
		/** When this snapshot was generated. */
		updatedAt?: string | null;
		data?: Array<{
			/** Date the round was announced. */
			date?: string | null;
			/** Amount raised in the round, in USD. */
			amountRaised?: number | null;
			/** Post-money valuation of the round, in USD. `null` when no source disclosed one. */
			valuation?: number | null;
			/** Round label, for example `Series C` or `Series H-4`. */
			series?: string | null;
			[key: string]: unknown;
		}> | null;
		[key: string]: unknown;
	};
	'preIpo.summary': {
		/** When this snapshot was generated. */
		updatedAt?: string | null;
		data?: {
			id?: string | null;
			name?: string | null;
			description?: string | null;
			/** Short-form company summary. Currently identical to `description`. */
			summary?: string | null;
			website?: string | null;
			sector?: string | null;
			/** Most recent monthly secondary-market estimate, in USD. Falls back to the latest funding round post-money valuation when no marketplace lists the company. */
			latestEstimatedValuation?: number | null;
			lastValuationDate?: string | null;
			/** Most recent funding round, or `null` when no round is on record. */
			latestRaise?: {
				/** Date the round was announced. */
				date?: string | null;
				/** Amount raised in the round, in USD. */
				amountRaised?: number | null;
				/** Post-money valuation of the round, in USD. `null` when no source disclosed one. */
				valuation?: number | null;
				/** Round label, for example `Series C` or `Series H-4`. */
				series?: string | null;
				[key: string]: unknown;
			} | null;
			[key: string]: unknown;
		} | null;
		[key: string]: unknown;
	};
	'preIpo.valuations': {
		/** When this snapshot was generated. */
		updatedAt?: string | null;
		data?: Array<{
			/** First day of the month the point covers. */
			date?: string | null;
			/** Aggregated valuation estimate for that month, in USD. */
			estimatedValuation?: number | null;
			[key: string]: unknown;
		}> | null;
		[key: string]: unknown;
	};
	'rwa.chain': {
		data?: Array<{
			id?: string | null;
			canonicalMarketId?: string | null;
			ticker?: string | null;
			assetName?: string | null;
			assetGroup?: string | null;
			primaryChain?: string | null;
			chain?: Array<string> | null;
			category?: Array<string> | null;
			assetClass?: Array<string> | null;
			rwaClassification?: string | null;
			accessModel?: string | null;
			issuer?: string | null;
			parentPlatform?: string | null;
			/** Onchain AUM by chain: the USD value of all supply present onchain, whoever holds it. */
			onChainMcap?: Record<string, number> | null;
			/** Active AUM by chain: the portion of Onchain AUM held in user or protocol-controlled positions, with issuer, treasury and custodial wallets excluded. This is the number a protocol page shows as RWA Active AUM. */
			activeAum?: Record<string, number> | null;
			/** DeFi Active TVL by chain and tracked protocol: the subset of Active AUM deployed in third-party DeFi protocols DefiLlama tracks. */
			defiActiveTvl?: Record<string, Record<string, number>> | null;
			price?: number | null;
			activeAumData?: boolean | null;
			coingeckoId?: string | null;
			logo?: string | null;
			/** What an asset row is. A perps market row carries no status. `live` has a value today, which can be 0 when the asset once had a value and every chain now reads a supply of 0. `stale` had a value and has had none for three days; for up to 30 days after its last value its value fields hold that… */
			status?: string | null;
			/** Unix seconds. For `stale` and `lapsed`, the last day with a value. For `retired` and `delisted`, the day of the event. Absent when unknown. */
			statusSince?: number | null;
			/** One sentence on why the row was retired or delisted. Present only on a `retired` or `delisted` row that has one. */
			statusReason?: string | null;
			/** The `id` of the row that replaced this one, as it appears on another row of this list. Present only on a `retired` or `delisted` row that has a replacement. */
			successor?: string | null;
			[key: string]: unknown;
		}> | null;
		[key: string]: unknown;
	};
	'rwa.chainChart': Array<{
		timestamp?: number | null;
		onChainMcap?: number | null;
		activeAum?: number | null;
		defiActiveTvl?: number | null;
		[key: string]: unknown;
	}>;
	'rwa.chartByChain': Array<{
		timestamp?: number | null;
		[key: string]: unknown;
	}>;
	'rwa.current': Array<{
		id?: string | null;
		canonicalMarketId?: string | null;
		ticker?: string | null;
		assetName?: string | null;
		assetGroup?: string | null;
		primaryChain?: string | null;
		chain?: Array<string> | null;
		category?: Array<string> | null;
		assetClass?: Array<string> | null;
		rwaClassification?: string | null;
		accessModel?: string | null;
		issuer?: string | null;
		parentPlatform?: string | null;
		/** Onchain AUM by chain: the USD value of all supply present onchain, whoever holds it. */
		onChainMcap?: Record<string, number> | null;
		/** Active AUM by chain: the portion of Onchain AUM held in user or protocol-controlled positions, with issuer, treasury and custodial wallets excluded. This is the number a protocol page shows as RWA Active AUM. */
		activeAum?: Record<string, number> | null;
		/** DeFi Active TVL by chain and tracked protocol: the subset of Active AUM deployed in third-party DeFi protocols DefiLlama tracks. */
		defiActiveTvl?: Record<string, Record<string, number>> | null;
		price?: number | null;
		activeAumData?: boolean | null;
		coingeckoId?: string | null;
		logo?: string | null;
		/** What an asset row is. A perps market row carries no status. `live` has a value today, which can be 0 when the asset once had a value and every chain now reads a supply of 0. `stale` had a value and has had none for three days; for up to 30 days after its last value its value fields hold that… */
		status?: string | null;
		/** Unix seconds. For `stale` and `lapsed`, the last day with a value. For `retired` and `delisted`, the day of the event. Absent when unknown. */
		statusSince?: number | null;
		/** One sentence on why the row was retired or delisted. Present only on a `retired` or `delisted` row that has one. */
		statusReason?: string | null;
		/** The `id` of the row that replaced this one, as it appears on another row of this list. Present only on a `retired` or `delisted` row that has a replacement. */
		successor?: string | null;
		[key: string]: unknown;
	}>;
	'rwa.list': {
		canonicalMarketIds?: Array<string> | null;
		platforms?: Array<string> | null;
		chains?: Array<string> | null;
		categories?: Array<string> | null;
		assetGroups?: Array<string> | null;
		idMap?: Record<string, string> | null;
		[key: string]: unknown;
	};
	'rwa.stats': {
		totalOnChainMcap?: number | null;
		totalActiveMcap?: number | null;
		totalDefiActiveTvl?: number | null;
		assetCount?: number | null;
		assetIssuers?: number | null;
		byChain?: Record<
			string,
			{
				/** Default RWA bucket. The chain table uses this bucket. */
				base?: {
					onChainMcap?: number | null;
					activeAum?: number | null;
					defiActiveTvl?: number | null;
					assetCount?: number | null;
					assetIssuers?: Array<string> | null;
					[key: string]: unknown;
				} | null;
				[key: string]: unknown;
			}
		> | null;
		byCategory?: Record<
			string,
			{
				/** Default RWA bucket. The chain table uses this bucket. */
				base?: {
					onChainMcap?: number | null;
					activeAum?: number | null;
					defiActiveTvl?: number | null;
					assetCount?: number | null;
					assetIssuers?: Array<string> | null;
					[key: string]: unknown;
				} | null;
				[key: string]: unknown;
			}
		> | null;
		byPlatform?: Record<
			string,
			{
				/** Default RWA bucket. The chain table uses this bucket. */
				base?: {
					onChainMcap?: number | null;
					activeAum?: number | null;
					defiActiveTvl?: number | null;
					assetCount?: number | null;
					assetIssuers?: Array<string> | null;
					[key: string]: unknown;
				} | null;
				[key: string]: unknown;
			}
		> | null;
		byAssetGroup?: Record<
			string,
			{
				/** Default RWA bucket. The chain table uses this bucket. */
				base?: {
					onChainMcap?: number | null;
					activeAum?: number | null;
					defiActiveTvl?: number | null;
					assetCount?: number | null;
					assetIssuers?: Array<string> | null;
					[key: string]: unknown;
				} | null;
				[key: string]: unknown;
			}
		> | null;
		[key: string]: unknown;
	};
	'stablecoins.chains': Array<{
		name?: string | null;
		/** Circulating supply in USD, by peg type */
		totalCirculatingUSD?: Record<string, number> | null;
		[key: string]: unknown;
	}>;
	'stablecoins.chartAll': Array<{
		/** Unix timestamp in seconds, as a string */
		date?: string | null;
		totalCirculating?: {
			peggedUSD?: number | null;
			[key: string]: unknown;
		} | null;
		[key: string]: unknown;
	}>;
	'stablecoins.chartByChain': Array<{
		/** Unix timestamp in seconds, as a string */
		date?: string | null;
		totalCirculating?: {
			peggedUSD?: number | null;
			[key: string]: unknown;
		} | null;
		[key: string]: unknown;
	}>;
	'stablecoins.dominance': Array<{
		date?: string | null;
		totalCirculatingUSD?: {
			peggedUSD?: number | null;
			peggedVAR?: number | null;
			peggedEUR?: number | null;
			[key: string]: unknown;
		} | null;
		greatestMcap?: {
			gecko_id?: string | null;
			symbol?: string | null;
			mcap?: number | null;
			[key: string]: unknown;
		} | null;
		[key: string]: unknown;
	}>;
	'stablecoins.get': {
		id?: string | null;
		name?: string | null;
		symbol?: string | null;
		totalCirculating?: Array<{
			date?: number | null;
			totalCirculating?: number | null;
			[key: string]: unknown;
		}> | null;
		chainCirculating?: Record<
			string,
			Array<{
				date?: number | null;
				circulating?: number | null;
				[key: string]: unknown;
			}>
		> | null;
		[key: string]: unknown;
	};
	'stablecoins.list': {
		peggedAssets?: Array<{
			id?: string | null;
			name?: string | null;
			symbol?: string | null;
			pegType?: string | null;
			pegMechanism?: string | null;
			circulating?: {
				peggedUSD?: number | null;
				[key: string]: unknown;
			} | null;
			chains?: Array<string> | null;
			chainCirculating?: Record<
				string,
				{
					current?: {
						peggedUSD?: number | null;
						[key: string]: unknown;
					} | null;
					[key: string]: unknown;
				}
			> | null;
			price?: number | null;
			[key: string]: unknown;
		}> | null;
		[key: string]: unknown;
	};
	'stablecoins.prices': Array<{
		date?: number | null;
		prices?: Record<string, number> | null;
		[key: string]: unknown;
	}>;
	'tokenLiquidity.history': DefillamaJsonValue;
	'treasury.chart': Array<Array<number>>;
	'treasury.chartByChain': Array<DefillamaJsonValue>;
	'treasury.chartByToken': Array<DefillamaJsonValue>;
	'treasury.metrics': {
		id?: string | null;
		name?: string | null;
		address?: string | null;
		symbol?: string | null;
		url?: string | null;
		referralUrl?: string | null;
		description?: string | null;
		chain?: string | null;
		logo?: string | null;
		audits?: string | null;
		audit_note?: string | null;
		gecko_id?: string | null;
		cmcId?: string | null;
		category?: string | null;
		tags?: Array<string> | null;
		chains?: Array<string> | null;
		module?: string | null;
		treasury?: string | null;
		twitter?: string | null;
		audit_links?: Array<string> | null;
		openSource?: boolean | null;
		forkedFrom?: Array<string> | null;
		oraclesByChain?: Record<string, Array<string>> | null;
		parentProtocol?: string | null;
		governanceID?: Array<string> | null;
		github?: Array<string> | null;
		currentChainTvls?: Record<string, number> | null;
		isParentProtocol?: boolean | null;
		mcap?: number | null;
		methodology?: string | null;
		raises?: Array<{
			round?: string | null;
			amount?: number | null;
			valuation?: string | null;
			source?: string | null;
			date?: number | null;
			defillamaId?: string | null;
			leadInvestors?: Array<string> | null;
			otherInvestors?: Array<string> | null;
			investors?: Array<string> | null;
			[key: string]: unknown;
		}> | null;
		otherProtocols?: Array<string> | null;
		/** Notable events in the protocol's history as [timestamp, description] pairs */
		hallmarks?: Array<Array<DefillamaJsonValue>> | null;
		stablecoins?: Array<string> | null;
		misrepresentedTokens?: boolean | null;
		deprecated?: boolean | null;
		rugged?: boolean | null;
		deadUrl?: boolean | null;
		warningBanners?: Array<{
			message?: string | null;
			until?: string | null;
			level?: string | null;
			[key: string]: unknown;
		}> | null;
		/** Token governance and value accrual rights */
		tokenRights?: Record<string, DefillamaJsonValue> | null;
		wrongLiquidity?: boolean | null;
		/** Path to the TVL adapter source code */
		tvlCodePath?: string | null;
		[key: string]: unknown;
	};
	'tvl.chainAssets': {
		chain?: {
			canonical?: {
				total?: string | null;
				breakdown?: Record<string, string> | null;
				[key: string]: unknown;
			} | null;
			native?: {
				total?: string | null;
				breakdown?: Record<string, string> | null;
				[key: string]: unknown;
			} | null;
			thirdParty?: {
				total?: string | null;
				breakdown?: Record<string, string> | null;
				[key: string]: unknown;
			} | null;
			total?: {
				total?: string | null;
				breakdown?: Record<string, string> | null;
				[key: string]: unknown;
			} | null;
			[key: string]: unknown;
		} | null;
		timestamp?: number | null;
		[key: string]: unknown;
	};
	'tvl.chains': Array<{
		/** CoinGecko ID for the chain's native token */
		gecko_id?: string | null;
		/** Total Value Locked in USD */
		tvl?: number | null;
		/** Native token symbol */
		tokenSymbol?: string | null;
		/** CoinMarketCap ID */
		cmcId?: string | null;
		/** Chain name */
		name?: string | null;
		/** Chain ID number */
		chainId?: number | null;
		[key: string]: unknown;
	}>;
	'tvl.chart': Array<Array<number>>;
	'tvl.chartByChain': Array<DefillamaJsonValue>;
	'tvl.chartByToken': Array<DefillamaJsonValue>;
	'tvl.current': number;
	'tvl.historicalChainTvl': Array<{
		/** Unix timestamp */
		date?: number | null;
		/** Total Value Locked in USD across all chains */
		tvl?: number | null;
		[key: string]: unknown;
	}>;
	'tvl.historicalChainTvlByChain': Array<{
		/** Unix timestamp */
		date?: number | null;
		/** Total Value Locked in USD for this chain */
		tvl?: number | null;
		[key: string]: unknown;
	}>;
	'tvl.inflows': {
		outflows?: number | null;
		oldTokens?: {
			date?: number | null;
			tvl?: Record<string, number> | null;
			[key: string]: unknown;
		} | null;
		currentTokens?: {
			date?: number | null;
			tvl?: Record<string, number> | null;
			[key: string]: unknown;
		} | null;
		[key: string]: unknown;
	};
	'tvl.metrics': {
		id?: string | null;
		name?: string | null;
		address?: string | null;
		symbol?: string | null;
		url?: string | null;
		referralUrl?: string | null;
		description?: string | null;
		chain?: string | null;
		logo?: string | null;
		audits?: string | null;
		audit_note?: string | null;
		gecko_id?: string | null;
		cmcId?: string | null;
		category?: string | null;
		tags?: Array<string> | null;
		chains?: Array<string> | null;
		module?: string | null;
		treasury?: string | null;
		twitter?: string | null;
		audit_links?: Array<string> | null;
		openSource?: boolean | null;
		forkedFrom?: Array<string> | null;
		oraclesByChain?: Record<string, Array<string>> | null;
		parentProtocol?: string | null;
		governanceID?: Array<string> | null;
		github?: Array<string> | null;
		currentChainTvls?: Record<string, number> | null;
		isParentProtocol?: boolean | null;
		mcap?: number | null;
		methodology?: string | null;
		raises?: Array<{
			round?: string | null;
			amount?: number | null;
			valuation?: string | null;
			source?: string | null;
			date?: number | null;
			defillamaId?: string | null;
			leadInvestors?: Array<string> | null;
			otherInvestors?: Array<string> | null;
			investors?: Array<string> | null;
			[key: string]: unknown;
		}> | null;
		otherProtocols?: Array<string> | null;
		/** Notable events in the protocol's history as [timestamp, description] pairs */
		hallmarks?: Array<Array<DefillamaJsonValue>> | null;
		stablecoins?: Array<string> | null;
		misrepresentedTokens?: boolean | null;
		deprecated?: boolean | null;
		rugged?: boolean | null;
		deadUrl?: boolean | null;
		warningBanners?: Array<{
			message?: string | null;
			until?: string | null;
			level?: string | null;
			[key: string]: unknown;
		}> | null;
		/** Token governance and value accrual rights */
		tokenRights?: Record<string, DefillamaJsonValue> | null;
		wrongLiquidity?: boolean | null;
		/** Path to the TVL adapter source code */
		tvlCodePath?: string | null;
		[key: string]: unknown;
	};
	'tvl.protocol': {
		id?: string | null;
		name?: string | null;
		symbol?: string | null;
		category?: string | null;
		chains?: Array<string> | null;
		currentChainTvls?: Record<string, number> | null;
		chainTvls?: Record<
			string,
			{
				tvl?: Array<{
					date?: number | null;
					totalLiquidityUSD?: number | null;
					[key: string]: unknown;
				}> | null;
				tokens?: Array<{
					date?: number | null;
					tokens?: Record<string, number> | null;
					[key: string]: unknown;
				}> | null;
				[key: string]: unknown;
			}
		> | null;
		[key: string]: unknown;
	};
	'tvl.protocols': Array<{
		id?: string | null;
		name?: string | null;
		symbol?: string | null;
		category?: string | null;
		chains?: Array<string> | null;
		tvl?: number | null;
		chainTvls?: Record<string, number> | null;
		change_1d?: number | null;
		change_7d?: number | null;
		[key: string]: unknown;
	}>;
	'tvl.tokenProtocols': Array<{
		name?: string | null;
		category?: string | null;
		amountUsd?: Record<string, number> | null;
		[key: string]: unknown;
	}>;
	'unlocks.get': {
		body?: {
			documentedData?: {
				data?: Array<{
					label?: string | null;
					data?: Array<{
						timestamp?: number | null;
						unlocked?: number | null;
						rawEmission?: number | null;
						burned?: number | null;
						[key: string]: unknown;
					}> | null;
					[key: string]: unknown;
				}> | null;
				tokenAllocation?: {
					current?: {
						insiders?: number | null;
						noncirculating?: number | null;
						publicSale?: number | null;
						airdrop?: number | null;
						farming?: number | null;
						[key: string]: unknown;
					} | null;
					final?: {
						insiders?: number | null;
						noncirculating?: number | null;
						publicSale?: number | null;
						airdrop?: number | null;
						farming?: number | null;
						[key: string]: unknown;
					} | null;
					progress?: {
						insiders?: number | null;
						noncirculating?: number | null;
						publicSale?: number | null;
						airdrop?: number | null;
						farming?: number | null;
						[key: string]: unknown;
					} | null;
					[key: string]: unknown;
				} | null;
				[key: string]: unknown;
			} | null;
			metadata?: {
				notes?: Array<string> | null;
				token?: string | null;
				sources?: Array<string> | null;
				protocolIds?: Array<string> | null;
				total?: number | null;
				chain?: string | null;
				name?: string | null;
				gecko_id?: string | null;
				defillamaIds?: Array<string> | null;
				categories?: {
					insiders?: Array<string> | null;
					noncirculating?: Array<string> | null;
					publicSale?: Array<string> | null;
					airdrop?: Array<string> | null;
					farming?: Array<string> | null;
					[key: string]: unknown;
				} | null;
				protocolCategory?: string | null;
				chainName?: string | null;
				pId?: string | null;
				[key: string]: unknown;
			} | null;
			[key: string]: unknown;
		} | null;
		lastModified?: string | null;
		[key: string]: unknown;
	};
	'unlocks.list': Array<{
		token?: string | null;
		sources?: Array<string> | null;
		protocolId?: string | null;
		name?: string | null;
		circSupply?: number | null;
		circSupply30d?: number | null;
		totalLocked?: number | null;
		maxSupply?: number | null;
		gecko_id?: string | null;
		events?: Array<{
			description?: string | null;
			timestamp?: number | null;
			noOfTokens?: Array<number> | null;
			category?: string | null;
			unlockType?: string | null;
			[key: string]: unknown;
		}> | null;
		nextEvent?: {
			date?: number | null;
			toUnlock?: number | null;
			[key: string]: unknown;
		} | null;
		unlocksPerDay?: number | null;
		mcap?: number | null;
		[key: string]: unknown;
	}>;
	'volumes.dexSummary': {
		name?: string | null;
		total24h?: number | null;
		totalAllTime?: number | null;
		totalDataChart?: Array<Array<DefillamaJsonValue>> | null;
		totalDataChartBreakdown?: Array<Array<DefillamaJsonValue>> | null;
		chains?: Array<string> | null;
		[key: string]: unknown;
	};
	'volumes.dexs': {
		protocols?: Array<{
			name?: string | null;
			displayName?: string | null;
			total24h?: number | null;
			total7d?: number | null;
			change_1d?: number | null;
			change_7d?: number | null;
			chains?: Array<string> | null;
			[key: string]: unknown;
		}> | null;
		totalDataChart?: Array<
			Array<number | Record<string, DefillamaJsonValue>>
		> | null;
		allChains?: Array<string> | null;
		[key: string]: unknown;
	};
	'volumes.dexsByChain': {
		protocols?: Array<{
			name?: string | null;
			total24h?: number | null;
			change_1d?: number | null;
			[key: string]: unknown;
		}> | null;
		totalDataChart?: Array<Array<DefillamaJsonValue>> | null;
		[key: string]: unknown;
	};
	'volumes.options': {
		protocols?: Array<{
			name?: string | null;
			total24h?: number | null;
			change_1d?: number | null;
			[key: string]: unknown;
		}> | null;
		totalDataChart?: Array<Array<DefillamaJsonValue>> | null;
		[key: string]: unknown;
	};
	'volumes.optionsByChain': {
		/** Historical chart data with timestamps and total volumes */
		totalDataChart?: Array<Array<number>> | null;
		/** Historical chart data broken down by protocol */
		totalDataChartBreakdown?: Array<
			Array<number | Record<string, number>>
		> | null;
		/** 24-hour breakdown data */
		breakdown24h?: Record<string, DefillamaJsonValue> | null;
		/** 30-day breakdown data */
		breakdown30d?: Record<string, DefillamaJsonValue> | null;
		/** Chain name */
		chain?: string | null;
		/** List of all supported chains */
		allChains?: Array<string> | null;
		/** Total 24-hour volume */
		total24h?: number | null;
		/** Total 48-hour to 24-hour volume */
		total48hto24h?: number | null;
		/** Total 7-day volume */
		total7d?: number | null;
		/** Total 14-day to 7-day volume */
		total14dto7d?: number | null;
		/** Total 60-day to 30-day volume */
		total60dto30d?: number | null;
		/** Total 30-day volume */
		total30d?: number | null;
		/** Total 1-year volume */
		total1y?: number | null;
		/** 1-day change percentage */
		change_1d?: number | null;
		/** 7-day change percentage */
		change_7d?: number | null;
		/** 1-month change percentage */
		change_1m?: number | null;
		/** 7-day over 7-day change percentage */
		change_7dover7d?: number | null;
		/** 30-day over 30-day change percentage */
		change_30dover30d?: number | null;
		/** Total volume 7 days ago */
		total7DaysAgo?: number | null;
		/** Total volume 30 days ago */
		total30DaysAgo?: number | null;
		/** Total all-time volume */
		totalAllTime?: number | null;
		/** List of protocols with their volume data */
		protocols?: Array<{
			/** 24-hour volume */
			total24h?: number | null;
			/** 48-hour to 24-hour volume */
			total48hto24h?: number | null;
			/** 7-day volume */
			total7d?: number | null;
			/** 14-day to 7-day volume */
			total14dto7d?: number | null;
			/** 60-day to 30-day volume */
			total60dto30d?: number | null;
			/** 30-day volume */
			total30d?: number | null;
			/** 1-year volume */
			total1y?: number | null;
			/** All-time volume */
			totalAllTime?: number | null;
			/** Volume 7 days ago */
			total7DaysAgo?: number | null;
			/** Volume 30 days ago */
			total30DaysAgo?: number | null;
			/** Average 1-year volume */
			average1y?: number | null;
			/** 1-day change percentage */
			change_1d?: number | null;
			/** 7-day change percentage */
			change_7d?: number | null;
			/** 1-month change percentage */
			change_1m?: number | null;
			/** 7-day over 7-day change percentage */
			change_7dover7d?: number | null;
			/** 30-day over 30-day change percentage */
			change_30dover30d?: number | null;
			/** DefiLlama protocol ID */
			defillamaId?: string | null;
			/** Protocol name */
			name?: string | null;
			/** Protocol display name */
			displayName?: string | null;
			/** Protocol module name */
			module?: string | null;
			/** Protocol category */
			category?: string | null;
			/** Protocol logo URL */
			logo?: string | null;
			/** Supported chains */
			chains?: Array<string> | null;
			/** Protocol type */
			protocolType?: string | null;
			/** Methodology documentation URL */
			methodologyURL?: string | null;
			/** Protocol methodology details */
			methodology?: Record<string, string> | null;
			/** Parent protocol identifier */
			parentProtocol?: string | null;
			/** Protocol slug */
			slug?: string | null;
			/** Linked protocol names */
			linkedProtocols?: Array<string> | null;
			/** Protocol ID */
			id?: string | null;
			[key: string]: unknown;
		}> | null;
		[key: string]: unknown;
	};
	'volumes.optionsSummary': {
		/** Protocol ID */
		id?: string | null;
		/** Protocol name */
		name?: string | null;
		/** Protocol URL */
		url?: string | null;
		/** Protocol description */
		description?: string | null;
		/** Protocol logo URL */
		logo?: string | null;
		/** CoinGecko ID */
		gecko_id?: string | null;
		/** CoinMarketCap ID */
		cmcId?: string | null;
		/** Supported chains */
		chains?: Array<string> | null;
		/** Twitter handle */
		twitter?: string | null;
		/** Governance IDs */
		governanceID?: Array<string> | null;
		/** GitHub repositories */
		github?: Array<string> | null;
		/** Treasury address */
		treasury?: string | null;
		/** Token symbol */
		symbol?: string | null;
		/** Protocol address */
		address?: string | null;
		/** Child protocols */
		childProtocols?: Array<Record<string, DefillamaJsonValue>> | null;
		/** Linked protocols */
		linkedProtocols?: Array<string> | null;
		/** DefiLlama protocol ID */
		defillamaId?: string | null;
		/** Whether protocol is disabled */
		disabled?: boolean | null;
		/** Display name */
		displayName?: string | null;
		/** Module name */
		module?: string | null;
		/** Protocol category */
		category?: string | null;
		/** Methodology URL */
		methodologyURL?: string | null;
		/** Methodology details */
		methodology?: Record<string, DefillamaJsonValue> | null;
		/** Forked from protocol */
		forkedFrom?: string | null;
		/** Audit information */
		audits?: string | null;
		/** Audit links */
		audit_links?: Array<DefillamaJsonValue> | null;
		/** Version key */
		versionKey?: string | null;
		/** Parent protocol */
		parentProtocol?: string | null;
		/** Previous names */
		previousNames?: Array<DefillamaJsonValue> | null;
		/** Protocol slug */
		slug?: string | null;
		/** Protocol type */
		protocolType?: string | null;
		/** 24-hour volume */
		total24h?: number | null;
		/** 48-hour to 24-hour volume */
		total48hto24h?: number | null;
		/** 7-day volume */
		total7d?: number | null;
		/** All-time volume */
		totalAllTime?: number | null;
		/** Historical chart data with timestamps and volumes */
		totalDataChart?: Array<Array<number>> | null;
		/** Historical chart data broken down by chain and protocol */
		totalDataChartBreakdown?: Array<
			Array<number | Record<string, Record<string, number>>>
		> | null;
		/** 1-day change percentage */
		change_1d?: number | null;
		[key: string]: unknown;
	};
	'yields.borrow.marketHistory': {
		data?: Array<{
			/** Day (UTC) */
			date?: string | null;
			/** Total borrowed from the market, in USD */
			total_borrow_usd?: number | null;
			/** Liquidity still available to borrow, in USD */
			available_borrow_usd?: number | null;
			/** APY in percent paid by borrowers. Reward emissions reduce the cost, so total = base - reward and can be negative */
			borrow_cost_apy?: {
				/** Average over that day */
				avg_1d?: {
					/** Organic APY in percent, excluding incentive rewards */
					base?: number | null;
					/** APY in percent from incentive token emissions; null when there are none */
					reward?: number | null;
					/** base minus reward, in percent; negative means the borrower is net paid */
					total?: number | null;
					[key: string]: unknown;
				} | null;
				/** Trailing 7-day average */
				avg_7d?: {
					/** Organic APY in percent, excluding incentive rewards */
					base?: number | null;
					/** APY in percent from incentive token emissions; null when there are none */
					reward?: number | null;
					/** base minus reward, in percent; negative means the borrower is net paid */
					total?: number | null;
					[key: string]: unknown;
				} | null;
				/** Trailing 30-day average */
				avg_30d?: {
					/** Organic APY in percent, excluding incentive rewards */
					base?: number | null;
					/** APY in percent from incentive token emissions; null when there are none */
					reward?: number | null;
					/** base minus reward, in percent; negative means the borrower is net paid */
					total?: number | null;
					[key: string]: unknown;
				} | null;
				[key: string]: unknown;
			} | null;
			/** Intrinsic yield of the borrowed token. Borrowing a yield-bearing token adds this rate to the effective borrow cost, since the debt appreciates by it. Intrinsic yield is reported separately and is NOT included in the base/reward/total APY. Null when there is no intrinsic yield source. */
			intrinsic?: {
				/** Intrinsic APY in percent */
				apy?: {
					/** Average over that day */
					avg_1d?: {
						base?: number | null;
						[key: string]: unknown;
					} | null;
					/** Trailing 7-day average */
					avg_7d?: {
						base?: number | null;
						[key: string]: unknown;
					} | null;
					/** Trailing 30-day average */
					avg_30d?: {
						base?: number | null;
						[key: string]: unknown;
					} | null;
					[key: string]: unknown;
				} | null;
				[key: string]: unknown;
			} | null;
			[key: string]: unknown;
		}> | null;
		[key: string]: unknown;
	};
	'yields.borrow.markets': {
		data?: Array<{
			/** Market id (UUID) */
			id?: string | null;
			/** Stable market key. */
			pool_key?: string | null;
			/** Receipt / vault token representing the position; null when the market has no transferable pool token */
			pool_token?: {
				address?: string | null;
				symbol?: string | null;
				name?: string | null;
				[key: string]: unknown;
			} | null;
			/** Display strings for listings */
			display?: {
				/** Collateral symbol, or "COLLATERAL / DEBT" for isolated pairs */
				label?: string | null;
				detail?: string | null;
				[key: string]: unknown;
			} | null;
			/** Market page on the protocol app */
			url?: string | null;
			/** Protocol display name */
			protocol?: string | null;
			/** Chain display name */
			chain?: string | null;
			/** Token supplied as collateral; null when unknown */
			collateral_token?: {
				address?: string | null;
				symbol?: string | null;
				decimals?: number | null;
				[key: string]: unknown;
			} | null;
			/** Token borrowed from the market; null when unknown */
			borrow_token?: {
				address?: string | null;
				symbol?: string | null;
				decimals?: number | null;
				[key: string]: unknown;
			} | null;
			/** Incentive tokens currently emitted to the market; empty when there are none */
			reward_tokens?: Array<{
				address?: string | null;
				symbol?: string | null;
				decimals?: number | null;
				[key: string]: unknown;
			}> | null;
			/** Maximum loan-to-value as a fraction (0.805 = 80.5%) */
			loan_to_value?: number | null;
			/** Total supplied to the market, in USD */
			total_supply_usd?: number | null;
			/** Total borrowed from the market, in USD */
			total_borrow_usd?: number | null;
			/** Liquidity still available to borrow, in USD */
			available_borrow_usd?: number | null;
			/** APY in percent earned by suppliers */
			supply_apy?: {
				/** Latest observed values */
				current?: {
					/** Organic APY in percent, excluding incentive rewards */
					base?: number | null;
					/** APY in percent from incentive token emissions; null when there are none */
					reward?: number | null;
					/** base plus reward, in percent */
					total?: number | null;
					[key: string]: unknown;
				} | null;
				/** Trailing 7-day average */
				avg_7d?: {
					/** Organic APY in percent, excluding incentive rewards */
					base?: number | null;
					/** APY in percent from incentive token emissions; null when there are none */
					reward?: number | null;
					/** base plus reward, in percent */
					total?: number | null;
					[key: string]: unknown;
				} | null;
				/** Trailing 30-day average */
				avg_30d?: {
					/** Organic APY in percent, excluding incentive rewards */
					base?: number | null;
					/** APY in percent from incentive token emissions; null when there are none */
					reward?: number | null;
					/** base plus reward, in percent */
					total?: number | null;
					[key: string]: unknown;
				} | null;
				[key: string]: unknown;
			} | null;
			/** APY in percent paid by borrowers. Reward emissions reduce the cost, so total = base - reward and can be negative */
			borrow_cost_apy?: {
				/** Latest observed values */
				current?: {
					/** Organic APY in percent, excluding incentive rewards */
					base?: number | null;
					/** APY in percent from incentive token emissions; null when there are none */
					reward?: number | null;
					/** base minus reward, in percent; negative means the borrower is net paid */
					total?: number | null;
					[key: string]: unknown;
				} | null;
				/** Trailing 7-day average */
				avg_7d?: {
					/** Organic APY in percent, excluding incentive rewards */
					base?: number | null;
					/** APY in percent from incentive token emissions; null when there are none */
					reward?: number | null;
					/** base minus reward, in percent; negative means the borrower is net paid */
					total?: number | null;
					[key: string]: unknown;
				} | null;
				/** Trailing 30-day average */
				avg_30d?: {
					/** Organic APY in percent, excluding incentive rewards */
					base?: number | null;
					/** APY in percent from incentive token emissions; null when there are none */
					reward?: number | null;
					/** base minus reward, in percent; negative means the borrower is net paid */
					total?: number | null;
					[key: string]: unknown;
				} | null;
				[key: string]: unknown;
			} | null;
			/** Intrinsic yield of yield-bearing tokens on either side of the market */
			intrinsic?: {
				/** Intrinsic yield of the supply-side token. Intrinsic yield is reported separately and is NOT included in the base/reward/total APY. Null when there is no intrinsic yield source. */
				supply?: {
					/** Intrinsic APY in percent */
					apy?: {
						/** Latest observed value */
						current?: {
							base?: number | null;
							[key: string]: unknown;
						} | null;
						/** Trailing 7-day average */
						avg_7d?: {
							base?: number | null;
							[key: string]: unknown;
						} | null;
						/** Trailing 30-day average */
						avg_30d?: {
							base?: number | null;
							[key: string]: unknown;
						} | null;
						[key: string]: unknown;
					} | null;
					source_pool?: {
						/** Earn pool the intrinsic yield is sourced from */
						id?: string | null;
						/** Address of the yield-bearing token */
						pool_token?: string | null;
						symbol?: string | null;
						[key: string]: unknown;
					} | null;
					[key: string]: unknown;
				} | null;
				/** Intrinsic yield of the borrowed token. Borrowing a yield-bearing token adds this rate to the effective borrow cost, since the debt appreciates by it. Intrinsic yield is reported separately and is NOT included in the base/reward/total APY. Null when there is no intrinsic yield source. */
				borrow?: {
					/** Intrinsic APY in percent */
					apy?: {
						/** Latest observed value */
						current?: {
							base?: number | null;
							[key: string]: unknown;
						} | null;
						/** Trailing 7-day average */
						avg_7d?: {
							base?: number | null;
							[key: string]: unknown;
						} | null;
						/** Trailing 30-day average */
						avg_30d?: {
							base?: number | null;
							[key: string]: unknown;
						} | null;
						[key: string]: unknown;
					} | null;
					source_pool?: {
						/** Earn pool the intrinsic yield is sourced from */
						id?: string | null;
						/** Address of the yield-bearing token */
						pool_token?: string | null;
						symbol?: string | null;
						[key: string]: unknown;
					} | null;
					[key: string]: unknown;
				} | null;
				[key: string]: unknown;
			} | null;
			[key: string]: unknown;
		}> | null;
		[key: string]: unknown;
	};
	'yields.borrow.routes': {
		data?: Array<{
			/** Display strings for listings */
			display?: {
				/** Market variant label; null when there is only one market */
				detail?: string | null;
				[key: string]: unknown;
			} | null;
			/** Protocol display name */
			protocol?: string | null;
			/** Chain display name */
			chain?: string | null;
			/** The supplied collateral position */
			collateral?: {
				/** Collateral pool id (UUID) */
				id?: string | null;
				/** Stable pool key of the collateral pool */
				pool_key?: string | null;
				url?: string | null;
				/** Token supplied as collateral */
				token?: {
					address?: string | null;
					symbol?: string | null;
					decimals?: number | null;
					[key: string]: unknown;
				} | null;
				/** Maximum loan-to-value as a fraction (0.84 = 84%) */
				loan_to_value?: number | null;
				/** Total supplied to the collateral pool, in USD */
				total_supply_usd?: number | null;
				/** Supply APY in percent earned on the collateral */
				apy?: {
					/** Latest observed values */
					current?: {
						/** Organic APY in percent, excluding incentive rewards */
						base?: number | null;
						/** APY in percent from incentive token emissions; null when there are none */
						reward?: number | null;
						/** base plus reward, in percent */
						total?: number | null;
						[key: string]: unknown;
					} | null;
					/** Trailing 7-day average */
					avg_7d?: {
						/** Organic APY in percent, excluding incentive rewards */
						base?: number | null;
						/** APY in percent from incentive token emissions; null when there are none */
						reward?: number | null;
						/** base plus reward, in percent */
						total?: number | null;
						[key: string]: unknown;
					} | null;
					/** Trailing 30-day average */
					avg_30d?: {
						/** Organic APY in percent, excluding incentive rewards */
						base?: number | null;
						/** APY in percent from incentive token emissions; null when there are none */
						reward?: number | null;
						/** base plus reward, in percent */
						total?: number | null;
						[key: string]: unknown;
					} | null;
					[key: string]: unknown;
				} | null;
				/** Intrinsic yield of the collateral token. Intrinsic yield is reported separately and is NOT included in the base/reward/total APY. Null when there is no intrinsic yield source. */
				intrinsic?: {
					/** Intrinsic APY in percent */
					apy?: {
						/** Latest observed value */
						current?: {
							base?: number | null;
							[key: string]: unknown;
						} | null;
						/** Trailing 7-day average */
						avg_7d?: {
							base?: number | null;
							[key: string]: unknown;
						} | null;
						/** Trailing 30-day average */
						avg_30d?: {
							base?: number | null;
							[key: string]: unknown;
						} | null;
						[key: string]: unknown;
					} | null;
					source_pool?: {
						/** Earn pool the intrinsic yield is sourced from */
						id?: string | null;
						/** Address of the yield-bearing token */
						pool_token?: string | null;
						symbol?: string | null;
						[key: string]: unknown;
					} | null;
					[key: string]: unknown;
				} | null;
				/** Incentive tokens emitted to the collateral side; empty when there are none */
				reward_tokens?: Array<{
					address?: string | null;
					symbol?: string | null;
					decimals?: number | null;
					[key: string]: unknown;
				}> | null;
				[key: string]: unknown;
			} | null;
			/** The borrowed debt position */
			borrow?: {
				/** Debt market id (UUID) */
				id?: string | null;
				/** Stable pool key of the debt market */
				pool_key?: string | null;
				url?: string | null;
				/** Token borrowed */
				token?: {
					address?: string | null;
					symbol?: string | null;
					decimals?: number | null;
					[key: string]: unknown;
				} | null;
				/** Total borrowed from the market, in USD */
				total_borrow_usd?: number | null;
				/** Liquidity still available to borrow, in USD */
				available_borrow_usd?: number | null;
				/** Borrow cost APY in percent. Reward emissions reduce the cost, so total = base - reward and can be negative */
				cost_apy?: {
					/** Latest observed values */
					current?: {
						/** Organic APY in percent, excluding incentive rewards */
						base?: number | null;
						/** APY in percent from incentive token emissions; null when there are none */
						reward?: number | null;
						/** base minus reward, in percent; negative means the borrower is net paid */
						total?: number | null;
						[key: string]: unknown;
					} | null;
					/** Trailing 7-day average */
					avg_7d?: {
						/** Organic APY in percent, excluding incentive rewards */
						base?: number | null;
						/** APY in percent from incentive token emissions; null when there are none */
						reward?: number | null;
						/** base minus reward, in percent; negative means the borrower is net paid */
						total?: number | null;
						[key: string]: unknown;
					} | null;
					/** Trailing 30-day average */
					avg_30d?: {
						/** Organic APY in percent, excluding incentive rewards */
						base?: number | null;
						/** APY in percent from incentive token emissions; null when there are none */
						reward?: number | null;
						/** base minus reward, in percent; negative means the borrower is net paid */
						total?: number | null;
						[key: string]: unknown;
					} | null;
					[key: string]: unknown;
				} | null;
				/** Intrinsic yield of the borrowed token. Borrowing a yield-bearing token adds this rate to the effective borrow cost, since the debt appreciates by it. Intrinsic yield is reported separately and is NOT included in the base/reward/total APY. Null when there is no intrinsic yield source. */
				intrinsic?: {
					/** Intrinsic APY in percent */
					apy?: {
						/** Latest observed value */
						current?: {
							base?: number | null;
							[key: string]: unknown;
						} | null;
						/** Trailing 7-day average */
						avg_7d?: {
							base?: number | null;
							[key: string]: unknown;
						} | null;
						/** Trailing 30-day average */
						avg_30d?: {
							base?: number | null;
							[key: string]: unknown;
						} | null;
						[key: string]: unknown;
					} | null;
					source_pool?: {
						/** Earn pool the intrinsic yield is sourced from */
						id?: string | null;
						/** Address of the yield-bearing token */
						pool_token?: string | null;
						symbol?: string | null;
						[key: string]: unknown;
					} | null;
					[key: string]: unknown;
				} | null;
				/** Incentive tokens emitted to the borrow side; empty when there are none */
				reward_tokens?: Array<{
					address?: string | null;
					symbol?: string | null;
					decimals?: number | null;
					[key: string]: unknown;
				}> | null;
				[key: string]: unknown;
			} | null;
			/** Net APY in percent: collateral supply APY minus borrow cost. Keyed by APY composition: read the leaf matching the APY components you consume (base, base + reward, base + intrinsic, base + reward + intrinsic). */
			net_apy?: {
				/** Latest observed values */
				current?: {
					base?: number | null;
					base_reward?: number | null;
					base_intrinsic?: number | null;
					base_reward_intrinsic?: number | null;
					[key: string]: unknown;
				} | null;
				/** Trailing 7-day average */
				avg_7d?: {
					base?: number | null;
					base_reward?: number | null;
					base_intrinsic?: number | null;
					base_reward_intrinsic?: number | null;
					[key: string]: unknown;
				} | null;
				/** Trailing 30-day average */
				avg_30d?: {
					base?: number | null;
					base_reward?: number | null;
					base_intrinsic?: number | null;
					base_reward_intrinsic?: number | null;
					[key: string]: unknown;
				} | null;
				[key: string]: unknown;
			} | null;
			[key: string]: unknown;
		}> | null;
		[key: string]: unknown;
	};
	'yields.borrowPools': {
		status?: string | null;
		data?: Array<{
			chain?: string | null;
			project?: string | null;
			/** Uppercase symbol. */
			symbol?: string | null;
			/** TVL in USD; for lending markets this is available liquidity, not total supplied. */
			tvlUsd?: number | null;
			apyBase?: number | null;
			apyReward?: number | null;
			apy?: number | null;
			/** Reward token addresses, lowercase; null when no rewards are currently flowing. */
			rewardTokens?: Array<string> | null;
			/** Pool id (UUID). Same id space as the v2 yields API. */
			pool?: string | null;
			/** Absolute APY change vs 1 day ago, in percentage points. */
			apyPct1D?: number | null;
			apyPct7D?: number | null;
			apyPct30D?: number | null;
			/** Whether every underlying asset is a stablecoin. */
			stablecoin?: boolean | null;
			ilRisk?: string | null;
			exposure?: string | null;
			/** Always null; no longer computed. */
			predictions?: {
				predictedClass?: string | null;
				predictedProbability?: number | null;
				binnedConfidence?: number | null;
				[key: string]: unknown;
			} | null;
			poolMeta?: string | null;
			/** Always null; no longer computed. */
			mu?: number | null;
			/** Always null; no longer computed. */
			sigma?: number | null;
			/** Always null; no longer computed. */
			count?: number | null;
			/** True when the pool's APY is a statistical outlier within its cohort. */
			outlier?: boolean | null;
			/** Underlying token addresses, lowercase. */
			underlyingTokens?: Array<string> | null;
			/** Always null; no longer computed. */
			il7d?: number | null;
			/** Always null; no longer computed. */
			apyBase7d?: number | null;
			/** 30-day mean APY. */
			apyMean30d?: number | null;
			volumeUsd1d?: number | null;
			/** 7-day volume in USD. */
			volumeUsd7d?: number | null;
			/** Always null; no longer computed. */
			apyBaseInception?: number | null;
			apyBaseBorrow?: number | null;
			apyRewardBorrow?: number | null;
			totalSupplyUsd?: number | null;
			totalBorrowUsd?: number | null;
			debtCeilingUsd?: number | null;
			ltv?: number | null;
			borrowable?: boolean | null;
			/** The borrowed token's symbol when it differs from the deposited asset (CDP-style markets). */
			mintedCoin?: string | null;
			/** Always null; no longer computed. */
			borrowFactor?: number | null;
			[key: string]: unknown;
		}> | null;
		[key: string]: unknown;
	};
	'yields.earn.history': {
		data?: Array<{
			/** Day (UTC) */
			date?: string | null;
			/** Total value locked in USD at that day */
			tvl_usd?: number | null;
			/** Supply APY in percent, attributed into base (organic) and reward (incentive emissions) components */
			apy?: {
				/** Average over that day */
				avg_1d?: {
					/** Organic APY in percent, excluding incentive rewards */
					base?: number | null;
					/** APY in percent from incentive token emissions; null when there are none */
					reward?: number | null;
					/** base plus reward, in percent */
					total?: number | null;
					[key: string]: unknown;
				} | null;
				/** Trailing 7-day average */
				avg_7d?: {
					/** Organic APY in percent, excluding incentive rewards */
					base?: number | null;
					/** APY in percent from incentive token emissions; null when there are none */
					reward?: number | null;
					/** base plus reward, in percent */
					total?: number | null;
					[key: string]: unknown;
				} | null;
				/** Trailing 30-day average */
				avg_30d?: {
					/** Organic APY in percent, excluding incentive rewards */
					base?: number | null;
					/** APY in percent from incentive token emissions; null when there are none */
					reward?: number | null;
					/** base plus reward, in percent */
					total?: number | null;
					[key: string]: unknown;
				} | null;
				[key: string]: unknown;
			} | null;
			/** Intrinsic yield of a yield-bearing underlying token. Intrinsic yield is reported separately and is NOT included in the base/reward/total APY. Null when there is no intrinsic yield source. */
			intrinsic?: {
				/** Intrinsic APY in percent */
				apy?: {
					/** Average over that day */
					avg_1d?: {
						base?: number | null;
						[key: string]: unknown;
					} | null;
					/** Trailing 7-day average */
					avg_7d?: {
						base?: number | null;
						[key: string]: unknown;
					} | null;
					/** Trailing 30-day average */
					avg_30d?: {
						base?: number | null;
						[key: string]: unknown;
					} | null;
					[key: string]: unknown;
				} | null;
				[key: string]: unknown;
			} | null;
			/** Pool token price per share for vault-style pools; null otherwise */
			price_per_share?: number | null;
			[key: string]: unknown;
		}> | null;
		[key: string]: unknown;
	};
	'yields.earn.list': {
		data?: Array<{
			/** Pool id (UUID). Same id space as the v1 yields API pool field. */
			id?: string | null;
			/** Stable pool key. */
			pool_key?: string | null;
			/** Receipt / vault token representing the position; null when the pool has no transferable pool token */
			pool_token?: {
				address?: string | null;
				symbol?: string | null;
				name?: string | null;
				[key: string]: unknown;
			} | null;
			/** Display strings for listings */
			display?: {
				label?: string | null;
				detail?: string | null;
				[key: string]: unknown;
			} | null;
			/** The asset you provide to enter the pool (e.g. ETH, USDC, BTC) */
			reference_asset_symbol?: string | null;
			/** Pool page on the protocol app */
			url?: string | null;
			/** Protocol display name */
			protocol?: string | null;
			/** Chain display name */
			chain?: string | null;
			/** Tokens deposited into the pool */
			underlying_tokens?: Array<{
				address?: string | null;
				symbol?: string | null;
				decimals?: number | null;
				[key: string]: unknown;
			}> | null;
			/** Incentive tokens currently emitted to the pool; empty when there are none */
			reward_tokens?: Array<{
				address?: string | null;
				symbol?: string | null;
				decimals?: number | null;
				[key: string]: unknown;
			}> | null;
			/** Total value locked in USD */
			tvl_usd?: number | null;
			/** Supply APY in percent, attributed into base (organic) and reward (incentive emissions) components */
			apy?: {
				/** Latest observed values */
				current?: {
					/** Organic APY in percent, excluding incentive rewards */
					base?: number | null;
					/** APY in percent from incentive token emissions; null when there are none */
					reward?: number | null;
					/** base plus reward, in percent */
					total?: number | null;
					[key: string]: unknown;
				} | null;
				/** Trailing 7-day average */
				avg_7d?: {
					/** Organic APY in percent, excluding incentive rewards */
					base?: number | null;
					/** APY in percent from incentive token emissions; null when there are none */
					reward?: number | null;
					/** base plus reward, in percent */
					total?: number | null;
					[key: string]: unknown;
				} | null;
				/** Trailing 30-day average */
				avg_30d?: {
					/** Organic APY in percent, excluding incentive rewards */
					base?: number | null;
					/** APY in percent from incentive token emissions; null when there are none */
					reward?: number | null;
					/** base plus reward, in percent */
					total?: number | null;
					[key: string]: unknown;
				} | null;
				[key: string]: unknown;
			} | null;
			/** Yield accruing inside a yield-bearing underlying token, e.g. the stETH staking yield inside a wstETH pool. Intrinsic yield is reported separately and is NOT included in the base/reward/total APY. Null when there is no intrinsic yield source. */
			intrinsic?: {
				/** Intrinsic APY in percent */
				apy?: {
					/** Latest observed value */
					current?: {
						base?: number | null;
						[key: string]: unknown;
					} | null;
					/** Trailing 7-day average */
					avg_7d?: {
						base?: number | null;
						[key: string]: unknown;
					} | null;
					/** Trailing 30-day average */
					avg_30d?: {
						base?: number | null;
						[key: string]: unknown;
					} | null;
					[key: string]: unknown;
				} | null;
				source_pool?: {
					/** Earn pool the intrinsic yield is sourced from */
					id?: string | null;
					/** Address of the yield-bearing token */
					pool_token?: string | null;
					symbol?: string | null;
					[key: string]: unknown;
				} | null;
				[key: string]: unknown;
			} | null;
			/** Stability score (0 to 1) of the trailing 30-day APY series, computed as 1 / (1 + coefficient of variation); higher is steadier. Keyed by APY composition: read the leaf matching the APY components you consume (base, base + reward, base + intrinsic, base + reward + intrinsic). */
			stability_30d?: {
				base?: number | null;
				base_reward?: number | null;
				base_intrinsic?: number | null;
				base_reward_intrinsic?: number | null;
				[key: string]: unknown;
			} | null;
			/** Pool token price per share for vault-style pools; null otherwise */
			price_per_share?: number | null;
			/** Trailing 24h trading volume in USD for DEX pools; null otherwise */
			volume_1d_usd?: number | null;
			/** Boolean attributes, also available as filters on /yields/v2/earn/query */
			attributes?: {
				/** All pool assets are stablecoins */
				stablecoin_only?: boolean | null;
				/** Position is exposed to a single asset */
				single_asset_exposure?: boolean | null;
				/** Position can suffer impermanent loss */
				impermanent_loss_risk?: boolean | null;
				[key: string]: unknown;
			} | null;
			/** Pool token holder statistics; values are null where holder data is not tracked */
			holders?: {
				/** Number of pool token holders */
				count?: number | null;
				/** Average position size in USD */
				avg_position_usd?: number | null;
				/** Share of supply held by the top 10 holders, in percent */
				top_10_share_pct?: number | null;
				[key: string]: unknown;
			} | null;
			/** Remaining deposit capacity in USD for lending pools with a supply cap (cap minus TVL, floored at 0); null when the pool has no cap */
			available_supply_usd?: number | null;
			[key: string]: unknown;
		}> | null;
		[key: string]: unknown;
	};
	'yields.earn.query': {
		data?: Array<{
			/** Pool id (UUID). Same id space as the v1 yields API pool field. */
			id?: string | null;
			/** Stable pool key. */
			pool_key?: string | null;
			/** Receipt / vault token representing the position; null when the pool has no transferable pool token */
			pool_token?: {
				address?: string | null;
				symbol?: string | null;
				name?: string | null;
				[key: string]: unknown;
			} | null;
			/** Display strings for listings */
			display?: {
				label?: string | null;
				detail?: string | null;
				[key: string]: unknown;
			} | null;
			/** The asset you provide to enter the pool (e.g. ETH, USDC, BTC) */
			reference_asset_symbol?: string | null;
			/** Pool page on the protocol app */
			url?: string | null;
			/** Protocol display name */
			protocol?: string | null;
			/** Chain display name */
			chain?: string | null;
			/** Tokens deposited into the pool */
			underlying_tokens?: Array<{
				address?: string | null;
				symbol?: string | null;
				decimals?: number | null;
				[key: string]: unknown;
			}> | null;
			/** Incentive tokens currently emitted to the pool; empty when there are none */
			reward_tokens?: Array<{
				address?: string | null;
				symbol?: string | null;
				decimals?: number | null;
				[key: string]: unknown;
			}> | null;
			/** Total value locked in USD */
			tvl_usd?: number | null;
			/** Supply APY in percent, attributed into base (organic) and reward (incentive emissions) components */
			apy?: {
				/** Latest observed values */
				current?: {
					/** Organic APY in percent, excluding incentive rewards */
					base?: number | null;
					/** APY in percent from incentive token emissions; null when there are none */
					reward?: number | null;
					/** base plus reward, in percent */
					total?: number | null;
					[key: string]: unknown;
				} | null;
				/** Trailing 7-day average */
				avg_7d?: {
					/** Organic APY in percent, excluding incentive rewards */
					base?: number | null;
					/** APY in percent from incentive token emissions; null when there are none */
					reward?: number | null;
					/** base plus reward, in percent */
					total?: number | null;
					[key: string]: unknown;
				} | null;
				/** Trailing 30-day average */
				avg_30d?: {
					/** Organic APY in percent, excluding incentive rewards */
					base?: number | null;
					/** APY in percent from incentive token emissions; null when there are none */
					reward?: number | null;
					/** base plus reward, in percent */
					total?: number | null;
					[key: string]: unknown;
				} | null;
				[key: string]: unknown;
			} | null;
			/** Yield accruing inside a yield-bearing underlying token, e.g. the stETH staking yield inside a wstETH pool. Intrinsic yield is reported separately and is NOT included in the base/reward/total APY. Null when there is no intrinsic yield source. */
			intrinsic?: {
				/** Intrinsic APY in percent */
				apy?: {
					/** Latest observed value */
					current?: {
						base?: number | null;
						[key: string]: unknown;
					} | null;
					/** Trailing 7-day average */
					avg_7d?: {
						base?: number | null;
						[key: string]: unknown;
					} | null;
					/** Trailing 30-day average */
					avg_30d?: {
						base?: number | null;
						[key: string]: unknown;
					} | null;
					[key: string]: unknown;
				} | null;
				source_pool?: {
					/** Earn pool the intrinsic yield is sourced from */
					id?: string | null;
					/** Address of the yield-bearing token */
					pool_token?: string | null;
					symbol?: string | null;
					[key: string]: unknown;
				} | null;
				[key: string]: unknown;
			} | null;
			/** Stability score (0 to 1) of the trailing 30-day APY series, computed as 1 / (1 + coefficient of variation); higher is steadier. Keyed by APY composition: read the leaf matching the APY components you consume (base, base + reward, base + intrinsic, base + reward + intrinsic). */
			stability_30d?: {
				base?: number | null;
				base_reward?: number | null;
				base_intrinsic?: number | null;
				base_reward_intrinsic?: number | null;
				[key: string]: unknown;
			} | null;
			/** Pool token price per share for vault-style pools; null otherwise */
			price_per_share?: number | null;
			/** Trailing 24h trading volume in USD for DEX pools; null otherwise */
			volume_1d_usd?: number | null;
			/** Boolean attributes, also available as filters on /yields/v2/earn/query */
			attributes?: {
				/** All pool assets are stablecoins */
				stablecoin_only?: boolean | null;
				/** Position is exposed to a single asset */
				single_asset_exposure?: boolean | null;
				/** Position can suffer impermanent loss */
				impermanent_loss_risk?: boolean | null;
				[key: string]: unknown;
			} | null;
			/** Pool token holder statistics; values are null where holder data is not tracked */
			holders?: {
				/** Number of pool token holders */
				count?: number | null;
				/** Average position size in USD */
				avg_position_usd?: number | null;
				/** Share of supply held by the top 10 holders, in percent */
				top_10_share_pct?: number | null;
				[key: string]: unknown;
			} | null;
			/** Remaining deposit capacity in USD for lending pools with a supply cap (cap minus TVL, floored at 0); null when the pool has no cap */
			available_supply_usd?: number | null;
			[key: string]: unknown;
		}> | null;
		pagination?: {
			/** Total number of rows matching the filters, across all pages */
			total?: number | null;
			page?: number | null;
			limit?: number | null;
			[key: string]: unknown;
		} | null;
		[key: string]: unknown;
	};
	'yields.earn.verified': {
		data?: Array<{
			/** Pool id (UUID); joins to `/yields/v2/earn` */
			id?: string | null;
			/** Measured base APY in percent. Base only, since a withdrawal cannot see reward emissions (verified rewards are `apy_reward`), and unclamped, so it can be negative. All three windows end at `apy_as_of`. */
			apy?: {
				/** Trailing 1-day average */
				avg_1d?: number | null;
				/** Trailing 7-day average */
				avg_7d?: number | null;
				/** Trailing 30-day average */
				avg_30d?: number | null;
				[key: string]: unknown;
			} | null;
			/** Timestamp the APY windows end at */
			apy_as_of?: string | null;
			/** Why the APY is absent or qualified. Show it wherever the APY renders blank; null for most pools. */
			apy_note?: string | null;
			/** How closely independent holders agreed on the redemption rate. Grades the measurement, not the pool. */
			apy_confidence?: string | null;
			/** Verified reward APR in percent: simple, not compounded, from reward claims simulated for real holders (a Merkl leaf proven against the on-chain root, or the protocol's reward index). All three windows end at `apy_reward_as_of`. Null in every window means no verified reading (see… */
			apy_reward?: {
				/** Trailing 1-day average */
				avg_1d?: number | null;
				/** Trailing 7-day average */
				avg_7d?: number | null;
				/** Trailing 30-day average */
				avg_30d?: number | null;
				[key: string]: unknown;
			} | null;
			/** End of the newest finished reward day (00:00 UTC the next day). Null when the pool has no reward reading or note. */
			apy_reward_as_of?: string | null;
			/** Reward tokens bound to the pool, including any a note names. Null when none are bound. */
			apy_reward_tokens?: Array<{
				/** Reward token address */
				address?: string | null;
				/** Token symbol; null until its metadata is known */
				symbol?: string | null;
				/** Token decimals; null until its metadata is known */
				decimals?: number | null;
				[key: string]: unknown;
			}> | null;
			/** Where the reward reading was measured, a verified 0 included. Null when there is no reading. */
			apy_reward_sources?: Array<string> | null;
			/** Readable sentences; empty for most pools. Beside a reading, who earns it when not every holder does; with no reading, why it is withheld. Show them wherever the reward renders, or renders blank. */
			apy_reward_notes?: Array<string> | null;
			/** Exit health from the most recent simulated withdrawal. */
			exit?: {
				/** What a withdrawal would do today: `instant` all of it leaves now, `queued` accepted but paid later, `partial` bounded by `exit_liquidity`, `depleted` the lane is dust (under 0.1% of TVL and under $10k), `unavailable` nothing was accepted, `blocked` reverted as paused or unrecognized. Null when… */
				status?: string | null;
				/** Wait before a queued withdrawal can be claimed. Only set while `status` is `queued`. */
				eta_seconds?: number | null;
				/** Exit fee in basis points. When the protocol discloses a structured fee, this is that fee, observed with `price_per_share` on `tvl.as_of`; otherwise the median discount against the reported rate over the last 30 discount observations. Null when unknown, never a claimed zero. */
				fee_bps?: number | null;
				/** Timestamp of the exit observation */
				as_of?: string | null;
				/** Flat exit fee in raw base units of `denomination`, as a decimal string; parse with BigInt, not Number. Present only when the protocol discloses a structured fee, observed with `price_per_share` on `tvl.as_of`. Estimated proceeds: max(0, balance × price_per_share × (1 − fee_bps / 1e4) − fee_flat… */
				fee_flat?: string | null;
				[key: string]: unknown;
			} | null;
			/** Funded exit capacity, not backing inventory; for queued pools this is the on-chain funding buffer, not instant liquidity. Null means no on-chain capacity is exposed, not zero. */
			exit_liquidity?: {
				/** Raw base units of `denomination`, as a decimal string; parse with BigInt, not Number. */
				amount?: string | null;
				/** Capacity in USD. Null when `denomination` is, since the conversion needs its decimals. */
				usd?: number | null;
				/** Price impact of the simulated exit, in basis points */
				slippage_bps?: number | null;
				/** Day (UTC) the capacity was measured */
				as_of?: string | null;
				[key: string]: unknown;
			} | null;
			/** Receipt supply priced at the rate an exit actually paid, not the reported figure. */
			tvl?: {
				/** Receipt supply at the executed redemption rate. Raw base units of `denomination`, as a decimal string; parse with BigInt, not Number. */
				amount?: string | null;
				/** Verified TVL in USD. Null when `denomination` is. */
				usd?: number | null;
				/** Day (UTC) the TVL was measured */
				as_of?: string | null;
				[key: string]: unknown;
			} | null;
			/** Underlying assets per position token, in human units. For rebasing tokens (aTokens, stETH) this is per internal share, so read it as a series normalized to its first point, not as an absolute. Null for LP pools (`denomination.kind` is `lp_unit`): their unit is √(x·y) of the reserves, so a price… */
			price_per_share?: number | null;
			/** Asset an exit pays out, and the decimals its raw amounts use. A token for most pools; for LP pools (`kind` is `lp_unit`) a synthetic unit, √(x·y) of the pool's reserves, labelled with its LP token and coins. Null when it could not be pinned; the USD fields go null with it, and you must not… */
			denomination?:
				| (
						| {
								/** Payout token address */
								address?: string | null;
								/** Decimals of the payout token */
								decimals?: number | null;
								[key: string]: unknown;
						  }
						| {
								/** Marks an LP pool's synthetic unit */
								kind?: string | null;
								/** Address of the LP token the unit belongs to */
								lp_token?: string | null;
								/** Decimals of the raw amounts */
								decimals?: number | null;
								/** The pool's coins, as its underlying tokens */
								coins?: Array<string> | null;
								[key: string]: unknown;
						  }
				  )
				| null;
			[key: string]: unknown;
		}> | null;
		[key: string]: unknown;
	};
	'yields.earn.verifiedGet': {
		data?: {
			/** Pool id (UUID); joins to `/yields/v2/earn` */
			id?: string | null;
			/** Measured base APY in percent. Base only, since a withdrawal cannot see reward emissions (verified rewards are `apy_reward`), and unclamped, so it can be negative. All three windows end at `apy_as_of`. */
			apy?: {
				/** Trailing 1-day average */
				avg_1d?: number | null;
				/** Trailing 7-day average */
				avg_7d?: number | null;
				/** Trailing 30-day average */
				avg_30d?: number | null;
				[key: string]: unknown;
			} | null;
			/** Timestamp the APY windows end at */
			apy_as_of?: string | null;
			/** Why the APY is absent or qualified. Show it wherever the APY renders blank; null for most pools. */
			apy_note?: string | null;
			/** How closely independent holders agreed on the redemption rate. Grades the measurement, not the pool. */
			apy_confidence?: string | null;
			/** Verified reward APR in percent: simple, not compounded, from reward claims simulated for real holders (a Merkl leaf proven against the on-chain root, or the protocol's reward index). All three windows end at `apy_reward_as_of`. Null in every window means no verified reading (see… */
			apy_reward?: {
				/** Trailing 1-day average */
				avg_1d?: number | null;
				/** Trailing 7-day average */
				avg_7d?: number | null;
				/** Trailing 30-day average */
				avg_30d?: number | null;
				[key: string]: unknown;
			} | null;
			/** End of the newest finished reward day (00:00 UTC the next day). Null when the pool has no reward reading or note. */
			apy_reward_as_of?: string | null;
			/** Reward tokens bound to the pool, including any a note names. Null when none are bound. */
			apy_reward_tokens?: Array<{
				/** Reward token address */
				address?: string | null;
				/** Token symbol; null until its metadata is known */
				symbol?: string | null;
				/** Token decimals; null until its metadata is known */
				decimals?: number | null;
				[key: string]: unknown;
			}> | null;
			/** Where the reward reading was measured, a verified 0 included. Null when there is no reading. */
			apy_reward_sources?: Array<string> | null;
			/** Readable sentences; empty for most pools. Beside a reading, who earns it when not every holder does; with no reading, why it is withheld. Show them wherever the reward renders, or renders blank. */
			apy_reward_notes?: Array<string> | null;
			/** Exit health from the most recent simulated withdrawal. */
			exit?: {
				/** What a withdrawal would do today: `instant` all of it leaves now, `queued` accepted but paid later, `partial` bounded by `exit_liquidity`, `depleted` the lane is dust (under 0.1% of TVL and under $10k), `unavailable` nothing was accepted, `blocked` reverted as paused or unrecognized. Null when… */
				status?: string | null;
				/** Wait before a queued withdrawal can be claimed. Only set while `status` is `queued`. */
				eta_seconds?: number | null;
				/** Exit fee in basis points. When the protocol discloses a structured fee, this is that fee, observed with `price_per_share` on `tvl.as_of`; otherwise the median discount against the reported rate over the last 30 discount observations. Null when unknown, never a claimed zero. */
				fee_bps?: number | null;
				/** Timestamp of the exit observation */
				as_of?: string | null;
				/** Flat exit fee in raw base units of `denomination`, as a decimal string; parse with BigInt, not Number. Present only when the protocol discloses a structured fee, observed with `price_per_share` on `tvl.as_of`. Estimated proceeds: max(0, balance × price_per_share × (1 − fee_bps / 1e4) − fee_flat… */
				fee_flat?: string | null;
				[key: string]: unknown;
			} | null;
			/** Funded exit capacity, not backing inventory; for queued pools this is the on-chain funding buffer, not instant liquidity. Null means no on-chain capacity is exposed, not zero. */
			exit_liquidity?: {
				/** Raw base units of `denomination`, as a decimal string; parse with BigInt, not Number. */
				amount?: string | null;
				/** Capacity in USD. Null when `denomination` is, since the conversion needs its decimals. */
				usd?: number | null;
				/** Price impact of the simulated exit, in basis points */
				slippage_bps?: number | null;
				/** Day (UTC) the capacity was measured */
				as_of?: string | null;
				[key: string]: unknown;
			} | null;
			/** Receipt supply priced at the rate an exit actually paid, not the reported figure. */
			tvl?: {
				/** Receipt supply at the executed redemption rate. Raw base units of `denomination`, as a decimal string; parse with BigInt, not Number. */
				amount?: string | null;
				/** Verified TVL in USD. Null when `denomination` is. */
				usd?: number | null;
				/** Day (UTC) the TVL was measured */
				as_of?: string | null;
				[key: string]: unknown;
			} | null;
			/** Underlying assets per position token, in human units. For rebasing tokens (aTokens, stETH) this is per internal share, so read it as a series normalized to its first point, not as an absolute. Null for LP pools (`denomination.kind` is `lp_unit`): their unit is √(x·y) of the reserves, so a price… */
			price_per_share?: number | null;
			/** Asset an exit pays out, and the decimals its raw amounts use. A token for most pools; for LP pools (`kind` is `lp_unit`) a synthetic unit, √(x·y) of the pool's reserves, labelled with its LP token and coins. Null when it could not be pinned; the USD fields go null with it, and you must not… */
			denomination?:
				| (
						| {
								/** Payout token address */
								address?: string | null;
								/** Decimals of the payout token */
								decimals?: number | null;
								[key: string]: unknown;
						  }
						| {
								/** Marks an LP pool's synthetic unit */
								kind?: string | null;
								/** Address of the LP token the unit belongs to */
								lp_token?: string | null;
								/** Decimals of the raw amounts */
								decimals?: number | null;
								/** The pool's coins, as its underlying tokens */
								coins?: Array<string> | null;
								[key: string]: unknown;
						  }
				  )
				| null;
			/** On-chain calls the simulation executes, in order. Null when not recorded. */
			methods?: Array<string> | null;
			[key: string]: unknown;
		} | null;
		[key: string]: unknown;
	};
	'yields.earn.verifiedHistory': {
		data?: Array<{
			/** Day (UTC) */
			date?: string | null;
			/** Raw measurement outcome for that day, the uninterpreted form of `exit.status`. The `reverted_*` values are days a real withdrawal would have failed. */
			outcome?: string | null;
			/** Wait before that day's queued withdrawal could be claimed. Only set when `outcome` is `delayed`. */
			eta_seconds?: number | null;
			/** Holder-consensus confidence in that day's measurement */
			confidence?: string | null;
			/** Measured base APY in percent. Base only, since a withdrawal cannot see reward emissions (verified rewards are `apy_reward`), and unclamped, so it can be negative. */
			apy?: {
				/** Average over that day */
				avg_1d?: number | null;
				/** Trailing 7-day average ending that day */
				avg_7d?: number | null;
				/** Trailing 30-day average ending that day */
				avg_30d?: number | null;
				[key: string]: unknown;
			} | null;
			/** Verified reward APR in percent, simple, not compounded. Null in every window means no verified reading that day; 0 is a verified reading. */
			apy_reward?: {
				/** That day's reward APR */
				avg_1d?: number | null;
				/** Trailing 7-day average ending that day */
				avg_7d?: number | null;
				/** Trailing 30-day average ending that day */
				avg_30d?: number | null;
				[key: string]: unknown;
			} | null;
			/** That day's reward notes: who earns the reading, or why it is withheld. Empty for most days. */
			apy_reward_notes?: Array<string> | null;
			/** Underlying assets per position token, in human units. For rebasing tokens (aTokens, stETH) this is per internal share, so read it as a series normalized to its first point, not as an absolute. Null for LP pools (`denomination.kind` is `lp_unit`): their unit is √(x·y) of the reserves, so a price… */
			price_per_share?: number | null;
			/** The pool's reported price, for days the executed exit could not price one. A quote, not a measurement, so mark it differently in a chart. Null unless corroborated, and always for LP pools. */
			price_per_share_quoted?: number | null;
			/** Why `price_per_share` is null on a day that was otherwise measured; null when it is present. */
			reason?: string | null;
			/** Funded exit capacity, not backing inventory; for queued pools this is the on-chain funding buffer, not instant liquidity. Null means no on-chain capacity is exposed, not zero. */
			exit_liquidity?: {
				/** Raw base units of `denomination`, as a decimal string; parse with BigInt, not Number. */
				amount?: string | null;
				/** Capacity in USD. Null when `denomination` is, since the conversion needs its decimals. */
				usd?: number | null;
				/** Price impact of the simulated exit, in basis points */
				slippage_bps?: number | null;
				[key: string]: unknown;
			} | null;
			/** Receipt supply priced at the rate an exit actually paid, not the reported figure. */
			tvl?: {
				/** Receipt supply at the executed redemption rate. Raw base units of `denomination`, as a decimal string; parse with BigInt, not Number. */
				amount?: string | null;
				/** Verified TVL in USD. Null when `denomination` is. */
				usd?: number | null;
				[key: string]: unknown;
			} | null;
			/** Supply valued at the reported rate, for the days `tvl` is null. A valuation, not an exit measure. */
			tvl_quoted?: {
				/** Raw base units of `denomination`, as a decimal string; parse with BigInt, not Number. */
				amount?: string | null;
				/** Quoted valuation in USD */
				usd?: number | null;
				[key: string]: unknown;
			} | null;
			[key: string]: unknown;
		}> | null;
		[key: string]: unknown;
	};
	'yields.lendBorrowChart': {
		status?: string | null;
		data?: Array<{
			timestamp?: string | null;
			/** The day's last observation. */
			totalSupplyUsd?: number | null;
			/** The day's last observation. */
			totalBorrowUsd?: number | null;
			debtCeilingUsd?: number | null;
			/** The day's last observation. */
			apyBase?: number | null;
			apyReward?: number | null;
			/** The day's last observation. */
			apyBaseBorrow?: number | null;
			apyRewardBorrow?: number | null;
			[key: string]: unknown;
		}> | null;
		[key: string]: unknown;
	};
	'yields.loops': {
		data?: Array<{
			/** Collateral pool id (UUID) */
			id?: string | null;
			/** Display strings for listings */
			display?: {
				/** Market variant label; null when there is only one market */
				detail?: string | null;
				[key: string]: unknown;
			} | null;
			/** Protocol display name */
			protocol?: string | null;
			/** Chain display name */
			chain?: string | null;
			/** Token being looped (supplied and borrowed) */
			token?: {
				address?: string | null;
				symbol?: string | null;
				decimals?: number | null;
				[key: string]: unknown;
			} | null;
			/** Market page on the protocol app */
			url?: string | null;
			/** Maximum loan-to-value as a fraction (0.7 = 70%) */
			loan_to_value?: number | null;
			/** Total supplied to the market, in USD */
			total_supply_usd?: number | null;
			/** Total borrowed from the market, in USD */
			total_borrow_usd?: number | null;
			/** Liquidity still available to borrow, in USD */
			available_borrow_usd?: number | null;
			/** Unlevered supply APY in percent */
			supply_apy?: {
				/** Latest observed values */
				current?: {
					/** Organic APY in percent, excluding incentive rewards */
					base?: number | null;
					/** APY in percent from incentive token emissions; null when there are none */
					reward?: number | null;
					/** base plus reward, in percent */
					total?: number | null;
					[key: string]: unknown;
				} | null;
				/** Trailing 7-day average */
				avg_7d?: {
					/** Organic APY in percent, excluding incentive rewards */
					base?: number | null;
					/** APY in percent from incentive token emissions; null when there are none */
					reward?: number | null;
					/** base plus reward, in percent */
					total?: number | null;
					[key: string]: unknown;
				} | null;
				/** Trailing 30-day average */
				avg_30d?: {
					/** Organic APY in percent, excluding incentive rewards */
					base?: number | null;
					/** APY in percent from incentive token emissions; null when there are none */
					reward?: number | null;
					/** base plus reward, in percent */
					total?: number | null;
					[key: string]: unknown;
				} | null;
				[key: string]: unknown;
			} | null;
			/** Borrow cost APY in percent. Reward emissions reduce the cost, so total = base - reward and can be negative */
			borrow_cost_apy?: {
				/** Latest observed values */
				current?: {
					/** Organic APY in percent, excluding incentive rewards */
					base?: number | null;
					/** APY in percent from incentive token emissions; null when there are none */
					reward?: number | null;
					/** base minus reward, in percent; negative means the borrower is net paid */
					total?: number | null;
					[key: string]: unknown;
				} | null;
				/** Trailing 7-day average */
				avg_7d?: {
					/** Organic APY in percent, excluding incentive rewards */
					base?: number | null;
					/** APY in percent from incentive token emissions; null when there are none */
					reward?: number | null;
					/** base minus reward, in percent; negative means the borrower is net paid */
					total?: number | null;
					[key: string]: unknown;
				} | null;
				/** Trailing 30-day average */
				avg_30d?: {
					/** Organic APY in percent, excluding incentive rewards */
					base?: number | null;
					/** APY in percent from incentive token emissions; null when there are none */
					reward?: number | null;
					/** base minus reward, in percent; negative means the borrower is net paid */
					total?: number | null;
					[key: string]: unknown;
				} | null;
				[key: string]: unknown;
			} | null;
			/** Looped position APY */
			loop_apy?: {
				/** Number of borrow/re-supply iterations */
				loop_count?: number | null;
				/** Net APY in percent of the looped position at loop_count iterations */
				total?: number | null;
				[key: string]: unknown;
			} | null;
			/** Accumulated leverage after loop_count iterations */
			leverage?: {
				/** Total supplied relative to initial capital */
				supply_multiplier?: number | null;
				/** Total borrowed relative to initial capital */
				borrow_multiplier?: number | null;
				[key: string]: unknown;
			} | null;
			/** Intrinsic yield of the looped token. Intrinsic yield is reported separately and is NOT included in the base/reward/total APY. Null when there is no intrinsic yield source. */
			intrinsic?: {
				/** Intrinsic APY in percent */
				apy?: {
					/** Latest observed value */
					current?: {
						base?: number | null;
						[key: string]: unknown;
					} | null;
					/** Trailing 7-day average */
					avg_7d?: {
						base?: number | null;
						[key: string]: unknown;
					} | null;
					/** Trailing 30-day average */
					avg_30d?: {
						base?: number | null;
						[key: string]: unknown;
					} | null;
					[key: string]: unknown;
				} | null;
				source_pool?: {
					/** Earn pool the intrinsic yield is sourced from */
					id?: string | null;
					/** Address of the yield-bearing token */
					pool_token?: string | null;
					symbol?: string | null;
					[key: string]: unknown;
				} | null;
				[key: string]: unknown;
			} | null;
			/** Incentive tokens per market side; empty arrays when there are none */
			reward_tokens?: {
				/** Incentive tokens emitted to the supply side */
				supply?: Array<{
					address?: string | null;
					symbol?: string | null;
					decimals?: number | null;
					[key: string]: unknown;
				}> | null;
				/** Incentive tokens emitted to the borrow side */
				borrow?: Array<{
					address?: string | null;
					symbol?: string | null;
					decimals?: number | null;
					[key: string]: unknown;
				}> | null;
				[key: string]: unknown;
			} | null;
			[key: string]: unknown;
		}> | null;
		[key: string]: unknown;
	};
	'yields.lstRates': Array<{
		/** The name of the protocol issuing the LST */
		name?: string | null;
		/** The symbol of the LST */
		symbol?: string | null;
		/** The contract address of the LST */
		address?: string | null;
		/** The type of the LST (rebase or accruing) */
		type?: string | null;
		/** ETH per token owed by the protocol, read from its contract */
		expectedRate?: number | null;
		/** Executable market rate in ETH per token; null when no credible market quote exists */
		marketRate?: number | null;
		/** Percent deviation of the market rate from the expected rate */
		ethPeg?: number | null;
		/** The protocol fee percentage */
		fee?: number | null;
		[key: string]: unknown;
	}>;
	'yields.perpFundingRates': {
		status?: string | null;
		data?: Array<{
			perp_id?: string | null;
			timestamp?: string | null;
			marketplace?: string | null;
			market?: string | null;
			baseAsset?: string | null;
			fundingRate?: number | null;
			fundingRatePrevious?: number | null;
			fundingTimePrevious?: number | null;
			openInterest?: number | null;
			indexPrice?: number | null;
			fundingRate7dAverage?: number | null;
			fundingRate7dSum?: number | null;
			fundingRate30dAverage?: number | null;
			fundingRate30dSum?: number | null;
			[key: string]: unknown;
		}> | null;
		[key: string]: unknown;
	};
	'yields.poolChart': {
		status?: string | null;
		data?: Array<{
			timestamp?: string | null;
			/** The day's last observation. */
			tvlUsd?: number | null;
			/** The day's last observation. */
			apy?: number | null;
			apyBase?: number | null;
			apyReward?: number | null;
			/** Always null; no longer computed. */
			il7d?: number | null;
			/** 7-day base APY, where the adapter reports one. */
			apyBase7d?: number | null;
			/** The day's last observation. */
			pricePerShare?: number | null;
			[key: string]: unknown;
		}> | null;
		[key: string]: unknown;
	};
	'yields.pools': {
		status?: string | null;
		data?: Array<{
			/** Pool id (UUID). Same id space as the v2 yields API. */
			pool?: string | null;
			/** Timestamp of the latest data point. */
			timestamp?: string | null;
			project?: string | null;
			chain?: string | null;
			/** Uppercase symbol. */
			symbol?: string | null;
			poolMeta?: string | null;
			/** Underlying token addresses, lowercase. */
			underlyingTokens?: Array<string> | null;
			/** Reward token addresses, lowercase; null when no rewards are currently flowing. */
			rewardTokens?: Array<string> | null;
			/** Receipt/pool token address, lowercase. */
			poolTokenAddress?: string | null;
			/** TVL in USD; for lending markets this is available liquidity, not total supplied. */
			tvlUsd?: number | null;
			apy?: number | null;
			apyBase?: number | null;
			apyReward?: number | null;
			/** Always null; no longer computed. */
			il7d?: number | null;
			/** 7-day base APY, where the adapter reports one. */
			apyBase7d?: number | null;
			volumeUsd1d?: number | null;
			/** 7-day volume in USD. */
			volumeUsd7d?: number | null;
			/** Always null; no longer computed. */
			apyBaseInception?: number | null;
			url?: string | null;
			/** Absolute APY change vs 1 day ago, in percentage points. */
			apyPct1D?: number | null;
			apyPct7D?: number | null;
			apyPct30D?: number | null;
			/** 30-day mean APY. */
			apyMean30d?: number | null;
			/** Whether every underlying asset is a stablecoin. */
			stablecoin?: boolean | null;
			ilRisk?: string | null;
			exposure?: string | null;
			/** Always null; no longer computed. */
			return?: number | null;
			/** Always null; no longer computed. */
			count?: number | null;
			/** Always null; no longer computed. */
			apyMeanExpanding?: number | null;
			/** Always null; no longer computed. */
			apyStdExpanding?: number | null;
			/** Always null; no longer computed. */
			mu?: number | null;
			/** Always null; no longer computed. */
			sigma?: number | null;
			/** True when the pool's APY is a statistical outlier within its cohort. */
			outlier?: boolean | null;
			/** Always null; no longer computed. */
			project_factorized?: number | null;
			/** Always null; no longer computed. */
			chain_factorized?: number | null;
			/** Always null; no longer computed. */
			predictions?: {
				predictedClass?: string | null;
				predictedProbability?: number | null;
				binnedConfidence?: number | null;
				[key: string]: unknown;
			} | null;
			/** The original pool key (usually contains a pool address). */
			pool_old?: string | null;
			[key: string]: unknown;
		}> | null;
		[key: string]: unknown;
	};
};
