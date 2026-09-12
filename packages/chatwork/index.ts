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
import { Account, Members, Messages, Rooms } from './endpoints';
import type {
	ChatworkEndpointInputs,
	ChatworkEndpointOutputs,
} from './endpoints/types';
import {
	ChatworkEndpointInputSchemas,
	ChatworkEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ChatworkSchema } from './schema';
import { MentionsWebhooks, MessagesWebhooks } from './webhooks';
import { resolveChatworkOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchChatworkTenantWebhook } from './webhooks/tenant-matcher';
import type {
	ChatworkWebhookOutputs,
	MentionToMeWebhookPayload,
	MessageCreatedWebhookPayload,
	MessageUpdatedWebhookPayload,
} from './webhooks/types';
import {
	MentionToMeWebhookPayloadSchema,
	MessageCreatedWebhookPayloadSchema,
	MessageUpdatedWebhookPayloadSchema,
} from './webhooks/types';

export type ChatworkPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalChatworkPlugin['hooks'];
	webhookHooks?: InternalChatworkPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof chatworkEndpointsNested>;
};

export type ChatworkContext = CorsairPluginContext<
	typeof ChatworkSchema,
	ChatworkPluginOptions
>;

export type ChatworkKeyBuilderContext =
	KeyBuilderContext<ChatworkPluginOptions>;

export type ChatworkBoundEndpoints = BindEndpoints<
	typeof chatworkEndpointsNested
>;

type ChatworkEndpoint<K extends keyof ChatworkEndpointOutputs> =
	CorsairEndpoint<
		ChatworkContext,
		ChatworkEndpointInputs[K],
		ChatworkEndpointOutputs[K]
	>;

export type ChatworkEndpoints = {
	accountGet: ChatworkEndpoint<'accountGet'>;
	roomsList: ChatworkEndpoint<'roomsList'>;
	roomsGet: ChatworkEndpoint<'roomsGet'>;
	messagesList: ChatworkEndpoint<'messagesList'>;
	messagesGet: ChatworkEndpoint<'messagesGet'>;
	messagesSend: ChatworkEndpoint<'messagesSend'>;
	membersList: ChatworkEndpoint<'membersList'>;
};

type ChatworkWebhook<
	K extends keyof ChatworkWebhookOutputs,
	TEvent,
> = CorsairWebhook<ChatworkContext, TEvent, ChatworkWebhookOutputs[K]>;

export type ChatworkWebhooks = {
	messageCreated: ChatworkWebhook<
		'messageCreated',
		MessageCreatedWebhookPayload
	>;
	messageUpdated: ChatworkWebhook<
		'messageUpdated',
		MessageUpdatedWebhookPayload
	>;
	mentionToMe: ChatworkWebhook<'mentionToMe', MentionToMeWebhookPayload>;
};

export type ChatworkBoundWebhooks = BindWebhooks<ChatworkWebhooks>;

const chatworkEndpointsNested = {
	account: {
		get: Account.get,
	},
	rooms: {
		list: Rooms.list,
		get: Rooms.get,
	},
	messages: {
		list: Messages.list,
		get: Messages.get,
		send: Messages.send,
	},
	members: {
		list: Members.list,
	},
} as const;

const chatworkWebhooksNested = {
	messages: {
		created: MessagesWebhooks.created,
		updated: MessagesWebhooks.updated,
	},
	mentions: {
		toMe: MentionsWebhooks.toMe,
	},
} as const;

export const chatworkEndpointSchemas = {
	'account.get': {
		input: ChatworkEndpointInputSchemas.accountGet,
		output: ChatworkEndpointOutputSchemas.accountGet,
	},
	'rooms.list': {
		input: ChatworkEndpointInputSchemas.roomsList,
		output: ChatworkEndpointOutputSchemas.roomsList,
	},
	'rooms.get': {
		input: ChatworkEndpointInputSchemas.roomsGet,
		output: ChatworkEndpointOutputSchemas.roomsGet,
	},
	'messages.list': {
		input: ChatworkEndpointInputSchemas.messagesList,
		output: ChatworkEndpointOutputSchemas.messagesList,
	},
	'messages.get': {
		input: ChatworkEndpointInputSchemas.messagesGet,
		output: ChatworkEndpointOutputSchemas.messagesGet,
	},
	'messages.send': {
		input: ChatworkEndpointInputSchemas.messagesSend,
		output: ChatworkEndpointOutputSchemas.messagesSend,
	},
	'members.list': {
		input: ChatworkEndpointInputSchemas.membersList,
		output: ChatworkEndpointOutputSchemas.membersList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof chatworkEndpointsNested
>;

const chatworkWebhookSchemas = {
	'messages.created': {
		description: 'A message was created in a room',
		payload: MessageCreatedWebhookPayloadSchema,
		response: MessageCreatedWebhookPayloadSchema,
	},
	'messages.updated': {
		description: 'A message was updated in a room',
		payload: MessageUpdatedWebhookPayloadSchema,
		response: MessageUpdatedWebhookPayloadSchema,
	},
	'mentions.toMe': {
		description: 'Current user was mentioned in a room message',
		payload: MentionToMeWebhookPayloadSchema,
		response: MentionToMeWebhookPayloadSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof chatworkWebhooksNested
>;

const defaultAuthType: AuthTypes = 'oauth_2' as const;

const chatworkEndpointMeta = {
	'account.get': {
		riskLevel: 'read',
		description: 'Get profile information of the authenticated user',
	},
	'rooms.list': {
		riskLevel: 'read',
		description: 'List chat rooms the authenticated user belongs to',
	},
	'rooms.get': {
		riskLevel: 'read',
		description: 'Get details of a specific chat room',
	},
	'messages.list': {
		riskLevel: 'read',
		description: 'List messages in a chat room',
	},
	'messages.get': {
		riskLevel: 'read',
		description: 'Get a specific message from a chat room',
	},
	'messages.send': {
		riskLevel: 'write',
		description: 'Send a new message to a chat room',
	},
	'members.list': {
		riskLevel: 'read',
		description: 'List members belonging to a chat room',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof chatworkEndpointsNested>;

export const chatworkAuthConfig = {
	api_key: {
		account: ['account_id'] as const,
	},
	oauth_2: {
		account: ['account_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseChatworkPlugin<T extends ChatworkPluginOptions> = CorsairPlugin<
	'chatwork',
	typeof ChatworkSchema,
	typeof chatworkEndpointsNested,
	typeof chatworkWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalChatworkPlugin = BaseChatworkPlugin<ChatworkPluginOptions>;

export type ExternalChatworkPlugin<T extends ChatworkPluginOptions> =
	BaseChatworkPlugin<T>;

export function chatwork<const T extends ChatworkPluginOptions>(
	incomingOptions: ChatworkPluginOptions & T = {} as ChatworkPluginOptions & T,
): ExternalChatworkPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'chatwork',
		authConfig: chatworkAuthConfig,
		oauthConfig: {
			providerName: 'Chatwork',
			authUrl: 'https://www.chatwork.com/packages/oauth2/login.php',
			tokenUrl: 'https://oauth.chatwork.com/token',
			scopes: [
				'users.profile.me:read',
				'rooms.info:read',
				'rooms.messages:read',
				'rooms.members:read',
				'rooms.messages:write',
				'offline_access',
			],
		},
		schema: ChatworkSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: chatworkEndpointsNested,
		webhooks: chatworkWebhooksNested,
		endpointMeta: chatworkEndpointMeta,
		endpointSchemas: chatworkEndpointSchemas,
		webhookSchemas: chatworkWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return (
				'x-chatworkwebhooksignature' in headers ||
				'X-ChatWorkWebhookSignature' in headers ||
				'x-chatwork-signature' in headers
			);
		},
		pluginTenantWebhookMatcher: matchChatworkTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveChatworkOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ChatworkKeyBuilderContext, source) => {
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
	} satisfies InternalChatworkPlugin;
}

export * from './client';
export type {
	AccountGetInput,
	AccountGetResponse,
	ChatworkEndpointInputs,
	ChatworkEndpointOutputs,
	MembersListInput,
	MembersListResponse,
	MessagesGetInput,
	MessagesGetResponse,
	MessagesListInput,
	MessagesListResponse,
	MessagesSendInput,
	MessagesSendResponse,
	RoomsGetInput,
	RoomsGetResponse,
	RoomsListInput,
	RoomsListResponse,
} from './endpoints/types';
export * from './error-handlers';
export * from './schema';
export type {
	ChatworkWebhookOutputs,
	MentionToMeWebhookPayload,
	MessageCreatedWebhookPayload,
	MessageUpdatedWebhookPayload,
} from './webhooks/types';
export {
	createChatworkMatch,
	verifyChatworkWebhookSignature,
} from './webhooks/types';
