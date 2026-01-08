import z from 'zod';

export const SlackMessage = z.object({
	id: z.string(),
	ts: z.string().optional(),
	type: z.string().optional(),
	subtype: z.string().optional(),
	text: z.string().optional(),
	user: z.string().optional(),
	bot_id: z.string().optional(),
	app_id: z.string().optional(),
	team: z.string().optional(),
	username: z.string().optional(),
	channel: z.string(),
	createdAt: z.coerce.date().optional(),
	authorId: z.string().optional(),
	thread_ts: z.string().optional(),
	reply_count: z.number().optional(),
	is_locked: z.boolean().optional(),
	subscribed: z.boolean().optional(),
});

export const SlackChannel = z.object({
	id: z.string(),
	name: z.string().optional(),
	name_normalized: z.string().optional(),
	is_channel: z.boolean().optional(),
	is_group: z.boolean().optional(),
	is_im: z.boolean().optional(),
	is_mpim: z.boolean().optional(),
	is_private: z.boolean().optional(),
	is_archived: z.boolean().optional(),
	is_general: z.boolean().optional(),
	created: z.number().optional(),
	createdAt: z.coerce.date().optional(),
	creator: z.string().optional(),
	is_member: z.boolean().optional(),
	num_members: z.number().optional(),
	topic: z.object({
		value: z.string(),
		creator: z.string(),
		last_set: z.number(),
	}).optional(),
	purpose: z.object({
		value: z.string(),
		creator: z.string(),
		last_set: z.number(),
	}).optional(),
});

export const SlackUser = z.object({
	id: z.string(),
	name: z.string().optional(),
	real_name: z.string().optional(),
	display_name: z.string().optional(),
	email: z.string().optional(),
	is_bot: z.boolean().optional(),
	is_admin: z.boolean().optional(),
	deleted: z.boolean().optional(),
	profile: z.object({
		avatar_hash: z.string().optional(),
		status_text: z.string().optional(),
		status_emoji: z.string().optional(),
		real_name: z.string().optional(),
		display_name: z.string().optional(),
		email: z.string().optional(),
		image_24: z.string().optional(),
		image_32: z.string().optional(),
		image_48: z.string().optional(),
		image_72: z.string().optional(),
		image_192: z.string().optional(),
		image_512: z.string().optional(),
		phone: z.string().optional(),
		title: z.string().optional(),
	}).optional(),
});

export const SlackFile = z.object({
	id: z.string(),
	name: z.string().optional(),
	title: z.string().optional(),
	mimetype: z.string().optional(),
	filetype: z.string().optional(),
	pretty_type: z.string().optional(),
	user: z.string().optional(),
	size: z.number().optional(),
	url_private: z.string().optional(),
	url_private_download: z.string().optional(),
	permalink: z.string().optional(),
	permalink_public: z.string().optional(),
	created: z.number().optional(),
	timestamp: z.number().optional(),
});

export const SlackUsergroup = z.object({
	id: z.string(),
	name: z.string().optional(),
	description: z.string().optional(),
	handle: z.string().optional(),
	is_usergroup: z.boolean().optional(),
	date_create: z.number().optional(),
	date_update: z.number().optional(),
	created_by: z.string().optional(),
	users: z.array(z.string()).optional(),
	user_count: z.number().optional(),
	channel_count: z.number().optional(),
});

export type SlackMessage = z.infer<typeof SlackMessage>;
export type SlackChannel = z.infer<typeof SlackChannel>;
export type SlackUser = z.infer<typeof SlackUser>;
export type SlackFile = z.infer<typeof SlackFile>;
export type SlackUsergroup = z.infer<typeof SlackUsergroup>;
