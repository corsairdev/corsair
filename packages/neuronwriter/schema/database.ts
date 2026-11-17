import { z } from 'zod';

/** Imported query. The HTML and source URL are not stored. */
export const NeuronwriterImportEntity = z.object({
	id: z.string().min(1),
	status: z.string().optional(),
	contentScore: z.number().optional(),
});

export type NeuronwriterImportEntity = z.infer<typeof NeuronwriterImportEntity>;
