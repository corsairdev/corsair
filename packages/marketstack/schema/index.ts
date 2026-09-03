import {
	MarketstackCurrency,
	MarketstackDividend,
	MarketstackEodBar,
	MarketstackExchange,
	MarketstackSplit,
	MarketstackTicker,
} from './database';

export const MarketstackSchema = {
	version: '1.0.0',
	entities: {
		eodBars: MarketstackEodBar,
		tickers: MarketstackTicker,
		exchanges: MarketstackExchange,
		currencies: MarketstackCurrency,
		dividends: MarketstackDividend,
		splits: MarketstackSplit,
	},
} as const;

export {
	MarketstackCurrency,
	MarketstackDividend,
	MarketstackEodBar,
	MarketstackExchange,
	MarketstackExchangeDateTime,
	MarketstackSplit,
	MarketstackStockExchangeRef,
	MarketstackTicker,
} from './database';
