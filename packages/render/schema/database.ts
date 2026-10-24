import { z } from 'zod';

export const RenderOwnerSchema = z.object({
	id: z.string(),
	type: z.enum(['user', 'team']).optional(),
	name: z.string().optional(),
});

export type RenderOwner = z.infer<typeof RenderOwnerSchema>;
