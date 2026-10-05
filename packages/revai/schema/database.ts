import { z } from 'zod';

export const RevAIJob = z.object({
	id: z.string(),
	status: z.string().optional(),
	created_on: z.coerce.date().nullable().optional(),
	completed_on: z.coerce.date().nullable().optional(),
	metadata: z.string().nullable().optional(),
	language: z.string().nullable().optional(),
	failure: z.string().nullable().optional(),
	duration_seconds: z.number().nullable().optional(),
});

export type RevAIJob = z.infer<typeof RevAIJob>;
