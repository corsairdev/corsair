import { z } from 'zod';

// ── Shared Discord API Types ───────────────────────────────────────────────────

// ── Zod Schemas for Validation ─────────────────────────────────────────────────

export const DiscordUserSchema = z.object({
	id: z.string(),
	username: z.string(),
	discriminator: z.string(),
	global_name: z.string().nullable(),
	avatar: z.string().nullable(),
	bot: z.boolean().optional(),
	system: z.boolean().optional(),
	email: z.string().nullable().optional(),
	verified: z.boolean().optional(),
	locale: z.string().optional(),
	premium_type: z.number().optional(),
	public_flags: z.number().optional(),
	flags: z.number().optional(),
});
export type DiscordUser = z.infer<typeof DiscordUserSchema>;

export const EmbedSchema = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
	url: z.string().optional(),
	color: z.number().optional(),
	fields: z
		.array(
			z.object({
				name: z.string(),
				value: z.string(),
				inline: z.boolean().optional(),
			}),
		)
		.optional(),
	footer: z
		.object({ text: z.string(), icon_url: z.string().optional() })
		.optional(),
	image: z.object({ url: z.string() }).optional(),
	thumbnail: z.object({ url: z.string() }).optional(),
	author: z
		.object({
			name: z.string(),
			url: z.string().optional(),
			icon_url: z.string().optional(),
		})
		.optional(),
	timestamp: z.string().optional(),
});
export type Embed = z.infer<typeof EmbedSchema>;

export const AttachmentSchema = z.object({
	id: z.string(),
	filename: z.string(),
	description: z.string().optional(),
	content_type: z.string().optional(),
	size: z.number(),
	url: z.string(),
	proxy_url: z.string(),
	height: z.number().nullable().optional(),
	width: z.number().nullable().optional(),
});
export type Attachment = z.infer<typeof AttachmentSchema>;

export const MessageReferenceSchema = z.object({
	message_id: z.string().optional(),
	channel_id: z.string().optional(),
	guild_id: z.string().optional(),
});
export type MessageReference = z.infer<typeof MessageReferenceSchema>;

export const ChannelSchema = z.object({
	id: z.string(),
	type: z.number(),
	guild_id: z.string().optional(),
	name: z.string().nullable().optional(),
	topic: z.string().nullable().optional(),
	position: z.number().optional(),
	parent_id: z.string().nullable().optional(),
	last_message_id: z.string().nullable().optional(),
	owner_id: z.string().optional(),
	thread_metadata: z
		.object({
			archived: z.boolean(),
			auto_archive_duration: z.number(),
			archive_timestamp: z.string(),
			locked: z.boolean(),
			invitable: z.boolean().optional(),
		})
		.optional(),
});
export type Channel = z.infer<typeof ChannelSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Recursive type
//
// Message references itself via referenced_message?: Message | null.
// BaseSchema holds all non-recursive fields; the final schema extends it with
// the circular field via z.lazy(). The exported type is derived from the schema.
// ─────────────────────────────────────────────────────────────────────────────

const MessageBaseSchema = z.object({
	id: z.string(),
	channel_id: z.string(),
	author: DiscordUserSchema,
	content: z.string(),
	timestamp: z.string(),
	edited_timestamp: z.string().nullable(),
	tts: z.boolean(),
	mention_everyone: z.boolean(),
	mentions: z.array(DiscordUserSchema),
	mention_roles: z.array(z.string()),
	attachments: z.array(AttachmentSchema),
	embeds: z.array(EmbedSchema),
	reactions: z
		.array(
			z.object({
				count: z.number(),
				me: z.boolean(),
				emoji: z.object({ id: z.string().nullable(), name: z.string() }),
			}),
		)
		.optional(),
	pinned: z.boolean(),
	type: z.number(),
	flags: z.number().optional(),
	message_reference: MessageReferenceSchema.optional(),
	thread: ChannelSchema.optional(),
	nonce: z.union([z.string(), z.number()]).optional(),
});

type MessageShape = z.infer<typeof MessageBaseSchema> & {
	referenced_message?: MessageShape | null;
};

export const MessageSchema: z.ZodType<MessageShape> = MessageBaseSchema.extend({
	referenced_message: z.lazy(() => MessageSchema.nullable().optional()),
});

export type Message = z.infer<typeof MessageSchema>;

export const RoleSchema = z.object({
	id: z.string(),
	name: z.string(),
	permissions: z.string(),
	position: z.number(),
	color: z.number(),
	hoist: z.boolean(),
	managed: z.boolean(),
	mentionable: z.boolean(),
});
export type Role = z.infer<typeof RoleSchema>;

export const GuildSchema = z.object({
	id: z.string(),
	name: z.string(),
	icon: z.string().nullable(),
	splash: z.string().nullable(),
	owner_id: z.string(),
	afk_timeout: z.number(),
	verification_level: z.number(),
	default_message_notifications: z.number(),
	explicit_content_filter: z.number(),
	roles: z.array(RoleSchema),
	features: z.array(z.string()),
	mfa_level: z.number(),
	description: z.string().nullable(),
	premium_tier: z.number(),
	premium_subscription_count: z.number().optional(),
	preferred_locale: z.string(),
	approximate_member_count: z.number().optional(),
	approximate_presence_count: z.number().optional(),
});
export type Guild = z.infer<typeof GuildSchema>;

export const PartialGuildSchema = z.object({
	id: z.string(),
	name: z.string(),
	icon: z.string().nullable(),
	owner: z.boolean(),
	permissions: z.string(),
	features: z.array(z.string()),
	approximate_member_count: z.number().optional(),
	approximate_presence_count: z.number().optional(),
});
export type PartialGuild = z.infer<typeof PartialGuildSchema>;

export const GuildMemberSchema = z.object({
	user: DiscordUserSchema.optional(),
	nick: z.string().nullable(),
	avatar: z.string().nullable().optional(),
	roles: z.array(z.string()),
	joined_at: z.string(),
	premium_since: z.string().nullable(),
	deaf: z.boolean(),
	mute: z.boolean(),
	flags: z.number(),
	pending: z.boolean().optional(),
});
export type GuildMember = z.infer<typeof GuildMemberSchema>;

// ── Endpoint Input Schemas ─────────────────────────────────────────────────────

export const MessagesSendInputSchema = z.object({
	channel_id: z.string(),
	content: z.string().optional(),
	embeds: z.array(EmbedSchema).optional(),
	tts: z.boolean().optional(),
	nonce: z.union([z.string(), z.number()]).optional(),
});
export type MessagesSendInput = z.infer<typeof MessagesSendInputSchema>;

export const MessagesReplyInputSchema = z.object({
	channel_id: z.string(),
	message_id: z.string(),
	content: z.string().optional(),
	embeds: z.array(EmbedSchema).optional(),
	fail_if_not_exists: z.boolean().optional(),
});
export type MessagesReplyInput = z.infer<typeof MessagesReplyInputSchema>;

export const MessagesGetInputSchema = z.object({
	channel_id: z.string(),
	message_id: z.string(),
});
export type MessagesGetInput = z.infer<typeof MessagesGetInputSchema>;

export const MessagesListInputSchema = z.object({
	channel_id: z.string(),
	limit: z.number().optional(),
	before: z.string().optional(),
	after: z.string().optional(),
	around: z.string().optional(),
});
export type MessagesListInput = z.infer<typeof MessagesListInputSchema>;

export const MessagesEditInputSchema = z.object({
	channel_id: z.string(),
	message_id: z.string(),
	content: z.string().optional(),
	embeds: z.array(EmbedSchema).optional(),
});
export type MessagesEditInput = z.infer<typeof MessagesEditInputSchema>;

export const MessagesDeleteInputSchema = z.object({
	channel_id: z.string(),
	message_id: z.string(),
});
export type MessagesDeleteInput = z.infer<typeof MessagesDeleteInputSchema>;

const AutoArchiveDurationSchema = z.union([
	z.literal(60),
	z.literal(1440),
	z.literal(4320),
	z.literal(10080),
]);

export const ThreadsCreateInputSchema = z.object({
	channel_id: z.string(),
	name: z.string(),
	auto_archive_duration: AutoArchiveDurationSchema.optional(),
	type: z.number().optional(),
	invitable: z.boolean().optional(),
});
export type ThreadsCreateInput = z.infer<typeof ThreadsCreateInputSchema>;

export const ThreadsCreateFromMessageInputSchema = z.object({
	channel_id: z.string(),
	message_id: z.string(),
	name: z.string(),
	auto_archive_duration: AutoArchiveDurationSchema.optional(),
});
export type ThreadsCreateFromMessageInput = z.infer<
	typeof ThreadsCreateFromMessageInputSchema
>;

export const ReactionsAddInputSchema = z.object({
	channel_id: z.string(),
	message_id: z.string(),
	emoji: z.string(),
});
export type ReactionsAddInput = z.infer<typeof ReactionsAddInputSchema>;

export const ReactionsRemoveInputSchema = z.object({
	channel_id: z.string(),
	message_id: z.string(),
	emoji: z.string(),
});
export type ReactionsRemoveInput = z.infer<typeof ReactionsRemoveInputSchema>;

export const ReactionsListInputSchema = z.object({
	channel_id: z.string(),
	message_id: z.string(),
	emoji: z.string(),
	limit: z.number().optional(),
	after: z.string().optional(),
});
export type ReactionsListInput = z.infer<typeof ReactionsListInputSchema>;

export const GuildsListInputSchema = z.object({
	before: z.string().optional(),
	after: z.string().optional(),
	limit: z.number().optional(),
	with_counts: z.boolean().optional(),
});
export type GuildsListInput = z.infer<typeof GuildsListInputSchema>;

export const GuildsGetInputSchema = z.object({
	guild_id: z.string(),
	with_counts: z.boolean().optional(),
});
export type GuildsGetInput = z.infer<typeof GuildsGetInputSchema>;

export const ChannelsListInputSchema = z.object({
	guild_id: z.string(),
});
export type ChannelsListInput = z.infer<typeof ChannelsListInputSchema>;

export const MembersListInputSchema = z.object({
	guild_id: z.string(),
	limit: z.number().optional(),
	after: z.string().optional(),
});
export type MembersListInput = z.infer<typeof MembersListInputSchema>;

export const MembersGetInputSchema = z.object({
	guild_id: z.string(),
	user_id: z.string(),
});
export type MembersGetInput = z.infer<typeof MembersGetInputSchema>;

// ── Shared response schemas ────────────────────────────────────────────────────

export const SuccessResponseSchema = z.object({ success: z.literal(true) });
export type SuccessResponse = z.infer<typeof SuccessResponseSchema>;

// ── Endpoint Input/Output Schema Maps ─────────────────────────────────────────

export const DiscordEndpointInputSchemas = {
	messagesSend: MessagesSendInputSchema,
	messagesReply: MessagesReplyInputSchema,
	messagesGet: MessagesGetInputSchema,
	messagesList: MessagesListInputSchema,
	messagesEdit: MessagesEditInputSchema,
	messagesDelete: MessagesDeleteInputSchema,
	threadsCreate: ThreadsCreateInputSchema,
	threadsCreateFromMessage: ThreadsCreateFromMessageInputSchema,
	reactionsAdd: ReactionsAddInputSchema,
	reactionsRemove: ReactionsRemoveInputSchema,
	reactionsList: ReactionsListInputSchema,
	guildsList: GuildsListInputSchema,
	guildsGet: GuildsGetInputSchema,
	channelsList: ChannelsListInputSchema,
	membersList: MembersListInputSchema,
	membersGet: MembersGetInputSchema,
} as const;

export type DiscordEndpointInputs = {
	[K in keyof typeof DiscordEndpointInputSchemas]: z.infer<
		(typeof DiscordEndpointInputSchemas)[K]
	>;
};

export const DiscordEndpointOutputSchemas = {
	messagesSend: MessageSchema,
	messagesReply: MessageSchema,
	messagesGet: MessageSchema,
	messagesList: z.array(MessageSchema),
	messagesEdit: MessageSchema,
	messagesDelete: SuccessResponseSchema,
	threadsCreate: ChannelSchema,
	threadsCreateFromMessage: ChannelSchema,
	reactionsAdd: SuccessResponseSchema,
	reactionsRemove: SuccessResponseSchema,
	reactionsList: z.array(DiscordUserSchema),
	guildsList: z.array(PartialGuildSchema),
	guildsGet: GuildSchema,
	channelsList: z.array(ChannelSchema),
	membersList: z.array(GuildMemberSchema),
	membersGet: GuildMemberSchema,
} as const;

export type DiscordEndpointOutputs = {
	[K in keyof typeof DiscordEndpointOutputSchemas]: z.infer<
		(typeof DiscordEndpointOutputSchemas)[K]
	>;
};
