import { z } from 'zod';

export const DiscordMessage = z.object({
	id: z.string(),
	channel_id: z.string(),
	content: z.string().optional(),
	timestamp: z.string().optional(),
	edited_timestamp: z.string().nullable().optional(),
	tts: z.boolean().optional(),
	mention_everyone: z.boolean().optional(),
	pinned: z.boolean().optional(),
	type: z.number().optional(),
	flags: z.number().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	authorId: z.string().optional(),
	thread_ts: z.string().optional(),
});

export const DiscordChannel = z.object({
	id: z.string(),
	type: z.number(),
	guild_id: z.string().optional(),
	name: z.string().nullable().optional(),
	topic: z.string().nullable().optional(),
	position: z.number().optional(),
	parent_id: z.string().nullable().optional(),
	last_message_id: z.string().nullable().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const DiscordGuild = z.object({
	id: z.string(),
	name: z.string(),
	icon: z.string().nullable().optional(),
	owner_id: z.string().optional(),
	approximate_member_count: z.number().optional(),
	approximate_presence_count: z.number().optional(),
	description: z.string().nullable().optional(),
	premium_tier: z.number().optional(),
	preferred_locale: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const DiscordMember = z.object({
	id: z.string(),
	guild_id: z.string(),
	nick: z.string().nullable().optional(),
	roles: z.array(z.string()).optional(),
	joined_at: z.string().optional(),
	premium_since: z.string().nullable().optional(),
	deaf: z.boolean().optional(),
	mute: z.boolean().optional(),
	pending: z.boolean().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export type DiscordMessage = z.infer<typeof DiscordMessage>;
export type DiscordChannel = z.infer<typeof DiscordChannel>;
export type DiscordGuild = z.infer<typeof DiscordGuild>;
export type DiscordMember = z.infer<typeof DiscordMember>;
