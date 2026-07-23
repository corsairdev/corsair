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
import type { HashnodeEndpointInputs, HashnodeEndpointOutputs } from './endpoints/types';
import { HashnodeEndpointInputSchemas, HashnodeEndpointOutputSchemas } from './endpoints/types';
import type {
	HashnodeWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { HashnodeSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchHashnodeTenantWebhook } from './webhooks/tenant-matcher';
import { resolveHashnodeOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type HashnodePluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalHashnodePlugin['hooks'];
	webhookHooks?: InternalHashnodePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof hashnodeEndpointsNested>;
};

export type HashnodeContext = CorsairPluginContext<
	typeof HashnodeSchema,
	HashnodePluginOptions
>;

export type HashnodeKeyBuilderContext = KeyBuilderContext<HashnodePluginOptions>;

export type HashnodeBoundEndpoints = BindEndpoints<typeof hashnodeEndpointsNested>;

type HashnodeEndpoint<
	K extends keyof HashnodeEndpointOutputs,
> = CorsairEndpoint<
	HashnodeContext,
	HashnodeEndpointInputs[K],
	HashnodeEndpointOutputs[K]
>;

export type HashnodeEndpoints = {
	exampleGet: HashnodeEndpoint<'exampleGet'>;
};

type HashnodeWebhook<
	K extends keyof HashnodeWebhookOutputs,
	TEvent,
> = CorsairWebhook<HashnodeContext, TEvent, HashnodeWebhookOutputs[K]>;

export type HashnodeWebhooks = {
	example: HashnodeWebhook<'example', ExampleEvent>;
};

export type HashnodeBoundWebhooks = BindWebhooks<HashnodeWebhooks>;

const hashnodeEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const hashnodeWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const hashnodeEndpointSchemas = {
	'example.get': {
		input: HashnodeEndpointInputSchemas.exampleGet,
		output: HashnodeEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof hashnodeEndpointsNested>;

const hashnodeWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof hashnodeWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const hashnodeEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof hashnodeEndpointsNested>;

export const hashnodeAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseHashnodePlugin<T extends HashnodePluginOptions> = CorsairPlugin<
	'hashnode',
	typeof HashnodeSchema,
	typeof hashnodeEndpointsNested,
	typeof hashnodeWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalHashnodePlugin = BaseHashnodePlugin<HashnodePluginOptions>;

export type ExternalHashnodePlugin<T extends HashnodePluginOptions> =
	BaseHashnodePlugin<T>;

export function hashnode<const T extends HashnodePluginOptions>(
	incomingOptions: HashnodePluginOptions & T = {} as HashnodePluginOptions & T,
): ExternalHashnodePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'hashnode',
		authConfig: hashnodeAuthConfig,
		schema: HashnodeSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: hashnodeEndpointsNested,
		webhooks: hashnodeWebhooksNested,
		endpointMeta: hashnodeEndpointMeta,
		endpointSchemas: hashnodeEndpointSchemas,
		webhookSchemas: hashnodeWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-hashnode-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchHashnodeTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveHashnodeOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: HashnodeKeyBuilderContext, source) => {
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
	} satisfies InternalHashnodePlugin;
}

export type {
	ExampleEvent,
	HashnodeWebhookOutputs,
} from './webhooks/types';

export type {
	HashnodeEndpointInputs,
	HashnodeEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
