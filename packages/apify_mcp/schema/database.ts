import { z } from 'zod';

export const ApifyMcpActor = z.object({
	id: z.string().optional(),
	name: z.string().optional(),
	username: z.string().optional(),
	title: z.string().optional(),
	description: z.string().optional(),
});

export const ApifyMcpActorRun = z.object({
	id: z.string().optional(),
	status: z.string().optional(),
	actorId: z.string().optional(),
	datasetId: z.string().optional(),
	startedAt: z.coerce.date().nullable().optional(),
	finishedAt: z.coerce.date().nullable().optional(),
});

export const ApifyMcpActorOutput = z.object({
	datasetId: z.string(),
	// Output payloads vary by Actor and dataset schema.
	output: z.unknown(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export type ApifyMcpActor = z.infer<typeof ApifyMcpActor>;
export type ApifyMcpActorRun = z.infer<typeof ApifyMcpActorRun>;
export type ApifyMcpActorOutput = z.infer<typeof ApifyMcpActorOutput>;
