import { z } from 'zod';
import type { SlackReactionName } from './reactions';

type ResponseMetadata = {
	next_cursor?: string;
	messages?: string[];
};

type SlackResponse = {
	ok: boolean;
	error?: string;
	needed?: string;
	provided?: string;
	response_metadata?: ResponseMetadata;
};

type ChannelTopic = {
	value: string;
	creator: string;
	last_set: number;
};

type Channel = {
	id: string;
	name?: string;
	is_channel?: boolean;
	is_group?: boolean;
	is_im?: boolean;
	is_mpim?: boolean;
	is_private?: boolean;
	created?: number;
	is_archived?: boolean;
	is_general?: boolean;
	unlinked?: number;
	name_normalized?: string;
	is_shared?: boolean;
	is_org_shared?: boolean;
	is_pending_ext_shared?: boolean;
	pending_shared?: string[];
	context_team_id?: string;
	updated?: number;
	creator?: string;
	is_member?: boolean;
	num_members?: number;
	topic?: ChannelTopic;
	purpose?: ChannelTopic;
} & Record<string, unknown>;

type UserProfile = {
	avatar_hash?: string;
	status_text?: string;
	status_emoji?: string;
	status_expiration?: number;
	real_name?: string;
	display_name?: string;
	real_name_normalized?: string;
	display_name_normalized?: string;
	email?: string;
	image_24?: string;
	image_32?: string;
	image_48?: string;
	image_72?: string;
	image_192?: string;
	image_512?: string;
	team?: string;
	title?: string;
	phone?: string;
	skype?: string;
	first_name?: string;
	last_name?: string;
} & Record<string, unknown>;

type User = {
	id: string;
	team_id?: string;
	name?: string;
	deleted?: boolean;
	color?: string;
	real_name?: string;
	tz?: string;
	tz_label?: string;
	tz_offset?: number;
	profile?: UserProfile;
	is_admin?: boolean;
	is_owner?: boolean;
	is_primary_owner?: boolean;
	is_restricted?: boolean;
	is_ultra_restricted?: boolean;
	is_bot?: boolean;
	is_app_user?: boolean;
	updated?: number;
	is_email_confirmed?: boolean;
	who_can_share_contact_card?: string;
	locale?: string;
} & Record<string, unknown>;

type Usergroup = {
	id: string;
	team_id?: string;
	is_usergroup?: boolean;
	is_subteam?: boolean;
	name?: string;
	description?: string;
	handle?: string;
	is_external?: boolean;
	date_create?: number;
	date_update?: number;
	date_delete?: number;
	auto_type?: string | null;
	auto_provision?: boolean;
	enterprise_subteam_id?: string;
	created_by?: string;
	updated_by?: string;
	deleted_by?: string | null;
	prefs?: {
		channels?: string[];
		groups?: string[];
	};
	users?: string[];
	user_count?: number;
	channel_count?: number;
} & Record<string, unknown>;

type File = {
	id: string;
	created?: number;
	timestamp?: number;
	name?: string;
	title?: string;
	mimetype?: string;
	filetype?: string;
	pretty_type?: string;
	user?: string;
	user_team?: string;
	editable?: boolean;
	size?: number;
	mode?: string;
	is_external?: boolean;
	external_type?: string;
	is_public?: boolean;
	public_url_shared?: boolean;
	display_as_bot?: boolean;
	username?: string;
	url_private?: string;
	url_private_download?: string;
	permalink?: string;
	permalink_public?: string;
	channels?: string[];
	groups?: string[];
	ims?: string[];
} & Record<string, unknown>;

type Block = { type: string } & Record<string, unknown>;

type Attachment = Record<string, unknown>;

type Reaction = { name: string; count: number; users: string[] };

type Message = {
	type?: string;
	subtype?: string;
	text?: string;
	ts?: string;
	user?: string;
	bot_id?: string;
	app_id?: string;
	team?: string;
	username?: string;
	icons?: {
		emoji?: string;
		image_36?: string;
		image_48?: string;
		image_72?: string;
	};
	blocks?: Block[];
	attachments?: Attachment[];
	thread_ts?: string;
	parent_user_id?: string;
	reply_count?: number;
	reply_users_count?: number;
	latest_reply?: string;
	reply_users?: string[];
	is_locked?: boolean;
	subscribed?: boolean;
	reactions?: Reaction[];
	edited?: { user: string; ts: string };
} & Record<string, unknown>;

type Paging = {
	count: number;
	total: number;
	page: number;
	pages: number;
};

type Pagination = {
	total_count?: number;
	page?: number;
	per_page?: number;
	page_count?: number;
	first?: number;
	last?: number;
};


export type SlackEndpointInputs = {
	channelsArchive: { channel: string };
	channelsClose: { channel: string };
	channelsCreate: { name: string; is_private?: boolean; team_id?: string };
	channelsGet: {
		channel: string;
		include_locale?: boolean;
		include_num_members?: boolean;
	};
	channelsList: {
		exclude_archived?: boolean;
		types?: string;
		team_id?: string;
		cursor?: string;
		limit?: number;
	};
	channelsGetHistory: {
		channel: string;
		latest?: string;
		oldest?: string;
		inclusive?: boolean;
		include_all_metadata?: boolean;
		cursor?: string;
		limit?: number;
	};
	channelsInvite: { channel: string; users: string; force?: boolean };
	channelsJoin: { channel: string };
	channelsKick: { channel: string; user: string };
	channelsLeave: { channel: string };
	channelsGetMembers: { channel: string; cursor?: string; limit?: number };
	channelsOpen: {
		channel?: string;
		users?: string;
		prevent_creation?: boolean;
		return_im?: boolean;
	};
	channelsRename: { channel: string; name: string };
	channelsGetReplies: {
		channel: string;
		ts: string;
		latest?: string;
		oldest?: string;
		inclusive?: boolean;
		include_all_metadata?: boolean;
		cursor?: string;
		limit?: number;
	};
	channelsSetPurpose: { channel: string; purpose: string };
	channelsSetTopic: { channel: string; topic: string };
	channelsUnarchive: { channel: string };
	usersGet: { user: string; include_locale?: boolean };
	usersList: {
		include_locale?: boolean;
		team_id?: string;
		cursor?: string;
		limit?: number;
	};
	usersGetProfile: { user?: string; include_labels?: boolean };
	usersGetPresence: { user?: string };
	usersUpdateProfile: {
		profile?: Record<string, unknown>;
		user?: string;
		name?: string;
		value?: string;
	};
	userGroupsCreate: {
		name: string;
		channels?: string;
		description?: string;
		handle?: string;
		include_count?: boolean;
		team_id?: string;
	};
	userGroupsDisable: {
		userGroup: string;
		include_count?: boolean;
		team_id?: string;
	};
	userGroupsEnable: {
		userGroup: string;
		include_count?: boolean;
		team_id?: string;
	};
	userGroupsList: {
		include_count?: boolean;
		include_disabled?: boolean;
		include_users?: boolean;
		team_id?: string;
	};
	userGroupsUpdate: {
		userGroup: string;
		name?: string;
		channels?: string;
		description?: string;
		handle?: string;
		include_count?: boolean;
		team_id?: string;
	};
	filesGet: {
		file: string;
		cursor?: string;
		limit?: number;
		page?: number;
		count?: number;
	};
	filesList: {
		channel?: string;
		user?: string;
		types?: string;
		ts_from?: string;
		ts_to?: string;
		show_files_hidden_by_limit?: boolean;
		team_id?: string;
		page?: number;
		count?: number;
	};
	filesUpload: {
		channels?: string;
		content?: string;
		file?: unknown;
		filename?: string;
		filetype?: string;
		initial_comment?: string;
		thread_ts?: string;
		title?: string;
	};
	messagesDelete: { channel: string; ts: string; as_user?: boolean };
	messagesGetPermalink: { channel: string; message_ts: string };
	messagesSearch: {
		query: string;
		sort?: 'score' | 'timestamp';
		sort_dir?: 'asc' | 'desc';
		highlight?: boolean;
		team_id?: string;
		cursor?: string;
		limit?: number;
		page?: number;
		count?: number;
	};
	postMessage: {
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
	};
	messagesUpdate: {
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
	};
	reactionsAdd: {
		channel: string;
		timestamp: string;
		name: SlackReactionName;
	};
	reactionsGet: {
		channel?: string;
		timestamp?: string;
		file?: string;
		file_comment?: string;
		full?: boolean;
	};
	reactionsRemove: {
		name: SlackReactionName;
		channel?: string;
		timestamp?: string;
		file?: string;
		file_comment?: string;
	};
	starsAdd: {
		channel?: string;
		timestamp?: string;
		file?: string;
		file_comment?: string;
	};
	starsRemove: {
		channel?: string;
		timestamp?: string;
		file?: string;
		file_comment?: string;
	};
	starsList: {
		team_id?: string;
		cursor?: string;
		limit?: number;
		page?: number;
		count?: number;
	};
};

const ResponseMetadataSchema = z.object({
	next_cursor: z.string().optional(),
	messages: z.array(z.string()).optional(),
}).passthrough();

const SlackResponseSchema = z.object({
	ok: z.boolean(),
	error: z.string().optional(),
	needed: z.string().optional(),
	provided: z.string().optional(),
	response_metadata: ResponseMetadataSchema.optional(),
}).passthrough();

const ChannelTopicSchema = z.object({
	value: z.string(),
	creator: z.string(),
	last_set: z.number(),
}).passthrough();

const ChannelSchema = z.object({
	id: z.string(),
	name: z.string().optional(),
	is_channel: z.boolean().optional(),
	is_group: z.boolean().optional(),
	is_im: z.boolean().optional(),
	is_mpim: z.boolean().optional(),
	is_private: z.boolean().optional(),
	created: z.number().optional(),
	is_archived: z.boolean().optional(),
	is_general: z.boolean().optional(),
	unlinked: z.number().optional(),
	name_normalized: z.string().optional(),
	is_shared: z.boolean().optional(),
	is_org_shared: z.boolean().optional(),
	is_pending_ext_shared: z.boolean().optional(),
	pending_shared: z.array(z.string()).optional(),
	context_team_id: z.string().optional(),
	updated: z.number().optional(),
	creator: z.string().optional(),
	is_member: z.boolean().optional(),
	num_members: z.number().optional(),
	topic: ChannelTopicSchema.optional(),
	purpose: ChannelTopicSchema.optional(),
}).passthrough();

const UserProfileSchema = z.object({
	avatar_hash: z.string().optional(),
	status_text: z.string().optional(),
	status_emoji: z.string().optional(),
	status_expiration: z.number().optional(),
	real_name: z.string().optional(),
	display_name: z.string().optional(),
	real_name_normalized: z.string().optional(),
	display_name_normalized: z.string().optional(),
	email: z.string().optional(),
	image_24: z.string().optional(),
	image_32: z.string().optional(),
	image_48: z.string().optional(),
	image_72: z.string().optional(),
	image_192: z.string().optional(),
	image_512: z.string().optional(),
	team: z.string().optional(),
	title: z.string().optional(),
	phone: z.string().optional(),
	skype: z.string().optional(),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
}).passthrough();

const UserSchema = z.object({
	id: z.string(),
	team_id: z.string().optional(),
	name: z.string().optional(),
	deleted: z.boolean().optional(),
	color: z.string().optional(),
	real_name: z.string().optional(),
	tz: z.string().optional(),
	tz_label: z.string().optional(),
	tz_offset: z.number().optional(),
	profile: UserProfileSchema.optional(),
	is_admin: z.boolean().optional(),
	is_owner: z.boolean().optional(),
	is_primary_owner: z.boolean().optional(),
	is_restricted: z.boolean().optional(),
	is_ultra_restricted: z.boolean().optional(),
	is_bot: z.boolean().optional(),
	is_app_user: z.boolean().optional(),
	updated: z.number().optional(),
	is_email_confirmed: z.boolean().optional(),
	who_can_share_contact_card: z.string().optional(),
	locale: z.string().optional(),
}).passthrough();

const UsergroupSchema = z.object({
	id: z.string(),
	team_id: z.string().optional(),
	is_usergroup: z.boolean().optional(),
	is_subteam: z.boolean().optional(),
	name: z.string().optional(),
	description: z.string().optional(),
	handle: z.string().optional(),
	is_external: z.boolean().optional(),
	date_create: z.number().optional(),
	date_update: z.number().optional(),
	date_delete: z.number().optional(),
	auto_type: z.string().nullable().optional(),
	auto_provision: z.boolean().optional(),
	enterprise_subteam_id: z.string().optional(),
	created_by: z.string().optional(),
	updated_by: z.string().optional(),
	deleted_by: z.string().nullable().optional(),
	prefs: z.object({
		channels: z.array(z.string()).optional(),
		groups: z.array(z.string()).optional(),
	}).optional(),
	users: z.array(z.string()).optional(),
	user_count: z.number().optional(),
	channel_count: z.number().optional(),
}).passthrough();

const FileSchema = z.object({
	id: z.string(),
	created: z.number().optional(),
	timestamp: z.number().optional(),
	name: z.string().optional(),
	title: z.string().optional(),
	mimetype: z.string().optional(),
	filetype: z.string().optional(),
	pretty_type: z.string().optional(),
	user: z.string().optional(),
	user_team: z.string().optional(),
	editable: z.boolean().optional(),
	size: z.number().optional(),
	mode: z.string().optional(),
	is_external: z.boolean().optional(),
	external_type: z.string().optional(),
	is_public: z.boolean().optional(),
	public_url_shared: z.boolean().optional(),
	display_as_bot: z.boolean().optional(),
	username: z.string().optional(),
	url_private: z.string().optional(),
	url_private_download: z.string().optional(),
	permalink: z.string().optional(),
	permalink_public: z.string().optional(),
	channels: z.array(z.string()).optional(),
	groups: z.array(z.string()).optional(),
	ims: z.array(z.string()).optional(),
}).passthrough();

const BlockSchema = z.object({
	type: z.string(),
}).passthrough();

const AttachmentSchema = z.record(z.unknown());

const ReactionSchema = z.object({
	name: z.string(),
	count: z.number(),
	users: z.array(z.string()),
}).passthrough();

const MessageSchema = z.object({
	type: z.string().optional(),
	subtype: z.string().optional(),
	text: z.string().optional(),
	ts: z.string().optional(),
	user: z.string().optional(),
	bot_id: z.string().optional(),
	app_id: z.string().optional(),
	team: z.string().optional(),
	username: z.string().optional(),
	icons: z.object({
		emoji: z.string().optional(),
		image_36: z.string().optional(),
		image_48: z.string().optional(),
		image_72: z.string().optional(),
	}).optional(),
	blocks: z.array(BlockSchema).optional(),
	attachments: z.array(AttachmentSchema).optional(),
	thread_ts: z.string().optional(),
	parent_user_id: z.string().optional(),
	reply_count: z.number().optional(),
	reply_users_count: z.number().optional(),
	latest_reply: z.string().optional(),
	reply_users: z.array(z.string()).optional(),
	is_locked: z.boolean().optional(),
	subscribed: z.boolean().optional(),
	reactions: z.array(ReactionSchema).optional(),
	edited: z.object({
		user: z.string(),
		ts: z.string(),
	}).optional(),
}).passthrough();

const PagingSchema = z.object({
	count: z.number(),
	total: z.number(),
	page: z.number(),
	pages: z.number(),
}).passthrough();

const PaginationSchema = z.object({
	total_count: z.number().optional(),
	page: z.number().optional(),
	per_page: z.number().optional(),
	page_count: z.number().optional(),
	first: z.number().optional(),
	last: z.number().optional(),
}).passthrough();

const ChannelsRandomResponseSchema = z.object({
	done: z.boolean(),
});

const ConversationsArchiveResponseSchema = SlackResponseSchema;
const ConversationsCloseResponseSchema = SlackResponseSchema.extend({
	no_op: z.boolean().optional(),
	already_closed: z.boolean().optional(),
}).passthrough();
const ConversationsCreateResponseSchema = SlackResponseSchema.extend({
	channel: ChannelSchema.optional(),
}).passthrough();
const ConversationsInfoResponseSchema = SlackResponseSchema.extend({
	channel: ChannelSchema.optional(),
}).passthrough();
const ConversationsListResponseSchema = SlackResponseSchema.extend({
	channels: z.array(ChannelSchema).optional(),
}).passthrough();
const ConversationsHistoryResponseSchema = SlackResponseSchema.extend({
	messages: z.array(MessageSchema).optional(),
	has_more: z.boolean().optional(),
	pin_count: z.number().optional(),
	channel_actions_count: z.number().optional(),
	channel_actions_ts: z.number().nullable().optional(),
}).passthrough();
const ConversationsInviteResponseSchema = SlackResponseSchema.extend({
	channel: ChannelSchema.optional(),
}).passthrough();
const ConversationsJoinResponseSchema = SlackResponseSchema.extend({
	channel: ChannelSchema.optional(),
	warning: z.string().optional(),
}).passthrough();
const ConversationsKickResponseSchema = SlackResponseSchema;
const ConversationsLeaveResponseSchema = SlackResponseSchema.extend({
	not_in_channel: z.boolean().optional(),
}).passthrough();
const ConversationsMembersResponseSchema = SlackResponseSchema.extend({
	members: z.array(z.string()).optional(),
}).passthrough();
const ConversationsOpenResponseSchema = SlackResponseSchema.extend({
	channel: ChannelSchema.optional(),
	no_op: z.boolean().optional(),
	already_open: z.boolean().optional(),
}).passthrough();
const ConversationsRenameResponseSchema = SlackResponseSchema.extend({
	channel: ChannelSchema.optional(),
}).passthrough();
const ConversationsRepliesResponseSchema = SlackResponseSchema.extend({
	messages: z.array(MessageSchema).optional(),
	has_more: z.boolean().optional(),
}).passthrough();
const ConversationsSetPurposeResponseSchema = SlackResponseSchema.extend({
	channel: ChannelSchema.optional(),
	purpose: z.string().optional(),
}).passthrough();
const ConversationsSetTopicResponseSchema = SlackResponseSchema.extend({
	channel: ChannelSchema.optional(),
	topic: z.string().optional(),
}).passthrough();
const ConversationsUnarchiveResponseSchema = SlackResponseSchema;

const UsersInfoResponseSchema = SlackResponseSchema.extend({
	user: UserSchema.optional(),
}).passthrough();
const UsersListResponseSchema = SlackResponseSchema.extend({
	members: z.array(UserSchema).optional(),
	cache_ts: z.number().optional(),
}).passthrough();
const UsersProfileGetResponseSchema = SlackResponseSchema.extend({
	profile: UserProfileSchema.optional(),
}).passthrough();
const UsersGetPresenceResponseSchema = SlackResponseSchema.extend({
	presence: z.string().optional(),
	online: z.boolean().optional(),
	auto_away: z.boolean().optional(),
	manual_away: z.boolean().optional(),
	connection_count: z.number().optional(),
	last_activity: z.number().optional(),
}).passthrough();
const UsersProfileSetResponseSchema = SlackResponseSchema.extend({
	profile: UserProfileSchema.optional(),
}).passthrough();

const UsergroupsCreateResponseSchema = SlackResponseSchema.extend({
	usergroup: UsergroupSchema.optional(),
}).passthrough();
const UsergroupsDisableResponseSchema = SlackResponseSchema.extend({
	usergroup: UsergroupSchema.optional(),
}).passthrough();
const UsergroupsEnableResponseSchema = SlackResponseSchema.extend({
	usergroup: UsergroupSchema.optional(),
}).passthrough();
const UsergroupsListResponseSchema = SlackResponseSchema.extend({
	userGroups: z.array(UsergroupSchema).optional(),
}).passthrough();
const UsergroupsUpdateResponseSchema = SlackResponseSchema.extend({
	usergroup: UsergroupSchema.optional(),
}).passthrough();

const FilesInfoResponseSchema = SlackResponseSchema.extend({
	file: FileSchema.optional(),
	comments: z.array(z.object({
		id: z.string(),
		timestamp: z.number(),
		user: z.string(),
		comment: z.string(),
	})).optional(),
	paging: PagingSchema.optional(),
}).passthrough();
const FilesListResponseSchema = SlackResponseSchema.extend({
	files: z.array(FileSchema).optional(),
	paging: PagingSchema.optional(),
}).passthrough();
const FilesUploadResponseSchema = SlackResponseSchema.extend({
	file: FileSchema.optional(),
}).passthrough();

const ChatDeleteResponseSchema = SlackResponseSchema.extend({
	channel: z.string().optional(),
	ts: z.string().optional(),
}).passthrough();
const ChatGetPermalinkResponseSchema = SlackResponseSchema.extend({
	channel: z.string().optional(),
	permalink: z.string().optional(),
}).passthrough();
const SearchMessagesResponseSchema = SlackResponseSchema.extend({
	query: z.string().optional(),
	messages: z.object({
		total: z.number().optional(),
		pagination: PaginationSchema.optional(),
		paging: PagingSchema.optional(),
		matches: z.array(MessageSchema.extend({
			channel: z.object({
				id: z.string(),
				name: z.string().optional(),
			}).optional(),
			permalink: z.string().optional(),
		})).optional(),
	}).optional(),
}).passthrough();
const ChatPostMessageResponseSchema = SlackResponseSchema.extend({
	channel: z.string().optional(),
	ts: z.string().optional(),
	message: MessageSchema.optional(),
}).passthrough();
const ChatUpdateResponseSchema = SlackResponseSchema.extend({
	channel: z.string().optional(),
	ts: z.string().optional(),
	text: z.string().optional(),
	message: MessageSchema.optional(),
}).passthrough();

const ReactionsAddResponseSchema = SlackResponseSchema;
const ReactionsGetResponseSchema = SlackResponseSchema.extend({
	type: z.string().optional(),
	channel: z.string().optional(),
	message: MessageSchema.optional(),
	file: FileSchema.optional(),
	comment: z.object({
		id: z.string(),
		comment: z.string(),
		reactions: z.array(ReactionSchema).optional(),
	}).optional(),
}).passthrough();
const ReactionsRemoveResponseSchema = SlackResponseSchema;

const StarsAddResponseSchema = SlackResponseSchema;
const StarsRemoveResponseSchema = SlackResponseSchema;
const StarsListResponseSchema = SlackResponseSchema.extend({
	items: z.array(z.object({
		type: z.string(),
		channel: z.string().optional(),
		message: MessageSchema.optional(),
		file: FileSchema.optional(),
		comment: z.object({
			id: z.string(),
			comment: z.string(),
		}).optional(),
		date_create: z.number().optional(),
	})).optional(),
	paging: PagingSchema.optional(),
}).passthrough();

export const SlackEndpointOutputSchemas = {
	channelsRandom: ChannelsRandomResponseSchema,
	channelsArchive: ConversationsArchiveResponseSchema,
	channelsClose: ConversationsCloseResponseSchema,
	channelsCreate: ConversationsCreateResponseSchema,
	channelsGet: ConversationsInfoResponseSchema,
	channelsList: ConversationsListResponseSchema,
	channelsGetHistory: ConversationsHistoryResponseSchema,
	channelsInvite: ConversationsInviteResponseSchema,
	channelsJoin: ConversationsJoinResponseSchema,
	channelsKick: ConversationsKickResponseSchema,
	channelsLeave: ConversationsLeaveResponseSchema,
	channelsGetMembers: ConversationsMembersResponseSchema,
	channelsOpen: ConversationsOpenResponseSchema,
	channelsRename: ConversationsRenameResponseSchema,
	channelsGetReplies: ConversationsRepliesResponseSchema,
	channelsSetPurpose: ConversationsSetPurposeResponseSchema,
	channelsSetTopic: ConversationsSetTopicResponseSchema,
	channelsUnarchive: ConversationsUnarchiveResponseSchema,
	usersGet: UsersInfoResponseSchema,
	usersList: UsersListResponseSchema,
	usersGetProfile: UsersProfileGetResponseSchema,
	usersGetPresence: UsersGetPresenceResponseSchema,
	usersUpdateProfile: UsersProfileSetResponseSchema,
	userGroupsCreate: UsergroupsCreateResponseSchema,
	userGroupsDisable: UsergroupsDisableResponseSchema,
	userGroupsEnable: UsergroupsEnableResponseSchema,
	userGroupsList: UsergroupsListResponseSchema,
	userGroupsUpdate: UsergroupsUpdateResponseSchema,
	filesGet: FilesInfoResponseSchema,
	filesList: FilesListResponseSchema,
	filesUpload: FilesUploadResponseSchema,
	messagesDelete: ChatDeleteResponseSchema,
	messagesGetPermalink: ChatGetPermalinkResponseSchema,
	messagesSearch: SearchMessagesResponseSchema,
	postMessage: ChatPostMessageResponseSchema,
	messagesUpdate: ChatUpdateResponseSchema,
	reactionsAdd: ReactionsAddResponseSchema,
	reactionsGet: ReactionsGetResponseSchema,
	reactionsRemove: ReactionsRemoveResponseSchema,
	starsAdd: StarsAddResponseSchema,
	starsRemove: StarsRemoveResponseSchema,
	starsList: StarsListResponseSchema,
} as const;

export type SlackEndpointOutputs = {
	[K in keyof typeof SlackEndpointOutputSchemas]: z.infer<
		typeof SlackEndpointOutputSchemas[K]
	>;
};

export type ChannelsRandomResponse = z.infer<
	typeof SlackEndpointOutputSchemas.channelsRandom
>;
export type ConversationsArchiveResponse = z.infer<
	typeof SlackEndpointOutputSchemas.channelsArchive
>;
export type ConversationsCloseResponse = z.infer<
	typeof SlackEndpointOutputSchemas.channelsClose
>;
export type ConversationsCreateResponse = z.infer<
	typeof SlackEndpointOutputSchemas.channelsCreate
>;
export type ConversationsInfoResponse = z.infer<
	typeof SlackEndpointOutputSchemas.channelsGet
>;
export type ConversationsListResponse = z.infer<
	typeof SlackEndpointOutputSchemas.channelsList
>;
export type ConversationsHistoryResponse = z.infer<
	typeof SlackEndpointOutputSchemas.channelsGetHistory
>;
export type ConversationsInviteResponse = z.infer<
	typeof SlackEndpointOutputSchemas.channelsInvite
>;
export type ConversationsJoinResponse = z.infer<
	typeof SlackEndpointOutputSchemas.channelsJoin
>;
export type ConversationsKickResponse = z.infer<
	typeof SlackEndpointOutputSchemas.channelsKick
>;
export type ConversationsLeaveResponse = z.infer<
	typeof SlackEndpointOutputSchemas.channelsLeave
>;
export type ConversationsMembersResponse = z.infer<
	typeof SlackEndpointOutputSchemas.channelsGetMembers
>;
export type ConversationsOpenResponse = z.infer<
	typeof SlackEndpointOutputSchemas.channelsOpen
>;
export type ConversationsRenameResponse = z.infer<
	typeof SlackEndpointOutputSchemas.channelsRename
>;
export type ConversationsRepliesResponse = z.infer<
	typeof SlackEndpointOutputSchemas.channelsGetReplies
>;
export type ConversationsSetPurposeResponse = z.infer<
	typeof SlackEndpointOutputSchemas.channelsSetPurpose
>;
export type ConversationsSetTopicResponse = z.infer<
	typeof SlackEndpointOutputSchemas.channelsSetTopic
>;
export type ConversationsUnarchiveResponse = z.infer<
	typeof SlackEndpointOutputSchemas.channelsUnarchive
>;
export type UsersInfoResponse = z.infer<
	typeof SlackEndpointOutputSchemas.usersGet
>;
export type UsersListResponse = z.infer<
	typeof SlackEndpointOutputSchemas.usersList
>;
export type UsersProfileGetResponse = z.infer<
	typeof SlackEndpointOutputSchemas.usersGetProfile
>;
export type UsersGetPresenceResponse = z.infer<
	typeof SlackEndpointOutputSchemas.usersGetPresence
>;
export type UsersProfileSetResponse = z.infer<
	typeof SlackEndpointOutputSchemas.usersUpdateProfile
>;
export type UsergroupsCreateResponse = z.infer<
	typeof SlackEndpointOutputSchemas.userGroupsCreate
>;
export type UsergroupsDisableResponse = z.infer<
	typeof SlackEndpointOutputSchemas.userGroupsDisable
>;
export type UsergroupsEnableResponse = z.infer<
	typeof SlackEndpointOutputSchemas.userGroupsEnable
>;
export type UsergroupsListResponse = z.infer<
	typeof SlackEndpointOutputSchemas.userGroupsList
>;
export type UsergroupsUpdateResponse = z.infer<
	typeof SlackEndpointOutputSchemas.userGroupsUpdate
>;
export type FilesInfoResponse = z.infer<
	typeof SlackEndpointOutputSchemas.filesGet
>;
export type FilesListResponse = z.infer<
	typeof SlackEndpointOutputSchemas.filesList
>;
export type FilesUploadResponse = z.infer<
	typeof SlackEndpointOutputSchemas.filesUpload
>;
export type ChatDeleteResponse = z.infer<
	typeof SlackEndpointOutputSchemas.messagesDelete
>;
export type ChatGetPermalinkResponse = z.infer<
	typeof SlackEndpointOutputSchemas.messagesGetPermalink
>;
export type SearchMessagesResponse = z.infer<
	typeof SlackEndpointOutputSchemas.messagesSearch
>;
export type ChatPostMessageResponse = z.infer<
	typeof SlackEndpointOutputSchemas.postMessage
>;
export type ChatUpdateResponse = z.infer<
	typeof SlackEndpointOutputSchemas.messagesUpdate
>;
export type ReactionsAddResponse = z.infer<
	typeof SlackEndpointOutputSchemas.reactionsAdd
>;
export type ReactionsGetResponse = z.infer<
	typeof SlackEndpointOutputSchemas.reactionsGet
>;
export type ReactionsRemoveResponse = z.infer<
	typeof SlackEndpointOutputSchemas.reactionsRemove
>;
export type StarsAddResponse = z.infer<
	typeof SlackEndpointOutputSchemas.starsAdd
>;
export type StarsRemoveResponse = z.infer<
	typeof SlackEndpointOutputSchemas.starsRemove
>;
export type StarsListResponse = z.infer<
	typeof SlackEndpointOutputSchemas.starsList
>;
