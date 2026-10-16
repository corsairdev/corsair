import { z } from 'zod';

/**
 * Agent runs seen by the plugin. The run ID is the identity: the sync run,
 * the async acknowledgement, `getRun` polls and webhook deliveries all
 * refresh the same row instead of duplicating it.
 */
export const TinyFishAgentRun = z.object({
	status: z.string(),
	goal: z.string().nullable().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	startedAt: z.coerce.date().nullable().optional(),
	finishedAt: z.coerce.date().nullable().optional(),
	numOfSteps: z.number().int().nullable().optional(),
	// Stored straight from the provider run; only the docs examples fix keys.
	result: z.record(z.string(), z.unknown()).nullable().optional(),
	errorCode: z.string().nullable().optional(),
	errorMessage: z.string().nullable().optional(),
	profileId: z.string().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export type TinyFishAgentRun = z.infer<typeof TinyFishAgentRun>;
