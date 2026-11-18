import { makeFinageRequest } from './client';
import { Market } from './endpoints';
import type {
	FinageEndpointOutputs,
	FinageOperationName,
} from './endpoints/types';
import type { FinageContext } from './index';

jest.mock('./client', () => ({
	makeFinageRequest: jest.fn(async () => ({
		symbol: 'AAPL',
		totalResults: 1,
		results: [{ o: 1, h: 2, l: 0.5, c: 1.5, v: 100, t: 1 }],
	})),
}));
jest.mock('corsair/core', () => ({ logEventFromContext: jest.fn() }));

const request = jest.mocked(makeFinageRequest);

// These handlers only read key and logEventFromContext is mocked in this file.
const context = { key: 'test-key' } as FinageContext;

const quote = {
	symbol: 'AAPL',
	ask: 118.55,
	bid: 118.53,
	asize: 3,
	bsize: 1,
	timestamp: 1604710766331,
};
const trade = {
	symbol: 'AAPL',
	price: 131.99,
	size: 5,
	timestamp: 1608847193770,
};
const aggregate = {
	symbol: 'AAPL',
	totalResults: 1,
	results: [
		{
			o: 80.88,
			h: 81.19,
			l: 79.7375,
			c: 80.3625,
			v: 118746872,
			t: 1580878800000,
		},
	],
};
const snapshot = {
	totalResults: 1,
	lastQuotes: [
		{
			s: 'AAPL',
			a: 215.604252,
			b: 215.407484,
			asz: 1,
			bsz: 5,
			t: 1726494971049,
		},
	],
	lastTrades: [{ s: 'AAPL', p: 215.505522, sz: 1, t: 1726494971049 }],
};
const newsItem = {
	source: 'Seeking Alpha',
	title: 'Example market story',
	description: 'Example market story description',
	url: 'https://example.test/story',
	date: '2021-12-12T09:42:07.000Z',
};

type RouteCase = {
	name: FinageOperationName;
	path: string;
	query: Record<string, string | number | boolean | undefined>;
	response: FinageEndpointOutputs[FinageOperationName];
	// The endpoint-specific return type is a union indexed by each route case.
	invoke: () => Promise<FinageEndpointOutputs[FinageOperationName]>;
};

const routes = [
	{
		name: 'convertCrypto',
		path: '/convert/crypto/BTC/ETH/2',
		query: {},
		response: {
			from: 'BTC',
			to: 'ETH',
			amount: 2,
			value: 58.7583,
			timestamp: 1732019680104,
		},
		invoke: () =>
			Market.convertCrypto(context, { from: 'BTC', to: 'ETH', amount: 2 }),
	},
	{
		name: 'convertCurrency',
		path: '/convert/forex/GBP/USD/3',
		query: {},
		response: {
			from: 'GBP',
			to: 'USD',
			amount: 3,
			value: 4.2285,
			timestamp: 1621027210000,
		},
		invoke: () =>
			Market.convertCurrency(context, { from: 'GBP', to: 'USD', amount: 3 }),
	},
	{
		name: 'getCountryDetail',
		path: '/fnd/detail/country/gb',
		query: {},
		response: [
			{
				country: 'United Kingdom',
				country_code: 'GB',
				currency: 'Sterling',
				currency_code: 'GBP',
				phone_code: '+44',
				country_flag:
					'https://finage.s3.eu-west-2.amazonaws.com/flags/160x120/gb.png',
			},
		],
		invoke: () => Market.getCountryDetail(context, { country: 'gb' }),
	},
	{
		name: 'getCryptoAggregates',
		path: '/agg/crypto/BTCUSD/1/day/2025-01-01/2025-01-02',
		query: { limit: 10, sort: 'desc' },
		response: {
			symbol: 'BTCUSD',
			totalResults: 1,
			results: [
				{
					o: 9164.33,
					h: 9775,
					l: 9142.52,
					c: 9613.82,
					v: 54480.15,
					t: 1580860800000,
				},
			],
		},
		invoke: () =>
			Market.getCryptoAggregates(context, {
				symbol: 'BTCUSD',
				multiply: 1,
				time: 'day',
				from: '2025-01-01',
				to: '2025-01-02',
				limit: 10,
				sort: 'desc',
			}),
	},
	{
		name: 'getCryptoDetail',
		path: '/fnd/detail/cryptocurrency/bitcoin',
		query: {},
		response: {
			name: 'Bitcoin',
			symbol: 'BTC',
			type: 'coin',
			isActive: true,
			description: 'Bitcoin is a cryptocurrency and worldwide payment system.',
			developers: [{ name: 'Satoshi Nakamoto', position: 'Founder' }],
			opensource: true,
			startedAt: '2009-01-03T00:00:00',
			hashAlgorithm: 'SHA256',
			links: {
				explorer: ['https://blockstream.info/'],
				website: ['https://bitcoin.org/'],
			},
			thumbnail:
				'https://finage.s3.eu-west-2.amazonaws.com/cryptocurrency/128x128/bitcoin.png',
			developmentStatus: 'Working product',
			hardwareWallet: true,
		},
		invoke: () => Market.getCryptoDetail(context, { symbol: 'bitcoin' }),
	},
	{
		name: 'getCryptoLastQuote',
		path: '/last/quote/crypto/BTCUSD',
		query: {},
		response: {
			symbol: 'BTCUSD',
			ask: 56385.07,
			asize: 0.075349,
			bid: 56385.06,
			bsize: 0.36976,
			timestamp: 1620757064667,
		},
		invoke: () => Market.getCryptoLastQuote(context, { symbol: 'BTCUSD' }),
	},
	{
		name: 'getCryptoLastTrade',
		path: '/last/crypto/BTCUSD',
		query: {},
		response: { symbol: 'BTCUSD', price: 56385.08, timestamp: 1620757059440 },
		invoke: () => Market.getCryptoLastTrade(context, { symbol: 'BTCUSD' }),
	},
	{
		name: 'getCryptoNews',
		path: '/news/cryptocurrency/BTC',
		query: { limit: 5 },
		response: { ticker: 'BTC', limit: 5, news: [newsItem] },
		invoke: () => Market.getCryptoNews(context, { symbol: 'BTC', limit: 5 }),
	},
	{
		name: 'getCryptoPreviousClose',
		path: '/agg/crypto/prev-close/BTCUSD',
		query: {},
		response: {
			symbol: 'BTCUSD',
			totalResults: 1,
			results: [
				{
					o: 55816.14,
					h: 56850,
					l: 54370,
					c: 56672.24,
					v: 57725.4,
					t: 1620691200000,
				},
			],
		},
		invoke: () => Market.getCryptoPreviousClose(context, { symbol: 'BTCUSD' }),
	},
	{
		name: 'getCryptoSnapshot',
		path: '/snapshot/crypto',
		query: { quotes: true, trades: true, symbols: 'BTCUSD,ETHUSD' },
		response: snapshot,
		invoke: () =>
			Market.getCryptoSnapshot(context, {
				quotes: true,
				trades: true,
				symbols: 'BTCUSD,ETHUSD',
			}),
	},
	{
		name: 'getCurrencyDetail',
		path: '/fnd/detail/currency/GBPUSD',
		query: {},
		response: [
			{
				symbol: 'GBPUSD',
				from: 'Pound sterling',
				to: 'United States dollar',
				from_flag:
					'https://finage.s3.eu-west-2.amazonaws.com/flags/160x120/gb.png',
				to_flag:
					'https://finage.s3.eu-west-2.amazonaws.com/flags/160x120/us.png',
			},
		],
		invoke: () => Market.getCurrencyDetail(context, { symbol: 'GBPUSD' }),
	},
	{
		name: 'getCryptoDetailed',
		path: '/fnd/last/crypto/detailed/BTCUSD',
		query: {},
		response: [
			{
				symbol: 'BTCUSD',
				name: 'Bitcoin USD',
				price: 18622.28,
				changesPercentage: 0.91,
				change: 167.532,
				high: 18729.865,
				open: 18454.748,
				low: 18002.09,
				close: 18454.748,
				yearHigh: 18936.621,
				yearLow: 4106.981,
				marketCap: 345478856704,
				priceAvg50: 13804.334,
				priceAvg200: 11091.029,
				volume: 43721678848,
				avgVolume: 28791630355,
				exchange: 'CRYPTO',
				sharesOutstanding: 18551910,
				timestamp: 1606131739,
			},
		],
		invoke: () => Market.getCryptoDetailed(context, { symbol: 'BTCUSD' }),
	},
	{
		name: 'getForexLastQuote',
		path: '/last/forex/GBPUSD',
		query: {},
		response: {
			symbol: 'GBPUSD',
			ask: 1.36305,
			bid: 1.36292,
			timestamp: 1609875979000,
		},
		invoke: () => Market.getForexLastQuote(context, { symbol: 'GBPUSD' }),
	},
	{
		name: 'getForexLastTrade',
		path: '/last/trade/forex/GBPUSD',
		query: {},
		response: { symbol: 'GBPUSD', price: 1.37, timestamp: 1618001940 },
		invoke: () => Market.getForexLastTrade(context, { symbol: 'GBPUSD' }),
	},
	{
		name: 'getForexMarketAggregates',
		path: '/agg/forex/GBPUSD/1/day/2025-01-01/2025-01-02',
		query: { limit: 10, sort: 'desc' },
		response: {
			symbol: 'GBPUSD',
			totalResults: 1,
			results: [
				{
					v: 254,
					o: 1.3642,
					c: 1.3667,
					h: 1.3677,
					l: 1.3642,
					t: 1609477200000,
				},
			],
		},
		invoke: () =>
			Market.getForexMarketAggregates(context, {
				symbol: 'GBPUSD',
				multiply: 1,
				time: 'day',
				from: '2025-01-01',
				to: '2025-01-02',
				limit: 10,
				sort: 'desc',
			}),
	},
	{
		name: 'getForexNews',
		path: '/news/forex/GBPUSD',
		query: { limit: 5 },
		response: { ticker: 'GBP', limit: 5, news: [newsItem] },
		invoke: () => Market.getForexNews(context, { symbol: 'GBPUSD', limit: 5 }),
	},
	{
		name: 'getForexPreviousClose',
		path: '/agg/forex/prev-close/GBPUSD',
		query: {},
		response: {
			symbol: 'GBPUSD',
			totalResults: 1,
			results: [
				{
					o: 1.40456,
					h: 1.41105,
					l: 1.4034,
					c: 1.40948,
					v: 103566,
					t: 1621036799999,
				},
			],
		},
		invoke: () => Market.getForexPreviousClose(context, { symbol: 'GBPUSD' }),
	},
	{
		name: 'getForexSnapshot',
		path: '/snapshot/forex',
		query: { quotes: true, trades: true, symbols: 'EURUSD,GBPUSD' },
		response: snapshot,
		invoke: () =>
			Market.getForexSnapshot(context, {
				quotes: true,
				trades: true,
				symbols: 'EURUSD,GBPUSD',
			}),
	},
	{
		name: 'getMostActiveStocks',
		path: '/fnd/market-information/us/most-actives',
		query: {},
		response: [
			{
				symbol: 'NNOX',
				price: '56.66',
				change: 2581870080,
				change_percentage: '12.62%',
				company_name: 'NANO-X IMAGING LTD',
			},
		],
		invoke: () => Market.getMostActiveStocks(context, {}),
	},
	{
		name: 'getSecRssFeed',
		path: '/fnd/funds/rss-feed',
		query: {},
		response: [
			{
				title: '6-K - Draganfly Inc. (0001786286) (Filer)',
				date: '2025-01-16 14:28:53',
				link: 'https://www.sec.gov/Archives/edgar/data/1786286/example-index.htm',
				cik: '0001786286',
				form_type: '6-K',
				ticker: 'DPRO',
			},
		],
		invoke: () => Market.getSecRssFeed(context, {}),
	},
	{
		name: 'getSectorPerformance',
		path: '/fnd/market-information/us/sector-performance',
		query: {},
		response: [{ sector: 'Airlines', change_percentage: '1.1583%' }],
		invoke: () => Market.getSectorPerformance(context, {}),
	},
	{
		name: 'getStockCompanyDetails',
		path: '/fnd/detail/stock/AAPL',
		query: {},
		response: [
			{
				symbol: 'AAPL',
				logo: 'https://finage.s3.eu-west-2.amazonaws.com/stock/logo/AAPL.png',
				name: 'Apple Inc.',
				url: 'http://www.apple.com',
				description: 'Apple Inc designs and markets consumer electronics.',
				exchange: 'US Stock',
				ceo: 'Timothy D. Cook',
				industry: 'Computer Hardware',
				state: 'CA',
				address: '1 Infinite Loop Cupertino CA, 95014',
				employees: 123000,
				sector: 'Technology',
				marketcap: 908316631180,
			},
		],
		invoke: () => Market.getStockCompanyDetails(context, { symbol: 'AAPL' }),
	},
	{
		name: 'getStockMarketAggregates',
		path: '/agg/stock/AAPL/1/day/2025-01-01/2025-01-02',
		query: { limit: 10, sort: 'desc' },
		response: aggregate,
		invoke: () =>
			Market.getStockMarketAggregates(context, {
				symbol: 'AAPL',
				multiply: 1,
				time: 'day',
				from: '2025-01-01',
				to: '2025-01-02',
				limit: 10,
				sort: 'desc',
			}),
	},
	{
		name: 'getStockLastQuote',
		path: '/last/stock/AAPL',
		query: {},
		response: quote,
		invoke: () => Market.getStockLastQuote(context, { symbol: 'AAPL' }),
	},
	{
		name: 'getStockLastTrade',
		path: '/last/trade/stock/AAPL',
		query: {},
		response: trade,
		invoke: () => Market.getStockLastTrade(context, { symbol: 'AAPL' }),
	},
	{
		name: 'getStockMarketNews',
		path: '/news/market/AAPL',
		query: { limit: 5 },
		response: { ticker: 'AAPL', limit: 5, news: [newsItem] },
		invoke: () =>
			Market.getStockMarketNews(context, { symbol: 'AAPL', limit: 5 }),
	},
	{
		name: 'getStockMarketStatus',
		path: '/marketstatus',
		query: {
			country: 'US',
			currencies: true,
			holidays: false,
			trading_hours: true,
			extended_hours: false,
		},
		response: {
			market: 'open',
			timezone: 'UTC-05:00',
			country: 'US',
			exchanges: { nyse: 'open', nasdaq: 'open', otc: 'open' },
			currencies: { fx: 'open', crypto: 'open' },
		},
		invoke: () =>
			Market.getStockMarketStatus(context, {
				country: 'US',
				currencies: true,
				holidays: false,
				trading_hours: true,
				extended_hours: false,
			}),
	},
	{
		name: 'getStockPreviousClose',
		path: '/agg/stock/prev-close/AAPL',
		query: {},
		response: aggregate,
		invoke: () => Market.getStockPreviousClose(context, { symbol: 'AAPL' }),
	},
	{
		name: 'getStockSnapshot',
		path: '/snapshot/stock',
		query: { quotes: true, trades: true, symbols: 'AAPL,MSFT' },
		response: snapshot,
		invoke: () =>
			Market.getStockSnapshot(context, {
				quotes: true,
				trades: true,
				symbols: 'AAPL,MSFT',
			}),
	},
	{
		name: 'getTechnicalIndicators',
		path: '/fnd/technical-indicator/sma/daily/AAPL',
		query: { period: 14 },
		response: [
			{
				type: 'SMA',
				date: '2025-01-01',
				open: '1',
				high: '2',
				low: '0.5',
				close: '1.5',
				volume: '100',
				value: '1.5',
			},
		],
		invoke: () =>
			Market.getTechnicalIndicators(context, {
				symbol: 'AAPL',
				type: 'SMA',
				time: 'daily',
				period: 14,
			}),
	},
	{
		name: 'getTopGainers',
		path: '/fnd/market-information/us/most-gainers',
		query: {},
		response: [
			{
				symbol: 'AIRT',
				price: '38.38',
				change: '28.63',
				change_percentage: '+293.64%',
				company_name: 'Air T Inc',
			},
		],
		invoke: () => Market.getTopGainers(context, {}),
	},
	{
		name: 'getTopLosers',
		path: '/fnd/market-information/us/most-losers',
		query: {},
		response: [
			{
				symbol: 'TZACU',
				price: '11.5',
				change: '-12.2',
				change_percentage: '-51.48%',
				company_name: 'Tenzing Acquisition Corp.',
			},
		],
		invoke: () => Market.getTopLosers(context, {}),
	},
	{
		name: 'getBondsRate',
		path: '/fnd/bonds/us/rate/DGS1',
		query: {},
		response: { symbol: 'DGS1', value: 0.06, date: '2021-05-19' },
		invoke: () => Market.getBondsRate(context, { symbol: 'DGS1' }),
	},
	{
		name: 'listCryptocurrencies',
		path: '/fnd/list/cryptocurrency',
		query: { limit: 10, page: 2, sort: 'DESC' },
		response: [
			{
				totalResults: 1,
				results: [
					{
						symbol: 'btc',
						name: 'Bitcoin',
						thumbnail:
							'https://finage.s3.eu-west-2.amazonaws.com/cryptocurrency/128x128/bitcoin.png',
						market_cap: 682075777928,
						ath: 69045,
						ath_date: '2021-11-10T14:24:11.849Z',
						order: 1,
					},
				],
			},
		],
		invoke: () =>
			Market.listCryptocurrencies(context, {
				limit: 10,
				page: 2,
				sort: 'DESC',
			}),
	},
	{
		name: 'listSymbols',
		path: '/symbol-list/forex',
		query: { page: 2, search: 'GBP' },
		response: {
			page: 2,
			symbols: [
				{ symbol: 'GBPUSD', name: 'Pound sterling - United States dollar' },
			],
		},
		invoke: () =>
			Market.listSymbols(context, { market: 'forex', page: 2, search: 'GBP' }),
	},
	{
		name: 'searchCountry',
		path: '/fnd/search/country/United%20Kingdom',
		query: { limit: 5 },
		response: [
			{
				key: 'gbp',
				limit: 5,
				results: [
					{
						country: 'United Kingdom',
						country_code: 'GB',
						currency: 'Sterling',
						currency_code: 'GBP',
						phone_code: '+44',
						country_flag:
							'https://finage.s3.eu-west-2.amazonaws.com/flags/160x120/gb.png',
					},
				],
			},
		],
		invoke: () =>
			Market.searchCountry(context, { query: 'United Kingdom', limit: 5 }),
	},
	{
		name: 'searchCryptocurrency',
		path: '/fnd/search/cryptocurrency/bitcoin',
		query: { limit: 5 },
		response: [
			{
				limit: 5,
				key: 'bitcoin',
				results: [
					{ name: 'Bitcoin', symbol: 'BTC', type: 'coin', isActive: true },
				],
			},
		],
		invoke: () =>
			Market.searchCryptocurrency(context, { query: 'bitcoin', limit: 5 }),
	},
	{
		name: 'searchCurrency',
		path: '/fnd/search/currency/GBP',
		query: { limit: 5 },
		response: [
			{
				key: 'gbp',
				limit: 5,
				results: [
					{
						symbol: 'AEDGBP',
						from: 'United Arab Emirates dirham',
						to: 'Pound sterling',
						from_flag:
							'https://finage.s3.eu-west-2.amazonaws.com/flags/160x120/ae.png',
						to_flag:
							'https://finage.s3.eu-west-2.amazonaws.com/flags/160x120/gb.png',
					},
				],
			},
		],
		invoke: () => Market.searchCurrency(context, { query: 'GBP', limit: 5 }),
	},
	{
		name: 'searchMarket',
		path: '/fnd/search/market/us/apple',
		query: { limit: 5 },
		response: [
			{
				key: 'apple',
				market: 'us',
				limit: 5,
				results: [
					{
						symbol: 'APLE',
						description: 'Apple Hospitality REIT, Inc.',
						s_type: 'NYSE',
					},
				],
			},
		],
		invoke: () =>
			Market.searchMarket(context, { market: 'us', query: 'apple', limit: 5 }),
	},
	{
		name: 'getBalanceSheetStatements',
		path: '/fnd/balance-sheet-statements/AAPL',
		query: { limit: 2, period: 'annual' },
		response: [
			{
				symbol: 'AAPL',
				date: '2020-09-26',
				filingDate: '2020-10-30',
				acceptedDate: '2020-10-29 18:06:25',
				period: 'FY',
				cashAndCashEquivalents: 38016000000,
				totalAssets: 323888000000,
				totalLiabilities: 258549000000,
				totalStockholdersEquity: 65339000000,
				link: 'https://www.sec.gov/Archives/edgar/data/320193/example-index.htm',
				finalLink:
					'https://www.sec.gov/Archives/edgar/data/320193/aapl-20200926.htm',
			},
		],
		invoke: () =>
			Market.getBalanceSheetStatements(context, {
				symbol: 'AAPL',
				limit: 2,
				period: 'annual',
			}),
	},
	{
		name: 'getCanadaMarketAggregates',
		path: '/agg/stock/global/ca/RY/1day/2025-01-01/2025-01-02',
		query: { limit: 10, sort: 'desc' },
		response: {
			symbol: 'RY',
			totalResults: 1,
			results: [{ o: '1', h: '2', l: '0.5', c: '1.5', t: '2025-01-01' }],
		},
		invoke: () =>
			Market.getCanadaMarketAggregates(context, {
				symbol: 'RY',
				time: '1day',
				from: '2025-01-01',
				to: '2025-01-02',
				limit: 10,
				sort: 'desc',
			}),
	},
	{
		name: 'getCanadaMarketLastPrice',
		path: '/last/stock/ca/RY',
		query: {},
		response: { symbol: 'RY', price: 1, timestamp: 1 },
		invoke: () => Market.getCanadaMarketLastPrice(context, { symbol: 'RY' }),
	},
	{
		name: 'getCashFlowStatements',
		path: '/fnd/cash-flow-statement/AAPL',
		query: { limit: 2, period: 'quarter' },
		response: [
			{
				symbol: 'AAPL',
				date: '2020-09-26',
				fillingDate: '2020-10-30',
				period: 'Q4',
				netIncome: 57411000000,
				operatingCashFlow: 80674000000,
				freeCashFlow: 73365000000,
			},
		],
		invoke: () =>
			Market.getCashFlowStatements(context, {
				symbol: 'AAPL',
				limit: 2,
				period: 'quarter',
			}),
	},
	{
		name: 'getCfdEtfLastPrice',
		path: '/last/etf/QQQ',
		query: {},
		response: { symbol: 'QQQ', price: 319.1413, timestamp: 1 },
		invoke: () => Market.getCfdEtfLastPrice(context, { symbol: 'QQQ' }),
	},
	{
		name: 'getCfdEtfMarketAggregates',
		path: '/agg/etf/QQQ/1day/2025-01-01/2025-01-02',
		query: { limit: 10 },
		response: {
			symbol: 'QQQ',
			totalResults: 1,
			results: [{ o: '1', h: '2', l: '0.5', c: '1.5', t: '2025-01-01' }],
		},
		invoke: () =>
			Market.getCfdEtfMarketAggregates(context, {
				symbol: 'QQQ',
				time: '1day',
				from: '2025-01-01',
				to: '2025-01-02',
				limit: 10,
			}),
	},
	{
		name: 'getCfdEtfPreviousClose',
		path: '/agg/etf/prev-close/QQQ',
		query: {},
		response: {
			symbol: 'QQQ',
			totalResults: 1,
			results: [{ o: 1, h: 2, l: 0.5, c: 1.5, t: 1 }],
		},
		invoke: () => Market.getCfdEtfPreviousClose(context, { symbol: 'QQQ' }),
	},
	{
		name: 'getCfdIndexLastPrice',
		path: '/last/index/SPX',
		query: {},
		response: { symbol: 'SPX', price: 1, timestamp: 1 },
		invoke: () => Market.getCfdIndexLastPrice(context, { symbol: 'SPX' }),
	},
	{
		name: 'getCfdIndexMarketAggregates',
		path: '/agg/index/SPX/1day/2025-01-01/2025-01-02',
		query: { limit: 10 },
		response: {
			symbol: 'SPX',
			totalResults: 1,
			results: [{ o: 1, h: 2, l: 0.5, c: 1.5, t: 1 }],
		},
		invoke: () =>
			Market.getCfdIndexMarketAggregates(context, {
				symbol: 'SPX',
				time: '1day',
				from: '2025-01-01',
				to: '2025-01-02',
				limit: 10,
			}),
	},
	{
		name: 'getCfdIndexPreviousClose',
		path: '/agg/index/prev-close/SPX',
		query: {},
		response: {
			symbol: 'SPX',
			totalResults: 1,
			results: [{ o: 1, h: 2, l: 0.5, c: 1.5, t: 1 }],
		},
		invoke: () => Market.getCfdIndexPreviousClose(context, { symbol: 'SPX' }),
	},
	{
		name: 'getDelistedCompanies',
		path: '/fnd/delisted-companies',
		query: { limit: 5 },
		response: [
			{
				symbol: 'XYZ',
				company_name: 'Example',
				exchange: 'US',
				ipo_date: '2020-01-01',
				delisted_date: '2025-01-01',
			},
		],
		invoke: () => Market.getDelistedCompanies(context, { limit: 5 }),
	},
	{
		name: 'getDividendsCalendar',
		path: '/fnd/dividend-calendar',
		query: { from: '2025-01-01', to: '2025-01-31' },
		response: [
			{
				symbol: 'AAPL',
				label: 'Apple',
				adj_dividend: 0.25,
				date: '2025-01-10',
			},
		],
		invoke: () =>
			Market.getDividendsCalendar(context, {
				from: '2025-01-01',
				to: '2025-01-31',
			}),
	},
	{
		name: 'getEarningsCalendar',
		path: '/fnd/earning-calendar',
		query: {},
		response: [
			{
				symbol: 'AAPL',
				eps: null,
				estimated_eps: 1,
				revenue: 100,
				estimated_revenue: null,
				time: 'amc',
				date: '2025-01-10',
			},
		],
		invoke: () => Market.getEarningsCalendar(context, {}),
	},
	{
		name: 'getEconomicCalendar',
		path: '/fnd/economic-calendar',
		query: { from: '2025-01-01', to: '2025-01-31' },
		response: [
			{
				event: 'CPI',
				date: '2025-01-10',
				country: 'US',
				countryFlag: 'https://example.test/us.png',
				actual: null,
				previous: 1,
				change: null,
				changePercentage: null,
				estimate: 1,
			},
		],
		invoke: () =>
			Market.getEconomicCalendar(context, {
				from: '2025-01-01',
				to: '2025-01-31',
			}),
	},
	{
		name: 'getFinancialRatios',
		path: '/fnd/financial-ratios/AAPL',
		query: {},
		response: [
			{
				symbol: 'AAPL',
				date: '2024-12-31',
				fiscalYear: '2024',
				period: 'FY',
				reportedCurrency: 'USD',
				grossProfitMargin: 0.17862626676220697,
				netProfitMargin: 0.07258675401781145,
				currentRatio: 2.024912390270983,
			},
		],
		invoke: () => Market.getFinancialRatios(context, { symbol: 'AAPL' }),
	},
	{
		name: 'getForexSignal',
		path: '/fnd/signals/forex/daily/EURUSD',
		query: {},
		response: {
			timestamp: '2025-01-01',
			symbol: 'EURUSD',
			signal: 'hold',
			confidence: 0.5,
			indicators: {
				sma_20: 1,
				sma_50: 1,
				rsi: 50,
				macd: 0,
				macd_signal: 0,
				macd_diff: 0,
				bollinger_high: 2,
				bollinger_low: 0,
				ma_crossover: false,
				macd_cross: false,
			},
			price: 1,
		},
		invoke: () =>
			Market.getForexSignal(context, { interval: 'daily', symbol: 'EURUSD' }),
	},
	{
		name: 'getHistoricalDividendsCalendar',
		path: '/fnd/historical-dividends/AAPL',
		query: {},
		response: [
			{
				label: 'Apple',
				adj_dividend: 0.25,
				dividend: 0.25,
				record_date: '2025-01-01',
				payment_date: '2025-01-10',
				declaration_date: '2024-12-01',
				date: '2025-01-10',
			},
		],
		invoke: () =>
			Market.getHistoricalDividendsCalendar(context, { symbol: 'AAPL' }),
	},
	{
		name: 'getHistoricalStockSplitCalendar',
		path: '/fnd/historical-stock-splits/AAPL',
		query: {},
		response: [
			{
				numerator_factor: 2,
				denominator_factor: 1,
				label: '2:1',
				date: '2025-01-10',
			},
		],
		invoke: () =>
			Market.getHistoricalStockSplitCalendar(context, { symbol: 'AAPL' }),
	},
	{
		name: 'getIncomeStatements',
		path: '/fnd/income-statement/AAPL.TO',
		query: { limit: 2, period: 'annual' },
		response: [
			{
				symbol: 'AAPL.TO',
				date: '2020-09-26',
				filingDate: '2020-10-30',
				period: 'Q4',
				revenue: 64698000000,
				netIncome: 12673000000,
				eps: 0.73,
			},
		],
		invoke: () =>
			Market.getIncomeStatements(context, {
				symbol: 'AAPL',
				exchange_code: 'TO',
				limit: 2,
				period: 'annual',
			}),
	},
	{
		name: 'getIndianMarketAggregates',
		path: '/agg/stock/global/in/RELIANCE/1day/2025-01-01/2025-01-02',
		query: { limit: 10 },
		response: {
			symbol: 'RELIANCE',
			totalResults: 1,
			results: [{ o: '1', h: '2', l: '0.5', c: '1.5', t: '2025-01-01' }],
		},
		invoke: () =>
			Market.getIndianMarketAggregates(context, {
				symbol: 'RELIANCE',
				time: '1day',
				from: '2025-01-01',
				to: '2025-01-02',
				limit: 10,
			}),
	},
	{
		name: 'getIndianMarketLastPrice',
		path: '/last/stock/in/RELIANCE',
		query: {},
		response: { symbol: 'RELIANCE', price: 1, timestamp: 1 },
		invoke: () =>
			Market.getIndianMarketLastPrice(context, { symbol: 'RELIANCE' }),
	},
	{
		name: 'getInstitutionalHolders',
		path: '/fnd/funds/institutional-holder/AAPL',
		query: {},
		response: [
			{
				holder: 'Example Fund',
				shares: 100,
				change: 1,
				report_date: '2025-01-01',
			},
		],
		invoke: () => Market.getInstitutionalHolders(context, { symbol: 'AAPL' }),
	},
	{
		name: 'getIpoCalendar',
		path: '/fnd/ipo-calendar',
		query: { from: '2025-01-01', to: '2025-01-31' },
		response: [
			{
				symbol: 'EXM',
				date: '2025-01-10',
				exchange: 'NASDAQ',
				status: 'priced',
				shares: 100,
				price_range: '10-12',
				market_cap: 1000,
				company: 'Example',
			},
		],
		invoke: () =>
			Market.getIpoCalendar(context, { from: '2025-01-01', to: '2025-01-31' }),
	},
	{
		name: 'getMutualFundHolders',
		path: '/fnd/funds/mutual-fund-holder/AAPL',
		query: {},
		response: [
			{
				holder: 'Example Fund',
				shares: 100,
				change: 1,
				report_date: '2025-01-01',
				weight_percentage: 1,
			},
		],
		invoke: () => Market.getMutualFundHolders(context, { symbol: 'AAPL' }),
	},
	{
		name: 'getRussianMarketAggregates',
		path: '/agg/stock/global/ru/SBER/1day/2025-01-01/2025-01-02',
		query: { limit: 10 },
		response: {
			symbol: 'SBER',
			totalResults: 1,
			results: [{ o: '1', h: '2', l: '0.5', c: '1.5', t: '2025-01-01' }],
		},
		invoke: () =>
			Market.getRussianMarketAggregates(context, {
				symbol: 'SBER',
				time: '1day',
				from: '2025-01-01',
				to: '2025-01-02',
				limit: 10,
			}),
	},
	{
		name: 'getRussianMarketLastPrice',
		path: '/last/stock/ru/SBER',
		query: {},
		response: { symbol: 'SBER', price: 1, timestamp: 1 },
		invoke: () => Market.getRussianMarketLastPrice(context, { symbol: 'SBER' }),
	},
	{
		name: 'getSharesFloat',
		path: '/fnd/shares-float/AAPL',
		query: {},
		response: [
			{
				symbol: 'AAPL',
				public_float: 100,
				stock_float: 100,
				outstanding_shares: 120,
				date: '2025-01-01',
			},
		],
		invoke: () => Market.getSharesFloat(context, { symbol: 'AAPL' }),
	},
	{
		name: 'getStockSplitCalendar',
		path: '/fnd/stock-split-calendar',
		query: { from: '2025-01-01', to: '2025-01-31' },
		response: [
			{
				symbol: 'AAPL',
				numerator_factor: 2,
				denominator_factor: 1,
				label: '2:1',
				date: '2025-01-10',
			},
		],
		invoke: () =>
			Market.getStockSplitCalendar(context, {
				from: '2025-01-01',
				to: '2025-01-31',
			}),
	},
	{
		name: 'getUkMarketAggregates',
		path: '/agg/stock/global/uk/VOD/1day/2025-01-01/2025-01-02',
		query: { limit: 10 },
		response: {
			symbol: 'VOD',
			totalResults: 1,
			results: [{ o: 1, h: 2, l: 0.5, c: 1.5, t: 1 }],
		},
		invoke: () =>
			Market.getUkMarketAggregates(context, {
				symbol: 'VOD',
				time: '1day',
				from: '2025-01-01',
				to: '2025-01-02',
				limit: 10,
			}),
	},
	{
		name: 'getUkMarketLastPrice',
		path: '/last/stock/uk/VOD',
		query: {},
		response: { symbol: 'VOD', price: 1, timestamp: 1 },
		invoke: () => Market.getUkMarketLastPrice(context, { symbol: 'VOD' }),
	},
	{
		name: 'getUsStocksSignal',
		path: '/fnd/signals/us-stock/daily/AAPL',
		query: {},
		response: {
			timestamp: '2025-01-01',
			symbol: 'AAPL',
			signal: 'hold',
			confidence: 0.5,
			indicators: {
				sma_20: 1,
				sma_50: 1,
				rsi: 50,
				macd: 0,
				macd_signal: 0,
				macd_diff: 0,
				bollinger_high: 2,
				bollinger_low: 0,
				ma_crossover: false,
				macd_cross: false,
			},
			price: 1,
		},
		invoke: () =>
			Market.getUsStocksSignal(context, { interval: 'daily', symbol: 'AAPL' }),
	},
] satisfies RouteCase[];

describe('Finage routes', () => {
	it('registers every operation with a distinct route case', () => {
		expect(routes).toHaveLength(70);
		expect(new Set(routes.map(({ name }) => name)).size).toBe(70);
	});

	it.each(routes)(
		'$name calls its documented route and validates the response',
		async (route) => {
			request.mockClear();
			request.mockResolvedValueOnce(route.response);
			const result = await route.invoke();
			expect(request).toHaveBeenCalledTimes(1);
			expect(request).toHaveBeenCalledWith(route.path, 'test-key', route.query);
			expect(result).toEqual(route.response);
		},
	);

	it('rejects invalid input before issuing a request', async () => {
		request.mockClear();
		await expect(
			Market.getStockMarketAggregates(context, {
				symbol: '',
				multiply: 0,
				time: 'day',
				from: '',
				to: '',
				sort: 'desc',
			}),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});

	it.each(['.', '..', 'AAPL/other', 'AAPL\\other'])(
		'rejects unsafe path identifiers before requesting Finage (%s)',
		async (symbol) => {
			request.mockClear();
			await expect(
				Market.getStockLastQuote(context, { symbol }),
			).rejects.toThrow();
			expect(request).not.toHaveBeenCalled();
		},
	);

	it('rejects malformed provider output at the endpoint boundary', async () => {
		request.mockResolvedValueOnce({});
		await expect(
			Market.getStockMarketAggregates(context, {
				symbol: 'AAPL',
				multiply: 1,
				time: 'day',
				from: '2025-01-01',
				to: '2025-01-02',
				sort: 'desc',
			}),
		).rejects.toThrow();
	});

	it('allows documented optional aggregate parameters to be omitted', async () => {
		request.mockClear();
		await Market.getStockMarketAggregates(context, {
			symbol: 'AAPL',
			multiply: 1,
			time: 'day',
			from: '2025-01-01',
			to: '2025-01-02',
		});
		expect(request).toHaveBeenCalledWith(
			'/agg/stock/AAPL/1/day/2025-01-01/2025-01-02',
			'test-key',
			{},
		);
	});
});
