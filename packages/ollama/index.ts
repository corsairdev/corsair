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
import { Chat, Models, OpenAi } from './endpoints';
import type {
	OllamaEndpointInputs,
	OllamaEndpointOutputs,
} from './endpoints/types';
import {
	OllamaEndpointInputSchemas,
	OllamaEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { OllamaSchema } from './schema';
import { resolveOllamaOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchOllamaTenantWebhook } from './webhooks/tenant-matcher';
import type { OllamaWebhookOutputs } from './webhooks/types';

export type OllamaPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	host?: string;
	baseUrl?: string;
	webhookSecret?: string;
	hooks?: InternalOllamaPlugin['hooks'];
	webhookHooks?: InternalOllamaPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof ollamaEndpointsNested>;
};

export type OllamaContext = CorsairPluginContext<
	typeof OllamaSchema,
	OllamaPluginOptions
>;

export type OllamaKeyBuilderContext = KeyBuilderContext<OllamaPluginOptions>;

export type OllamaBoundEndpoints = BindEndpoints<typeof ollamaEndpointsNested>;

type OllamaEndpoint<K extends keyof OllamaEndpointOutputs> = CorsairEndpoint<
	OllamaContext,
	OllamaEndpointInputs[K],
	OllamaEndpointOutputs[K]
>;

export type OllamaEndpoints = {
	chat: OllamaEndpoint<'chat'>;
	generate: OllamaEndpoint<'generate'>;
	version: OllamaEndpoint<'version'>;
	listModels: OllamaEndpoint<'listModels'>;
	showModel: OllamaEndpoint<'showModel'>;
	listOpenAiModels: OllamaEndpoint<'listOpenAiModels'>;
	createOpenAiChatCompletion: OllamaEndpoint<'createOpenAiChatCompletion'>;
	createOpenAiCompletion: OllamaEndpoint<'createOpenAiCompletion'>;
};

type OllamaWebhook<
	K extends keyof OllamaWebhookOutputs,
	TEvent,
> = CorsairWebhook<OllamaContext, TEvent, OllamaWebhookOutputs[K]>;

export type OllamaWebhooks = {};

export type OllamaBoundWebhooks = BindWebhooks<OllamaWebhooks>;

const ollamaEndpointsNested = {
	chat: {
		chat: Chat.chat,
		generate: Chat.generate,
	},
	models: {
		version: Models.version,
		listModels: Models.listModels,
		showModel: Models.showModel,
	},
	openai: {
		listOpenAiModels: OpenAi.listOpenAiModels,
		createOpenAiChatCompletion: OpenAi.createOpenAiChatCompletion,
		createOpenAiCompletion: OpenAi.createOpenAiCompletion,
	},
} as const;

const ollamaWebhooksNested = {} as const;

export const ollamaEndpointSchemas = {
	'chat.chat': {
		input: OllamaEndpointInputSchemas.chat,
		output: OllamaEndpointOutputSchemas.chat,
	},
	'chat.generate': {
		input: OllamaEndpointInputSchemas.generate,
		output: OllamaEndpointOutputSchemas.generate,
	},
	'models.version': {
		input: OllamaEndpointInputSchemas.version,
		output: OllamaEndpointOutputSchemas.version,
	},
	'models.listModels': {
		input: OllamaEndpointInputSchemas.listModels,
		output: OllamaEndpointOutputSchemas.listModels,
	},
	'models.showModel': {
		input: OllamaEndpointInputSchemas.showModel,
		output: OllamaEndpointOutputSchemas.showModel,
	},
	'openai.listOpenAiModels': {
		input: OllamaEndpointInputSchemas.listOpenAiModels,
		output: OllamaEndpointOutputSchemas.listOpenAiModels,
	},
	'openai.createOpenAiChatCompletion': {
		input: OllamaEndpointInputSchemas.createOpenAiChatCompletion,
		output: OllamaEndpointOutputSchemas.createOpenAiChatCompletion,
	},
	'openai.createOpenAiCompletion': {
		input: OllamaEndpointInputSchemas.createOpenAiCompletion,
		output: OllamaEndpointOutputSchemas.createOpenAiCompletion,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof ollamaEndpointsNested
>;

const ollamaWebhookSchemas = {} as const satisfies RequiredPluginWebhookSchemas<
	typeof ollamaWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const ollamaEndpointMeta = {
	'chat.chat': {
		riskLevel: 'write',
		description:
			'Tool to send a chat message with conversation history to Ollama. Use when you need to have a multi-turn conversation with an LLM model.',
	},
	'chat.generate': {
		riskLevel: 'write',
		description:
			'Tool to generate text responses from Ollama models with optional raw mode. Use raw=true to bypass prompt templating when you need full control over the prompt for debugging or custom processing. Note that raw mode will not return a context.',
	},
	'models.version': {
		riskLevel: 'read',
		description:
			'Tool to get the version of Ollama running locally. Use to check which version of Ollama is currently installed.',
	},
	'models.listModels': {
		riskLevel: 'read',
		description:
			'Tool to list all available Ollama models and their details. Use when you need to fetch installed models with metadata including name, size, last modified timestamp, digest, and format information.',
	},
	'models.showModel': {
		riskLevel: 'read',
		description:
			'Tool to show comprehensive information about an Ollama model. Use when you need to retrieve model details, parameters, template, license, or system prompt.',
	},
	'openai.listOpenAiModels': {
		riskLevel: 'read',
		description:
			"Tool to list available models using OpenAI-compatible API format. Use when you need to retrieve locally available Ollama models with metadata following OpenAI's model list format.",
	},
	'openai.createOpenAiChatCompletion': {
		riskLevel: 'write',
		description:
			'Tool to create OpenAI-compatible chat completions using Ollama models. Use when you need conversational AI responses with OpenAI API format compatibility.',
	},
	'openai.createOpenAiCompletion': {
		riskLevel: 'write',
		description:
			'Tool to create OpenAI-compatible text completions using Ollama models. Use when you need text generation with OpenAI API format compatibility beyond chat-based interactions.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof ollamaEndpointsNested>;

export const ollamaAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseOllamaPlugin<T extends OllamaPluginOptions> = CorsairPlugin<
	'ollama',
	typeof OllamaSchema,
	typeof ollamaEndpointsNested,
	typeof ollamaWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalOllamaPlugin = BaseOllamaPlugin<OllamaPluginOptions>;

export type ExternalOllamaPlugin<T extends OllamaPluginOptions> =
	BaseOllamaPlugin<T>;

export function ollama<const T extends OllamaPluginOptions>(
	incomingOptions: OllamaPluginOptions & T = {} as OllamaPluginOptions & T,
): ExternalOllamaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'ollama',
		authConfig: ollamaAuthConfig,
		schema: OllamaSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: ollamaEndpointsNested,
		webhooks: ollamaWebhooksNested,
		endpointMeta: ollamaEndpointMeta,
		endpointSchemas: ollamaEndpointSchemas,
		webhookSchemas: ollamaWebhookSchemas,
		pluginWebhookMatcher: () => false,
		pluginTenantWebhookMatcher: matchOllamaTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveOllamaOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: OllamaKeyBuilderContext, source) => {
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
	} satisfies InternalOllamaPlugin;
}

export type {
	ChatInput,
	ChatResponse,
	CreateOpenAiChatCompletionInput,
	CreateOpenAiChatCompletionResponse,
	CreateOpenAiCompletionInput,
	CreateOpenAiCompletionResponse,
	GenerateInput,
	GenerateResponse,
	ListModelsInput,
	ListModelsResponse,
	ListOpenAiModelsInput,
	ListOpenAiModelsResponse,
	OllamaEndpointInputs,
	OllamaEndpointOutputs,
	ShowModelInput,
	ShowModelResponse,
	VersionInput,
	VersionResponse,
} from './endpoints/types';
export type { OllamaWebhookOutputs } from './webhooks/types';
