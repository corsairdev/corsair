import { z } from 'zod';

/** One Draftable comparison stored locally. `identifier` is the provider id. */
export const DraftableComparisonEntity = z.object({
	identifier: z.string().min(1),
	ready: z.boolean().optional(),
	creation_time: z.string().optional(),
	public: z.boolean().optional(),
});

export type DraftableComparisonEntity = z.infer<
	typeof DraftableComparisonEntity
>;
