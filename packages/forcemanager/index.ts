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
import type { ForceManagerEndpointInputs, ForceManagerEndpointOutputs } from './endpoints/types';
import { ForceManagerEndpointInputSchemas, ForceManagerEndpointOutputSchemas } from './endpoints/types';
import type {
	ForceManagerWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { ForceManagerSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchForceManagerTenantWebhook } from './webhooks/tenant-matcher';
import { resolveForceManagerOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type ForceManagerPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalForceManagerPlugin['hooks'];
	webhookHooks?: InternalForceManagerPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof forceManagerEndpointsNested>;
};

export type ForceManagerContext = CorsairPluginContext<
	typeof ForceManagerSchema,
	ForceManagerPluginOptions
>;

export type ForceManagerKeyBuilderContext = KeyBuilderContext<ForceManagerPluginOptions>;

export type ForceManagerBoundEndpoints = BindEndpoints<typeof forceManagerEndpointsNested>;

type ForceManagerEndpoint<
	K extends keyof ForceManagerEndpointOutputs,
> = CorsairEndpoint<
	ForceManagerContext,
	ForceManagerEndpointInputs[K],
	ForceManagerEndpointOutputs[K]
>;

export type ForceManagerEndpoints = {
	exampleGet: ForceManagerEndpoint<'exampleGet'>;
};

type ForceManagerWebhook<
	K extends keyof ForceManagerWebhookOutputs,
	TEvent,
> = CorsairWebhook<ForceManagerContext, TEvent, ForceManagerWebhookOutputs[K]>;

export type ForceManagerWebhooks = {
	example: ForceManagerWebhook<'example', ExampleEvent>;
};

export type ForceManagerBoundWebhooks = BindWebhooks<ForceManagerWebhooks>;

const forceManagerEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const forceManagerWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const forceManagerEndpointSchemas = {
	'example.get': {
		input: ForceManagerEndpointInputSchemas.exampleGet,
		output: ForceManagerEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof forceManagerEndpointsNested>;

const forceManagerWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof forceManagerWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const forceManagerEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof forceManagerEndpointsNested>;

export const forceManagerAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseForceManagerPlugin<T extends ForceManagerPluginOptions> = CorsairPlugin<
	'forcemanager',
	typeof ForceManagerSchema,
	typeof forceManagerEndpointsNested,
	typeof forceManagerWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalForceManagerPlugin = BaseForceManagerPlugin<ForceManagerPluginOptions>;

export type ExternalForceManagerPlugin<T extends ForceManagerPluginOptions> =
	BaseForceManagerPlugin<T>;

export function forcemanager<const T extends ForceManagerPluginOptions>(
	incomingOptions: ForceManagerPluginOptions & T = {} as ForceManagerPluginOptions & T,
): ExternalForceManagerPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'forcemanager',
		authConfig: forceManagerAuthConfig,
		schema: ForceManagerSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: forceManagerEndpointsNested,
		webhooks: forceManagerWebhooksNested,
		endpointMeta: forceManagerEndpointMeta,
		endpointSchemas: forceManagerEndpointSchemas,
		webhookSchemas: forceManagerWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-forcemanager-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchForceManagerTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveForceManagerOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ForceManagerKeyBuilderContext, source) => {
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
	} satisfies InternalForceManagerPlugin;
}

export type {
	ExampleEvent,
	ForceManagerWebhookOutputs,
} from './webhooks/types';

export type {
	ForceManagerEndpointInputs,
	ForceManagerEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
