import { z } from 'zod';

export const ChatworkAccount = z.object({
	account_id: z.number(),
	room_id: z.number().optional(),
	name: z.string(),
	chatwork_id: z.string().optional(),
	organization_id: z.number().optional(),
	organization_name: z.string().optional(),
	department: z.string().optional(),
	title: z.string().optional(),
	url: z.string().optional(),
	introduction: z.string().optional(),
	mail: z.string().optional(),
	tel_organization: z.string().optional(),
	tel_extension: z.string().optional(),
	tel_mobile: z.string().optional(),
	skype: z.string().optional(),
	facebook: z.string().optional(),
	twitter: z.string().optional(),
	avatar_image_url: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const ChatworkRoom = z.object({
	room_id: z.number(),
	name: z.string(),
	type: z.string(),
	role: z.string().optional(),
	sticky: z.boolean().optional(),
	unread_num: z.number().optional(),
	mention_num: z.number().optional(),
	mytask_num: z.number().optional(),
	message_num: z.number().optional(),
	file_num: z.number().optional(),
	task_num: z.number().optional(),
	icon_path: z.string().optional(),
	last_update_time: z.number().optional(),
	description: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const ChatworkMessage = z.object({
	message_id: z.string(),
	room_id: z.number().optional(),
	account: z
		.object({
			account_id: z.number(),
			name: z.string(),
			avatar_image_url: z.string().optional(),
		})
		.optional(),
	body: z.string(),
	send_time: z.number(),
	update_time: z.number().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const ChatworkMember = z.object({
	account_id: z.number(),
	room_id: z.number().optional(),
	role: z.string(),
	name: z.string(),
	chatwork_id: z.string().optional(),
	organization_id: z.number().optional(),
	organization_name: z.string().optional(),
	department: z.string().optional(),
	avatar_image_url: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export type ChatworkAccount = z.infer<typeof ChatworkAccount>;
export type ChatworkRoom = z.infer<typeof ChatworkRoom>;
export type ChatworkMessage = z.infer<typeof ChatworkMessage>;
export type ChatworkMember = z.infer<typeof ChatworkMember>;
