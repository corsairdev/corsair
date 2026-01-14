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

export type ConversationsArchiveResponse = SlackResponse;
export type ConversationsCloseResponse = SlackResponse & {
	no_op?: boolean;
	already_closed?: boolean;
};
export type ConversationsCreateResponse = SlackResponse & { channel?: Channel };
export type ConversationsInfoResponse = SlackResponse & { channel?: Channel };
export type ConversationsListResponse = SlackResponse & {
	channels?: Channel[];
};
export type ConversationsHistoryResponse = SlackResponse & {
	messages?: Message[];
	has_more?: boolean;
	pin_count?: number;
	channel_actions_count?: number;
	channel_actions_ts?: number;
};
export type ConversationsInviteResponse = SlackResponse & { channel?: Channel };
export type ConversationsJoinResponse = SlackResponse & {
	channel?: Channel;
	warning?: string;
};
export type ConversationsKickResponse = SlackResponse;
export type ConversationsLeaveResponse = SlackResponse & {
	not_in_channel?: boolean;
};
export type ConversationsMembersResponse = SlackResponse & {
	members?: string[];
};
export type ConversationsOpenResponse = SlackResponse & {
	channel?: Channel;
	no_op?: boolean;
	already_open?: boolean;
};
export type ConversationsRenameResponse = SlackResponse & { channel?: Channel };
export type ConversationsRepliesResponse = SlackResponse & {
	messages?: Message[];
	has_more?: boolean;
};
export type ConversationsSetPurposeResponse = SlackResponse & {
	channel?: Channel;
	purpose?: string;
};
export type ConversationsSetTopicResponse = SlackResponse & {
	channel?: Channel;
	topic?: string;
};
export type ConversationsUnarchiveResponse = SlackResponse;

export type UsersInfoResponse = SlackResponse & { user?: User };
export type UsersListResponse = SlackResponse & {
	members?: User[];
	cache_ts?: number;
};
export type UsersProfileGetResponse = SlackResponse & { profile?: UserProfile };
export type UsersGetPresenceResponse = SlackResponse & {
	presence?: string;
	online?: boolean;
	auto_away?: boolean;
	manual_away?: boolean;
	connection_count?: number;
	last_activity?: number;
};
export type UsersProfileSetResponse = SlackResponse & { profile?: UserProfile };

export type UsergroupsCreateResponse = SlackResponse & {
	usergroup?: Usergroup;
};
export type UsergroupsDisableResponse = SlackResponse & {
	usergroup?: Usergroup;
};
export type UsergroupsEnableResponse = SlackResponse & {
	usergroup?: Usergroup;
};
export type UsergroupsListResponse = SlackResponse & {
	userGroups?: Usergroup[];
};
export type UsergroupsUpdateResponse = SlackResponse & {
	usergroup?: Usergroup;
};

export type FilesInfoResponse = SlackResponse & {
	file?: File;
	comments?: Array<{
		id: string;
		timestamp: number;
		user: string;
		comment: string;
	}>;
	paging?: Paging;
};
export type FilesListResponse = SlackResponse & {
	files?: File[];
	paging?: Paging;
};
export type FilesUploadResponse = SlackResponse & { file?: File };

export type ChatDeleteResponse = SlackResponse & {
	channel?: string;
	ts?: string;
};
export type ChatGetPermalinkResponse = SlackResponse & {
	channel?: string;
	permalink?: string;
};
export type SearchMessagesResponse = SlackResponse & {
	query?: string;
	messages?: {
		total?: number;
		pagination?: Pagination;
		paging?: Paging;
		matches?: Array<
			Message & {
				channel?: { id: string; name?: string };
				permalink?: string;
			}
		>;
	};
};
export type ChatPostMessageResponse = SlackResponse & {
	channel?: string;
	ts?: string;
	message?: Message;
};
export type ChatUpdateResponse = SlackResponse & {
	channel?: string;
	ts?: string;
	text?: string;
	message?: Message;
};

export type ReactionsAddResponse = SlackResponse;
export type ReactionsGetResponse = SlackResponse & {
	type?: string;
	channel?: string;
	message?: Message;
	file?: File;
	comment?: { id: string; comment: string; reactions?: Reaction[] };
};
export type ReactionsRemoveResponse = SlackResponse;

export type StarsAddResponse = SlackResponse;
export type StarsRemoveResponse = SlackResponse;
export type StarsListResponse = SlackResponse & {
	items?: Array<{
		type: string;
		channel?: string;
		message?: Message;
		file?: File;
		comment?: { id: string; comment: string };
		date_create?: number;
	}>;
	paging?: Paging;
};

export type SlackEndpointOutputs = {
	channelsArchive: ConversationsArchiveResponse;
	channelsClose: ConversationsCloseResponse;
	channelsCreate: ConversationsCreateResponse;
	channelsGet: ConversationsInfoResponse;
	channelsList: ConversationsListResponse;
	channelsGetHistory: ConversationsHistoryResponse;
	channelsInvite: ConversationsInviteResponse;
	channelsJoin: ConversationsJoinResponse;
	channelsKick: ConversationsKickResponse;
	channelsLeave: ConversationsLeaveResponse;
	channelsGetMembers: ConversationsMembersResponse;
	channelsOpen: ConversationsOpenResponse;
	channelsRename: ConversationsRenameResponse;
	channelsGetReplies: ConversationsRepliesResponse;
	channelsSetPurpose: ConversationsSetPurposeResponse;
	channelsSetTopic: ConversationsSetTopicResponse;
	channelsUnarchive: ConversationsUnarchiveResponse;
	usersGet: UsersInfoResponse;
	usersList: UsersListResponse;
	usersGetProfile: UsersProfileGetResponse;
	usersGetPresence: UsersGetPresenceResponse;
	usersUpdateProfile: UsersProfileSetResponse;
	userGroupsCreate: UsergroupsCreateResponse;
	userGroupsDisable: UsergroupsDisableResponse;
	userGroupsEnable: UsergroupsEnableResponse;
	userGroupsList: UsergroupsListResponse;
	userGroupsUpdate: UsergroupsUpdateResponse;
	filesGet: FilesInfoResponse;
	filesList: FilesListResponse;
	filesUpload: FilesUploadResponse;
	messagesDelete: ChatDeleteResponse;
	messagesGetPermalink: ChatGetPermalinkResponse;
	messagesSearch: SearchMessagesResponse;
	postMessage: ChatPostMessageResponse;
	messagesUpdate: ChatUpdateResponse;
	reactionsAdd: ReactionsAddResponse;
	reactionsGet: ReactionsGetResponse;
	reactionsRemove: ReactionsRemoveResponse;
	starsAdd: StarsAddResponse;
	starsRemove: StarsRemoveResponse;
	starsList: StarsListResponse;
};

