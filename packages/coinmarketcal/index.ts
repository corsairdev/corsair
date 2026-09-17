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
import { Categories, Coins, Events } from './endpoints';
import type {
	CoinmarketcalEndpointInputs,
	CoinmarketcalEndpointOutputs,
} from './endpoints/types';
import {
	CoinmarketcalEndpointInputSchemas,
	CoinmarketcalEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CoinmarketcalSchema } from './schema';

export type CoinmarketcalPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalCoinmarketcalPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof coinmarketcalEndpointsNested>;
};

export type CoinmarketcalContext = CorsairPluginContext<
	typeof CoinmarketcalSchema,
	CoinmarketcalPluginOptions
>;

export type CoinmarketcalKeyBuilderContext =
	KeyBuilderContext<CoinmarketcalPluginOptions>;

export type CoinmarketcalBoundEndpoints = BindEndpoints<
	typeof coinmarketcalEndpointsNested
>;

type CoinmarketcalEndpoint<K extends keyof CoinmarketcalEndpointOutputs> =
	CorsairEndpoint<
		CoinmarketcalContext,
		CoinmarketcalEndpointInputs[K],
		CoinmarketcalEndpointOutputs[K]
	>;

export type CoinmarketcalEndpoints = {
	coinsList: CoinmarketcalEndpoint<'coinsList'>;
	coinsGet: CoinmarketcalEndpoint<'coinsGet'>;
	eventsList: CoinmarketcalEndpoint<'eventsList'>;
	eventsGet: CoinmarketcalEndpoint<'eventsGet'>;
	categoriesList: CoinmarketcalEndpoint<'categoriesList'>;
};

const coinmarketcalEndpointsNested = {
	coins: {
		list: Coins.list,
		get: Coins.get,
	},
	events: {
		list: Events.list,
		get: Events.get,
	},
	categories: {
		list: Categories.list,
	},
} as const;

const coinmarketcalWebhooksNested = {} as const;

export const coinmarketcalEndpointSchemas = {
	'coins.list': {
		input: CoinmarketcalEndpointInputSchemas.coinsList,
		output: CoinmarketcalEndpointOutputSchemas.coinsList,
	},
	'coins.get': {
		input: CoinmarketcalEndpointInputSchemas.coinsGet,
		output: CoinmarketcalEndpointOutputSchemas.coinsGet,
	},
	'events.list': {
		input: CoinmarketcalEndpointInputSchemas.eventsList,
		output: CoinmarketcalEndpointOutputSchemas.eventsList,
	},
	'events.get': {
		input: CoinmarketcalEndpointInputSchemas.eventsGet,
		output: CoinmarketcalEndpointOutputSchemas.eventsGet,
	},
	'categories.list': {
		input: CoinmarketcalEndpointInputSchemas.categoriesList,
		output: CoinmarketcalEndpointOutputSchemas.categoriesList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof coinmarketcalEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const coinmarketcalEndpointMeta = {
	'coins.list': {
		riskLevel: 'read',
		description: 'List available cryptocurrencies from CoinMarketCal',
	},
	'coins.get': {
		riskLevel: 'read',
		description: 'Get a cryptocurrency by symbol from CoinMarketCal',
	},
	'events.list': {
		riskLevel: 'read',
		description: 'List cryptocurrency events from CoinMarketCal',
	},
	'events.get': {
		riskLevel: 'read',
		description: 'Get a cryptocurrency event by id from CoinMarketCal',
	},
	'categories.list': {
		riskLevel: 'read',
		description: 'List event categories from CoinMarketCal',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof coinmarketcalEndpointsNested
>;

export const coinmarketcalAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseCoinmarketcalPlugin<T extends CoinmarketcalPluginOptions> =
	CorsairPlugin<
		'coinmarketcal',
		typeof CoinmarketcalSchema,
		typeof coinmarketcalEndpointsNested,
		typeof coinmarketcalWebhooksNested,
		T,
		typeof defaultAuthType,
		typeof coinmarketcalAuthConfig
	>;

export type InternalCoinmarketcalPlugin =
	BaseCoinmarketcalPlugin<CoinmarketcalPluginOptions>;

export type ExternalCoinmarketcalPlugin<T extends CoinmarketcalPluginOptions> =
	BaseCoinmarketcalPlugin<T>;

export function coinmarketcal<const T extends CoinmarketcalPluginOptions>(
	incomingOptions: CoinmarketcalPluginOptions &
		T = {} as CoinmarketcalPluginOptions & T,
): ExternalCoinmarketcalPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'coinmarketcal',
		authConfig: coinmarketcalAuthConfig,
		schema: CoinmarketcalSchema,
		options: options,
		hooks: options.hooks,
		endpoints: coinmarketcalEndpointsNested,
		webhooks: coinmarketcalWebhooksNested,
		endpointMeta: coinmarketcalEndpointMeta,
		endpointSchemas: coinmarketcalEndpointSchemas,
		pluginWebhookMatcher: undefined,

		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},

		keyBuilder: async (ctx: CoinmarketcalKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) {
					return res;
				}
			}

			throw new AuthMissingError('coinmarketcal', 'api_key');
		},
	} satisfies InternalCoinmarketcalPlugin;
}

export type {
	CategoriesInput,
	CategoriesResponse,
	CoinGetInput,
	CoinGetResponse,
	CoinmarketcalEndpointInputs,
	CoinmarketcalEndpointOutputs,
	CoinsInput,
	CoinsResponse,
	EventGetInput,
	EventGetResponse,
	EventsInput,
	EventsResponse,
} from './endpoints/types';
