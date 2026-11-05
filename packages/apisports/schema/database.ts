import { z } from 'zod';

export const ApiSportsQueryRecord = z.object({
	sport: z.string().optional(),
	path: z.string().optional(),
	queriedAt: z.coerce.date().nullable().optional(),
});

export type ApiSportsQueryRecord = z.infer<typeof ApiSportsQueryRecord>;
