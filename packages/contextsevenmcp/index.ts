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
import type { ContextSevenMcpEndpointInputs, ContextSevenMcpEndpointOutputs } from './endpoints/types';
import { ContextSevenMcpEndpointInputSchemas, ContextSevenMcpEndpointOutputSchemas } from './endpoints/types';
import type {
	ContextSevenMcpWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { ContextSevenMcpSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchContextSevenMcpTenantWebhook } from './webhooks/tenant-matcher';
import { resolveContextSevenMcpOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type ContextSevenMcpPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalContextSevenMcpPlugin['hooks'];
	webhookHooks?: InternalContextSevenMcpPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof contextSevenMcpEndpointsNested>;
};

export type ContextSevenMcpContext = CorsairPluginContext<
	typeof ContextSevenMcpSchema,
	ContextSevenMcpPluginOptions
>;

export type ContextSevenMcpKeyBuilderContext = KeyBuilderContext<ContextSevenMcpPluginOptions>;

export type ContextSevenMcpBoundEndpoints = BindEndpoints<typeof contextSevenMcpEndpointsNested>;

type ContextSevenMcpEndpoint<
	K extends keyof ContextSevenMcpEndpointOutputs,
> = CorsairEndpoint<
	ContextSevenMcpContext,
	ContextSevenMcpEndpointInputs[K],
	ContextSevenMcpEndpointOutputs[K]
>;

export type ContextSevenMcpEndpoints = {
	exampleGet: ContextSevenMcpEndpoint<'exampleGet'>;
};

type ContextSevenMcpWebhook<
	K extends keyof ContextSevenMcpWebhookOutputs,
	TEvent,
> = CorsairWebhook<ContextSevenMcpContext, TEvent, ContextSevenMcpWebhookOutputs[K]>;

export type ContextSevenMcpWebhooks = {
	example: ContextSevenMcpWebhook<'example', ExampleEvent>;
};

export type ContextSevenMcpBoundWebhooks = BindWebhooks<ContextSevenMcpWebhooks>;

const contextSevenMcpEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const contextSevenMcpWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const contextSevenMcpEndpointSchemas = {
	'example.get': {
		input: ContextSevenMcpEndpointInputSchemas.exampleGet,
		output: ContextSevenMcpEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof contextSevenMcpEndpointsNested>;

const contextSevenMcpWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof contextSevenMcpWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const contextSevenMcpEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof contextSevenMcpEndpointsNested>;

export const contextSevenMcpAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseContextSevenMcpPlugin<T extends ContextSevenMcpPluginOptions> = CorsairPlugin<
	'contextsevenmcp',
	typeof ContextSevenMcpSchema,
	typeof contextSevenMcpEndpointsNested,
	typeof contextSevenMcpWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalContextSevenMcpPlugin = BaseContextSevenMcpPlugin<ContextSevenMcpPluginOptions>;

export type ExternalContextSevenMcpPlugin<T extends ContextSevenMcpPluginOptions> =
	BaseContextSevenMcpPlugin<T>;

export function contextsevenmcp<const T extends ContextSevenMcpPluginOptions>(
	incomingOptions: ContextSevenMcpPluginOptions & T = {} as ContextSevenMcpPluginOptions & T,
): ExternalContextSevenMcpPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'contextsevenmcp',
		authConfig: contextSevenMcpAuthConfig,
		schema: ContextSevenMcpSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: contextSevenMcpEndpointsNested,
		webhooks: contextSevenMcpWebhooksNested,
		endpointMeta: contextSevenMcpEndpointMeta,
		endpointSchemas: contextSevenMcpEndpointSchemas,
		webhookSchemas: contextSevenMcpWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-contextsevenmcp-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchContextSevenMcpTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveContextSevenMcpOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ContextSevenMcpKeyBuilderContext, source) => {
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
	} satisfies InternalContextSevenMcpPlugin;
}

export type {
	ExampleEvent,
	ContextSevenMcpWebhookOutputs,
} from './webhooks/types';

export type {
	ContextSevenMcpEndpointInputs,
	ContextSevenMcpEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
