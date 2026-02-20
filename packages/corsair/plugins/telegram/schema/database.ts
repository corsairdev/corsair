import { z } from 'zod';

export const TelegramMessage = z.object({
	id: z.string(),
	message_id: z.number(),
	chat_id: z.string(),
	from_id: z.string().optional(),
	authorId: z.string().optional(),
	date: z.number().optional(),
	text: z.string().optional(),
	caption: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	edit_date: z.number().optional(),
	media_group_id: z.string().optional(),
	reply_to_message_id: z.number().optional(),
	forward_from_id: z.number().optional(),
	forward_from_chat_id: z.number().optional(),
	forward_from_message_id: z.number().optional(),
}).passthrough();

export const TelegramChat = z.object({
	id: z.string(),
	chat_id: z.number(),
	type: z.enum(['private', 'group', 'supergroup', 'channel']),
	title: z.string().optional(),
	username: z.string().optional(),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	is_forum: z.boolean().optional(),
	description: z.string().optional(),
	invite_link: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
}).passthrough();

export const TelegramUser = z.object({
	id: z.string(),
	user_id: z.number(),
	is_bot: z.boolean().optional(),
	first_name: z.string(),
	last_name: z.string().optional(),
	username: z.string().optional(),
	language_code: z.string().optional(),
	is_premium: z.boolean().optional(),
	createdAt: z.coerce.date().nullable().optional(),
}).passthrough();

export const TelegramFile = z.object({
	id: z.string(),
	file_id: z.string(),
	file_unique_id: z.string(),
	file_size: z.number().optional(),
	file_path: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
}).passthrough();

export const TelegramPoll = z.object({
	id: z.string(),
	poll_id: z.string(),
	question: z.string(),
	total_voter_count: z.number().optional(),
	is_closed: z.boolean().optional(),
	is_anonymous: z.boolean().optional(),
	type: z.string().optional(),
	allows_multiple_answers: z.boolean().optional(),
	createdAt: z.coerce.date().nullable().optional(),
}).passthrough();

export type TelegramMessage = z.infer<typeof TelegramMessage>;
export type TelegramChat = z.infer<typeof TelegramChat>;
export type TelegramUser = z.infer<typeof TelegramUser>;
export type TelegramFile = z.infer<typeof TelegramFile>;
export type TelegramPoll = z.infer<typeof TelegramPoll>;
