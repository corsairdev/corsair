import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { Chat } from './endpoints';
import type {
	PerplexityAiEndpointInputs,
	PerplexityAiEndpointOutputs,
} from './endpoints/types';
import {
	PerplexityAiEndpointInputSchemas,
	PerplexityAiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { PerplexityAiSchema } from './schema';

export type PerplexityAiPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalPerplexityAiPlugin['hooks'];
	webhookHooks?: InternalPerplexityAiPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof perplexityAiEndpointsNested>;
};

export type PerplexityAiContext = CorsairPluginContext<
	typeof PerplexityAiSchema,
	PerplexityAiPluginOptions
>;

export type PerplexityAiKeyBuilderContext =
	KeyBuilderContext<PerplexityAiPluginOptions>;

export type PerplexityAiBoundEndpoints = BindEndpoints<
	typeof perplexityAiEndpointsNested
>;

type PerplexityAiEndpoint<K extends keyof PerplexityAiEndpointOutputs> =
	CorsairEndpoint<
		PerplexityAiContext,
		PerplexityAiEndpointInputs[K],
		PerplexityAiEndpointOutputs[K]
	>;

export type PerplexityAiEndpoints = {
	chatCompletions: PerplexityAiEndpoint<'chatCompletions'>;
};

export type PerplexityAiWebhooks = Record<string, never>;

export type PerplexityAiBoundWebhooks = Record<string, never>;

const perplexityAiEndpointsNested = {
	chat: {
		completions: Chat.completions,
	},
} as const;

const perplexityAiWebhooksNested = {} as const;

export const perplexityAiEndpointSchemas = {
	'chat.completions': {
		input: PerplexityAiEndpointInputSchemas.chatCompletions,
		output: PerplexityAiEndpointOutputSchemas.chatCompletions,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof perplexityAiEndpointsNested
>;

const perplexityAiWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof perplexityAiWebhooksNested
	>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const perplexityAiEndpointMeta = {
	'chat.completions': {
		riskLevel: 'read',
		description: 'Create a chat completion',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof perplexityAiEndpointsNested
>;

export const perplexityAiAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BasePerplexityAiPlugin<T extends PerplexityAiPluginOptions> =
	CorsairPlugin<
		'perplexityai',
		typeof PerplexityAiSchema,
		typeof perplexityAiEndpointsNested,
		typeof perplexityAiWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalPerplexityAiPlugin =
	BasePerplexityAiPlugin<PerplexityAiPluginOptions>;

export type ExternalPerplexityAiPlugin<T extends PerplexityAiPluginOptions> =
	BasePerplexityAiPlugin<T>;

export function perplexityai<const T extends PerplexityAiPluginOptions>(
	incomingOptions: PerplexityAiPluginOptions &
		T = {} as PerplexityAiPluginOptions & T,
): ExternalPerplexityAiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'perplexityai',
		authConfig: perplexityAiAuthConfig,
		schema: PerplexityAiSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: perplexityAiEndpointsNested,
		webhooks: perplexityAiWebhooksNested,
		endpointMeta: perplexityAiEndpointMeta,
		endpointSchemas: perplexityAiEndpointSchemas,
		webhookSchemas: perplexityAiWebhookSchemas,
		pluginWebhookMatcher: () => false,
		pluginTenantWebhookMatcher: () => null,
		oauthWebhookTenantLinkResolver: () => null,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: PerplexityAiKeyBuilderContext, source) => {
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

			return '';
		},
	} satisfies InternalPerplexityAiPlugin;
}

export type {
	ChatCompletionsInput,
	ChatCompletionsResponse,
	PerplexityAiEndpointInputs,
	PerplexityAiEndpointOutputs,
} from './endpoints/types';
