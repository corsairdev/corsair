import { z } from 'zod';

// Route components cannot alter the path, even after URL normalization.
const pathPart = z
	.string()
	.min(1)
	.refine(
		(value) => value !== '.' && value !== '..' && !/[\/\\"']/.test(value),
		'Invalid path component',
	);
const channelType = z.enum(['open_channels', 'group_channels']);
const userPath = z.object({ user_id: pathPart });
const channelPath = z.object({ channel_url: pathPart });
const messagePath = z.object({
	channel_type: channelType,
	channel_url: pathPart,
});
const messageIdPath = messagePath.extend({
	message_id: z.number().int().nonnegative().safe(),
});
const number = z.number().int().safe();
const pagination = {
	token: z.string().optional(),
	limit: number.min(1).max(100).optional(),
};
const messageOptions = {
	include_parent_message_info: z.boolean().optional(),
	include_thread_info: z.boolean().optional(),
	include_reactions: z.boolean().optional(),
	include_poll_details: z.boolean().optional(),
	with_sorted_meta_array: z.boolean().optional(),
};

// Provider-defined nested metadata and message payloads may vary by app and type.
const user = z
	.object({
		user_id: z.string(),
		nickname: z.string().nullish(),
		profile_url: z.string().nullish(),
		access_token: z.string().nullish(),
		is_online: z.boolean().nullish(),
		is_active: z.boolean().nullish(),
		has_ever_logged_in: z.boolean().nullish(),
		role: z.string().nullish(),
		state: z.string().nullish(),
		joined_ts: number.nullish(),
		created_at: number.nullish(),
		last_seen_at: number.nullish(),
		discovery_keys: z.array(z.string()).nullish(),
		preferred_languages: z.array(z.string()).nullish(),
		metadata: z.record(z.string(), z.unknown()).nullish(),
		unread_channel_count: number.nullish(),
		unread_message_count: number.nullish(),
		is_blocking_me: z.boolean().nullish(),
		is_blocked_by_me: z.boolean().nullish(),
	})
	.passthrough();
const message = z
	.object({
		message_id: number,
		type: z.string(),
		channel_url: z.string().nullish(),
		custom_type: z.string().nullish(),
		message: z.string().nullish(),
		data: z.string().nullish(),
		user: user.nullish(),
		mention_type: z.string().nullish(),
		mentioned_users: z.array(user).nullish(),
		is_removed: z.boolean().nullish(),
		created_at: number.nullish(),
		updated_at: number.nullish(),
		parent_message_id: number.nullish(),
		is_reply_to_channel: z.boolean().nullish(),
		translations: z.record(z.string(), z.unknown()).nullish(),
		file: z.record(z.string(), z.unknown()).nullish(),
		files: z.unknown().optional(),
		sorted_metaarray: z.array(z.unknown()).nullish(),
		message_events: z.record(z.string(), z.unknown()).nullish(),
		og_tag: z.record(z.string(), z.unknown()).nullish(),
		thread_info: z.record(z.string(), z.unknown()).nullish(),
		parent_message_info: z.record(z.string(), z.unknown()).nullish(),
	})
	.passthrough();
const channel = z
	.object({
		channel_url: z.string(),
		name: z.string().nullish(),
		cover_url: z.string().nullish(),
		custom_type: z.string().nullish(),
		data: z.string().nullish(),
		is_distinct: z.boolean().nullish(),
		is_public: z.boolean().nullish(),
		is_super: z.boolean().nullish(),
		is_ephemeral: z.boolean().nullish(),
		is_access_code_required: z.boolean().nullish(),
		member_count: number.nullish(),
		joined_member_count: number.nullish(),
		max_length_message: number.nullish(),
		unread_message_count: number.nullish(),
		unread_mention_count: number.nullish(),
		created_at: number.nullish(),
		freeze: z.boolean().nullish(),
		members: z.array(user).nullish(),
		operators: z.array(user).nullish(),
		last_message: message.nullish(),
		created_by: user.nullish(),
		delivery_receipt: z.record(z.string(), number).nullish(),
		read_receipt: z.record(z.string(), number).nullish(),
		metadata: z.record(z.string(), z.unknown()).nullish(),
	})
	.passthrough();

const userUpdate = z
	.object({
		nickname: z.string().max(80).optional(),
		profile_url: z.string().max(2048).optional(),
		issue_access_token: z.boolean().optional(),
		is_active: z.boolean().optional(),
		last_seen_at: number.optional(),
		discovery_keys: z.array(z.string()).optional(),
		preferred_languages: z.array(z.string()).optional(),
		leave_all_when_deactivated: z.boolean().optional(),
	})
	.strict();
const channelUpdate = z
	.object({
		name: z.string().optional(),
		cover_url: z.string().optional(),
		custom_type: z.string().optional(),
		data: z.string().optional(),
		is_distinct: z.boolean().optional(),
		is_public: z.boolean().optional(),
		is_super: z.boolean().optional(),
		access_code: z.string().optional(),
	})
	.strict();
const textFields = {
	message_type: z.literal('MESG'),
	custom_type: z.string().optional(),
	data: z.string().optional(),
	mention_type: z.enum(['users', 'channel']).optional(),
	mentioned_user_ids: z.array(z.string()).optional(),
};

export const SendbirdEndpointInputSchemas = {
	usersList: z
		.object({
			...pagination,
			active_mode: z.enum(['activated', 'deactivated', 'all']).optional(),
			show_bot: z.boolean().optional(),
			user_ids: z.string().optional(),
			nickname: z.string().optional(),
			nickname_startswith: z.string().optional(),
			metadatakey: z.string().optional(),
			metadatavalues_in: z.string().optional(),
		})
		.strict(),
	usersGet: userPath
		.extend({
			include_unread_count: z.boolean().optional(),
			custom_types: z.string().optional(),
			super_mode: z.enum(['all', 'super', 'nonsuper']).optional(),
		})
		.strict(),
	usersCreate: z
		.object({
			user_id: z.string().min(1).max(80),
			nickname: z.string().max(80),
			profile_url: z.string().max(2048),
			issue_access_token: z.boolean().optional(),
			metadata: z.record(z.string(), z.string()).optional(),
		})
		.strict(),
	usersUpdate: userPath.extend({ body: userUpdate }).strict(),
	usersDelete: userPath.strict(),
	channelsList: z
		.object({
			...pagination,
			distinct_mode: z.enum(['all', 'distinct', 'nondistinct']).optional(),
			public_mode: z.enum(['all', 'private', 'public']).optional(),
			super_mode: z.enum(['all', 'super', 'nonsuper']).optional(),
			created_after: number.optional(),
			created_before: number.optional(),
			show_empty: z.boolean().optional(),
			show_member: z.boolean().optional(),
			show_delivery_receipt: z.boolean().optional(),
			show_read_receipt: z.boolean().optional(),
			show_metadata: z.boolean().optional(),
			show_frozen: z.boolean().optional(),
			order: z.string().optional(),
			metadata_order_key: z.string().optional(),
			custom_types: z.string().optional(),
			custom_type_startswith: z.string().optional(),
			channel_urls: z.string().optional(),
			name: z.string().optional(),
			name_contains: z.string().optional(),
			name_startswith: z.string().optional(),
			members_exactly_in: z.string().optional(),
			members_include_in: z.string().optional(),
			query_type: z.enum(['AND', 'OR']).optional(),
			members_nickname: z.string().optional(),
			members_nickname_contains: z.string().optional(),
			metadata_key: z.string().optional(),
			metadata_values: z.string().optional(),
			metadata_value_startswith: z.string().optional(),
			metacounter_key: z.string().optional(),
			metacounter_values: z.string().optional(),
			metacounter_value_gt: z.string().optional(),
			metacounter_value_gte: z.string().optional(),
			metacounter_value_lt: z.string().optional(),
			metacounter_value_lte: z.string().optional(),
			include_sorted_metaarray_in_last_message: z.boolean().optional(),
		})
		.strict(),
	channelsGet: channelPath
		.extend({
			show_delivery_receipt: z.boolean().optional(),
			show_read_receipt: z.boolean().optional(),
			show_member: z.boolean().optional(),
			member_active_mode: z
				.enum(['all', 'activated', 'deactivated'])
				.optional(),
		})
		.strict(),
	channelsCreate: channelUpdate
		.extend({
			user_ids: z.array(z.string()).min(1).max(100),
			operator_ids: z.array(z.string()).optional(),
			channel_url: z.string().optional(),
			is_ephemeral: z.boolean().optional(),
			inviter_id: z.string().optional(),
			strict: z.boolean().optional(),
			invitation_status: z.record(z.string(), z.string()).optional(),
			hidden_status: z.record(z.string(), z.string()).optional(),
			block_sdk_user_channel_join: z.boolean().optional(),
		})
		.strict(),
	channelsUpdate: channelPath.extend({ body: channelUpdate }).strict(),
	channelsDelete: channelPath.strict(),
	messagesList: messagePath
		.extend({
			message_ts: number.nonnegative().optional(),
			message_id: number.nonnegative().optional(),
			prev_limit: number.min(0).max(200).optional(),
			next_limit: number.min(0).max(200).optional(),
			include: z.boolean().optional(),
			reverse: z.boolean().optional(),
			sender_id: z.string().optional(),
			sender_ids: z.string().optional(),
			operator_filter: z.enum(['all', 'operator', 'nonoperator']).optional(),
			message_type: z.enum(['MESG', 'FILE', 'ADMM']).optional(),
			custom_types: z.string().optional(),
			including_removed: z.boolean().optional(),
			...messageOptions,
			include_reply_type: z
				.enum(['NONE', 'ALL', 'ONLY_REPLY_TO_CHANNEL'])
				.optional(),
			show_subchannel_messages_only: z.boolean().optional(),
			user_id: z.string().optional(),
		})
		.strict()
		.refine(
			(value) =>
				value.message_ts !== undefined || value.message_id !== undefined,
			'A message reference is required',
		),
	messagesGet: messageIdPath.extend(messageOptions).strict(),
	messagesSend: messagePath
		.extend({
			body: z
				.object({
					...textFields,
					user_id: z.string().min(1),
					message: z.string(),
					send_push: z.boolean().optional(),
					is_silent: z.boolean().optional(),
					mark_as_read: z.boolean().optional(),
					created_at: number.optional(),
					poll_id: number.optional(),
					include_poll_details: z.boolean().optional(),
					dedup_id: z.string().optional(),
					apns_bundle_id: z.string().optional(),
				})
				.strict(),
		})
		.strict(),
	messagesUpdate: messageIdPath
		.extend({
			body: z
				.object({ ...textFields, message: z.string().optional() })
				.strict(),
		})
		.strict(),
	messagesDelete: messageIdPath
		.extend({ delete_files: z.boolean().optional() })
		.strict(),
} as const;

export const SendbirdEndpointOutputSchemas = {
	usersList: z.object({ users: z.array(user), next: z.string() }).passthrough(),
	usersGet: user,
	usersCreate: user,
	usersUpdate: user,
	usersDelete: z.void(),
	channelsList: z
		.object({ channels: z.array(channel), next: z.string() })
		.passthrough(),
	channelsGet: channel,
	channelsCreate: channel,
	channelsUpdate: channel,
	channelsDelete: z.void(),
	messagesList: z.object({ messages: z.array(message) }).passthrough(),
	messagesGet: message,
	messagesSend: message,
	messagesUpdate: message,
	messagesDelete: z.void(),
} as const;
export const SendbirdUserSchema = user;
export const SendbirdChannelSchema = channel;
export const SendbirdMessageSchema = message;
export type SendbirdEndpointInputs = {
	[K in keyof typeof SendbirdEndpointInputSchemas]: z.infer<
		(typeof SendbirdEndpointInputSchemas)[K]
	>;
};
export type SendbirdEndpointOutputs = {
	[K in keyof typeof SendbirdEndpointOutputSchemas]: z.infer<
		(typeof SendbirdEndpointOutputSchemas)[K]
	>;
};
