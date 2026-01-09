import type {
	CorsairEndpoint,
	CorsairPlugin,
	CorsairPluginContext,
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
		CorsairPluginContext<'slack', typeof SlackSchema>,
		[{ channel: string; token?: string }],
		Promise<{ ok: boolean; error?: string }>
	>;
	channelsClose: CorsairEndpoint<
		CorsairPluginContext<'slack', typeof SlackSchema>,
		[{ channel: string; token?: string }],
		Promise<{ ok: boolean; error?: string; no_op?: boolean; already_closed?: boolean }>
	>;
	channelsCreate: CorsairEndpoint<
		CorsairPluginContext<'slack', typeof SlackSchema>,
		[{ name: string; is_private?: boolean; team_id?: string; token?: string }],
		Promise<{ ok: boolean; channel?: { id: string; name: string }; error?: string }>
	>;
	channelsGet: CorsairEndpoint<
		CorsairPluginContext<'slack', typeof SlackSchema>,
		[{ channel: string; include_locale?: boolean; include_num_members?: boolean; token?: string }],
		Promise<{ ok: boolean; channel?: { id: string; name?: string }; error?: string }>
	>;
	channelsList: CorsairEndpoint<
		CorsairPluginContext<'slack', typeof SlackSchema>,
		[{ exclude_archived?: boolean; types?: string; team_id?: string; cursor?: string; limit?: number; token?: string }],
		Promise<{ ok: boolean; channels?: Array<{ id: string; name?: string }>; error?: string }>
	>;
	channelsGetHistory: CorsairEndpoint<
		CorsairPluginContext<'slack', typeof SlackSchema>,
		[{ channel: string; latest?: string; oldest?: string; inclusive?: boolean; include_all_metadata?: boolean; cursor?: string; limit?: number; token?: string }],
		Promise<{ ok: boolean; messages?: Array<{ ts?: string; text?: string }>; has_more?: boolean; error?: string }>
	>;
	channelsInvite: CorsairEndpoint<
		CorsairPluginContext<'slack', typeof SlackSchema>,
		[{ channel: string; users: string; force?: boolean; token?: string }],
		Promise<{ ok: boolean; channel?: { id: string; name?: string }; error?: string }>
	>;
	channelsJoin: CorsairEndpoint<
		CorsairPluginContext<'slack', typeof SlackSchema>,
		[{ channel: string; token?: string }],
		Promise<{ ok: boolean; channel?: { id: string; name?: string }; warning?: string; error?: string }>
	>;
	channelsKick: CorsairEndpoint<
		CorsairPluginContext<'slack', typeof SlackSchema>,
		[{ channel: string; user: string; token?: string }],
		Promise<{ ok: boolean; error?: string }>
	>;
	channelsLeave: CorsairEndpoint<
		CorsairPluginContext<'slack', typeof SlackSchema>,
		[{ channel: string; token?: string }],
		Promise<{ ok: boolean; not_in_channel?: boolean; error?: string }>
	>;
	channelsGetMembers: CorsairEndpoint<
		CorsairPluginContext<'slack', typeof SlackSchema>,
		[{ channel: string; cursor?: string; limit?: number; token?: string }],
		Promise<{ ok: boolean; members?: string[]; error?: string }>
	>;
	channelsOpen: CorsairEndpoint<
		CorsairPluginContext<'slack', typeof SlackSchema>,
		[{ channel?: string; users?: string; prevent_creation?: boolean; return_im?: boolean; token?: string }],
		Promise<{ ok: boolean; channel?: { id: string; name?: string }; no_op?: boolean; already_open?: boolean; error?: string }>
	>;
	channelsRename: CorsairEndpoint<
		CorsairPluginContext<'slack', typeof SlackSchema>,
		[{ channel: string; name: string; token?: string }],
		Promise<{ ok: boolean; channel?: { id: string; name?: string }; error?: string }>
	>;
	channelsGetReplies: CorsairEndpoint<
		CorsairPluginContext<'slack', typeof SlackSchema>,
		[{ channel: string; ts: string; latest?: string; oldest?: string; inclusive?: boolean; include_all_metadata?: boolean; cursor?: string; limit?: number; token?: string }],
		Promise<{ ok: boolean; messages?: Array<{ ts?: string; text?: string }>; has_more?: boolean; error?: string }>
	>;
	channelsSetPurpose: CorsairEndpoint<
		CorsairPluginContext<'slack', typeof SlackSchema>,
		[{ channel: string; purpose: string; token?: string }],
		Promise<{ ok: boolean; channel?: { id: string; name?: string }; purpose?: string; error?: string }>
	>;
	channelsSetTopic: CorsairEndpoint<
		CorsairPluginContext<'slack', typeof SlackSchema>,
		[{ channel: string; topic: string; token?: string }],
		Promise<{ ok: boolean; channel?: { id: string; name?: string }; topic?: string; error?: string }>
	>;
	channelsUnarchive: CorsairEndpoint<
		CorsairPluginContext<'slack', typeof SlackSchema>,
		[{ channel: string; token?: string }],
		Promise<{ ok: boolean; error?: string }>
	>;
	usersGet: CorsairEndpoint<
		CorsairPluginContext<'slack', typeof SlackSchema>,
		[{ user: string; include_locale?: boolean; token?: string }],
		Promise<{ ok: boolean; user?: { id: string; name?: string }; error?: string }>
	>;
	usersList: CorsairEndpoint<
		CorsairPluginContext<'slack', typeof SlackSchema>,
		[{ include_locale?: boolean; team_id?: string; cursor?: string; limit?: number; token?: string }],
		Promise<{ ok: boolean; members?: Array<{ id: string; name?: string }>; cache_ts?: number; error?: string }>
	>;
	usersGetProfile: CorsairEndpoint<
		CorsairPluginContext<'slack', typeof SlackSchema>,
		[{ user?: string; include_labels?: boolean; token?: string }],
		Promise<{ ok: boolean; profile?: { avatar_hash?: string; real_name?: string }; error?: string }>
	>;
	usersGetPresence: CorsairEndpoint<
		CorsairPluginContext<'slack', typeof SlackSchema>,
		[{ user?: string; token?: string }],
		Promise<{ ok: boolean; presence?: string; online?: boolean; error?: string }>
	>;
	usersUpdateProfile: CorsairEndpoint<
		CorsairPluginContext<'slack', typeof SlackSchema>,
		[{ profile?: Record<string, unknown>; user?: string; name?: string; value?: string; token?: string }],
		Promise<{ ok: boolean; profile?: { avatar_hash?: string; real_name?: string }; error?: string }>
	>;
	usergroupsCreate: CorsairEndpoint<
		CorsairPluginContext<'slack', typeof SlackSchema>,
		[{ name: string; channels?: string; description?: string; handle?: string; include_count?: boolean; team_id?: string; token?: string }],
		Promise<{ ok: boolean; usergroup?: { id: string; name?: string }; error?: string }>
	>;
	usergroupsDisable: CorsairEndpoint<
		CorsairPluginContext<'slack', typeof SlackSchema>,
		[{ usergroup: string; include_count?: boolean; team_id?: string; token?: string }],
		Promise<{ ok: boolean; usergroup?: { id: string; name?: string }; error?: string }>
	>;
	usergroupsEnable: CorsairEndpoint<
		CorsairPluginContext<'slack', typeof SlackSchema>			,
		[{ usergroup: string; include_count?: boolean; team_id?: string; token?: string }],
		Promise<{ ok: boolean; usergroup?: { id: string; name?: string }; error?: string }>
	>;
	usergroupsList: CorsairEndpoint<
		CorsairPluginContext<'slack', typeof SlackSchema>,
		[{ include_count?: boolean; include_disabled?: boolean; include_users?: boolean; team_id?: string; token?: string }],
		Promise<{ ok: boolean; usergroups?: Array<{ id: string; name?: string }>; error?: string }>
	>;
	usergroupsUpdate: CorsairEndpoint<
		CorsairPluginContext<'slack', typeof SlackSchema>,
		[{ usergroup: string; name?: string; channels?: string; description?: string; handle?: string; include_count?: boolean; team_id?: string; token?: string }],
		Promise<{ ok: boolean; usergroup?: { id: string; name?: string }; error?: string }>
	>;
	filesGet: CorsairEndpoint<
		CorsairPluginContext<'slack', typeof SlackSchema>,
		[{ file: string; cursor?: string; limit?: number; page?: number; count?: number; token?: string }],
		Promise<{ ok: boolean; file?: { id: string; name?: string }; error?: string }>
	>;
	filesList: CorsairEndpoint<
		CorsairPluginContext<'slack', typeof SlackSchema>,
		[{ channel?: string; user?: string; types?: string; ts_from?: string; ts_to?: string; show_files_hidden_by_limit?: boolean; team_id?: string; page?: number; count?: number; token?: string }],
		Promise<{ ok: boolean; files?: Array<{ id: string; name?: string }>; error?: string }>
	>;
	filesUpload: CorsairEndpoint<
		CorsairPluginContext<'slack', typeof SlackSchema>,
		[{ channels?: string; content?: string; file?: unknown; filename?: string; filetype?: string; initial_comment?: string; thread_ts?: string; title?: string; token?: string }],
		Promise<{ ok: boolean; file?: { id: string; name?: string }; error?: string }>
	>;
	messagesDelete: CorsairEndpoint<
		CorsairPluginContext<'slack', typeof SlackSchema>,
		[{ channel: string; ts: string; as_user?: boolean; token?: string }],
		Promise<{ ok: boolean; channel?: string; ts?: string; error?: string }>
	>;
	messagesGetPermalink: CorsairEndpoint<
		CorsairPluginContext<'slack', typeof SlackSchema>,
		[{ channel: string; message_ts: string; token?: string }],
		Promise<{ ok: boolean; channel?: string; permalink?: string; error?: string }>
	>;
	messagesSearch: CorsairEndpoint<
		CorsairPluginContext<'slack', typeof SlackSchema>,
		[{ query: string; sort?: 'score' | 'timestamp'; sort_dir?: 'asc' | 'desc'; highlight?: boolean; team_id?: string; cursor?: string; limit?: number; page?: number; count?: number; token?: string }],
		Promise<{ ok: boolean; query?: string; messages?: { matches?: Array<{ ts?: string; text?: string }> }; error?: string }>
	>;
	postMessage: CorsairEndpoint<
		CorsairPluginContext<'slack', typeof SlackSchema>,
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
		CorsairPluginContext<'slack', typeof SlackSchema>,
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
		CorsairPluginContext<'slack', typeof SlackSchema>,
		[{ channel: string; timestamp: string; name: string; token?: string }],
		Promise<{ ok: boolean; error?: string }>
	>;
	reactionsGet: CorsairEndpoint<
		CorsairPluginContext<'slack', typeof SlackSchema>	,
		[{ channel?: string; timestamp?: string; file?: string; file_comment?: string; full?: boolean; token?: string }],
		Promise<{ ok: boolean; type?: string; message?: { ts?: string }; error?: string }>
	>;
	reactionsRemove: CorsairEndpoint<
		CorsairPluginContext<'slack', typeof SlackSchema>	,
		[{ name: string; channel?: string; timestamp?: string; file?: string; file_comment?: string; token?: string }],
		Promise<{ ok: boolean; error?: string }>
	>;
	starsAdd: CorsairEndpoint<
		CorsairPluginContext<'slack', typeof SlackSchema>	,
		[{ channel?: string; timestamp?: string; file?: string; file_comment?: string; token?: string }],
		Promise<{ ok: boolean; error?: string }>
	>;
	starsRemove: CorsairEndpoint<
		CorsairPluginContext<'slack', typeof SlackSchema>	,
		[{ channel?: string; timestamp?: string; file?: string; file_comment?: string; token?: string }],
		Promise<{ ok: boolean; error?: string }>
	>;
	starsList: CorsairEndpoint<
		CorsairPluginContext<'slack', typeof SlackSchema>		,
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
