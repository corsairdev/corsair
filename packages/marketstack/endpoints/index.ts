import { listCurrencies } from './currencies';
import { getDividends } from './dividends';
import { getEod } from './eod';
import { getExchange, listExchanges } from './exchanges';
import { getSplits } from './splits';
import {
	getTickerEod,
	getTickerEodLatest,
	getTickerInfo,
	listTickers,
} from './tickers';

export const Eod = {
	get: getEod,
};

export const Tickers = {
	get: getTickerInfo,
	list: listTickers,
	getEod: getTickerEod,
	getEodLatest: getTickerEodLatest,
};

export const Exchanges = {
	get: getExchange,
	list: listExchanges,
};

export const Currencies = {
	list: listCurrencies,
};

export const Dividends = {
	get: getDividends,
};

export const Splits = {
	get: getSplits,
};

export * from './types';
