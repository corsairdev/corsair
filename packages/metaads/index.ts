import type {
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
import type { AuthTypes } from 'corsair/core';
import type { MetaAdsEndpointInputs, MetaAdsEndpointOutputs } from './endpoints/types';
import { MetaAdsEndpointInputSchemas, MetaAdsEndpointOutputSchemas } from './endpoints/types';
import type {
	MetaAdsWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { MetaAdsSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchMetaAdsTenantWebhook } from './webhooks/tenant-matcher';
import { resolveMetaAdsOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type MetaAdsPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalMetaAdsPlugin['hooks'];
	webhookHooks?: InternalMetaAdsPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof metaAdsEndpointsNested>;
};

export type MetaAdsContext = CorsairPluginContext<
	typeof MetaAdsSchema,
	MetaAdsPluginOptions
>;

export type MetaAdsKeyBuilderContext = KeyBuilderContext<MetaAdsPluginOptions>;

export type MetaAdsBoundEndpoints = BindEndpoints<typeof metaAdsEndpointsNested>;

type MetaAdsEndpoint<
	K extends keyof MetaAdsEndpointOutputs,
> = CorsairEndpoint<
	MetaAdsContext,
	MetaAdsEndpointInputs[K],
	MetaAdsEndpointOutputs[K]
>;

export type MetaAdsEndpoints = {
	exampleGet: MetaAdsEndpoint<'exampleGet'>;
};

type MetaAdsWebhook<
	K extends keyof MetaAdsWebhookOutputs,
	TEvent,
> = CorsairWebhook<MetaAdsContext, TEvent, MetaAdsWebhookOutputs[K]>;

export type MetaAdsWebhooks = {
	example: MetaAdsWebhook<'example', ExampleEvent>;
};

export type MetaAdsBoundWebhooks = BindWebhooks<MetaAdsWebhooks>;

const metaAdsEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const metaAdsWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const metaAdsEndpointSchemas = {
	'example.get': {
		input: MetaAdsEndpointInputSchemas.exampleGet,
		output: MetaAdsEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof metaAdsEndpointsNested>;

const metaAdsWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof metaAdsWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const metaAdsEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof metaAdsEndpointsNested>;

export const metaAdsAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseMetaAdsPlugin<T extends MetaAdsPluginOptions> = CorsairPlugin<
	'metaads',
	typeof MetaAdsSchema,
	typeof metaAdsEndpointsNested,
	typeof metaAdsWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalMetaAdsPlugin = BaseMetaAdsPlugin<MetaAdsPluginOptions>;

export type ExternalMetaAdsPlugin<T extends MetaAdsPluginOptions> =
	BaseMetaAdsPlugin<T>;

export function metaads<const T extends MetaAdsPluginOptions>(
	incomingOptions: MetaAdsPluginOptions & T = {} as MetaAdsPluginOptions & T,
): ExternalMetaAdsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'metaads',
		authConfig: metaAdsAuthConfig,
		schema: MetaAdsSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: metaAdsEndpointsNested,
		webhooks: metaAdsWebhooksNested,
		endpointMeta: metaAdsEndpointMeta,
		endpointSchemas: metaAdsEndpointSchemas,
		webhookSchemas: metaAdsWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-metaads-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchMetaAdsTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveMetaAdsOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: MetaAdsKeyBuilderContext, source) => {
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
	} satisfies InternalMetaAdsPlugin;
}

export type {
	ExampleEvent,
	MetaAdsWebhookOutputs,
} from './webhooks/types';

export type {
	MetaAdsEndpointInputs,
	MetaAdsEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
