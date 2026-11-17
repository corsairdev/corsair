import { z } from 'zod';

/** Font on a template. https://api.echtpost.de/v2/openapi.json Font */
export const EchtpostFont = z.object({
	family: z.string().optional(),
	size: z.number().optional(),
	color: z.string().optional(),
	line_height: z.number().optional(),
});

/** Saved template. https://api.echtpost.de/v2/openapi.json Template */
export const EchtpostTemplateEntity = z.object({
	id: z.string().min(1),
	motive_id: z.number().optional(),
	content: z.string().optional(),
	content_ps: z.string().optional(),
	content_vertical: z.string().optional(),
	font: EchtpostFont.optional(),
	qr_code_url: z.string().optional(),
	preview_url: z.string().optional(),
	source: z.string().optional(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
});

export type EchtpostTemplateEntity = z.infer<typeof EchtpostTemplateEntity>;
