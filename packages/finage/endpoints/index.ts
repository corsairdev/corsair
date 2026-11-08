import { logEventFromContext } from 'corsair/core';
import { makeFinageRequest } from '../client';
import type { FinageContext, FinageEndpoints } from '../index';
import type {
	FinageEndpointInputs,
	FinageEndpointOutputs,
	FinageOperationName,
} from './types';
import {
	FinageEndpointInputSchemas,
	FinageEndpointOutputSchemas,
} from './types';

type RequestValue = string | number | boolean | undefined;
type RequestInput = Record<string, RequestValue>;
type OperationSpec = {
	path: (input: RequestInput) => string;
	query?: (input: RequestInput) => RequestInput;
};

function requiredSegment(input: RequestInput, field: string): string {
	const value = input[field];
	if (
		(typeof value !== 'string' && typeof value !== 'number') ||
		String(value).length === 0 ||
		String(value) === '.' ||
		String(value) === '..' ||
		/[\\/]/.test(String(value))
	) {
		throw new Error(`Finage requires a safe ${field} path segment`);
	}
	return encodeURIComponent(String(value));
}

function toRequestInput(value: object): RequestInput {
	const input: RequestInput = {};
	for (const [key, field] of Object.entries(value)) {
		if (
			typeof field === 'string' ||
			typeof field === 'number' ||
			typeof field === 'boolean' ||
			field === undefined
		) {
			input[key] = field;
		}
	}
	return input;
}

function queryFields(...fields: string[]): OperationSpec['query'] {
	return (input) =>
		Object.fromEntries(
			fields.flatMap((field) =>
				input[field] === undefined ? [] : [[field, input[field]]],
			),
		);
}

function aggregatePath(family: string) {
	return (input: RequestInput) =>
		`/agg/${family}/${requiredSegment(input, 'symbol')}/${requiredSegment(input, 'multiply')}/${requiredSegment(input, 'time')}/${requiredSegment(input, 'from')}/${requiredSegment(input, 'to')}`;
}

function pathWithQuerySegment(input: RequestInput) {
	const symbol = requiredSegment(input, 'symbol');
	const exchangeCode = input.exchange_code;
	return `/fnd/income-statement/${symbol}${exchangeCode === undefined ? '' : `.${requiredSegment(input, 'exchange_code')}`}`;
}

function signalPath(input: RequestInput) {
	return `/fnd/signals/forex/${requiredSegment(input, 'interval')}/${requiredSegment(input, 'symbol')}`;
}

function globalAggregatePath(family: string) {
	return (input: RequestInput) =>
		`/agg/${family}/${requiredSegment(input, 'symbol')}/${requiredSegment(input, 'time')}/${requiredSegment(input, 'from')}/${requiredSegment(input, 'to')}`;
}

const specs: Record<FinageOperationName, OperationSpec> = {
	convertCrypto: {
		path: (input) =>
			`/convert/crypto/${requiredSegment(input, 'from')}/${requiredSegment(input, 'to')}/${requiredSegment(input, 'amount')}`,
	},
	convertCurrency: {
		path: (input) =>
			`/convert/forex/${requiredSegment(input, 'from')}/${requiredSegment(input, 'to')}/${requiredSegment(input, 'amount')}`,
	},
	getCountryDetail: {
		path: (input) => `/fnd/detail/country/${requiredSegment(input, 'country')}`,
	},
	getBalanceSheetStatements: {
		path: (input) =>
			`/fnd/balance-sheet-statements/${requiredSegment(input, 'symbol')}`,
		query: queryFields('limit', 'period'),
	},
	getCanadaMarketAggregates: {
		path: globalAggregatePath('stock/global/ca'),
		query: queryFields(
			'limit',
			'sort',
			'date_format',
			'dbt_filter',
			'st',
			'et',
		),
	},
	getCanadaMarketLastPrice: {
		path: (input) => `/last/stock/ca/${requiredSegment(input, 'symbol')}`,
	},
	getCashFlowStatements: {
		path: (input) =>
			`/fnd/cash-flow-statement/${requiredSegment(input, 'symbol')}`,
		query: queryFields('limit', 'period'),
	},
	getCfdEtfLastPrice: {
		path: (input) => `/last/etf/${requiredSegment(input, 'symbol')}`,
	},
	getCfdEtfMarketAggregates: {
		path: globalAggregatePath('etf'),
		query: queryFields(
			'limit',
			'sort',
			'date_format',
			'dbt_filter',
			'st',
			'et',
		),
	},
	getCfdEtfPreviousClose: {
		path: (input) => `/agg/etf/prev-close/${requiredSegment(input, 'symbol')}`,
	},
	getCfdIndexLastPrice: {
		path: (input) => `/last/index/${requiredSegment(input, 'symbol')}`,
	},
	getCfdIndexMarketAggregates: {
		path: globalAggregatePath('index'),
		query: queryFields(
			'limit',
			'sort',
			'date_format',
			'dbt_filter',
			'st',
			'et',
		),
	},
	getCfdIndexPreviousClose: {
		path: (input) =>
			`/agg/index/prev-close/${requiredSegment(input, 'symbol')}`,
	},
	getCryptoAggregates: {
		path: aggregatePath('crypto'),
		// Crypto aggregates document only limit and sort; the other aggregate
		// filters are specific to stock, forex, and global market routes.
		query: queryFields('limit', 'sort'),
	},
	getCryptoDetail: {
		path: (input) =>
			`/fnd/detail/cryptocurrency/${requiredSegment(input, 'symbol')}`,
	},
	getDelistedCompanies: {
		path: () => '/fnd/delisted-companies',
		query: queryFields('limit'),
	},
	getDividendsCalendar: {
		path: () => '/fnd/dividend-calendar',
		query: queryFields('from', 'to'),
	},
	getEarningsCalendar: {
		path: () => '/fnd/earning-calendar',
	},
	getEconomicCalendar: {
		path: () => '/fnd/economic-calendar',
		query: queryFields('from', 'to'),
	},
	getFinancialRatios: {
		path: (input) =>
			`/fnd/financial-ratios/${requiredSegment(input, 'symbol')}`,
	},
	getCryptoLastQuote: {
		path: (input) => `/last/quote/crypto/${requiredSegment(input, 'symbol')}`,
	},
	getCryptoLastTrade: {
		path: (input) => `/last/crypto/${requiredSegment(input, 'symbol')}`,
	},
	getCryptoNews: {
		path: (input) => `/news/cryptocurrency/${requiredSegment(input, 'symbol')}`,
		query: queryFields('limit'),
	},
	getCryptoPreviousClose: {
		path: (input) =>
			`/agg/crypto/prev-close/${requiredSegment(input, 'symbol')}`,
	},
	getCryptoSnapshot: {
		path: () => '/snapshot/crypto',
		query: queryFields('quotes', 'trades', 'symbols'),
	},
	getCurrencyDetail: {
		path: (input) => `/fnd/detail/currency/${requiredSegment(input, 'symbol')}`,
	},
	getCryptoDetailed: {
		path: (input) =>
			`/fnd/last/crypto/detailed/${requiredSegment(input, 'symbol')}`,
	},
	getForexLastQuote: {
		path: (input) => `/last/forex/${requiredSegment(input, 'symbol')}`,
	},
	getForexLastTrade: {
		path: (input) => `/last/trade/forex/${requiredSegment(input, 'symbol')}`,
	},
	getForexMarketAggregates: {
		path: aggregatePath('forex'),
		query: queryFields(
			'limit',
			'sort',
			'dbt_filter',
			'st',
			'et',
			'date_format',
		),
	},
	getForexNews: {
		path: (input) => `/news/forex/${requiredSegment(input, 'symbol')}`,
		query: queryFields('limit'),
	},
	getForexPreviousClose: {
		path: (input) =>
			`/agg/forex/prev-close/${requiredSegment(input, 'symbol')}`,
	},
	getForexSignal: {
		path: signalPath,
	},
	getForexSnapshot: {
		path: () => '/snapshot/forex',
		query: queryFields('quotes', 'trades', 'symbols'),
	},
	getMostActiveStocks: {
		path: () => '/fnd/market-information/us/most-actives',
	},
	getHistoricalDividendsCalendar: {
		path: (input) =>
			`/fnd/historical-dividends/${requiredSegment(input, 'symbol')}`,
	},
	getHistoricalStockSplitCalendar: {
		path: (input) =>
			`/fnd/historical-stock-splits/${requiredSegment(input, 'symbol')}`,
	},
	getIncomeStatements: {
		path: pathWithQuerySegment,
		query: queryFields('limit', 'period'),
	},
	getIndianMarketAggregates: {
		path: globalAggregatePath('stock/global/in'),
		query: queryFields(
			'limit',
			'sort',
			'date_format',
			'dbt_filter',
			'st',
			'et',
		),
	},
	getIndianMarketLastPrice: {
		path: (input) => `/last/stock/in/${requiredSegment(input, 'symbol')}`,
	},
	getInstitutionalHolders: {
		path: (input) =>
			`/fnd/funds/institutional-holder/${requiredSegment(input, 'symbol')}`,
	},
	getIpoCalendar: {
		path: () => '/fnd/ipo-calendar',
		query: queryFields('from', 'to'),
	},
	getMutualFundHolders: {
		path: (input) =>
			`/fnd/funds/mutual-fund-holder/${requiredSegment(input, 'symbol')}`,
	},
	getSecRssFeed: {
		path: () => '/fnd/funds/rss-feed',
	},
	getSectorPerformance: {
		path: () => '/fnd/market-information/us/sector-performance',
	},
	getStockCompanyDetails: {
		path: (input) => `/fnd/detail/stock/${requiredSegment(input, 'symbol')}`,
	},
	getStockMarketAggregates: {
		path: aggregatePath('stock'),
		query: queryFields(
			'limit',
			'sort',
			'dbt_filter',
			'st',
			'et',
			'date_format',
		),
	},
	getStockLastQuote: {
		path: (input) => `/last/stock/${requiredSegment(input, 'symbol')}`,
	},
	getRussianMarketAggregates: {
		path: globalAggregatePath('stock/global/ru'),
		query: queryFields(
			'limit',
			'sort',
			'date_format',
			'dbt_filter',
			'st',
			'et',
		),
	},
	getRussianMarketLastPrice: {
		path: (input) => `/last/stock/ru/${requiredSegment(input, 'symbol')}`,
	},
	getSharesFloat: {
		path: (input) => `/fnd/shares-float/${requiredSegment(input, 'symbol')}`,
	},
	getStockLastTrade: {
		path: (input) => `/last/trade/stock/${requiredSegment(input, 'symbol')}`,
	},
	getStockMarketNews: {
		path: (input) => `/news/market/${requiredSegment(input, 'symbol')}`,
		query: queryFields('limit'),
	},
	getStockMarketStatus: {
		path: () => '/marketstatus',
		query: queryFields(
			'country',
			'currencies',
			'holidays',
			'trading_hours',
			'extended_hours',
		),
	},
	getStockPreviousClose: {
		path: (input) =>
			`/agg/stock/prev-close/${requiredSegment(input, 'symbol')}`,
	},
	getStockSplitCalendar: {
		path: () => '/fnd/stock-split-calendar',
		query: queryFields('from', 'to'),
	},
	getStockSnapshot: {
		path: () => '/snapshot/stock',
		query: queryFields('quotes', 'trades', 'symbols'),
	},
	getTechnicalIndicators: {
		path: (input) =>
			`/fnd/technical-indicator/${requiredSegment(input, 'type').toLowerCase()}/${requiredSegment(input, 'time')}/${requiredSegment(input, 'symbol')}`,
		query: queryFields('period'),
	},
	getTopGainers: {
		path: () => '/fnd/market-information/us/most-gainers',
	},
	getTopLosers: {
		path: () => '/fnd/market-information/us/most-losers',
	},
	getUkMarketAggregates: {
		path: globalAggregatePath('stock/global/uk'),
		query: queryFields(
			'limit',
			'sort',
			'date_format',
			'dbt_filter',
			'st',
			'et',
		),
	},
	getUkMarketLastPrice: {
		path: (input) => `/last/stock/uk/${requiredSegment(input, 'symbol')}`,
	},
	getUsStocksSignal: {
		path: (input) =>
			`/fnd/signals/us-stock/${requiredSegment(input, 'interval')}/${requiredSegment(input, 'symbol')}`,
	},
	getBondsRate: {
		path: (input) => `/fnd/bonds/us/rate/${requiredSegment(input, 'symbol')}`,
	},
	listCryptocurrencies: {
		path: () => '/fnd/list/cryptocurrency',
		query: queryFields('limit', 'page', 'sort'),
	},
	listSymbols: {
		path: (input) => `/symbol-list/${requiredSegment(input, 'market')}`,
		query: queryFields('page', 'search'),
	},
	searchCountry: {
		path: (input) => `/fnd/search/country/${requiredSegment(input, 'query')}`,
		query: queryFields('limit'),
	},
	searchCryptocurrency: {
		path: (input) =>
			`/fnd/search/cryptocurrency/${requiredSegment(input, 'query')}`,
		query: queryFields('limit'),
	},
	searchCurrency: {
		path: (input) => `/fnd/search/currency/${requiredSegment(input, 'query')}`,
		query: queryFields('limit'),
	},
	searchMarket: {
		path: (input) =>
			`/fnd/search/market/${requiredSegment(input, 'market')}/${requiredSegment(input, 'query')}`,
		query: queryFields('limit'),
	},
};

function makeEndpoint<Name extends FinageOperationName>(name: Name) {
	return async (ctx: FinageContext, input: FinageEndpointInputs[Name]) => {
		const parsed = FinageEndpointInputSchemas[name].parse(input);
		const requestInput = toRequestInput(parsed);
		const spec = specs[name];
		// unknown: the transport returns unparsed JSON, so the operation-specific
		// output schema below validates it before the typed result is returned.
		const response: unknown = await makeFinageRequest<
			FinageEndpointOutputs[Name]
		>(spec.path(requestInput), ctx.key, spec.query?.(requestInput) ?? {});
		// The schema is selected by the same operation key as the handler.
		const validated = FinageEndpointOutputSchemas[name].parse(
			response,
		) as FinageEndpointOutputs[Name];
		await logEventFromContext(ctx, `finage.${name}`, {}, 'completed');
		return validated;
	};
}

export const Market = {
	getBalanceSheetStatements: makeEndpoint('getBalanceSheetStatements'),
	getCanadaMarketAggregates: makeEndpoint('getCanadaMarketAggregates'),
	getCanadaMarketLastPrice: makeEndpoint('getCanadaMarketLastPrice'),
	getCashFlowStatements: makeEndpoint('getCashFlowStatements'),
	getCfdEtfLastPrice: makeEndpoint('getCfdEtfLastPrice'),
	getCfdEtfMarketAggregates: makeEndpoint('getCfdEtfMarketAggregates'),
	getCfdEtfPreviousClose: makeEndpoint('getCfdEtfPreviousClose'),
	getCfdIndexLastPrice: makeEndpoint('getCfdIndexLastPrice'),
	getCfdIndexMarketAggregates: makeEndpoint('getCfdIndexMarketAggregates'),
	getCfdIndexPreviousClose: makeEndpoint('getCfdIndexPreviousClose'),
	convertCrypto: makeEndpoint('convertCrypto'),
	convertCurrency: makeEndpoint('convertCurrency'),
	getCountryDetail: makeEndpoint('getCountryDetail'),
	getCryptoAggregates: makeEndpoint('getCryptoAggregates'),
	getCryptoDetail: makeEndpoint('getCryptoDetail'),
	getCryptoLastQuote: makeEndpoint('getCryptoLastQuote'),
	getCryptoLastTrade: makeEndpoint('getCryptoLastTrade'),
	getCryptoNews: makeEndpoint('getCryptoNews'),
	getCryptoPreviousClose: makeEndpoint('getCryptoPreviousClose'),
	getCryptoSnapshot: makeEndpoint('getCryptoSnapshot'),
	getCurrencyDetail: makeEndpoint('getCurrencyDetail'),
	getCryptoDetailed: makeEndpoint('getCryptoDetailed'),
	getDelistedCompanies: makeEndpoint('getDelistedCompanies'),
	getDividendsCalendar: makeEndpoint('getDividendsCalendar'),
	getEarningsCalendar: makeEndpoint('getEarningsCalendar'),
	getEconomicCalendar: makeEndpoint('getEconomicCalendar'),
	getFinancialRatios: makeEndpoint('getFinancialRatios'),
	getForexLastQuote: makeEndpoint('getForexLastQuote'),
	getForexLastTrade: makeEndpoint('getForexLastTrade'),
	getForexMarketAggregates: makeEndpoint('getForexMarketAggregates'),
	getForexNews: makeEndpoint('getForexNews'),
	getForexPreviousClose: makeEndpoint('getForexPreviousClose'),
	getForexSignal: makeEndpoint('getForexSignal'),
	getForexSnapshot: makeEndpoint('getForexSnapshot'),
	getMostActiveStocks: makeEndpoint('getMostActiveStocks'),
	getHistoricalDividendsCalendar: makeEndpoint(
		'getHistoricalDividendsCalendar',
	),
	getHistoricalStockSplitCalendar: makeEndpoint(
		'getHistoricalStockSplitCalendar',
	),
	getIncomeStatements: makeEndpoint('getIncomeStatements'),
	getIndianMarketAggregates: makeEndpoint('getIndianMarketAggregates'),
	getIndianMarketLastPrice: makeEndpoint('getIndianMarketLastPrice'),
	getInstitutionalHolders: makeEndpoint('getInstitutionalHolders'),
	getIpoCalendar: makeEndpoint('getIpoCalendar'),
	getMutualFundHolders: makeEndpoint('getMutualFundHolders'),
	getSecRssFeed: makeEndpoint('getSecRssFeed'),
	getSectorPerformance: makeEndpoint('getSectorPerformance'),
	getStockCompanyDetails: makeEndpoint('getStockCompanyDetails'),
	getStockMarketAggregates: makeEndpoint('getStockMarketAggregates'),
	getStockLastQuote: makeEndpoint('getStockLastQuote'),
	getStockLastTrade: makeEndpoint('getStockLastTrade'),
	getRussianMarketAggregates: makeEndpoint('getRussianMarketAggregates'),
	getRussianMarketLastPrice: makeEndpoint('getRussianMarketLastPrice'),
	getSharesFloat: makeEndpoint('getSharesFloat'),
	getStockMarketNews: makeEndpoint('getStockMarketNews'),
	getStockMarketStatus: makeEndpoint('getStockMarketStatus'),
	getStockPreviousClose: makeEndpoint('getStockPreviousClose'),
	getStockSnapshot: makeEndpoint('getStockSnapshot'),
	getStockSplitCalendar: makeEndpoint('getStockSplitCalendar'),
	getTechnicalIndicators: makeEndpoint('getTechnicalIndicators'),
	getTopGainers: makeEndpoint('getTopGainers'),
	getTopLosers: makeEndpoint('getTopLosers'),
	getUkMarketAggregates: makeEndpoint('getUkMarketAggregates'),
	getUkMarketLastPrice: makeEndpoint('getUkMarketLastPrice'),
	getUsStocksSignal: makeEndpoint('getUsStocksSignal'),
	getBondsRate: makeEndpoint('getBondsRate'),
	listCryptocurrencies: makeEndpoint('listCryptocurrencies'),
	listSymbols: makeEndpoint('listSymbols'),
	searchCountry: makeEndpoint('searchCountry'),
	searchCryptocurrency: makeEndpoint('searchCryptocurrency'),
	searchCurrency: makeEndpoint('searchCurrency'),
	searchMarket: makeEndpoint('searchMarket'),
} satisfies FinageEndpoints;

export * from './types';
