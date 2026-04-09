import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { verifySlackSignature } from 'corsair/http';
import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Shared sub-schemas
// ─────────────────────────────────────────────────────────────────────────────

export const StatusEmojiDisplayInfoSchema = z.object({
	emoji_name: z.string().optional(),
	display_alias: z.string().optional(),
	display_url: z.string().optional(),
});
export type StatusEmojiDisplayInfo = z.infer<
	typeof StatusEmojiDisplayInfoSchema
>;

export const BotProfileSchema = z.object({
	id: z.string(),
	name: z.string(),
	app_id: z.string(),
	team_id: z.string(),
	icons: z.record(z.string()),
	updated: z.number(),
	deleted: z.boolean(),
});
export type BotProfile = z.infer<typeof BotProfileSchema>;

const ChannelTypeSchema = z.enum([
	'channel',
	'group',
	'im',
	'mpim',
	'app_home',
]);
type ChannelTypes = z.infer<typeof ChannelTypeSchema>;

const BlockSchema = z.object({
	type: z.string(),
	block_id: z.string().optional(),
});

const KnownBlockSchema = BlockSchema.extend({
	type: z.enum([
		'section',
		'divider',
		'image',
		'actions',
		'context',
		'input',
		'file',
		'header',
		'video',
		'rich_text',
	]),
});

const MessageAttachmentSchema = z.object({
	blocks: z.array(z.union([KnownBlockSchema, BlockSchema])).optional(),
	fallback: z.string().optional(),
	color: z.string().optional(),
	pretext: z.string().optional(),
	author_name: z.string().optional(),
	author_link: z.string().optional(),
	author_icon: z.string().optional(),
	title: z.string().optional(),
	title_link: z.string().optional(),
	text: z.string().optional(),
	fields: z
		.array(
			z.object({
				title: z.string(),
				value: z.string(),
				short: z.boolean().optional(),
			}),
		)
		.optional(),
	image_url: z.string().optional(),
	thumb_url: z.string().optional(),
	footer: z.string().optional(),
	footer_icon: z.string().optional(),
	ts: z.string().optional(),
});

const SlackFileSchema = z.object({
	id: z.string(),
	created: z.number(),
	name: z.string().nullable(),
	title: z.string().nullable(),
	mimetype: z.string(),
	filetype: z.string(),
	pretty_type: z.string(),
	user: z.string().optional(),
	editable: z.boolean(),
	size: z.number(),
	mode: z.enum(['hosted', 'external', 'snippet', 'post']),
	is_external: z.boolean(),
	external_type: z.string().nullable(),
	is_public: z.boolean(),
	public_url_shared: z.boolean(),
	display_as_bot: z.boolean(),
	username: z.string().nullable(),
	url_private: z.string().optional(),
	url_private_download: z.string().optional(),
	permalink: z.string(),
	permalink_public: z.string().optional(),
	channels: z.array(z.string()).nullable(),
	groups: z.array(z.string()).nullable(),
	users: z.array(z.string()).optional(),
	is_starred: z.boolean().optional(),
	num_stars: z.number().optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Non-recursive message event schemas
// ─────────────────────────────────────────────────────────────────────────────

export const GenericMessageEventSchema = z.object({
	type: z.literal('message'),
	event_ts: z.string(),
	team: z.string().optional(),
	channel: z.string(),
	user: z.string(),
	bot_id: z.string().optional(),
	bot_profile: BotProfileSchema.optional(),
	text: z.string().optional(),
	ts: z.string(),
	thread_ts: z.string().optional(),
	channel_type: ChannelTypeSchema,
	attachments: z.array(MessageAttachmentSchema).optional(),
	blocks: z.array(z.union([KnownBlockSchema, BlockSchema])).optional(),
	files: z.array(SlackFileSchema).optional(),
	edited: z.object({ user: z.string(), ts: z.string() }).optional(),
	client_msg_id: z.string().optional(),
	parent_user_id: z.string().optional(),
	is_starred: z.boolean().optional(),
	pinned_to: z.array(z.string()).optional(),
	reactions: z
		.array(
			z.object({
				name: z.string(),
				count: z.number(),
				users: z.array(z.string()),
			}),
		)
		.optional(),
	assistant_thread: z.record(z.unknown()).optional(),
});
export type GenericMessageEvent = z.infer<typeof GenericMessageEventSchema>;

export const BotMessageEventSchema = z.object({
	type: z.literal('message'),
	subtype: z.literal('bot_message'),
	event_ts: z.string(),
	channel: z.string(),
	channel_type: ChannelTypeSchema,
	streaming_state: z.enum(['in_progress', 'completed', 'errored']).optional(),
	ts: z.string(),
	text: z.string(),
	bot_id: z.string(),
	username: z.string().optional(),
	user: z.string().optional(),
	attachments: z.array(MessageAttachmentSchema).optional(),
	blocks: z.array(z.union([KnownBlockSchema, BlockSchema])).optional(),
	edited: z.object({ user: z.string(), ts: z.string() }).optional(),
	thread_ts: z.string().optional(),
});
export type BotMessageEvent = z.infer<typeof BotMessageEventSchema>;

export const ChannelArchiveMessageEventSchema = z.object({
	type: z.literal('message'),
	subtype: z.literal('channel_archive'),
	team: z.string(),
	user: z.string(),
	channel: z.string(),
	channel_type: ChannelTypeSchema,
	text: z.string(),
	ts: z.string(),
	event_ts: z.string(),
});
export type ChannelArchiveMessageEvent = z.infer<
	typeof ChannelArchiveMessageEventSchema
>;

export const ChannelJoinMessageEventSchema = z.object({
	type: z.literal('message'),
	subtype: z.literal('channel_join'),
	team: z.string(),
	user: z.string(),
	inviter: z.string(),
	channel: z.string(),
	channel_type: ChannelTypeSchema,
	text: z.string(),
	ts: z.string(),
	event_ts: z.string(),
});
export type ChannelJoinMessageEvent = z.infer<
	typeof ChannelJoinMessageEventSchema
>;

export const ChannelLeaveMessageEventSchema = z.object({
	type: z.literal('message'),
	subtype: z.literal('channel_leave'),
	team: z.string(),
	user: z.string(),
	channel: z.string(),
	channel_type: ChannelTypeSchema,
	text: z.string(),
	ts: z.string(),
	event_ts: z.string(),
});
export type ChannelLeaveMessageEvent = z.infer<
	typeof ChannelLeaveMessageEventSchema
>;

export const ChannelNameMessageEventSchema = z.object({
	type: z.literal('message'),
	subtype: z.literal('channel_name'),
	team: z.string(),
	user: z.string(),
	name: z.string(),
	old_name: z.string(),
	channel: z.string(),
	channel_type: ChannelTypeSchema,
	text: z.string(),
	ts: z.string(),
	event_ts: z.string(),
});
export type ChannelNameMessageEvent = z.infer<
	typeof ChannelNameMessageEventSchema
>;

export const ChannelPostingPermissionsMessageEventSchema = z.object({
	type: z.literal('message'),
	subtype: z.literal('channel_posting_permissions'),
	user: z.string(),
	channel: z.string(),
	channel_type: ChannelTypeSchema,
	text: z.string(),
	ts: z.string(),
	event_ts: z.string(),
});
export type ChannelPostingPermissionsMessageEvent = z.infer<
	typeof ChannelPostingPermissionsMessageEventSchema
>;

export const ChannelPurposeMessageEventSchema = z.object({
	type: z.literal('message'),
	subtype: z.literal('channel_purpose'),
	user: z.string(),
	channel: z.string(),
	channel_type: ChannelTypeSchema,
	text: z.string(),
	purpose: z.string(),
	ts: z.string(),
	event_ts: z.string(),
});
export type ChannelPurposeMessageEvent = z.infer<
	typeof ChannelPurposeMessageEventSchema
>;

export const ChannelTopicMessageEventSchema = z.object({
	type: z.literal('message'),
	subtype: z.literal('channel_topic'),
	user: z.string(),
	channel: z.string(),
	channel_type: ChannelTypeSchema,
	text: z.string(),
	topic: z.string(),
	ts: z.string(),
	event_ts: z.string(),
});
export type ChannelTopicMessageEvent = z.infer<
	typeof ChannelTopicMessageEventSchema
>;

export const ChannelUnarchiveMessageEventSchema = z.object({
	type: z.literal('message'),
	subtype: z.literal('channel_unarchive'),
	team: z.string(),
	user: z.string(),
	channel: z.string(),
	channel_type: ChannelTypeSchema,
	text: z.string(),
	ts: z.string(),
	event_ts: z.string(),
});
export type ChannelUnarchiveMessageEvent = z.infer<
	typeof ChannelUnarchiveMessageEventSchema
>;

export const EKMAccessDeniedMessageEventSchema = z.object({
	type: z.literal('message'),
	subtype: z.literal('ekm_access_denied'),
	event_ts: z.string(),
	channel: z.string(),
	channel_type: ChannelTypeSchema,
	ts: z.string(),
	text: z.string(),
	user: z.literal('UREVOKEDU'),
});
export type EKMAccessDeniedMessageEvent = z.infer<
	typeof EKMAccessDeniedMessageEventSchema
>;

export const FileShareMessageEventSchema = z.object({
	type: z.literal('message'),
	subtype: z.literal('file_share'),
	text: z.string(),
	attachments: z.array(MessageAttachmentSchema).optional(),
	blocks: z.array(z.union([KnownBlockSchema, BlockSchema])).optional(),
	files: z.array(SlackFileSchema).optional(),
	upload: z.boolean().optional(),
	display_as_bot: z.boolean().optional(),
	x_files: z.array(z.string()).optional(),
	user: z.string(),
	parent_user_id: z.string().optional(),
	ts: z.string(),
	thread_ts: z.string().optional(),
	channel: z.string(),
	channel_type: ChannelTypeSchema,
	event_ts: z.string(),
});
export type FileShareMessageEvent = z.infer<typeof FileShareMessageEventSchema>;

export const MeMessageEventSchema = z.object({
	type: z.literal('message'),
	subtype: z.literal('me_message'),
	event_ts: z.string(),
	channel: z.string(),
	channel_type: ChannelTypeSchema,
	user: z.string(),
	text: z.string(),
	ts: z.string(),
});
export type MeMessageEvent = z.infer<typeof MeMessageEventSchema>;

export const ThreadBroadcastMessageEventSchema = z.object({
	type: z.literal('message'),
	subtype: z.literal('thread_broadcast'),
	event_ts: z.string(),
	text: z.string(),
	attachments: z.array(MessageAttachmentSchema).optional(),
	blocks: z.array(z.union([KnownBlockSchema, BlockSchema])).optional(),
	user: z.string(),
	ts: z.string(),
	thread_ts: z.string().optional(),
	root: z.object({
		type: z.literal('message'),
		event_ts: z.string(),
		channel: z.string(),
		ts: z.string(),
		channel_type: ChannelTypeSchema,
		thread_ts: z.string(),
		reply_count: z.number(),
		reply_users_count: z.number(),
		latest_reply: z.string(),
		reply_users: z.array(z.string()),
		user: z.string().optional(),
		text: z.string().optional(),
		bot_id: z.string().optional(),
	}),
	client_msg_id: z.string(),
	channel: z.string(),
	channel_type: ChannelTypeSchema,
});
export type ThreadBroadcastMessageEvent = z.infer<
	typeof ThreadBroadcastMessageEventSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Inner message object for message_changed / message_deleted events.
//
// Slack sends a partial message representation inside these event envelopes —
// it lacks `channel` and `event_ts` (those live on the outer envelope) and
// may include source/user team fields not present on regular message events.
// ─────────────────────────────────────────────────────────────────────────────

export const SlackMessageObjectSchema = z.object({
	type: z.literal('message'),
	subtype: z.string().optional(),
	user: z.string().optional(),
	bot_id: z.string().optional(),
	ts: z.string(),
	client_msg_id: z.string().optional(),
	text: z.string().optional(),
	team: z.string().optional(),
	source_team: z.string().optional(),
	user_team: z.string().optional(),
	edited: z.object({ user: z.string(), ts: z.string() }).optional(),
	blocks: z
		.array(
			z
				.object({ type: z.string(), block_id: z.string().optional() })
				.passthrough(),
		)
		.optional(),
	thread_ts: z.string().optional(),
	reply_count: z.number().optional(),
	reply_users_count: z.number().optional(),
	latest_reply: z.string().optional(),
	reply_users: z.array(z.string()).optional(),
	subscribed: z.boolean().optional(),
	is_locked: z.boolean().optional(),
});
export type SlackMessageObject = z.infer<typeof SlackMessageObjectSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Recursive message event types
//
// MessageDeletedEvent and MessageRepliedEvent reference MessageEvent, creating
// a cycle. TypeScript interfaces handle cycles natively. The Zod schemas use
// z.lazy(() => MessageEventSchema) for the recursive fields.
//
// MessageChangedEvent uses SlackMessageObject (non-recursive) because Slack
// sends a partial inner message without `channel` / `event_ts`.
// ─────────────────────────────────────────────────────────────────────────────

export interface MessageChangedEvent {
	type: 'message';
	subtype: 'message_changed';
	event_ts: string;
	hidden: true;
	channel: string;
	channel_type: ChannelTypes;
	ts: string;
	message: SlackMessageObject;
	previous_message: SlackMessageObject;
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
		reply_users_count?: number;
		latest_reply?: string;
		reply_users?: string[];
		/** Slack sends minimal reply references at runtime, not full message objects. */
		replies: { user: string; ts: string }[];
	};
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

export const MessageChangedEventSchema: z.ZodType<MessageChangedEvent> =
	z.object({
		type: z.literal('message'),
		subtype: z.literal('message_changed'),
		event_ts: z.string(),
		hidden: z.literal(true),
		channel: z.string(),
		channel_type: ChannelTypeSchema,
		ts: z.string(),
		message: SlackMessageObjectSchema,
		previous_message: SlackMessageObjectSchema,
	});

export const MessageDeletedEventSchema: z.ZodType<MessageDeletedEvent> =
	z.object({
		type: z.literal('message'),
		subtype: z.literal('message_deleted'),
		event_ts: z.string(),
		hidden: z.literal(true),
		channel: z.string(),
		channel_type: ChannelTypeSchema,
		ts: z.string(),
		deleted_ts: z.string(),
		previous_message: z.lazy(() => MessageEventSchema),
	});

export const MessageRepliedEventSchema: z.ZodType<MessageRepliedEvent> =
	z.object({
		type: z.literal('message'),
		subtype: z.literal('message_replied'),
		event_ts: z.string(),
		hidden: z.literal(true),
		channel: z.string(),
		channel_type: ChannelTypeSchema,
		ts: z.string(),
		message: z
			.lazy(() => MessageEventSchema)
			.and(
				z.object({
					thread_ts: z.string(),
					reply_count: z.number(),
					reply_users_count: z.number().optional(),
					latest_reply: z.string().optional(),
					reply_users: z.array(z.string()).optional(),
					replies: z.array(z.object({ user: z.string(), ts: z.string() })),
				}),
			),
	});

export const AllMessageEventsSchema: z.ZodType<AllMessageEvents> = z.union([
	GenericMessageEventSchema,
	BotMessageEventSchema,
	ChannelArchiveMessageEventSchema,
	ChannelJoinMessageEventSchema,
	ChannelLeaveMessageEventSchema,
	ChannelNameMessageEventSchema,
	ChannelPostingPermissionsMessageEventSchema,
	ChannelPurposeMessageEventSchema,
	ChannelTopicMessageEventSchema,
	ChannelUnarchiveMessageEventSchema,
	EKMAccessDeniedMessageEventSchema,
	FileShareMessageEventSchema,
	MeMessageEventSchema,
	MessageChangedEventSchema,
	MessageDeletedEventSchema,
	MessageRepliedEventSchema,
	ThreadBroadcastMessageEventSchema,
]);

export const MessageEventSchema: z.ZodType<MessageEvent> =
	AllMessageEventsSchema;

// ─────────────────────────────────────────────────────────────────────────────
// Other event schemas
// ─────────────────────────────────────────────────────────────────────────────

export const AppMentionEventSchema = z.object({
	type: z.literal('app_mention'),
	subtype: z.string().optional(),
	bot_id: z.string().optional(),
	bot_profile: BotProfileSchema.optional(),
	username: z.string().optional(),
	team: z.string().optional(),
	user: z.string().optional(),
	text: z.string(),
	attachments: z.array(MessageAttachmentSchema).optional(),
	blocks: z.array(z.union([KnownBlockSchema, BlockSchema])).optional(),
	upload: z.boolean().optional(),
	display_as_bot: z.boolean().optional(),
	edited: z.object({ user: z.string(), ts: z.string() }).optional(),
	ts: z.string(),
	channel: z.string(),
	event_ts: z.string(),
	thread_ts: z.string().optional(),
	client_msg_id: z.string().optional(),
});
export type AppMentionEvent = z.infer<typeof AppMentionEventSchema>;

export const ChannelCreatedEventSchema = z.object({
	type: z.literal('channel_created'),
	event_ts: z.string(),
	channel: z.object({
		id: z.string(),
		is_channel: z.boolean(),
		name: z.string(),
		name_normalized: z.string(),
		created: z.number(),
		creator: z.string(),
		is_shared: z.boolean(),
		is_org_shared: z.boolean(),
		context_team_id: z.string(),
		is_archived: z.boolean(),
		is_frozen: z.boolean(),
		is_general: z.boolean(),
		is_group: z.boolean(),
		is_private: z.boolean(),
		is_ext_shared: z.boolean(),
		is_im: z.boolean(),
		is_mpim: z.boolean(),
		is_pending_ext_shared: z.boolean(),
	}),
});
export type ChannelCreatedEvent = z.infer<typeof ChannelCreatedEventSchema>;

const ReactionMessageItemSchema = z.object({
	type: z.literal('message'),
	channel: z.string(),
	ts: z.string(),
});

export const ChallengeEventSchema = z.object({
	type: z.literal('url_verification'),
	challenge: z.string(),
	token: z.string(),
});
export type ChallengeEvent = z.infer<typeof ChallengeEventSchema>;

export const ReactionAddedEventSchema = z.object({
	type: z.literal('reaction_added'),
	user: z.string(),
	reaction: z.string(),
	item_user: z.string(),
	item: ReactionMessageItemSchema,
	event_ts: z.string(),
});
export type ReactionAddedEvent = z.infer<typeof ReactionAddedEventSchema>;

export const ReactionRemovedEventSchema = z.object({
	type: z.literal('reaction_removed'),
	user: z.string(),
	reaction: z.string(),
	item_user: z.string(),
	item: ReactionMessageItemSchema,
	event_ts: z.string(),
});
export type ReactionRemovedEvent = z.infer<typeof ReactionRemovedEventSchema>;

const UserProfileSchema = z.object({
	title: z.string(),
	phone: z.string(),
	skype: z.string(),
	real_name: z.string(),
	real_name_normalized: z.string(),
	display_name: z.string(),
	display_name_normalized: z.string(),
	status_text: z.string(),
	status_text_canonical: z.string(),
	status_emoji: z.string(),
	status_emoji_display_info: z.array(StatusEmojiDisplayInfoSchema),
	status_expiration: z.number(),
	avatar_hash: z.string(),
	huddle_state: z.string().optional(),
	huddle_state_expiration_ts: z.number().optional(),
	first_name: z.string(),
	last_name: z.string(),
	email: z.string().optional(),
	image_original: z.string().optional(),
	is_custom_image: z.boolean().optional(),
	image_24: z.string(),
	image_32: z.string(),
	image_48: z.string(),
	image_72: z.string(),
	image_192: z.string(),
	image_512: z.string(),
	image_1024: z.string().optional(),
	team: z.string(),
	fields: z.union([
		z.record(z.object({ value: z.string(), alt: z.string() })),
		z.array(z.never()),
		z.null(),
	]),
});

const SlackUserSchema = z.object({
	id: z.string(),
	team_id: z.string(),
	name: z.string(),
	deleted: z.boolean(),
	color: z.string(),
	real_name: z.string(),
	tz: z.string(),
	tz_label: z.string(),
	tz_offset: z.number(),
	profile: UserProfileSchema,
	is_admin: z.boolean(),
	is_owner: z.boolean(),
	is_primary_owner: z.boolean(),
	is_restricted: z.boolean(),
	is_ultra_restricted: z.boolean(),
	is_bot: z.boolean(),
	is_stranger: z.boolean().optional(),
	updated: z.number(),
	is_email_confirmed: z.boolean(),
	is_app_user: z.boolean(),
	is_invited_user: z.boolean().optional(),
	has_2fa: z.boolean().optional(),
	locale: z.string(),
	presence: z.string().optional(),
	enterprise_user: z
		.object({
			id: z.string(),
			enterprise_id: z.string(),
			enterprise_name: z.string(),
			is_admin: z.boolean(),
			is_owner: z.boolean(),
			teams: z.array(z.string()),
		})
		.optional(),
	two_factor_type: z.string().optional(),
	has_files: z.boolean().optional(),
	is_workflow_bot: z.boolean().optional(),
	who_can_share_contact_card: z.string(),
});

export const TeamJoinEventSchema = z.object({
	type: z.literal('team_join'),
	user: SlackUserSchema,
	cache_ts: z.number(),
	event_ts: z.string(),
});
export type TeamJoinEvent = z.infer<typeof TeamJoinEventSchema>;

export const UserChangeEventSchema = z.object({
	type: z.literal('user_change'),
	user: SlackUserSchema,
	cache_ts: z.number(),
	event_ts: z.string(),
});
export type UserChangeEvent = z.infer<typeof UserChangeEventSchema>;

export const FileCreatedEventSchema = z.object({
	type: z.literal('file_created'),
	file_id: z.string(),
	user_id: z.string(),
	file: z.object({ id: z.string() }),
	event_ts: z.string(),
});
export type FileCreatedEvent = z.infer<typeof FileCreatedEventSchema>;

export const FilePublicEventSchema = z.object({
	type: z.literal('file_public'),
	file_id: z.string(),
	user_id: z.string(),
	file: z.object({ id: z.string() }),
	event_ts: z.string(),
});
export type FilePublicEvent = z.infer<typeof FilePublicEventSchema>;

export const FileSharedEventSchema = z.object({
	type: z.literal('file_shared'),
	file_id: z.string(),
	user_id: z.string(),
	file: z.object({ id: z.string() }),
	channel_id: z.string(),
	event_ts: z.string(),
});
export type FileSharedEvent = z.infer<typeof FileSharedEventSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Event name / map
// ─────────────────────────────────────────────────────────────────────────────

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

export const ReactionItemSchema = z.object({
	type: z.literal('message'),
	channel: z.string(),
	ts: z.string(),
});
export type ReactionItem = z.infer<typeof ReactionItemSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Webhook payload wrappers
// ─────────────────────────────────────────────────────────────────────────────

const SlackEventPayloadBaseSchema = z.object({
	token: z.string().optional(),
	team_id: z.string(),
	api_app_id: z.string(),
	type: z.literal('event_callback'),
	event_id: z.string(),
	event_time: z.number(),
	event_context: z.string().optional(),
	authorizations: z
		.array(
			z.object({
				enterprise_id: z.string().nullable(),
				team_id: z.string(),
				user_id: z.string(),
				is_bot: z.boolean(),
				is_enterprise_install: z.boolean(),
			}),
		)
		.optional(),
});

export const SlackUrlVerificationPayloadSchema = z.object({
	type: z.literal('url_verification'),
	challenge: z.string(),
});
export type SlackUrlVerificationPayload = z.infer<
	typeof SlackUrlVerificationPayloadSchema
>;

// Generic SlackEventPayload — keeps the TypeScript generic for use in typed
// webhook handler signatures while exposing a base Zod schema for inspection.
export type SlackEventPayload<TEvent = unknown> = z.infer<
	typeof SlackEventPayloadBaseSchema
> & { event: TEvent };

export type SlackWebhookPayload<TEvent = unknown> =
	| SlackEventPayload<TEvent>
	| SlackUrlVerificationPayload;

// ─────────────────────────────────────────────────────────────────────────────
// Per-webhook payload schemas (request.payload in the before hook)
// ─────────────────────────────────────────────────────────────────────────────

export const SlackChallengePayloadSchema = SlackUrlVerificationPayloadSchema;

export const SlackMessagePayloadSchema = SlackEventPayloadBaseSchema.extend({
	event: MessageEventSchema,
});

export const SlackChannelCreatedPayloadSchema =
	SlackEventPayloadBaseSchema.extend({
		event: ChannelCreatedEventSchema,
	});

export const SlackReactionAddedPayloadSchema =
	SlackEventPayloadBaseSchema.extend({
		event: ReactionAddedEventSchema,
	});

export const SlackTeamJoinPayloadSchema = SlackEventPayloadBaseSchema.extend({
	event: TeamJoinEventSchema,
});

export const SlackUserChangePayloadSchema = SlackEventPayloadBaseSchema.extend({
	event: UserChangeEventSchema,
});

export const SlackFileCreatedPayloadSchema = SlackEventPayloadBaseSchema.extend(
	{
		event: FileCreatedEventSchema,
	},
);

export const SlackFilePublicPayloadSchema = SlackEventPayloadBaseSchema.extend({
	event: FilePublicEventSchema,
});

export const SlackFileSharedPayloadSchema = SlackEventPayloadBaseSchema.extend({
	event: FileSharedEventSchema,
});

// ─────────────────────────────────────────────────────────────────────────────
// SlackWebhookOutputs — response.data type per webhook key
// ─────────────────────────────────────────────────────────────────────────────

export type SlackWebhookOutputs = {
	reactionAdded: ReactionAddedEvent;
	message: MessageEvent;
	channelCreated: ChannelCreatedEvent;
	teamJoin: TeamJoinEvent;
	userChange: UserChangeEvent;
	fileCreated: FileCreatedEvent;
	filePublic: FilePublicEvent;
	fileShared: FileSharedEvent;
	challenge: SlackUrlVerificationPayload;
};

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

function parseBody(body: unknown): unknown {
	return typeof body === 'string' ? JSON.parse(body) : body;
}

export function verifySlackWebhookSignature(
	request: WebhookRequest<unknown>,
	signingSecret?: string,
): { valid: boolean; error?: string } {
	if (!signingSecret) {
		return { valid: false };
	}

	const rawBody = request.rawBody;
	if (!rawBody) {
		return {
			valid: false,
			error: 'Missing raw body for signature verification',
		};
	}

	const headers = request.headers;
	const signature = Array.isArray(headers['x-slack-signature'])
		? headers['x-slack-signature'][0]
		: headers['x-slack-signature'];
	const timestamp = Array.isArray(headers['x-slack-request-timestamp'])
		? headers['x-slack-request-timestamp'][0]
		: headers['x-slack-request-timestamp'];

	if (!signature || !timestamp) {
		return {
			valid: false,
			error: 'Missing x-slack-signature or x-slack-request-timestamp header',
		};
	}

	const isValid = verifySlackSignature(
		rawBody,
		signingSecret,
		timestamp,
		signature,
	);
	if (!isValid) {
		return { valid: false, error: 'Invalid signature' };
	}

	return { valid: true };
}

/**
 * Creates a webhook matcher for a specific Slack event type.
 * Returns a matcher function that checks if the incoming webhook is for the specified event.
 * Also verifies that required Slack headers are present.
 */
export function createSlackEventMatch(
	eventType: string,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body) as Record<string, unknown>;

		if (eventType === 'url_verification') {
			return parsedBody.type === 'url_verification';
		}

		if (parsedBody.type === 'event_callback') {
			const event = parsedBody.event;
			if (
				event &&
				typeof event === 'object' &&
				'type' in event &&
				(event as Record<string, unknown>).type === eventType
			) {
				return true;
			}
		}

		return false;
	};
}
