import { z } from 'zod';
import {
	FinageFundamentalInputSchemas,
	FinageFundamentalOutputSchemas,
} from './fundamentals-types';
import {
	FinageGlobalMarketInputSchemas,
	FinageGlobalMarketOutputSchemas,
} from './global-market-types';
import { finageJsonValue } from './json-value';

export type { FinageJsonValue } from './json-value';

const text = z.string().min(1);
const optionalText = z.string().optional();
const positiveInteger = z.number().int().positive();
const limit = z.number().int().min(1).max(50_000).optional();
const searchLimit = z.number().int().min(1).max(100).optional();
const requiredSearchLimit = z.number().int().min(1).max(100);
const market = z.enum([
	'us-stock',
	'ca-stock',
	'in-stock',
	'ru-stock',
	'forex',
	'crypto',
	'index',
]);
const aggregationTime = z.enum([
	'minute',
	'hour',
	'day',
	'week',
	'month',
	'quarter',
	'year',
]);
const sort = z.enum(['asc', 'desc']);
const symbolInput = z.object({ symbol: text });
const aggregateInput = z.object({
	symbol: text,
	multiply: positiveInteger,
	time: aggregationTime,
	from: text,
	to: text,
	limit,
	sort: sort.optional(),
	dbt_filter: z.boolean().optional(),
	st: text.optional(),
	et: text.optional(),
	date_format: z.enum(['dt', 'ts']).optional(),
});
// The crypto aggregate docs list only limit and sort; the stock, forex, and
// global aggregate docs add the dbt_filter/st/et/date_format options.
const cryptoAggregateInput = z.object({
	symbol: text,
	multiply: positiveInteger,
	time: aggregationTime,
	from: text,
	to: text,
	limit,
	sort: sort.optional(),
});

const baseFinageInputSchemas = {
	convertCrypto: z.object({
		from: text,
		to: text,
		amount: z.number().positive(),
	}),
	convertCurrency: z.object({
		from: text,
		to: text,
		amount: z.number().positive(),
	}),
	getCountryDetail: z.object({ country: text }),
	getCryptoAggregates: cryptoAggregateInput,
	getCryptoDetail: z.object({ symbol: text }),
	getCryptoLastQuote: symbolInput,
	getCryptoLastTrade: symbolInput,
	getCryptoNews: z.object({ symbol: text, limit: searchLimit }),
	getCryptoPreviousClose: symbolInput,
	getCryptoSnapshot: z.object({
		quotes: z.boolean(),
		trades: z.boolean(),
		symbols: text,
	}),
	getCurrencyDetail: z.object({ symbol: text }),
	getCryptoDetailed: symbolInput,
	getForexLastQuote: symbolInput,
	getForexLastTrade: symbolInput,
	getForexMarketAggregates: aggregateInput,
	getForexNews: z.object({ symbol: text, limit: searchLimit }),
	getForexPreviousClose: symbolInput,
	getForexSnapshot: z.object({
		quotes: z.boolean(),
		trades: z.boolean(),
		symbols: text,
	}),
	getMostActiveStocks: z.object({}),
	getSecRssFeed: z.object({}),
	getSectorPerformance: z.object({}),
	getStockCompanyDetails: symbolInput,
	getStockMarketAggregates: aggregateInput,
	getStockLastQuote: symbolInput,
	getStockLastTrade: symbolInput,
	getStockMarketNews: z.object({ symbol: text, limit: searchLimit }),
	getStockMarketStatus: z.object({
		country: text.optional(),
		currencies: z.boolean().optional(),
		holidays: z.boolean().optional(),
		trading_hours: z.boolean().optional(),
		extended_hours: z.boolean().optional(),
	}),
	getStockPreviousClose: symbolInput,
	getStockSnapshot: z.object({
		quotes: z.boolean(),
		trades: z.boolean(),
		symbols: text,
	}),
	getTechnicalIndicators: z.object({
		symbol: text,
		type: z.enum([
			'DEMA',
			'EMA',
			'SMA',
			'WMA',
			'RSI',
			'TEMA',
			'Williams',
			'ADX',
		]),
		time: z.enum(['daily', '1min', '5min', '15min', '30min', '1hour', '4hour']),
		period: positiveInteger.optional(),
	}),
	getTopGainers: z.object({}),
	getTopLosers: z.object({}),
	getBondsRate: z.object({ symbol: text }),
	listCryptocurrencies: z.object({
		limit: positiveInteger.optional(),
		page: positiveInteger.optional(),
		sort: z.enum(['ASC', 'DESC']).optional(),
	}),
	listSymbols: z.object({
		market,
		page: positiveInteger.optional(),
		search: text.optional(),
	}),
	searchCountry: z.object({ query: text, limit: searchLimit }),
	searchCryptocurrency: z.object({ query: text, limit: requiredSearchLimit }),
	searchCurrency: z.object({ query: text, limit: searchLimit }),
	searchMarket: z.object({
		market: text,
		query: text,
		limit: requiredSearchLimit,
	}),
} as const;

// Finage documents stable fields for market data and envelopes, while provider
// plans can add fields. The recursive JSON type keeps those provider-defined
// values serializable and typed without any.
const providerObject = z.record(z.string(), finageJsonValue);
const quoteResponse = z
	.object({
		symbol: text,
		ask: z.number(),
		bid: z.number(),
		asize: z.number().optional(),
		bsize: z.number().optional(),
		timestamp: z.number(),
	})
	.catchall(finageJsonValue);
const tradeResponse = z
	.object({
		symbol: text,
		price: z.number(),
		size: z.number().optional(),
		timestamp: z.number(),
	})
	.catchall(finageJsonValue);
const conversionResponse = z
	.object({
		from: text,
		to: text,
		amount: z.number(),
		value: z.number(),
		timestamp: z.number(),
	})
	.catchall(finageJsonValue);
const aggregateBar = z
	.object({
		o: z.number(),
		h: z.number(),
		l: z.number(),
		c: z.number(),
		v: z.number().optional(),
		t: z.number(),
	})
	.catchall(finageJsonValue);
const aggregateResponse = z
	.object({
		symbol: text,
		totalResults: z.number(),
		results: z.array(aggregateBar),
	})
	.catchall(finageJsonValue);
const snapshotQuote = z
	.object({
		s: text.optional(),
		symbol: text.optional(),
		a: z.number().optional(),
		b: z.number().optional(),
		asz: z.number().optional(),
		bsz: z.number().optional(),
		t: z.number().optional(),
	})
	.catchall(finageJsonValue)
	// Every documented quote carries at least one price or size; an empty entry
	// would otherwise decode to a quote with no market data at all.
	.refine(
		(entry) =>
			entry.a !== undefined ||
			entry.b !== undefined ||
			entry.asz !== undefined ||
			entry.bsz !== undefined,
		{ message: 'snapshot quote needs one of a, b, asz, bsz' },
	);
const snapshotTrade = z
	.object({
		s: text.optional(),
		symbol: text.optional(),
		p: z.number().optional(),
		price: z.number().optional(),
		sz: z.number().optional(),
		t: z.number().optional(),
	})
	.catchall(finageJsonValue)
	.refine(
		(entry) =>
			entry.p !== undefined ||
			entry.price !== undefined ||
			entry.sz !== undefined,
		{ message: 'snapshot trade needs one of p, price, sz' },
	);
const snapshotResponse = z
	.object({
		totalResults: z.number().optional(),
		lastQuotes: z.array(snapshotQuote).optional(),
		lastTrades: z.array(snapshotTrade).optional(),
	})
	.catchall(finageJsonValue);
const marketStatusResponse = z
	.object({
		market: z.string().optional(),
		timezone: z.string().optional(),
		country: z.string().optional(),
		exchanges: providerObject.optional(),
		currencies: providerObject.optional(),
	})
	.catchall(finageJsonValue);

const newsItem = z
	.object({
		source: text,
		title: text,
		description: text,
		url: text,
		date: text,
	})
	.catchall(finageJsonValue);
const newsResponse = z
	.object({
		ticker: text,
		limit: z.number(),
		news: z.array(newsItem),
	})
	.catchall(finageJsonValue);

const countryDetail = z
	.object({
		country: text,
		country_code: text,
		currency: text,
		currency_code: text,
		phone_code: text,
		country_flag: text,
	})
	.catchall(finageJsonValue);
const countryDetailResponse = z.array(countryDetail);
const currencyDetail = z
	.object({
		symbol: text,
		from: text,
		to: text,
		from_flag: text,
		to_flag: text,
	})
	.catchall(finageJsonValue);
const currencyDetailResponse = z.array(currencyDetail);
const companyDetail = z
	.object({
		symbol: text,
		logo: optionalText,
		name: text,
		url: optionalText,
		description: optionalText,
		exchange: optionalText,
		ceo: optionalText,
		industry: optionalText,
		state: optionalText,
		address: optionalText,
		employees: z.number().optional(),
		sector: optionalText,
		marketcap: z.number().optional(),
	})
	.catchall(finageJsonValue);

const cryptoDeveloper = z
	.object({ name: text, position: text })
	.catchall(finageJsonValue);
const cryptoLinks = z
	.object({
		explorer: z.array(text).optional(),
		facebook: z.array(text).optional(),
		reddit: z.array(text).optional(),
		source_code: z.array(text).optional(),
		website: z.array(text).optional(),
		youtube: z.array(text).optional(),
	})
	.catchall(finageJsonValue);
const cryptoDetail = z
	.object({
		name: text,
		symbol: text,
		type: text,
		isActive: z.boolean(),
		description: optionalText,
		developers: z.array(cryptoDeveloper).optional(),
		opensource: z.boolean().optional(),
		startedAt: optionalText,
		hashAlgorithm: optionalText,
		links: cryptoLinks.optional(),
		thumbnail: optionalText,
		developmentStatus: optionalText,
		hardwareWallet: z.boolean().optional(),
	})
	.catchall(finageJsonValue);
const cryptoDetailedItem = z
	.object({
		symbol: text,
		name: text,
		price: z.number(),
		changesPercentage: z.number(),
		change: z.number(),
		high: z.number(),
		open: z.number(),
		low: z.number(),
		close: z.number(),
		yearHigh: z.number(),
		yearLow: z.number(),
		marketCap: z.number(),
		priceAvg50: z.number(),
		priceAvg200: z.number(),
		volume: z.number(),
		avgVolume: z.number(),
		exchange: text,
		sharesOutstanding: z.number(),
		timestamp: z.number(),
	})
	.catchall(finageJsonValue);

const marketSearchResult = z
	.object({ symbol: text, description: text, s_type: text })
	.catchall(finageJsonValue);
const countrySearchResult = countryDetail;
const currencySearchResult = currencyDetail;
const cryptoSearchResult = z
	.object({
		name: text,
		symbol: text,
		type: text,
		isActive: z.boolean(),
	})
	.catchall(finageJsonValue);
const marketSearchEnvelope = z
	.object({
		key: text,
		market: text,
		limit: z.number(),
		results: z.array(marketSearchResult),
	})
	.catchall(finageJsonValue);
const countrySearchEnvelope = z
	.object({
		key: text,
		limit: z.number(),
		results: z.array(countrySearchResult),
	})
	.catchall(finageJsonValue);
const currencySearchEnvelope = z
	.object({
		key: text,
		limit: z.number(),
		results: z.array(currencySearchResult),
	})
	.catchall(finageJsonValue);
const cryptoSearchEnvelope = z
	.object({
		key: text,
		limit: z.number(),
		results: z.array(cryptoSearchResult),
	})
	.catchall(finageJsonValue);

const marketInformationItem = z
	.object({
		symbol: text,
		price: text,
		change: text,
		change_percentage: text,
		company_name: text,
	})
	.catchall(finageJsonValue);
const mostActiveItem = z
	.object({
		symbol: text,
		price: text,
		change: z.number(),
		change_percentage: text,
		company_name: text,
	})
	.catchall(finageJsonValue);
const sectorPerformanceItem = z
	.object({ sector: text, change_percentage: text })
	.catchall(finageJsonValue);
const rssFeedItem = z
	.object({
		title: text,
		date: text,
		link: text,
		cik: text,
		form_type: text,
		ticker: text,
	})
	.catchall(finageJsonValue);
const cryptocurrencyListItem = z
	.object({
		symbol: text,
		name: text,
		thumbnail: text,
		market_cap: z.number(),
		ath: z.number(),
		ath_date: text,
		order: z.number(),
	})
	.catchall(finageJsonValue);
const cryptocurrencyListEnvelope = z
	.object({
		totalResults: z.number(),
		results: z.array(cryptocurrencyListItem),
	})
	.catchall(finageJsonValue);
const symbolListItem = z
	.object({ symbol: text, name: text })
	.catchall(finageJsonValue);
const symbolListResponse = z
	.object({
		page: z.number().optional(),
		symbols: z.array(symbolListItem),
	})
	.catchall(finageJsonValue);

// Several Finage reference pages show the documented envelope fields at the
// top level while the example response wraps the same envelope in an array.
// Accepting both documented forms keeps the response contract faithful.
const envelopeOrArray = <T extends z.ZodType>(envelope: T) =>
	z.union([envelope, z.array(envelope)]);

const baseFinageOutputSchemas = {
	convertCrypto: conversionResponse,
	convertCurrency: conversionResponse,
	getCountryDetail: countryDetailResponse,
	getCryptoAggregates: aggregateResponse,
	getCryptoDetail: cryptoDetail,
	getCryptoLastQuote: quoteResponse,
	getCryptoLastTrade: tradeResponse,
	getCryptoNews: newsResponse,
	getCryptoPreviousClose: aggregateResponse,
	getCryptoSnapshot: snapshotResponse,
	getCurrencyDetail: currencyDetailResponse,
	getCryptoDetailed: z.array(cryptoDetailedItem),
	getForexLastQuote: quoteResponse,
	getForexLastTrade: tradeResponse,
	getForexMarketAggregates: aggregateResponse,
	getForexNews: newsResponse,
	getForexPreviousClose: aggregateResponse,
	getForexSnapshot: snapshotResponse,
	getMostActiveStocks: z.array(mostActiveItem),
	getSecRssFeed: z.array(rssFeedItem),
	getSectorPerformance: z.array(sectorPerformanceItem),
	getStockCompanyDetails: z.array(companyDetail),
	getStockMarketAggregates: aggregateResponse,
	getStockLastQuote: quoteResponse,
	getStockLastTrade: tradeResponse,
	getStockMarketNews: newsResponse,
	getStockMarketStatus: marketStatusResponse,
	getStockPreviousClose: aggregateResponse,
	getStockSnapshot: snapshotResponse,
	getTechnicalIndicators: z.array(
		z
			.object({
				type: text,
				date: text,
				open: text,
				high: text,
				low: text,
				close: text,
				volume: text,
				value: text,
			})
			.catchall(finageJsonValue),
	),
	getTopGainers: z.array(marketInformationItem),
	getTopLosers: z.array(marketInformationItem),
	getBondsRate: z
		.object({
			symbol: text,
			value: z.number(),
			date: text,
		})
		.catchall(finageJsonValue),
	listCryptocurrencies: envelopeOrArray(cryptocurrencyListEnvelope),
	listSymbols: symbolListResponse,
	searchCountry: envelopeOrArray(countrySearchEnvelope),
	searchCryptocurrency: envelopeOrArray(cryptoSearchEnvelope),
	searchCurrency: envelopeOrArray(currencySearchEnvelope),
	searchMarket: envelopeOrArray(marketSearchEnvelope),
} as const;

export const FinageInputSchemas = {
	...baseFinageInputSchemas,
	...FinageFundamentalInputSchemas,
	...FinageGlobalMarketInputSchemas,
} as const;

export const FinageOutputSchemas = {
	...baseFinageOutputSchemas,
	...FinageFundamentalOutputSchemas,
	...FinageGlobalMarketOutputSchemas,
} as const;

export const operationNames = Object.keys(
	FinageInputSchemas,
) as (keyof typeof FinageInputSchemas)[];
export type FinageOperationName = (typeof operationNames)[number];
export type FinageEndpointInputs = {
	[K in FinageOperationName]: z.input<(typeof FinageInputSchemas)[K]>;
};
export type FinageEndpointOutputs = {
	[K in FinageOperationName]: z.output<(typeof FinageOutputSchemas)[K]>;
};
export const FinageEndpointInputSchemas = FinageInputSchemas;
export const FinageEndpointOutputSchemas = FinageOutputSchemas;
