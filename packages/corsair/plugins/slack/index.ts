import type { AuthTypes } from '../../constants';
import type {
	BindEndpoints,
	BindWebhooks,
	BoundWebhookTree,
	CorsairEndpoint,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	RawWebhookRequest,
	WebhookRequest,
	WebhookResponse,
} from '../../core';
import { findMatchingWebhook } from '../../webhooks';
import * as channelsEndpoints from './endpoints/channels';
import * as filesEndpoints from './endpoints/files';
import * as messagesEndpoints from './endpoints/messages';
import type { SlackReactionName } from './endpoints/reactions';

export type { SlackReactionName } from './endpoints/reactions';

import * as reactionsEndpoints from './endpoints/reactions';
import * as starsEndpoints from './endpoints/stars';
import type { SlackEndpointOutputs } from './endpoints/types';
import * as userGroupsEndpoints from './endpoints/user-groups';
import * as usersEndpoints from './endpoints/users';
import type { SlackCredentials } from './schema';
import { SlackSchema } from './schema';
import * as channelsWebhooks from './webhooks/channels';
import * as filesWebhooks from './webhooks/files';
import * as messagesWebhooks from './webhooks/messages';
import * as reactionsWebhooks from './webhooks/reactions';
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
import * as usersWebhooks from './webhooks/users';

// const slackActionMatchMap: Record<
// 	string,
// 	(headers: Record<string, unknown>, body: any) => boolean
// > = {
// 	reaction_added: reactionsWebhooks.addedMatch,
// 	message: messagesWebhooks.messageMatch,
// 	channel_created: channelsWebhooks.createdMatch,
// 	team_join: usersWebhooks.teamJoinMatch,
// 	user_change: usersWebhooks.userChangeMatch,
// 	file_created: filesWebhooks.createdMatch,
// 	file_public: filesWebhooks.publicMatch,
// 	file_shared: filesWebhooks.sharedMatch,
// };

// const slackActionHandlerMap: Record<string, string[]> = {
// 	reaction_added: ['reactions', 'added'],
// 	message: ['messages', 'message'],
// 	channel_created: ['channels', 'created'],
// 	team_join: ['users', 'teamJoin'],
// 	user_change: ['users', 'userChange'],
// 	file_created: ['files', 'created'],
// 	file_public: ['files', 'public'],
// 	file_shared: ['files', 'shared'],
// };

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

/**
 * const endpoints = ctx.endpoints as SlackBoundEndpoints
 */
export type SlackBoundEndpoints = BindEndpoints<SlackEndpoints>;

type SlackWebhookDef<
	K extends keyof SlackWebhookOutputs,
	TEvent,
> = CorsairWebhook<
	SlackContext,
	SlackWebhookPayload<TEvent>,
	SlackWebhookOutputs[K]
>;

export type SlackWebhooks = {
	reactionAdded: SlackWebhookDef<'reactionAdded', ReactionAddedEvent>;
	message: SlackWebhookDef<'message', MessageEvent>;
	channelCreated: SlackWebhookDef<'channelCreated', ChannelCreatedEvent>;
	teamJoin: SlackWebhookDef<'teamJoin', TeamJoinEvent>;
	userChange: SlackWebhookDef<'userChange', UserChangeEvent>;
	fileCreated: SlackWebhookDef<'fileCreated', FileCreatedEvent>;
	filePublic: SlackWebhookDef<'filePublic', FilePublicEvent>;
	fileShared: SlackWebhookDef<'fileShared', FileSharedEvent>;
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
	messages: {
		message: messagesWebhooks.message,
	},
	channels: {
		created: channelsWebhooks.created,
	},
	reactions: {
		added: reactionsWebhooks.added,
	},
	users: {
		teamJoin: usersWebhooks.teamJoin,
		userChange: usersWebhooks.userChange,
	},
	files: {
		created: filesWebhooks.created,
		public: filesWebhooks.publicFile,
		shared: filesWebhooks.shared,
	},
} as const;

export type SlackPluginOptions = {
	authType: AuthTypes;

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
		pluginWebhookMatcher: async (
			request: RawWebhookRequest,
			webhooks: BoundWebhookTree,
			body: unknown,
			normalizedHeaders: Record<string, string | undefined>,
			pluginId: string,
		) => {
			const parsedBody =
				typeof body === 'string' ? JSON.parse(body) : body;

			const hasSlackHeader =
				normalizedHeaders['x-slack-signature'] !== undefined ||
				normalizedHeaders['x-slack-request-timestamp'] !== undefined;

			const isSlackBody =
				parsedBody &&
				typeof parsedBody === 'object' &&
				'type' in parsedBody &&
				(parsedBody.type === 'event_callback' ||
					parsedBody.type === 'url_verification');

			if (!hasSlackHeader && !isSlackBody) {
				return null;
			}

			const matched = findMatchingWebhook(webhooks, request);

			if (!matched) {
				return null;
			}

			const action = matched.path.join('.');

			const webhookRequest: WebhookRequest = {
				payload: parsedBody,
				headers: normalizedHeaders,
				rawBody: typeof body === 'string' ? body : undefined,
			};

			try {
				const response = await matched.webhook.handler(webhookRequest);
				return {
					plugin: pluginId,
					action,
					body: parsedBody,
					response,
				};
			} catch (error) {
				console.error(
					`Error executing webhook handler for ${pluginId}.${action}:`,
					error,
				);
				return {
					plugin: pluginId,
					action,
					body: parsedBody,
					response: {
						success: false,
						error: error instanceof Error ? error.message : 'Unknown error',
					},
				};
			}
		},
	} satisfies SlackPlugin;
}
