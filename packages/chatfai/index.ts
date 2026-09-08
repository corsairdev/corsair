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
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Characters, Conversations } from './endpoints';
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

export type ChatfaiPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalChatfaiPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof chatfaiEndpointsNested>;
};

export type ChatfaiContext = CorsairPluginContext<
	typeof ChatfaiSchema,
	ChatfaiPluginOptions,
	undefined,
	typeof chatfaiAuthConfig
>;

export type ChatfaiKeyBuilderContext = KeyBuilderContext<
	ChatfaiPluginOptions,
	typeof chatfaiAuthConfig
>;

export type ChatfaiBoundEndpoints = BindEndpoints<
	typeof chatfaiEndpointsNested
>;

type ChatfaiEndpoint<K extends keyof ChatfaiEndpointOutputs> = CorsairEndpoint<
	ChatfaiContext,
	ChatfaiEndpointInputs[K],
	ChatfaiEndpointOutputs[K]
>;

export type ChatfaiEndpoints = {
	charactersSearch: ChatfaiEndpoint<'charactersSearch'>;
	charactersGet: ChatfaiEndpoint<'charactersGet'>;
	conversationsList: ChatfaiEndpoint<'conversationsList'>;
};

const chatfaiEndpointsNested = {
	characters: {
		search: Characters.search,
		get: Characters.get,
	},
	conversations: {
		list: Conversations.list,
	},
} as const;

export const chatfaiEndpointSchemas = {
	'characters.search': {
		input: ChatfaiEndpointInputSchemas.charactersSearch,
		output: ChatfaiEndpointOutputSchemas.charactersSearch,
	},
	'characters.get': {
		input: ChatfaiEndpointInputSchemas.charactersGet,
		output: ChatfaiEndpointOutputSchemas.charactersGet,
	},
	'conversations.list': {
		input: ChatfaiEndpointInputSchemas.conversationsList,
		output: ChatfaiEndpointOutputSchemas.conversationsList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof chatfaiEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const chatfaiEndpointMeta = {
	'characters.search': {
		riskLevel: 'read',
		description:
			'Search public ChatFAI characters by name or keyword (GET /v1/characters/search)',
	},
	'characters.get': {
		riskLevel: 'read',
		description:
			'Get a public ChatFAI character by ID (GET /v1/characters/{id})',
	},
	'conversations.list': {
		riskLevel: 'read',
		description:
			'List conversations for the authenticated user (GET /v1/conversations)',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof chatfaiEndpointsNested>;

export const chatfaiAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseChatfaiPlugin<T extends ChatfaiPluginOptions> = CorsairPlugin<
	'chatfai',
	typeof ChatfaiSchema,
	typeof chatfaiEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof chatfaiAuthConfig
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
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: chatfaiEndpointsNested,
		webhooks: {},
		endpointMeta: chatfaiEndpointMeta,
		endpointSchemas: chatfaiEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ChatfaiKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('chatfai', 'api_key');
				}
				return res;
			}
			throw new AuthMissingError('chatfai', 'api_key');
		},
	} satisfies InternalChatfaiPlugin;
}

export {
	ChatfaiAPIError,
	ChatfaiRateLimitError,
	makeChatfaiRequest,
} from './client';
export type {
	CharactersGetInput,
	CharactersGetOutput,
	CharactersSearchInput,
	CharactersSearchOutput,
	ChatfaiEndpointInputs,
	ChatfaiEndpointOutputs,
	ConversationsListInput,
	ConversationsListOutput,
} from './endpoints/types';
