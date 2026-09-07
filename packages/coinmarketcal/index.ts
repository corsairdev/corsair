import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { Categories, Events, Example } from './endpoints';
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
import { ExampleWebhooks } from './webhooks';
import { resolveCoinmarketcalOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchCoinmarketcalTenantWebhook } from './webhooks/tenant-matcher';
import type {
	CoinmarketcalWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type CoinmarketcalPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalCoinmarketcalPlugin['hooks'];
	webhookHooks?: InternalCoinmarketcalPlugin['webhookHooks'];
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
	exampleGet: CoinmarketcalEndpoint<'exampleGet'>;
	eventsList: CoinmarketcalEndpoint<'eventsList'>;
	categoriesList: CoinmarketcalEndpoint<'categoriesList'>;
};

type CoinmarketcalWebhook<
	K extends keyof CoinmarketcalWebhookOutputs,
	TEvent,
> = CorsairWebhook<
	CoinmarketcalContext,
	TEvent,
	CoinmarketcalWebhookOutputs[K]
>;

export type CoinmarketcalWebhooks = {
	example: CoinmarketcalWebhook<'example', ExampleEvent>;
};

export type CoinmarketcalBoundWebhooks = BindWebhooks<CoinmarketcalWebhooks>;

const coinmarketcalEndpointsNested = {
	coins: {
		list: Example.get,
	},
	events: {
		list: Events.list,
	},
	categories: {
		list: Categories.list,
	},
} as const;

const coinmarketcalWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const coinmarketcalEndpointSchemas = {
	'coins.list': {
		input: CoinmarketcalEndpointInputSchemas.exampleGet,
		output: CoinmarketcalEndpointOutputSchemas.exampleGet,
	},
	'events.list': {
		input: CoinmarketcalEndpointInputSchemas.eventsList,
		output: CoinmarketcalEndpointOutputSchemas.eventsList,
	},
	'categories.list': {
		input: CoinmarketcalEndpointInputSchemas.categoriesList,
		output: CoinmarketcalEndpointOutputSchemas.categoriesList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof coinmarketcalEndpointsNested
>;

const coinmarketcalWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof coinmarketcalWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const coinmarketcalEndpointMeta = {
	'coins.list': {
		riskLevel: 'read',
		description: 'List available cryptocurrencies from CoinMarketCal',
	},
	'events.list': {
		riskLevel: 'read',
		description: 'List cryptocurrency events from CoinMarketCal',
	},
	'categories.list': {
		riskLevel: 'read',
		description: 'List event categories from CoinMarketCal',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof coinmarketcalEndpointsNested
>;

export const coinmarketcalAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseCoinmarketcalPlugin<T extends CoinmarketcalPluginOptions> =
	CorsairPlugin<
		'coinmarketcal',
		typeof CoinmarketcalSchema,
		typeof coinmarketcalEndpointsNested,
		typeof coinmarketcalWebhooksNested,
		T,
		typeof defaultAuthType
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
		webhookHooks: options.webhookHooks,
		endpoints: coinmarketcalEndpointsNested,
		webhooks: coinmarketcalWebhooksNested,
		endpointMeta: coinmarketcalEndpointMeta,
		endpointSchemas: coinmarketcalEndpointSchemas,
		webhookSchemas: coinmarketcalWebhookSchemas,

		pluginWebhookMatcher: (request) => {
			const headers = request.headers;

			// TODO: Replace with real webhook signature matching
			return 'x-coinmarketcal-signature' in headers;
		},

		pluginTenantWebhookMatcher: matchCoinmarketcalTenantWebhook,

		oauthWebhookTenantLinkResolver: resolveCoinmarketcalOAuthWebhookTenantLink,

		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},

		keyBuilder: async (ctx: CoinmarketcalKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				return res ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalCoinmarketcalPlugin;
}

export type {
	CategoriesInput,
	CategoriesResponse,
	CoinmarketcalEndpointInputs,
	CoinmarketcalEndpointOutputs,
	CoinsInput,
	CoinsResponse,
	EventsInput,
	EventsResponse,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
export type {
	CoinmarketcalWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
