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
import type { MetabaseEndpointInputs, MetabaseEndpointOutputs } from './endpoints/types';
import { MetabaseEndpointInputSchemas, MetabaseEndpointOutputSchemas } from './endpoints/types';
import type {
	MetabaseWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { MetabaseSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchMetabaseTenantWebhook } from './webhooks/tenant-matcher';
import { resolveMetabaseOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type MetabasePluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalMetabasePlugin['hooks'];
	webhookHooks?: InternalMetabasePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof metabaseEndpointsNested>;
};

export type MetabaseContext = CorsairPluginContext<
	typeof MetabaseSchema,
	MetabasePluginOptions
>;

export type MetabaseKeyBuilderContext = KeyBuilderContext<MetabasePluginOptions>;

export type MetabaseBoundEndpoints = BindEndpoints<typeof metabaseEndpointsNested>;

type MetabaseEndpoint<
	K extends keyof MetabaseEndpointOutputs,
> = CorsairEndpoint<
	MetabaseContext,
	MetabaseEndpointInputs[K],
	MetabaseEndpointOutputs[K]
>;

export type MetabaseEndpoints = {
	exampleGet: MetabaseEndpoint<'exampleGet'>;
};

type MetabaseWebhook<
	K extends keyof MetabaseWebhookOutputs,
	TEvent,
> = CorsairWebhook<MetabaseContext, TEvent, MetabaseWebhookOutputs[K]>;

export type MetabaseWebhooks = {
	example: MetabaseWebhook<'example', ExampleEvent>;
};

export type MetabaseBoundWebhooks = BindWebhooks<MetabaseWebhooks>;

const metabaseEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const metabaseWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const metabaseEndpointSchemas = {
	'example.get': {
		input: MetabaseEndpointInputSchemas.exampleGet,
		output: MetabaseEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof metabaseEndpointsNested>;

const metabaseWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof metabaseWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const metabaseEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof metabaseEndpointsNested>;

export const metabaseAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseMetabasePlugin<T extends MetabasePluginOptions> = CorsairPlugin<
	'metabase',
	typeof MetabaseSchema,
	typeof metabaseEndpointsNested,
	typeof metabaseWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalMetabasePlugin = BaseMetabasePlugin<MetabasePluginOptions>;

export type ExternalMetabasePlugin<T extends MetabasePluginOptions> =
	BaseMetabasePlugin<T>;

export function metabase<const T extends MetabasePluginOptions>(
	incomingOptions: MetabasePluginOptions & T = {} as MetabasePluginOptions & T,
): ExternalMetabasePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'metabase',
		authConfig: metabaseAuthConfig,
		schema: MetabaseSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: metabaseEndpointsNested,
		webhooks: metabaseWebhooksNested,
		endpointMeta: metabaseEndpointMeta,
		endpointSchemas: metabaseEndpointSchemas,
		webhookSchemas: metabaseWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-metabase-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchMetabaseTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveMetabaseOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: MetabaseKeyBuilderContext, source) => {
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
	} satisfies InternalMetabasePlugin;
}

export type {
	ExampleEvent,
	MetabaseWebhookOutputs,
} from './webhooks/types';

export type {
	MetabaseEndpointInputs,
	MetabaseEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
