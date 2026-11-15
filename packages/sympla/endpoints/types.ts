import { z } from 'zod';

export const ListEventsInputSchema = z.object({
	page: z.number().int().positive().optional().describe('Page number.'),
	page_size: z.number().int().positive().optional().describe('Page size.'),
	published: z
		.boolean()
		.optional()
		.describe('Limit the list to published events.'),
	from: z.string().min(1).optional().describe('Start date filter.'),
	to: z.string().min(1).optional().describe('End date filter.'),
	field_sort: z
		.string()
		.min(1)
		.optional()
		.describe('Field used to sort the list.'),
	sort: z.enum(['ASC', 'DESC']).optional().describe('ASC or DESC.'),
});

export const ListEventsResponseSchema = z
	.object({
		data: z.array(z.object({}).passthrough()),
		pagination: z.object({}).passthrough(),
	})
	.passthrough();

export type ListEventsInput = z.infer<typeof ListEventsInputSchema>;
export type ListEventsResponse = z.infer<typeof ListEventsResponseSchema>;

export const SymplaEndpointInputSchemas = {
	listEvents: ListEventsInputSchema,
} as const;

export const SymplaEndpointOutputSchemas = {
	listEvents: ListEventsResponseSchema,
} as const;
