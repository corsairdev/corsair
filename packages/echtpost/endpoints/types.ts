import { z } from 'zod';
import { EchtpostTemplateEntity } from '../schema/database';

export const ListTemplatesInputSchema = z.object({
	page: z.number().int().min(1).optional(),
	per_page: z.number().int().min(1).max(200).optional(),
});

export const ListTemplatesResponseSchema = z.object({
	templates: z.array(EchtpostTemplateEntity),
});

export type ListTemplatesInput = z.infer<typeof ListTemplatesInputSchema>;
export type ListTemplatesResponse = z.infer<typeof ListTemplatesResponseSchema>;

export const EchtpostEndpointInputSchemas = {
	'templates.list': ListTemplatesInputSchema,
};

export const EchtpostEndpointOutputSchemas = {
	'templates.list': ListTemplatesResponseSchema,
};
