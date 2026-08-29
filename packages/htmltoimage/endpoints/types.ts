import { z } from 'zod';

const HTML2IMG_CDN_HOST = 'i.html2img.com';

function isHtml2imgCdnUrl(url: string): boolean {
	try {
		const parsed = new URL(url);
		return (
			parsed.protocol === 'https:' && parsed.hostname === HTML2IMG_CDN_HOST
		);
	} catch {
		return false;
	}
}

const CheckUsageInputSchema = z.object({});

const CheckUsageResponseSchema = z.object({
	email: z.string().email().optional(),
	plan: z.string(),
	plan_name: z.string().optional(),
	active: z.boolean().optional(),
	free_plan: z.boolean().optional(),
	credits_remaining: z.number().int(),
	credits_reset_at: z.string().nullable().optional(),
});

const ConvertToImageInputSchema = z.object({
	html: z.string().min(1),
	css: z.string().optional(),
	width: z.number().int().min(1).max(5000).optional(),
	height: z.number().int().min(1).max(5000).optional(),
	fullpage: z.boolean().optional(),
	dpi: z.number().int().min(1).max(4).optional(),
	format: z.enum(['png', 'pdf']).optional(),
	scale_to_fit: z.boolean().optional(),
	ms_delay: z.number().int().min(1).max(5000).optional(),
	webhook_url: z.string().url().optional(),
	wait_for_selector: z.string().optional(),
});

const ConvertToImageResponseSchema = z.object({
	success: z.literal(true),
	id: z.string(),
	url: z.string().url().optional(),
	expires_at: z.string().nullable().optional(),
	credits_remaining: z.number().int().optional(),
	status: z.literal('processing').optional(),
	message: z.string().optional(),
});

const GetImageInputSchema = z.object({
	url: z.string().url().refine(isHtml2imgCdnUrl),
});

const GetImageResponseSchema = z.object({
	url: z.string().url().refine(isHtml2imgCdnUrl),
});

export type CheckUsageInput = z.infer<typeof CheckUsageInputSchema>;
export type CheckUsageResponse = z.infer<typeof CheckUsageResponseSchema>;

export type ConvertToImageInput = z.infer<typeof ConvertToImageInputSchema>;
export type ConvertToImageResponse = z.infer<
	typeof ConvertToImageResponseSchema
>;

export type GetImageInput = z.infer<typeof GetImageInputSchema>;
export type GetImageResponse = z.infer<typeof GetImageResponseSchema>;

export type HtmlToImageEndpointInputs = {
	checkUsage: CheckUsageInput;
	convertToImage: ConvertToImageInput;
	getImage: GetImageInput;
};

export type HtmlToImageEndpointOutputs = {
	checkUsage: CheckUsageResponse;
	convertToImage: ConvertToImageResponse;
	getImage: GetImageResponse;
};

export const HtmlToImageEndpointInputSchemas = {
	checkUsage: CheckUsageInputSchema,
	convertToImage: ConvertToImageInputSchema,
	getImage: GetImageInputSchema,
} as const;

export const HtmlToImageEndpointOutputSchemas = {
	checkUsage: CheckUsageResponseSchema,
	convertToImage: ConvertToImageResponseSchema,
	getImage: GetImageResponseSchema,
} as const;
