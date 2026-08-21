import type {
	AuthTypes,
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
import { Example } from './endpoints';
import type {
	UnioneEndpointInputs,
	UnioneEndpointOutputs,
} from './endpoints/types';
import {
	UnioneEndpointInputSchemas,
	UnioneEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { UnioneSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveUnioneOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchUnioneTenantWebhook } from './webhooks/tenant-matcher';
import type { ExampleEvent, UnioneWebhookOutputs } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type UnionePluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalUnionePlugin['hooks'];
	webhookHooks?: InternalUnionePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof unioneEndpointsNested>;
};

export type UnioneContext = CorsairPluginContext<
	typeof UnioneSchema,
	UnionePluginOptions
>;

export type UnioneKeyBuilderContext = KeyBuilderContext<UnionePluginOptions>;

export type UnioneBoundEndpoints = BindEndpoints<typeof unioneEndpointsNested>;

type UnioneEndpoint<K extends keyof UnioneEndpointOutputs> = CorsairEndpoint<
	UnioneContext,
	UnioneEndpointInputs[K],
	UnioneEndpointOutputs[K]
>;

export type UnioneEndpoints = {
	exampleGet: UnioneEndpoint<'exampleGet'>;
};

type UnioneWebhook<
	K extends keyof UnioneWebhookOutputs,
	TEvent,
> = CorsairWebhook<UnioneContext, TEvent, UnioneWebhookOutputs[K]>;

export type UnioneWebhooks = {
	example: UnioneWebhook<'example', ExampleEvent>;
};

export type UnioneBoundWebhooks = BindWebhooks<UnioneWebhooks>;

const unioneEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const unioneWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const unioneEndpointSchemas = {
	'example.get': {
		input: UnioneEndpointInputSchemas.exampleGet,
		output: UnioneEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof unioneEndpointsNested
>;

const unioneWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof unioneWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const unioneEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof unioneEndpointsNested>;

export const unioneAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseUnionePlugin<T extends UnionePluginOptions> = CorsairPlugin<
	'unione',
	typeof UnioneSchema,
	typeof unioneEndpointsNested,
	typeof unioneWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalUnionePlugin = BaseUnionePlugin<UnionePluginOptions>;

export type ExternalUnionePlugin<T extends UnionePluginOptions> =
	BaseUnionePlugin<T>;

export function unione<const T extends UnionePluginOptions>(
	incomingOptions: UnionePluginOptions & T = {} as UnionePluginOptions & T,
): ExternalUnionePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'unione',
		authConfig: unioneAuthConfig,
		schema: UnioneSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: unioneEndpointsNested,
		webhooks: unioneWebhooksNested,
		endpointMeta: unioneEndpointMeta,
		endpointSchemas: unioneEndpointSchemas,
		webhookSchemas: unioneWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-unione-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchUnioneTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveUnioneOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: UnioneKeyBuilderContext, source) => {
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
	} satisfies InternalUnionePlugin;
}

export type {
	ExampleGetInput,
	ExampleGetResponse,
	UnioneEndpointInputs,
	UnioneEndpointOutputs,
} from './endpoints/types';
export type {
	ExampleEvent,
	UnioneWebhookOutputs,
} from './webhooks/types';
