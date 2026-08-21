import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import {
	Commodities,
	Crypto,
	Economic,
	Forex,
	Fundamentals,
	Intelligence,
	Market,
	Technical,
	TimeSeries,
} from './endpoints';
import type {
	AlphaVantageEndpointInputs,
	AlphaVantageEndpointOutputs,
} from './endpoints/types';
import {
	AlphaVantageEndpointInputSchemas,
	AlphaVantageEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AlphaVantageSchema } from './schema';

export type AlphaVantagePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalAlphaVantagePlugin['hooks'];
	webhookHooks?: InternalAlphaVantagePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof alphavantageEndpointsNested>;
};

export type AlphaVantageContext = CorsairPluginContext<
	typeof AlphaVantageSchema,
	AlphaVantagePluginOptions
>;

export type AlphaVantageKeyBuilderContext =
	KeyBuilderContext<AlphaVantagePluginOptions>;

export type AlphaVantageBoundEndpoints = BindEndpoints<
	typeof alphavantageEndpointsNested
>;

type AlphaVantageEndpoint<K extends keyof AlphaVantageEndpointOutputs> =
	CorsairEndpoint<
		AlphaVantageContext,
		AlphaVantageEndpointInputs[K],
		AlphaVantageEndpointOutputs[K]
	>;

export type AlphaVantageEndpoints = {
	timeSeriesIntraday: AlphaVantageEndpoint<'timeSeriesIntraday'>;
	timeSeriesIntradayExtended: AlphaVantageEndpoint<'timeSeriesIntradayExtended'>;
	timeSeriesDaily: AlphaVantageEndpoint<'timeSeriesDaily'>;
	timeSeriesWeekly: AlphaVantageEndpoint<'timeSeriesWeekly'>;
	timeSeriesWeeklyAdjusted: AlphaVantageEndpoint<'timeSeriesWeeklyAdjusted'>;
	timeSeriesMonthly: AlphaVantageEndpoint<'timeSeriesMonthly'>;
	timeSeriesMonthlyAdjusted: AlphaVantageEndpoint<'timeSeriesMonthlyAdjusted'>;
	timeSeriesGlobalQuote: AlphaVantageEndpoint<'timeSeriesGlobalQuote'>;
	timeSeriesRealtimeBulkQuotes: AlphaVantageEndpoint<'timeSeriesRealtimeBulkQuotes'>;
	marketSymbolSearch: AlphaVantageEndpoint<'marketSymbolSearch'>;
	marketStatus: AlphaVantageEndpoint<'marketStatus'>;
	marketTopGainersLosers: AlphaVantageEndpoint<'marketTopGainersLosers'>;
	marketListingStatus: AlphaVantageEndpoint<'marketListingStatus'>;
	marketSector: AlphaVantageEndpoint<'marketSector'>;
	fundamentalsCompanyOverview: AlphaVantageEndpoint<'fundamentalsCompanyOverview'>;
	fundamentalsIncomeStatement: AlphaVantageEndpoint<'fundamentalsIncomeStatement'>;
	fundamentalsBalanceSheet: AlphaVantageEndpoint<'fundamentalsBalanceSheet'>;
	fundamentalsCashFlow: AlphaVantageEndpoint<'fundamentalsCashFlow'>;
	fundamentalsEarnings: AlphaVantageEndpoint<'fundamentalsEarnings'>;
	fundamentalsEarningsCalendar: AlphaVantageEndpoint<'fundamentalsEarningsCalendar'>;
	fundamentalsEarningsCallTranscript: AlphaVantageEndpoint<'fundamentalsEarningsCallTranscript'>;
	fundamentalsIpoCalendar: AlphaVantageEndpoint<'fundamentalsIpoCalendar'>;
	fundamentalsDividends: AlphaVantageEndpoint<'fundamentalsDividends'>;
	fundamentalsSplits: AlphaVantageEndpoint<'fundamentalsSplits'>;
	forexExchangeRate: AlphaVantageEndpoint<'forexExchangeRate'>;
	forexIntraday: AlphaVantageEndpoint<'forexIntraday'>;
	forexDaily: AlphaVantageEndpoint<'forexDaily'>;
	forexWeekly: AlphaVantageEndpoint<'forexWeekly'>;
	forexMonthly: AlphaVantageEndpoint<'forexMonthly'>;
	cryptoIntraday: AlphaVantageEndpoint<'cryptoIntraday'>;
	cryptoDaily: AlphaVantageEndpoint<'cryptoDaily'>;
	cryptoWeekly: AlphaVantageEndpoint<'cryptoWeekly'>;
	cryptoMonthly: AlphaVantageEndpoint<'cryptoMonthly'>;
	commoditiesAll: AlphaVantageEndpoint<'commoditiesAll'>;
	commoditiesAluminum: AlphaVantageEndpoint<'commoditiesAluminum'>;
	commoditiesBrent: AlphaVantageEndpoint<'commoditiesBrent'>;
	commoditiesCoffee: AlphaVantageEndpoint<'commoditiesCoffee'>;
	commoditiesCopper: AlphaVantageEndpoint<'commoditiesCopper'>;
	commoditiesCorn: AlphaVantageEndpoint<'commoditiesCorn'>;
	commoditiesCotton: AlphaVantageEndpoint<'commoditiesCotton'>;
	commoditiesSugar: AlphaVantageEndpoint<'commoditiesSugar'>;
	commoditiesWheat: AlphaVantageEndpoint<'commoditiesWheat'>;
	economicRealGdp: AlphaVantageEndpoint<'economicRealGdp'>;
	economicRealGdpPerCapita: AlphaVantageEndpoint<'economicRealGdpPerCapita'>;
	economicTreasuryYield: AlphaVantageEndpoint<'economicTreasuryYield'>;
	economicFederalFundsRate: AlphaVantageEndpoint<'economicFederalFundsRate'>;
	economicCpi: AlphaVantageEndpoint<'economicCpi'>;
	economicInflation: AlphaVantageEndpoint<'economicInflation'>;
	economicRetailSales: AlphaVantageEndpoint<'economicRetailSales'>;
	economicDurables: AlphaVantageEndpoint<'economicDurables'>;
	economicNonfarmPayroll: AlphaVantageEndpoint<'economicNonfarmPayroll'>;
	economicUnemployment: AlphaVantageEndpoint<'economicUnemployment'>;
	intelligenceNewsSentiment: AlphaVantageEndpoint<'intelligenceNewsSentiment'>;
	intelligenceSlidingWindowAnalytics: AlphaVantageEndpoint<'intelligenceSlidingWindowAnalytics'>;
	intelligenceHistoricalOptions: AlphaVantageEndpoint<'intelligenceHistoricalOptions'>;
	technicalIndicator: AlphaVantageEndpoint<'technicalIndicator'>;
};

/**
 * Alpha Vantage has no webhook, callback or streaming mechanism, so there are
 * no triggers to register. The OSS catalog lists zero triggers accordingly.
 */
export type AlphaVantageWebhooks = Record<string, never>;

export type AlphaVantageBoundWebhooks = BindWebhooks<AlphaVantageWebhooks>;

const alphavantageEndpointsNested = {
	timeSeries: {
		intraday: TimeSeries.intraday,
		intradayExtended: TimeSeries.intradayExtended,
		daily: TimeSeries.daily,
		weekly: TimeSeries.weekly,
		weeklyAdjusted: TimeSeries.weeklyAdjusted,
		monthly: TimeSeries.monthly,
		monthlyAdjusted: TimeSeries.monthlyAdjusted,
		globalQuote: TimeSeries.globalQuote,
		realtimeBulkQuotes: TimeSeries.realtimeBulkQuotes,
	},
	market: {
		symbolSearch: Market.symbolSearch,
		status: Market.status,
		topGainersLosers: Market.topGainersLosers,
		listingStatus: Market.listingStatus,
		sector: Market.sector,
	},
	fundamentals: {
		companyOverview: Fundamentals.companyOverview,
		incomeStatement: Fundamentals.incomeStatement,
		balanceSheet: Fundamentals.balanceSheet,
		cashFlow: Fundamentals.cashFlow,
		earnings: Fundamentals.earnings,
		earningsCalendar: Fundamentals.earningsCalendar,
		earningsCallTranscript: Fundamentals.earningsCallTranscript,
		ipoCalendar: Fundamentals.ipoCalendar,
		dividends: Fundamentals.dividends,
		splits: Fundamentals.splits,
	},
	forex: {
		exchangeRate: Forex.exchangeRate,
		intraday: Forex.intraday,
		daily: Forex.daily,
		weekly: Forex.weekly,
		monthly: Forex.monthly,
	},
	crypto: {
		intraday: Crypto.intraday,
		daily: Crypto.daily,
		weekly: Crypto.weekly,
		monthly: Crypto.monthly,
	},
	commodities: {
		all: Commodities.all,
		aluminum: Commodities.aluminum,
		brent: Commodities.brent,
		coffee: Commodities.coffee,
		copper: Commodities.copper,
		corn: Commodities.corn,
		cotton: Commodities.cotton,
		sugar: Commodities.sugar,
		wheat: Commodities.wheat,
	},
	economic: {
		realGdp: Economic.realGdp,
		realGdpPerCapita: Economic.realGdpPerCapita,
		treasuryYield: Economic.treasuryYield,
		federalFundsRate: Economic.federalFundsRate,
		cpi: Economic.cpi,
		inflation: Economic.inflation,
		retailSales: Economic.retailSales,
		durables: Economic.durables,
		nonfarmPayroll: Economic.nonfarmPayroll,
		unemployment: Economic.unemployment,
	},
	intelligence: {
		newsSentiment: Intelligence.newsSentiment,
		slidingWindowAnalytics: Intelligence.slidingWindowAnalytics,
		historicalOptions: Intelligence.historicalOptions,
	},
	technical: {
		indicator: Technical.indicator,
	},
} as const;

const alphavantageWebhooksNested = {} as const;

export const alphavantageEndpointSchemas = {
	'timeSeries.intraday': {
		input: AlphaVantageEndpointInputSchemas.timeSeriesIntraday,
		output: AlphaVantageEndpointOutputSchemas.timeSeriesIntraday,
	},
	'timeSeries.intradayExtended': {
		input: AlphaVantageEndpointInputSchemas.timeSeriesIntradayExtended,
		output: AlphaVantageEndpointOutputSchemas.timeSeriesIntradayExtended,
	},
	'timeSeries.daily': {
		input: AlphaVantageEndpointInputSchemas.timeSeriesDaily,
		output: AlphaVantageEndpointOutputSchemas.timeSeriesDaily,
	},
	'timeSeries.weekly': {
		input: AlphaVantageEndpointInputSchemas.timeSeriesWeekly,
		output: AlphaVantageEndpointOutputSchemas.timeSeriesWeekly,
	},
	'timeSeries.weeklyAdjusted': {
		input: AlphaVantageEndpointInputSchemas.timeSeriesWeeklyAdjusted,
		output: AlphaVantageEndpointOutputSchemas.timeSeriesWeeklyAdjusted,
	},
	'timeSeries.monthly': {
		input: AlphaVantageEndpointInputSchemas.timeSeriesMonthly,
		output: AlphaVantageEndpointOutputSchemas.timeSeriesMonthly,
	},
	'timeSeries.monthlyAdjusted': {
		input: AlphaVantageEndpointInputSchemas.timeSeriesMonthlyAdjusted,
		output: AlphaVantageEndpointOutputSchemas.timeSeriesMonthlyAdjusted,
	},
	'timeSeries.globalQuote': {
		input: AlphaVantageEndpointInputSchemas.timeSeriesGlobalQuote,
		output: AlphaVantageEndpointOutputSchemas.timeSeriesGlobalQuote,
	},
	'timeSeries.realtimeBulkQuotes': {
		input: AlphaVantageEndpointInputSchemas.timeSeriesRealtimeBulkQuotes,
		output: AlphaVantageEndpointOutputSchemas.timeSeriesRealtimeBulkQuotes,
	},
	'market.symbolSearch': {
		input: AlphaVantageEndpointInputSchemas.marketSymbolSearch,
		output: AlphaVantageEndpointOutputSchemas.marketSymbolSearch,
	},
	'market.status': {
		input: AlphaVantageEndpointInputSchemas.marketStatus,
		output: AlphaVantageEndpointOutputSchemas.marketStatus,
	},
	'market.topGainersLosers': {
		input: AlphaVantageEndpointInputSchemas.marketTopGainersLosers,
		output: AlphaVantageEndpointOutputSchemas.marketTopGainersLosers,
	},
	'market.listingStatus': {
		input: AlphaVantageEndpointInputSchemas.marketListingStatus,
		output: AlphaVantageEndpointOutputSchemas.marketListingStatus,
	},
	'market.sector': {
		input: AlphaVantageEndpointInputSchemas.marketSector,
		output: AlphaVantageEndpointOutputSchemas.marketSector,
	},
	'fundamentals.companyOverview': {
		input: AlphaVantageEndpointInputSchemas.fundamentalsCompanyOverview,
		output: AlphaVantageEndpointOutputSchemas.fundamentalsCompanyOverview,
	},
	'fundamentals.incomeStatement': {
		input: AlphaVantageEndpointInputSchemas.fundamentalsIncomeStatement,
		output: AlphaVantageEndpointOutputSchemas.fundamentalsIncomeStatement,
	},
	'fundamentals.balanceSheet': {
		input: AlphaVantageEndpointInputSchemas.fundamentalsBalanceSheet,
		output: AlphaVantageEndpointOutputSchemas.fundamentalsBalanceSheet,
	},
	'fundamentals.cashFlow': {
		input: AlphaVantageEndpointInputSchemas.fundamentalsCashFlow,
		output: AlphaVantageEndpointOutputSchemas.fundamentalsCashFlow,
	},
	'fundamentals.earnings': {
		input: AlphaVantageEndpointInputSchemas.fundamentalsEarnings,
		output: AlphaVantageEndpointOutputSchemas.fundamentalsEarnings,
	},
	'fundamentals.earningsCalendar': {
		input: AlphaVantageEndpointInputSchemas.fundamentalsEarningsCalendar,
		output: AlphaVantageEndpointOutputSchemas.fundamentalsEarningsCalendar,
	},
	'fundamentals.earningsCallTranscript': {
		input: AlphaVantageEndpointInputSchemas.fundamentalsEarningsCallTranscript,
		output:
			AlphaVantageEndpointOutputSchemas.fundamentalsEarningsCallTranscript,
	},
	'fundamentals.ipoCalendar': {
		input: AlphaVantageEndpointInputSchemas.fundamentalsIpoCalendar,
		output: AlphaVantageEndpointOutputSchemas.fundamentalsIpoCalendar,
	},
	'fundamentals.dividends': {
		input: AlphaVantageEndpointInputSchemas.fundamentalsDividends,
		output: AlphaVantageEndpointOutputSchemas.fundamentalsDividends,
	},
	'fundamentals.splits': {
		input: AlphaVantageEndpointInputSchemas.fundamentalsSplits,
		output: AlphaVantageEndpointOutputSchemas.fundamentalsSplits,
	},
	'forex.exchangeRate': {
		input: AlphaVantageEndpointInputSchemas.forexExchangeRate,
		output: AlphaVantageEndpointOutputSchemas.forexExchangeRate,
	},
	'forex.intraday': {
		input: AlphaVantageEndpointInputSchemas.forexIntraday,
		output: AlphaVantageEndpointOutputSchemas.forexIntraday,
	},
	'forex.daily': {
		input: AlphaVantageEndpointInputSchemas.forexDaily,
		output: AlphaVantageEndpointOutputSchemas.forexDaily,
	},
	'forex.weekly': {
		input: AlphaVantageEndpointInputSchemas.forexWeekly,
		output: AlphaVantageEndpointOutputSchemas.forexWeekly,
	},
	'forex.monthly': {
		input: AlphaVantageEndpointInputSchemas.forexMonthly,
		output: AlphaVantageEndpointOutputSchemas.forexMonthly,
	},
	'crypto.intraday': {
		input: AlphaVantageEndpointInputSchemas.cryptoIntraday,
		output: AlphaVantageEndpointOutputSchemas.cryptoIntraday,
	},
	'crypto.daily': {
		input: AlphaVantageEndpointInputSchemas.cryptoDaily,
		output: AlphaVantageEndpointOutputSchemas.cryptoDaily,
	},
	'crypto.weekly': {
		input: AlphaVantageEndpointInputSchemas.cryptoWeekly,
		output: AlphaVantageEndpointOutputSchemas.cryptoWeekly,
	},
	'crypto.monthly': {
		input: AlphaVantageEndpointInputSchemas.cryptoMonthly,
		output: AlphaVantageEndpointOutputSchemas.cryptoMonthly,
	},
	'commodities.all': {
		input: AlphaVantageEndpointInputSchemas.commoditiesAll,
		output: AlphaVantageEndpointOutputSchemas.commoditiesAll,
	},
	'commodities.aluminum': {
		input: AlphaVantageEndpointInputSchemas.commoditiesAluminum,
		output: AlphaVantageEndpointOutputSchemas.commoditiesAluminum,
	},
	'commodities.brent': {
		input: AlphaVantageEndpointInputSchemas.commoditiesBrent,
		output: AlphaVantageEndpointOutputSchemas.commoditiesBrent,
	},
	'commodities.coffee': {
		input: AlphaVantageEndpointInputSchemas.commoditiesCoffee,
		output: AlphaVantageEndpointOutputSchemas.commoditiesCoffee,
	},
	'commodities.copper': {
		input: AlphaVantageEndpointInputSchemas.commoditiesCopper,
		output: AlphaVantageEndpointOutputSchemas.commoditiesCopper,
	},
	'commodities.corn': {
		input: AlphaVantageEndpointInputSchemas.commoditiesCorn,
		output: AlphaVantageEndpointOutputSchemas.commoditiesCorn,
	},
	'commodities.cotton': {
		input: AlphaVantageEndpointInputSchemas.commoditiesCotton,
		output: AlphaVantageEndpointOutputSchemas.commoditiesCotton,
	},
	'commodities.sugar': {
		input: AlphaVantageEndpointInputSchemas.commoditiesSugar,
		output: AlphaVantageEndpointOutputSchemas.commoditiesSugar,
	},
	'commodities.wheat': {
		input: AlphaVantageEndpointInputSchemas.commoditiesWheat,
		output: AlphaVantageEndpointOutputSchemas.commoditiesWheat,
	},
	'economic.realGdp': {
		input: AlphaVantageEndpointInputSchemas.economicRealGdp,
		output: AlphaVantageEndpointOutputSchemas.economicRealGdp,
	},
	'economic.realGdpPerCapita': {
		input: AlphaVantageEndpointInputSchemas.economicRealGdpPerCapita,
		output: AlphaVantageEndpointOutputSchemas.economicRealGdpPerCapita,
	},
	'economic.treasuryYield': {
		input: AlphaVantageEndpointInputSchemas.economicTreasuryYield,
		output: AlphaVantageEndpointOutputSchemas.economicTreasuryYield,
	},
	'economic.federalFundsRate': {
		input: AlphaVantageEndpointInputSchemas.economicFederalFundsRate,
		output: AlphaVantageEndpointOutputSchemas.economicFederalFundsRate,
	},
	'economic.cpi': {
		input: AlphaVantageEndpointInputSchemas.economicCpi,
		output: AlphaVantageEndpointOutputSchemas.economicCpi,
	},
	'economic.inflation': {
		input: AlphaVantageEndpointInputSchemas.economicInflation,
		output: AlphaVantageEndpointOutputSchemas.economicInflation,
	},
	'economic.retailSales': {
		input: AlphaVantageEndpointInputSchemas.economicRetailSales,
		output: AlphaVantageEndpointOutputSchemas.economicRetailSales,
	},
	'economic.durables': {
		input: AlphaVantageEndpointInputSchemas.economicDurables,
		output: AlphaVantageEndpointOutputSchemas.economicDurables,
	},
	'economic.nonfarmPayroll': {
		input: AlphaVantageEndpointInputSchemas.economicNonfarmPayroll,
		output: AlphaVantageEndpointOutputSchemas.economicNonfarmPayroll,
	},
	'economic.unemployment': {
		input: AlphaVantageEndpointInputSchemas.economicUnemployment,
		output: AlphaVantageEndpointOutputSchemas.economicUnemployment,
	},
	'intelligence.newsSentiment': {
		input: AlphaVantageEndpointInputSchemas.intelligenceNewsSentiment,
		output: AlphaVantageEndpointOutputSchemas.intelligenceNewsSentiment,
	},
	'intelligence.slidingWindowAnalytics': {
		input: AlphaVantageEndpointInputSchemas.intelligenceSlidingWindowAnalytics,
		output:
			AlphaVantageEndpointOutputSchemas.intelligenceSlidingWindowAnalytics,
	},
	'intelligence.historicalOptions': {
		input: AlphaVantageEndpointInputSchemas.intelligenceHistoricalOptions,
		output: AlphaVantageEndpointOutputSchemas.intelligenceHistoricalOptions,
	},
	'technical.indicator': {
		input: AlphaVantageEndpointInputSchemas.technicalIndicator,
		output: AlphaVantageEndpointOutputSchemas.technicalIndicator,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof alphavantageEndpointsNested
>;

const alphavantageWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof alphavantageWebhooksNested
	>;

const defaultAuthType: AuthTypes = 'api_key' as const;

/**
 * Every Alpha Vantage operation is a read. The API exposes no way to create,
 * change or delete anything, so no operation carries a write or destructive
 * risk level.
 */
const alphavantageEndpointMeta = {
	'timeSeries.intraday': {
		riskLevel: 'read',
		description:
			'Get intraday OHLCV bars at 1-60 minute resolution [PREMIUM PLAN]',
	},
	'timeSeries.intradayExtended': {
		riskLevel: 'read',
		description:
			'Get historical intraday bars beyond the default window [PREMIUM PLAN]',
	},
	'timeSeries.daily': {
		riskLevel: 'read',
		description: 'Get daily OHLCV bars',
	},
	'timeSeries.weekly': {
		riskLevel: 'read',
		description: 'Get weekly OHLCV bars',
	},
	'timeSeries.weeklyAdjusted': {
		riskLevel: 'read',
		description: 'Get weekly bars adjusted for splits and dividends',
	},
	'timeSeries.monthly': {
		riskLevel: 'read',
		description: 'Get monthly OHLCV bars',
	},
	'timeSeries.monthlyAdjusted': {
		riskLevel: 'read',
		description: 'Get monthly bars adjusted for splits and dividends',
	},
	'timeSeries.globalQuote': {
		riskLevel: 'read',
		description: 'Get the latest price and volume for one ticker',
	},
	'timeSeries.realtimeBulkQuotes': {
		riskLevel: 'read',
		description: 'Get quotes for up to 100 tickers at once [PREMIUM PLAN]',
	},
	'market.symbolSearch': {
		riskLevel: 'read',
		description: 'Search securities by name or ticker fragment',
	},
	'market.status': {
		riskLevel: 'read',
		description: 'Get the open or closed state of global exchanges',
	},
	'market.topGainersLosers': {
		riskLevel: 'read',
		description:
			'Get the top gainers, losers and most actively traded US tickers',
	},
	'market.listingStatus': {
		riskLevel: 'read',
		description:
			'List every covered security, active or delisted (CSV upstream)',
	},
	'market.sector': {
		riskLevel: 'read',
		description:
			'Get sector performance [DEPRECATED UPSTREAM: returns an empty body]',
	},
	'fundamentals.companyOverview': {
		riskLevel: 'read',
		description: 'Get a company profile with sector and valuation figures',
	},
	'fundamentals.incomeStatement': {
		riskLevel: 'read',
		description: 'Get annual and quarterly income statements',
	},
	'fundamentals.balanceSheet': {
		riskLevel: 'read',
		description: 'Get annual and quarterly balance sheets',
	},
	'fundamentals.cashFlow': {
		riskLevel: 'read',
		description: 'Get annual and quarterly cash flow statements',
	},
	'fundamentals.earnings': {
		riskLevel: 'read',
		description: 'Get reported and estimated earnings per share',
	},
	'fundamentals.earningsCalendar': {
		riskLevel: 'read',
		description: 'List upcoming earnings dates (CSV upstream)',
	},
	'fundamentals.earningsCallTranscript': {
		riskLevel: 'read',
		description: 'Get an earnings call transcript with per-speaker sentiment',
	},
	'fundamentals.ipoCalendar': {
		riskLevel: 'read',
		description: 'List IPOs expected in the next three months (CSV upstream)',
	},
	'fundamentals.dividends': {
		riskLevel: 'read',
		description: 'Get historical and declared dividends',
	},
	'fundamentals.splits': {
		riskLevel: 'read',
		description: 'Get historical stock splits',
	},
	'forex.exchangeRate': {
		riskLevel: 'read',
		description: 'Get the current rate for a currency pair',
	},
	'forex.intraday': {
		riskLevel: 'read',
		description: 'Get intraday bars for a currency pair [PREMIUM PLAN]',
	},
	'forex.daily': {
		riskLevel: 'read',
		description: 'Get daily bars for a currency pair',
	},
	'forex.weekly': {
		riskLevel: 'read',
		description: 'Get weekly bars for a currency pair',
	},
	'forex.monthly': {
		riskLevel: 'read',
		description: 'Get monthly bars for a currency pair',
	},
	'crypto.intraday': {
		riskLevel: 'read',
		description: 'Get intraday bars for a digital currency [PREMIUM PLAN]',
	},
	'crypto.daily': {
		riskLevel: 'read',
		description: 'Get daily bars for a digital currency',
	},
	'crypto.weekly': {
		riskLevel: 'read',
		description: 'Get weekly bars for a digital currency',
	},
	'crypto.monthly': {
		riskLevel: 'read',
		description: 'Get monthly bars for a digital currency',
	},
	'commodities.all': {
		riskLevel: 'read',
		description: 'Get the global commodities price index',
	},
	'commodities.aluminum': {
		riskLevel: 'read',
		description: 'Get global aluminum prices',
	},
	'commodities.brent': {
		riskLevel: 'read',
		description: 'Get Brent crude oil prices',
	},
	'commodities.coffee': {
		riskLevel: 'read',
		description: 'Get global coffee prices',
	},
	'commodities.copper': {
		riskLevel: 'read',
		description: 'Get global copper prices',
	},
	'commodities.corn': {
		riskLevel: 'read',
		description: 'Get global corn prices',
	},
	'commodities.cotton': {
		riskLevel: 'read',
		description: 'Get global cotton prices',
	},
	'commodities.sugar': {
		riskLevel: 'read',
		description: 'Get global sugar prices',
	},
	'commodities.wheat': {
		riskLevel: 'read',
		description: 'Get global wheat prices',
	},
	'economic.realGdp': {
		riskLevel: 'read',
		description: 'Get US real gross domestic product',
	},
	'economic.realGdpPerCapita': {
		riskLevel: 'read',
		description: 'Get US real GDP per capita',
	},
	'economic.treasuryYield': {
		riskLevel: 'read',
		description: 'Get US treasury yield for a constant maturity',
	},
	'economic.federalFundsRate': {
		riskLevel: 'read',
		description: 'Get the US federal funds rate',
	},
	'economic.cpi': {
		riskLevel: 'read',
		description: 'Get the US consumer price index',
	},
	'economic.inflation': {
		riskLevel: 'read',
		description: 'Get annual US inflation',
	},
	'economic.retailSales': {
		riskLevel: 'read',
		description: 'Get US advance retail sales',
	},
	'economic.durables': {
		riskLevel: 'read',
		description: 'Get US durable goods orders',
	},
	'economic.nonfarmPayroll': {
		riskLevel: 'read',
		description: 'Get US nonfarm payroll totals',
	},
	'economic.unemployment': {
		riskLevel: 'read',
		description: 'Get the US unemployment rate',
	},
	'intelligence.newsSentiment': {
		riskLevel: 'read',
		description: 'Get market news with article and ticker sentiment scores',
	},
	'intelligence.slidingWindowAnalytics': {
		riskLevel: 'read',
		description: 'Get rolling-window statistics across a set of tickers',
	},
	'intelligence.historicalOptions': {
		riskLevel: 'read',
		description: 'Get a full options chain for one date [PREMIUM PLAN]',
	},
	'technical.indicator': {
		riskLevel: 'read',
		description: 'Calculate any technical indicator (SMA, EMA, RSI, MACD, ...)',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof alphavantageEndpointsNested
>;

/**
 * Alpha Vantage issues a single per-account API key passed as a query
 * parameter, with no OAuth flow, so account scoping keys off the tenant's
 * external id.
 */
export const alphavantageAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseAlphaVantagePlugin<T extends AlphaVantagePluginOptions> =
	CorsairPlugin<
		'alphavantage',
		typeof AlphaVantageSchema,
		typeof alphavantageEndpointsNested,
		typeof alphavantageWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalAlphaVantagePlugin =
	BaseAlphaVantagePlugin<AlphaVantagePluginOptions>;

export type ExternalAlphaVantagePlugin<T extends AlphaVantagePluginOptions> =
	BaseAlphaVantagePlugin<T>;

/**
 * Builds the Alpha Vantage plugin.
 *
 * Alpha Vantage authenticates with a single per-account API key sent as the
 * `apikey` query parameter and has no OAuth flow, so only `api_key` auth is
 * offered.
 */
export function alphavantage<const T extends AlphaVantagePluginOptions>(
	incomingOptions: AlphaVantagePluginOptions &
		T = {} as AlphaVantagePluginOptions & T,
): ExternalAlphaVantagePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'alphavantage',
		authConfig: alphavantageAuthConfig,
		schema: AlphaVantageSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: alphavantageEndpointsNested,
		webhooks: alphavantageWebhooksNested,
		endpointMeta: alphavantageEndpointMeta,
		endpointSchemas: alphavantageEndpointSchemas,
		webhookSchemas: alphavantageWebhookSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AlphaVantageKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalAlphaVantagePlugin;
}

export type {
	AlphaVantageCompanyOverview,
	AlphaVantageCsvRows,
	AlphaVantageEndpointInputs,
	AlphaVantageEndpointOutputs,
	AlphaVantageGlobalQuote,
	AlphaVantageIndicatorSeries,
	AlphaVantageNewsSentiment,
	AlphaVantageSeriesEnvelope,
	AlphaVantageSymbolMatch,
} from './endpoints/types';
export type { AlphaVantageWebhookOutputs } from './webhooks/types';
