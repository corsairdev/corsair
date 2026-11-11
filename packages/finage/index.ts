import type {
	BindEndpoints,
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
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	FinageEndpointInputSchemas,
	FinageEndpointOutputSchemas,
	Market,
} from './endpoints';
import type {
	FinageEndpointInputs,
	FinageEndpointOutputs,
	FinageOperationName,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { FinageSchema } from './schema';

export type FinagePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalFinagePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof endpoints>;
};

export type FinageContext = CorsairPluginContext<
	typeof FinageSchema,
	FinagePluginOptions
>;
export type FinageKeyBuilderContext = KeyBuilderContext<FinagePluginOptions>;

type Endpoint<K extends FinageOperationName> = CorsairEndpoint<
	FinageContext,
	FinageEndpointInputs[K],
	FinageEndpointOutputs[K]
>;

export type FinageEndpoints = {
	[K in FinageOperationName]: Endpoint<K>;
};

const endpoints = { market: Market } as const;

export type FinageBoundEndpoints = BindEndpoints<typeof endpoints>;

export const finageEndpointSchemas = {
	'market.getBalanceSheetStatements': {
		input: FinageEndpointInputSchemas.getBalanceSheetStatements,
		output: FinageEndpointOutputSchemas.getBalanceSheetStatements,
	},
	'market.getCanadaMarketAggregates': {
		input: FinageEndpointInputSchemas.getCanadaMarketAggregates,
		output: FinageEndpointOutputSchemas.getCanadaMarketAggregates,
	},
	'market.getCanadaMarketLastPrice': {
		input: FinageEndpointInputSchemas.getCanadaMarketLastPrice,
		output: FinageEndpointOutputSchemas.getCanadaMarketLastPrice,
	},
	'market.getCashFlowStatements': {
		input: FinageEndpointInputSchemas.getCashFlowStatements,
		output: FinageEndpointOutputSchemas.getCashFlowStatements,
	},
	'market.getCfdEtfLastPrice': {
		input: FinageEndpointInputSchemas.getCfdEtfLastPrice,
		output: FinageEndpointOutputSchemas.getCfdEtfLastPrice,
	},
	'market.getCfdEtfMarketAggregates': {
		input: FinageEndpointInputSchemas.getCfdEtfMarketAggregates,
		output: FinageEndpointOutputSchemas.getCfdEtfMarketAggregates,
	},
	'market.getCfdEtfPreviousClose': {
		input: FinageEndpointInputSchemas.getCfdEtfPreviousClose,
		output: FinageEndpointOutputSchemas.getCfdEtfPreviousClose,
	},
	'market.getCfdIndexLastPrice': {
		input: FinageEndpointInputSchemas.getCfdIndexLastPrice,
		output: FinageEndpointOutputSchemas.getCfdIndexLastPrice,
	},
	'market.getCfdIndexMarketAggregates': {
		input: FinageEndpointInputSchemas.getCfdIndexMarketAggregates,
		output: FinageEndpointOutputSchemas.getCfdIndexMarketAggregates,
	},
	'market.getCfdIndexPreviousClose': {
		input: FinageEndpointInputSchemas.getCfdIndexPreviousClose,
		output: FinageEndpointOutputSchemas.getCfdIndexPreviousClose,
	},
	'market.convertCrypto': {
		input: FinageEndpointInputSchemas.convertCrypto,
		output: FinageEndpointOutputSchemas.convertCrypto,
	},
	'market.convertCurrency': {
		input: FinageEndpointInputSchemas.convertCurrency,
		output: FinageEndpointOutputSchemas.convertCurrency,
	},
	'market.getCountryDetail': {
		input: FinageEndpointInputSchemas.getCountryDetail,
		output: FinageEndpointOutputSchemas.getCountryDetail,
	},
	'market.getCryptoAggregates': {
		input: FinageEndpointInputSchemas.getCryptoAggregates,
		output: FinageEndpointOutputSchemas.getCryptoAggregates,
	},
	'market.getCryptoDetail': {
		input: FinageEndpointInputSchemas.getCryptoDetail,
		output: FinageEndpointOutputSchemas.getCryptoDetail,
	},
	'market.getCryptoLastQuote': {
		input: FinageEndpointInputSchemas.getCryptoLastQuote,
		output: FinageEndpointOutputSchemas.getCryptoLastQuote,
	},
	'market.getCryptoLastTrade': {
		input: FinageEndpointInputSchemas.getCryptoLastTrade,
		output: FinageEndpointOutputSchemas.getCryptoLastTrade,
	},
	'market.getCryptoNews': {
		input: FinageEndpointInputSchemas.getCryptoNews,
		output: FinageEndpointOutputSchemas.getCryptoNews,
	},
	'market.getCryptoPreviousClose': {
		input: FinageEndpointInputSchemas.getCryptoPreviousClose,
		output: FinageEndpointOutputSchemas.getCryptoPreviousClose,
	},
	'market.getCryptoSnapshot': {
		input: FinageEndpointInputSchemas.getCryptoSnapshot,
		output: FinageEndpointOutputSchemas.getCryptoSnapshot,
	},
	'market.getCryptoDetailed': {
		input: FinageEndpointInputSchemas.getCryptoDetailed,
		output: FinageEndpointOutputSchemas.getCryptoDetailed,
	},
	'market.getDelistedCompanies': {
		input: FinageEndpointInputSchemas.getDelistedCompanies,
		output: FinageEndpointOutputSchemas.getDelistedCompanies,
	},
	'market.getDividendsCalendar': {
		input: FinageEndpointInputSchemas.getDividendsCalendar,
		output: FinageEndpointOutputSchemas.getDividendsCalendar,
	},
	'market.getEarningsCalendar': {
		input: FinageEndpointInputSchemas.getEarningsCalendar,
		output: FinageEndpointOutputSchemas.getEarningsCalendar,
	},
	'market.getEconomicCalendar': {
		input: FinageEndpointInputSchemas.getEconomicCalendar,
		output: FinageEndpointOutputSchemas.getEconomicCalendar,
	},
	'market.getFinancialRatios': {
		input: FinageEndpointInputSchemas.getFinancialRatios,
		output: FinageEndpointOutputSchemas.getFinancialRatios,
	},
	'market.getCurrencyDetail': {
		input: FinageEndpointInputSchemas.getCurrencyDetail,
		output: FinageEndpointOutputSchemas.getCurrencyDetail,
	},
	'market.getForexLastQuote': {
		input: FinageEndpointInputSchemas.getForexLastQuote,
		output: FinageEndpointOutputSchemas.getForexLastQuote,
	},
	'market.getForexLastTrade': {
		input: FinageEndpointInputSchemas.getForexLastTrade,
		output: FinageEndpointOutputSchemas.getForexLastTrade,
	},
	'market.getForexMarketAggregates': {
		input: FinageEndpointInputSchemas.getForexMarketAggregates,
		output: FinageEndpointOutputSchemas.getForexMarketAggregates,
	},
	'market.getForexNews': {
		input: FinageEndpointInputSchemas.getForexNews,
		output: FinageEndpointOutputSchemas.getForexNews,
	},
	'market.getForexPreviousClose': {
		input: FinageEndpointInputSchemas.getForexPreviousClose,
		output: FinageEndpointOutputSchemas.getForexPreviousClose,
	},
	'market.getForexSignal': {
		input: FinageEndpointInputSchemas.getForexSignal,
		output: FinageEndpointOutputSchemas.getForexSignal,
	},
	'market.getForexSnapshot': {
		input: FinageEndpointInputSchemas.getForexSnapshot,
		output: FinageEndpointOutputSchemas.getForexSnapshot,
	},
	'market.getMostActiveStocks': {
		input: FinageEndpointInputSchemas.getMostActiveStocks,
		output: FinageEndpointOutputSchemas.getMostActiveStocks,
	},
	'market.getHistoricalDividendsCalendar': {
		input: FinageEndpointInputSchemas.getHistoricalDividendsCalendar,
		output: FinageEndpointOutputSchemas.getHistoricalDividendsCalendar,
	},
	'market.getHistoricalStockSplitCalendar': {
		input: FinageEndpointInputSchemas.getHistoricalStockSplitCalendar,
		output: FinageEndpointOutputSchemas.getHistoricalStockSplitCalendar,
	},
	'market.getIncomeStatements': {
		input: FinageEndpointInputSchemas.getIncomeStatements,
		output: FinageEndpointOutputSchemas.getIncomeStatements,
	},
	'market.getIndianMarketAggregates': {
		input: FinageEndpointInputSchemas.getIndianMarketAggregates,
		output: FinageEndpointOutputSchemas.getIndianMarketAggregates,
	},
	'market.getIndianMarketLastPrice': {
		input: FinageEndpointInputSchemas.getIndianMarketLastPrice,
		output: FinageEndpointOutputSchemas.getIndianMarketLastPrice,
	},
	'market.getInstitutionalHolders': {
		input: FinageEndpointInputSchemas.getInstitutionalHolders,
		output: FinageEndpointOutputSchemas.getInstitutionalHolders,
	},
	'market.getIpoCalendar': {
		input: FinageEndpointInputSchemas.getIpoCalendar,
		output: FinageEndpointOutputSchemas.getIpoCalendar,
	},
	'market.getMutualFundHolders': {
		input: FinageEndpointInputSchemas.getMutualFundHolders,
		output: FinageEndpointOutputSchemas.getMutualFundHolders,
	},
	'market.getSecRssFeed': {
		input: FinageEndpointInputSchemas.getSecRssFeed,
		output: FinageEndpointOutputSchemas.getSecRssFeed,
	},
	'market.getSectorPerformance': {
		input: FinageEndpointInputSchemas.getSectorPerformance,
		output: FinageEndpointOutputSchemas.getSectorPerformance,
	},
	'market.getStockCompanyDetails': {
		input: FinageEndpointInputSchemas.getStockCompanyDetails,
		output: FinageEndpointOutputSchemas.getStockCompanyDetails,
	},
	'market.getStockMarketAggregates': {
		input: FinageEndpointInputSchemas.getStockMarketAggregates,
		output: FinageEndpointOutputSchemas.getStockMarketAggregates,
	},
	'market.getStockLastQuote': {
		input: FinageEndpointInputSchemas.getStockLastQuote,
		output: FinageEndpointOutputSchemas.getStockLastQuote,
	},
	'market.getStockLastTrade': {
		input: FinageEndpointInputSchemas.getStockLastTrade,
		output: FinageEndpointOutputSchemas.getStockLastTrade,
	},
	'market.getRussianMarketAggregates': {
		input: FinageEndpointInputSchemas.getRussianMarketAggregates,
		output: FinageEndpointOutputSchemas.getRussianMarketAggregates,
	},
	'market.getRussianMarketLastPrice': {
		input: FinageEndpointInputSchemas.getRussianMarketLastPrice,
		output: FinageEndpointOutputSchemas.getRussianMarketLastPrice,
	},
	'market.getSharesFloat': {
		input: FinageEndpointInputSchemas.getSharesFloat,
		output: FinageEndpointOutputSchemas.getSharesFloat,
	},
	'market.getStockMarketNews': {
		input: FinageEndpointInputSchemas.getStockMarketNews,
		output: FinageEndpointOutputSchemas.getStockMarketNews,
	},
	'market.getStockMarketStatus': {
		input: FinageEndpointInputSchemas.getStockMarketStatus,
		output: FinageEndpointOutputSchemas.getStockMarketStatus,
	},
	'market.getStockPreviousClose': {
		input: FinageEndpointInputSchemas.getStockPreviousClose,
		output: FinageEndpointOutputSchemas.getStockPreviousClose,
	},
	'market.getStockSnapshot': {
		input: FinageEndpointInputSchemas.getStockSnapshot,
		output: FinageEndpointOutputSchemas.getStockSnapshot,
	},
	'market.getStockSplitCalendar': {
		input: FinageEndpointInputSchemas.getStockSplitCalendar,
		output: FinageEndpointOutputSchemas.getStockSplitCalendar,
	},
	'market.getTechnicalIndicators': {
		input: FinageEndpointInputSchemas.getTechnicalIndicators,
		output: FinageEndpointOutputSchemas.getTechnicalIndicators,
	},
	'market.getTopGainers': {
		input: FinageEndpointInputSchemas.getTopGainers,
		output: FinageEndpointOutputSchemas.getTopGainers,
	},
	'market.getTopLosers': {
		input: FinageEndpointInputSchemas.getTopLosers,
		output: FinageEndpointOutputSchemas.getTopLosers,
	},
	'market.getUkMarketAggregates': {
		input: FinageEndpointInputSchemas.getUkMarketAggregates,
		output: FinageEndpointOutputSchemas.getUkMarketAggregates,
	},
	'market.getUkMarketLastPrice': {
		input: FinageEndpointInputSchemas.getUkMarketLastPrice,
		output: FinageEndpointOutputSchemas.getUkMarketLastPrice,
	},
	'market.getUsStocksSignal': {
		input: FinageEndpointInputSchemas.getUsStocksSignal,
		output: FinageEndpointOutputSchemas.getUsStocksSignal,
	},
	'market.getBondsRate': {
		input: FinageEndpointInputSchemas.getBondsRate,
		output: FinageEndpointOutputSchemas.getBondsRate,
	},
	'market.listCryptocurrencies': {
		input: FinageEndpointInputSchemas.listCryptocurrencies,
		output: FinageEndpointOutputSchemas.listCryptocurrencies,
	},
	'market.listSymbols': {
		input: FinageEndpointInputSchemas.listSymbols,
		output: FinageEndpointOutputSchemas.listSymbols,
	},
	'market.searchCountry': {
		input: FinageEndpointInputSchemas.searchCountry,
		output: FinageEndpointOutputSchemas.searchCountry,
	},
	'market.searchCryptocurrency': {
		input: FinageEndpointInputSchemas.searchCryptocurrency,
		output: FinageEndpointOutputSchemas.searchCryptocurrency,
	},
	'market.searchCurrency': {
		input: FinageEndpointInputSchemas.searchCurrency,
		output: FinageEndpointOutputSchemas.searchCurrency,
	},
	'market.searchMarket': {
		input: FinageEndpointInputSchemas.searchMarket,
		output: FinageEndpointOutputSchemas.searchMarket,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof endpoints>;

const describe = (description: string) => ({
	riskLevel: 'read' as const,
	description,
});

export const finageEndpointMeta = {
	'market.getBalanceSheetStatements': describe(
		'Retrieve a company balance sheet',
	),
	'market.getCanadaMarketAggregates': describe(
		'Retrieve Canadian stock aggregates',
	),
	'market.getCanadaMarketLastPrice': describe(
		'Retrieve the latest Canadian stock price',
	),
	'market.getCashFlowStatements': describe(
		'Retrieve a company cash flow statement',
	),
	'market.getCfdEtfLastPrice': describe('Retrieve the latest ETF price'),
	'market.getCfdEtfMarketAggregates': describe(
		'Retrieve historical ETF aggregates',
	),
	'market.getCfdEtfPreviousClose': describe('Retrieve the previous ETF close'),
	'market.getCfdIndexLastPrice': describe('Retrieve the latest index price'),
	'market.getCfdIndexMarketAggregates': describe(
		'Retrieve historical index aggregates',
	),
	'market.getCfdIndexPreviousClose': describe(
		'Retrieve the previous index close',
	),
	'market.convertCrypto': describe(
		'Convert an amount between two cryptocurrencies',
	),
	'market.convertCurrency': describe(
		'Convert an amount between two fiat currencies',
	),
	'market.getCountryDetail': describe(
		'Retrieve country details used in market data',
	),
	'market.getCryptoAggregates': describe(
		'Retrieve historical cryptocurrency aggregates',
	),
	'market.getCryptoDetail': describe(
		'Retrieve fundamental details for a cryptocurrency',
	),
	'market.getCryptoLastQuote': describe(
		'Retrieve the latest cryptocurrency quote',
	),
	'market.getCryptoLastTrade': describe(
		'Retrieve the latest cryptocurrency trade',
	),
	'market.getCryptoNews': describe('Retrieve news for a cryptocurrency'),
	'market.getCryptoPreviousClose': describe(
		'Retrieve the previous cryptocurrency close',
	),
	'market.getCryptoSnapshot': describe(
		'Retrieve a snapshot of cryptocurrency market data',
	),
	'market.getCryptoDetailed': describe(
		'Retrieve detailed data for the latest cryptocurrency market state',
	),
	'market.getDelistedCompanies': describe('List delisted companies'),
	'market.getDividendsCalendar': describe('Retrieve the dividend calendar'),
	'market.getEarningsCalendar': describe('Retrieve the earnings calendar'),
	'market.getEconomicCalendar': describe('Retrieve the economic calendar'),
	'market.getFinancialRatios': describe('Retrieve a company financial ratios'),
	'market.getCurrencyDetail': describe(
		'Retrieve fundamental details for a currency',
	),
	'market.getForexLastQuote': describe('Retrieve the latest forex quote'),
	'market.getForexLastTrade': describe('Retrieve the latest forex trade'),
	'market.getForexMarketAggregates': describe(
		'Retrieve historical forex aggregates',
	),
	'market.getForexNews': describe('Retrieve news for a forex pair'),
	'market.getForexPreviousClose': describe('Retrieve the previous forex close'),
	'market.getForexSignal': describe('Retrieve a forex technical signal'),
	'market.getForexSnapshot': describe(
		'Retrieve a snapshot of forex market data',
	),
	'market.getMostActiveStocks': describe('List the most active US stocks'),
	'market.getHistoricalDividendsCalendar': describe(
		'Retrieve a company dividend history',
	),
	'market.getHistoricalStockSplitCalendar': describe(
		'Retrieve a company stock split history',
	),
	'market.getIncomeStatements': describe(
		'Retrieve company income statements and international filings',
	),
	'market.getIndianMarketAggregates': describe(
		'Retrieve Indian stock aggregates',
	),
	'market.getIndianMarketLastPrice': describe(
		'Retrieve the latest Indian stock price',
	),
	'market.getInstitutionalHolders': describe(
		'List institutional holders for a company',
	),
	'market.getIpoCalendar': describe('Retrieve the IPO calendar'),
	'market.getMutualFundHolders': describe(
		'List mutual fund holders for a company',
	),
	'market.getSecRssFeed': describe('Retrieve the SEC funds RSS feed'),
	'market.getSectorPerformance': describe(
		'Retrieve US stock sector performance',
	),
	'market.getStockCompanyDetails': describe(
		'Retrieve company fundamentals for a stock',
	),
	'market.getStockMarketAggregates': describe(
		'Retrieve stock market aggregates',
	),
	'market.getStockLastQuote': describe('Retrieve the latest stock quote'),
	'market.getStockLastTrade': describe('Retrieve the latest stock trade'),
	'market.getRussianMarketAggregates': describe(
		'Retrieve Russian stock aggregates',
	),
	'market.getRussianMarketLastPrice': describe(
		'Retrieve the latest Russian stock price',
	),
	'market.getSharesFloat': describe(
		'Retrieve public float and outstanding shares',
	),
	'market.getStockMarketNews': describe('Retrieve market news for a stock'),
	'market.getStockMarketStatus': describe(
		'Retrieve current market status and schedules',
	),
	'market.getStockPreviousClose': describe('Retrieve the previous stock close'),
	'market.getStockSnapshot': describe(
		'Retrieve a snapshot of stock market data',
	),
	'market.getStockSplitCalendar': describe('Retrieve the stock split calendar'),
	'market.getTechnicalIndicators': describe(
		'Calculate a technical indicator for a market symbol',
	),
	'market.getTopGainers': describe('List the top gaining US stocks'),
	'market.getTopLosers': describe('List the top losing US stocks'),
	'market.getUkMarketAggregates': describe('Retrieve UK stock aggregates'),
	'market.getUkMarketLastPrice': describe('Retrieve the latest UK stock price'),
	'market.getUsStocksSignal': describe('Retrieve a US stock technical signal'),
	'market.getBondsRate': describe(
		'Retrieve the latest US bond rate for a symbol',
	),
	'market.listCryptocurrencies': describe('List supported cryptocurrencies'),
	'market.listSymbols': describe('List symbols for a supported market'),
	'market.searchCountry': describe('Search countries by name or code'),
	'market.searchCryptocurrency': describe(
		'Search cryptocurrencies by name or code',
	),
	'market.searchCurrency': describe('Search currencies by name or code'),
	'market.searchMarket': describe('Search symbols within a market'),
} as const satisfies RequiredPluginEndpointMeta<typeof endpoints>;

export const finageAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseFinagePlugin<T extends FinagePluginOptions> = CorsairPlugin<
	'finage',
	typeof FinageSchema,
	typeof endpoints,
	{},
	T,
	'api_key'
>;
export type InternalFinagePlugin = BaseFinagePlugin<FinagePluginOptions>;

export function finage<const T extends FinagePluginOptions>(
	incomingOptions: FinagePluginOptions & T = {} as FinagePluginOptions & T,
): BaseFinagePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? 'api_key',
	};
	return {
		id: 'finage',
		authConfig: finageAuthConfig,
		schema: FinageSchema,
		options,
		hooks: options.hooks,
		endpoints,
		webhooks: {},
		endpointMeta: finageEndpointMeta,
		endpointSchemas: finageEndpointSchemas,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: FinageKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (key) return key;
			}
			throw new AuthMissingError('finage', 'api_key');
		},
	} as BaseFinagePlugin<T>;
}

export type {
	FinageEndpointInputs,
	FinageEndpointOutputs,
	FinageOperationName,
} from './endpoints/types';
