export interface StatusEmojiDisplayInfo {
	emoji_name?: string;
	display_alias?: string;
	display_url?: string;
}

export interface BotProfile {
	id: string;
	name: string;
	app_id: string;
	team_id: string;
	icons: {
		[size: string]: string;
	};
	updated: number;
	deleted: boolean;
}

type ChannelTypes = 'channel' | 'group' | 'im' | 'mpim' | 'app_home';

interface MessageAttachment {
	blocks?: unknown[];
	fallback?: string;
	color?: string;
	pretext?: string;
	author_name?: string;
	author_link?: string;
	author_icon?: string;
	title?: string;
	title_link?: string;
	text?: string;
	fields?: {
		title: string;
		value: string;
		short?: boolean;
	}[];
	image_url?: string;
	thumb_url?: string;
	footer?: string;
	footer_icon?: string;
	ts?: string;
	[key: string]: unknown;
}

interface Block {
	type: string;
	block_id?: string;
	[key: string]: unknown;
}

interface KnownBlock extends Block {
	type:
		| 'section'
		| 'divider'
		| 'image'
		| 'actions'
		| 'context'
		| 'input'
		| 'file'
		| 'header'
		| 'video'
		| 'rich_text';
}

interface File {
	id: string;
	created: number;
	name: string | null;
	title: string | null;
	mimetype: string;
	filetype: string;
	pretty_type: string;
	user?: string;
	editable: boolean;
	size: number;
	mode: 'hosted' | 'external' | 'snippet' | 'post';
	is_external: boolean;
	external_type: string | null;
	is_public: boolean;
	public_url_shared: boolean;
	display_as_bot: boolean;
	username: string | null;
	url_private?: string;
	url_private_download?: string;
	thumb_64?: string;
	thumb_80?: string;
	thumb_160?: string;
	thumb_360?: string;
	thumb_360_w?: number;
	thumb_360_h?: number;
	thumb_360_gif?: string;
	thumb_480?: string;
	thumb_720?: string;
	thumb_960?: string;
	thumb_1024?: string;
	permalink: string;
	permalink_public?: string;
	edit_link?: string;
	image_exif_rotation?: number;
	original_w?: number;
	original_h?: number;
	deanimate_gif?: string;
	preview?: string;
	preview_highlight?: string;
	lines?: string;
	lines_more?: string;
	preview_is_truncated?: boolean;
	has_rich_preview?: boolean;
	shares?: {
		[key: string]: unknown;
	};
	channels: string[] | null;
	groups: string[] | null;
	users?: string[];
	pinned_to?: string[];
	reactions?: {
		[key: string]: unknown;
	}[];
	is_starred?: boolean;
	num_stars?: number;
	initial_comment?: string;
	comments_count?: string;
}

export type AllMessageEvents =
	| GenericMessageEvent
	| BotMessageEvent
	| ChannelArchiveMessageEvent
	| ChannelJoinMessageEvent
	| ChannelLeaveMessageEvent
	| ChannelNameMessageEvent
	| ChannelPostingPermissionsMessageEvent
	| ChannelPurposeMessageEvent
	| ChannelTopicMessageEvent
	| ChannelUnarchiveMessageEvent
	| EKMAccessDeniedMessageEvent
	| FileShareMessageEvent
	| MeMessageEvent
	| MessageChangedEvent
	| MessageDeletedEvent
	| MessageRepliedEvent
	| ThreadBroadcastMessageEvent;

export type MessageEvent = AllMessageEvents;

export interface GenericMessageEvent {
	type: 'message';
	subtype: undefined;
	event_ts: string;
	team?: string;
	channel: string;
	user: string;
	bot_id?: string;
	bot_profile?: BotProfile;
	text?: string;
	ts: string;
	thread_ts?: string;
	channel_type: ChannelTypes;
	attachments?: MessageAttachment[];
	blocks?: (KnownBlock | Block)[];
	files?: File[];
	edited?: {
		user: string;
		ts: string;
	};
	client_msg_id?: string;
	parent_user_id?: string;
	is_starred?: boolean;
	pinned_to?: string[];
	reactions?: {
		name: string;
		count: number;
		users: string[];
	}[];
	assistant_thread?: Record<string, unknown>;
}

export interface BotMessageEvent {
	type: 'message';
	subtype: 'bot_message';
	event_ts: string;
	channel: string;
	channel_type: ChannelTypes;
	streaming_state?: 'in_progress' | 'completed' | 'errored';
	ts: string;
	text: string;
	bot_id: string;
	username?: string;
	icons?: {
		[size: string]: string;
	};
	user?: string;
	attachments?: MessageAttachment[];
	blocks?: (KnownBlock | Block)[];
	edited?: {
		user: string;
		ts: string;
	};
	thread_ts?: string;
}

export interface ChannelArchiveMessageEvent {
	type: 'message';
	subtype: 'channel_archive';
	team: string;
	user: string;
	channel: string;
	channel_type: ChannelTypes;
	text: string;
	ts: string;
	event_ts: string;
}

export interface ChannelJoinMessageEvent {
	type: 'message';
	subtype: 'channel_join';
	team: string;
	user: string;
	inviter: string;
	channel: string;
	channel_type: ChannelTypes;
	text: string;
	ts: string;
	event_ts: string;
}

export interface ChannelLeaveMessageEvent {
	type: 'message';
	subtype: 'channel_leave';
	team: string;
	user: string;
	channel: string;
	channel_type: ChannelTypes;
	text: string;
	ts: string;
	event_ts: string;
}

export interface ChannelNameMessageEvent {
	type: 'message';
	subtype: 'channel_name';
	team: string;
	user: string;
	name: string;
	old_name: string;
	channel: string;
	channel_type: ChannelTypes;
	text: string;
	ts: string;
	event_ts: string;
}

export interface ChannelPostingPermissionsMessageEvent {
	type: 'message';
	subtype: 'channel_posting_permissions';
	user: string;
	channel: string;
	channel_type: ChannelTypes;
	text: string;
	ts: string;
	event_ts: string;
}

export interface ChannelPurposeMessageEvent {
	type: 'message';
	subtype: 'channel_purpose';
	user: string;
	channel: string;
	channel_type: ChannelTypes;
	text: string;
	purpose: string;
	ts: string;
	event_ts: string;
}

export interface ChannelTopicMessageEvent {
	type: 'message';
	subtype: 'channel_topic';
	user: string;
	channel: string;
	channel_type: ChannelTypes;
	text: string;
	topic: string;
	ts: string;
	event_ts: string;
}

export interface ChannelUnarchiveMessageEvent {
	type: 'message';
	subtype: 'channel_unarchive';
	team: string;
	user: string;
	channel: string;
	channel_type: ChannelTypes;
	text: string;
	ts: string;
	event_ts: string;
}

export interface EKMAccessDeniedMessageEvent {
	type: 'message';
	subtype: 'ekm_access_denied';
	event_ts: string;
	channel: string;
	channel_type: ChannelTypes;
	ts: string;
	text: string;
	user: 'UREVOKEDU';
}

export interface FileShareMessageEvent {
	type: 'message';
	subtype: 'file_share';
	text: string;
	attachments?: MessageAttachment[];
	blocks?: (KnownBlock | Block)[];
	files?: File[];
	upload?: boolean;
	display_as_bot?: boolean;
	x_files?: string[];
	user: string;
	parent_user_id?: string;
	ts: string;
	thread_ts?: string;
	channel: string;
	channel_type: ChannelTypes;
	event_ts: string;
}

export interface MeMessageEvent {
	type: 'message';
	subtype: 'me_message';
	event_ts: string;
	channel: string;
	channel_type: ChannelTypes;
	user: string;
	text: string;
	ts: string;
}

export interface MessageChangedEvent {
	type: 'message';
	subtype: 'message_changed';
	event_ts: string;
	hidden: true;
	channel: string;
	channel_type: ChannelTypes;
	ts: string;
	message: MessageEvent;
	previous_message: MessageEvent;
}

export interface MessageDeletedEvent {
	type: 'message';
	subtype: 'message_deleted';
	event_ts: string;
	hidden: true;
	channel: string;
	channel_type: ChannelTypes;
	ts: string;
	deleted_ts: string;
	previous_message: MessageEvent;
}

export interface MessageRepliedEvent {
	type: 'message';
	subtype: 'message_replied';
	event_ts: string;
	hidden: true;
	channel: string;
	channel_type: ChannelTypes;
	ts: string;
	message: MessageEvent & {
		thread_ts: string;
		reply_count: number;
		replies: MessageEvent[];
	};
}

export interface ThreadBroadcastMessageEvent {
	type: 'message';
	subtype: 'thread_broadcast';
	event_ts: string;
	text: string;
	attachments?: MessageAttachment[];
	blocks?: (KnownBlock | Block)[];
	user: string;
	ts: string;
	thread_ts?: string;
	root: (GenericMessageEvent | BotMessageEvent) & {
		thread_ts: string;
		reply_count: number;
		reply_users_count: number;
		latest_reply: string;
		reply_users: string[];
	};
	client_msg_id: string;
	channel: string;
	channel_type: ChannelTypes;
}

export interface AppMentionEvent {
	type: 'app_mention';
	subtype?: string;
	bot_id?: string;
	bot_profile?: BotProfile;
	username?: string;
	team?: string;
	user_team?: string;
	source_team?: string;
	user_profile?: {
		name: string;
		first_name: string;
		real_name: string;
		display_name: string;
		team: string;
		is_restricted?: boolean;
		is_ultra_restricted?: boolean;
		avatar_hash?: string;
		image_72?: string;
	};
	user?: string;
	text: string;
	attachments?: MessageAttachment[];
	blocks?: (KnownBlock | Block)[];
	files?: {
		id: string;
		created: number;
		timestamp: number;
		name: string;
		title: string;
		mimetype: string;
		filetype: string;
		pretty_type: string;
		user: string;
		user_team: string;
		editable: boolean;
		size: number;
		mode: string;
		is_external: boolean;
		external_type: string;
		is_public: boolean;
		public_url_shared: boolean;
		display_as_bot: boolean;
		username: string;
		url_private: string;
		url_private_download: string;
		media_display_type: string;
		thumb_pdf?: string;
		thumb_pdf_w?: number;
		thumb_pdf_h?: number;
		thumb_64?: string;
		thumb_80?: string;
		thumb_360?: string;
		thumb_360_w?: number;
		thumb_360_h?: number;
		thumb_480?: string;
		thumb_480_w?: number;
		thumb_480_h?: number;
		thumb_160?: string;
		thumb_720?: string;
		thumb_720_w?: number;
		thumb_720_h?: number;
		thumb_800?: string;
		thumb_800_w?: number;
		thumb_800_h?: number;
		thumb_960?: string;
		thumb_960_w?: number;
		thumb_960_h?: number;
		thumb_1024?: string;
		thumb_1024_w?: number;
		thumb_1024_h?: number;
		original_w?: number;
		original_h?: number;
		thumb_tiny?: string;
		permalink: string;
		permalink_public: string;
		is_starred: boolean;
		has_rich_preview: boolean;
		file_access: string;
	}[];
	upload?: boolean;
	display_as_bot?: boolean;
	edited?: {
		user: string;
		ts: string;
	};
	ts: string;
	channel: string;
	event_ts: string;
	thread_ts?: string;
	client_msg_id?: string;
}

export interface ChannelCreatedEvent {
	type: 'channel_created';
	event_ts: string;
	channel: {
		id: string;
		is_channel: boolean;
		name: string;
		name_normalized: string;
		created: number;
		creator: string;
		is_shared: boolean;
		is_org_shared: boolean;
		context_team_id: string;
		is_archived: boolean;
		is_frozen: boolean;
		is_general: boolean;
		is_group: boolean;
		is_private: boolean;
		is_ext_shared: boolean;
		is_im: boolean;
		is_mpim: boolean;
		is_pending_ext_shared: boolean;
	};
}

interface ReactionMessageItem {
	type: 'message';
	channel: string;
	ts: string;
}

export interface ReactionAddedEvent {
	type: 'reaction_added';
	user: string;
	reaction: string;
	item_user: string;
	item: ReactionMessageItem;
	event_ts: string;
}

export interface ReactionRemovedEvent {
	type: 'reaction_removed';
	user: string;
	reaction: string;
	item_user: string;
	item: ReactionMessageItem;
	event_ts: string;
}

interface UserProfile {
	title: string;
	phone: string;
	skype: string;
	real_name: string;
	real_name_normalized: string;
	display_name: string;
	display_name_normalized: string;
	status_text: string;
	status_text_canonical: string;
	status_emoji: string;
	status_emoji_display_info: StatusEmojiDisplayInfo[];
	status_expiration: number;
	avatar_hash: string;
	huddle_state?: string;
	huddle_state_expiration_ts?: number;
	first_name: string;
	last_name: string;
	email?: string;
	image_original?: string;
	is_custom_image?: boolean;
	image_24: string;
	image_32: string;
	image_48: string;
	image_72: string;
	image_192: string;
	image_512: string;
	image_1024?: string;
	team: string;
	fields:
		| {
				[key: string]: {
					value: string;
					alt: string;
				};
		  }
		| []
		| null;
}

interface SlackUser {
	id: string;
	team_id: string;
	name: string;
	deleted: boolean;
	color: string;
	real_name: string;
	tz: string;
	tz_label: string;
	tz_offset: number;
	profile: UserProfile;
	is_admin: boolean;
	is_owner: boolean;
	is_primary_owner: boolean;
	is_restricted: boolean;
	is_ultra_restricted: boolean;
	is_bot: boolean;
	is_stranger?: boolean;
	updated: number;
	is_email_confirmed: boolean;
	is_app_user: boolean;
	is_invited_user?: boolean;
	has_2fa?: boolean;
	locale: string;
	presence?: string;
	enterprise_user?: {
		id: string;
		enterprise_id: string;
		enterprise_name: string;
		is_admin: boolean;
		is_owner: boolean;
		teams: string[];
	};
	two_factor_type?: string;
	has_files?: boolean;
	is_workflow_bot?: boolean;
	who_can_share_contact_card: string;
}

export interface TeamJoinEvent {
	type: 'team_join';
	user: SlackUser;
	cache_ts: number;
	event_ts: string;
}

export interface UserChangeEvent {
	type: 'user_change';
	user: SlackUser;
	cache_ts: number;
	event_ts: string;
}

export interface FileCreatedEvent {
	type: 'file_created';
	file_id: string;
	user_id: string;
	file: {
		id: string;
	};
	event_ts: string;
}

export interface FilePublicEvent {
	type: 'file_public';
	file_id: string;
	user_id: string;
	file: {
		id: string;
	};
	event_ts: string;
}

export interface FileSharedEvent {
	type: 'file_shared';
	file_id: string;
	user_id: string;
	file: {
		id: string;
	};
	channel_id: string;
	event_ts: string;
}

export type SlackEventName =
	| 'message'
	| 'app_mention'
	| 'file_shared'
	| 'file_created'
	| 'file_public'
	| 'channel_created'
	| 'reaction_added'
	| 'reaction_removed'
	| 'team_join'
	| 'user_change';

export interface SlackEventMap {
	message: MessageEvent;
	app_mention: AppMentionEvent;
	file_shared: FileSharedEvent;
	file_created: FileCreatedEvent;
	file_public: FilePublicEvent;
	channel_created: ChannelCreatedEvent;
	reaction_added: ReactionAddedEvent;
	reaction_removed: ReactionRemovedEvent;
	team_join: TeamJoinEvent;
	user_change: UserChangeEvent;
}

export type ReactionItem = {
	type: 'message';
	channel: string;
	ts: string;
};

export type SlackEventPayload<TEvent = unknown> = {
	token?: string;
	team_id: string;
	api_app_id: string;
	event: TEvent;
	type: 'event_callback';
	event_id: string;
	event_time: number;
	event_context?: string;
	authorizations?: Array<{
		enterprise_id: string | null;
		team_id: string;
		user_id: string;
		is_bot: boolean;
		is_enterprise_install: boolean;
	}>;
};

export type SlackUrlVerificationPayload = {
	token: string;
	challenge: string;
	type: 'url_verification';
};

export type SlackWebhookPayload<TEvent = unknown> =
	| SlackEventPayload<TEvent>
	| SlackUrlVerificationPayload;

// Webhook Response Types

export type SlackWebhookAck = {
	challenge?: string;
};

// Webhook Outputs (maps webhook names to response types)

export type SlackWebhookOutputs = {
	reactionAdded: SlackWebhookAck;
	message: SlackWebhookAck;
	channelCreated: SlackWebhookAck;
	teamJoin: SlackWebhookAck;
	userChange: SlackWebhookAck;
	fileCreated: SlackWebhookAck;
	filePublic: SlackWebhookAck;
	fileShared: SlackWebhookAck;
};

export type WebhookMatch = (
	headers: Record<string, unknown>,
	body: any,
) => boolean;
