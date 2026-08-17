import { hubApiGet, hubApiPost } from './client/http';
import type { HubConfig } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// Workflow runs (SDK client)
//
// Read a workflow's run history and act on a run (approve / deny / cancel) over
// the Hub's `/workflows/:id/runs` and `/runs` endpoints. Auth is the project API
// key (Bearer); the tenant is sent in the query, matching the chats client.
// ─────────────────────────────────────────────────────────────────────────────

export type WorkflowRunStatus =
	| 'queued'
	| 'running'
	| 'sleeping'
	| 'successful'
	| 'error'
	| 'cancelled'
	| 'awaiting_approval';

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
	status: WorkflowRunStatus;
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
	input: { tenantId: string },
): Promise<WorkflowRun[]> {
	return hubApiGet<WorkflowRun[]>({
		hub,
		path: `/runs?tenantId=${encodeURIComponent(input.tenantId)}`,
		parseResponse: (payload) => {
			const runs = asRecord(payload).runs;
			return Array.isArray(runs) ? (runs as WorkflowRun[]) : [];
		},
	});
}

export async function listWorkflowRuns(
	hub: HubConfig,
	input: { workflowId: string; tenantId: string },
): Promise<WorkflowRun[]> {
	return hubApiGet<WorkflowRun[]>({
		hub,
		path: `/workflows/${encodeURIComponent(input.workflowId)}/runs?tenantId=${encodeURIComponent(
			input.tenantId,
		)}`,
		notFoundMessage: `Workflow "${input.workflowId}" not found`,
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
