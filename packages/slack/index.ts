import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
} from 'corsair/core';
import type { SlackEndpointInputs, SlackEndpointOutputs } from './endpoints';
import {
	Channels,
	Files,
	Messages,
	Reactions,
	Stars,
	UserGroups,
	Users,
} from './endpoints';
import {
	SlackEndpointInputSchemas,
	SlackEndpointOutputSchemas,
} from './endpoints/types';
import { SlackSchema } from './schema';
import {
	ChallengeWebhooks,
	ChannelWebhooks,
	FileWebhooks,
	MessageWebhooks,
	ReactionWebhooks,
	UserWebhooks,
} from './webhooks';
import type {
	ChallengeEvent,
	ChannelCreatedEvent,
	FileCreatedEvent,
	FilePublicEvent,
	FileSharedEvent,
	MessageEvent,
	ReactionAddedEvent,
	SlackWebhookOutputs,
	SlackWebhookPayload,
	TeamJoinEvent,
	UserChangeEvent,
} from './webhooks/types';
import {
	ChannelCreatedEventSchema,
	FileCreatedEventSchema,
	FilePublicEventSchema,
	FileSharedEventSchema,
	MessageEventSchema,
	ReactionAddedEventSchema,
	SlackChallengePayloadSchema,
	SlackChannelCreatedPayloadSchema,
	SlackFileCreatedPayloadSchema,
	SlackFilePublicPayloadSchema,
	SlackFileSharedPayloadSchema,
	SlackMessagePayloadSchema,
	SlackReactionAddedPayloadSchema,
	SlackTeamJoinPayloadSchema,
	SlackUrlVerificationPayloadSchema,
	SlackUserChangePayloadSchema,
	TeamJoinEventSchema,
	UserChangeEventSchema,
} from './webhooks/types';

export type { SlackReactionName } from './endpoints';

import type { PickAuth } from 'corsair/core';
import { errorHandlers } from './error-handlers';

export type SlackEndpoints = {
	channelsArchive: SlackEndpoint<'channelsArchive'>;
	channelsClose: SlackEndpoint<'channelsClose'>;
	channelsCreate: SlackEndpoint<'channelsCreate'>;
	channelsGet: SlackEndpoint<'channelsGet'>;
	channelsList: SlackEndpoint<'channelsList'>;
	channelsGetHistory: SlackEndpoint<'channelsGetHistory'>;
	channelsInvite: SlackEndpoint<'channelsInvite'>;
	channelsJoin: SlackEndpoint<'channelsJoin'>;
	channelsKick: SlackEndpoint<'channelsKick'>;
	channelsLeave: SlackEndpoint<'channelsLeave'>;
	channelsGetMembers: SlackEndpoint<'channelsGetMembers'>;
	channelsOpen: SlackEndpoint<'channelsOpen'>;
	channelsRename: SlackEndpoint<'channelsRename'>;
	channelsGetReplies: SlackEndpoint<'channelsGetReplies'>;
	channelsSetPurpose: SlackEndpoint<'channelsSetPurpose'>;
	channelsSetTopic: SlackEndpoint<'channelsSetTopic'>;
	channelsUnarchive: SlackEndpoint<'channelsUnarchive'>;
	usersGet: SlackEndpoint<'usersGet'>;
	usersList: SlackEndpoint<'usersList'>;
	usersGetProfile: SlackEndpoint<'usersGetProfile'>;
	usersGetPresence: SlackEndpoint<'usersGetPresence'>;
	usersUpdateProfile: SlackEndpoint<'usersUpdateProfile'>;
	userGroupsCreate: SlackEndpoint<'userGroupsCreate'>;
	userGroupsDisable: SlackEndpoint<'userGroupsDisable'>;
	userGroupsEnable: SlackEndpoint<'userGroupsEnable'>;
	userGroupsList: SlackEndpoint<'userGroupsList'>;
	userGroupsUpdate: SlackEndpoint<'userGroupsUpdate'>;
	filesGet: SlackEndpoint<'filesGet'>;
	filesList: SlackEndpoint<'filesList'>;
	filesUpload: SlackEndpoint<'filesUpload'>;
	messagesDelete: SlackEndpoint<'messagesDelete'>;
	messagesGetPermalink: SlackEndpoint<'messagesGetPermalink'>;
	messagesSearch: SlackEndpoint<'messagesSearch'>;
	postMessage: SlackEndpoint<'postMessage'>;
	messagesUpdate: SlackEndpoint<'messagesUpdate'>;
	reactionsAdd: SlackEndpoint<'reactionsAdd'>;
	reactionsGet: SlackEndpoint<'reactionsGet'>;
	reactionsRemove: SlackEndpoint<'reactionsRemove'>;
	starsAdd: SlackEndpoint<'starsAdd'>;
	starsRemove: SlackEndpoint<'starsRemove'>;
	starsList: SlackEndpoint<'starsList'>;
};

const slackEndpointsNested = {
	channels: {
		archive: Channels.archive,
		close: Channels.close,
		create: Channels.create,
		get: Channels.get,
		list: Channels.list,
		getHistory: Channels.getHistory,
		invite: Channels.invite,
		join: Channels.join,
		kick: Channels.kick,
		leave: Channels.leave,
		getMembers: Channels.getMembers,
		open: Channels.open,
		rename: Channels.rename,
		getReplies: Channels.getReplies,
		setPurpose: Channels.setPurpose,
		setTopic: Channels.setTopic,
		unarchive: Channels.unarchive,
	},
	users: {
		get: Users.get,
		list: Users.list,
		getProfile: Users.getProfile,
		getPresence: Users.getPresence,
		updateProfile: Users.updateProfile,
	},
	userGroups: {
		create: UserGroups.create,
		disable: UserGroups.disable,
		enable: UserGroups.enable,
		list: UserGroups.list,
		update: UserGroups.update,
	},
	files: {
		get: Files.get,
		list: Files.list,
		upload: Files.upload,
	},
	messages: {
		delete: Messages.delete,
		getPermalink: Messages.getPermalink,
		search: Messages.search,
		post: Messages.post,
		update: Messages.update,
	},
	reactions: {
		add: Reactions.add,
		get: Reactions.get,
		remove: Reactions.remove,
	},
	stars: {
		add: Stars.add,
		remove: Stars.remove,
		list: Stars.list,
	},
} as const;

export const slackEndpointSchemas = {
	'channels.archive': {
		input: SlackEndpointInputSchemas.channelsArchive,
		output: SlackEndpointOutputSchemas.channelsArchive,
	},
	'channels.close': {
		input: SlackEndpointInputSchemas.channelsClose,
		output: SlackEndpointOutputSchemas.channelsClose,
	},
	'channels.create': {
		input: SlackEndpointInputSchemas.channelsCreate,
		output: SlackEndpointOutputSchemas.channelsCreate,
	},
	'channels.get': {
		input: SlackEndpointInputSchemas.channelsGet,
		output: SlackEndpointOutputSchemas.channelsGet,
	},
	'channels.list': {
		input: SlackEndpointInputSchemas.channelsList,
		output: SlackEndpointOutputSchemas.channelsList,
	},
	'channels.getHistory': {
		input: SlackEndpointInputSchemas.channelsGetHistory,
		output: SlackEndpointOutputSchemas.channelsGetHistory,
	},
	'channels.invite': {
		input: SlackEndpointInputSchemas.channelsInvite,
		output: SlackEndpointOutputSchemas.channelsInvite,
	},
	'channels.join': {
		input: SlackEndpointInputSchemas.channelsJoin,
		output: SlackEndpointOutputSchemas.channelsJoin,
	},
	'channels.kick': {
		input: SlackEndpointInputSchemas.channelsKick,
		output: SlackEndpointOutputSchemas.channelsKick,
	},
	'channels.leave': {
		input: SlackEndpointInputSchemas.channelsLeave,
		output: SlackEndpointOutputSchemas.channelsLeave,
	},
	'channels.getMembers': {
		input: SlackEndpointInputSchemas.channelsGetMembers,
		output: SlackEndpointOutputSchemas.channelsGetMembers,
	},
	'channels.open': {
		input: SlackEndpointInputSchemas.channelsOpen,
		output: SlackEndpointOutputSchemas.channelsOpen,
	},
	'channels.rename': {
		input: SlackEndpointInputSchemas.channelsRename,
		output: SlackEndpointOutputSchemas.channelsRename,
	},
	'channels.getReplies': {
		input: SlackEndpointInputSchemas.channelsGetReplies,
		output: SlackEndpointOutputSchemas.channelsGetReplies,
	},
	'channels.setPurpose': {
		input: SlackEndpointInputSchemas.channelsSetPurpose,
		output: SlackEndpointOutputSchemas.channelsSetPurpose,
	},
	'channels.setTopic': {
		input: SlackEndpointInputSchemas.channelsSetTopic,
		output: SlackEndpointOutputSchemas.channelsSetTopic,
	},
	'channels.unarchive': {
		input: SlackEndpointInputSchemas.channelsUnarchive,
		output: SlackEndpointOutputSchemas.channelsUnarchive,
	},
	'users.get': {
		input: SlackEndpointInputSchemas.usersGet,
		output: SlackEndpointOutputSchemas.usersGet,
	},
	'users.list': {
		input: SlackEndpointInputSchemas.usersList,
		output: SlackEndpointOutputSchemas.usersList,
	},
	'users.getProfile': {
		input: SlackEndpointInputSchemas.usersGetProfile,
		output: SlackEndpointOutputSchemas.usersGetProfile,
	},
	'users.getPresence': {
		input: SlackEndpointInputSchemas.usersGetPresence,
		output: SlackEndpointOutputSchemas.usersGetPresence,
	},
	'users.updateProfile': {
		input: SlackEndpointInputSchemas.usersUpdateProfile,
		output: SlackEndpointOutputSchemas.usersUpdateProfile,
	},
	'userGroups.create': {
		input: SlackEndpointInputSchemas.userGroupsCreate,
		output: SlackEndpointOutputSchemas.userGroupsCreate,
	},
	'userGroups.disable': {
		input: SlackEndpointInputSchemas.userGroupsDisable,
		output: SlackEndpointOutputSchemas.userGroupsDisable,
	},
	'userGroups.enable': {
		input: SlackEndpointInputSchemas.userGroupsEnable,
		output: SlackEndpointOutputSchemas.userGroupsEnable,
	},
	'userGroups.list': {
		input: SlackEndpointInputSchemas.userGroupsList,
		output: SlackEndpointOutputSchemas.userGroupsList,
	},
	'userGroups.update': {
		input: SlackEndpointInputSchemas.userGroupsUpdate,
		output: SlackEndpointOutputSchemas.userGroupsUpdate,
	},
	'files.get': {
		input: SlackEndpointInputSchemas.filesGet,
		output: SlackEndpointOutputSchemas.filesGet,
	},
	'files.list': {
		input: SlackEndpointInputSchemas.filesList,
		output: SlackEndpointOutputSchemas.filesList,
	},
	'files.upload': {
		input: SlackEndpointInputSchemas.filesUpload,
		output: SlackEndpointOutputSchemas.filesUpload,
	},
	'messages.delete': {
		input: SlackEndpointInputSchemas.messagesDelete,
		output: SlackEndpointOutputSchemas.messagesDelete,
	},
	'messages.getPermalink': {
		input: SlackEndpointInputSchemas.messagesGetPermalink,
		output: SlackEndpointOutputSchemas.messagesGetPermalink,
	},
	'messages.search': {
		input: SlackEndpointInputSchemas.messagesSearch,
		output: SlackEndpointOutputSchemas.messagesSearch,
	},
	'messages.post': {
		input: SlackEndpointInputSchemas.postMessage,
		output: SlackEndpointOutputSchemas.postMessage,
	},
	'messages.update': {
		input: SlackEndpointInputSchemas.messagesUpdate,
		output: SlackEndpointOutputSchemas.messagesUpdate,
	},
	'reactions.add': {
		input: SlackEndpointInputSchemas.reactionsAdd,
		output: SlackEndpointOutputSchemas.reactionsAdd,
	},
	'reactions.get': {
		input: SlackEndpointInputSchemas.reactionsGet,
		output: SlackEndpointOutputSchemas.reactionsGet,
	},
	'reactions.remove': {
		input: SlackEndpointInputSchemas.reactionsRemove,
		output: SlackEndpointOutputSchemas.reactionsRemove,
	},
	'stars.add': {
		input: SlackEndpointInputSchemas.starsAdd,
		output: SlackEndpointOutputSchemas.starsAdd,
	},
	'stars.remove': {
		input: SlackEndpointInputSchemas.starsRemove,
		output: SlackEndpointOutputSchemas.starsRemove,
	},
	'stars.list': {
		input: SlackEndpointInputSchemas.starsList,
		output: SlackEndpointOutputSchemas.starsList,
	},
} as const;

export type SlackWebhooks = {
	challenge: SlackWebhook<'challenge', ChallengeEvent>;
	reactionAdded: SlackWebhook<'reactionAdded', ReactionAddedEvent>;
	message: SlackWebhook<'message', MessageEvent>;
	channelCreated: SlackWebhook<'channelCreated', ChannelCreatedEvent>;
	teamJoin: SlackWebhook<'teamJoin', TeamJoinEvent>;
	userChange: SlackWebhook<'userChange', UserChangeEvent>;
	fileCreated: SlackWebhook<'fileCreated', FileCreatedEvent>;
	filePublic: SlackWebhook<'filePublic', FilePublicEvent>;
	fileShared: SlackWebhook<'fileShared', FileSharedEvent>;
};

const slackWebhooksNested = {
	challenge: {
		challenge: ChallengeWebhooks.challenge,
	},
	messages: {
		message: MessageWebhooks.message,
	},
	channels: {
		created: ChannelWebhooks.created,
	},
	reactions: {
		added: ReactionWebhooks.added,
	},
	users: {
		teamJoin: UserWebhooks.teamJoin,
		userChange: UserWebhooks.userChange,
	},
	files: {
		created: FileWebhooks.created,
		public: FileWebhooks.public,
		shared: FileWebhooks.shared,
	},
} as const;

const defaultAuthType = 'api_key' as const;

/**
 * Risk-level metadata for each Slack endpoint.
 * Used by the MCP server permission system to decide allow / deny / require_approval.
 */
const slackEndpointMeta = {
	'channels.archive': {
		riskLevel: 'destructive',
		description: 'Archive a Slack channel [DESTRUCTIVE]',
	},
	'channels.close': {
		riskLevel: 'write',
		description: 'Close a direct message or multi-party DM',
	},
	'channels.create': {
		riskLevel: 'write',
		description: 'Create a new Slack channel',
	},
	'channels.get': {
		riskLevel: 'read',
		description: 'Get info about a channel',
	},
	'channels.list': {
		riskLevel: 'read',
		description: 'List all channels in the workspace',
	},
	'channels.getHistory': {
		riskLevel: 'read',
		description: 'Fetch message history for a channel',
	},
	'channels.invite': {
		riskLevel: 'write',
		description: 'Invite users to a channel',
	},
	'channels.join': { riskLevel: 'write', description: 'Join a channel' },
	'channels.kick': {
		riskLevel: 'write',
		description: 'Remove a user from a channel',
	},
	'channels.leave': { riskLevel: 'write', description: 'Leave a channel' },
	'channels.getMembers': {
		riskLevel: 'read',
		description: 'List members of a channel',
	},
	'channels.open': {
		riskLevel: 'write',
		description: 'Open a direct message or multi-party DM',
	},
	'channels.rename': { riskLevel: 'write', description: 'Rename a channel' },
	'channels.getReplies': {
		riskLevel: 'read',
		description: 'Fetch replies for a thread',
	},
	'channels.setPurpose': {
		riskLevel: 'write',
		description: 'Set the purpose of a channel',
	},
	'channels.setTopic': {
		riskLevel: 'write',
		description: 'Set the topic of a channel',
	},
	'channels.unarchive': {
		riskLevel: 'write',
		description: 'Unarchive a channel',
	},
	'users.get': { riskLevel: 'read', description: 'Get info about a user' },
	'users.list': {
		riskLevel: 'read',
		description: 'List all users in the workspace',
	},
	'users.getProfile': { riskLevel: 'read', description: 'Get a user profile' },
	'users.getPresence': {
		riskLevel: 'read',
		description: 'Get the presence status of a user',
	},
	'users.updateProfile': {
		riskLevel: 'write',
		description: "Update the authenticated user's profile",
	},
	'userGroups.create': {
		riskLevel: 'write',
		description: 'Create a user group',
	},
	'userGroups.disable': {
		riskLevel: 'write',
		description: 'Disable a user group',
	},
	'userGroups.enable': {
		riskLevel: 'write',
		description: 'Enable a user group',
	},
	'userGroups.list': {
		riskLevel: 'read',
		description: 'List user groups in the workspace',
	},
	'userGroups.update': {
		riskLevel: 'write',
		description: 'Update a user group',
	},
	'files.get': { riskLevel: 'read', description: 'Get info about a file' },
	'files.list': {
		riskLevel: 'read',
		description: 'List files in the workspace',
	},
	'files.upload': { riskLevel: 'write', description: 'Upload a file to Slack' },
	'messages.delete': {
		riskLevel: 'destructive',
		description: 'Delete a message [DESTRUCTIVE]',
	},
	'messages.getPermalink': {
		riskLevel: 'read',
		description: 'Get a permalink for a message',
	},
	'messages.search': {
		riskLevel: 'read',
		description: 'Search messages in the workspace',
	},
	'messages.post': {
		riskLevel: 'write',
		description: 'Post a message to a channel',
	},
	'messages.update': {
		riskLevel: 'write',
		description: 'Update an existing message',
	},
	'reactions.add': {
		riskLevel: 'write',
		description: 'Add a reaction emoji to a message',
	},
	'reactions.get': {
		riskLevel: 'read',
		description: 'Get reactions for a message',
	},
	'reactions.remove': {
		riskLevel: 'write',
		description: 'Remove a reaction emoji from a message',
	},
	'stars.add': { riskLevel: 'write', description: 'Star an item' },
	'stars.remove': { riskLevel: 'write', description: 'Unstar an item' },
	'stars.list': {
		riskLevel: 'read',
		description: 'List starred items for the authenticated user',
	},
} satisfies RequiredPluginEndpointMeta<typeof slackEndpointsNested>;

const slackWebhookSchemas = {
	'challenge.challenge': {
		description:
			'Slack URL verification challenge — respond to confirm the webhook endpoint',
		payload: SlackChallengePayloadSchema,
		response: SlackUrlVerificationPayloadSchema,
	},
	'messages.message': {
		description: 'A message was posted or updated in a channel',
		payload: SlackMessagePayloadSchema,
		response: MessageEventSchema,
	},
	'channels.created': {
		description: 'A new channel was created in the workspace',
		payload: SlackChannelCreatedPayloadSchema,
		response: ChannelCreatedEventSchema,
	},
	'reactions.added': {
		description: 'A reaction emoji was added to a message',
		payload: SlackReactionAddedPayloadSchema,
		response: ReactionAddedEventSchema,
	},
	'users.teamJoin': {
		description: 'A new user joined the workspace',
		payload: SlackTeamJoinPayloadSchema,
		response: TeamJoinEventSchema,
	},
	'users.userChange': {
		description: "A user's profile or account settings were updated",
		payload: SlackUserChangePayloadSchema,
		response: UserChangeEventSchema,
	},
	'files.created': {
		description: 'A file was uploaded or created',
		payload: SlackFileCreatedPayloadSchema,
		response: FileCreatedEventSchema,
	},
	'files.public': {
		description: 'A file was made publicly accessible',
		payload: SlackFilePublicPayloadSchema,
		response: FilePublicEventSchema,
	},
	'files.shared': {
		description: 'A file was shared into a channel',
		payload: SlackFileSharedPayloadSchema,
		response: FileSharedEventSchema,
	},
} as const;

type SlackEndpoint<K extends keyof SlackEndpointOutputs> = CorsairEndpoint<
	SlackContext,
	SlackEndpointInputs[K],
	SlackEndpointOutputs[K]
>;
export const slackAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

/**
 * const endpoints = ctx.endpoints as SlackBoundEndpoints
 */
export type SlackBoundEndpoints = BindEndpoints<typeof slackEndpointsNested>;

type SlackWebhook<K extends keyof SlackWebhookOutputs, TEvent> = CorsairWebhook<
	SlackContext,
	SlackWebhookPayload<TEvent>,
	SlackWebhookOutputs[K]
>;

export type SlackBoundWebhooks = BindWebhooks<SlackWebhooks>;

export type SlackPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	signingSecret?: string;
	hooks?: InternalSlackPlugin['hooks'];
	webhookHooks?: InternalSlackPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the Slack plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overrides use dot-notation paths from the Slack endpoint tree — invalid paths are type errors.
	 */
	permissions?: PluginPermissionsConfig<typeof slackEndpointsNested>;
};

export type SlackContext = CorsairPluginContext<
	typeof SlackSchema,
	SlackPluginOptions
>;

export type SlackKeyBuilderContext = KeyBuilderContext<SlackPluginOptions>;

export type BaseSlackPlugin<PluginOptions extends SlackPluginOptions> =
	CorsairPlugin<
		'slack',
		typeof SlackSchema,
		typeof slackEndpointsNested,
		typeof slackWebhooksNested,
		PluginOptions,
		typeof defaultAuthType
	>;

/**
 * We have to type the internal plugin separately from the external plugin
 * Because the internal plugin has to provide options for all possible auth methods
 * The external plugin has to provide options for the auth method the user has selected
 */
export type InternalSlackPlugin = BaseSlackPlugin<SlackPluginOptions>;

export type ExternalSlackPlugin<PluginOptions extends SlackPluginOptions> =
	BaseSlackPlugin<PluginOptions>;

export function slack<const PluginOptions extends SlackPluginOptions>(
	incomingOptions: SlackPluginOptions &
		PluginOptions = {} as SlackPluginOptions & PluginOptions,
): ExternalSlackPlugin<PluginOptions> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'slack',
		schema: SlackSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: slackEndpointsNested,
		webhooks: slackWebhooksNested,
		endpointMeta: slackEndpointMeta,
		endpointSchemas: slackEndpointSchemas,
		webhookSchemas: slackWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			const hasSlackSignature = 'x-slack-signature' in headers;
			const hasSlackTimestamp = 'x-slack-request-timestamp' in headers;

			return hasSlackSignature && hasSlackTimestamp;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: SlackKeyBuilderContext, source) => {
			if (source === 'webhook' && options.signingSecret) {
				return options.signingSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();

				if (!res) {
					// prob need to throw an error here
					return '';
				}

				return res;
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			// Check ctx.authType to narrow ctx.keys to the correct key manager type
			if (ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();

				if (!res) {
					// prob need to throw an error here
					return '';
				}

				return res;
			} else if (ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();

				if (!res) {
					// prob need to throw an error here
					return '';
				}

				return res;
			}

			return '';
		},
	} satisfies InternalSlackPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	AllMessageEvents,
	AppMentionEvent,
	BotMessageEvent,
	BotProfile,
	ChannelArchiveMessageEvent,
	ChannelCreatedEvent,
	ChannelJoinMessageEvent,
	ChannelLeaveMessageEvent,
	ChannelNameMessageEvent,
	ChannelPostingPermissionsMessageEvent,
	ChannelPurposeMessageEvent,
	ChannelTopicMessageEvent,
	ChannelUnarchiveMessageEvent,
	EKMAccessDeniedMessageEvent,
	FileCreatedEvent,
	FilePublicEvent,
	FileSharedEvent,
	FileShareMessageEvent,
	GenericMessageEvent,
	MeMessageEvent,
	MessageChangedEvent,
	MessageDeletedEvent,
	MessageEvent,
	MessageRepliedEvent,
	ReactionAddedEvent,
	ReactionItem,
	ReactionRemovedEvent,
	SlackEventMap,
	SlackEventName,
	SlackEventPayload,
	SlackMessageObject,
	SlackUrlVerificationPayload,
	SlackWebhookOutputs,
	SlackWebhookPayload,
	StatusEmojiDisplayInfo,
	TeamJoinEvent,
	ThreadBroadcastMessageEvent,
	UserChangeEvent,
} from './webhooks/types';

export { createSlackEventMatch } from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	ChatDeleteResponse,
	ChatGetPermalinkResponse,
	ChatPostMessageResponse,
	ChatUpdateResponse,
	ConversationsArchiveResponse,
	ConversationsCloseResponse,
	ConversationsCreateResponse,
	ConversationsHistoryResponse,
	ConversationsInfoResponse,
	ConversationsInviteResponse,
	ConversationsJoinResponse,
	ConversationsKickResponse,
	ConversationsLeaveResponse,
	ConversationsListResponse,
	ConversationsMembersResponse,
	ConversationsOpenResponse,
	ConversationsRenameResponse,
	ConversationsRepliesResponse,
	ConversationsSetPurposeResponse,
	ConversationsSetTopicResponse,
	ConversationsUnarchiveResponse,
	FilesInfoResponse,
	FilesListResponse,
	FilesUploadResponse,
	ReactionsAddResponse,
	ReactionsGetResponse,
	ReactionsRemoveResponse,
	SearchMessagesResponse,
	SlackEndpointOutputs,
	StarsAddResponse,
	StarsListResponse,
	StarsRemoveResponse,
	UsergroupsCreateResponse,
	UsergroupsDisableResponse,
	UsergroupsEnableResponse,
	UsergroupsListResponse,
	UsergroupsUpdateResponse,
	UsersGetPresenceResponse,
	UsersInfoResponse,
	UsersListResponse,
	UsersProfileGetResponse,
	UsersProfileSetResponse,
} from './endpoints/types';
