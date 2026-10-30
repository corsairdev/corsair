import { z } from 'zod';
import { HtmlToImageAccount, HtmlToImageRender } from '../schema/database';

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

function isPublicHttpUrl(url: string): boolean {
	try {
		const protocol = new URL(url).protocol;
		return protocol === 'http:' || protocol === 'https:';
	} catch {
		return false;
	}
}

const CheckUsageInputSchema = z.object({});

const CheckUsageResponseSchema = HtmlToImageAccount;

const RenderOptionsSchema = z.object({
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
	html: z.string().min(1).optional(),
	url: z.string().url().refine(isPublicHttpUrl).optional(),
	selector: z.string().max(255).optional(),
});

const ConvertToImageInputSchema = RenderOptionsSchema.superRefine(
	(value, ctx) => {
		if (Boolean(value.html) === Boolean(value.url)) {
			ctx.addIssue({
				code: 'custom',
				message: 'Provide exactly one of html or url',
			});
		}
		if (value.selector !== undefined && !value.url) {
			ctx.addIssue({
				code: 'custom',
				path: ['selector'],
				message: 'selector is only valid with url',
			});
		}
		if (value.selector !== undefined && value.format === 'pdf') {
			ctx.addIssue({
				code: 'custom',
				path: ['selector'],
				message: 'selector is ignored for pdf output',
			});
		}
	},
);

const ConvertToImageResponseSchema = HtmlToImageRender;

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
