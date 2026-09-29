import { z } from 'zod';

export const ClassmarkerResult = z.object({
	id: z.string(),
	external_id: z.string(),
	created_at: z.coerce.date().nullable().optional(),
});

export type ClassmarkerResult = z.infer<typeof ClassmarkerResult>;
