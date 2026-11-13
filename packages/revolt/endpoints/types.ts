import { z } from 'zod';

/** Revolt's message list takes a limit and time cursors, not a page number. */
const LimitSchema = z
	.number()
	.int()
	.min(1)
	.max(100)
	.optional()
	.describe('Messages to return, up to 100.');

const MessageIdSchema = z
	.string()
	.min(1)
	.describe('A message id, such as `01F8Z0T8Y4W4Z8X3K5M2N1P0Q9`.');

// ── shared output pieces ──────────────────────────────────────────────────

/**
 * A file object, as an avatar, an icon or an attachment. Revolt returns the same
 * shape wherever a file is referenced, and the id is what an upload returns.
 */
export const FileSchema = z
	.object({
		_id: z.string().nullish(),
		tag: z.string().nullish(),
		filename: z.string().nullish(),
		content_type: z.string().nullish(),
		size: z.number().nullish(),
		deleted: z.boolean().nullish(),
		reported: z.boolean().nullish(),
		message_id: z.string().nullish(),
		user_id: z.string().nullish(),
		server_id: z.string().nullish(),
		object_id: z.string().nullish(),
		metadata: z
			.object({
				type: z.string().nullish(),
				size: z.number().nullish(),
				width: z.number().nullish(),
				height: z.number().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export type RevoltFile = z.infer<typeof FileSchema>;

/**
 * A rendered embed. Revolt's own schema declares no properties for it, so the
 * type and url it renders from are what is read and the rest passes through.
 */
export const EmbedSchema = z
	.object({
		type: z.string().nullish(),
		url: z.string().nullish(),
		original_url: z.string().nullish(),
		special: z.record(z.string(), z.string()).nullish(),
		title: z.string().nullish(),
		description: z.string().nullish(),
		site_name: z.string().nullish(),
		icon_url: z.string().nullish(),
		colour: z.string().nullish(),
		image: FileSchema.nullish(),
		video: FileSchema.nullish(),
	})
	.loose();

/**
 * A permission override as Revolt stores it on roles and server channels: `a`
 * is the allowed bit set and `d` the denied one.
 */
export const OverrideFieldSchema = z
	.object({
		a: z.number().nullish(),
		d: z.number().nullish(),
	})
	.loose();

/** A server's category, which groups channels and carries their permissions. */
export const CategorySchema = z
	.object({
		id: z.string().nullish(),
		title: z.string().nullish(),
		channels: z.array(z.string()).nullish(),
	})
	.loose();

/** A server role. Its permissions are an allow/deny override, not a number. */
export const RoleSchema = z
	.object({
		_id: z.string().nullish(),
		name: z.string().nullish(),
		permissions: OverrideFieldSchema.nullish(),
		colour: z.string().nullish(),
		hoist: z.boolean().nullish(),
		rank: z.number().nullish(),
	})
	.loose();

/** A bot's own record, which a user carries when it belongs to one. */
export const BotSchema = z
	.object({
		_id: z.string().nullish(),
		owner: z.string().nullish(),
		public: z.boolean().nullish(),
		analytics: z.boolean().nullish(),
		discoverable: z.boolean().nullish(),
		interactions_url: z.string().nullish(),
		terms_of_service_url: z.string().nullish(),
		privacy_policy_url: z.string().nullish(),
		flags: z.number().nullish(),
	})
	.loose();

/** A file attached to a message. */
export const AttachmentSchema = z
	.object({
		_id: z.string().nullish(),
		tag: z.string().nullish(),
		filename: z.string().nullish(),
		metadata: z
			.object({
				type: z.string().nullish(),
				size: z.number().nullish(),
				width: z.number().nullish(),
				height: z.number().nullish(),
			})
			.loose()
			.nullish(),
		content_type: z.string().nullish(),
		size: z.number().nullish(),
	})
	.loose();

/** A user, as a message author or a member carries it. */
export const UserSchema = z
	.object({
		_id: z.string().nullish(),
		username: z.string().nullish(),
		discriminator: z.string().nullish(),
		display_name: z.string().nullish(),
		pronouns: z.string().nullish(),
		online: z.boolean().nullish(),
		badges: z.number().nullish(),
		flags: z.number().nullish(),
		privileged: z.boolean().nullish(),
		avatar: FileSchema.nullish(),
		bot: BotSchema.nullish(),
		relationship: z.string().nullish(),
		status: z
			.object({
				text: z.string().nullish(),
				presence: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export type RevoltUser = z.infer<typeof UserSchema>;

/**
 * A server member's profile within one server. Its `_id` is the pair of server
 * and user ids, not a string.
 */
export const MemberSchema = z
	.object({
		_id: z
			.object({
				server: z.string().nullish(),
				user: z.string().nullish(),
			})
			.loose()
			.nullish(),
		nickname: z.string().nullish(),
		joined_at: z.string().nullish(),
		roles: z.array(z.string()).nullish(),
		avatar: FileSchema.nullish(),
		timeout: z.string().nullish(),
	})
	.loose();

export type RevoltMember = z.infer<typeof MemberSchema>;

const MessageSchema = z
	.object({
		_id: z.string().nullish(),
		channel: z.string().nullish(),
		author: z.string().nullish(),
		content: z.string().nullish(),
		nonce: z.string().nullish(),
		edited: z.string().nullish(),
		pinned: z.boolean().nullish(),
		flags: z.number().nullish(),
		attachments: z.array(AttachmentSchema).nullish(),
		mentions: z.array(z.string()).nullish(),
		role_mentions: z.array(z.string()).nullish(),
		replies: z.array(z.string()).nullish(),
		// Reactions are a map keyed by emoji, each holding the reacting user ids.
		reactions: z.record(z.string(), z.array(z.string())).nullish(),
		embeds: z.array(EmbedSchema).nullish(),
		user: UserSchema.nullish(),
		member: MemberSchema.nullish(),
	})
	.loose();

export type RevoltMessage = z.infer<typeof MessageSchema>;

// ── users ─────────────────────────────────────────────────────────────────

const UserMeInputSchema = z.object({});

export type UserMeInput = z.input<typeof UserMeInputSchema>;

const UserMeResponseSchema = z.object({ user: UserSchema });
export type UserMeResponse = z.infer<typeof UserMeResponseSchema>;

const UserGetInputSchema = z.object({
	user_id: z.string().min(1).describe('A user id, or `@me` for yourself.'),
});

export type UserGetInput = z.input<typeof UserGetInputSchema>;

const UserGetResponseSchema = z.object({ user: UserSchema });
export type UserGetResponse = z.infer<typeof UserGetResponseSchema>;

const UserDmsInputSchema = z.object({});

export type UserDmsInput = z.input<typeof UserDmsInputSchema>;

const ChannelSchema = z
	.object({
		_id: z.string().nullish(),
		channel_type: z
			.string()
			.nullish()
			.describe(
				'`SavedMessages`, `DirectMessage`, `Group`, `TextChannel` or `VoiceChannel`.',
			),
		name: z.string().nullish(),
		description: z.string().nullish(),
		server: z.string().nullish(),
		owner: z.string().nullish(),
		recipients: z.array(z.string()).nullish(),
		active: z.boolean().nullish(),
		last_message_id: z.string().nullish(),
		// A group carries a permission number; a server channel carries
		// allow/deny overrides, as defaults and per role.
		permissions: z.number().nullish(),
		default_permissions: z.union([z.number(), OverrideFieldSchema]).nullish(),
		role_permissions: z.record(z.string(), OverrideFieldSchema).nullish(),
		nsfw: z.boolean().nullish(),
		icon: FileSchema.nullish(),
	})
	.loose();

export type RevoltChannel = z.infer<typeof ChannelSchema>;

const UserDmsResponseSchema = z.object({
	channels: z.array(ChannelSchema),
});

export type UserDmsResponse = z.infer<typeof UserDmsResponseSchema>;

// ── channels ──────────────────────────────────────────────────────────────

const ChannelGetInputSchema = z.object({
	channel_id: z.string().min(1).describe('A channel id.'),
});

export type ChannelGetInput = z.input<typeof ChannelGetInputSchema>;

const ChannelGetResponseSchema = z.object({ channel: ChannelSchema });
export type ChannelGetResponse = z.infer<typeof ChannelGetResponseSchema>;

const ChannelEditInputSchema = z.object({
	channel_id: z.string().min(1),
	name: z.string().optional(),
	description: z.string().optional(),
	icon: z
		.string()
		.optional()
		.describe('An attachment id returned by the Autumn upload service.'),
});

export type ChannelEditInput = z.input<typeof ChannelEditInputSchema>;

const ChannelEditResponseSchema = z.object({ channel: ChannelSchema });
export type ChannelEditResponse = z.infer<typeof ChannelEditResponseSchema>;

const ChannelDeleteInputSchema = z.object({
	channel_id: z.string().min(1),
});

export type ChannelDeleteInput = z.input<typeof ChannelDeleteInputSchema>;

const ChannelDeleteResponseSchema = z.object({ success: z.boolean() });
export type ChannelDeleteResponse = z.infer<typeof ChannelDeleteResponseSchema>;

// ── messages ──────────────────────────────────────────────────────────────

const MessagesListInputSchema = z
	.object({
		channel_id: z.string().min(1),
		limit: LimitSchema,
		before: MessageIdSchema.optional(),
		after: MessageIdSchema.optional(),
		nearby: MessageIdSchema.optional(),
		sort: z
			.enum(['Oldest', 'Latest', 'Relevance'])
			.optional()
			.describe(
				'Message order, `Latest` by default. Stoat ignores it when `nearby` is set.',
			),
		include_users: z
			.boolean()
			.optional()
			.describe(
				'Return the authors as `users` and `members` beside the messages. Defaults to true.',
			),
	})
	.superRefine((value, ctx) => {
		// `before` with `after` contradicts itself.
		if (value.before !== undefined && value.after !== undefined) {
			ctx.addIssue({
				code: 'custom',
				message: 'Provide only one of `before` or `after`.',
				path: ['before'],
			});
		}
	});

export type MessagesListInput = z.input<typeof MessagesListInputSchema>;

const MessagesListResponseSchema = z.object({
	messages: z.array(MessageSchema),
	users: z.array(UserSchema).nullish(),
	members: z.array(MemberSchema).nullish(),
});

export type MessagesListResponse = z.infer<typeof MessagesListResponseSchema>;

const MessagesSendInputSchema = z
	.object({
		channel_id: z.string().min(1),
		content: z.string().optional(),
		nonce: z
			.string()
			.optional()
			.describe('A client id that makes a retry idempotent.'),
		replies: z
			.array(
				z.object({
					id: z.string(),
					// Revolt requires `mention` and answers 422 without it (live,
					// 11-12), so an omitted value is sent as false.
					mention: z
						.boolean()
						.default(false)
						.describe("Whether the reply pings the original message's author."),
				}),
			)
			.optional(),
		attachments: z
			.array(z.string())
			.optional()
			.describe('Ids returned from the autumn upload service.'),
	})
	.superRefine((value, ctx) => {
		// An empty message with no attachment is rejected by the API.
		if (
			(value.content === undefined || value.content.length === 0) &&
			(value.attachments === undefined || value.attachments.length === 0)
		) {
			ctx.addIssue({
				code: 'custom',
				message: 'Provide `content` or an attachment id.',
				path: ['content'],
			});
		}
	});

export type MessagesSendInput = z.input<typeof MessagesSendInputSchema>;

const MessagesSendResponseSchema = z.object({ message: MessageSchema });
export type MessagesSendResponse = z.infer<typeof MessagesSendResponseSchema>;

const MessagesGetInputSchema = z.object({
	channel_id: z.string().min(1),
	message_id: MessageIdSchema,
});

export type MessagesGetInput = z.input<typeof MessagesGetInputSchema>;

const MessagesGetResponseSchema = z.object({ message: MessageSchema });
export type MessagesGetResponse = z.infer<typeof MessagesGetResponseSchema>;

const MessagesEditInputSchema = z.object({
	channel_id: z.string().min(1),
	message_id: MessageIdSchema,
	content: z.string().min(1),
});

export type MessagesEditInput = z.input<typeof MessagesEditInputSchema>;

const MessagesEditResponseSchema = z.object({ message: MessageSchema });
export type MessagesEditResponse = z.infer<typeof MessagesEditResponseSchema>;

const MessagesDeleteInputSchema = z.object({
	channel_id: z.string().min(1),
	message_id: MessageIdSchema,
});

export type MessagesDeleteInput = z.input<typeof MessagesDeleteInputSchema>;

const MessagesDeleteResponseSchema = z.object({ success: z.boolean() });
export type MessagesDeleteResponse = z.infer<
	typeof MessagesDeleteResponseSchema
>;

const ReactionsAddInputSchema = z.object({
	channel_id: z.string().min(1),
	message_id: MessageIdSchema,
	emoji: z
		.string()
		.min(1)
		.describe(
			'A unicode emoji, or a custom emoji id as it is, without colons.',
		),
});

export type ReactionsAddInput = z.input<typeof ReactionsAddInputSchema>;

const ReactionsAddResponseSchema = z.object({ success: z.boolean() });
export type ReactionsAddResponse = z.infer<typeof ReactionsAddResponseSchema>;

// ── servers ───────────────────────────────────────────────────────────────

const ServerGetInputSchema = z.object({
	server_id: z.string().min(1),
	include_channels: z
		.boolean()
		.optional()
		.describe('Return `channels` as channel objects instead of ids.'),
});

export type ServerGetInput = z.input<typeof ServerGetInputSchema>;

const ServerSchema = z
	.object({
		_id: z.string().nullish(),
		name: z.string().nullish(),
		owner: z.string().nullish(),
		description: z.string().nullish(),
		// Channel ids, or channel objects when `include_channels` is set.
		channels: z.array(z.union([z.string(), ChannelSchema])).nullish(),
		categories: z.array(CategorySchema).nullish(),
		roles: z.record(z.string(), RoleSchema).nullish(),
		default_permissions: z.number().nullish(),
		approximate_member_count: z.number().nullish(),
		nsfw: z.boolean().nullish(),
		icon: FileSchema.nullish(),
		banner: FileSchema.nullish(),
		flags: z.number().nullish(),
		analytics: z.boolean().nullish(),
		discoverable: z.boolean().nullish(),
	})
	.loose();

export type RevoltServer = z.infer<typeof ServerSchema>;

const ServerGetResponseSchema = z.object({ server: ServerSchema });
export type ServerGetResponse = z.infer<typeof ServerGetResponseSchema>;

const ServerMembersInputSchema = z.object({
	server_id: z.string().min(1),
	exclude_offline: z.boolean().optional(),
});

export type ServerMembersInput = z.input<typeof ServerMembersInputSchema>;

const ServerMembersResponseSchema = z.object({
	members: z.array(MemberSchema),
	users: z.array(UserSchema),
});

export type ServerMembersResponse = z.infer<typeof ServerMembersResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type RevoltEndpointInputs = {
	userMe: UserMeInput;
	userGet: UserGetInput;
	userDms: UserDmsInput;
	channelGet: ChannelGetInput;
	channelEdit: ChannelEditInput;
	channelDelete: ChannelDeleteInput;
	messagesList: MessagesListInput;
	messagesGet: MessagesGetInput;
	messagesSend: MessagesSendInput;
	messagesEdit: MessagesEditInput;
	messagesDelete: MessagesDeleteInput;
	reactionsAdd: ReactionsAddInput;
	serverGet: ServerGetInput;
	serverMembers: ServerMembersInput;
};

export type RevoltEndpointOutputs = {
	userMe: UserMeResponse;
	userGet: UserGetResponse;
	userDms: UserDmsResponse;
	channelGet: ChannelGetResponse;
	channelEdit: ChannelEditResponse;
	channelDelete: ChannelDeleteResponse;
	messagesList: MessagesListResponse;
	messagesGet: MessagesGetResponse;
	messagesSend: MessagesSendResponse;
	messagesEdit: MessagesEditResponse;
	messagesDelete: MessagesDeleteResponse;
	reactionsAdd: ReactionsAddResponse;
	serverGet: ServerGetResponse;
	serverMembers: ServerMembersResponse;
};

export const RevoltEndpointInputSchemas = {
	userMe: UserMeInputSchema,
	userGet: UserGetInputSchema,
	userDms: UserDmsInputSchema,
	channelGet: ChannelGetInputSchema,
	channelEdit: ChannelEditInputSchema,
	channelDelete: ChannelDeleteInputSchema,
	messagesList: MessagesListInputSchema,
	messagesGet: MessagesGetInputSchema,
	messagesSend: MessagesSendInputSchema,
	messagesEdit: MessagesEditInputSchema,
	messagesDelete: MessagesDeleteInputSchema,
	reactionsAdd: ReactionsAddInputSchema,
	serverGet: ServerGetInputSchema,
	serverMembers: ServerMembersInputSchema,
} as const;

export const RevoltEndpointOutputSchemas = {
	userMe: UserMeResponseSchema,
	userGet: UserGetResponseSchema,
	userDms: UserDmsResponseSchema,
	channelGet: ChannelGetResponseSchema,
	channelEdit: ChannelEditResponseSchema,
	channelDelete: ChannelDeleteResponseSchema,
	messagesList: MessagesListResponseSchema,
	messagesGet: MessagesGetResponseSchema,
	messagesSend: MessagesSendResponseSchema,
	messagesEdit: MessagesEditResponseSchema,
	messagesDelete: MessagesDeleteResponseSchema,
	reactionsAdd: ReactionsAddResponseSchema,
	serverGet: ServerGetResponseSchema,
	serverMembers: ServerMembersResponseSchema,
} as const;
