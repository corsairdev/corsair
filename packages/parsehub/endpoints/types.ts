import { z } from 'zod';

export const ListProjectsInputSchema = z.object({
	offset: z
		.number()
		.int()
		.nonnegative()
		.optional()
		.describe('Zero-based start index. Default 0.'),
	limit: z
		.number()
		.int()
		.min(1)
		.max(20)
		.optional()
		.describe('Page size, 1 to 20. Default 20.'),
	include_options: z
		.boolean()
		.optional()
		.describe('Include options_json and related fields.'),
});

export const ListProjectsResponseSchema = z
	.object({
		projects: z.array(z.object({}).passthrough()),
		total_projects: z.number().optional(),
	})
	.passthrough();

export type ListProjectsInput = z.infer<typeof ListProjectsInputSchema>;
export type ListProjectsResponse = z.infer<typeof ListProjectsResponseSchema>;

export const ParsehubEndpointInputSchemas = {
	listProjects: ListProjectsInputSchema,
} as const;

export const ParsehubEndpointOutputSchemas = {
	listProjects: ListProjectsResponseSchema,
} as const;
