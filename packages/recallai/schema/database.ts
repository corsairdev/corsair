import { z } from 'zod';

export const RecallaiWorkspaceSchema = z.object({
	id: z.string(),
	name: z.string().optional(),
	region: z.string().optional(),
});

export type RecallaiWorkspace = z.infer<typeof RecallaiWorkspaceSchema>;
