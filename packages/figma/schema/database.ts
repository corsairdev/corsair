import { z } from 'zod';

export const FigmaComment = z.object({
	id: z.string(),
	uuid: z.string().nullable().optional(),
	message: z.string().optional(),
	file_key: z.string().optional(),
	order_id: z.string().nullable().optional(),
	parent_id: z.string().nullable().optional(),
	created_at: z.string().nullable().optional(),
	resolved_at: z.string().nullable().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	user_id: z.string().optional(),
	user_handle: z.string().optional(),
});

export const FigmaWebhookConfig = z.object({
	id: z.string(),
	status: z.enum(['ACTIVE', 'PAUSED']).optional(),
	context: z.enum(['team', 'project', 'file']).nullable().optional(),
	team_id: z.string().nullable().optional(),
	endpoint: z.string().optional(),
	passcode: z.string().optional(),
	client_id: z.string().nullable().optional(),
	context_id: z.string().nullable().optional(),
	event_type: z.string().optional(),
	description: z.string().nullable().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const FigmaComponent = z.object({
	key: z.string(),
	file_key: z.string().optional(),
	node_id: z.string().optional(),
	name: z.string().optional(),
	description: z.string().optional(),
	thumbnail_url: z.string().optional(),
	created_at: z.string().nullable().optional(),
	updated_at: z.string().nullable().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const FigmaFileMetadata = z.object({
	id: z.string(),
	name: z.string().optional(),
	role: z.string().optional(),
	last_modified: z.string().nullable().optional(),
	editorType: z.string().optional(),
	thumbnail_url: z.string().nullable().optional(),
	version: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const FigmaVersion = z.object({
	id: z.string(),
	file_key: z.string().optional(),
	label: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
	created_at: z.string().nullable().optional(),
	user_id: z.string().optional(),
	user_handle: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export type FigmaComment = z.infer<typeof FigmaComment>;
export type FigmaWebhookConfig = z.infer<typeof FigmaWebhookConfig>;
export type FigmaComponent = z.infer<typeof FigmaComponent>;
export type FigmaFileMetadata = z.infer<typeof FigmaFileMetadata>;
export type FigmaVersion = z.infer<typeof FigmaVersion>;
