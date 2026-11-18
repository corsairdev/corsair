import { z } from 'zod';

/** One ParseHub project stored locally. `token` is the project id, not the API key. */
export const ParsehubProjectEntity = z.object({
	token: z.string().min(1),
	title: z.string().optional(),
});

export type ParsehubProjectEntity = z.infer<typeof ParsehubProjectEntity>;
