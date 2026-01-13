import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
} from '../../core';
import * as channelsEndpoints from './endpoints/channels';
import * as filesEndpoints from './endpoints/files';
import * as messagesEndpoints from './endpoints/messages';
import * as reactionsEndpoints from './endpoints/reactions';
import type { SlackReactionName } from './endpoints/reactions';
import * as starsEndpoints from './endpoints/stars';
import * as userGroupsEndpoints from './endpoints/user-groups';
import * as usersEndpoints from './endpoints/users';
import type { SlackCredentials } from './schema';
import { SlackSchema } from './schema';

// export * from './webhooks';

import type {
	ReactionAddedEvent,
	SlackEndpointOutputs,
	SlackWebhookOutputs,
	SlackWebhookPayload,
} from './types';
import * as reactionsWebhooks from './webhooks/reactions';

export type * from './types';

export type SlackContext = CorsairPluginContext<
	'slack',
	typeof SlackSchema,
	SlackCredentials
>;

type SlackEndpoint<
	K extends keyof SlackEndpointOutputs,
	Input,
> = CorsairEndpoint<SlackContext, Input, SlackEndpointOutputs[K]>;

export type SlackEndpoints = {
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
			usergroup: string;
			include_count?: boolean;
			team_id?: string;
		}
	>;
	userGroupsEnable: SlackEndpoint<
		'userGroupsEnable',
		{
			usergroup: string;
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
			usergroup: string;
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

/**
 * const endpoints = ctx.endpoints as SlackBoundEndpoints
 */
export type SlackBoundEndpoints = BindEndpoints<SlackEndpoints>;

type SlackWebhook<K extends keyof SlackWebhookOutputs, TEvent> = CorsairWebhook<
	SlackContext,
	SlackWebhookPayload<TEvent>,
	SlackWebhookOutputs[K]
>;

export type SlackWebhooks = {
	reactionAdded: SlackWebhook<'reactionAdded', ReactionAddedEvent>;
};

export type SlackBoundWebhooks = BindWebhooks<SlackWebhooks>;

const slackEndpointsNested = {
	channels: {
		archive: channelsEndpoints.archive,
		close: channelsEndpoints.close,
		create: channelsEndpoints.create,
		get: channelsEndpoints.get,
		list: channelsEndpoints.list,
		getHistory: channelsEndpoints.getHistory,
		invite: channelsEndpoints.invite,
		join: channelsEndpoints.join,
		kick: channelsEndpoints.kick,
		leave: channelsEndpoints.leave,
		getMembers: channelsEndpoints.getMembers,
		open: channelsEndpoints.open,
		rename: channelsEndpoints.rename,
		getReplies: channelsEndpoints.getReplies,
		setPurpose: channelsEndpoints.setPurpose,
		setTopic: channelsEndpoints.setTopic,
		unarchive: channelsEndpoints.unarchive,
	},
	users: {
		get: usersEndpoints.get,
		list: usersEndpoints.list,
		getProfile: usersEndpoints.getProfile,
		getPresence: usersEndpoints.getPresence,
		updateProfile: usersEndpoints.updateProfile,
	},
	userGroups: {
		create: userGroupsEndpoints.create,
		disable: userGroupsEndpoints.disable,
		enable: userGroupsEndpoints.enable,
		list: userGroupsEndpoints.list,
		update: userGroupsEndpoints.update,
	},
	files: {
		get: filesEndpoints.get,
		list: filesEndpoints.list,
		upload: filesEndpoints.upload,
	},
	messages: {
		delete: messagesEndpoints.deleteMessage,
		getPermalink: messagesEndpoints.getPermalink,
		search: messagesEndpoints.search,
		post: messagesEndpoints.postMessage,
		update: messagesEndpoints.update,
	},
	reactions: {
		add: reactionsEndpoints.add,
		get: reactionsEndpoints.get,
		remove: reactionsEndpoints.remove,
	},
	stars: {
		add: starsEndpoints.add,
		remove: starsEndpoints.remove,
		list: starsEndpoints.list,
	},
} as const;

const slackWebhooksNested = {
	reactions: {
		added: reactionsWebhooks.added,
	},
} as const;

export type SlackPluginOptions = {
	/**
	 * Slack credentials including bot token and optionally signing secret for webhook verification.
	 */
	credentials: SlackCredentials;

	hooks?: SlackPlugin['hooks'] | undefined;

	webhookHooks?: SlackPlugin['webhookHooks'] | undefined;
};

export type SlackPlugin = CorsairPlugin<
	'slack',
	typeof slackEndpointsNested,
	typeof SlackSchema,
	SlackCredentials,
	typeof slackWebhooksNested
>;

export function slack(options: SlackPluginOptions) {
	return {
		id: 'slack',
		schema: SlackSchema,
		options: options.credentials,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: slackEndpointsNested,
		webhooks: slackWebhooksNested,
	} satisfies SlackPlugin;
}
