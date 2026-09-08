import z from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Locally cached entities
//
// Only what a bot re-reads is stored. Messages, channels and users are cached
// because onboarding and FAQ automations look them up repeatedly and Slack's
// per-method rate limits make refetching expensive. Scheduled messages and
// reminders are cached because they describe pending future work that a caller
// needs to list and cancel, and Slack offers no cheap way to reconcile them.
// Ephemeral messages, presence and emoji are deliberately not stored: they are
// either untracked by Slack or stale the moment they are written.
// ─────────────────────────────────────────────────────────────────────────────

export const SlackbotMessage = z.object({
	/** Slack's message timestamp, unique per channel and used as the entity id. */
	id: z.string(),
	ts: z.string().optional(),
	channel: z.string(),
	channel_type: z.enum(['channel', 'group', 'im', 'mpim']).optional(),
	subtype: z.string().optional(),
	text: z.string().optional(),
	user: z.string().optional(),
	bot_id: z.string().optional(),
	app_id: z.string().optional(),
	team: z.string().optional(),
	thread_ts: z.string().optional(),
	authorId: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const SlackbotChannel = z.object({
	id: z.string(),
	name: z.string().optional(),
	is_private: z.boolean().optional(),
	is_archived: z.boolean().optional(),
	created: z.number().optional(),
	creator: z.string().optional(),
	num_members: z.number().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const SlackbotUser = z.object({
	id: z.string(),
	name: z.string().optional(),
	real_name: z.string().optional(),
	team_id: z.string().optional(),
	is_bot: z.boolean().optional(),
	deleted: z.boolean().optional(),
	tz: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const SlackbotFile = z.object({
	id: z.string(),
	name: z.string().optional(),
	title: z.string().optional(),
	mimetype: z.string().optional(),
	filetype: z.string().optional(),
	size: z.number().optional(),
	user: z.string().optional(),
	created: z.number().optional(),
	permalink: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

/**
 * A message queued with `chat.scheduleMessage`. Slack can list these, but only
 * per channel and within a time window, so the id is cached to make
 * cancellation a direct lookup.
 */
export const SlackbotScheduledMessage = z.object({
	id: z.string(),
	channel: z.string(),
	post_at: z.number().optional(),
	text: z.string().optional(),
	thread_ts: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const SlackbotReminder = z.object({
	id: z.string(),
	text: z.string().optional(),
	user: z.string().optional(),
	creator: z.string().optional(),
	time: z.number().optional(),
	recurring: z.boolean().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export type SlackbotMessage = z.infer<typeof SlackbotMessage>;
export type SlackbotChannel = z.infer<typeof SlackbotChannel>;
export type SlackbotUser = z.infer<typeof SlackbotUser>;
export type SlackbotFile = z.infer<typeof SlackbotFile>;
export type SlackbotScheduledMessage = z.infer<typeof SlackbotScheduledMessage>;
export type SlackbotReminder = z.infer<typeof SlackbotReminder>;
