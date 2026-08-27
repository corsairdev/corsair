import { z } from 'zod';

const CheckUsageInputSchema = z.object({
	return_defaults_on_error: z.boolean().optional().default(true),
});

const CheckUsageResponseSchema = z.object({
	hourly: z.number().optional(),
	daily: z.number().optional(),
	monthly: z.number().optional(),
	credits_remaining: z.number().optional(),
	plan: z.string().optional(),
	plan_name: z.string().optional(),
});

const ConvertToImageInputSchema = z.object({
	html: z.string(),
	css: z.string().optional(),
	width: z.number().int().min(1).optional(),
	height: z.number().int().min(1).optional(),
	fullpage: z.boolean().optional(),
	dpi: z.number().int().min(1).optional(),
});

const ConvertToImageResponseSchema = z.object({
	success: z.boolean().optional(),
	id: z.string().nullable().optional(),
	url: z.string().url().nullable().optional(),
	expires_at: z.string().optional(),
	credits_remaining: z.number().optional(),
});

const GetImageInputSchema = z.object({
	url: z.string().url(),
});

const GetImageResponseSchema = z.object({
	url: z.string().url(),
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
