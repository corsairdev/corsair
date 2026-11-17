import * as Indicators from './indicators';
import * as Market from './market';
import * as Reference from './reference';

export const MarketEndpoints = {
	quote: Market.quote,
	price: Market.price,
	timeSeries: Market.timeSeries,
	exchangeRate: Market.exchangeRate,
	apiUsage: Market.apiUsage,
};

export const ReferenceEndpoints = {
	stocks: Reference.stocks,
	forexPairs: Reference.forexPairs,
	cryptocurrencies: Reference.cryptocurrencies,
	exchanges: Reference.exchanges,
	etf: Reference.etf,
	funds: Reference.funds,
	bonds: Reference.bonds,
};

export const IndicatorsEndpoints = Indicators;

export * from './types';
