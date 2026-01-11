import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairPlugin,
	CorsairPluginContext,
} from '../../core';
import * as channelsEndpoints from './endpoints/channels';
import * as filesEndpoints from './endpoints/files';
import * as messagesEndpoints from './endpoints/messages';
import * as reactionsEndpoints from './endpoints/reactions';
import * as starsEndpoints from './endpoints/stars';
import * as userGroupsEndpoints from './endpoints/user-groups';
import * as usersEndpoints from './endpoints/users';
import type { SlackCredentials } from './schema';
import { SlackSchema } from './schema';

export type SlackPluginOptions = {
	/**
	 * Example option. Not used in this barebones plugin yet.
	 */
	credentials: SlackCredentials;
	/**
	 * Optional per-endpoint hooks for this plugin instance.
	 *
	 * Example:
	 * hooks: {
	 *   postMessage: { before: async (ctx, input) => {}, after: async (ctx, res) => {} }
	 * }
	 */
	hooks?: CorsairPlugin<'slack', SlackEndpoints>['hooks'] | undefined;
};

/**
 * Slack context type with credentials, ORM services, and access to all endpoints.
 *
 * Every endpoint receives this context and can call other endpoints via `ctx.endpoints.*`:
 *
 * @example
 * ```ts
 * const postMessage: SlackEndpoints['postMessage'] = async (ctx, input) => {
 *   // Get channel info before posting
 *   const channel = await ctx.endpoints.channelsGet({ channel: input.channel });
 *   // ...
 * };
 * ```
 *
 * Note: `ctx.endpoints` is loosely typed as `Record<string, BoundEndpointFn>` to avoid
 * circular type references. The calls work at runtime; for full type safety on a specific
 * call, you can use `SlackBoundEndpoints` type assertions if needed.
 */
export type SlackContext = CorsairPluginContext<
	'slack',
	typeof SlackSchema,
	SlackCredentials
>;

/**
 * Fully-typed bound endpoints for Slack. Use this for type assertions when you need
 * precise typing on endpoint calls within implementations.
 *
 * const endpoints = ctx.endpoints as SlackBoundEndpoints
 */
export type SlackBoundEndpoints = BindEndpoints<SlackEndpoints>;

export type SlackEndpoints = {
	channelsArchive: CorsairEndpoint<
		SlackContext,
		{ channel: string },
		{ ok: boolean; error?: string }
	>;
	channelsClose: CorsairEndpoint<
		SlackContext,
		{ channel: string },
		{
			ok: boolean;
			error?: string;
			no_op?: boolean;
			already_closed?: boolean;
		}
	>;
	channelsCreate: CorsairEndpoint<
		SlackContext,
		{ name: string; is_private?: boolean; team_id?: string },
		{
			ok: boolean;
			channel?: { id: string; name: string };
			error?: string;
		}
	>;
	channelsGet: CorsairEndpoint<
		SlackContext,
		{
			channel: string;
			include_locale?: boolean;
			include_num_members?: boolean;
		},
		{
			ok: boolean;
			channel?: { id: string; name?: string };
			error?: string;
		}
	>;
	channelsList: CorsairEndpoint<
		SlackContext,
		{
			exclude_archived?: boolean;
			types?: string;
			team_id?: string;
			cursor?: string;
			limit?: number;
		},
		{
			ok: boolean;
			channels?: Array<{ id: string; name?: string }>;
			error?: string;
		}
	>;
	channelsGetHistory: CorsairEndpoint<
		SlackContext,
		{
			channel: string;
			latest?: string;
			oldest?: string;
			inclusive?: boolean;
			include_all_metadata?: boolean;
			cursor?: string;
			limit?: number;
		},
		{
			ok: boolean;
			messages?: Array<{ ts?: string; text?: string }>;
			has_more?: boolean;
			error?: string;
		}
	>;
	channelsInvite: CorsairEndpoint<
		SlackContext,
		{ channel: string; users: string; force?: boolean },
		{
			ok: boolean;
			channel?: { id: string; name?: string };
			error?: string;
		}
	>;
	channelsJoin: CorsairEndpoint<
		SlackContext,
		{ channel: string },
		{
			ok: boolean;
			channel?: { id: string; name?: string };
			warning?: string;
			error?: string;
		}
	>;
	channelsKick: CorsairEndpoint<
		SlackContext,
		{ channel: string; user: string },
		{ ok: boolean; error?: string }
	>;
	channelsLeave: CorsairEndpoint<
		SlackContext,
		{ channel: string },
		{ ok: boolean; not_in_channel?: boolean; error?: string }
	>;
	channelsGetMembers: CorsairEndpoint<
		SlackContext,
		{ channel: string; cursor?: string; limit?: number },
		{ ok: boolean; members?: string[]; error?: string }
	>;
	channelsOpen: CorsairEndpoint<
		SlackContext,
		{
			channel?: string;
			users?: string;
			prevent_creation?: boolean;
			return_im?: boolean;
		},
		{
			ok: boolean;
			channel?: { id: string; name?: string };
			no_op?: boolean;
			already_open?: boolean;
			error?: string;
		}
	>;
	channelsRename: CorsairEndpoint<
		SlackContext,
		{ channel: string; name: string },
		{
			ok: boolean;
			channel?: { id: string; name?: string };
			error?: string;
		}
	>;
	channelsGetReplies: CorsairEndpoint<
		SlackContext,
		{
			channel: string;
			ts: string;
			latest?: string;
			oldest?: string;
			inclusive?: boolean;
			include_all_metadata?: boolean;
			cursor?: string;
			limit?: number;
		},
		{
			ok: boolean;
			messages?: Array<{ ts?: string; text?: string }>;
			has_more?: boolean;
			error?: string;
		}
	>;
	channelsSetPurpose: CorsairEndpoint<
		SlackContext,
		{ channel: string; purpose: string },
		{
			ok: boolean;
			channel?: { id: string; name?: string };
			purpose?: string;
			error?: string;
		}
	>;
	channelsSetTopic: CorsairEndpoint<
		SlackContext,
		{ channel: string; topic: string },
		{
			ok: boolean;
			channel?: { id: string; name?: string };
			topic?: string;
			error?: string;
		}
	>;
	channelsUnarchive: CorsairEndpoint<
		SlackContext,
		{ channel: string },
		{ ok: boolean; error?: string }
	>;
	usersGet: CorsairEndpoint<
		SlackContext,
		{ user: string; include_locale?: boolean },
		{
			ok: boolean;
			user?: { id: string; name?: string };
			error?: string;
		}
	>;
	usersList: CorsairEndpoint<
		SlackContext,
		{
			include_locale?: boolean;
			team_id?: string;
			cursor?: string;
			limit?: number;
		},
		{
			ok: boolean;
			members?: Array<{ id: string; name?: string }>;
			cache_ts?: number;
			error?: string;
		}
	>;
	usersGetProfile: CorsairEndpoint<
		SlackContext,
		{ user?: string; include_labels?: boolean },
		{
			ok: boolean;
			profile?: { avatar_hash?: string; real_name?: string };
			error?: string;
		}
	>;
	usersGetPresence: CorsairEndpoint<
		SlackContext,
		{ user?: string },
		{
			ok: boolean;
			presence?: string;
			online?: boolean;
			error?: string;
		}
	>;
	usersUpdateProfile: CorsairEndpoint<
		SlackContext,
		{
			profile?: Record<string, unknown>;
			user?: string;
			name?: string;
			value?: string;
		},
		{
			ok: boolean;
			profile?: { avatar_hash?: string; real_name?: string };
			error?: string;
		}
	>;
	userGroupsCreate: CorsairEndpoint<
		SlackContext,
		{
			name: string;
			channels?: string;
			description?: string;
			handle?: string;
			include_count?: boolean;
			team_id?: string;
		},
		{
			ok: boolean;
			usergroup?: { id: string; name?: string };
			error?: string;
		}
	>;
	userGroupsDisable: CorsairEndpoint<
		SlackContext,
		{
			usergroup: string;
			include_count?: boolean;
			team_id?: string;
		},
		{
			ok: boolean;
			usergroup?: { id: string; name?: string };
			error?: string;
		}
	>;
	userGroupsEnable: CorsairEndpoint<
		SlackContext,
		{
			usergroup: string;
			include_count?: boolean;
			team_id?: string;
		},
		{
			ok: boolean;
			usergroup?: { id: string; name?: string };
			error?: string;
		}
	>;
	userGroupsList: CorsairEndpoint<
		SlackContext,
		{
			include_count?: boolean;
			include_disabled?: boolean;
			include_users?: boolean;
			team_id?: string;
		},
		{
			ok: boolean;
			userGroups?: Array<{ id: string; name?: string }>;
			error?: string;
		}
	>;
	userGroupsUpdate: CorsairEndpoint<
		SlackContext,
		{
			usergroup: string;
			name?: string;
			channels?: string;
			description?: string;
			handle?: string;
			include_count?: boolean;
			team_id?: string;
		},
		{
			ok: boolean;
			usergroup?: { id: string; name?: string };
			error?: string;
		}
	>;
	filesGet: CorsairEndpoint<
		SlackContext,
		{
			file: string;
			cursor?: string;
			limit?: number;
			page?: number;
			count?: number;
		},
		{
			ok: boolean;
			file?: { id: string; name?: string };
			error?: string;
		}
	>;
	filesList: CorsairEndpoint<
		SlackContext,
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
		},
		{
			ok: boolean;
			files?: Array<{ id: string; name?: string }>;
			error?: string;
		}
	>;
	filesUpload: CorsairEndpoint<
		SlackContext,
		{
			channels?: string;
			content?: string;
			file?: unknown;
			filename?: string;
			filetype?: string;
			initial_comment?: string;
			thread_ts?: string;
			title?: string;
		},
		{
			ok: boolean;
			file?: { id: string; name?: string };
			error?: string;
		}
	>;
	messagesDelete: CorsairEndpoint<
		SlackContext,
		{ channel: string; ts: string; as_user?: boolean },
		{ ok: boolean; channel?: string; ts?: string; error?: string }
	>;
	messagesGetPermalink: CorsairEndpoint<
		SlackContext,
		{ channel: string; message_ts: string },
		{
			ok: boolean;
			channel?: string;
			permalink?: string;
			error?: string;
		}
	>;
	messagesSearch: CorsairEndpoint<
		SlackContext,
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
		},
		{
			ok: boolean;
			query?: string;
			messages?: { matches?: Array<{ ts?: string; text?: string }> };
			error?: string;
		}
	>;
	postMessage: CorsairEndpoint<
		SlackContext,
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
		},
		{
			ok: boolean;
			channel?: string;
			ts?: string;
			message?: { ts?: string; text?: string };
			error?: string;
		}
	>;
	messagesUpdate: CorsairEndpoint<
		SlackContext,
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
		},
		{
			ok: boolean;
			channel?: string;
			ts?: string;
			text?: string;
			message?: { ts?: string; text?: string };
			error?: string;
		}
	>;
	reactionsAdd: CorsairEndpoint<
		SlackContext,
		{ channel: string; timestamp: string; name: string },
		{ ok: boolean; error?: string }
	>;
	reactionsGet: CorsairEndpoint<
		SlackContext,
		{
			channel?: string;
			timestamp?: string;
			file?: string;
			file_comment?: string;
			full?: boolean;
		},
		{
			ok: boolean;
			type?: string;
			message?: { ts?: string };
			error?: string;
		}
	>;
	reactionsRemove: CorsairEndpoint<
		SlackContext,
		{
			name: string;
			channel?: string;
			timestamp?: string;
			file?: string;
			file_comment?: string;
		},
		{ ok: boolean; error?: string }
	>;
	starsAdd: CorsairEndpoint<
		SlackContext,
		{
			channel?: string;
			timestamp?: string;
			file?: string;
			file_comment?: string;
		},
		{ ok: boolean; error?: string }
	>;
	starsRemove: CorsairEndpoint<
		SlackContext,
		{
			channel?: string;
			timestamp?: string;
			file?: string;
			file_comment?: string;
		},
		{ ok: boolean; error?: string }
	>;
	starsList: CorsairEndpoint<
		SlackContext,
		{
			team_id?: string;
			cursor?: string;
			limit?: number;
			page?: number;
			count?: number;
		},
		{
			ok: boolean;
			items?: Array<{ type?: string; date_create?: number }>;
			error?: string;
		}
	>;
};

export function slack(options: SlackPluginOptions) {
	return {
		id: 'slack',
		schema: SlackSchema,
		options: options.credentials,
		hooks: options.hooks,
		endpoints: {
			channelsArchive: channelsEndpoints.archive,
			channelsClose: channelsEndpoints.close,
			channelsCreate: channelsEndpoints.create,
			channelsGet: channelsEndpoints.get,
			channelsList: channelsEndpoints.list,
			channelsGetHistory: channelsEndpoints.getHistory,
			channelsInvite: channelsEndpoints.invite,
			channelsJoin: channelsEndpoints.join,
			channelsKick: channelsEndpoints.kick,
			channelsLeave: channelsEndpoints.leave,
			channelsGetMembers: channelsEndpoints.getMembers,
			channelsOpen: channelsEndpoints.open,
			channelsRename: channelsEndpoints.rename,
			channelsGetReplies: channelsEndpoints.getReplies,
			channelsSetPurpose: channelsEndpoints.setPurpose,
			channelsSetTopic: channelsEndpoints.setTopic,
			channelsUnarchive: channelsEndpoints.unarchive,
			usersGet: usersEndpoints.get,
			usersList: usersEndpoints.list,
			usersGetProfile: usersEndpoints.getProfile,
			usersGetPresence: usersEndpoints.getPresence,
			usersUpdateProfile: usersEndpoints.updateProfile,
			userGroupsCreate: userGroupsEndpoints.create,
			userGroupsDisable: userGroupsEndpoints.disable,
			userGroupsEnable: userGroupsEndpoints.enable,
			userGroupsList: userGroupsEndpoints.list,
			userGroupsUpdate: userGroupsEndpoints.update,
			filesGet: filesEndpoints.get,
			filesList: filesEndpoints.list,
			filesUpload: filesEndpoints.upload,
			messagesDelete: messagesEndpoints.deleteMessage,
			messagesGetPermalink: messagesEndpoints.getPermalink,
			messagesSearch: messagesEndpoints.search,
			postMessage: messagesEndpoints.postMessage,
			messagesUpdate: messagesEndpoints.update,
			reactionsAdd: reactionsEndpoints.add,
			reactionsGet: reactionsEndpoints.get,
			reactionsRemove: reactionsEndpoints.remove,
			starsAdd: starsEndpoints.add,
			starsRemove: starsEndpoints.remove,
			starsList: starsEndpoints.list,
		} as SlackEndpoints,
	} satisfies CorsairPlugin<
		'slack',
		SlackEndpoints,
		typeof SlackSchema,
		SlackCredentials
	>;
}
