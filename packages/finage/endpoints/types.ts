import { z } from 'zod';
import {
	FinageFundamentalInputSchemas,
	FinageFundamentalOutputSchemas,
} from './fundamentals-types';
import {
	FinageGlobalMarketInputSchemas,
	FinageGlobalMarketOutputSchemas,
} from './global-market-types';
import { finageJsonValue, outArray, outNumber, outText } from './json-value';

export type { FinageJsonValue } from './json-value';

const text = z.string().min(1);
// Detail records leave fields a company or coin does not have as null or blank.
const optionalText = z.string().nullable().optional();
const optionalNumber = z.number().nullable().optional();
const optionalBoolean = z.boolean().nullable().optional();
const positiveInteger = z.number().int().positive();
const limit = z.number().int().min(1).max(50_000).optional();
const searchLimit = z.number().int().min(1).max(100).optional();
// The three news routes document a default of 10 and a maximum of 30.
const newsLimit = z.number().int().min(1).max(30).optional();
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
	getCryptoNews: z.object({ symbol: text, limit: newsLimit }),
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
	getForexNews: z.object({ symbol: text, limit: newsLimit }),
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
	getStockMarketNews: z.object({ symbol: text, limit: newsLimit }),
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
		symbol: outText,
		ask: outNumber,
		bid: outNumber,
		asize: outNumber.optional(),
		bsize: outNumber.optional(),
		timestamp: outNumber,
	})
	.catchall(finageJsonValue);
const tradeResponse = z
	.object({
		symbol: outText,
		price: outNumber,
		size: outNumber.optional(),
		timestamp: outNumber,
	})
	.catchall(finageJsonValue);
const conversionResponse = z
	.object({
		from: outText,
		to: outText,
		amount: outNumber,
		value: outNumber,
		timestamp: outNumber,
	})
	.catchall(finageJsonValue);
const aggregateBar = z
	.object({
		o: outNumber,
		h: outNumber,
		l: outNumber,
		c: outNumber,
		v: outNumber.optional(),
		// A millisecond timestamp by default; a datetime string when the request
		// sets date_format to dt.
		t: z.union([outNumber, z.string()]),
	})
	.catchall(finageJsonValue);
const aggregateResponse = z
	.object({
		symbol: outText,
		totalResults: outNumber,
		results: outArray(aggregateBar),
	})
	.catchall(finageJsonValue);
const snapshotQuote = z
	.object({
		s: outText.optional(),
		symbol: outText.optional(),
		a: outNumber.optional(),
		b: outNumber.optional(),
		asz: outNumber.optional(),
		bsz: outNumber.optional(),
		t: outNumber.optional(),
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
		s: outText.optional(),
		symbol: outText.optional(),
		p: outNumber.optional(),
		price: outNumber.optional(),
		sz: outNumber.optional(),
		t: outNumber.optional(),
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
		totalResults: outNumber.optional(),
		lastQuotes: outArray(snapshotQuote).optional(),
		lastTrades: outArray(snapshotTrade).optional(),
	})
	.catchall(finageJsonValue);
const marketStatusResponse = z
	.object({
		market: outText.optional(),
		timezone: outText.optional(),
		country: outText.optional(),
		exchanges: providerObject.optional(),
		currencies: providerObject.optional(),
	})
	.catchall(finageJsonValue);

const newsItem = z
	.object({
		source: outText,
		title: outText,
		description: outText,
		url: outText,
		date: outText,
	})
	.catchall(finageJsonValue);
const newsResponse = z
	.object({
		ticker: outText,
		limit: outNumber,
		news: outArray(newsItem),
	})
	.catchall(finageJsonValue);

const countryDetail = z
	.object({
		country: outText,
		country_code: outText,
		currency: outText,
		currency_code: outText,
		phone_code: outText,
		country_flag: outText,
	})
	.catchall(finageJsonValue);
// The reference wraps each detail record in an array; the API returns the
// record itself. Both forms are accepted.
const itemOrArray = <T extends z.ZodType>(item: T) =>
	z.union([item, z.array(item)]);
const countryDetailResponse = itemOrArray(countryDetail);
const currencyDetail = z
	.object({
		symbol: outText,
		from: outText,
		to: outText,
		from_flag: outText,
		to_flag: outText,
	})
	.catchall(finageJsonValue);
const currencyDetailResponse = itemOrArray(currencyDetail);
const companyDetail = z
	.object({
		symbol: outText,
		logo: optionalText,
		name: outText,
		url: optionalText,
		description: optionalText,
		exchange: optionalText,
		ceo: optionalText,
		industry: optionalText,
		state: optionalText,
		address: optionalText,
		employees: optionalNumber,
		sector: optionalText,
		marketcap: optionalNumber,
	})
	.catchall(finageJsonValue);

const activeFlag = z.union([z.boolean(), z.string()]).nullable().optional();
const cryptoDeveloper = z
	.object({ name: outText, position: outText })
	.catchall(finageJsonValue);
const cryptoLinks = z
	.object({
		explorer: outArray(outText).optional(),
		facebook: outArray(outText).optional(),
		reddit: outArray(outText).optional(),
		source_code: outArray(outText).optional(),
		website: outArray(outText).optional(),
		youtube: outArray(outText).optional(),
	})
	.catchall(finageJsonValue);
const cryptoDetail = z
	.object({
		name: outText,
		symbol: outText,
		type: outText,
		isActive: optionalBoolean,
		// The API sends is_active (a boolean here, a "true"/"false" string in
		// search results) and snake_case names for the fields below; the
		// reference documents camelCase.
		is_active: activeFlag,
		description: optionalText,
		developers: outArray(cryptoDeveloper).optional(),
		opensource: optionalBoolean,
		startedAt: optionalText,
		hashAlgorithm: optionalText,
		links: cryptoLinks.nullable().optional(),
		thumbnail: optionalText,
		developmentStatus: optionalText,
		hardwareWallet: optionalBoolean,
		open_source: optionalBoolean,
		started_at: optionalText,
		hash_algorithm: optionalText,
		development_status: optionalText,
		hardware_wallet: optionalBoolean,
	})
	.catchall(finageJsonValue);
const cryptoDetailedItem = z
	.object({
		symbol: outText,
		name: outText,
		price: outNumber,
		changesPercentage: outNumber,
		change: outNumber,
		high: outNumber,
		open: outNumber,
		low: outNumber,
		close: outNumber,
		yearHigh: outNumber,
		yearLow: outNumber,
		marketCap: outNumber,
		priceAvg50: outNumber,
		priceAvg200: outNumber,
		volume: outNumber,
		avgVolume: outNumber,
		exchange: outText,
		sharesOutstanding: outNumber,
		timestamp: outNumber,
	})
	.catchall(finageJsonValue);

const marketSearchResult = z
	.object({ symbol: outText, description: outText, s_type: outText })
	.catchall(finageJsonValue);
const countrySearchResult = countryDetail;
const currencySearchResult = currencyDetail;
const cryptoSearchResult = z
	.object({
		name: outText,
		symbol: outText,
		type: outText,
		isActive: optionalBoolean,
		is_active: activeFlag,
	})
	.catchall(finageJsonValue);
const marketSearchEnvelope = z
	.object({
		key: outText,
		market: outText,
		limit: outNumber,
		results: outArray(marketSearchResult),
	})
	.catchall(finageJsonValue);
const countrySearchEnvelope = z
	.object({
		key: outText,
		limit: outNumber,
		results: outArray(countrySearchResult),
	})
	.catchall(finageJsonValue);
const currencySearchEnvelope = z
	.object({
		key: outText,
		limit: outNumber,
		results: outArray(currencySearchResult),
	})
	.catchall(finageJsonValue);
const cryptoSearchEnvelope = z
	.object({
		key: outText,
		limit: outNumber,
		results: outArray(cryptoSearchResult),
	})
	.catchall(finageJsonValue);

const marketInformationItem = z
	.object({
		symbol: outText,
		price: outText,
		change: outText,
		change_percentage: outText,
		company_name: outText,
	})
	.catchall(finageJsonValue);
const mostActiveItem = z
	.object({
		symbol: outText,
		price: outText,
		change: outNumber,
		change_percentage: outText,
		company_name: outText,
	})
	.catchall(finageJsonValue);
const sectorPerformanceItem = z
	.object({ sector: outText, change_percentage: outText })
	.catchall(finageJsonValue);
const rssFeedItem = z
	.object({
		title: outText,
		date: outText,
		link: outText,
		cik: outText,
		form_type: outText,
		ticker: outText,
	})
	.catchall(finageJsonValue);
const cryptocurrencyListItem = z
	.object({
		symbol: outText,
		name: outText,
		thumbnail: outText,
		market_cap: outNumber,
		ath: outNumber,
		ath_date: outText,
		order: outNumber,
	})
	.catchall(finageJsonValue);
const cryptocurrencyListEnvelope = z
	.object({
		// The reference documents totalResults; the API sends total_results.
		totalResults: outNumber.optional(),
		total_results: outNumber.optional(),
		results: outArray(cryptocurrencyListItem),
	})
	.catchall(finageJsonValue);
const symbolListItem = z
	.object({ symbol: outText, name: outText })
	.catchall(finageJsonValue);
const symbolListResponse = z
	.object({
		page: outNumber.optional(),
		symbols: outArray(symbolListItem),
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
	getCryptoDetailed: itemOrArray(cryptoDetailedItem),
	getForexLastQuote: quoteResponse,
	getForexLastTrade: tradeResponse,
	getForexMarketAggregates: aggregateResponse,
	getForexNews: newsResponse,
	getForexPreviousClose: aggregateResponse,
	getForexSnapshot: snapshotResponse,
	getMostActiveStocks: z.array(mostActiveItem),
	getSecRssFeed: z.array(rssFeedItem),
	getSectorPerformance: z.array(sectorPerformanceItem),
	getStockCompanyDetails: itemOrArray(companyDetail),
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
				type: outText,
				date: outText,
				open: outText,
				high: outText,
				low: outText,
				close: outText,
				volume: outText,
				value: outText,
			})
			.catchall(finageJsonValue),
	),
	getTopGainers: z.array(marketInformationItem),
	getTopLosers: z.array(marketInformationItem),
	getBondsRate: z
		.object({
			symbol: outText,
			value: outNumber,
			date: outText,
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
