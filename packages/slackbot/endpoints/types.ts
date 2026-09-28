import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Shared building blocks
//
// Every Slack Web API method answers with an `ok` envelope. Failures arrive as
// HTTP 200 with `{ ok: false, error }`, which `makeSlackbotRequest` converts
// into a thrown SlackbotAPIError, so output schemas here describe the success
// shape while keeping `ok`/`error` visible for callers that inspect them.
// Response objects stay `.loose()` because Slack adds fields without notice and
// dropping them would silently discard data the caller may rely on.
// ─────────────────────────────────────────────────────────────────────────────

const OkSchema = z.object({
	ok: z.boolean(),
	error: z.string().optional(),
	warning: z.string().optional(),
	needed: z.string().optional(),
	provided: z.string().optional(),
});

/** Slack's cursor pagination envelope, present on every `list`-style method. */
const ResponseMetadataSchema = z
	.object({
		next_cursor: z.string().optional(),
		warnings: z.array(z.string()).optional(),
		messages: z.array(z.string()).optional(),
	})
	.loose();

function slackResponse<T extends z.ZodRawShape>(shape: T) {
	return OkSchema.extend(shape).loose();
}

function paginated<T extends z.ZodRawShape>(shape: T) {
	return slackResponse({
		...shape,
		response_metadata: ResponseMetadataSchema.optional(),
	});
}

/** Cursor pagination inputs shared by every Slack `list`-style method. */
const CursorPaginationShape = {
	cursor: z.string().optional(),
	limit: z.number().int().min(1).max(1000).optional(),
};

/**
 * Block Kit payloads are user-authored JSON with a deep, open-ended schema.
 * Validating structure here would reject valid layouts whenever Slack ships a
 * new block type, so the array is accepted as loose records.
 */
const BlocksSchema = z.array(z.record(z.string(), z.unknown()));
const AttachmentsSchema = z.array(z.record(z.string(), z.unknown()));

/** Fields shared by chat.postMessage / postEphemeral / scheduleMessage. */
const MessageCompositionShape = {
	text: z.string().optional(),
	blocks: BlocksSchema.optional(),
	attachments: AttachmentsSchema.optional(),
	thread_ts: z.string().optional(),
	mrkdwn: z.boolean().optional(),
	parse: z.enum(['full', 'none']).optional(),
	link_names: z.boolean().optional(),
	unfurl_links: z.boolean().optional(),
	unfurl_media: z.boolean().optional(),
	metadata: z.record(z.string(), z.unknown()).optional(),
};

const SlackMessageSchema = z
	.object({
		type: z.string().optional(),
		subtype: z.string().optional(),
		ts: z.string().optional(),
		text: z.string().optional(),
		user: z.string().optional(),
		bot_id: z.string().optional(),
		app_id: z.string().optional(),
		team: z.string().optional(),
		username: z.string().optional(),
		thread_ts: z.string().optional(),
		reply_count: z.number().optional(),
		blocks: BlocksSchema.optional(),
		attachments: AttachmentsSchema.optional(),
	})
	.loose();

const SlackChannelSchema = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		is_channel: z.boolean().optional(),
		is_group: z.boolean().optional(),
		is_im: z.boolean().optional(),
		is_mpim: z.boolean().optional(),
		is_private: z.boolean().optional(),
		is_archived: z.boolean().optional(),
		is_general: z.boolean().optional(),
		is_member: z.boolean().optional(),
		created: z.number().optional(),
		creator: z.string().optional(),
		num_members: z.number().optional(),
		topic: z.record(z.string(), z.unknown()).optional(),
		purpose: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

const SlackUserSchema = z
	.object({
		id: z.string(),
		team_id: z.string().optional(),
		name: z.string().optional(),
		real_name: z.string().optional(),
		deleted: z.boolean().optional(),
		is_bot: z.boolean().optional(),
		is_admin: z.boolean().optional(),
		is_owner: z.boolean().optional(),
		is_app_user: z.boolean().optional(),
		tz: z.string().optional(),
		updated: z.number().optional(),
		profile: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

const SlackFileSchema = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		title: z.string().optional(),
		mimetype: z.string().optional(),
		filetype: z.string().optional(),
		size: z.number().optional(),
		user: z.string().optional(),
		created: z.number().optional(),
		is_external: z.boolean().optional(),
		is_public: z.boolean().optional(),
		url_private: z.string().optional(),
		url_private_download: z.string().optional(),
		permalink: z.string().optional(),
		permalink_public: z.string().optional(),
		external_id: z.string().optional(),
		external_url: z.string().optional(),
	})
	.loose();

const SlackUserGroupSchema = z
	.object({
		id: z.string(),
		team_id: z.string().optional(),
		name: z.string().optional(),
		handle: z.string().optional(),
		description: z.string().optional(),
		is_external: z.boolean().optional(),
		date_create: z.number().optional(),
		date_delete: z.number().optional(),
		user_count: z.union([z.number(), z.string()]).optional(),
		users: z.array(z.string()).optional(),
	})
	.loose();

const SlackReminderSchema = z
	.object({
		id: z.string(),
		creator: z.string().optional(),
		user: z.string().optional(),
		text: z.string().optional(),
		recurring: z.boolean().optional(),
		time: z.number().optional(),
		complete_ts: z.number().optional(),
	})
	.loose();

const SlackCallSchema = z
	.object({
		id: z.string(),
		date_start: z.number().optional(),
		external_unique_id: z.string().optional(),
		join_url: z.string().optional(),
		desktop_app_join_url: z.string().optional(),
		title: z.string().optional(),
		users: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.loose();

/**
 * Slack identifies call participants by exactly one of these ids. The union is
 * kept open rather than `.strict()` because Slack accepts either a Slack user
 * or an external identity for the same slot.
 */
const CallUserSchema = z
	.object({
		slack_id: z.string().optional(),
		external_id: z.string().optional(),
		display_name: z.string().optional(),
		avatar_url: z.string().optional(),
	})
	.loose();

// ─────────────────────────────────────────────────────────────────────────────
// Files (14 operations)
// ─────────────────────────────────────────────────────────────────────────────

const FilesRemoteAddInputSchema = z.object({
	external_id: z.string(),
	external_url: z.string().url(),
	title: z.string(),
	filetype: z.string().optional(),
	indexable_file_contents: z.string().optional(),
	preview_image: z.string().optional(),
});

const FilesDeleteInputSchema = z.object({
	file: z.string(),
});

const FilesCommentsDeleteInputSchema = z.object({
	file: z.string(),
	id: z.string(),
});

const FilesDownloadInputSchema = z.object({
	/** File id; the private download URL is resolved via files.info. */
	file: z.string(),
	/**
	 * Guard against pulling a multi-gigabyte upload into memory. Downloads
	 * larger than this fail fast instead of exhausting the process heap.
	 */
	max_bytes: z
		.number()
		.int()
		.positive()
		.max(100 * 1024 * 1024)
		.optional(),
});

const FilesRemoteInfoInputSchema = z
	.object({
		file: z.string().optional(),
		external_id: z.string().optional(),
	})
	.refine((v) => Boolean(v.file || v.external_id), {
		message: 'Provide either file or external_id',
	});

const FilesRemoteListInputSchema = z.object({
	channel: z.string().optional(),
	ts_from: z.number().optional(),
	ts_to: z.number().optional(),
	...CursorPaginationShape,
});

const FilesListInputSchema = z.object({
	channel: z.string().optional(),
	user: z.string().optional(),
	ts_from: z.number().optional(),
	ts_to: z.number().optional(),
	types: z.string().optional(),
	show_files_hidden_by_limit: z.boolean().optional(),
	team_id: z.string().optional(),
	count: z.number().int().positive().optional(),
	page: z.number().int().positive().optional(),
});

const FilesRemoteRemoveInputSchema = z
	.object({
		file: z.string().optional(),
		external_id: z.string().optional(),
	})
	.refine((v) => Boolean(v.file || v.external_id), {
		message: 'Provide either file or external_id',
	});

const FilesInfoInputSchema = z.object({
	file: z.string(),
	count: z.number().int().positive().optional(),
	page: z.number().int().positive().optional(),
	...CursorPaginationShape,
});

const FilesRevokePublicUrlInputSchema = z.object({
	file: z.string(),
});

const FilesRemoteShareInputSchema = z
	.object({
		channels: z.string(),
		file: z.string().optional(),
		external_id: z.string().optional(),
	})
	.refine((v) => Boolean(v.file || v.external_id), {
		message: 'Provide either file or external_id',
	});

const FilesSharePublicUrlInputSchema = z.object({
	file: z.string(),
});

const FilesRemoteUpdateInputSchema = z
	.object({
		file: z.string().optional(),
		external_id: z.string().optional(),
		external_url: z.string().url().optional(),
		title: z.string().optional(),
		filetype: z.string().optional(),
		indexable_file_contents: z.string().optional(),
		preview_image: z.string().optional(),
	})
	.refine((v) => Boolean(v.file || v.external_id), {
		message: 'Provide either file or external_id',
	});

const FilesUploadInputSchema = z.object({
	filename: z.string(),
	/** Base64-encoded file bytes. */
	content: z.string(),
	title: z.string().optional(),
	alt_txt: z.string().optional(),
	snippet_type: z.string().optional(),
	channel_id: z.string().optional(),
	initial_comment: z.string().optional(),
	thread_ts: z.string().optional(),
});

const FilesRemoteFileResponseSchema = slackResponse({
	file: SlackFileSchema.optional(),
});

const FilesInfoResponseSchema = paginated({
	file: SlackFileSchema.optional(),
	content: z.string().optional(),
	comments: z.array(z.record(z.string(), z.unknown())).optional(),
});

const FilesListResponseSchema = paginated({
	files: z.array(SlackFileSchema).optional(),
	paging: z.record(z.string(), z.unknown()).optional(),
});

const FilesRemoteListResponseSchema = paginated({
	files: z.array(SlackFileSchema).optional(),
});

const FilesDownloadResponseSchema = slackResponse({
	file: SlackFileSchema.optional(),
	/** Base64-encoded bytes of the downloaded file. */
	content: z.string(),
	content_type: z.string().optional(),
	byte_size: z.number(),
});

const FilesPublicUrlResponseSchema = slackResponse({
	file: SlackFileSchema.optional(),
});

const FilesShareResponseSchema = slackResponse({
	file: SlackFileSchema.optional(),
});

const FilesUploadResponseSchema = slackResponse({
	files: z.array(SlackFileSchema).optional(),
	file: SlackFileSchema.optional(),
});

const OkOnlyResponseSchema = slackResponse({});

// ─────────────────────────────────────────────────────────────────────────────
// Messages, reactions and pins (16 operations)
// ─────────────────────────────────────────────────────────────────────────────

/** Slack accepts a name or an item reference; both shapes are validated. */
const ReactionTargetShape = {
	channel: z.string(),
	timestamp: z.string(),
};

const MessagesReactionAddInputSchema = z.object({
	name: z.string(),
	...ReactionTargetShape,
});

const MessagesReactionRemoveInputSchema = z.object({
	name: z.string(),
	...ReactionTargetShape,
});

const MessagesReactionsGetInputSchema = z.object({
	channel: z.string().optional(),
	timestamp: z.string().optional(),
	file: z.string().optional(),
	file_comment: z.string().optional(),
	full: z.boolean().optional(),
});

const MessagesReactionsListInputSchema = z.object({
	user: z.string().optional(),
	full: z.boolean().optional(),
	team_id: z.string().optional(),
	...CursorPaginationShape,
});

const MessagesDeleteInputSchema = z.object({
	channel: z.string(),
	ts: z.string(),
	as_user: z.boolean().optional(),
});

const MessagesDeleteScheduledInputSchema = z.object({
	channel: z.string(),
	scheduled_message_id: z.string(),
	as_user: z.boolean().optional(),
});

const MessagesHistoryInputSchema = z.object({
	channel: z.string(),
	latest: z.string().optional(),
	oldest: z.string().optional(),
	inclusive: z.boolean().optional(),
	include_all_metadata: z.boolean().optional(),
	...CursorPaginationShape,
});

const MessagesRepliesInputSchema = z.object({
	channel: z.string(),
	ts: z.string(),
	latest: z.string().optional(),
	oldest: z.string().optional(),
	inclusive: z.boolean().optional(),
	include_all_metadata: z.boolean().optional(),
	...CursorPaginationShape,
});

const MessagesPinAddInputSchema = z.object({
	channel: z.string(),
	timestamp: z.string(),
});

const MessagesPinRemoveInputSchema = z.object({
	channel: z.string(),
	timestamp: z.string(),
});

const MessagesPinsListInputSchema = z.object({
	channel: z.string(),
});

const MessagesPostInputSchema = z.object({
	channel: z.string(),
	...MessageCompositionShape,
	as_user: z.boolean().optional(),
	icon_emoji: z.string().optional(),
	icon_url: z.string().optional(),
	username: z.string().optional(),
	reply_broadcast: z.boolean().optional(),
});

const MessagesPostEphemeralInputSchema = z.object({
	channel: z.string(),
	user: z.string(),
	...MessageCompositionShape,
	as_user: z.boolean().optional(),
	icon_emoji: z.string().optional(),
	icon_url: z.string().optional(),
	username: z.string().optional(),
});

const MessagesScheduleInputSchema = z.object({
	channel: z.string(),
	/** Unix epoch seconds; Slack rejects times more than 120 days out. */
	post_at: z.number().int().positive(),
	...MessageCompositionShape,
	as_user: z.boolean().optional(),
	reply_broadcast: z.boolean().optional(),
});

const MessagesPostMeInputSchema = z.object({
	channel: z.string(),
	text: z.string(),
});

const MessagesUpdateInputSchema = z.object({
	channel: z.string(),
	ts: z.string(),
	text: z.string().optional(),
	blocks: BlocksSchema.optional(),
	attachments: AttachmentsSchema.optional(),
	as_user: z.boolean().optional(),
	link_names: z.boolean().optional(),
	parse: z.enum(['full', 'none']).optional(),
	metadata: z.record(z.string(), z.unknown()).optional(),
	reply_broadcast: z.boolean().optional(),
	file_ids: z.array(z.string()).optional(),
});

const MessagesPostResponseSchema = slackResponse({
	channel: z.string().optional(),
	ts: z.string().optional(),
	message: SlackMessageSchema.optional(),
});

const MessagesPostEphemeralResponseSchema = slackResponse({
	message_ts: z.string().optional(),
});

const MessagesScheduleResponseSchema = slackResponse({
	channel: z.string().optional(),
	scheduled_message_id: z.string().optional(),
	post_at: z.number().optional(),
	message: SlackMessageSchema.optional(),
});

const MessagesUpdateResponseSchema = slackResponse({
	channel: z.string().optional(),
	ts: z.string().optional(),
	text: z.string().optional(),
	message: SlackMessageSchema.optional(),
});

const MessagesDeleteResponseSchema = slackResponse({
	channel: z.string().optional(),
	ts: z.string().optional(),
});

const MessagesHistoryResponseSchema = paginated({
	messages: z.array(SlackMessageSchema).optional(),
	has_more: z.boolean().optional(),
	pin_count: z.number().optional(),
});

const MessagesRepliesResponseSchema = paginated({
	messages: z.array(SlackMessageSchema).optional(),
	has_more: z.boolean().optional(),
});

const MessagesReactionsGetResponseSchema = slackResponse({
	type: z.string().optional(),
	channel: z.string().optional(),
	message: SlackMessageSchema.optional(),
	file: SlackFileSchema.optional(),
});

const MessagesReactionsListResponseSchema = paginated({
	items: z.array(z.record(z.string(), z.unknown())).optional(),
});

const MessagesPinsListResponseSchema = slackResponse({
	items: z.array(z.record(z.string(), z.unknown())).optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Conversations (17 operations)
// ─────────────────────────────────────────────────────────────────────────────

/** Slack's conversation type filter, sent as a comma-joined string. */
const ConversationTypeSchema = z.enum([
	'public_channel',
	'private_channel',
	'mpim',
	'im',
]);

const ConversationsArchiveInputSchema = z.object({ channel: z.string() });
const ConversationsUnarchiveInputSchema = z.object({ channel: z.string() });
const ConversationsCloseInputSchema = z.object({ channel: z.string() });
const ConversationsJoinInputSchema = z.object({ channel: z.string() });
const ConversationsLeaveInputSchema = z.object({ channel: z.string() });

const ConversationsCreateInputSchema = z.object({
	name: z.string().max(80),
	is_private: z.boolean().optional(),
	team_id: z.string().optional(),
});

const ConversationsInfoInputSchema = z.object({
	channel: z.string(),
	include_locale: z.boolean().optional(),
	include_num_members: z.boolean().optional(),
});

const ConversationsListInputSchema = z.object({
	exclude_archived: z.boolean().optional(),
	types: z.array(ConversationTypeSchema).optional(),
	team_id: z.string().optional(),
	...CursorPaginationShape,
});

/**
 * Slack exposes no channel-name search method, so this pages `conversations.list`
 * and filters locally. `max_pages` bounds the crawl on large workspaces.
 */
const ConversationsFindInputSchema = z.object({
	query: z.string().min(1),
	exclude_archived: z.boolean().optional(),
	types: z.array(ConversationTypeSchema).optional(),
	team_id: z.string().optional(),
	match: z.enum(['contains', 'exact', 'prefix']).optional(),
	limit: z.number().int().min(1).max(1000).optional(),
	max_pages: z.number().int().min(1).max(50).optional(),
});

const ConversationsListForUserInputSchema = z.object({
	user: z.string().optional(),
	exclude_archived: z.boolean().optional(),
	types: z.array(ConversationTypeSchema).optional(),
	team_id: z.string().optional(),
	...CursorPaginationShape,
});

const ConversationsMembersInputSchema = z.object({
	channel: z.string(),
	...CursorPaginationShape,
});

const ConversationsInviteInputSchema = z.object({
	channel: z.string(),
	users: z.array(z.string()).min(1).max(1000),
	force: z.boolean().optional(),
});

const ConversationsKickInputSchema = z.object({
	channel: z.string(),
	user: z.string(),
});

const ConversationsRenameInputSchema = z.object({
	channel: z.string(),
	name: z.string().max(80),
});

const ConversationsSetPurposeInputSchema = z.object({
	channel: z.string(),
	purpose: z.string(),
});

const ConversationsSetTopicInputSchema = z.object({
	channel: z.string(),
	topic: z.string(),
});

const ConversationsMarkInputSchema = z.object({
	channel: z.string(),
	ts: z.string(),
});

const ConversationsChannelResponseSchema = slackResponse({
	channel: SlackChannelSchema.optional(),
});

const ConversationsListResponseSchema = paginated({
	channels: z.array(SlackChannelSchema).optional(),
});

const ConversationsFindResponseSchema = slackResponse({
	channels: z.array(SlackChannelSchema),
	/** True when the crawl stopped at `max_pages` before exhausting Slack. */
	truncated: z.boolean(),
	pages_scanned: z.number(),
});

const ConversationsMembersResponseSchema = paginated({
	members: z.array(z.string()).optional(),
});

const ConversationsPurposeResponseSchema = slackResponse({
	purpose: z.string().optional(),
	channel: SlackChannelSchema.optional(),
});

const ConversationsTopicResponseSchema = slackResponse({
	topic: z.string().optional(),
	channel: SlackChannelSchema.optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Users, presence and do-not-disturb (11 operations)
// ─────────────────────────────────────────────────────────────────────────────

const UsersListInputSchema = z.object({
	include_locale: z.boolean().optional(),
	team_id: z.string().optional(),
	...CursorPaginationShape,
});

/**
 * Slack has no user-search method for bot tokens, so this pages `users.list`
 * and matches locally against name, real name, display name and email.
 */
const UsersFindInputSchema = z.object({
	query: z.string().min(1),
	include_deleted: z.boolean().optional(),
	include_bots: z.boolean().optional(),
	team_id: z.string().optional(),
	limit: z.number().int().min(1).max(1000).optional(),
	max_pages: z.number().int().min(1).max(50).optional(),
});

const UsersInfoInputSchema = z.object({
	user: z.string(),
	include_locale: z.boolean().optional(),
});

const UsersGetProfileInputSchema = z.object({
	user: z.string().optional(),
	include_labels: z.boolean().optional(),
});

const UsersGetPresenceInputSchema = z.object({
	user: z.string().optional(),
});

const UsersSetPresenceInputSchema = z.object({
	presence: z.enum(['auto', 'away']),
});

const UsersSetActiveInputSchema = z.object({});

const UsersLookupByEmailInputSchema = z.object({
	email: z.string().email(),
});

const UsersBotsInfoInputSchema = z.object({
	bot: z.string().optional(),
	team_id: z.string().optional(),
});

const UsersDndInfoInputSchema = z.object({
	user: z.string().optional(),
	team_id: z.string().optional(),
});

const UsersDndTeamInfoInputSchema = z.object({
	users: z.array(z.string()).optional(),
	team_id: z.string().optional(),
});

const UsersListResponseSchema = paginated({
	members: z.array(SlackUserSchema).optional(),
	cache_ts: z.number().optional(),
});

const UsersFindResponseSchema = slackResponse({
	members: z.array(SlackUserSchema),
	truncated: z.boolean(),
	pages_scanned: z.number(),
});

const UsersInfoResponseSchema = slackResponse({
	user: SlackUserSchema.optional(),
});

const UsersProfileResponseSchema = slackResponse({
	profile: z.record(z.string(), z.unknown()).optional(),
});

const UsersPresenceResponseSchema = slackResponse({
	presence: z.string().optional(),
	online: z.boolean().optional(),
	auto_away: z.boolean().optional(),
	manual_away: z.boolean().optional(),
	connection_count: z.number().optional(),
	last_activity: z.number().optional(),
});

const UsersBotsInfoResponseSchema = slackResponse({
	bot: z
		.object({
			id: z.string().optional(),
			deleted: z.boolean().optional(),
			name: z.string().optional(),
			updated: z.number().optional(),
			app_id: z.string().optional(),
			user_id: z.string().optional(),
			icons: z.record(z.string(), z.unknown()).optional(),
		})
		.loose()
		.optional(),
});

const UsersDndInfoResponseSchema = slackResponse({
	dnd_enabled: z.boolean().optional(),
	next_dnd_start_ts: z.number().optional(),
	next_dnd_end_ts: z.number().optional(),
	snooze_enabled: z.boolean().optional(),
	snooze_endtime: z.number().optional(),
	snooze_remaining: z.number().optional(),
});

const UsersDndTeamInfoResponseSchema = slackResponse({
	users: z.record(z.string(), z.record(z.string(), z.unknown())).optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Reminders (5 operations)
// ─────────────────────────────────────────────────────────────────────────────

const RemindersAddInputSchema = z.object({
	text: z.string(),
	/** Unix epoch seconds, a number of seconds from now, or natural language. */
	time: z.union([z.number().int().positive(), z.string()]),
	user: z.string().optional(),
	team_id: z.string().optional(),
});

const RemindersDeleteInputSchema = z.object({
	reminder: z.string(),
	team_id: z.string().optional(),
});

const RemindersInfoInputSchema = z.object({
	reminder: z.string(),
	team_id: z.string().optional(),
});

const RemindersListInputSchema = z.object({
	team_id: z.string().optional(),
});

const RemindersCompleteInputSchema = z.object({
	reminder: z.string(),
	team_id: z.string().optional(),
});

const RemindersReminderResponseSchema = slackResponse({
	reminder: SlackReminderSchema.optional(),
});

const RemindersListResponseSchema = slackResponse({
	reminders: z.array(SlackReminderSchema).optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// User groups (7 operations)
// ─────────────────────────────────────────────────────────────────────────────

const UserGroupsCreateInputSchema = z.object({
	name: z.string(),
	handle: z.string().optional(),
	description: z.string().optional(),
	channels: z.array(z.string()).optional(),
	include_count: z.boolean().optional(),
	team_id: z.string().optional(),
});

const UserGroupsUpdateInputSchema = z.object({
	usergroup: z.string(),
	name: z.string().optional(),
	handle: z.string().optional(),
	description: z.string().optional(),
	channels: z.array(z.string()).optional(),
	include_count: z.boolean().optional(),
	team_id: z.string().optional(),
});

const UserGroupsDisableInputSchema = z.object({
	usergroup: z.string(),
	include_count: z.boolean().optional(),
	team_id: z.string().optional(),
});

const UserGroupsEnableInputSchema = z.object({
	usergroup: z.string(),
	include_count: z.boolean().optional(),
	team_id: z.string().optional(),
});

const UserGroupsListInputSchema = z.object({
	include_disabled: z.boolean().optional(),
	include_count: z.boolean().optional(),
	include_users: z.boolean().optional(),
	team_id: z.string().optional(),
});

const UserGroupsUsersListInputSchema = z.object({
	usergroup: z.string(),
	include_disabled: z.boolean().optional(),
	team_id: z.string().optional(),
});

const UserGroupsUsersUpdateInputSchema = z.object({
	usergroup: z.string(),
	users: z.array(z.string()).min(1),
	include_count: z.boolean().optional(),
	team_id: z.string().optional(),
});

const UserGroupsGroupResponseSchema = slackResponse({
	usergroup: SlackUserGroupSchema.optional(),
});

const UserGroupsListResponseSchema = slackResponse({
	usergroups: z.array(SlackUserGroupSchema).optional(),
});

const UserGroupsUsersListResponseSchema = slackResponse({
	users: z.array(z.string()).optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Canvases (6 operations)
// ─────────────────────────────────────────────────────────────────────────────

/** Canvas bodies are authored as Slack-flavoured markdown. */
const CanvasDocumentContentSchema = z.object({
	type: z.literal('markdown'),
	markdown: z.string(),
});

const CanvasChangeSchema = z.object({
	operation: z.enum([
		'insert_after',
		'insert_before',
		'insert_at_start',
		'insert_at_end',
		'replace',
		'delete',
	]),
	section_id: z.string().optional(),
	document_content: CanvasDocumentContentSchema.optional(),
});

const CanvasesCreateInputSchema = z.object({
	title: z.string().optional(),
	document_content: CanvasDocumentContentSchema.optional(),
	/** Set to create a channel canvas instead of a standalone one. */
	channel_id: z.string().optional(),
});

const CanvasesEditInputSchema = z.object({
	canvas_id: z.string(),
	changes: z.array(CanvasChangeSchema).min(1),
});

const CanvasesDeleteInputSchema = z.object({
	canvas_id: z.string(),
});

const CanvasesGetInputSchema = z.object({
	canvas_id: z.string(),
});

const CanvasesListInputSchema = z.object({
	channel: z.string().optional(),
	user: z.string().optional(),
	team_id: z.string().optional(),
	count: z.number().int().positive().optional(),
	page: z.number().int().positive().optional(),
});

const CanvasesSectionsLookupInputSchema = z.object({
	canvas_id: z.string(),
	criteria: z
		.object({
			section_types: z
				.array(z.enum(['any_header', 'h1', 'h2', 'h3']))
				.optional(),
			contains_text: z.string().optional(),
		})
		.refine(
			(v) => Boolean(v.section_types?.length) || Boolean(v.contains_text),
			{ message: 'Provide section_types or contains_text' },
		),
});

const CanvasesCreateResponseSchema = slackResponse({
	canvas_id: z.string().optional(),
});

const CanvasesGetResponseSchema = slackResponse({
	file: SlackFileSchema.optional(),
	content: z.string().optional(),
});

const CanvasesListResponseSchema = paginated({
	files: z.array(SlackFileSchema).optional(),
	paging: z.record(z.string(), z.unknown()).optional(),
});

const CanvasesSectionsLookupResponseSchema = slackResponse({
	sections: z.array(z.object({ id: z.string() }).loose()).optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Calls (6 operations)
// ─────────────────────────────────────────────────────────────────────────────

const CallsAddInputSchema = z.object({
	external_unique_id: z.string(),
	join_url: z.string().url(),
	created_by: z.string().optional(),
	date_start: z.number().int().optional(),
	desktop_app_join_url: z.string().url().optional(),
	external_display_id: z.string().optional(),
	title: z.string().optional(),
	users: z.array(CallUserSchema).optional(),
});

const CallsEndInputSchema = z.object({
	id: z.string(),
	/** Call length in seconds. */
	duration: z.number().int().positive().optional(),
});

const CallsInfoInputSchema = z.object({
	id: z.string(),
});

const CallsUpdateInputSchema = z.object({
	id: z.string(),
	title: z.string().optional(),
	join_url: z.string().url().optional(),
	desktop_app_join_url: z.string().url().optional(),
});

const CallsParticipantsAddInputSchema = z.object({
	id: z.string(),
	users: z.array(CallUserSchema).min(1),
});

const CallsParticipantsRemoveInputSchema = z.object({
	id: z.string(),
	users: z.array(CallUserSchema).min(1),
});

const CallsCallResponseSchema = slackResponse({
	call: SlackCallSchema.optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Team and metadata (5 operations)
// ─────────────────────────────────────────────────────────────────────────────

const TeamUnfurlInputSchema = z.object({
	channel: z.string(),
	ts: z.string(),
	/** Map of URL to its Block Kit or attachment preview. */
	unfurls: z.record(z.string(), z.record(z.string(), z.unknown())),
	user_auth_message: z.string().optional(),
	user_auth_required: z.boolean().optional(),
	user_auth_url: z.string().url().optional(),
});

const TeamInfoInputSchema = z.object({
	team: z.string().optional(),
	domain: z.string().optional(),
});

const TeamProfileGetInputSchema = z.object({
	visibility: z.enum(['all', 'visible', 'hidden']).optional(),
});

const TeamEmojiListInputSchema = z.object({
	include_categories: z.boolean().optional(),
});

const TeamOpenDmInputSchema = z
	.object({
		channel: z.string().optional(),
		users: z.array(z.string()).optional(),
		prevent_creation: z.boolean().optional(),
		return_im: z.boolean().optional(),
	})
	.refine((v) => Boolean(v.channel) || Boolean(v.users?.length), {
		message: 'Provide either channel or users',
	});

const TeamInfoResponseSchema = slackResponse({
	team: z
		.object({
			id: z.string(),
			name: z.string().optional(),
			domain: z.string().optional(),
			email_domain: z.string().optional(),
			icon: z.record(z.string(), z.unknown()).optional(),
			enterprise_id: z.string().optional(),
			enterprise_name: z.string().optional(),
		})
		.loose()
		.optional(),
});

const TeamProfileGetResponseSchema = slackResponse({
	profile: z.record(z.string(), z.unknown()).optional(),
});

const TeamEmojiListResponseSchema = slackResponse({
	emoji: z.record(z.string(), z.string()).optional(),
	categories: z.array(z.record(z.string(), z.unknown())).optional(),
});

const TeamOpenDmResponseSchema = slackResponse({
	channel: SlackChannelSchema.optional(),
	no_op: z.boolean().optional(),
	already_open: z.boolean().optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint schema registry (87 operations)
//
// These two maps are the single source of truth: the exported input/output
// types are derived from them, so a schema and its type can never drift.
// ─────────────────────────────────────────────────────────────────────────────

export const SlackbotEndpointInputSchemas = {
	// Files
	filesRemoteAdd: FilesRemoteAddInputSchema,
	filesDelete: FilesDeleteInputSchema,
	filesCommentsDelete: FilesCommentsDeleteInputSchema,
	filesDownload: FilesDownloadInputSchema,
	filesRemoteInfo: FilesRemoteInfoInputSchema,
	filesRemoteList: FilesRemoteListInputSchema,
	filesList: FilesListInputSchema,
	filesRemoteRemove: FilesRemoteRemoveInputSchema,
	filesInfo: FilesInfoInputSchema,
	filesRevokePublicUrl: FilesRevokePublicUrlInputSchema,
	filesRemoteShare: FilesRemoteShareInputSchema,
	filesSharePublicUrl: FilesSharePublicUrlInputSchema,
	filesRemoteUpdate: FilesRemoteUpdateInputSchema,
	filesUpload: FilesUploadInputSchema,

	// Messages, reactions, pins
	messagesReactionAdd: MessagesReactionAddInputSchema,
	messagesDelete: MessagesDeleteInputSchema,
	messagesDeleteScheduled: MessagesDeleteScheduledInputSchema,
	messagesHistory: MessagesHistoryInputSchema,
	messagesReactionsGet: MessagesReactionsGetInputSchema,
	messagesReplies: MessagesRepliesInputSchema,
	messagesPinsList: MessagesPinsListInputSchema,
	messagesReactionsList: MessagesReactionsListInputSchema,
	messagesPinAdd: MessagesPinAddInputSchema,
	messagesReactionRemove: MessagesReactionRemoveInputSchema,
	messagesSchedule: MessagesScheduleInputSchema,
	messagesPostEphemeral: MessagesPostEphemeralInputSchema,
	messagesPostMe: MessagesPostMeInputSchema,
	messagesPost: MessagesPostInputSchema,
	messagesPinRemove: MessagesPinRemoveInputSchema,
	messagesUpdate: MessagesUpdateInputSchema,

	// Conversations
	conversationsArchive: ConversationsArchiveInputSchema,
	conversationsClose: ConversationsCloseInputSchema,
	conversationsCreate: ConversationsCreateInputSchema,
	conversationsFind: ConversationsFindInputSchema,
	conversationsMembers: ConversationsMembersInputSchema,
	conversationsInvite: ConversationsInviteInputSchema,
	conversationsJoin: ConversationsJoinInputSchema,
	conversationsLeave: ConversationsLeaveInputSchema,
	conversationsList: ConversationsListInputSchema,
	conversationsListForUser: ConversationsListForUserInputSchema,
	conversationsKick: ConversationsKickInputSchema,
	conversationsRename: ConversationsRenameInputSchema,
	conversationsInfo: ConversationsInfoInputSchema,
	conversationsSetPurpose: ConversationsSetPurposeInputSchema,
	conversationsMark: ConversationsMarkInputSchema,
	conversationsSetTopic: ConversationsSetTopicInputSchema,
	conversationsUnarchive: ConversationsUnarchiveInputSchema,

	// Users, presence, DND
	usersFind: UsersFindInputSchema,
	usersDndTeamInfo: UsersDndTeamInfoInputSchema,
	usersList: UsersListInputSchema,
	usersSetActive: UsersSetActiveInputSchema,
	usersDndInfo: UsersDndInfoInputSchema,
	usersInfo: UsersInfoInputSchema,
	usersGetPresence: UsersGetPresenceInputSchema,
	usersGetProfile: UsersGetProfileInputSchema,
	usersSetPresence: UsersSetPresenceInputSchema,
	usersBotsInfo: UsersBotsInfoInputSchema,
	usersLookupByEmail: UsersLookupByEmailInputSchema,

	// Reminders
	remindersAdd: RemindersAddInputSchema,
	remindersDelete: RemindersDeleteInputSchema,
	remindersInfo: RemindersInfoInputSchema,
	remindersList: RemindersListInputSchema,
	remindersComplete: RemindersCompleteInputSchema,

	// User groups
	userGroupsCreate: UserGroupsCreateInputSchema,
	userGroupsDisable: UserGroupsDisableInputSchema,
	userGroupsEnable: UserGroupsEnableInputSchema,
	userGroupsUsersList: UserGroupsUsersListInputSchema,
	userGroupsList: UserGroupsListInputSchema,
	userGroupsUpdate: UserGroupsUpdateInputSchema,
	userGroupsUsersUpdate: UserGroupsUsersUpdateInputSchema,

	// Canvases
	canvasesCreate: CanvasesCreateInputSchema,
	canvasesDelete: CanvasesDeleteInputSchema,
	canvasesEdit: CanvasesEditInputSchema,
	canvasesGet: CanvasesGetInputSchema,
	canvasesList: CanvasesListInputSchema,
	canvasesSectionsLookup: CanvasesSectionsLookupInputSchema,

	// Calls
	callsAdd: CallsAddInputSchema,
	callsEnd: CallsEndInputSchema,
	callsInfo: CallsInfoInputSchema,
	callsUpdate: CallsUpdateInputSchema,
	callsParticipantsAdd: CallsParticipantsAddInputSchema,
	callsParticipantsRemove: CallsParticipantsRemoveInputSchema,

	// Team and metadata
	teamUnfurl: TeamUnfurlInputSchema,
	teamInfo: TeamInfoInputSchema,
	teamProfileGet: TeamProfileGetInputSchema,
	teamEmojiList: TeamEmojiListInputSchema,
	teamOpenDm: TeamOpenDmInputSchema,
} as const;

export const SlackbotEndpointOutputSchemas = {
	// Files
	filesRemoteAdd: FilesRemoteFileResponseSchema,
	filesDelete: OkOnlyResponseSchema,
	filesCommentsDelete: OkOnlyResponseSchema,
	filesDownload: FilesDownloadResponseSchema,
	filesRemoteInfo: FilesRemoteFileResponseSchema,
	filesRemoteList: FilesRemoteListResponseSchema,
	filesList: FilesListResponseSchema,
	filesRemoteRemove: OkOnlyResponseSchema,
	filesInfo: FilesInfoResponseSchema,
	filesRevokePublicUrl: FilesPublicUrlResponseSchema,
	filesRemoteShare: FilesShareResponseSchema,
	filesSharePublicUrl: FilesPublicUrlResponseSchema,
	filesRemoteUpdate: FilesRemoteFileResponseSchema,
	filesUpload: FilesUploadResponseSchema,

	// Messages, reactions, pins
	messagesReactionAdd: OkOnlyResponseSchema,
	messagesDelete: MessagesDeleteResponseSchema,
	messagesDeleteScheduled: OkOnlyResponseSchema,
	messagesHistory: MessagesHistoryResponseSchema,
	messagesReactionsGet: MessagesReactionsGetResponseSchema,
	messagesReplies: MessagesRepliesResponseSchema,
	messagesPinsList: MessagesPinsListResponseSchema,
	messagesReactionsList: MessagesReactionsListResponseSchema,
	messagesPinAdd: OkOnlyResponseSchema,
	messagesReactionRemove: OkOnlyResponseSchema,
	messagesSchedule: MessagesScheduleResponseSchema,
	messagesPostEphemeral: MessagesPostEphemeralResponseSchema,
	messagesPostMe: MessagesPostResponseSchema,
	messagesPost: MessagesPostResponseSchema,
	messagesPinRemove: OkOnlyResponseSchema,
	messagesUpdate: MessagesUpdateResponseSchema,

	// Conversations
	conversationsArchive: OkOnlyResponseSchema,
	conversationsClose: TeamOpenDmResponseSchema,
	conversationsCreate: ConversationsChannelResponseSchema,
	conversationsFind: ConversationsFindResponseSchema,
	conversationsMembers: ConversationsMembersResponseSchema,
	conversationsInvite: ConversationsChannelResponseSchema,
	conversationsJoin: ConversationsChannelResponseSchema,
	conversationsLeave: OkOnlyResponseSchema,
	conversationsList: ConversationsListResponseSchema,
	conversationsListForUser: ConversationsListResponseSchema,
	conversationsKick: OkOnlyResponseSchema,
	conversationsRename: ConversationsChannelResponseSchema,
	conversationsInfo: ConversationsChannelResponseSchema,
	conversationsSetPurpose: ConversationsPurposeResponseSchema,
	conversationsMark: OkOnlyResponseSchema,
	conversationsSetTopic: ConversationsTopicResponseSchema,
	conversationsUnarchive: OkOnlyResponseSchema,

	// Users, presence, DND
	usersFind: UsersFindResponseSchema,
	usersDndTeamInfo: UsersDndTeamInfoResponseSchema,
	usersList: UsersListResponseSchema,
	usersSetActive: OkOnlyResponseSchema,
	usersDndInfo: UsersDndInfoResponseSchema,
	usersInfo: UsersInfoResponseSchema,
	usersGetPresence: UsersPresenceResponseSchema,
	usersGetProfile: UsersProfileResponseSchema,
	usersSetPresence: OkOnlyResponseSchema,
	usersBotsInfo: UsersBotsInfoResponseSchema,
	usersLookupByEmail: UsersInfoResponseSchema,

	// Reminders
	remindersAdd: RemindersReminderResponseSchema,
	remindersDelete: OkOnlyResponseSchema,
	remindersInfo: RemindersReminderResponseSchema,
	remindersList: RemindersListResponseSchema,
	remindersComplete: OkOnlyResponseSchema,

	// User groups
	userGroupsCreate: UserGroupsGroupResponseSchema,
	userGroupsDisable: UserGroupsGroupResponseSchema,
	userGroupsEnable: UserGroupsGroupResponseSchema,
	userGroupsUsersList: UserGroupsUsersListResponseSchema,
	userGroupsList: UserGroupsListResponseSchema,
	userGroupsUpdate: UserGroupsGroupResponseSchema,
	userGroupsUsersUpdate: UserGroupsGroupResponseSchema,

	// Canvases
	canvasesCreate: CanvasesCreateResponseSchema,
	canvasesDelete: OkOnlyResponseSchema,
	canvasesEdit: OkOnlyResponseSchema,
	canvasesGet: CanvasesGetResponseSchema,
	canvasesList: CanvasesListResponseSchema,
	canvasesSectionsLookup: CanvasesSectionsLookupResponseSchema,

	// Calls
	callsAdd: CallsCallResponseSchema,
	callsEnd: CallsCallResponseSchema,
	callsInfo: CallsCallResponseSchema,
	callsUpdate: CallsCallResponseSchema,
	callsParticipantsAdd: CallsCallResponseSchema,
	callsParticipantsRemove: CallsCallResponseSchema,

	// Team and metadata
	teamUnfurl: OkOnlyResponseSchema,
	teamInfo: TeamInfoResponseSchema,
	teamProfileGet: TeamProfileGetResponseSchema,
	teamEmojiList: TeamEmojiListResponseSchema,
	teamOpenDm: TeamOpenDmResponseSchema,
} as const;

export type SlackbotEndpointInputs = {
	[K in keyof typeof SlackbotEndpointInputSchemas]: z.infer<
		(typeof SlackbotEndpointInputSchemas)[K]
	>;
};

export type SlackbotEndpointOutputs = {
	[K in keyof typeof SlackbotEndpointOutputSchemas]: z.infer<
		(typeof SlackbotEndpointOutputSchemas)[K]
	>;
};

export type SlackbotEndpointName = keyof SlackbotEndpointInputs;

// Commonly-referenced resource types, exported for consumers building on the
// values these endpoints return.
export type SlackMessage = z.infer<typeof SlackMessageSchema>;
export type SlackChannel = z.infer<typeof SlackChannelSchema>;
export type SlackUser = z.infer<typeof SlackUserSchema>;
export type SlackFile = z.infer<typeof SlackFileSchema>;
export type SlackUserGroup = z.infer<typeof SlackUserGroupSchema>;
export type SlackReminder = z.infer<typeof SlackReminderSchema>;
export type SlackCall = z.infer<typeof SlackCallSchema>;
export type SlackCallUser = z.infer<typeof CallUserSchema>;
export type SlackConversationType = z.infer<typeof ConversationTypeSchema>;
export type SlackCanvasChange = z.infer<typeof CanvasChangeSchema>;
