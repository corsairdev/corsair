import { z } from 'zod';

const BrowserStatus = z.enum(['active', 'stopped']);

export const RunStatus = z.enum([
	'queued',
	'dispatching',
	'running',
	'completed',
	'failed',
	'cancelled',
]);

const Extension = z
	.object({
		id: z.string(),
		runtimeId: z.string(),
		version: z.string(),
	})
	.loose();

/**
 * Cloud browser session. Extra provider fields stay on the object.
 * Official: https://docs.browser-use.com/cloud/openapi/v4.json BrowserSessionView
 */
export const BrowserUseBrowser = z
	.object({
		id: z.string(),
		status: BrowserStatus,
		liveUrl: z.string().nullable().optional(),
		cdpUrl: z.string().nullable().optional(),
		timeoutAt: z.string(),
		startedAt: z.string(),
		finishedAt: z.string().nullable().optional(),
		proxyUsedMb: z.string().optional(),
		proxyCost: z.string().optional(),
		browserCost: z.string().optional(),
		agentSessionId: z.string().nullable().optional(),
		recordingUrl: z.string().nullable().optional(),
		recordingAvailable: z.boolean().optional(),
		metadata: z.record(z.string(), z.string()).optional(),
		extensions: z.array(Extension).optional(),
	})
	.loose();

export type BrowserUseBrowser = z.infer<typeof BrowserUseBrowser>;

/**
 * Stored run. Fields stay optional so a create acknowledgement or a status
 * poll can merge without pretending to be a full run summary.
 */
export const BrowserUseRun = z
	.object({
		id: z.string(),
		status: RunStatus,
		task: z.string().optional(),
		title: z.string().nullable().optional(),
		model: z.string().optional(),
		sessionId: z.string().optional(),
		workspaceId: z.string().nullable().optional(),
		result: z.string().nullable().optional(),
		// Shape is decided by the caller's outputSchema.
		output: z.unknown().nullable().optional(),
		error: z.string().nullable().optional(),
		contextLimit: z.number().int().optional(),
		totalInputTokens: z.number().int().optional(),
		totalOutputTokens: z.number().int().optional(),
		totalCostUsd: z.string().optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
	})
	.loose();

export type BrowserUseRun = z.infer<typeof BrowserUseRun>;

/** Full GET /runs/{id} body. Required fields match RunSummary. */
export const RunSummary = z
	.object({
		id: z.string(),
		task: z.string(),
		title: z.string().nullable(),
		model: z.string(),
		contextLimit: z.number().int(),
		status: RunStatus,
		result: z.string().nullable(),
		// Shape is decided by the caller's outputSchema.
		output: z.unknown().nullable().optional(),
		error: z.string().nullable(),
		sessionId: z.string(),
		workspaceId: z.string().nullable(),
		// Judge payload is an open object until the verdict lands, or null.
		judgement: z.looseObject({}).nullable().optional(),
		totalInputTokens: z.number().int(),
		totalOutputTokens: z.number().int(),
		totalCostUsd: z.string(),
		createdAt: z.string(),
		updatedAt: z.string(),
	})
	.loose();

export const RunCreated = z
	.object({
		id: z.string(),
		status: RunStatus,
		model: z.string(),
		sessionId: z.string(),
		workspaceId: z.string(),
		eventsUrl: z.string(),
		missingFileIds: z.array(z.string()).optional(),
		skippedVaultItems: z.array(z.string()).optional(),
	})
	.loose();

export const RunStatusBody = z
	.object({
		status: RunStatus,
	})
	.loose();
