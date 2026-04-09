import { z } from 'zod';

/**
 * Zod shapes for persisted Apify REST API v2 **`data`** payloads (not the `{ error }` envelope).
 * Field lists follow https://docs.apify.com/api/v2 — use `.passthrough()` so new API fields are kept.
 *
 * Open-ended objects (stats, options, usage, etc.) are typed as `z.record(z.unknown())` or `z.unknown()`.
 */

const jsonObject = z.record(z.unknown());

/**
 * Actor `data` object — full detail: https://docs.apify.com/api/v2/act-get
 * List/store items (e.g. GET /v2/acts, GET /v2/store) may omit fields present on single-actor GET; only `id` is always required.
 */
export const ApifyActor = z
	.object({
		id: z.string(),
		userId: z.string().optional(),
		name: z.string().optional(),
		username: z.string().optional(),
		description: z.string().nullable().optional(),
		isPublic: z.boolean().optional(),
		createdAt: z.string().optional(),
		modifiedAt: z.string().optional(),
		stats: jsonObject.optional(),
		versions: z.array(z.unknown()).optional(),
		defaultRunOptions: jsonObject.optional(),
		exampleRunInput: jsonObject.optional(),
		isDeprecated: z.boolean().nullable().optional(),
		title: z.string().nullable().optional(),
		taggedBuilds: jsonObject.optional(),
		actorPermissionLevel: z.string().optional(),
		restartOnError: z.boolean().optional(),
		deploymentKey: z.string().optional(),
		pricingInfos: z.array(z.unknown()).optional(),
		actorStandby: jsonObject.optional(),
		readmeSummary: z.string().optional(),
	})
	.passthrough();

/** GET /v2/actor-builds/:buildId — https://docs.apify.com/api/v2/actor-build-get (list views may omit fields). */
export const ApifyActorBuild = z
	.object({
		id: z.string(),
		actId: z.string().optional(),
		userId: z.string().optional(),
		startedAt: z.string().optional(),
		finishedAt: z.string().nullable().optional(),
		status: z.string().optional(),
		meta: jsonObject.optional(),
		stats: jsonObject.optional(),
		options: jsonObject.optional(),
		usage: jsonObject.optional(),
		usageTotalUsd: z.number().nullable().optional(),
		usageUsd: jsonObject.optional(),
		buildNumber: z.string().optional(),
		inputSchema: z.string().nullable().optional(),
		readme: z.string().nullable().optional(),
		actorDefinition: jsonObject.nullable().optional(),
	})
	.passthrough();

/** GET /v2/actor-runs/:runId — https://docs.apify.com/api/v2/actor-run-get (list views may omit fields). */
export const ApifyActorRun = z
	.object({
		id: z.string(),
		actId: z.string().optional(),
		userId: z.string().optional(),
		actorTaskId: z.string().optional(),
		startedAt: z.string().optional(),
		finishedAt: z.string().nullable().optional(),
		status: z.string().optional(),
		statusMessage: z.string().optional(),
		isStatusMessageTerminal: z.boolean().optional(),
		meta: jsonObject.optional(),
		pricingInfo: jsonObject.optional(),
		stats: jsonObject.optional(),
		chargedEventCounts: jsonObject.optional(),
		options: jsonObject.optional(),
		buildId: z.string().optional(),
		exitCode: z.number().optional(),
		generalAccess: z.string().optional(),
		defaultKeyValueStoreId: z.string().optional(),
		defaultDatasetId: z.string().optional(),
		defaultRequestQueueId: z.string().optional(),
		storageIds: jsonObject.optional(),
		buildNumber: z.string().optional(),
		containerUrl: z.string().optional(),
		isContainerServerReady: z.boolean().optional(),
		gitBranchName: z.string().optional(),
		usage: jsonObject.optional(),
		usageTotalUsd: z.number().optional(),
		usageUsd: jsonObject.optional(),
		metamorphs: z.array(z.unknown()).optional(),
	})
	.passthrough();

/** GET /v2/actor-tasks/:actorTaskId — https://docs.apify.com/api/v2/actor-task-get */
export const ApifyActorTask = z
	.object({
		id: z.string(),
		userId: z.string().optional(),
		actId: z.string().optional(),
		name: z.string().optional(),
		username: z.string().nullable().optional(),
		createdAt: z.string().optional(),
		modifiedAt: z.string().optional(),
		removedAt: z.string().nullable().optional(),
		stats: jsonObject.optional(),
		options: jsonObject.optional(),
		input: z.unknown().optional(),
		title: z.string().nullable().optional(),
		actorStandby: jsonObject.optional(),
		standbyUrl: z.string().nullable().optional(),
	})
	.passthrough();

/**
 * GET /v2/acts/:actorId/versions/:versionNumber — https://docs.apify.com/api/v2/act-version-get
 * The payload may omit `id`; persistence uses `id` or `actorId`+`versionNumber` from path.
 */
export const ApifyActorVersion = z
	.object({
		id: z.string().optional(),
		actorId: z.string().optional(),
		versionNumber: z.string(),
		sourceType: z.union([z.string(), z.null()]).optional(),
		envVars: z.array(z.unknown()).nullable().optional(),
		applyEnvVarsToBuild: z.boolean().nullable().optional(),
		buildTag: z.string().optional(),
		sourceFiles: z.array(z.unknown()).optional(),
		gitRepoUrl: z.string().nullable().optional(),
		tarballUrl: z.string().nullable().optional(),
		gitHubGistUrl: z.string().nullable().optional(),
	})
	.passthrough()
	.refine((v) => Boolean(v.id ?? v.versionNumber), {
		message: 'Actor version must include id or versionNumber',
	});

/** GET /v2/datasets/:datasetId — https://docs.apify.com/api/v2/dataset-get */
export const ApifyDataset = z
	.object({
		id: z.string(),
		name: z.string().nullable().optional(),
		userId: z.string().optional(),
		createdAt: z.string().optional(),
		modifiedAt: z.string().optional(),
		accessedAt: z.string().optional(),
		itemCount: z.number().optional(),
		cleanItemCount: z.number().optional(),
		actId: z.string().nullable().optional(),
		actRunId: z.string().nullable().optional(),
		fields: z.array(z.string()).nullable().optional(),
		schema: jsonObject.nullable().optional(),
		consoleUrl: z.string().optional(),
		itemsPublicUrl: z.string().optional(),
		urlSigningSecretKey: z.string().nullable().optional(),
		generalAccess: z.string().optional(),
		stats: jsonObject.optional(),
	})
	.passthrough();

/**
 * GET /v2/key-value-stores/:storeId — Apify storage metadata (same family as dataset).
 * List/store items (e.g. GET /v2/key-value-stores, GET /v2/store) may omit fields present on single-store GET; only `id` is always required.
 */
export const ApifyKeyValueStore = z
	.object({
		id: z.string(),
		name: z.string().nullable().optional(),
		userId: z.string().optional(),
		createdAt: z.string().optional(),
		modifiedAt: z.string().optional(),
		accessedAt: z.string().optional(),
		stats: jsonObject.optional(),
		generalAccess: z.string().optional(),
	})
	.passthrough();

/** GET /v2/request-queues/:queueId — https://docs.apify.com/api/v2/request-queue-get */
export const ApifyRequestQueue = z
	.object({
		id: z.string(),
		name: z.string().nullable().optional(),
		userId: z.string().optional(),
		createdAt: z.string().optional(),
		modifiedAt: z.string().optional(),
		accessedAt: z.string().optional(),
		totalRequestCount: z.number().optional(),
		handledRequestCount: z.number().optional(),
		pendingRequestCount: z.number().optional(),
		hadMultipleClients: z.boolean().optional(),
		consoleUrl: z.string().optional(),
		stats: jsonObject.optional(),
		generalAccess: z.string().optional(),
	})
	.passthrough();

/** GET /v2/schedules/:scheduleId — https://docs.apify.com/api/v2/schedule-get */
export const ApifySchedule = z
	.object({
		id: z.string(),
		userId: z.string().optional(),
		name: z.string().optional(),
		cronExpression: z.string().optional(),
		timezone: z.string().optional(),
		isEnabled: z.boolean().optional(),
		isExclusive: z.boolean().optional(),
		createdAt: z.string().optional(),
		modifiedAt: z.string().optional(),
		nextRunAt: z.string().nullable().optional(),
		lastRunAt: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		title: z.string().nullable().optional(),
		actions: z.array(z.unknown()).optional(),
	})
	.passthrough();

/** GET /v2/webhooks/:webhookId — https://docs.apify.com/api/v2/webhook-get */
export const ApifyWebhook = z
	.object({
		id: z.string(),
		createdAt: z.string().optional(),
		modifiedAt: z.string().optional(),
		userId: z.string().optional(),
		isAdHoc: z.boolean().nullable().optional(),
		shouldInterpolateStrings: z.boolean().nullable().optional(),
		eventTypes: z.array(z.string()).optional(),
		condition: jsonObject.optional(),
		ignoreSslErrors: z.boolean().optional(),
		doNotRetry: z.boolean().nullable().optional(),
		requestUrl: z.string().optional(),
		payloadTemplate: z.string().nullable().optional(),
		headersTemplate: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		lastDispatch: jsonObject.nullable().optional(),
		stats: jsonObject.optional(),
	})
	.passthrough();

/** GET /v2/webhook-dispatches/:dispatchId — https://docs.apify.com/api/v2/webhook-dispatch-get */
export const ApifyWebhookDispatch = z
	.object({
		id: z.string(),
		userId: z.string().optional(),
		webhookId: z.string().optional(),
		createdAt: z.string().optional(),
		status: z.string().optional(),
		eventType: z.string().optional(),
		eventData: z.unknown().nullable().optional(),
		calls: z.array(z.unknown()).optional(),
	})
	.passthrough();

/**
 * GET /v2/users/me, GET /v2/users/:userId — https://docs.apify.com/api/v2/users-me-get
 * Some fields are omitted when called from an Actor run.
 */
export const ApifyUser = z
	.object({
		id: z.string().optional(),
		username: z.string().optional(),
		profile: jsonObject.optional(),
		email: z.string().optional(),
		proxy: jsonObject.optional(),
		plan: jsonObject.optional(),
		effectivePlatformFeatures: jsonObject.optional(),
		createdAt: z.string().optional(),
		isPaying: z.boolean().optional(),
	})
	.passthrough()
	.refine((v) => Boolean(v.id ?? v.username), {
		message: 'Apify user must include id or username',
	});

export type ApifyActor = z.infer<typeof ApifyActor>;
export type ApifyActorBuild = z.infer<typeof ApifyActorBuild>;
export type ApifyActorRun = z.infer<typeof ApifyActorRun>;
export type ApifyActorTask = z.infer<typeof ApifyActorTask>;
export type ApifyActorVersion = z.infer<typeof ApifyActorVersion>;
export type ApifyDataset = z.infer<typeof ApifyDataset>;
export type ApifyKeyValueStore = z.infer<typeof ApifyKeyValueStore>;
export type ApifyRequestQueue = z.infer<typeof ApifyRequestQueue>;
export type ApifySchedule = z.infer<typeof ApifySchedule>;
export type ApifyWebhook = z.infer<typeof ApifyWebhook>;
export type ApifyWebhookDispatch = z.infer<typeof ApifyWebhookDispatch>;
export type ApifyUser = z.infer<typeof ApifyUser>;
