import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
} from '../../core';
import type { SlackEndpointOutputs, SlackReactionName } from './endpoints';
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
	ChannelWebhooks,
	FileWebhooks,
	MessageWebhooks,
	ReactionWebhooks,
	UserWebhooks,
} from './webhooks';
import type {
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

import type { AuthTypes } from '../../constants';
import type { PickAuth } from '../../core/constants';
import { errorHandlers } from './error-handlers';

export type SlackEndpoints = {
	channelsRandom: SlackEndpoint<'channelsRandom', {}>;
	channelsArchive: SlackEndpoint<'channelsArchive', { channel: string }>;
	channelsClose: SlackEndpoint<'channelsClose', { channel: string }>;
	channelsCreate: SlackEndpoint<
		'channelsCreate',
		{ name: string; is_private?: boolean; team_id?: string }
	>;
	channelsGet: SlackEndpoint<
		'channelsGet',
		{
			channel: string;
			include_locale?: boolean;
			include_num_members?: boolean;
		}
	>;
	channelsList: SlackEndpoint<
		'channelsList',
		{
			exclude_archived?: boolean;
			types?: string;
			team_id?: string;
			cursor?: string;
			limit?: number;
		}
	>;
	channelsGetHistory: SlackEndpoint<
		'channelsGetHistory',
		{
			channel: string;
			latest?: string;
			oldest?: string;
			inclusive?: boolean;
			include_all_metadata?: boolean;
			cursor?: string;
			limit?: number;
		}
	>;
	channelsInvite: SlackEndpoint<
		'channelsInvite',
		{ channel: string; users: string; force?: boolean }
	>;
	channelsJoin: SlackEndpoint<'channelsJoin', { channel: string }>;
	channelsKick: SlackEndpoint<
		'channelsKick',
		{ channel: string; user: string }
	>;
	channelsLeave: SlackEndpoint<'channelsLeave', { channel: string }>;
	channelsGetMembers: SlackEndpoint<
		'channelsGetMembers',
		{ channel: string; cursor?: string; limit?: number }
	>;
	channelsOpen: SlackEndpoint<
		'channelsOpen',
		{
			channel?: string;
			users?: string;
			prevent_creation?: boolean;
			return_im?: boolean;
		}
	>;
	channelsRename: SlackEndpoint<
		'channelsRename',
		{ channel: string; name: string }
	>;
	channelsGetReplies: SlackEndpoint<
		'channelsGetReplies',
		{
			channel: string;
			ts: string;
			latest?: string;
			oldest?: string;
			inclusive?: boolean;
			include_all_metadata?: boolean;
			cursor?: string;
			limit?: number;
		}
	>;
	channelsSetPurpose: SlackEndpoint<
		'channelsSetPurpose',
		{ channel: string; purpose: string }
	>;
	channelsSetTopic: SlackEndpoint<
		'channelsSetTopic',
		{ channel: string; topic: string }
	>;
	channelsUnarchive: SlackEndpoint<'channelsUnarchive', { channel: string }>;
	usersGet: SlackEndpoint<
		'usersGet',
		{ user: string; include_locale?: boolean }
	>;
	usersList: SlackEndpoint<
		'usersList',
		{
			include_locale?: boolean;
			team_id?: string;
			cursor?: string;
			limit?: number;
		}
	>;
	usersGetProfile: SlackEndpoint<
		'usersGetProfile',
		{ user?: string; include_labels?: boolean }
	>;
	usersGetPresence: SlackEndpoint<'usersGetPresence', { user?: string }>;
	usersUpdateProfile: SlackEndpoint<
		'usersUpdateProfile',
		{
			profile?: Record<string, unknown>;
			user?: string;
			name?: string;
			value?: string;
		}
	>;
	userGroupsCreate: SlackEndpoint<
		'userGroupsCreate',
		{
			name: string;
			channels?: string;
			description?: string;
			handle?: string;
			include_count?: boolean;
			team_id?: string;
		}
	>;
	userGroupsDisable: SlackEndpoint<
		'userGroupsDisable',
		{
			userGroup: string;
			include_count?: boolean;
			team_id?: string;
		}
	>;
	userGroupsEnable: SlackEndpoint<
		'userGroupsEnable',
		{
			userGroup: string;
			include_count?: boolean;
			team_id?: string;
		}
	>;
	userGroupsList: SlackEndpoint<
		'userGroupsList',
		{
			include_count?: boolean;
			include_disabled?: boolean;
			include_users?: boolean;
			team_id?: string;
		}
	>;
	userGroupsUpdate: SlackEndpoint<
		'userGroupsUpdate',
		{
			userGroup: string;
			name?: string;
			channels?: string;
			description?: string;
			handle?: string;
			include_count?: boolean;
			team_id?: string;
		}
	>;
	filesGet: SlackEndpoint<
		'filesGet',
		{
			file: string;
			cursor?: string;
			limit?: number;
			page?: number;
			count?: number;
		}
	>;
	filesList: SlackEndpoint<
		'filesList',
		{
			channel?: string;
			user?: string;
			types?: string;
			ts_from?: string;
			ts_to?: string;
			show_files_hidden_by_limit?: boolean;
			team_id?: string;
			page?: number;
			count?: number;
		}
	>;
	filesUpload: SlackEndpoint<
		'filesUpload',
		{
			channels?: string;
			content?: string;
			file?: unknown;
			filename?: string;
			filetype?: string;
			initial_comment?: string;
			thread_ts?: string;
			title?: string;
		}
	>;
	messagesDelete: SlackEndpoint<
		'messagesDelete',
		{ channel: string; ts: string; as_user?: boolean }
	>;
	messagesGetPermalink: SlackEndpoint<
		'messagesGetPermalink',
		{ channel: string; message_ts: string }
	>;
	messagesSearch: SlackEndpoint<
		'messagesSearch',
		{
			query: string;
			sort?: 'score' | 'timestamp';
			sort_dir?: 'asc' | 'desc';
			highlight?: boolean;
			team_id?: string;
			cursor?: string;
			limit?: number;
			page?: number;
			count?: number;
		}
	>;
	postMessage: SlackEndpoint<
		'postMessage',
		{
			channel: string;
			text?: string;
			blocks?: Array<{ type: string; [key: string]: unknown }>;
			attachments?: Array<{ [key: string]: unknown }>;
			thread_ts?: string;
			reply_broadcast?: boolean;
			parse?: 'full' | 'none';
			link_names?: boolean;
			unfurl_links?: boolean;
			unfurl_media?: boolean;
			mrkdwn?: boolean;
			as_user?: boolean;
			icon_emoji?: string;
			icon_url?: string;
			username?: string;
			metadata?: {
				event_type: string;
				event_payload: Record<string, unknown>;
			};
		}
	>;
	messagesUpdate: SlackEndpoint<
		'messagesUpdate',
		{
			channel: string;
			ts: string;
			text?: string;
			blocks?: Array<{ type: string; [key: string]: unknown }>;
			attachments?: Array<{ [key: string]: unknown }>;
			parse?: 'full' | 'none';
			link_names?: boolean;
			as_user?: boolean;
			file_ids?: string[];
			reply_broadcast?: boolean;
			metadata?: {
				event_type: string;
				event_payload: Record<string, unknown>;
			};
		}
	>;
	reactionsAdd: SlackEndpoint<
		'reactionsAdd',
		{
			channel: string;
			timestamp: string;
			name: SlackReactionName;
		}
	>;
	reactionsGet: SlackEndpoint<
		'reactionsGet',
		{
			channel?: string;
			timestamp?: string;
			file?: string;
			file_comment?: string;
			full?: boolean;
		}
	>;
	reactionsRemove: SlackEndpoint<
		'reactionsRemove',
		{
			name: SlackReactionName;
			channel?: string;
			timestamp?: string;
			file?: string;
			file_comment?: string;
		}
	>;
	starsAdd: SlackEndpoint<
		'starsAdd',
		{
			channel?: string;
			timestamp?: string;
			file?: string;
			file_comment?: string;
		}
	>;
	starsRemove: SlackEndpoint<
		'starsRemove',
		{
			channel?: string;
			timestamp?: string;
			file?: string;
			file_comment?: string;
		}
	>;
	starsList: SlackEndpoint<
		'starsList',
		{
			team_id?: string;
			cursor?: string;
			limit?: number;
			page?: number;
			count?: number;
		}
	>;
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

const defaultAuthType: AuthTypes = 'api_key';

type SlackEndpoint<
	K extends keyof SlackEndpointOutputs,
	Input,
> = CorsairEndpoint<SlackContext, Input, SlackEndpointOutputs[K]>;

/**
 * const endpoints = ctx.endpoints as SlackBoundEndpoints
 */
export type SlackBoundEndpoints = BindEndpoints<SlackEndpoints>;

type SlackWebhook<K extends keyof SlackWebhookOutputs, TEvent> = CorsairWebhook<
	SlackContext,
	SlackWebhookPayload<TEvent>,
	SlackWebhookOutputs[K]
>;

export type SlackBoundWebhooks = BindWebhooks<SlackWebhooks>;

export type SlackPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	hooks?: InternalSlackPlugin['hooks'];
	webhookHooks?: InternalSlackPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
};

export type SlackContext = CorsairPluginContext<
	typeof SlackSchema,
	SlackPluginOptions
>;
export type SlackKeyBuilderContext = KeyBuilderContext<SlackPluginOptions>;

export type BaseSlackPlugin<T extends SlackPluginOptions> = CorsairPlugin<
	'slack',
	typeof SlackSchema,
	typeof slackEndpointsNested,
	typeof slackWebhooksNested,
	T,
	typeof defaultAuthType
>;

/**
 * We have to type the internal plugin separately from the external plugin
 * Because the internal plugin has to provide options for all possible auth methods
 * The external plugin has to provide options for the auth method the user has selected
 */
export type InternalSlackPlugin = BaseSlackPlugin<SlackPluginOptions>;

export type ExternalSlackPlugin<T extends SlackPluginOptions> =
	BaseSlackPlugin<T>;

export function slack<const T extends SlackPluginOptions>(
	incomingOptions: SlackPluginOptions & T = {} as SlackPluginOptions & T,
): ExternalSlackPlugin<T> {
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
			return false;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: SlackKeyBuilderContext) => {
			if (options.key) {
				return options.key;
			}

			// Check ctx.authType to narrow ctx.keys to the correct key manager type
			if (ctx.authType === 'api_key') {
				// ctx.keys is narrowed to ApiKeyAccountKeyManager

				console.log('in api key section');
				const res = await ctx.keys.getApiKey();

				if (!res) {
					// prob need to throw an error here
					return '';
				}

				console.log(res);

				return res;
			} else if (ctx.authType === 'oauth_2') {
				const res = await ctx.keys.getAccessToken();

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
	SlackEndpointInputs,
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
