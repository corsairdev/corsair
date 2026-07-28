import { hubApiGet, hubApiPost } from './client/http';
import type { HubConfig } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// Workflow runs (SDK client)
//
// Read a tenant's run history and act on a run (approve / deny / cancel) over the
// Hub's `/runs` endpoints. Auth is the project API key (Bearer); the tenant is
// sent in the query, matching the threads client.
// ─────────────────────────────────────────────────────────────────────────────

export type WorkflowRunStep = {
	stepId: string;
	name: string;
	seq: number;
	status: 'running' | 'completed' | 'failed';
	output?: unknown;
	error?: string;
};

export type WorkflowRun = {
	id: string;
	workflowId: string;
	status: string;
	triggerType: string;
	error: string | null;
	attempt: number;
	createdAt: string;
	startedAt: string | null;
	finishedAt: string | null;
	steps: WorkflowRunStep[];
};

function asRecord(payload: unknown): Record<string, unknown> {
	return payload && typeof payload === 'object'
		? (payload as Record<string, unknown>)
		: {};
}

export async function listRuns(
	hub: HubConfig,
	input: { tenantId: string; limit?: number },
): Promise<WorkflowRun[]> {
	const query = new URLSearchParams({ tenantId: input.tenantId });
	if (input.limit != null) query.set('limit', String(input.limit));
	return hubApiGet<WorkflowRun[]>({
		hub,
		path: `/runs?${query.toString()}`,
		parseResponse: (payload) => {
			const runs = asRecord(payload).runs;
			return Array.isArray(runs) ? (runs as WorkflowRun[]) : [];
		},
	});
}

export async function getRun(
	hub: HubConfig,
	input: { runId: string; tenantId: string },
): Promise<WorkflowRun> {
	return hubApiGet<WorkflowRun>({
		hub,
		path: `/runs/${encodeURIComponent(input.runId)}?tenantId=${encodeURIComponent(input.tenantId)}`,
		notFoundMessage: `Run "${input.runId}" not found`,
		parseResponse: (payload) => asRecord(payload).run as WorkflowRun,
	});
}

async function decideRun(
	hub: HubConfig,
	action: 'approve' | 'deny' | 'cancel',
	input: { runId: string; tenantId: string },
): Promise<void> {
	await hubApiPost<{ ok: boolean }>({
		hub,
		path: `/runs/${encodeURIComponent(input.runId)}/${action}?tenantId=${encodeURIComponent(input.tenantId)}`,
		body: {},
		notFoundMessage: `Run "${input.runId}" cannot be ${action === 'cancel' ? 'canceled' : `${action}d`} in its current state`,
		parseResponse: (payload) => payload as { ok: boolean },
	});
}

export const approveRun = (
	hub: HubConfig,
	input: { runId: string; tenantId: string },
): Promise<void> => decideRun(hub, 'approve', input);
export const denyRun = (
	hub: HubConfig,
	input: { runId: string; tenantId: string },
): Promise<void> => decideRun(hub, 'deny', input);
export const cancelRun = (
	hub: HubConfig,
	input: { runId: string; tenantId: string },
): Promise<void> => decideRun(hub, 'cancel', input);
