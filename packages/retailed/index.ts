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
	RetailedEndpointInputs,
	RetailedEndpointOutputs,
} from './endpoints/types';
import {
	RetailedEndpointInputSchemas,
	RetailedEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { RetailedSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveRetailedOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchRetailedTenantWebhook } from './webhooks/tenant-matcher';
import type { ExampleEvent, RetailedWebhookOutputs } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type RetailedPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalRetailedPlugin['hooks'];
	webhookHooks?: InternalRetailedPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof retailedEndpointsNested>;
};

export type RetailedContext = CorsairPluginContext<
	typeof RetailedSchema,
	RetailedPluginOptions
>;

export type RetailedKeyBuilderContext =
	KeyBuilderContext<RetailedPluginOptions>;

export type RetailedBoundEndpoints = BindEndpoints<
	typeof retailedEndpointsNested
>;

type RetailedEndpoint<K extends keyof RetailedEndpointOutputs> =
	CorsairEndpoint<
		RetailedContext,
		RetailedEndpointInputs[K],
		RetailedEndpointOutputs[K]
	>;

export type RetailedEndpoints = {
	exampleGet: RetailedEndpoint<'exampleGet'>;
};

type RetailedWebhook<
	K extends keyof RetailedWebhookOutputs,
	TEvent,
> = CorsairWebhook<RetailedContext, TEvent, RetailedWebhookOutputs[K]>;

export type RetailedWebhooks = {
	example: RetailedWebhook<'example', ExampleEvent>;
};

export type RetailedBoundWebhooks = BindWebhooks<RetailedWebhooks>;

const retailedEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const retailedWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const retailedEndpointSchemas = {
	'example.get': {
		input: RetailedEndpointInputSchemas.exampleGet,
		output: RetailedEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof retailedEndpointsNested
>;

const retailedWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof retailedWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const retailedEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof retailedEndpointsNested>;

export const retailedAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseRetailedPlugin<T extends RetailedPluginOptions> = CorsairPlugin<
	'retailed',
	typeof RetailedSchema,
	typeof retailedEndpointsNested,
	typeof retailedWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalRetailedPlugin = BaseRetailedPlugin<RetailedPluginOptions>;

export type ExternalRetailedPlugin<T extends RetailedPluginOptions> =
	BaseRetailedPlugin<T>;

export function retailed<const T extends RetailedPluginOptions>(
	incomingOptions: RetailedPluginOptions & T = {} as RetailedPluginOptions & T,
): ExternalRetailedPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'retailed',
		authConfig: retailedAuthConfig,
		schema: RetailedSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: retailedEndpointsNested,
		webhooks: retailedWebhooksNested,
		endpointMeta: retailedEndpointMeta,
		endpointSchemas: retailedEndpointSchemas,
		webhookSchemas: retailedWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-retailed-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchRetailedTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveRetailedOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: RetailedKeyBuilderContext, source) => {
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
	} satisfies InternalRetailedPlugin;
}

export type {
	ExampleGetInput,
	ExampleGetResponse,
	RetailedEndpointInputs,
	RetailedEndpointOutputs,
} from './endpoints/types';
export type {
	ExampleEvent,
	RetailedWebhookOutputs,
} from './webhooks/types';
