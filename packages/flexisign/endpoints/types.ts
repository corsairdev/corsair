import { z } from 'zod';

const ListTemplatesInputSchema = z.object({
	id: z.string(),
});

export type ListTemplatesInput = z.infer<typeof ListTemplatesInputSchema>;

const ListTemplatesResponseSchema = z.object({
	id: z.string(),
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
