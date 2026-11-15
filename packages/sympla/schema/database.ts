import { z } from 'zod';

/** One Sympla event stored locally. `id` is the provider event id. */
export const SymplaEventEntity = z.object({
	id: z.string().min(1),
	name: z.string().optional(),
});

export type SymplaEventEntity = z.infer<typeof SymplaEventEntity>;
