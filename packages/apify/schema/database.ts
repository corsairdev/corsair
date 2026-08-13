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
	runId: z.string().optional(),
	status: z.string().optional(),
	actorId: z.string().optional(),
	actorName: z.string().optional(),
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

const ApifyAccessLevel = z
	.enum(['PRIVATE', 'READ', 'WRITE', 'READ_WRITE'])
	.or(z.string());

export const ApifyActorBuild = z
	.object({
		id: z.string(),
		actId: z.string().optional(),
		userId: z.string().optional(),
		status: z.string(),
		buildNumber: z.string().optional(),
		startedAt: z.coerce.date().nullable().optional(),
		finishedAt: z.coerce.date().nullable().optional(),
	})
	.loose();

export const ApifyActorTask = z
	.object({
		id: z.string(),
		actId: z.string().optional(),
		userId: z.string().optional(),
		name: z.string().optional(),
		title: z.string().nullable().optional(),
		createdAt: z.coerce.date().nullable().optional(),
		modifiedAt: z.coerce.date().nullable().optional(),
	})
	.loose();

export const ApifyDataset = z
	.object({
		id: z.string(),
		name: z.string().nullable().optional(),
		userId: z.string().optional(),
		itemCount: z.number().optional(),
		access: ApifyAccessLevel.optional(),
		createdAt: z.coerce.date().nullable().optional(),
		modifiedAt: z.coerce.date().nullable().optional(),
	})
	.loose();

export const ApifyKeyValueStore = z
	.object({
		id: z.string(),
		name: z.string().nullable().optional(),
		userId: z.string().optional(),
		recordCount: z.number().optional(),
		access: ApifyAccessLevel.optional(),
		createdAt: z.coerce.date().nullable().optional(),
		modifiedAt: z.coerce.date().nullable().optional(),
	})
	.loose();

export const ApifyRequestQueue = z
	.object({
		id: z.string(),
		name: z.string().nullable().optional(),
		userId: z.string().optional(),
		totalRequestCount: z.number().optional(),
		handledRequestCount: z.number().optional(),
		pendingRequestCount: z.number().optional(),
		access: ApifyAccessLevel.optional(),
		createdAt: z.coerce.date().nullable().optional(),
		modifiedAt: z.coerce.date().nullable().optional(),
	})
	.loose();

export const ApifySchedule = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		userId: z.string().optional(),
		isEnabled: z.boolean().optional(),
		cronExpression: z.string().optional(),
		timezone: z.string().optional(),
		createdAt: z.coerce.date().nullable().optional(),
		modifiedAt: z.coerce.date().nullable().optional(),
	})
	.loose();

export const ApifyWebhook = z
	.object({
		id: z.string(),
		userId: z.string().optional(),
		eventTypes: z.array(z.string()).optional(),
		requestUrl: z.string().optional(),
		isAdHoc: z.boolean().optional(),
		createdAt: z.coerce.date().nullable().optional(),
		modifiedAt: z.coerce.date().nullable().optional(),
	})
	.loose();

export const ApifyUser = z
	.object({
		id: z.string(),
		username: z.string().optional(),
		email: z.string().email().optional(),
		// Profile is free-form account metadata without a stable schema.
		profile: z.record(z.string(), z.unknown()).optional(),
		createdAt: z.coerce.date().nullable().optional(),
	})
	.loose();

export type ApifyActorBuild = z.infer<typeof ApifyActorBuild>;
export type ApifyActorTask = z.infer<typeof ApifyActorTask>;
export type ApifyDataset = z.infer<typeof ApifyDataset>;
export type ApifyKeyValueStore = z.infer<typeof ApifyKeyValueStore>;
export type ApifyRequestQueue = z.infer<typeof ApifyRequestQueue>;
export type ApifySchedule = z.infer<typeof ApifySchedule>;
export type ApifyWebhook = z.infer<typeof ApifyWebhook>;
export type ApifyUser = z.infer<typeof ApifyUser>;
