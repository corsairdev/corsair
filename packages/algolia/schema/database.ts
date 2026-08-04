import { z } from 'zod';

export const AlgoliaIndex = z.object({
	name: z.string().optional(),
	entries: z.number().optional(),
	dataSize: z.number().optional(),
	fileSize: z.number().optional(),
	lastBuildTimeS: z.number().optional(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
	pendingTask: z.boolean().optional(),
});

export const AlgoliaRecord = z
	.object({
		objectID: z.union([z.string(), z.number()]).optional(),
	})
	.catchall(z.unknown());

export const AlgoliaTask = z.object({
	taskID: z.union([z.string(), z.number()]).optional(),
	status: z.string().optional(),
	index: z.string().optional(),
	updatedAt: z.string().optional(),
});

export type AlgoliaIndex = z.infer<typeof AlgoliaIndex>;
export type AlgoliaRecord = z.infer<typeof AlgoliaRecord>;
export type AlgoliaTask = z.infer<typeof AlgoliaTask>;
