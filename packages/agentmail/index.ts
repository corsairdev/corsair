import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
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
import { AuthMissingError } from 'corsair/core';
import { Messages } from './endpoints';
import type {
	AgentMailEndpointInputs,
	AgentMailEndpointOutputs,
} from './endpoints/types';
import {
	AgentMailEndpointInputSchemas,
	AgentMailEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AgentMailSchema } from './schema';

export type AgentMailPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalAgentMailPlugin['hooks'];
	webhookHooks?: InternalAgentMailPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof agentMailEndpointsNested>;
};

export type AgentMailContext = CorsairPluginContext<
	typeof AgentMailSchema,
	AgentMailPluginOptions
>;

export type AgentMailKeyBuilderContext =
	KeyBuilderContext<AgentMailPluginOptions>;

export type AgentMailBoundEndpoints = BindEndpoints<
	typeof agentMailEndpointsNested
>;

type AgentMailEndpoint<K extends keyof AgentMailEndpointOutputs> =
	CorsairEndpoint<
		AgentMailContext,
		AgentMailEndpointInputs[K],
		AgentMailEndpointOutputs[K]
	>;

export type AgentMailEndpoints = {
	messagesList: AgentMailEndpoint<'messagesList'>;
	messagesGet: AgentMailEndpoint<'messagesGet'>;
	messagesSend: AgentMailEndpoint<'messagesSend'>;
};

const agentMailEndpointsNested = {
	messages: {
		get: Messages.get,
		list: Messages.list,
		send: Messages.send,
	},
} as const;

const agentMailWebhooksNested = {} as const;

export type AgentMailBoundWebhooks = BindWebhooks<
	typeof agentMailWebhooksNested
>;

export const agentMailEndpointSchemas = {
	'messages.list': {
		input: AgentMailEndpointInputSchemas.messagesList,
		output: AgentMailEndpointOutputSchemas.messagesList,
	},
	'messages.get': {
		input: AgentMailEndpointInputSchemas.messagesGet,
		output: AgentMailEndpointOutputSchemas.messagesGet,
	},
	'messages.send': {
		input: AgentMailEndpointInputSchemas.messagesSend,
		output: AgentMailEndpointOutputSchemas.messagesSend,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof agentMailEndpointsNested
>;

const agentMailWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof agentMailWebhooksNested
	>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const agentMailEndpointMeta = {
	'messages.list': {
		riskLevel: 'read',
		description: 'List messages from an AgentMail inbox',
	},
	'messages.get': {
		riskLevel: 'read',
		description: 'Retrieve the complete details of an AgentMail message',
	},
	'messages.send': {
		riskLevel: 'write',
		description: 'Send an email using AgentMail',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof agentMailEndpointsNested
>;

export const agentMailAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseAgentMailPlugin<T extends AgentMailPluginOptions> =
	CorsairPlugin<
		'agentmail',
		typeof AgentMailSchema,
		typeof agentMailEndpointsNested,
		typeof agentMailWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalAgentMailPlugin =
	BaseAgentMailPlugin<AgentMailPluginOptions>;

export type ExternalAgentMailPlugin<T extends AgentMailPluginOptions> =
	BaseAgentMailPlugin<T>;

export function agentmail<const T extends AgentMailPluginOptions>(
	incomingOptions: AgentMailPluginOptions & T = {} as AgentMailPluginOptions &
		T,
): ExternalAgentMailPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'agentmail',
		schema: AgentMailSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: agentMailEndpointsNested,
		webhooks: agentMailWebhooksNested,
		endpointMeta: agentMailEndpointMeta,
		endpointSchemas: agentMailEndpointSchemas,
		webhookSchemas: agentMailWebhookSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AgentMailKeyBuilderContext, source) => {
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
				if (!res) {
					throw new AuthMissingError('agentmail', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('agentmail', 'api_key');
		},
	} satisfies InternalAgentMailPlugin;
}

export type {
	AgentMailEndpointInputs,
	AgentMailEndpointOutputs,
	AgentMailMessage,
	AgentMailMessageSummary,
	MessagesGetInput,
	MessagesGetResponse,
	MessagesListInput,
	MessagesListResponse,
	MessagesSendInput,
	MessagesSendResponse,
} from './endpoints/types';
