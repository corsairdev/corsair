import { z } from 'zod';

const ApifyAccessLevel = z
	.enum(['PRIVATE', 'READ', 'WRITE', 'READ_WRITE'])
	.or(z.string());

export const ApifyActor = z
	.object({
		id: z.string(),
		userId: z.string().optional(),
		name: z.string().optional(),
		username: z.string().optional(),
		title: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		isPublic: z.boolean().optional(),
		isDeprecated: z.boolean().optional(),
		notice: z.string().nullable().optional(),
		createdAt: z.coerce.date().nullable().optional(),
		modifiedAt: z.coerce.date().nullable().optional(),
	})
	.loose();

export const ApifyActorRun = z
	.object({
		id: z.string(),
		actId: z.string().optional(),
		actorTaskId: z.string().nullable().optional(),
		status: z.string(),
		statusMessage: z.string().nullable().optional(),
		startedAt: z.coerce.date().nullable().optional(),
		finishedAt: z.coerce.date().nullable().optional(),
		buildId: z.string().nullable().optional(),
		buildNumber: z.string().nullable().optional(),
		defaultDatasetId: z.string().nullable().optional(),
		defaultKeyValueStoreId: z.string().nullable().optional(),
		defaultRequestQueueId: z.string().nullable().optional(),
		usageTotalUsd: z.number().nullable().optional(),
	})
	.loose();

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
		profile: z.record(z.string(), z.unknown()).optional(),
		createdAt: z.coerce.date().nullable().optional(),
	})
	.loose();

export type ApifyActor = z.infer<typeof ApifyActor>;
export type ApifyActorRun = z.infer<typeof ApifyActorRun>;
export type ApifyActorBuild = z.infer<typeof ApifyActorBuild>;
export type ApifyActorTask = z.infer<typeof ApifyActorTask>;
export type ApifyDataset = z.infer<typeof ApifyDataset>;
export type ApifyKeyValueStore = z.infer<typeof ApifyKeyValueStore>;
export type ApifyRequestQueue = z.infer<typeof ApifyRequestQueue>;
export type ApifySchedule = z.infer<typeof ApifySchedule>;
export type ApifyWebhook = z.infer<typeof ApifyWebhook>;
export type ApifyUser = z.infer<typeof ApifyUser>;
