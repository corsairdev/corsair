import type {
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
import { getValidAccessToken } from './client';
import { Channels, Chats, Members, Messages, Teams } from './endpoints';
import type {
	TeamsEndpointInputs,
	TeamsEndpointOutputs,
} from './endpoints/types';
import {
	TeamsEndpointInputSchemas,
	TeamsEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { TeamsSchema } from './schema';
import { ChannelWebhooks, ChatWebhooks, MemberWebhooks } from './webhooks';
import type {
	TeamsChannelCreatedEvent,
	TeamsChannelMessageEvent,
	TeamsChatMessageEvent,
	TeamsMembershipChangedEvent,
	TeamsWebhookOutputs,
} from './webhooks/types';
import {
	TeamsChannelCreatedEventSchema,
	TeamsChannelCreatedPayloadSchema,
	TeamsChannelMessageEventSchema,
	TeamsChannelMessagePayloadSchema,
	TeamsChatMessageEventSchema,
	TeamsChatMessagePayloadSchema,
	TeamsMembershipChangedEventSchema,
	TeamsMembershipChangedPayloadSchema,
} from './webhooks/types';

export type TeamsPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	key?: string;
	clientState?: string;
	hooks?: InternalTeamsPlugin['hooks'];
	webhookHooks?: InternalTeamsPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof teamsEndpointsNested>;
};

export type TeamsContext = CorsairPluginContext<
	typeof TeamsSchema,
	TeamsPluginOptions
>;

export type TeamsKeyBuilderContext = KeyBuilderContext<TeamsPluginOptions>;

export type TeamsBoundEndpoints = BindEndpoints<typeof teamsEndpointsNested>;

type TeamsEndpoint<K extends keyof TeamsEndpointOutputs> = CorsairEndpoint<
	TeamsContext,
	TeamsEndpointInputs[K],
	TeamsEndpointOutputs[K]
>;

export type TeamsEndpoints = {
	teamsList: TeamsEndpoint<'teamsList'>;
	teamsGet: TeamsEndpoint<'teamsGet'>;
	teamsCreate: TeamsEndpoint<'teamsCreate'>;
	teamsUpdate: TeamsEndpoint<'teamsUpdate'>;
	teamsDelete: TeamsEndpoint<'teamsDelete'>;
	channelsList: TeamsEndpoint<'channelsList'>;
	channelsGet: TeamsEndpoint<'channelsGet'>;
	channelsCreate: TeamsEndpoint<'channelsCreate'>;
	channelsUpdate: TeamsEndpoint<'channelsUpdate'>;
	channelsDelete: TeamsEndpoint<'channelsDelete'>;
	messagesList: TeamsEndpoint<'messagesList'>;
	messagesGet: TeamsEndpoint<'messagesGet'>;
	messagesSend: TeamsEndpoint<'messagesSend'>;
	messagesReply: TeamsEndpoint<'messagesReply'>;
	messagesListReplies: TeamsEndpoint<'messagesListReplies'>;
	messagesDelete: TeamsEndpoint<'messagesDelete'>;
	membersList: TeamsEndpoint<'membersList'>;
	membersGet: TeamsEndpoint<'membersGet'>;
	membersAdd: TeamsEndpoint<'membersAdd'>;
	membersRemove: TeamsEndpoint<'membersRemove'>;
	chatsList: TeamsEndpoint<'chatsList'>;
	chatsGet: TeamsEndpoint<'chatsGet'>;
	chatsCreate: TeamsEndpoint<'chatsCreate'>;
	chatsListMessages: TeamsEndpoint<'chatsListMessages'>;
	chatsSendMessage: TeamsEndpoint<'chatsSendMessage'>;
};

type TeamsWebhookType<
	K extends keyof TeamsWebhookOutputs,
	TEvent,
> = CorsairWebhook<TeamsContext, TEvent, TeamsWebhookOutputs[K]>;

export type TeamsWebhooks = {
	channelMessage: TeamsWebhookType<
		'channelMessage',
		{ value: TeamsChannelMessageEvent[] }
	>;
	chatMessage: TeamsWebhookType<
		'chatMessage',
		{ value: TeamsChatMessageEvent[] }
	>;
	channelCreated: TeamsWebhookType<
		'channelCreated',
		{ value: TeamsChannelCreatedEvent[] }
	>;
	membershipChanged: TeamsWebhookType<
		'membershipChanged',
		{ value: TeamsMembershipChangedEvent[] }
	>;
};

export type TeamsBoundWebhooks = BindWebhooks<TeamsWebhooks>;

const teamsEndpointsNested = {
	teams: {
		list: Teams.list,
		get: Teams.get,
		create: Teams.create,
		update: Teams.update,
		delete: Teams.delete,
	},
	channels: {
		list: Channels.list,
		get: Channels.get,
		create: Channels.create,
		update: Channels.update,
		delete: Channels.delete,
	},
	messages: {
		list: Messages.list,
		get: Messages.get,
		send: Messages.send,
		reply: Messages.reply,
		listReplies: Messages.listReplies,
		delete: Messages.delete,
	},
	members: {
		list: Members.list,
		get: Members.get,
		add: Members.add,
		remove: Members.remove,
	},
	chats: {
		list: Chats.list,
		get: Chats.get,
		create: Chats.create,
		listMessages: Chats.listMessages,
		sendMessage: Chats.sendMessage,
	},
} as const;

const teamsWebhooksNested = {
	channels: {
		message: ChannelWebhooks.message,
		created: ChannelWebhooks.created,
	},
	chats: {
		message: ChatWebhooks.message,
	},
	members: {
		changed: MemberWebhooks.changed,
	},
} as const;

export const teamsEndpointSchemas = {
	'teams.list': {
		input: TeamsEndpointInputSchemas.teamsList,
		output: TeamsEndpointOutputSchemas.teamsList,
	},
	'teams.get': {
		input: TeamsEndpointInputSchemas.teamsGet,
		output: TeamsEndpointOutputSchemas.teamsGet,
	},
	'teams.create': {
		input: TeamsEndpointInputSchemas.teamsCreate,
		output: TeamsEndpointOutputSchemas.teamsCreate,
	},
	'teams.update': {
		input: TeamsEndpointInputSchemas.teamsUpdate,
		output: TeamsEndpointOutputSchemas.teamsUpdate,
	},
	'teams.delete': {
		input: TeamsEndpointInputSchemas.teamsDelete,
		output: TeamsEndpointOutputSchemas.teamsDelete,
	},
	'channels.list': {
		input: TeamsEndpointInputSchemas.channelsList,
		output: TeamsEndpointOutputSchemas.channelsList,
	},
	'channels.get': {
		input: TeamsEndpointInputSchemas.channelsGet,
		output: TeamsEndpointOutputSchemas.channelsGet,
	},
	'channels.create': {
		input: TeamsEndpointInputSchemas.channelsCreate,
		output: TeamsEndpointOutputSchemas.channelsCreate,
	},
	'channels.update': {
		input: TeamsEndpointInputSchemas.channelsUpdate,
		output: TeamsEndpointOutputSchemas.channelsUpdate,
	},
	'channels.delete': {
		input: TeamsEndpointInputSchemas.channelsDelete,
		output: TeamsEndpointOutputSchemas.channelsDelete,
	},
	'messages.list': {
		input: TeamsEndpointInputSchemas.messagesList,
		output: TeamsEndpointOutputSchemas.messagesList,
	},
	'messages.get': {
		input: TeamsEndpointInputSchemas.messagesGet,
		output: TeamsEndpointOutputSchemas.messagesGet,
	},
	'messages.send': {
		input: TeamsEndpointInputSchemas.messagesSend,
		output: TeamsEndpointOutputSchemas.messagesSend,
	},
	'messages.reply': {
		input: TeamsEndpointInputSchemas.messagesReply,
		output: TeamsEndpointOutputSchemas.messagesReply,
	},
	'messages.listReplies': {
		input: TeamsEndpointInputSchemas.messagesListReplies,
		output: TeamsEndpointOutputSchemas.messagesListReplies,
	},
	'messages.delete': {
		input: TeamsEndpointInputSchemas.messagesDelete,
		output: TeamsEndpointOutputSchemas.messagesDelete,
	},
	'members.list': {
		input: TeamsEndpointInputSchemas.membersList,
		output: TeamsEndpointOutputSchemas.membersList,
	},
	'members.get': {
		input: TeamsEndpointInputSchemas.membersGet,
		output: TeamsEndpointOutputSchemas.membersGet,
	},
	'members.add': {
		input: TeamsEndpointInputSchemas.membersAdd,
		output: TeamsEndpointOutputSchemas.membersAdd,
	},
	'members.remove': {
		input: TeamsEndpointInputSchemas.membersRemove,
		output: TeamsEndpointOutputSchemas.membersRemove,
	},
	'chats.list': {
		input: TeamsEndpointInputSchemas.chatsList,
		output: TeamsEndpointOutputSchemas.chatsList,
	},
	'chats.get': {
		input: TeamsEndpointInputSchemas.chatsGet,
		output: TeamsEndpointOutputSchemas.chatsGet,
	},
	'chats.create': {
		input: TeamsEndpointInputSchemas.chatsCreate,
		output: TeamsEndpointOutputSchemas.chatsCreate,
	},
	'chats.listMessages': {
		input: TeamsEndpointInputSchemas.chatsListMessages,
		output: TeamsEndpointOutputSchemas.chatsListMessages,
	},
	'chats.sendMessage': {
		input: TeamsEndpointInputSchemas.chatsSendMessage,
		output: TeamsEndpointOutputSchemas.chatsSendMessage,
	},
} satisfies RequiredPluginEndpointSchemas<typeof teamsEndpointsNested>;

const defaultAuthType = 'oauth_2' as const;

const teamsEndpointMeta = {
	'teams.list': {
		riskLevel: 'read',
		description: 'List teams the current user is a member of',
	},
	'teams.get': {
		riskLevel: 'read',
		description: 'Get details of a specific team',
	},
	'teams.create': { riskLevel: 'write', description: 'Create a new team' },
	'teams.update': { riskLevel: 'write', description: 'Update team settings' },
	'teams.delete': {
		riskLevel: 'destructive',
		description: 'Delete a team [DESTRUCTIVE]',
	},
	'channels.list': {
		riskLevel: 'read',
		description: 'List channels in a team',
	},
	'channels.get': {
		riskLevel: 'read',
		description: 'Get details of a specific channel',
	},
	'channels.create': {
		riskLevel: 'write',
		description: 'Create a new channel in a team',
	},
	'channels.update': { riskLevel: 'write', description: 'Update a channel' },
	'channels.delete': {
		riskLevel: 'destructive',
		description: 'Delete a channel [DESTRUCTIVE]',
	},
	'messages.list': {
		riskLevel: 'read',
		description: 'List messages in a channel',
	},
	'messages.get': {
		riskLevel: 'read',
		description: 'Get a specific channel message',
	},
	'messages.send': {
		riskLevel: 'write',
		description: 'Send a message to a channel',
	},
	'messages.reply': {
		riskLevel: 'write',
		description: 'Reply to a message in a channel',
	},
	'messages.listReplies': {
		riskLevel: 'read',
		description: 'List replies to a channel message',
	},
	'messages.delete': {
		riskLevel: 'destructive',
		description: 'Delete a channel message [DESTRUCTIVE]',
	},
	'members.list': { riskLevel: 'read', description: 'List members of a team' },
	'members.get': {
		riskLevel: 'read',
		description: 'Get a specific team member',
	},
	'members.add': { riskLevel: 'write', description: 'Add a member to a team' },
	'members.remove': {
		riskLevel: 'destructive',
		description: 'Remove a member from a team [DESTRUCTIVE]',
	},
	'chats.list': {
		riskLevel: 'read',
		description: 'List chats for the current user',
	},
	'chats.get': {
		riskLevel: 'read',
		description: 'Get details of a specific chat',
	},
	'chats.create': { riskLevel: 'write', description: 'Create a new chat' },
	'chats.listMessages': {
		riskLevel: 'read',
		description: 'List messages in a chat',
	},
	'chats.sendMessage': {
		riskLevel: 'write',
		description: 'Send a message in a chat',
	},
} satisfies RequiredPluginEndpointMeta<typeof teamsEndpointsNested>;

const teamsWebhookSchemas = {
	'channels.message': {
		description: 'A message was created or updated in a team channel',
		payload: TeamsChannelMessagePayloadSchema,
		response: TeamsChannelMessageEventSchema,
	},
	'channels.created': {
		description: 'A channel was created, updated, or deleted in a team',
		payload: TeamsChannelCreatedPayloadSchema,
		response: TeamsChannelCreatedEventSchema,
	},
	'chats.message': {
		description: 'A message was created or updated in a chat',
		payload: TeamsChatMessagePayloadSchema,
		response: TeamsChatMessageEventSchema,
	},
	'members.changed': {
		description: 'A team membership was added, updated, or removed',
		payload: TeamsMembershipChangedPayloadSchema,
		response: TeamsMembershipChangedEventSchema,
	},
} satisfies RequiredPluginWebhookSchemas<typeof teamsWebhooksNested>;

export const teamsAuthConfig = {
	oauth_2: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseTeamsPlugin<T extends TeamsPluginOptions> = CorsairPlugin<
	'teams',
	typeof TeamsSchema,
	typeof teamsEndpointsNested,
	typeof teamsWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalTeamsPlugin = BaseTeamsPlugin<TeamsPluginOptions>;

export type ExternalTeamsPlugin<T extends TeamsPluginOptions> =
	BaseTeamsPlugin<T>;

export function teams<const T extends TeamsPluginOptions>(
	// {} is a valid empty options object at runtime; cast needed because {} doesn't statically satisfy the generic T constraint
	incomingOptions: TeamsPluginOptions & T = {} as TeamsPluginOptions & T,
): ExternalTeamsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'teams',
		schema: TeamsSchema,
		options: options,
		authConfig: teamsAuthConfig,
		oauthConfig: {
			providerName: 'Microsoft',
			authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
			tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
			scopes: [
				'offline_access',
				'Team.ReadBasic.All',
				'Channel.ReadBasic.All',
				'ChannelMessage.Read.All',
				'ChannelMessage.Send',
				'TeamMember.Read.All',
				'Chat.ReadWrite',
			],
		},
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: teamsEndpointsNested,
		webhooks: teamsWebhooksNested,
		endpointMeta: teamsEndpointMeta,
		endpointSchemas: teamsEndpointSchemas,
		webhookSchemas: teamsWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// Microsoft Graph sends notifications as POST with application/json
			// We match on a custom header that a proxy/middleware should set,
			const hasTeamsHeader = 'x-ms-teams-client-state' in headers;
			const isJsonPost =
				headers['content-type']?.includes('application/json') ?? false;
			return hasTeamsHeader && isJsonPost;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: TeamsKeyBuilderContext, source) => {
			if (source === 'webhook' && options.clientState) {
				return options.clientState;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				if (!res) {
					return '';
				}
				return res;
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (ctx.authType === 'oauth_2') {
				const [accessToken, expiresAt, refreshToken] = await Promise.all([
					ctx.keys.get_access_token(),
					ctx.keys.get_expires_at(),
					ctx.keys.get_refresh_token(),
				]);

				if (!refreshToken) {
					throw new Error('No refresh token. Cannot get access token.');
				}

				const creds = await ctx.keys.get_integration_credentials();
				if (!creds.client_id || !creds.client_secret) {
					throw new Error('No client id or client secret.');
				}

				const result = await getValidAccessToken({
					accessToken,
					expiresAt,
					refreshToken,
					clientId: creds.client_id,
					clientSecret: creds.client_secret,
				});

				if (result.refreshed) {
					await Promise.all([
						ctx.keys.set_access_token(result.accessToken),
						ctx.keys.set_expires_at(String(result.expiresAt)),
					]);
				}
				return result.accessToken;
			}

			return '';
		},
	} satisfies InternalTeamsPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	TeamsChannelCreatedEvent,
	TeamsChannelMessageEvent,
	TeamsChatMessageEvent,
	TeamsMembershipChangedEvent,
	TeamsNotification,
	TeamsWebhookNotificationPayload,
	TeamsWebhookOutputs,
} from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	ChannelsCreateInput,
	ChannelsCreateResponse,
	ChannelsDeleteInput,
	ChannelsGetInput,
	ChannelsGetResponse,
	ChannelsListInput,
	ChannelsListResponse,
	ChannelsUpdateInput,
	ChatsCreateInput,
	ChatsCreateResponse,
	ChatsGetInput,
	ChatsGetResponse,
	ChatsListInput,
	ChatsListMessagesInput,
	ChatsListMessagesResponse,
	ChatsListResponse,
	ChatsSendMessageInput,
	ChatsSendMessageResponse,
	MembersAddInput,
	MembersAddResponse,
	MembersGetInput,
	MembersGetResponse,
	MembersListInput,
	MembersListResponse,
	MembersRemoveInput,
	MessagesDeleteInput,
	MessagesGetInput,
	MessagesGetResponse,
	MessagesListInput,
	MessagesListRepliesInput,
	MessagesListRepliesResponse,
	MessagesListResponse,
	MessagesReplyInput,
	MessagesReplyResponse,
	MessagesSendInput,
	MessagesSendResponse,
	TeamsCreateInput,
	TeamsCreateResponse,
	TeamsDeleteInput,
	TeamsEndpointInputs,
	TeamsEndpointOutputs,
	TeamsGetInput,
	TeamsGetResponse,
	TeamsListInput,
	TeamsListResponse,
	TeamsUpdateInput,
} from './endpoints/types';
