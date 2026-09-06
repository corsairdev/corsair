import { z } from 'zod';

export const ListDesignsInputSchema = z.object({
	page: z.number().int().min(1).optional(),
	limit: z.number().int().min(1).max(100).optional(),
});

export type ListDesignsInput = z.infer<typeof ListDesignsInputSchema>;

export const DesignSummarySchema = z
	.object({
		_id: z.string(),
		name: z.string(),
		updatedAt: z.string(),
	})
	.loose();

export type DesignSummary = z.infer<typeof DesignSummarySchema>;

export const PaginatedDesignsSchema = z
	.object({
		docs: z.array(DesignSummarySchema),
		page: z.number().int(),
		totalPages: z.number().int(),
		hasNextPage: z.boolean(),
	})
	.loose();

export type PaginatedDesigns = z.infer<typeof PaginatedDesignsSchema>;

export type ImejisioEndpointInputs = {
	listDesigns: ListDesignsInput;
};

export type ImejisioEndpointOutputs = {
	listDesigns: PaginatedDesigns;
};

export const ImejisioEndpointInputSchemas = {
	listDesigns: ListDesignsInputSchema,
} as const;

export const ImejisioEndpointOutputSchemas = {
	listDesigns: PaginatedDesignsSchema,
} as const;
