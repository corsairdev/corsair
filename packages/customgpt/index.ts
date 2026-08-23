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
import { CustomGPT } from './endpoints';
import type {
	CustomGPTEndpointInputs,
	CustomGPTEndpointOutputs,
} from './endpoints/types';
import {
	CustomGPTEndpointInputSchemas,
	CustomGPTEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CustomGPTSchema } from './schema';

export type CustomGPTPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalCustomGPTPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof customGPTEndpointsNested>;
};

export type CustomGPTContext = CorsairPluginContext<
	typeof CustomGPTSchema,
	CustomGPTPluginOptions
>;

export type CustomGPTKeyBuilderContext =
	KeyBuilderContext<CustomGPTPluginOptions>;

export type CustomGPTBoundEndpoints = BindEndpoints<
	typeof customGPTEndpointsNested
>;

type CustomGPTEndpoint<K extends keyof CustomGPTEndpointOutputs> =
	CorsairEndpoint<
		CustomGPTContext,
		CustomGPTEndpointInputs[K],
		CustomGPTEndpointOutputs[K]
	>;

export type CustomGPTEndpoints = {
	listProjects: CustomGPTEndpoint<'listProjects'>;
	createConversation: CustomGPTEndpoint<'createConversation'>;
	sendMessage: CustomGPTEndpoint<'sendMessage'>;
	getMessages: CustomGPTEndpoint<'getMessages'>;
};

const customGPTEndpointsNested = {
	projects: {
		list: CustomGPT.listProjects,
	},
	conversations: {
		create: CustomGPT.createConversation,
	},
	messages: {
		send: CustomGPT.sendMessage,
		get: CustomGPT.getMessages,
	},
} as const;

const customGPTWebhooksNested = {} as const;

export const customGPTEndpointSchemas = {
	'projects.list': {
		input: CustomGPTEndpointInputSchemas.listProjects,
		output: CustomGPTEndpointOutputSchemas.listProjects,
	},
	'conversations.create': {
		input: CustomGPTEndpointInputSchemas.createConversation,
		output: CustomGPTEndpointOutputSchemas.createConversation,
	},
	'messages.send': {
		input: CustomGPTEndpointInputSchemas.sendMessage,
		output: CustomGPTEndpointOutputSchemas.sendMessage,
	},
	'messages.get': {
		input: CustomGPTEndpointInputSchemas.getMessages,
		output: CustomGPTEndpointOutputSchemas.getMessages,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof customGPTEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const customGPTEndpointMeta = {
	'projects.list': {
		riskLevel: 'read',
		description: 'List CustomGPT projects (agents) with pagination support',
	},
	'conversations.create': {
		riskLevel: 'write',
		description: 'Create a new conversation session for a CustomGPT project',
	},
	'messages.send': {
		riskLevel: 'write',
		description:
			'Send a message prompt to a CustomGPT conversation session and get response',
	},
	'messages.get': {
		riskLevel: 'read',
		description:
			'Retrieve paginated history of messages in a CustomGPT conversation session',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof customGPTEndpointsNested
>;

export const customGPTAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseCustomGPTPlugin<T extends CustomGPTPluginOptions> =
	CorsairPlugin<
		'customgpt',
		typeof CustomGPTSchema,
		typeof customGPTEndpointsNested,
		typeof customGPTWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalCustomGPTPlugin =
	BaseCustomGPTPlugin<CustomGPTPluginOptions>;

export type ExternalCustomGPTPlugin<T extends CustomGPTPluginOptions> =
	BaseCustomGPTPlugin<T>;

export function customgpt<const T extends CustomGPTPluginOptions>(
	incomingOptions: CustomGPTPluginOptions & T = {} as CustomGPTPluginOptions &
		T,
): ExternalCustomGPTPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'customgpt',
		authConfig: customGPTAuthConfig,
		schema: CustomGPTSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: customGPTEndpointsNested,
		webhooks: customGPTWebhooksNested,
		endpointMeta: customGPTEndpointMeta,
		endpointSchemas: customGPTEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: (() => {
			const { DEFAULT: defaultHandler, ...specificDefaults } = errorHandlers;
			return {
				...specificDefaults,
				...(options.errorHandlers || {}),
				DEFAULT: options.errorHandlers?.DEFAULT || defaultHandler,
			};
		})(),
		keyBuilder: async (ctx: CustomGPTKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('customgpt', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('customgpt', 'api_key');
		},
	} satisfies InternalCustomGPTPlugin;
}

export type {
	CreateConversationResponse,
	CustomGPTEndpointInputs,
	CustomGPTEndpointOutputs,
	GetMessagesResponse,
	ListProjectsResponse,
	SendMessageResponse,
} from './endpoints/types';
