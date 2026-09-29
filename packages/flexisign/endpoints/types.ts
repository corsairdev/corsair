import { z } from 'zod';

const ListTemplatesInputSchema = z
	.object({
		page: z.number().int().min(1).optional(),
		limit: z.number().int().min(1).max(100).optional(),
	})
	.optional();

export type ListTemplatesInput = z.infer<typeof ListTemplatesInputSchema>;

const TemplateSchema = z.object({
	_id: z.string(),
	name: z.string(),
});

const ListTemplatesResponseSchema = z.object({
	status: z.string(),
	code: z.number(),
	data: z.object({
		list: z.array(TemplateSchema),
		meta: z.object({
			total: z.number(),
			limit: z.number(),
			page: z.number(),
			pages: z.number(),
			previousPage: z.number().nullable(),
			nextPage: z.number().nullable(),
		}),
	}),
	message: z.string(),
});

export type ListTemplatesResponse = z.infer<typeof ListTemplatesResponseSchema>;

export type FlexisignEndpointInputs = {
	ListTemplates: ListTemplatesInput;
};

export type FlexisignEndpointOutputs = {
	ListTemplates: ListTemplatesResponse;
};

export const FlexisignEndpointInputSchemas = {
	ListTemplates: ListTemplatesInputSchema,
} as const;

export const FlexisignEndpointOutputSchemas = {
	ListTemplates: ListTemplatesResponseSchema,
} as const;
