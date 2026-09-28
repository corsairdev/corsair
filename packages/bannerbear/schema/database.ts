import { z } from 'zod';

export const BannerbearAccount = z.object({
	created_at: z.string().nullable().optional(),
	uid: z.string(),
	plan: z.string().nullable().optional(),
	quota: z
		.object({
			max: z.number(),
			current: z.number(),
			remaining: z.number(),
		})
		.nullable()
		.optional(),
	workspace: z.string().nullable().optional(),
	api_key: z
		.object({
			name: z.string().nullable().optional(),
			scopes: z.array(z.string()).optional(),
			allowed_origins: z.array(z.string()).optional(),
		})
		.nullable()
		.optional(),
});
export type BannerbearAccount = z.infer<typeof BannerbearAccount>;

export const BannerbearTemplate = z.object({
	uid: z.string(),
	name: z.string(),
	description: z.string().nullable().optional(),
	width: z.number().nullable().optional(),
	height: z.number().nullable().optional(),
	preview: z.string().nullable().optional(),
	preview_url: z.string().nullable().optional(),
	created_at: z.string().nullable().optional(),
	updated_at: z.string().nullable().optional(),
	tags: z.array(z.string()).optional(),
	self: z.string().nullable().optional(),
});
export type BannerbearTemplate = z.infer<typeof BannerbearTemplate>;

export const BannerbearImage = z.object({
	uid: z.string(),
	status: z.string(),
	template: z.string().nullable().optional(),
	files: z.record(z.string(), z.string().nullable()).nullable().optional(),
	metadata: z.string().nullable().optional(),
	error: z.string().nullable().optional(),
	self: z.string().nullable().optional(),
	created_at: z.string().nullable().optional(),
	completed_at: z.string().nullable().optional(),
});
export type BannerbearImage = z.infer<typeof BannerbearImage>;

export const BannerbearAnimation = z.object({
	uid: z.string(),
	status: z.string(),
	template: z.string().nullable().optional(),
	files: z.record(z.string(), z.string().nullable()).nullable().optional(),
	progress: z.number().nullable().optional(),
	metadata: z.string().nullable().optional(),
	error: z.string().nullable().optional(),
	self: z.string().nullable().optional(),
	created_at: z.string().nullable().optional(),
	completed_at: z.string().nullable().optional(),
});
export type BannerbearAnimation = z.infer<typeof BannerbearAnimation>;

export const BannerbearAnimationTemplate = z.object({
	uid: z.string(),
	name: z.string(),
	description: z.string().nullable().optional(),
	width: z.number().nullable().optional(),
	height: z.number().nullable().optional(),
	frame_rate: z.number().nullable().optional(),
	duration_seconds: z.number().nullable().optional(),
	preview: z.string().nullable().optional(),
	tags: z.array(z.string()).optional(),
	created_at: z.string().nullable().optional(),
	self: z.string().nullable().optional(),
});
export type BannerbearAnimationTemplate = z.infer<
	typeof BannerbearAnimationTemplate
>;

export const BannerbearInstantUrl = z.object({
	uid: z.string(),
	name: z.string().optional(),
	template: z.string().nullable().optional(),
	base_url: z.string().optional(),
	sample_url: z.string().nullable().optional(),
	mode: z.string().nullable().optional(),
	security: z.string().nullable().optional(),
	status: z.string().nullable().optional(),
	signing_key: z.string().nullable().optional(),
	created_at: z.string().nullable().optional(),
});
export type BannerbearInstantUrl = z.infer<typeof BannerbearInstantUrl>;

export const BannerbearWebhookObj = z.object({
	uid: z.string(),
	name: z.string().optional(),
	url: z.string(),
	resource: z.string().nullable().optional(),
	event: z.string().nullable().optional(),
	status: z.string().nullable().optional(),
	signing_key: z.string().nullable().optional(),
	created_at: z.string().nullable().optional(),
});
export type BannerbearWebhookObj = z.infer<typeof BannerbearWebhookObj>;

export const BannerbearPdfJoin = z.object({
	uid: z.string(),
	status: z.string(),
	joined_pdf_url: z.string().nullable().optional(),
	self: z.string().nullable().optional(),
	created_at: z.string().nullable().optional(),
	metadata: z.string().nullable().optional(),
});
export type BannerbearPdfJoin = z.infer<typeof BannerbearPdfJoin>;

export const BannerbearWorkflow = z.object({
	uid: z.string(),
	name: z.string(),
	description: z.string().nullable().optional(),
	tags: z.array(z.string()).optional(),
	inputs: z.record(z.string(), z.unknown()).nullable().optional(),
	steps: z.array(z.record(z.string(), z.unknown())).nullable().optional(),
	ui_write_access: z.string().nullable().optional(),
	api_write_access: z.string().nullable().optional(),
	created_at: z.string().nullable().optional(),
});
export type BannerbearWorkflow = z.infer<typeof BannerbearWorkflow>;

export const BannerbearWorkflowRun = z.object({
	uid: z.string(),
	status: z.string(),
	workflow: z.string().nullable().optional(),
	progress: z.number().nullable().optional(),
	inputs: z.record(z.string(), z.unknown()).nullable().optional(),
	outputs: z.record(z.string(), z.unknown()).nullable().optional(),
	steps: z.array(z.record(z.string(), z.unknown())).nullable().optional(),
	error: z.string().nullable().optional(),
	self: z.string().nullable().optional(),
	created_at: z.string().nullable().optional(),
	completed_at: z.string().nullable().optional(),
});
export type BannerbearWorkflowRun = z.infer<typeof BannerbearWorkflowRun>;
