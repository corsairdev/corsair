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
import type { StackExchangeEndpointInputs, StackExchangeEndpointOutputs } from './endpoints/types';
import { StackExchangeEndpointInputSchemas, StackExchangeEndpointOutputSchemas } from './endpoints/types';
import type {
	StackExchangeWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { StackExchangeSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchStackExchangeTenantWebhook } from './webhooks/tenant-matcher';
import { resolveStackExchangeOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type StackExchangePluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalStackExchangePlugin['hooks'];
	webhookHooks?: InternalStackExchangePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof stackExchangeEndpointsNested>;
};

export type StackExchangeContext = CorsairPluginContext<
	typeof StackExchangeSchema,
	StackExchangePluginOptions
>;

export type StackExchangeKeyBuilderContext = KeyBuilderContext<StackExchangePluginOptions>;

export type StackExchangeBoundEndpoints = BindEndpoints<typeof stackExchangeEndpointsNested>;

type StackExchangeEndpoint<
	K extends keyof StackExchangeEndpointOutputs,
> = CorsairEndpoint<
	StackExchangeContext,
	StackExchangeEndpointInputs[K],
	StackExchangeEndpointOutputs[K]
>;

export type StackExchangeEndpoints = {
	exampleGet: StackExchangeEndpoint<'exampleGet'>;
};

type StackExchangeWebhook<
	K extends keyof StackExchangeWebhookOutputs,
	TEvent,
> = CorsairWebhook<StackExchangeContext, TEvent, StackExchangeWebhookOutputs[K]>;

export type StackExchangeWebhooks = {
	example: StackExchangeWebhook<'example', ExampleEvent>;
};

export type StackExchangeBoundWebhooks = BindWebhooks<StackExchangeWebhooks>;

const stackExchangeEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const stackExchangeWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const stackExchangeEndpointSchemas = {
	'example.get': {
		input: StackExchangeEndpointInputSchemas.exampleGet,
		output: StackExchangeEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof stackExchangeEndpointsNested>;

const stackExchangeWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof stackExchangeWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const stackExchangeEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof stackExchangeEndpointsNested>;

export const stackExchangeAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseStackExchangePlugin<T extends StackExchangePluginOptions> = CorsairPlugin<
	'stackexchange',
	typeof StackExchangeSchema,
	typeof stackExchangeEndpointsNested,
	typeof stackExchangeWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalStackExchangePlugin = BaseStackExchangePlugin<StackExchangePluginOptions>;

export type ExternalStackExchangePlugin<T extends StackExchangePluginOptions> =
	BaseStackExchangePlugin<T>;

export function stackexchange<const T extends StackExchangePluginOptions>(
	incomingOptions: StackExchangePluginOptions & T = {} as StackExchangePluginOptions & T,
): ExternalStackExchangePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'stackexchange',
		authConfig: stackExchangeAuthConfig,
		schema: StackExchangeSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: stackExchangeEndpointsNested,
		webhooks: stackExchangeWebhooksNested,
		endpointMeta: stackExchangeEndpointMeta,
		endpointSchemas: stackExchangeEndpointSchemas,
		webhookSchemas: stackExchangeWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-stackexchange-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchStackExchangeTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveStackExchangeOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: StackExchangeKeyBuilderContext, source) => {
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
	} satisfies InternalStackExchangePlugin;
}

export type {
	ExampleEvent,
	StackExchangeWebhookOutputs,
} from './webhooks/types';

export type {
	StackExchangeEndpointInputs,
	StackExchangeEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
