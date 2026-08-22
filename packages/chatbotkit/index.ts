import type {
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
import { Bots } from './endpoints';
import type {
	ChatbotkitEndpointInputs,
	ChatbotkitEndpointOutputs,
} from './endpoints/types';
import {
	ChatbotkitEndpointInputSchemas,
	ChatbotkitEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ChatbotkitSchema } from './schema';

export type ChatbotkitPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalChatbotkitPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof chatbotkitEndpointsNested>;
};

export type ChatbotkitContext = CorsairPluginContext<
	typeof ChatbotkitSchema,
	ChatbotkitPluginOptions
>;

export type ChatbotkitKeyBuilderContext =
	KeyBuilderContext<ChatbotkitPluginOptions>;

export type ChatbotkitBoundEndpoints = BindEndpoints<
	typeof chatbotkitEndpointsNested
>;

type ChatbotkitEndpoint<K extends keyof ChatbotkitEndpointOutputs> =
	CorsairEndpoint<
		ChatbotkitContext,
		ChatbotkitEndpointInputs[K],
		ChatbotkitEndpointOutputs[K]
	>;

export type ChatbotkitEndpoints = {
	botsList: ChatbotkitEndpoint<'botsList'>;
	botsGet: ChatbotkitEndpoint<'botsGet'>;
};

const chatbotkitEndpointsNested = {
	bots: {
		list: Bots.list,
		get: Bots.get,
	},
} as const;

export const chatbotkitEndpointSchemas = {
	'bots.list': {
		input: ChatbotkitEndpointInputSchemas.botsList,
		output: ChatbotkitEndpointOutputSchemas.botsList,
	},
	'bots.get': {
		input: ChatbotkitEndpointInputSchemas.botsGet,
		output: ChatbotkitEndpointOutputSchemas.botsGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof chatbotkitEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const chatbotkitEndpointMeta = {
	'bots.list': {
		riskLevel: 'read',
		description: 'List bots on the ChatBotKit account, cursor-paginated',
	},
	'bots.get': {
		riskLevel: 'read',
		description: 'Fetch a single bot by ID or alias',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof chatbotkitEndpointsNested
>;

export const chatbotkitAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseChatbotkitPlugin<T extends ChatbotkitPluginOptions> =
	CorsairPlugin<
		'chatbotkit',
		typeof ChatbotkitSchema,
		typeof chatbotkitEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalChatbotkitPlugin =
	BaseChatbotkitPlugin<ChatbotkitPluginOptions>;

export type ExternalChatbotkitPlugin<T extends ChatbotkitPluginOptions> =
	BaseChatbotkitPlugin<T>;

export function chatbotkit<const T extends ChatbotkitPluginOptions>(
	incomingOptions: ChatbotkitPluginOptions & T = {} as ChatbotkitPluginOptions &
		T,
): ExternalChatbotkitPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'chatbotkit',
		authConfig: chatbotkitAuthConfig,
		schema: ChatbotkitSchema,
		options: options,
		hooks: options.hooks,
		endpoints: chatbotkitEndpointsNested,
		webhooks: {},
		endpointMeta: chatbotkitEndpointMeta,
		endpointSchemas: chatbotkitEndpointSchemas,
		webhookSchemas: {},
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ChatbotkitKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys?.get_api_key();
				if (!res) {
					throw new AuthMissingError('chatbotkit', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('chatbotkit', 'api_key');
		},
	} satisfies InternalChatbotkitPlugin;
}

export type {
	Bot,
	BotsGetInput,
	BotsGetResponse,
	BotsListInput,
	BotsListResponse,
	ChatbotkitEndpointInputs,
	ChatbotkitEndpointOutputs,
} from './endpoints/types';

export type {
	ChatbotkitBlueprint,
	ChatbotkitBot,
	ChatbotkitDataset,
	ChatbotkitSecret,
	ChatbotkitSkillset,
} from './schema/database';
