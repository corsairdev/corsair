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
import {
	Analytics,
	Bots,
	Conversations,
	Deployments,
	Messages,
} from './endpoints';
import type {
	BotbabaEndpointInputs,
	BotbabaEndpointOutputs,
} from './endpoints/types';
import {
	BotbabaEndpointInputSchemas,
	BotbabaEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BotbabaSchema } from './schema';
import { resolveBotbabaOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchBotbabaTenantWebhook } from './webhooks/tenant-matcher';

export type BotbabaPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalBotbabaPlugin['hooks'];
	webhookHooks?: InternalBotbabaPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof botbabaEndpointsNested>;
};

export const botbabaAuthConfig = {
	api_key: {
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BotbabaContext = CorsairPluginContext<
	typeof BotbabaSchema,
	BotbabaPluginOptions,
	undefined,
	typeof botbabaAuthConfig
>;

export type BotbabaKeyBuilderContext =
	KeyBuilderContext<BotbabaPluginOptions>;

export type BotbabaBoundEndpoints = BindEndpoints<
	typeof botbabaEndpointsNested
>;

type BotbabaEndpoint<K extends keyof BotbabaEndpointOutputs> =
	CorsairEndpoint<
		BotbabaContext,
		BotbabaEndpointInputs[K],
		BotbabaEndpointOutputs[K]
	>;

export type BotbabaEndpoints = {
	botsCreate: BotbabaEndpoint<'botsCreate'>;
	botsGet: BotbabaEndpoint<'botsGet'>;
	botsList: BotbabaEndpoint<'botsList'>;
	botsUpdate: BotbabaEndpoint<'botsUpdate'>;
	botsDelete: BotbabaEndpoint<'botsDelete'>;
	conversationsList: BotbabaEndpoint<'conversationsList'>;
	conversationsGet: BotbabaEndpoint<'conversationsGet'>;
	messagesSend: BotbabaEndpoint<'messagesSend'>;
	messagesList: BotbabaEndpoint<'messagesList'>;
	deploymentsDeploy: BotbabaEndpoint<'deploymentsDeploy'>;
	deploymentsGetStatus: BotbabaEndpoint<'deploymentsGetStatus'>;
	analyticsGetSummary: BotbabaEndpoint<'analyticsGetSummary'>;
};

export type BotbabaWebhooks = Record<string, never>;

export type BotbabaBoundWebhooks = BindWebhooks<BotbabaWebhooks>;

const botbabaEndpointsNested = {
	bots: {
		create: Bots.create,
		get: Bots.get,
		list: Bots.list,
		update: Bots.update,
		delete: Bots.delete,
	},
	conversations: {
		list: Conversations.list,
		get: Conversations.get,
	},
	messages: {
		send: Messages.send,
		list: Messages.list,
	},
	deployments: {
		deploy: Deployments.deploy,
		getStatus: Deployments.getStatus,
	},
	analytics: {
		getSummary: Analytics.getSummary,
	},
} as const;

/**
 * Botbaba has no known webhook/trigger surface — every operation covered
 * here is a direct REST call, not a webhook subscription.
 */
const botbabaWebhooksNested = {} as const;

export const botbabaEndpointSchemas = {
	'bots.create': {
		input: BotbabaEndpointInputSchemas.botsCreate,
		output: BotbabaEndpointOutputSchemas.botsCreate,
	},
	'bots.get': {
		input: BotbabaEndpointInputSchemas.botsGet,
		output: BotbabaEndpointOutputSchemas.botsGet,
	},
	'bots.list': {
		input: BotbabaEndpointInputSchemas.botsList,
		output: BotbabaEndpointOutputSchemas.botsList,
	},
	'bots.update': {
		input: BotbabaEndpointInputSchemas.botsUpdate,
		output: BotbabaEndpointOutputSchemas.botsUpdate,
	},
	'bots.delete': {
		input: BotbabaEndpointInputSchemas.botsDelete,
		output: BotbabaEndpointOutputSchemas.botsDelete,
	},
	'conversations.list': {
		input: BotbabaEndpointInputSchemas.conversationsList,
		output: BotbabaEndpointOutputSchemas.conversationsList,
	},
	'conversations.get': {
		input: BotbabaEndpointInputSchemas.conversationsGet,
		output: BotbabaEndpointOutputSchemas.conversationsGet,
	},
	'messages.send': {
		input: BotbabaEndpointInputSchemas.messagesSend,
		output: BotbabaEndpointOutputSchemas.messagesSend,
	},
	'messages.list': {
		input: BotbabaEndpointInputSchemas.messagesList,
		output: BotbabaEndpointOutputSchemas.messagesList,
	},
	'deployments.deploy': {
		input: BotbabaEndpointInputSchemas.deploymentsDeploy,
		output: BotbabaEndpointOutputSchemas.deploymentsDeploy,
	},
	'deployments.getStatus': {
		input: BotbabaEndpointInputSchemas.deploymentsGetStatus,
		output: BotbabaEndpointOutputSchemas.deploymentsGetStatus,
	},
	'analytics.getSummary': {
		input: BotbabaEndpointInputSchemas.analyticsGetSummary,
		output: BotbabaEndpointOutputSchemas.analyticsGetSummary,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof botbabaEndpointsNested
>;

const botbabaWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof botbabaWebhooksNested
	>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const botbabaEndpointMeta = {
	'bots.create': {
		riskLevel: 'write',
		description: 'Create a new chatbot',
	},
	'bots.get': {
		riskLevel: 'read',
		description: 'Get a chatbot by id',
	},
	'bots.list': {
		riskLevel: 'read',
		description: 'List all chatbots',
	},
	'bots.update': {
		riskLevel: 'write',
		description: 'Update a chatbot\'s settings',
	},
	'bots.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a chatbot [DESTRUCTIVE]',
	},
	'conversations.list': {
		riskLevel: 'read',
		description: 'List conversations for a bot',
	},
	'conversations.get': {
		riskLevel: 'read',
		description: 'Get a single conversation by id',
	},
	'messages.send': {
		riskLevel: 'write',
		description: 'Send a message into a conversation',
	},
	'messages.list': {
		riskLevel: 'read',
		description: 'List messages in a conversation',
	},
	'deployments.deploy': {
		riskLevel: 'write',
		description: 'Deploy a bot to a channel (e.g. WhatsApp)',
	},
	'deployments.getStatus': {
		riskLevel: 'read',
		description: 'Get deployment status for a bot',
	},
	'analytics.getSummary': {
		riskLevel: 'read',
		description: 'Fetch analytics summary for a bot',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof botbabaEndpointsNested>;

export type BaseBotbabaPlugin<T extends BotbabaPluginOptions> = CorsairPlugin<
	'botbaba',
	typeof BotbabaSchema,
	typeof botbabaEndpointsNested,
	typeof botbabaWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalBotbabaPlugin = BaseBotbabaPlugin<BotbabaPluginOptions>;

export type ExternalBotbabaPlugin<T extends BotbabaPluginOptions> =
	BaseBotbabaPlugin<T>;

/**
 * Builds the Botbaba plugin.
 *
 * Botbaba authenticates with an API key (Bearer token from the dashboard).
 * No OAuth flow is available, so only `api_key` auth is offered.
 */
export function botbaba<const T extends BotbabaPluginOptions>(
	incomingOptions: BotbabaPluginOptions & T = {} as BotbabaPluginOptions & T,
): ExternalBotbabaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'botbaba',
		authConfig: botbabaAuthConfig,
		schema: BotbabaSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: botbabaEndpointsNested,
		webhooks: botbabaWebhooksNested,
		endpointMeta: botbabaEndpointMeta,
		endpointSchemas: botbabaEndpointSchemas,
		webhookSchemas: botbabaWebhookSchemas,
		pluginWebhookMatcher: () => false,
		pluginTenantWebhookMatcher: matchBotbabaTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveBotbabaOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BotbabaKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key?.trim()) {
				return options.key.trim();
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res?.trim()) return res.trim();
			}

			throw new AuthMissingError('botbaba', 'api_key');
		},
	} satisfies InternalBotbabaPlugin;
}

export type {
	BotbabaBot,
	BotbabaConversation,
	BotbabaMessage,
	BotbabaDeployment,
	BotbabaAnalyticsSummary,
	BotbabaEndpointInputs,
	BotbabaEndpointOutputs,
} from './endpoints/types';
export type { BotbabaWebhookOutputs } from './webhooks/types';
