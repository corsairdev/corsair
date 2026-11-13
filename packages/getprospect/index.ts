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
import type { GetProspectEndpointInputs, GetProspectEndpointOutputs } from './endpoints/types';
import { GetProspectEndpointInputSchemas, GetProspectEndpointOutputSchemas } from './endpoints/types';
import type {
	GetProspectWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { Example } from './endpoints';
import { GetProspectSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchGetProspectTenantWebhook } from './webhooks/tenant-matcher';
import { resolveGetProspectOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type GetProspectPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalGetProspectPlugin['hooks'];
	webhookHooks?: InternalGetProspectPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof getProspectEndpointsNested>;
};

export type GetProspectContext = CorsairPluginContext<
	typeof GetProspectSchema,
	GetProspectPluginOptions
>;

export type GetProspectKeyBuilderContext = KeyBuilderContext<GetProspectPluginOptions>;

export type GetProspectBoundEndpoints = BindEndpoints<typeof getProspectEndpointsNested>;

type GetProspectEndpoint<
	K extends keyof GetProspectEndpointOutputs,
> = CorsairEndpoint<
	GetProspectContext,
	GetProspectEndpointInputs[K],
	GetProspectEndpointOutputs[K]
>;

export type GetProspectEndpoints = {
	exampleGet: GetProspectEndpoint<'exampleGet'>;
};

type GetProspectWebhook<
	K extends keyof GetProspectWebhookOutputs,
	TEvent,
> = CorsairWebhook<GetProspectContext, TEvent, GetProspectWebhookOutputs[K]>;

export type GetProspectWebhooks = {
	example: GetProspectWebhook<'example', ExampleEvent>;
};

export type GetProspectBoundWebhooks = BindWebhooks<GetProspectWebhooks>;

const getProspectEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const getProspectWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const getProspectEndpointSchemas = {
	'example.get': {
		input: GetProspectEndpointInputSchemas.exampleGet,
		output: GetProspectEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof getProspectEndpointsNested>;

const getProspectWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof getProspectWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const getProspectEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof getProspectEndpointsNested>;

export const getProspectAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseGetProspectPlugin<T extends GetProspectPluginOptions> = CorsairPlugin<
	'getprospect',
	typeof GetProspectSchema,
	typeof getProspectEndpointsNested,
	typeof getProspectWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalGetProspectPlugin = BaseGetProspectPlugin<GetProspectPluginOptions>;

export type ExternalGetProspectPlugin<T extends GetProspectPluginOptions> =
	BaseGetProspectPlugin<T>;

export function getprospect<const T extends GetProspectPluginOptions>(
	incomingOptions: GetProspectPluginOptions & T = {} as GetProspectPluginOptions & T,
): ExternalGetProspectPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'getprospect',
		authConfig: getProspectAuthConfig,
		schema: GetProspectSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: getProspectEndpointsNested,
		webhooks: getProspectWebhooksNested,
		endpointMeta: getProspectEndpointMeta,
		endpointSchemas: getProspectEndpointSchemas,
		webhookSchemas: getProspectWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-getprospect-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchGetProspectTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveGetProspectOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: GetProspectKeyBuilderContext, source) => {
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
	} satisfies InternalGetProspectPlugin;
}

export type {
	ExampleEvent,
	GetProspectWebhookOutputs,
} from './webhooks/types';

export type {
	GetProspectEndpointInputs,
	GetProspectEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
