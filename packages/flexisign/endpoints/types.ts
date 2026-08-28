import { z } from 'zod';

const ListTemplatesInputSchema = z.object({
	page: z.number().optional(),
	limit: z.number().optional(),
});

export type ListTemplatesInput = z.infer<typeof ListTemplatesInputSchema>;

const TemplateSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().optional(),
	createdAt: z.string().optional(),
});

const ListTemplatesResponseSchema = z.object({
	templates: z.array(TemplateSchema),
	total: z.number().optional(),
});

export type ListTemplatesResponse = z.infer<typeof ListTemplatesResponseSchema>;

export type FlexisignEndpointInputs = {
	listTemplates: ListTemplatesInput;
};

export type FlexisignEndpointOutputs = {
	listTemplates: ListTemplatesResponse;
};

export const FlexisignEndpointInputSchemas = {
	listTemplates: ListTemplatesInputSchema,
} as const;

export const FlexisignEndpointOutputSchemas = {
	listTemplates: ListTemplatesResponseSchema,
} as const;
