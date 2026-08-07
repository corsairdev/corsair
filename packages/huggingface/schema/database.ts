import { z } from 'zod';

/** Soft entity shapes for optional persistence; Hub payloads remain open. */
export const HuggingFaceRepoRef = z.object({
	id: z.string(),
	// HF repo ids are namespace/name
	repoId: z.string().optional(),
	repoType: z.enum(['model', 'dataset', 'space']).optional(),
});
export type HuggingFaceRepoRef = z.infer<typeof HuggingFaceRepoRef>;
