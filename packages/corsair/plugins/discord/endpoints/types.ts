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

// ── Endpoint Input Schemas ─────────────────────────────────────────────────────

export const DiscordEndpointInputSchemas = {
	messagesSend: z.object({
		channel_id: z.string(),
		content: z.string().optional(),
		embeds: z.array(z.any()).optional(),
		tts: z.boolean().optional(),
		nonce: z.union([z.string(), z.number()]).optional(),
	}),
	messagesReply: z.object({
		channel_id: z.string(),
		message_id: z.string(),
		content: z.string().optional(),
		embeds: z.array(z.any()).optional(),
		fail_if_not_exists: z.boolean().optional(),
	}),
	messagesGet: z.object({
		channel_id: z.string(),
		message_id: z.string(),
	}),
	messagesList: z.object({
		channel_id: z.string(),
		limit: z.number().optional(),
		before: z.string().optional(),
		after: z.string().optional(),
		around: z.string().optional(),
	}),
	messagesEdit: z.object({
		channel_id: z.string(),
		message_id: z.string(),
		content: z.string().optional(),
		embeds: z.array(z.any()).optional(),
	}),
	messagesDelete: z.object({
		channel_id: z.string(),
		message_id: z.string(),
	}),
	threadsCreate: z.object({
		channel_id: z.string(),
		name: z.string(),
		auto_archive_duration: z
			.union([
				z.literal(60),
				z.literal(1440),
				z.literal(4320),
				z.literal(10080),
			])
			.optional(),
		type: z.number().optional(),
		invitable: z.boolean().optional(),
	}),
	threadsCreateFromMessage: z.object({
		channel_id: z.string(),
		message_id: z.string(),
		name: z.string(),
		auto_archive_duration: z
			.union([
				z.literal(60),
				z.literal(1440),
				z.literal(4320),
				z.literal(10080),
			])
			.optional(),
	}),
	reactionsAdd: z.object({
		channel_id: z.string(),
		message_id: z.string(),
		emoji: z.string(),
	}),
	reactionsRemove: z.object({
		channel_id: z.string(),
		message_id: z.string(),
		emoji: z.string(),
	}),
	reactionsList: z.object({
		channel_id: z.string(),
		message_id: z.string(),
		emoji: z.string(),
		limit: z.number().optional(),
		after: z.string().optional(),
	}),
	guildsList: z.object({
		before: z.string().optional(),
		after: z.string().optional(),
		limit: z.number().optional(),
		with_counts: z.boolean().optional(),
	}),
	guildsGet: z.object({
		guild_id: z.string(),
		with_counts: z.boolean().optional(),
	}),
	channelsList: z.object({
		guild_id: z.string(),
	}),
	membersList: z.object({
		guild_id: z.string(),
		limit: z.number().optional(),
		after: z.string().optional(),
	}),
	membersGet: z.object({
		guild_id: z.string(),
		user_id: z.string(),
	}),
} as const;

// ── Endpoint Output Schemas ────────────────────────────────────────────────────

export const DiscordEndpointOutputSchemas = {
	messagesSend: z.any(),
	messagesReply: z.any(),
	messagesGet: z.any(),
	messagesList: z.array(z.any()),
	messagesEdit: z.any(),
	messagesDelete: z.object({ success: z.literal(true) }),
	threadsCreate: z.any(),
	threadsCreateFromMessage: z.any(),
	reactionsAdd: z.object({ success: z.literal(true) }),
	reactionsRemove: z.object({ success: z.literal(true) }),
	reactionsList: z.array(z.any()),
	guildsList: z.array(z.any()),
	guildsGet: z.any(),
	channelsList: z.array(z.any()),
	membersList: z.array(z.any()),
	membersGet: z.any(),
} as const;
