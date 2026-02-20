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
} from '../../core';
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

export type { SlackReactionName } from './endpoints';

import type { AuthTypes, PickAuth } from '../../core/constants';
import { errorHandlers } from './error-handlers';

export type SlackEndpoints = {
	channelsRandom: SlackEndpoint<'channelsRandom'>;
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
		random: Channels.random,
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
	ChannelsRandomResponse,
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
