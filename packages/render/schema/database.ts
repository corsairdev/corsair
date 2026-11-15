import { z } from 'zod';

export const RenderOwnerSchema = z.object({
	id: z.string(),
	// 'user' or 'team' today; kept open so a new owner kind still saves.
	type: z.string().optional(),
	name: z.string().optional(),
	email: z.string().optional(),
});

export type RenderOwner = z.infer<typeof RenderOwnerSchema>;
