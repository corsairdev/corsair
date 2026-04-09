import { z } from 'zod';

export const TypeformForm = z.object({
	id: z.string(),
	title: z.string().optional(),
	type: z.string().optional(),
	created_at: z.string().optional(),
	last_updated_at: z.string().optional(),
	settings: z
		.object({
			is_public: z.boolean().optional(),
			language: z.string().optional(),
			progress_bar: z.string().optional(),
			show_progress_bar: z.boolean().optional(),
			show_typeform_branding: z.boolean().optional(),
			redirect_after_submit_url: z.string().optional(),
			autosave_progress: z.boolean().optional(),
			hide_navigation: z.boolean().optional(),
			are_uploads_public: z.boolean().optional(),
		})
		.passthrough()
		.optional(),
	workspace: z.object({ href: z.string().optional() }).passthrough().optional(),
	// _links varies by context
	_links: z.record(z.unknown()).optional(),
});

export type TypeformForm = z.infer<typeof TypeformForm>;

export const TypeformResponse = z.object({
	response_id: z.string(),
	form_id: z.string().optional(),
	submitted_at: z.string().optional(),
	landed_at: z.string().optional(),
	// Answers vary dynamically per field type; typed as array of records
	answers: z.array(z.record(z.unknown())).optional(),
	calculated: z
		.object({ score: z.number().optional() })
		.passthrough()
		.optional(),
	metadata: z
		.object({
			browser: z.string().optional(),
			referer: z.string().optional(),
			platform: z.string().optional(),
			network_id: z.string().optional(),
			user_agent: z.string().optional(),
		})
		.passthrough()
		.optional(),
	// hidden fields have dynamic string keys
	hidden: z.record(z.string()).optional(),
});

export type TypeformResponse = z.infer<typeof TypeformResponse>;

export const TypeformWorkspace = z.object({
	id: z.string(),
	name: z.string().optional(),
	href: z.string().optional(),
	shared: z.boolean().optional(),
	default: z.boolean().optional(),
	account_id: z.string().optional(),
	forms: z
		.object({
			href: z.string().optional(),
			count: z.number().optional(),
		})
		.passthrough()
		.optional(),
	members: z
		.array(
			z
				.object({
					name: z.string().optional(),
					role: z.string().optional(),
					email: z.string().optional(),
				})
				.passthrough(),
		)
		.optional(),
});

export type TypeformWorkspace = z.infer<typeof TypeformWorkspace>;

export const TypeformImage = z.object({
	id: z.string(),
	src: z.string().optional(),
	width: z.number().optional(),
	height: z.number().optional(),
	avg_color: z.string().optional(),
	file_name: z.string().optional(),
	has_alpha: z.boolean().optional(),
	media_type: z.string().optional(),
});

export type TypeformImage = z.infer<typeof TypeformImage>;

export const TypeformTheme = z.object({
	id: z.string(),
	name: z.string().optional(),
	font: z.string().optional(),
	visibility: z.string().optional(),
	rounded_corners: z.string().optional(),
	has_transparent_button: z.boolean().optional(),
	colors: z
		.object({
			answer: z.string().optional(),
			button: z.string().optional(),
			question: z.string().optional(),
			background: z.string().optional(),
		})
		.passthrough()
		.optional(),
	background: z
		.object({
			href: z.string().optional(),
			layout: z.string().optional(),
			brightness: z.number().optional(),
		})
		.passthrough()
		.optional(),
	fields: z
		.object({
			alignment: z.string().optional(),
			font_size: z.string().optional(),
		})
		.passthrough()
		.optional(),
	// screens has no fixed structure in Typeform's schema
	screens: z.record(z.unknown()).optional(),
});

export type TypeformTheme = z.infer<typeof TypeformTheme>;

export const TypeformWebhookConfig = z.object({
	id: z.string(),
	tag: z.string().optional(),
	url: z.string().optional(),
	enabled: z.boolean().optional(),
	form_id: z.string().optional(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
	verify_ssl: z.boolean().optional(),
	event_types: z.array(z.string()).optional(),
});

export type TypeformWebhookConfig = z.infer<typeof TypeformWebhookConfig>;
