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
import type { GoDialEndpointInputs, GoDialEndpointOutputs } from './endpoints/types';
import { GoDialEndpointInputSchemas, GoDialEndpointOutputSchemas } from './endpoints/types';
import type {
	GoDialWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { GoDialSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchGoDialTenantWebhook } from './webhooks/tenant-matcher';
import { resolveGoDialOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type GoDialPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalGoDialPlugin['hooks'];
	webhookHooks?: InternalGoDialPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof goDialEndpointsNested>;
};

export type GoDialContext = CorsairPluginContext<
	typeof GoDialSchema,
	GoDialPluginOptions
>;

export type GoDialKeyBuilderContext = KeyBuilderContext<GoDialPluginOptions>;

export type GoDialBoundEndpoints = BindEndpoints<typeof goDialEndpointsNested>;

type GoDialEndpoint<
	K extends keyof GoDialEndpointOutputs,
> = CorsairEndpoint<
	GoDialContext,
	GoDialEndpointInputs[K],
	GoDialEndpointOutputs[K]
>;

export type GoDialEndpoints = {
	exampleGet: GoDialEndpoint<'exampleGet'>;
};

type GoDialWebhook<
	K extends keyof GoDialWebhookOutputs,
	TEvent,
> = CorsairWebhook<GoDialContext, TEvent, GoDialWebhookOutputs[K]>;

export type GoDialWebhooks = {
	example: GoDialWebhook<'example', ExampleEvent>;
};

export type GoDialBoundWebhooks = BindWebhooks<GoDialWebhooks>;

const goDialEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const goDialWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const goDialEndpointSchemas = {
	'example.get': {
		input: GoDialEndpointInputSchemas.exampleGet,
		output: GoDialEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof goDialEndpointsNested>;

const goDialWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof goDialWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const goDialEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof goDialEndpointsNested>;

export const goDialAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseGoDialPlugin<T extends GoDialPluginOptions> = CorsairPlugin<
	'godial',
	typeof GoDialSchema,
	typeof goDialEndpointsNested,
	typeof goDialWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalGoDialPlugin = BaseGoDialPlugin<GoDialPluginOptions>;

export type ExternalGoDialPlugin<T extends GoDialPluginOptions> =
	BaseGoDialPlugin<T>;

export function godial<const T extends GoDialPluginOptions>(
	incomingOptions: GoDialPluginOptions & T = {} as GoDialPluginOptions & T,
): ExternalGoDialPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'godial',
		authConfig: goDialAuthConfig,
		schema: GoDialSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: goDialEndpointsNested,
		webhooks: goDialWebhooksNested,
		endpointMeta: goDialEndpointMeta,
		endpointSchemas: goDialEndpointSchemas,
		webhookSchemas: goDialWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-godial-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchGoDialTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveGoDialOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: GoDialKeyBuilderContext, source) => {
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
	} satisfies InternalGoDialPlugin;
}

export type {
	ExampleEvent,
	GoDialWebhookOutputs,
} from './webhooks/types';

export type {
	GoDialEndpointInputs,
	GoDialEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
