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
import { getNews } from './endpoints';
import type {
	BenzingaEndpointInputs,
	BenzingaEndpointOutputs,
} from './endpoints/types';
import {
	BenzingaEndpointInputSchemas,
	BenzingaEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BenzingaSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveBenzingaOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchBenzingaTenantWebhook } from './webhooks/tenant-matcher';
import type { BenzingaWebhookOutputs, ExampleEvent } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type BenzingaPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalBenzingaPlugin['hooks'];
	webhookHooks?: InternalBenzingaPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof benzingaEndpointsNested>;
};

export type BenzingaContext = CorsairPluginContext<
	typeof BenzingaSchema,
	BenzingaPluginOptions
>;

export type BenzingaKeyBuilderContext =
	KeyBuilderContext<BenzingaPluginOptions>;

export type BenzingaBoundEndpoints = BindEndpoints<
	typeof benzingaEndpointsNested
>;

type BenzingaEndpoint<K extends keyof BenzingaEndpointOutputs> =
	CorsairEndpoint<
		BenzingaContext,
		BenzingaEndpointInputs[K],
		BenzingaEndpointOutputs[K]
	>;

export type BenzingaEndpoints = {
	getNews: BenzingaEndpoint<'getNews'>;
};

type BenzingaWebhook<
	K extends keyof BenzingaWebhookOutputs,
	TEvent,
> = CorsairWebhook<BenzingaContext, TEvent, BenzingaWebhookOutputs[K]>;

export type BenzingaWebhooks = {
	example: BenzingaWebhook<'example', ExampleEvent>;
};

export type BenzingaBoundWebhooks = BindWebhooks<BenzingaWebhooks>;

const benzingaEndpointsNested = {
	news: {
		get: getNews,
	},
} as const;

const benzingaWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const benzingaEndpointSchemas = {
	'news.get': {
		input: BenzingaEndpointInputSchemas.getNews,
		output: BenzingaEndpointOutputSchemas.getNews,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof benzingaEndpointsNested
>;

const benzingaWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof benzingaWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const benzingaEndpointMeta = {
	'news.get': {
		riskLevel: 'read',
		description: 'Get Benzinga news articles',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof benzingaEndpointsNested>;

export const benzingaAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseBenzingaPlugin<T extends BenzingaPluginOptions> = CorsairPlugin<
	'benzinga',
	typeof BenzingaSchema,
	typeof benzingaEndpointsNested,
	typeof benzingaWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalBenzingaPlugin = BaseBenzingaPlugin<BenzingaPluginOptions>;

export type ExternalBenzingaPlugin<T extends BenzingaPluginOptions> =
	BaseBenzingaPlugin<T>;

export function benzinga<const T extends BenzingaPluginOptions>(
	incomingOptions: BenzingaPluginOptions & T = {} as BenzingaPluginOptions & T,
): ExternalBenzingaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'benzinga',
		authConfig: benzingaAuthConfig,
		schema: BenzingaSchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: benzingaEndpointsNested,
		webhooks: benzingaWebhooksNested,
		endpointMeta: benzingaEndpointMeta,
		endpointSchemas: benzingaEndpointSchemas,
		webhookSchemas: benzingaWebhookSchemas,

		pluginWebhookMatcher: (request) => {
			const headers = request.headers;

			// TODO: Update when Benzinga webhook signature
			// requirements are confirmed.
			return 'x-benzinga-signature' in headers;
		},

		pluginTenantWebhookMatcher: matchBenzingaTenantWebhook,

		oauthWebhookTenantLinkResolver: resolveBenzingaOAuthWebhookTenantLink,

		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},

		keyBuilder: async (ctx: BenzingaKeyBuilderContext, source) => {
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
	} satisfies InternalBenzingaPlugin;
}

export type {
	BenzingaEndpointInputs,
	BenzingaEndpointOutputs,
	GetNewsInput,
	GetNewsResponse,
} from './endpoints/types';
export type {
	BenzingaWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
