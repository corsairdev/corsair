import { z } from 'zod';

/** One Sensibo pod stored locally. `id` is the pod id. */
export const SensiboPodEntity = z.object({
	id: z.string().min(1),
	roomName: z.string().optional(),
});

export type SensiboPodEntity = z.infer<typeof SensiboPodEntity>;
