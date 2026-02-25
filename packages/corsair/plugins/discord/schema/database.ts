import { z } from 'zod';

export const DiscordRole = z.object({
	id: z.string(),
	name: z.string(),
	color: z.number(),
	hoist: z.boolean(),
	icon: z.string().nullable().optional(),
	unicode_emoji: z.string().nullable().optional(),
	position: z.number(),
	permissions: z.string(),
	managed: z.boolean(),
	mentionable: z.boolean(),
	flags: z.number().optional(),
});

export const DiscordGuildMember = z.object({
	nick: z.string().nullable().optional(),
	avatar: z.string().nullable().optional(),
	banner: z.string().nullable().optional(),
	joined_at: z.string().nullable(),
	premium_since: z.string().nullable().optional(),
	deaf: z.boolean(),
	mute: z.boolean(),
	flags: z.number(),
	pending: z.boolean().optional(),
	permissions: z.string().optional(),
	communication_disabled_until: z.string().nullable().optional(),
});

export const DiscordChannel = z.object({
	id: z.string(),
	type: z.number(),
	guild_id: z.string().optional(),
	position: z.number().optional(),
	name: z.string().nullable().optional(),
	topic: z.string().nullable().optional(),
	nsfw: z.boolean().optional(),
	last_message_id: z.string().nullable().optional(),
	bitrate: z.number().optional(),
	user_limit: z.number().optional(),
	rate_limit_per_user: z.number().optional(),
	icon: z.string().nullable().optional(),
	owner_id: z.string().optional(),
	application_id: z.string().optional(),
	managed: z.boolean().optional(),
	parent_id: z.string().nullable().optional(),
	last_pin_timestamp: z.string().nullable().optional(),
	rtc_region: z.string().nullable().optional(),
	video_quality_mode: z.number().optional(),
	message_count: z.number().optional(),
	member_count: z.number().optional(),
	default_auto_archive_duration: z.number().optional(),
	permissions: z.string().optional(),
	flags: z.number().optional(),
	total_message_sent: z.number().optional(),
	default_thread_rate_limit_per_user: z.number().optional(),
	default_sort_order: z.number().nullable().optional(),
	default_forum_layout: z.number().optional(),
});

export const DiscordInteraction = z.object({
	id: z.string(),
	application_id: z.string(),
	type: z.number(),
	data: z.unknown().optional(),
	token: z.string(),
	version: z.number(),
	guild_id: z.string().optional(),
	channel_id: z.string().optional(),
	app_permissions: z.string(),
	locale: z.string().optional(),
	guild_locale: z.string().optional(),
	authorizing_integration_owners: z.record(z.string()),
	context: z.number().optional(),
	attachment_size_limit: z.number(),
});

export const DiscordInvite = z.object({
	type: z.number(),
	code: z.string(),
	target_type: z.number().optional(),
	approximate_presence_count: z.number().optional(),
	approximate_member_count: z.number().optional(),
	expires_at: z.string().nullable(),
	flags: z.number().optional(),
});

export const DiscordWebhook = z.object({
	id: z.string(),
	type: z.number(),
	guild_id: z.string().nullable().optional(),
	channel_id: z.string().nullable(),
	name: z.string().nullable(),
	avatar: z.string().nullable(),
	token: z.string().optional(),
	application_id: z.string().nullable(),
	url: z.string().optional(),
});

export const DiscordGuild = z.object({
	id: z.string(),
	name: z.string(),
	icon: z.string().nullable(),
	icon_hash: z.string().nullable().optional(),
	splash: z.string().nullable(),
	discovery_splash: z.string().nullable().optional(),
	owner: z.boolean().optional(),
	owner_id: z.string(),
	permissions: z.string().optional(),
	region: z.string().nullable().optional(),
	afk_channel_id: z.string().nullable(),
	afk_timeout: z.number(),
	widget_enabled: z.boolean().optional(),
	widget_channel_id: z.string().nullable().optional(),
	verification_level: z.number(),
	default_message_notifications: z.number(),
	explicit_content_filter: z.number(),
	mfa_level: z.number(),
	application_id: z.string().nullable(),
	system_channel_id: z.string().nullable(),
	system_channel_flags: z.number(),
	rules_channel_id: z.string().nullable(),
	max_presences: z.number().nullable().optional(),
	max_members: z.number().optional(),
	vanity_url_code: z.string().nullable(),
	description: z.string().nullable(),
	banner: z.string().nullable(),
	premium_tier: z.number(),
	premium_subscription_count: z.number().optional(),
	preferred_locale: z.string(),
	public_updates_channel_id: z.string().nullable(),
	max_video_channel_users: z.number().optional(),
	max_stage_video_channel_users: z.number().optional(),
	approximate_member_count: z.number().optional(),
	approximate_presence_count: z.number().optional(),
	nsfw_level: z.number(),
	premium_progress_bar_enabled: z.boolean(),
	safety_alerts_channel_id: z.string().nullable(),
});

export const DiscordUser = z.object({
	id: z.string(),
	username: z.string(),
	discriminator: z.string(),
	global_name: z.string().nullable(),
	avatar: z.string().nullable(),
	bot: z.boolean().optional(),
	system: z.boolean().optional(),
	mfa_enabled: z.boolean().optional(),
	banner: z.string().nullable().optional(),
	accent_color: z.number().int().nullable().optional(),
	locale: z.string().optional(),
	verified: z.boolean().optional(),
	email: z.string().nullable().optional(),
	flags: z.number().int().optional(),
	premium_type: z.number().int().optional(),
	public_flags: z.number().int().optional(),
	avatar_decoration: z.string().nullable().optional(),
});

export const DiscordMessage: z.ZodType = z.lazy(() =>
	z.object({
		id: z.string(),
		channel_id: z.string(),
		content: z.string(),
		timestamp: z.string(),
		edited_timestamp: z.string().nullable(),
		tts: z.boolean(),
		mention_everyone: z.boolean(),
		nonce: z.union([z.number(), z.string()]).optional(),
		pinned: z.boolean(),
		webhook_id: z.string().optional(),
		type: z.number(),
		application_id: z.string().optional(),
		flags: z.number().int().optional(),
		position: z.number().optional(),
	}),
);

export type DiscordUser = z.infer<typeof DiscordUser>;
export type DiscordMessage = z.infer<typeof DiscordMessage>;
export type DiscordGuild = z.infer<typeof DiscordGuild>;
export type DiscordRole = z.infer<typeof DiscordRole>;
export type DiscordInvite = z.infer<typeof DiscordInvite>;
export type DiscordWebhook = z.infer<typeof DiscordWebhook>;
export type DiscordInteraction = z.infer<typeof DiscordInteraction>;
export type DiscordChannel = z.infer<typeof DiscordChannel>;
export type DiscordGuildMember = z.infer<typeof DiscordGuildMember>;
