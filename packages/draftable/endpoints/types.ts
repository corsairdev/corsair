import { z } from 'zod';

export const ListComparisonsInputSchema = z.object({
	limit: z.number().int().positive().optional().describe('Page size.'),
	offset: z
		.number()
		.int()
		.nonnegative()
		.optional()
		.describe('Number of comparisons to skip.'),
});

export const ListComparisonsResponseSchema = z
	.object({
		count: z.number(),
		results: z.array(z.object({}).passthrough()),
	})
	.passthrough();

export type ListComparisonsInput = z.infer<typeof ListComparisonsInputSchema>;
export type ListComparisonsResponse = z.infer<
	typeof ListComparisonsResponseSchema
>;

export const DraftableEndpointInputSchemas = {
	listComparisons: ListComparisonsInputSchema,
} as const;

export const DraftableEndpointOutputSchemas = {
	listComparisons: ListComparisonsResponseSchema,
} as const;
