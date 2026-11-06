import { z } from 'zod';

const UserSchema = z.object({
	id: z.number(),
	email: z.string(),
	first_name: z.string().nullable(),
	last_name: z.string().nullable(),
	name: z.string(),
	created_at: z.string(),
	updated_at: z.string(),
});

const ProjectSchema = z.object({
	id: z.number(),
	name: z.string(),
	is_active: z.boolean(),
	is_public: z.boolean(),
	created_at: z.string(),
	updated_at: z.string(),
	deleted_at: z.string().nullable(),
	description: z.string().nullable(),
	technical_contact_email: z.string().nullable(),
	guest_default_role: z.string().nullable(),
	settings: z.record(z.string(), z.unknown()).optional(),
});

const TaskSchema = z.object({
	id: z.number(),
	description: z.string(),
	status: z.string(),
	priority: z.string().nullable(),
	tag_list: z.array(z.string()),
	created_at: z.string(),
	updated_at: z.string(),
	closed_at: z.string().nullable(),
	project_id: z.number(),
	reporter_id: z.number().nullable(),
	assignee_id: z.number().nullable(),
	external_id: z.string().nullable(),
	attachments_count: z.number(),
	comments_count: z.number(),
	due_date: z.string().nullable(),
	duedate: z.string().nullable(),
	column_id: z.number().nullable(),
});

const ColumnSchema = z.object({
	id: z.number(),
	name: z.string(),
	project_id: z.number(),
	position: z.number(),
	created_at: z.string(),
	updated_at: z.string(),
});

const AttachmentSchema = z.object({
	id: z.number(),
	file_name: z.string(),
	file_size: z.number(),
	content_type: z.string(),
	url: z.string(),
	created_at: z.string(),
	updated_at: z.string(),
	task_id: z.number(),
	user_id: z.number(),
});

const CommentSchema = z.object({
	id: z.number(),
	body: z.string(),
	created_at: z.string(),
	updated_at: z.string(),
	task_id: z.number(),
	user_id: z.number(),
});

const WebhookSchema = z.object({
	id: z.number(),
	url: z.string(),
	project_id: z.number(),
	events: z.array(z.string()),
	created_at: z.string(),
	updated_at: z.string(),
});

const OrganizationSchema = z.object({
	id: z.number(),
	name: z.string(),
	created_at: z.string(),
	updated_at: z.string(),
});

export const BugherdProject = ProjectSchema;
export const BugherdTask = TaskSchema;
export const BugherdColumn = ColumnSchema;
export const BugherdAttachment = AttachmentSchema;
export const BugherdComment = CommentSchema;
export const BugherdWebhook = WebhookSchema;
export const BugherdUser = UserSchema;
export const BugherdOrganization = OrganizationSchema;

export type BugherdProject = z.infer<typeof BugherdProject>;
export type BugherdTask = z.infer<typeof BugherdTask>;
export type BugherdColumn = z.infer<typeof BugherdColumn>;
export type BugherdAttachment = z.infer<typeof BugherdAttachment>;
export type BugherdComment = z.infer<typeof BugherdComment>;
export type BugherdWebhook = z.infer<typeof BugherdWebhook>;
export type BugherdUser = z.infer<typeof BugherdUser>;
export type BugherdOrganization = z.infer<typeof BugherdOrganization>;
