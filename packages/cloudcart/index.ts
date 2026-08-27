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
import type { CloudcartEndpointInputs, CloudcartEndpointOutputs } from './endpoints/types';
import { CloudcartEndpointInputSchemas, CloudcartEndpointOutputSchemas } from './endpoints/types';
import type {
	CloudcartWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { CloudcartSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchCloudcartTenantWebhook } from './webhooks/tenant-matcher';
import { resolveCloudcartOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type CloudcartPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalCloudcartPlugin['hooks'];
	webhookHooks?: InternalCloudcartPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof cloudcartEndpointsNested>;
};

export type CloudcartContext = CorsairPluginContext<
	typeof CloudcartSchema,
	CloudcartPluginOptions
>;

export type CloudcartKeyBuilderContext = KeyBuilderContext<CloudcartPluginOptions>;

export type CloudcartBoundEndpoints = BindEndpoints<typeof cloudcartEndpointsNested>;

type CloudcartEndpoint<
	K extends keyof CloudcartEndpointOutputs,
> = CorsairEndpoint<
	CloudcartContext,
	CloudcartEndpointInputs[K],
	CloudcartEndpointOutputs[K]
>;

export type CloudcartEndpoints = {
	exampleGet: CloudcartEndpoint<'exampleGet'>;
};

type CloudcartWebhook<
	K extends keyof CloudcartWebhookOutputs,
	TEvent,
> = CorsairWebhook<CloudcartContext, TEvent, CloudcartWebhookOutputs[K]>;

export type CloudcartWebhooks = {
	example: CloudcartWebhook<'example', ExampleEvent>;
};

export type CloudcartBoundWebhooks = BindWebhooks<CloudcartWebhooks>;

const cloudcartEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const cloudcartWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const cloudcartEndpointSchemas = {
	'example.get': {
		input: CloudcartEndpointInputSchemas.exampleGet,
		output: CloudcartEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof cloudcartEndpointsNested>;

const cloudcartWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof cloudcartWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const cloudcartEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof cloudcartEndpointsNested>;

export const cloudcartAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseCloudcartPlugin<T extends CloudcartPluginOptions> = CorsairPlugin<
	'cloudcart',
	typeof CloudcartSchema,
	typeof cloudcartEndpointsNested,
	typeof cloudcartWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalCloudcartPlugin = BaseCloudcartPlugin<CloudcartPluginOptions>;

export type ExternalCloudcartPlugin<T extends CloudcartPluginOptions> =
	BaseCloudcartPlugin<T>;

export function cloudcart<const T extends CloudcartPluginOptions>(
	incomingOptions: CloudcartPluginOptions & T = {} as CloudcartPluginOptions & T,
): ExternalCloudcartPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'cloudcart',
		authConfig: cloudcartAuthConfig,
		schema: CloudcartSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: cloudcartEndpointsNested,
		webhooks: cloudcartWebhooksNested,
		endpointMeta: cloudcartEndpointMeta,
		endpointSchemas: cloudcartEndpointSchemas,
		webhookSchemas: cloudcartWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-cloudcart-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchCloudcartTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveCloudcartOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CloudcartKeyBuilderContext, source) => {
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
	} satisfies InternalCloudcartPlugin;
}

export type {
	ExampleEvent,
	CloudcartWebhookOutputs,
} from './webhooks/types';

export type {
	CloudcartEndpointInputs,
	CloudcartEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
