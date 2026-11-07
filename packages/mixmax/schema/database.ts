import { z } from 'zod';

// Mixmax does not have persistent database entities in Part 1.
// Entities can be added as the integration expands (e.g. messages, sequences).
export const MixmaxMessage = z.object({
	id: z.string(),
	subject: z.string().optional(),
	body: z.string().optional(),
	state: z.string().optional(),
	created: z.coerce.date().nullable().optional(),
});

export const MixmaxSequence = z.object({
	id: z.string(),
	name: z.string().optional(),
	state: z.string().optional(),
	created: z.coerce.date().nullable().optional(),
});

export type MixmaxMessage = z.infer<typeof MixmaxMessage>;
export type MixmaxSequence = z.infer<typeof MixmaxSequence>;
