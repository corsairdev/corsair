import { z } from 'zod';

// ── Shared Discord API Types ───────────────────────────────────────────────────

export type DiscordUser = {
	id: string;
	username: string;
	discriminator: string;
	global_name: string | null;
	avatar: string | null;
	bot?: boolean;
	system?: boolean;
	email?: string | null;
	verified?: boolean;
	locale?: string;
	premium_type?: number;
	public_flags?: number;
	flags?: number;
};

export type Embed = {
	title?: string;
	description?: string;
	url?: string;
	color?: number;
	fields?: { name: string; value: string; inline?: boolean }[];
	footer?: { text: string; icon_url?: string };
	image?: { url: string };
	thumbnail?: { url: string };
	author?: { name: string; url?: string; icon_url?: string };
	timestamp?: string;
};

export type Attachment = {
	id: string;
	filename: string;
	description?: string;
	content_type?: string;
	size: number;
	url: string;
	proxy_url: string;
	height?: number | null;
	width?: number | null;
};

export type MessageReference = {
	message_id?: string;
	channel_id?: string;
	guild_id?: string;
};

export type Message = {
	id: string;
	channel_id: string;
	author: DiscordUser;
	content: string;
	timestamp: string;
	edited_timestamp: string | null;
	tts: boolean;
	mention_everyone: boolean;
	mentions: DiscordUser[];
	mention_roles: string[];
	attachments: Attachment[];
	embeds: Embed[];
	reactions?: {
		count: number;
		me: boolean;
		emoji: { id: string | null; name: string };
	}[];
	pinned: boolean;
	type: number;
	flags?: number;
	message_reference?: MessageReference;
	referenced_message?: Message | null;
	thread?: Channel;
	nonce?: string | number;
};

export type Channel = {
	id: string;
	type: number;
	guild_id?: string;
	name?: string | null;
	topic?: string | null;
	position?: number;
	parent_id?: string | null;
	last_message_id?: string | null;
	owner_id?: string;
	thread_metadata?: {
		archived: boolean;
		auto_archive_duration: number;
		archive_timestamp: string;
		locked: boolean;
		invitable?: boolean;
	};
};

export type Role = {
	id: string;
	name: string;
	permissions: string;
	position: number;
	color: number;
	hoist: boolean;
	managed: boolean;
	mentionable: boolean;
};

export type Guild = {
	id: string;
	name: string;
	icon: string | null;
	splash: string | null;
	owner_id: string;
	afk_timeout: number;
	verification_level: number;
	default_message_notifications: number;
	explicit_content_filter: number;
	roles: Role[];
	features: string[];
	mfa_level: number;
	description: string | null;
	premium_tier: number;
	premium_subscription_count?: number;
	preferred_locale: string;
	approximate_member_count?: number;
	approximate_presence_count?: number;
};

export type PartialGuild = {
	id: string;
	name: string;
	icon: string | null;
	owner: boolean;
	permissions: string;
	features: string[];
	approximate_member_count?: number;
	approximate_presence_count?: number;
};

export type GuildMember = {
	user?: DiscordUser;
	nick: string | null;
	avatar?: string | null;
	roles: string[];
	joined_at: string;
	premium_since: string | null;
	deaf: boolean;
	mute: boolean;
	flags: number;
	pending?: boolean;
};

// ── Endpoint Input Types ───────────────────────────────────────────────────────

export type MessagesSendInput = {
	channel_id: string;
	content?: string;
	embeds?: Embed[];
	tts?: boolean;
	nonce?: string | number;
};

export type MessagesReplyInput = {
	channel_id: string;
	message_id: string;
	content?: string;
	embeds?: Embed[];
	fail_if_not_exists?: boolean;
};

export type MessagesGetInput = {
	channel_id: string;
	message_id: string;
};

export type MessagesListInput = {
	channel_id: string;
	limit?: number;
	before?: string;
	after?: string;
	around?: string;
};

export type MessagesEditInput = {
	channel_id: string;
	message_id: string;
	content?: string;
	embeds?: Embed[];
};

export type MessagesDeleteInput = {
	channel_id: string;
	message_id: string;
};

export type ThreadsCreateInput = {
	channel_id: string;
	name: string;
	auto_archive_duration?: 60 | 1440 | 4320 | 10080;
	type?: number;
	invitable?: boolean;
};

export type ThreadsCreateFromMessageInput = {
	channel_id: string;
	message_id: string;
	name: string;
	auto_archive_duration?: 60 | 1440 | 4320 | 10080;
};

export type ReactionsAddInput = {
	channel_id: string;
	message_id: string;
	emoji: string;
};

export type ReactionsRemoveInput = {
	channel_id: string;
	message_id: string;
	emoji: string;
};

export type ReactionsListInput = {
	channel_id: string;
	message_id: string;
	emoji: string;
	limit?: number;
	after?: string;
};

export type GuildsListInput = {
	before?: string;
	after?: string;
	limit?: number;
	with_counts?: boolean;
};

export type GuildsGetInput = {
	guild_id: string;
	with_counts?: boolean;
};

export type ChannelsListInput = {
	guild_id: string;
};

export type MembersListInput = {
	guild_id: string;
	limit?: number;
	after?: string;
};

export type MembersGetInput = {
	guild_id: string;
	user_id: string;
};

// ── Endpoint Output Types ──────────────────────────────────────────────────────

export type SuccessResponse = { success: true };

export type DiscordEndpointOutputs = {
	messagesSend: Message;
	messagesReply: Message;
	messagesGet: Message;
	messagesList: Message[];
	messagesEdit: Message;
	messagesDelete: SuccessResponse;
	threadsCreate: Channel;
	threadsCreateFromMessage: Channel;
	reactionsAdd: SuccessResponse;
	reactionsRemove: SuccessResponse;
	reactionsList: DiscordUser[];
	guildsList: PartialGuild[];
	guildsGet: Guild;
	channelsList: Channel[];
	membersList: GuildMember[];
	membersGet: GuildMember;
};

// ── Zod Schemas for Validation ─────────────────────────────────────────────────

const DiscordUserSchema = z.object({
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

const EmbedSchema = z.object({
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
		.object({
			text: z.string(),
			icon_url: z.string().optional(),
		})
		.optional(),
	image: z
		.object({
			url: z.string(),
		})
		.optional(),
	thumbnail: z
		.object({
			url: z.string(),
		})
		.optional(),
	author: z
		.object({
			name: z.string(),
			url: z.string().optional(),
			icon_url: z.string().optional(),
		})
		.optional(),
	timestamp: z.string().optional(),
});

const AttachmentSchema = z.object({
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

const MessageReferenceSchema = z.object({
	message_id: z.string().optional(),
	channel_id: z.string().optional(),
	guild_id: z.string().optional(),
});

const ChannelSchema = z
	.object({
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
	})
	.passthrough();

const MessageSchema = z
	.object({
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
					emoji: z.object({
						id: z.string().nullable(),
						name: z.string(),
					}),
				}),
			)
			.optional(),
		pinned: z.boolean(),
		type: z.number(),
		flags: z.number().optional(),
		message_reference: MessageReferenceSchema.optional(),
		referenced_message: z.any().optional(),
		thread: ChannelSchema.optional(),
		nonce: z.union([z.string(), z.number()]).optional(),
	})
	.passthrough();

const RoleSchema = z.object({
	id: z.string(),
	name: z.string(),
	permissions: z.string(),
	position: z.number(),
	color: z.number(),
	hoist: z.boolean(),
	managed: z.boolean(),
	mentionable: z.boolean(),
});

const GuildSchema = z.object({
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

const PartialGuildSchema = z.object({
	id: z.string(),
	name: z.string(),
	icon: z.string().nullable(),
	owner: z.boolean(),
	permissions: z.string(),
	features: z.array(z.string()),
	approximate_member_count: z.number().optional(),
	approximate_presence_count: z.number().optional(),
});

const GuildMemberSchema = z.object({
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

const SuccessResponseSchema = z.object({
	success: z.literal(true),
});

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
