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

/**
 * Cloud browser session (entity id = browser UUID).
 * Official: https://docs.browser-use.com/cloud/api-v4/browsers/get-browser-session
 */
export const BrowserUseBrowser = z.object({
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
	metadata: z.record(z.string(), z.string()).optional(),
});

export type BrowserUseBrowser = z.infer<typeof BrowserUseBrowser>;

/**
 * Agent run summary (entity id = run UUID).
 * Official: https://docs.browser-use.com/cloud/api-v4/runs/get-run
 */
export const BrowserUseRun = z.object({
	id: z.string(),
	status: RunStatus,
	model: z.string(),
	sessionId: z.string(),
	workspaceId: z.string().nullable().optional(),
	task: z.string().optional(),
	title: z.string().nullable().optional(),
	result: z.string().nullable().optional(),
	output: z.unknown().optional(),
	error: z.string().nullable().optional(),
	totalCostUsd: z.string().optional(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
});

export type BrowserUseRun = z.infer<typeof BrowserUseRun>;
