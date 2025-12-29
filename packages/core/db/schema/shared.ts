import * as z from 'zod';

/**
 * Shared fields that most Corsair models use.
 */
export const coreSchema = z.object({
	id: z.string(),
	createdAt: z.date().default(() => new Date()),
	updatedAt: z.date().default(() => new Date()),
});
