import { z } from 'zod';
import { NeuronwriterImportEntity } from '../schema/database';

export const ImportInputSchema = z
	.object({
		query: z.string().regex(/^[A-Za-z0-9]+$/),
		html: z.string().min(1).optional(),
		url: z.string().url().optional(),
	})
	.superRefine((value, ctx) => {
		if (!value.html && !value.url) {
			ctx.addIssue({
				code: 'custom',
				message: 'html or url is required',
				path: ['html'],
			});
		}
	});
export type ImportInput = z.infer<typeof ImportInputSchema>;

export const ImportResponseSchema = z.object({
	imported: NeuronwriterImportEntity,
});
export type ImportResponse = z.infer<typeof ImportResponseSchema>;

export const EndpointInputSchemas = {
	'content.import': ImportInputSchema,
};

export const EndpointOutputSchemas = {
	'content.import': ImportResponseSchema,
};
