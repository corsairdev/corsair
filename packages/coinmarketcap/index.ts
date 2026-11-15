import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	exchangeInfo,
	globalMetrics,
	info,
	keyInfo,
	listings,
	map,
	priceConversion,
	quotes,
} from './endpoints';
import type {
	CoinMarketCapEndpointInputs,
	CoinMarketCapEndpointOutputs,
} from './endpoints/types';
import {
	CoinMarketCapEndpointInputSchemas,
	CoinMarketCapEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { CoinMarketCapSchema } from './schema';

export type CoinMarketCapPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalCoinMarketCapPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof coinMarketCapEndpointsNested>;
};

export type CoinMarketCapContext = CorsairPluginContext<
	typeof CoinMarketCapSchema,
	CoinMarketCapPluginOptions
>;

export type CoinMarketCapKeyBuilderContext =
	KeyBuilderContext<CoinMarketCapPluginOptions>;

export type CoinMarketCapBoundEndpoints = BindEndpoints<
	typeof coinMarketCapEndpointsNested
>;

type CoinMarketCapEndpoint<K extends keyof CoinMarketCapEndpointOutputs> =
	CorsairEndpoint<
		CoinMarketCapContext,
		CoinMarketCapEndpointInputs[K],
		CoinMarketCapEndpointOutputs[K]
	>;

export type CoinMarketCapEndpoints = {
	cryptocurrencyListings: CoinMarketCapEndpoint<'cryptocurrencyListings'>;
	cryptocurrencyMap: CoinMarketCapEndpoint<'cryptocurrencyMap'>;
	cryptocurrencyQuotes: CoinMarketCapEndpoint<'cryptocurrencyQuotes'>;
	cryptocurrencyInfo: CoinMarketCapEndpoint<'cryptocurrencyInfo'>;
	globalMetricsQuotes: CoinMarketCapEndpoint<'globalMetricsQuotes'>;
	toolsPriceConversion: CoinMarketCapEndpoint<'toolsPriceConversion'>;
	exchangeInfo: CoinMarketCapEndpoint<'exchangeInfo'>;
	keyInfo: CoinMarketCapEndpoint<'keyInfo'>;
};

const coinMarketCapEndpointsNested = {
	cryptocurrency: {
		listings,
		map,
		quotes,
		info,
	},
	globalMetrics: {
		quotes: globalMetrics,
	},
	tools: {
		priceConversion,
	},
	exchange: {
		info: exchangeInfo,
	},
	key: {
		info: keyInfo,
	},
} as const;

export const coinMarketCapEndpointSchemas = {
	'cryptocurrency.listings': {
		input: CoinMarketCapEndpointInputSchemas.cryptocurrencyListings,
		output: CoinMarketCapEndpointOutputSchemas.cryptocurrencyListings,
	},
	'cryptocurrency.map': {
		input: CoinMarketCapEndpointInputSchemas.cryptocurrencyMap,
		output: CoinMarketCapEndpointOutputSchemas.cryptocurrencyMap,
	},
	'cryptocurrency.quotes': {
		input: CoinMarketCapEndpointInputSchemas.cryptocurrencyQuotes,
		output: CoinMarketCapEndpointOutputSchemas.cryptocurrencyQuotes,
	},
	'cryptocurrency.info': {
		input: CoinMarketCapEndpointInputSchemas.cryptocurrencyInfo,
		output: CoinMarketCapEndpointOutputSchemas.cryptocurrencyInfo,
	},
	'globalMetrics.quotes': {
		input: CoinMarketCapEndpointInputSchemas.globalMetricsQuotes,
		output: CoinMarketCapEndpointOutputSchemas.globalMetricsQuotes,
	},
	'tools.priceConversion': {
		input: CoinMarketCapEndpointInputSchemas.toolsPriceConversion,
		output: CoinMarketCapEndpointOutputSchemas.toolsPriceConversion,
	},
	'exchange.info': {
		input: CoinMarketCapEndpointInputSchemas.exchangeInfo,
		output: CoinMarketCapEndpointOutputSchemas.exchangeInfo,
	},
	'key.info': {
		input: CoinMarketCapEndpointInputSchemas.keyInfo,
		output: CoinMarketCapEndpointOutputSchemas.keyInfo,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof coinMarketCapEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const coinMarketCapEndpointMeta = {
	'cryptocurrency.listings': {
		riskLevel: 'read',
		description:
			'Rank every active cryptocurrency by market cap, price, volume or a percent change, with price, market cap and volume filters, paging and up to 120 quote currencies',
	},
	'cryptocurrency.map': {
		riskLevel: 'read',
		description:
			'Resolve tickers, or a page of the full asset list, to the stable CoinMarketCap IDs, names and slugs that every other call takes; it has no slug filter',
	},
	'cryptocurrency.quotes': {
		riskLevel: 'read',
		description:
			'Latest price, market cap, volume and percent changes for specific assets, by CMC ID, slug or ticker, in one or more quote currencies',
	},
	'cryptocurrency.info': {
		riskLevel: 'read',
		description:
			'Static metadata for a cryptocurrency, such as its description, logo, website and social links, by CMC ID, slug, ticker or contract address',
	},
	'globalMetrics.quotes': {
		riskLevel: 'read',
		description:
			'Market-wide totals: total market cap and 24 hour volume, BTC and ETH dominance, and the count of tracked assets, pairs and exchanges',
	},
	'tools.priceConversion': {
		riskLevel: 'read',
		description:
			'Convert an amount of one currency into another, optionally at a past timestamp; a ticker shared by several assets returns one result per asset',
	},
	'exchange.info': {
		riskLevel: 'read',
		description:
			'Metadata for a centralised exchange, such as its description, logo, launch date and links, by CMC exchange ID or slug',
	},
	'key.info': {
		riskLevel: 'read',
		description:
			'Plan and usage for the configured API key: the minute request limit, the monthly credit limit, and what is left today and this month',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof coinMarketCapEndpointsNested
>;

export type BaseCoinMarketCapPlugin<T extends CoinMarketCapPluginOptions> =
	CorsairPlugin<
		'coinmarketcap',
		typeof CoinMarketCapSchema,
		typeof coinMarketCapEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalCoinMarketCapPlugin =
	BaseCoinMarketCapPlugin<CoinMarketCapPluginOptions>;

export type ExternalCoinMarketCapPlugin<T extends CoinMarketCapPluginOptions> =
	BaseCoinMarketCapPlugin<T>;

export function coinmarketcap<const T extends CoinMarketCapPluginOptions>(
	incomingOptions: CoinMarketCapPluginOptions &
		T = {} as CoinMarketCapPluginOptions & T,
): ExternalCoinMarketCapPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'coinmarketcap',
		schema: CoinMarketCapSchema,
		options: options,
		hooks: options.hooks,
		endpoints: coinMarketCapEndpointsNested,
		webhooks: {},
		endpointMeta: coinMarketCapEndpointMeta,
		endpointSchemas: coinMarketCapEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: CoinMarketCapKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('coinmarketcap', ctx.authType ?? 'api_key');
		},
	} satisfies InternalCoinMarketCapPlugin;
}

export { CoinMarketCapAPIError } from './client';

export type {
	CoinMarketCapEndpointInputs,
	CoinMarketCapEndpointOutputs,
	ConversionResult,
	CryptocurrencyInfo,
	CryptocurrencyInfoInput,
	CryptocurrencyInfoResponse,
	CryptocurrencyMapEntry,
	CryptocurrencyMapInput,
	CryptocurrencyMapResponse,
	CryptoQuote,
	ExchangeInfo,
	ExchangeInfoInput,
	ExchangeInfoResponse,
	GlobalMetricsQuotesInput,
	GlobalMetricsQuotesResponse,
	KeyInfoInput,
	KeyInfoResponse,
	ListingsLatestInput,
	ListingsLatestResponse,
	PriceConversionInput,
	PriceConversionResponse,
	QuotesLatestInput,
	QuotesLatestResponse,
} from './endpoints/types';
