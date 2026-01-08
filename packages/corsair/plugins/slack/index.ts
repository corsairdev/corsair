import type {
	CorsairContext,
	CorsairEndpoint,
	CorsairPlugin,
} from '../../core';
import * as channelsEndpoints from './endpoints/channels';
import * as filesEndpoints from './endpoints/files';
import * as messagesEndpoints from './endpoints/messages';
import * as reactionsEndpoints from './endpoints/reactions';
import * as starsEndpoints from './endpoints/stars';
import * as usergroupsEndpoints from './endpoints/usergroups';
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

export type SlackEndpoints = {
	channelsArchive: CorsairEndpoint<
		CorsairContext,
		[{ channel: string; token?: string }],
		Promise<{ ok: boolean; error?: string }>
	>;
	channelsClose: CorsairEndpoint<
		CorsairContext,
		[{ channel: string; token?: string }],
		Promise<{ ok: boolean; error?: string; no_op?: boolean; already_closed?: boolean }>
	>;
	channelsCreate: CorsairEndpoint<
		CorsairContext,
		[{ name: string; is_private?: boolean; team_id?: string; token?: string }],
		Promise<{ ok: boolean; channel?: { id: string; name: string }; error?: string }>
	>;
	channelsGet: CorsairEndpoint<
		CorsairContext,
		[{ channel: string; include_locale?: boolean; include_num_members?: boolean; token?: string }],
		Promise<{ ok: boolean; channel?: { id: string; name?: string }; error?: string }>
	>;
	channelsList: CorsairEndpoint<
		CorsairContext,
		[{ exclude_archived?: boolean; types?: string; team_id?: string; cursor?: string; limit?: number; token?: string }],
		Promise<{ ok: boolean; channels?: Array<{ id: string; name?: string }>; error?: string }>
	>;
	channelsGetHistory: CorsairEndpoint<
		CorsairContext,
		[{ channel: string; latest?: string; oldest?: string; inclusive?: boolean; include_all_metadata?: boolean; cursor?: string; limit?: number; token?: string }],
		Promise<{ ok: boolean; messages?: Array<{ ts?: string; text?: string }>; has_more?: boolean; error?: string }>
	>;
	channelsInvite: CorsairEndpoint<
		CorsairContext,
		[{ channel: string; users: string; force?: boolean; token?: string }],
		Promise<{ ok: boolean; channel?: { id: string; name?: string }; error?: string }>
	>;
	channelsJoin: CorsairEndpoint<
		CorsairContext,
		[{ channel: string; token?: string }],
		Promise<{ ok: boolean; channel?: { id: string; name?: string }; warning?: string; error?: string }>
	>;
	channelsKick: CorsairEndpoint<
		CorsairContext,
		[{ channel: string; user: string; token?: string }],
		Promise<{ ok: boolean; error?: string }>
	>;
	channelsLeave: CorsairEndpoint<
		CorsairContext,
		[{ channel: string; token?: string }],
		Promise<{ ok: boolean; not_in_channel?: boolean; error?: string }>
	>;
	channelsGetMembers: CorsairEndpoint<
		CorsairContext,
		[{ channel: string; cursor?: string; limit?: number; token?: string }],
		Promise<{ ok: boolean; members?: string[]; error?: string }>
	>;
	channelsOpen: CorsairEndpoint<
		CorsairContext,
		[{ channel?: string; users?: string; prevent_creation?: boolean; return_im?: boolean; token?: string }],
		Promise<{ ok: boolean; channel?: { id: string; name?: string }; no_op?: boolean; already_open?: boolean; error?: string }>
	>;
	channelsRename: CorsairEndpoint<
		CorsairContext,
		[{ channel: string; name: string; token?: string }],
		Promise<{ ok: boolean; channel?: { id: string; name?: string }; error?: string }>
	>;
	channelsGetReplies: CorsairEndpoint<
		CorsairContext,
		[{ channel: string; ts: string; latest?: string; oldest?: string; inclusive?: boolean; include_all_metadata?: boolean; cursor?: string; limit?: number; token?: string }],
		Promise<{ ok: boolean; messages?: Array<{ ts?: string; text?: string }>; has_more?: boolean; error?: string }>
	>;
	channelsSetPurpose: CorsairEndpoint<
		CorsairContext,
		[{ channel: string; purpose: string; token?: string }],
		Promise<{ ok: boolean; channel?: { id: string; name?: string }; purpose?: string; error?: string }>
	>;
	channelsSetTopic: CorsairEndpoint<
		CorsairContext,
		[{ channel: string; topic: string; token?: string }],
		Promise<{ ok: boolean; channel?: { id: string; name?: string }; topic?: string; error?: string }>
	>;
	channelsUnarchive: CorsairEndpoint<
		CorsairContext,
		[{ channel: string; token?: string }],
		Promise<{ ok: boolean; error?: string }>
	>;
	usersGet: CorsairEndpoint<
		CorsairContext,
		[{ user: string; include_locale?: boolean; token?: string }],
		Promise<{ ok: boolean; user?: { id: string; name?: string }; error?: string }>
	>;
	usersList: CorsairEndpoint<
		CorsairContext,
		[{ include_locale?: boolean; team_id?: string; cursor?: string; limit?: number; token?: string }],
		Promise<{ ok: boolean; members?: Array<{ id: string; name?: string }>; cache_ts?: number; error?: string }>
	>;
	usersGetProfile: CorsairEndpoint<
		CorsairContext,
		[{ user?: string; include_labels?: boolean; token?: string }],
		Promise<{ ok: boolean; profile?: { avatar_hash?: string; real_name?: string }; error?: string }>
	>;
	usersGetPresence: CorsairEndpoint<
		CorsairContext,
		[{ user?: string; token?: string }],
		Promise<{ ok: boolean; presence?: string; online?: boolean; error?: string }>
	>;
	usersUpdateProfile: CorsairEndpoint<
		CorsairContext,
		[{ profile?: Record<string, unknown>; user?: string; name?: string; value?: string; token?: string }],
		Promise<{ ok: boolean; profile?: { avatar_hash?: string; real_name?: string }; error?: string }>
	>;
	usergroupsCreate: CorsairEndpoint<
		CorsairContext,
		[{ name: string; channels?: string; description?: string; handle?: string; include_count?: boolean; team_id?: string; token?: string }],
		Promise<{ ok: boolean; usergroup?: { id: string; name?: string }; error?: string }>
	>;
	usergroupsDisable: CorsairEndpoint<
		CorsairContext,
		[{ usergroup: string; include_count?: boolean; team_id?: string; token?: string }],
		Promise<{ ok: boolean; usergroup?: { id: string; name?: string }; error?: string }>
	>;
	usergroupsEnable: CorsairEndpoint<
		CorsairContext,
		[{ usergroup: string; include_count?: boolean; team_id?: string; token?: string }],
		Promise<{ ok: boolean; usergroup?: { id: string; name?: string }; error?: string }>
	>;
	usergroupsList: CorsairEndpoint<
		CorsairContext,
		[{ include_count?: boolean; include_disabled?: boolean; include_users?: boolean; team_id?: string; token?: string }],
		Promise<{ ok: boolean; usergroups?: Array<{ id: string; name?: string }>; error?: string }>
	>;
	usergroupsUpdate: CorsairEndpoint<
		CorsairContext,
		[{ usergroup: string; name?: string; channels?: string; description?: string; handle?: string; include_count?: boolean; team_id?: string; token?: string }],
		Promise<{ ok: boolean; usergroup?: { id: string; name?: string }; error?: string }>
	>;
	filesGet: CorsairEndpoint<
		CorsairContext,
		[{ file: string; cursor?: string; limit?: number; page?: number; count?: number; token?: string }],
		Promise<{ ok: boolean; file?: { id: string; name?: string }; error?: string }>
	>;
	filesList: CorsairEndpoint<
		CorsairContext,
		[{ channel?: string; user?: string; types?: string; ts_from?: string; ts_to?: string; show_files_hidden_by_limit?: boolean; team_id?: string; page?: number; count?: number; token?: string }],
		Promise<{ ok: boolean; files?: Array<{ id: string; name?: string }>; error?: string }>
	>;
	filesUpload: CorsairEndpoint<
		CorsairContext,
		[{ channels?: string; content?: string; file?: unknown; filename?: string; filetype?: string; initial_comment?: string; thread_ts?: string; title?: string; token?: string }],
		Promise<{ ok: boolean; file?: { id: string; name?: string }; error?: string }>
	>;
	messagesDelete: CorsairEndpoint<
		CorsairContext,
		[{ channel: string; ts: string; as_user?: boolean; token?: string }],
		Promise<{ ok: boolean; channel?: string; ts?: string; error?: string }>
	>;
	messagesGetPermalink: CorsairEndpoint<
		CorsairContext,
		[{ channel: string; message_ts: string; token?: string }],
		Promise<{ ok: boolean; channel?: string; permalink?: string; error?: string }>
	>;
	messagesSearch: CorsairEndpoint<
		CorsairContext,
		[{ query: string; sort?: 'score' | 'timestamp'; sort_dir?: 'asc' | 'desc'; highlight?: boolean; team_id?: string; cursor?: string; limit?: number; page?: number; count?: number; token?: string }],
		Promise<{ ok: boolean; query?: string; messages?: { matches?: Array<{ ts?: string; text?: string }> }; error?: string }>
	>;
	postMessage: CorsairEndpoint<
		CorsairContext,
		[{
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
			metadata?: { event_type: string; event_payload: Record<string, unknown> };
			token?: string;
		}],
		Promise<{ ok: boolean; channel?: string; ts?: string; message?: { ts?: string; text?: string }; error?: string }>
	>;
	messagesUpdate: CorsairEndpoint<
		CorsairContext,
		[{
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
			metadata?: { event_type: string; event_payload: Record<string, unknown> };
			token?: string;
		}],
		Promise<{ ok: boolean; channel?: string; ts?: string; text?: string; message?: { ts?: string; text?: string }; error?: string }>
	>;
	reactionsAdd: CorsairEndpoint<
		CorsairContext,
		[{ channel: string; timestamp: string; name: string; token?: string }],
		Promise<{ ok: boolean; error?: string }>
	>;
	reactionsGet: CorsairEndpoint<
		CorsairContext,
		[{ channel?: string; timestamp?: string; file?: string; file_comment?: string; full?: boolean; token?: string }],
		Promise<{ ok: boolean; type?: string; message?: { ts?: string }; error?: string }>
	>;
	reactionsRemove: CorsairEndpoint<
		CorsairContext,
		[{ name: string; channel?: string; timestamp?: string; file?: string; file_comment?: string; token?: string }],
		Promise<{ ok: boolean; error?: string }>
	>;
	starsAdd: CorsairEndpoint<
		CorsairContext,
		[{ channel?: string; timestamp?: string; file?: string; file_comment?: string; token?: string }],
		Promise<{ ok: boolean; error?: string }>
	>;
	starsRemove: CorsairEndpoint<
		CorsairContext,
		[{ channel?: string; timestamp?: string; file?: string; file_comment?: string; token?: string }],
		Promise<{ ok: boolean; error?: string }>
	>;
	starsList: CorsairEndpoint<
		CorsairContext,
		[{ team_id?: string; cursor?: string; limit?: number; page?: number; count?: number; token?: string }],
		Promise<{ ok: boolean; items?: Array<{ type?: string; date_create?: number }>; error?: string }>
	>;
};

export function slack(options: SlackPluginOptions) {
	const botToken = options.credentials.botToken;

	const createEndpoint = <E extends CorsairEndpoint>(
		endpointFn: (token: string) => E,
	): E => {
		return endpointFn(botToken) as E;
	};

	return {
		id: 'slack',
		schema: SlackSchema,
		endpoints: {
			channelsArchive: createEndpoint(channelsEndpoints.archive),
			channelsClose: createEndpoint(channelsEndpoints.close),
			channelsCreate: createEndpoint(channelsEndpoints.create),
			channelsGet: createEndpoint(channelsEndpoints.get),
			channelsList: createEndpoint(channelsEndpoints.list),
			channelsGetHistory: createEndpoint(channelsEndpoints.getHistory),
			channelsInvite: createEndpoint(channelsEndpoints.invite),
			channelsJoin: createEndpoint(channelsEndpoints.join),
			channelsKick: createEndpoint(channelsEndpoints.kick),
			channelsLeave: createEndpoint(channelsEndpoints.leave),
			channelsGetMembers: createEndpoint(channelsEndpoints.getMembers),
			channelsOpen: createEndpoint(channelsEndpoints.open),
			channelsRename: createEndpoint(channelsEndpoints.rename),
			channelsGetReplies: createEndpoint(channelsEndpoints.getReplies),
			channelsSetPurpose: createEndpoint(channelsEndpoints.setPurpose),
			channelsSetTopic: createEndpoint(channelsEndpoints.setTopic),
			channelsUnarchive: createEndpoint(channelsEndpoints.unarchive),
			usersGet: createEndpoint(usersEndpoints.get),
			usersList: createEndpoint(usersEndpoints.list),
			usersGetProfile: createEndpoint(usersEndpoints.getProfile),
			usersGetPresence: createEndpoint(usersEndpoints.getPresence),
			usersUpdateProfile: createEndpoint(usersEndpoints.updateProfile),
			usergroupsCreate: createEndpoint(usergroupsEndpoints.create),
			usergroupsDisable: createEndpoint(usergroupsEndpoints.disable),
			usergroupsEnable: createEndpoint(usergroupsEndpoints.enable),
			usergroupsList: createEndpoint(usergroupsEndpoints.list),
			usergroupsUpdate: createEndpoint(usergroupsEndpoints.update),
			filesGet: createEndpoint(filesEndpoints.get),
			filesList: createEndpoint(filesEndpoints.list),
			filesUpload: createEndpoint(filesEndpoints.upload),
			messagesDelete: createEndpoint(messagesEndpoints.deleteMessage),
			messagesGetPermalink: createEndpoint(messagesEndpoints.getPermalink),
			messagesSearch: createEndpoint(messagesEndpoints.search),
			postMessage: createEndpoint(messagesEndpoints.postMessage),
			messagesUpdate: createEndpoint(messagesEndpoints.update),
			reactionsAdd: createEndpoint(reactionsEndpoints.add),
			reactionsGet: createEndpoint(reactionsEndpoints.get),
			reactionsRemove: createEndpoint(reactionsEndpoints.remove),
			starsAdd: createEndpoint(starsEndpoints.add),
			starsRemove: createEndpoint(starsEndpoints.remove),
			starsList: createEndpoint(starsEndpoints.list),
		},
		hooks: options.hooks,
	} satisfies CorsairPlugin<'slack', SlackEndpoints, typeof SlackSchema>;
}
