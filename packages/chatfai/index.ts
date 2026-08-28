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
	ChatfaiEndpointInputs,
	ChatfaiEndpointOutputs,
} from './endpoints/types';
import {
	ChatfaiEndpointInputSchemas,
	ChatfaiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ChatfaiSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveChatfaiOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchChatfaiTenantWebhook } from './webhooks/tenant-matcher';
import type { ChatfaiWebhookOutputs, ExampleEvent } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type ChatfaiPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalChatfaiPlugin['hooks'];
	webhookHooks?: InternalChatfaiPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof chatfaiEndpointsNested>;
};

export type ChatfaiContext = CorsairPluginContext<
	typeof ChatfaiSchema,
	ChatfaiPluginOptions
>;

export type ChatfaiKeyBuilderContext = KeyBuilderContext<ChatfaiPluginOptions>;

export type ChatfaiBoundEndpoints = BindEndpoints<
	typeof chatfaiEndpointsNested
>;

type ChatfaiEndpoint<K extends keyof ChatfaiEndpointOutputs> = CorsairEndpoint<
	ChatfaiContext,
	ChatfaiEndpointInputs[K],
	ChatfaiEndpointOutputs[K]
>;

export type ChatfaiEndpoints = {
	exampleGet: ChatfaiEndpoint<'exampleGet'>;
};

type ChatfaiWebhook<
	K extends keyof ChatfaiWebhookOutputs,
	TEvent,
> = CorsairWebhook<ChatfaiContext, TEvent, ChatfaiWebhookOutputs[K]>;

export type ChatfaiWebhooks = {
	example: ChatfaiWebhook<'example', ExampleEvent>;
};

export type ChatfaiBoundWebhooks = BindWebhooks<ChatfaiWebhooks>;

const chatfaiEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

const chatfaiWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const chatfaiEndpointSchemas = {
	'example.get': {
		input: ChatfaiEndpointInputSchemas.exampleGet,
		output: ChatfaiEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof chatfaiEndpointsNested
>;

const chatfaiWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof chatfaiWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const chatfaiEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof chatfaiEndpointsNested>;

export const chatfaiAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseChatfaiPlugin<T extends ChatfaiPluginOptions> = CorsairPlugin<
	'chatfai',
	typeof ChatfaiSchema,
	typeof chatfaiEndpointsNested,
	typeof chatfaiWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalChatfaiPlugin = BaseChatfaiPlugin<ChatfaiPluginOptions>;

export type ExternalChatfaiPlugin<T extends ChatfaiPluginOptions> =
	BaseChatfaiPlugin<T>;

export function chatfai<const T extends ChatfaiPluginOptions>(
	incomingOptions: ChatfaiPluginOptions & T = {} as ChatfaiPluginOptions & T,
): ExternalChatfaiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'chatfai',
		authConfig: chatfaiAuthConfig,
		schema: ChatfaiSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: chatfaiEndpointsNested,
		webhooks: chatfaiWebhooksNested,
		endpointMeta: chatfaiEndpointMeta,
		endpointSchemas: chatfaiEndpointSchemas,
		webhookSchemas: chatfaiWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-chatfai-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchChatfaiTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveChatfaiOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ChatfaiKeyBuilderContext, source) => {
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
	} satisfies InternalChatfaiPlugin;
}

export type {
	ChatfaiEndpointInputs,
	ChatfaiEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
export type {
	ChatfaiWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
