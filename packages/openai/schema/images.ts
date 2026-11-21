import { z } from 'zod';
import { openaiFileInput } from './file-input';

const ImageObjectSchema = z.object({
	url: z.string().optional(),
	b64_json: z.string().optional(),
	revised_prompt: z.string().optional(),
});
export type ImageObject = z.infer<typeof ImageObjectSchema>;

export const ImagesResponseSchema = z.object({
	created: z.number(),
	data: z.array(ImageObjectSchema),
});
export type ImagesResponse = z.infer<typeof ImagesResponseSchema>;

export const ImagesCreateInputSchema = z.object({
	model: z.string().optional(),
	prompt: z.string(),
	n: z.number().optional(),
	size: z.string().optional(),
	quality: z.string().optional(),
	style: z.string().optional(),
	responseFormat: z.enum(['url', 'b64_json']).optional(),
	background: z.string().optional(),
	user: z.string().optional(),
});
export type ImagesCreateInput = z.infer<typeof ImagesCreateInputSchema>;

export const ImagesCreateResponseSchema = ImagesResponseSchema;
export type ImagesCreateResponse = z.infer<typeof ImagesCreateResponseSchema>;

export const ImagesCreateEditInputSchema = z
	.object({
		image: openaiFileInput('The image to edit, under 50 MB'),
		imageFileName: z.string(),
		mask: openaiFileInput('A PNG mask under 4 MB').optional(),
		maskFileName: z.string().optional(),
		prompt: z.string(),
		model: z.string().optional(),
		n: z.number().optional(),
		size: z.string().optional(),
		responseFormat: z.enum(['url', 'b64_json']).optional(),
	})
	.superRefine((value, ctx) => {
		// mask and maskFileName must both be set together: the endpoint only
		// attaches the mask file when both are present, so a half-filled pair
		// would silently drop the mask (same class of bug as containers/videos).
		const hasMask = value.mask !== undefined;
		const hasMaskName = value.maskFileName !== undefined;
		if (hasMask !== hasMaskName) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'mask and maskFileName must both be provided or both omitted',
				path: hasMask ? ['maskFileName'] : ['mask'],
			});
		}
	});
export type ImagesCreateEditInput = z.infer<typeof ImagesCreateEditInputSchema>;

export const ImagesCreateEditResponseSchema = ImagesResponseSchema;
export type ImagesCreateEditResponse = z.infer<
	typeof ImagesCreateEditResponseSchema
>;

export const ImagesCreateVariationInputSchema = z.object({
	image: openaiFileInput('A square PNG under 4 MB'),
	imageFileName: z.string(),
	model: z.string().optional(),
	n: z.number().optional(),
	size: z.string().optional(),
	responseFormat: z.enum(['url', 'b64_json']).optional(),
});
export type ImagesCreateVariationInput = z.infer<
	typeof ImagesCreateVariationInputSchema
>;

export const ImagesCreateVariationResponseSchema = ImagesResponseSchema;
export type ImagesCreateVariationResponse = z.infer<
	typeof ImagesCreateVariationResponseSchema
>;
