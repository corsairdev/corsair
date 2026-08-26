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
import { Example } from './endpoints';
import type {
	BestBuyEndpointInputs,
	BestBuyEndpointOutputs,
} from './endpoints/types';
import {
	BestBuyEndpointInputSchemas,
	BestBuyEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BestBuySchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveBestBuyOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchBestBuyTenantWebhook } from './webhooks/tenant-matcher';
import type { BestBuyWebhookOutputs, ExampleEvent } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type BestBuyPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalBestBuyPlugin['hooks'];
	webhookHooks?: InternalBestBuyPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof bestBuyEndpointsNested>;
};

export type BestBuyContext = CorsairPluginContext<
	typeof BestBuySchema,
	BestBuyPluginOptions
>;

export type BestBuyKeyBuilderContext = KeyBuilderContext<BestBuyPluginOptions>;

export type BestBuyBoundEndpoints = BindEndpoints<
	typeof bestBuyEndpointsNested
>;

type BestBuyEndpoint<K extends keyof BestBuyEndpointOutputs> = CorsairEndpoint<
	BestBuyContext,
	BestBuyEndpointInputs[K],
	BestBuyEndpointOutputs[K]
>;

export type BestBuyEndpoints = {
	exampleGet: BestBuyEndpoint<'exampleGet'>;
};

type BestBuyWebhook<
	K extends keyof BestBuyWebhookOutputs,
	TEvent,
> = CorsairWebhook<BestBuyContext, TEvent, BestBuyWebhookOutputs[K]>;

export type BestBuyWebhooks = {
	example: BestBuyWebhook<'example', ExampleEvent>;
};

export type BestBuyBoundWebhooks = BindWebhooks<BestBuyWebhooks>;

const bestBuyEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const bestBuyWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const bestBuyEndpointSchemas = {
	'example.get': {
		input: BestBuyEndpointInputSchemas.exampleGet,
		output: BestBuyEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof bestBuyEndpointsNested
>;

const bestBuyWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof bestBuyWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const bestBuyEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof bestBuyEndpointsNested>;

export const bestBuyAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseBestBuyPlugin<T extends BestBuyPluginOptions> = CorsairPlugin<
	'bestbuy',
	typeof BestBuySchema,
	typeof bestBuyEndpointsNested,
	typeof bestBuyWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalBestBuyPlugin = BaseBestBuyPlugin<BestBuyPluginOptions>;

export type ExternalBestBuyPlugin<T extends BestBuyPluginOptions> =
	BaseBestBuyPlugin<T>;

export function bestbuy<const T extends BestBuyPluginOptions>(
	incomingOptions: BestBuyPluginOptions & T = {} as BestBuyPluginOptions & T,
): ExternalBestBuyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'bestbuy',
		authConfig: bestBuyAuthConfig,
		schema: BestBuySchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: bestBuyEndpointsNested,
		webhooks: bestBuyWebhooksNested,
		endpointMeta: bestBuyEndpointMeta,
		endpointSchemas: bestBuyEndpointSchemas,
		webhookSchemas: bestBuyWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-bestbuy-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchBestBuyTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveBestBuyOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BestBuyKeyBuilderContext, source) => {
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
	} satisfies InternalBestBuyPlugin;
}

export type {
	BestBuyEndpointInputs,
	BestBuyEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
export type {
	BestBuyWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
