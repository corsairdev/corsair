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

export const BannerbearProject = z.object({
	uid: z.string(),
	name: z.string(),
	created_at: z.string().nullable().optional(),
	templates_count: z.number().nullable().optional(),
	api_key: z.string().nullable().optional(),
});
export type BannerbearProject = z.infer<typeof BannerbearProject>;

export const BannerbearTemplateModification = z.object({
	name: z.string(),
	type: z.string().nullable().optional(),
	text: z.string().nullable().optional(),
	color: z.string().nullable().optional(),
	image_url: z.string().nullable().optional(),
});
export type BannerbearTemplateModification = z.infer<
	typeof BannerbearTemplateModification
>;

export const BannerbearTemplate = z.object({
	uid: z.string(),
	name: z.string(),
	width: z.number().nullable().optional(),
	height: z.number().nullable().optional(),
	preview_url: z.string().nullable().optional(),
	created_at: z.string().nullable().optional(),
	updated_at: z.string().nullable().optional(),
	tags: z.array(z.string()).optional(),
	modifications: z.array(BannerbearTemplateModification).optional(),
	self: z.string().nullable().optional(),
});
export type BannerbearTemplate = z.infer<typeof BannerbearTemplate>;

export const BannerbearImage = z.object({
	uid: z.string(),
	status: z.string(),
	template: z.string().nullable().optional(),
	files: z
		.object({
			png: z.string().nullable().optional(),
			jpg: z.string().nullable().optional(),
			pdf: z.string().nullable().optional(),
			webp: z.string().nullable().optional(),
			avif: z.string().nullable().optional(),
		})
		.nullable()
		.optional(),
	metadata: z.string().nullable().optional(),
	self: z.string().nullable().optional(),
	created_at: z.string().nullable().optional(),
	completed_at: z.string().nullable().optional(),
});
export type BannerbearImage = z.infer<typeof BannerbearImage>;

export const BannerbearVideo = z.object({
	uid: z.string(),
	status: z.string(),
	video_url: z.string().nullable().optional(),
	preview_url: z.string().nullable().optional(),
	percent_rendered: z.number().nullable().optional(),
	self: z.string().nullable().optional(),
	created_at: z.string().nullable().optional(),
	completed_at: z.string().nullable().optional(),
});
export type BannerbearVideo = z.infer<typeof BannerbearVideo>;

export const BannerbearAnimatedGif = z.object({
	uid: z.string(),
	status: z.string(),
	image_url: z.string().nullable().optional(),
	self: z.string().nullable().optional(),
	created_at: z.string().nullable().optional(),
	completed_at: z.string().nullable().optional(),
});
export type BannerbearAnimatedGif = z.infer<typeof BannerbearAnimatedGif>;

export const BannerbearCollection = z.object({
	uid: z.string(),
	status: z.string(),
	template_set: z.string().nullable().optional(),
	images: z.array(z.string()).nullable().optional(),
	image_urls: z.record(z.string(), z.string().nullable()).nullable().optional(),
	self: z.string().nullable().optional(),
	created_at: z.string().nullable().optional(),
	completed_at: z.string().nullable().optional(),
});
export type BannerbearCollection = z.infer<typeof BannerbearCollection>;

export const BannerbearScreenshot = z.object({
	uid: z.string(),
	status: z.string(),
	screenshot_url: z.string().nullable().optional(),
	width: z.number().nullable().optional(),
	height: z.number().nullable().optional(),
	self: z.string().nullable().optional(),
	created_at: z.string().nullable().optional(),
	completed_at: z.string().nullable().optional(),
});
export type BannerbearScreenshot = z.infer<typeof BannerbearScreenshot>;

export const BannerbearTemplateSet = z.object({
	uid: z.string(),
	name: z.string(),
	templates: z.array(z.string()).nullable().optional(),
	available_modifications: z
		.array(BannerbearTemplateModification)
		.nullable()
		.optional(),
	created_at: z.string().nullable().optional(),
	self: z.string().nullable().optional(),
});
export type BannerbearTemplateSet = z.infer<typeof BannerbearTemplateSet>;

export const BannerbearVideoTemplate = z.object({
	uid: z.string(),
	name: z.string(),
	width: z.number().nullable().optional(),
	height: z.number().nullable().optional(),
	created_at: z.string().nullable().optional(),
	updated_at: z.string().nullable().optional(),
	self: z.string().nullable().optional(),
});
export type BannerbearVideoTemplate = z.infer<typeof BannerbearVideoTemplate>;

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

export const BannerbearWebhookObj = z.object({
	uid: z.string(),
	url: z.string(),
	event: z.string().nullable().optional(),
	active: z.boolean().nullable().optional(),
	created_at: z.string().nullable().optional(),
});
export type BannerbearWebhookObj = z.infer<typeof BannerbearWebhookObj>;

export const BannerbearSignedBase = z.object({
	base_url: z.string(),
	template: z.string().nullable().optional(),
	created_at: z.string().nullable().optional(),
});
export type BannerbearSignedBase = z.infer<typeof BannerbearSignedBase>;

export const BannerbearFont = z.object({
	name: z.string(),
	family: z.string().nullable().optional(),
	category: z.string().nullable().optional(),
});
export type BannerbearFont = z.infer<typeof BannerbearFont>;

export const BannerbearEffect = z.object({
	name: z.string(),
	slug: z.string().nullable().optional(),
});
export type BannerbearEffect = z.infer<typeof BannerbearEffect>;

export const BannerbearPdfJoin = z.object({
	uid: z.string(),
	status: z.string(),
	joined_pdf_url: z.string().nullable().optional(),
	self: z.string().nullable().optional(),
	created_at: z.string().nullable().optional(),
});
export type BannerbearPdfJoin = z.infer<typeof BannerbearPdfJoin>;
