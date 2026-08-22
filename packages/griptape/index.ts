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
import { Assistant } from './endpoints';
import type {
	GriptapeEndpointInputs,
	GriptapeEndpointOutputs,
} from './endpoints/types';
import {
	GriptapeEndpointInputSchemas,
	GriptapeEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { GriptapeSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveGriptapeOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchGriptapeTenantWebhook } from './webhooks/tenant-matcher';
import type { ExampleEvent, GriptapeWebhookOutputs } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type GriptapePluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalGriptapePlugin['hooks'];
	webhookHooks?: InternalGriptapePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof griptapeEndpointsNested>;
};

export type GriptapeContext = CorsairPluginContext<
	typeof GriptapeSchema,
	GriptapePluginOptions
>;

export type GriptapeKeyBuilderContext =
	KeyBuilderContext<GriptapePluginOptions>;

export type GriptapeBoundEndpoints = BindEndpoints<
	typeof griptapeEndpointsNested
>;

type GriptapeEndpoint<K extends keyof GriptapeEndpointOutputs> =
	CorsairEndpoint<
		GriptapeContext,
		GriptapeEndpointInputs[K],
		GriptapeEndpointOutputs[K]
	>;

export type GriptapeEndpoints = {
	assistantList: GriptapeEndpoint<'assistantList'>;
	assistantGet: GriptapeEndpoint<'assistantGet'>;
};

type GriptapeWebhook<
	K extends keyof GriptapeWebhookOutputs,
	TEvent,
> = CorsairWebhook<GriptapeContext, TEvent, GriptapeWebhookOutputs[K]>;

export type GriptapeWebhooks = {
	example: GriptapeWebhook<'example', ExampleEvent>;
};

export type GriptapeBoundWebhooks = BindWebhooks<GriptapeWebhooks>;

const griptapeEndpointsNested = {
	assistant: {
		list: Assistant.list,
		get: Assistant.get,
	},
} as const;

const griptapeWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const griptapeEndpointSchemas = {
	'assistant.list': {
		input: GriptapeEndpointInputSchemas.assistantList,
		output: GriptapeEndpointOutputSchemas.assistantList,
	},
	'assistant.get': {
		input: GriptapeEndpointInputSchemas.assistantGet,
		output: GriptapeEndpointOutputSchemas.assistantGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof griptapeEndpointsNested
>;

const griptapeWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof griptapeWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const griptapeEndpointMeta = {
	'assistant.list': {
		riskLevel: 'read',
		description: 'List assistants',
	},
	'assistant.get': {
		riskLevel: 'read',
		description: 'Get an assistant',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof griptapeEndpointsNested>;

export const griptapeAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseGriptapePlugin<T extends GriptapePluginOptions> = CorsairPlugin<
	'griptape',
	typeof GriptapeSchema,
	typeof griptapeEndpointsNested,
	typeof griptapeWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalGriptapePlugin = BaseGriptapePlugin<GriptapePluginOptions>;

export type ExternalGriptapePlugin<T extends GriptapePluginOptions> =
	BaseGriptapePlugin<T>;

export function griptape<const T extends GriptapePluginOptions>(
	incomingOptions: GriptapePluginOptions & T = {} as GriptapePluginOptions & T,
): ExternalGriptapePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'griptape',
		authConfig: griptapeAuthConfig,
		schema: GriptapeSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: griptapeEndpointsNested,
		webhooks: griptapeWebhooksNested,
		endpointMeta: griptapeEndpointMeta,
		endpointSchemas: griptapeEndpointSchemas,
		webhookSchemas: griptapeWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-griptape-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchGriptapeTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveGriptapeOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: GriptapeKeyBuilderContext, source) => {
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
	} satisfies InternalGriptapePlugin;
}

export type {
	AssistantListInput,
	AssistantListResponse,
	GriptapeEndpointInputs,
	GriptapeEndpointOutputs,
} from './endpoints/types';
export type {
	ExampleEvent,
	GriptapeWebhookOutputs,
} from './webhooks/types';
