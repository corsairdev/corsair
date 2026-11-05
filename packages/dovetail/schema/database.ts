import { z } from 'zod';

export const DovetailProject = z.object({
	id: z.string(),
	title: z.string(),
	folder_id: z.string().nullable().optional(),
	template_id: z.string().nullable().optional(),
	created_at: z.string().nullable().optional(),
	updated_at: z.string().nullable().optional(),
});
export type DovetailProject = z.infer<typeof DovetailProject>;

export const DovetailData = z.object({
	id: z.string(),
	project_id: z.string().optional(),
	title: z.string().nullable().optional(),
	folder_id: z.string().nullable().optional(),
	created_at: z.string().nullable().optional(),
	updated_at: z.string().nullable().optional(),
	deleted: z.boolean().optional(),
	deleted_at: z.string().nullable().optional(),
});
export type DovetailData = z.infer<typeof DovetailData>;

export const DovetailDoc = z.object({
	id: z.string(),
	title: z.string().nullable().optional(),
	project_id: z.string().nullable().optional(),
	folder_id: z.string().nullable().optional(),
	cover_image_file_id: z.string().nullable().optional(),
	created_at: z.string().nullable().optional(),
	updated_at: z.string().nullable().optional(),
});
export type DovetailDoc = z.infer<typeof DovetailDoc>;

export const DovetailInsight = z.object({
	id: z.string(),
	title: z.string().nullable().optional(),
	project_id: z.string().nullable().optional(),
	folder_id: z.string().nullable().optional(),
	cover_image_file_id: z.string().nullable().optional(),
	created_at: z.string().nullable().optional(),
	updated_at: z.string().nullable().optional(),
});
export type DovetailInsight = z.infer<typeof DovetailInsight>;

export const DovetailNote = z.object({
	id: z.string(),
	project_id: z.string().optional(),
	title: z.string().nullable().optional(),
	folder_id: z.string().nullable().optional(),
	created_at: z.string().nullable().optional(),
	updated_at: z.string().nullable().optional(),
});
export type DovetailNote = z.infer<typeof DovetailNote>;

export const DovetailChannel = z.object({
	id: z.string(),
	title: z.string(),
	content_type: z.string().optional(),
	project_category_id: z.string().nullable().optional(),
	created_at: z.string().nullable().optional(),
	updated_at: z.string().nullable().optional(),
});
export type DovetailChannel = z.infer<typeof DovetailChannel>;

export const DovetailTopic = z.object({
	id: z.string(),
	channel_id: z.string().optional(),
	title: z.string(),
	description: z.string().optional(),
	created_at: z.string().nullable().optional(),
	updated_at: z.string().nullable().optional(),
});
export type DovetailTopic = z.infer<typeof DovetailTopic>;

export const DovetailDataPoint = z.object({
	id: z.string(),
	channel_id: z.string().optional(),
	text: z.string().optional(),
	timestamp: z.string().nullable().optional(),
	source_title: z.string().nullable().optional(),
	source_url: z.string().nullable().optional(),
	created_at: z.string().nullable().optional(),
});
export type DovetailDataPoint = z.infer<typeof DovetailDataPoint>;

export const DovetailContact = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string().nullable().optional(),
	avatar_url: z.string().nullable().optional(),
	created_at: z.string().nullable().optional(),
	updated_at: z.string().nullable().optional(),
});
export type DovetailContact = z.infer<typeof DovetailContact>;

export const DovetailFolder = z.object({
	id: z.string(),
	title: z.string(),
	parent_folder_id: z.string().nullable().optional(),
	created_at: z.string().nullable().optional(),
	updated_at: z.string().nullable().optional(),
});
export type DovetailFolder = z.infer<typeof DovetailFolder>;

export const DovetailFile = z.object({
	id: z.string(),
	name: z.string().optional(),
	size: z.number().optional(),
	mime_type: z.string().optional(),
	status: z.string().optional(),
	created_at: z.string().nullable().optional(),
	updated_at: z.string().nullable().optional(),
});
export type DovetailFile = z.infer<typeof DovetailFile>;

export const DovetailHighlight = z.object({
	id: z.string(),
	project_id: z.string().optional(),
	note_id: z.string().optional(),
	tag_id: z.string().nullable().optional(),
	text: z.string().optional(),
	start_time: z.number().nullable().optional(),
	end_time: z.number().nullable().optional(),
	created_at: z.string().nullable().optional(),
	updated_at: z.string().nullable().optional(),
});
export type DovetailHighlight = z.infer<typeof DovetailHighlight>;

export const DovetailTag = z.object({
	id: z.string(),
	title: z.string(),
	color: z.string().optional(),
	project_id: z.string().nullable().optional(),
	tag_board_id: z.string().nullable().optional(),
	scope: z.string().optional(),
	highlight_count: z.number().optional(),
	created_at: z.string().nullable().optional(),
	updated_at: z.string().nullable().optional(),
});
export type DovetailTag = z.infer<typeof DovetailTag>;
