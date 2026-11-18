import { z } from 'zod';

// Local rows keep the fields an agent filters or joins on. Ids are BugHerd's
// numeric ids as strings. Provider-side extras stay in the endpoint output.

export const BugherdProject = z.object({
	id: z.string(),
	name: z.string().nullable().optional(),
	devurl: z.string().nullable().optional(),
	is_active: z.boolean().nullable().optional(),
	is_public: z.boolean().nullable().optional(),
	owner_name: z.string().nullable().optional(),
	created_at: z.string().nullable().optional(),
});

export const BugherdTask = z.object({
	id: z.string(),
	project_id: z.number().nullable().optional(),
	local_task_id: z.number().nullable().optional(),
	title: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
	status: z.string().nullable().optional(),
	priority: z.string().nullable().optional(),
	tag_names: z.array(z.string()).nullable().optional(),
	assigned_to_id: z.number().nullable().optional(),
	external_id: z.string().nullable().optional(),
	created_at: z.string().nullable().optional(),
	updated_at: z.string().nullable().optional(),
	closed_at: z.string().nullable().optional(),
});

export const BugherdColumn = z.object({
	id: z.string(),
	project_id: z.number().nullable().optional(),
	name: z.string().nullable().optional(),
	position: z.number().nullable().optional(),
});

export const BugherdComment = z.object({
	id: z.string(),
	task_id: z.number().nullable().optional(),
	user_id: z.number().nullable().optional(),
	text: z.string().nullable().optional(),
	is_private: z.boolean().nullable().optional(),
	created_at: z.string().nullable().optional(),
});

export const BugherdAttachment = z.object({
	id: z.string(),
	task_id: z.number().nullable().optional(),
	file_name: z.string().nullable().optional(),
	url: z.string().nullable().optional(),
	created_at: z.string().nullable().optional(),
});

export const BugherdWebhook = z.object({
	id: z.string(),
	target_url: z.string().nullable().optional(),
	event: z.string().nullable().optional(),
	project_id: z.number().nullable().optional(),
});

export const BugherdUser = z.object({
	id: z.string(),
	email: z.string().nullable().optional(),
	display_name: z.string().nullable().optional(),
});

export const BugherdOrganization = z.object({
	id: z.string(),
	name: z.string().nullable().optional(),
});

export type BugherdProject = z.infer<typeof BugherdProject>;
export type BugherdTask = z.infer<typeof BugherdTask>;
export type BugherdColumn = z.infer<typeof BugherdColumn>;
export type BugherdComment = z.infer<typeof BugherdComment>;
export type BugherdAttachment = z.infer<typeof BugherdAttachment>;
export type BugherdWebhook = z.infer<typeof BugherdWebhook>;
export type BugherdUser = z.infer<typeof BugherdUser>;
export type BugherdOrganization = z.infer<typeof BugherdOrganization>;
