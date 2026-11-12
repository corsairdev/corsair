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
import type { EngageEndpointInputs, EngageEndpointOutputs } from './endpoints/types';
import { EngageEndpointInputSchemas, EngageEndpointOutputSchemas } from './endpoints/types';
import type {
	EngageWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { EngageSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchEngageTenantWebhook } from './webhooks/tenant-matcher';
import { resolveEngageOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type EngagePluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalEngagePlugin['hooks'];
	webhookHooks?: InternalEngagePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof engageEndpointsNested>;
};

export type EngageContext = CorsairPluginContext<
	typeof EngageSchema,
	EngagePluginOptions
>;

export type EngageKeyBuilderContext = KeyBuilderContext<EngagePluginOptions>;

export type EngageBoundEndpoints = BindEndpoints<typeof engageEndpointsNested>;

type EngageEndpoint<
	K extends keyof EngageEndpointOutputs,
> = CorsairEndpoint<
	EngageContext,
	EngageEndpointInputs[K],
	EngageEndpointOutputs[K]
>;

export type EngageEndpoints = {
	exampleGet: EngageEndpoint<'exampleGet'>;
};

type EngageWebhook<
	K extends keyof EngageWebhookOutputs,
	TEvent,
> = CorsairWebhook<EngageContext, TEvent, EngageWebhookOutputs[K]>;

export type EngageWebhooks = {
	example: EngageWebhook<'example', ExampleEvent>;
};

export type EngageBoundWebhooks = BindWebhooks<EngageWebhooks>;

const engageEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const engageWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const engageEndpointSchemas = {
	'example.get': {
		input: EngageEndpointInputSchemas.exampleGet,
		output: EngageEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof engageEndpointsNested>;

const engageWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof engageWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const engageEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof engageEndpointsNested>;

export const engageAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseEngagePlugin<T extends EngagePluginOptions> = CorsairPlugin<
	'engage',
	typeof EngageSchema,
	typeof engageEndpointsNested,
	typeof engageWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalEngagePlugin = BaseEngagePlugin<EngagePluginOptions>;

export type ExternalEngagePlugin<T extends EngagePluginOptions> =
	BaseEngagePlugin<T>;

export function engage<const T extends EngagePluginOptions>(
	incomingOptions: EngagePluginOptions & T = {} as EngagePluginOptions & T,
): ExternalEngagePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'engage',
		authConfig: engageAuthConfig,
		schema: EngageSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: engageEndpointsNested,
		webhooks: engageWebhooksNested,
		endpointMeta: engageEndpointMeta,
		endpointSchemas: engageEndpointSchemas,
		webhookSchemas: engageWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-engage-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchEngageTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveEngageOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: EngageKeyBuilderContext, source) => {
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
	} satisfies InternalEngagePlugin;
}

export type {
	ExampleEvent,
	EngageWebhookOutputs,
} from './webhooks/types';

export type {
	EngageEndpointInputs,
	EngageEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
