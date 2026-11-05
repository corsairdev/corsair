import type {
	AuthTypes,
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
import { tryGetStoredKey } from './client';
import {
	Currencies,
	Dividends,
	Eod,
	Exchanges,
	Splits,
	Tickers,
} from './endpoints';
import type {
	MarketstackEndpointInputs,
	MarketstackEndpointOutputs,
} from './endpoints/types';
import {
	MarketstackEndpointInputSchemas,
	MarketstackEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { MarketstackSchema } from './schema';

export type MarketstackPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalMarketstackPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof marketstackEndpointsNested>;
};

export type MarketstackContext = CorsairPluginContext<
	typeof MarketstackSchema,
	MarketstackPluginOptions,
	undefined,
	typeof marketstackAuthConfig
>;

export type MarketstackKeyBuilderContext = KeyBuilderContext<
	MarketstackPluginOptions,
	typeof marketstackAuthConfig
>;

export type MarketstackBoundEndpoints = BindEndpoints<
	typeof marketstackEndpointsNested
>;

type MarketstackEndpoint<K extends keyof MarketstackEndpointOutputs> =
	CorsairEndpoint<
		MarketstackContext,
		MarketstackEndpointInputs[K],
		MarketstackEndpointOutputs[K]
	>;

export type MarketstackEndpoints = {
	getEod: MarketstackEndpoint<'getEod'>;
	getTickerEod: MarketstackEndpoint<'getTickerEod'>;
	getTickerEodLatest: MarketstackEndpoint<'getTickerEodLatest'>;
	getTickerInfo: MarketstackEndpoint<'getTickerInfo'>;
	listTickers: MarketstackEndpoint<'listTickers'>;
	getExchange: MarketstackEndpoint<'getExchange'>;
	listExchanges: MarketstackEndpoint<'listExchanges'>;
	listCurrencies: MarketstackEndpoint<'listCurrencies'>;
	getDividends: MarketstackEndpoint<'getDividends'>;
	getSplits: MarketstackEndpoint<'getSplits'>;
};

const marketstackEndpointsNested = {
	eod: {
		get: Eod.get,
	},
	tickers: {
		get: Tickers.get,
		list: Tickers.list,
		getEod: Tickers.getEod,
		getEodLatest: Tickers.getEodLatest,
	},
	exchanges: {
		get: Exchanges.get,
		list: Exchanges.list,
	},
	currencies: {
		list: Currencies.list,
	},
	dividends: {
		get: Dividends.get,
	},
	splits: {
		get: Splits.get,
	},
} as const;

const marketstackWebhooksNested = {} as const;

export const marketstackEndpointSchemas = {
	'eod.get': {
		input: MarketstackEndpointInputSchemas.getEod,
		output: MarketstackEndpointOutputSchemas.getEod,
	},
	'tickers.get': {
		input: MarketstackEndpointInputSchemas.getTickerInfo,
		output: MarketstackEndpointOutputSchemas.getTickerInfo,
	},
	'tickers.list': {
		input: MarketstackEndpointInputSchemas.listTickers,
		output: MarketstackEndpointOutputSchemas.listTickers,
	},
	'tickers.getEod': {
		input: MarketstackEndpointInputSchemas.getTickerEod,
		output: MarketstackEndpointOutputSchemas.getTickerEod,
	},
	'tickers.getEodLatest': {
		input: MarketstackEndpointInputSchemas.getTickerEodLatest,
		output: MarketstackEndpointOutputSchemas.getTickerEodLatest,
	},
	'exchanges.get': {
		input: MarketstackEndpointInputSchemas.getExchange,
		output: MarketstackEndpointOutputSchemas.getExchange,
	},
	'exchanges.list': {
		input: MarketstackEndpointInputSchemas.listExchanges,
		output: MarketstackEndpointOutputSchemas.listExchanges,
	},
	'currencies.list': {
		input: MarketstackEndpointInputSchemas.listCurrencies,
		output: MarketstackEndpointOutputSchemas.listCurrencies,
	},
	'dividends.get': {
		input: MarketstackEndpointInputSchemas.getDividends,
		output: MarketstackEndpointOutputSchemas.getDividends,
	},
	'splits.get': {
		input: MarketstackEndpointInputSchemas.getSplits,
		output: MarketstackEndpointOutputSchemas.getSplits,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof marketstackEndpointsNested
>;

const marketstackEndpointMeta = {
	'eod.get': {
		riskLevel: 'read',
		description:
			'Retrieve end-of-day (EOD) OHLCV data for one or more ticker symbols',
	},
	'tickers.get': {
		riskLevel: 'read',
		description:
			'Retrieve detailed ticker information including exchange, sector, and industry',
	},
	'tickers.list': {
		riskLevel: 'read',
		description: 'List or search the stock tickers supported by Marketstack',
	},
	'tickers.getEod': {
		riskLevel: 'read',
		description:
			'Retrieve historical end-of-day (EOD) price data for a specific ticker symbol',
	},
	'tickers.getEodLatest': {
		riskLevel: 'read',
		description:
			'Retrieve the most recent end-of-day (EOD) data available for a specific ticker symbol',
	},
	'exchanges.get': {
		riskLevel: 'read',
		description:
			'Retrieve exchange details by MIC, including location, status, and operational fields',
	},
	'exchanges.list': {
		riskLevel: 'read',
		description: 'List or search the stock exchanges supported by Marketstack',
	},
	'currencies.list': {
		riskLevel: 'read',
		description: 'List all currencies supported by the Marketstack API',
	},
	'dividends.get': {
		riskLevel: 'read',
		description:
			'Retrieve historical dividend amounts and payment dates for one or more tickers',
	},
	'splits.get': {
		riskLevel: 'read',
		description:
			'Retrieve historical stock split data for one or more ticker symbols',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof marketstackEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const marketstackAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseMarketstackPlugin<T extends MarketstackPluginOptions> =
	CorsairPlugin<
		'marketstack',
		typeof MarketstackSchema,
		typeof marketstackEndpointsNested,
		typeof marketstackWebhooksNested,
		T,
		typeof defaultAuthType,
		typeof marketstackAuthConfig
	>;

export type InternalMarketstackPlugin =
	BaseMarketstackPlugin<MarketstackPluginOptions>;

export type ExternalMarketstackPlugin<T extends MarketstackPluginOptions> =
	BaseMarketstackPlugin<T>;

export function marketstack<const T extends MarketstackPluginOptions>(
	incomingOptions: MarketstackPluginOptions &
		T = {} as MarketstackPluginOptions & T,
): ExternalMarketstackPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	const { DEFAULT: defaultHandler, ...specificDefaults } = errorHandlers;
	const { DEFAULT: customDefaultHandler, ...specificCustomHandlers } =
		options.errorHandlers ?? {};
	return {
		id: 'marketstack',
		authConfig: marketstackAuthConfig,
		schema: MarketstackSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: marketstackEndpointsNested,
		webhooks: marketstackWebhooksNested,
		endpointMeta: marketstackEndpointMeta,
		endpointSchemas: marketstackEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...specificDefaults,
			...specificCustomHandlers,
			DEFAULT: customDefaultHandler || defaultHandler,
		},
		keyBuilder: async (ctx: MarketstackKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint') {
				const res = await tryGetStoredKey(() => ctx.keys?.get_api_key());
				if (!res) {
					throw new AuthMissingError('marketstack', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('marketstack', 'api_key');
		},
	} satisfies InternalMarketstackPlugin;
}

export type {
	Currency,
	Dividend,
	EodBar,
	Exchange,
	GetDividendsInput,
	GetDividendsResponse,
	GetEodInput,
	GetEodResponse,
	GetExchangeInput,
	GetExchangeResponse,
	GetSplitsInput,
	GetSplitsResponse,
	GetTickerEodInput,
	GetTickerEodLatestInput,
	GetTickerEodLatestResponse,
	GetTickerEodResponse,
	GetTickerInfoInput,
	GetTickerInfoResponse,
	ListCurrenciesInput,
	ListCurrenciesResponse,
	ListExchangesInput,
	ListExchangesResponse,
	ListTickersInput,
	ListTickersResponse,
	MarketstackEndpointInputs,
	MarketstackEndpointOutputs,
	Split,
	Ticker,
} from './endpoints/types';

export {
	CurrencySchema,
	DividendSchema,
	EodBarSchema,
	ExchangeSchema,
	GetDividendsInputSchema,
	GetDividendsResponseSchema,
	GetEodInputSchema,
	GetEodResponseSchema,
	GetExchangeInputSchema,
	GetExchangeResponseSchema,
	GetSplitsInputSchema,
	GetSplitsResponseSchema,
	GetTickerEodInputSchema,
	GetTickerEodLatestInputSchema,
	GetTickerEodLatestResponseSchema,
	GetTickerEodResponseSchema,
	GetTickerInfoInputSchema,
	GetTickerInfoResponseSchema,
	ListCurrenciesInputSchema,
	ListCurrenciesResponseSchema,
	ListExchangesInputSchema,
	ListExchangesResponseSchema,
	ListTickersInputSchema,
	ListTickersResponseSchema,
	SplitSchema,
	TickerSchema,
} from './endpoints/types';
