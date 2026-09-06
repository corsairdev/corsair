import { z } from 'zod';

export const CarboneTemplate = z.object({
	id: z.string(),
	versionId: z.string().optional(),
	type: z.string().optional(),
	size: z.number().optional(),
	createdAt: z.number().optional(),
});
export type CarboneTemplate = z.infer<typeof CarboneTemplate>;
