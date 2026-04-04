import { z } from 'zod';

export const PostHogEvent = z.object({
	id: z.string(),
	event: z.string(),
	distinct_id: z.string(),
	timestamp: z.string().optional(),
	uuid: z.string().optional(),
	properties: z.record(z.string(), z.any()).optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export type PostHogEvent = z.infer<typeof PostHogEvent>;
