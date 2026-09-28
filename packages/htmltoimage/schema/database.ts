import { z } from 'zod';

/**
 * GET /api/me
 * Official: https://html2img.com/docs/account/
 * OpenAPI: Account
 */
export const HtmlToImageAccount = z.object({
	email: z.string().email(),
	plan: z.string().nullable().optional(),
	plan_name: z.string().nullable().optional(),
	active: z.boolean(),
	free_plan: z.boolean(),
	credits_remaining: z.number().int().min(0),
	credits_reset_at: z.string().nullable().optional(),
});

export type HtmlToImageAccount = z.infer<typeof HtmlToImageAccount>;

/**
 * POST /api/html and POST /api/screenshot success body
 * Official: https://html2img.com/docs/getting-started/
 * OpenAPI: RenderResult
 */
export const HtmlToImageRender = z.object({
	success: z.literal(true),
	id: z.string(),
	url: z.string().url().optional(),
	credits_remaining: z.number().int().min(0).optional(),
	expires_at: z.string().nullable().optional(),
	status: z.literal('processing').optional(),
	message: z.string().optional(),
});

export type HtmlToImageRender = z.infer<typeof HtmlToImageRender>;
