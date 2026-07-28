import { hubApiGet, hubApiPost } from './client/http';
import type { HubConfig } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// Workflows (SDK client)
//
// List a tenant's workflows and fire a manual run over the Hub's `/workflows`
// endpoints. Auth is the project API key (Bearer); the tenant is sent in the
// query, matching the threads and runs clients.
// ─────────────────────────────────────────────────────────────────────────────

export type WorkflowSummary = {
	id: string;
	name: string;
	status: string;
	triggerType: string;
	createdAt: string;
	updatedAt: string;
};

export type TriggerRunResult = {
	status: string;
	runId?: string;
};

function asRecord(payload: unknown): Record<string, unknown> {
	return payload && typeof payload === 'object'
		? (payload as Record<string, unknown>)
		: {};
}

export async function listWorkflows(
	hub: HubConfig,
	input: { tenantId: string },
): Promise<WorkflowSummary[]> {
	return hubApiGet<WorkflowSummary[]>({
		hub,
		path: `/workflows?tenantId=${encodeURIComponent(input.tenantId)}`,
		parseResponse: (payload) => {
			const workflows = asRecord(payload).workflows;
			return Array.isArray(workflows) ? (workflows as WorkflowSummary[]) : [];
		},
	});
}

export async function triggerWorkflowRun(
	hub: HubConfig,
	input: {
		workflowId: string;
		tenantId: string;
		payload?: unknown;
		idempotencyKey?: string;
	},
): Promise<TriggerRunResult> {
	return hubApiPost<TriggerRunResult>({
		hub,
		path: `/workflows/${encodeURIComponent(input.workflowId)}/run?tenantId=${encodeURIComponent(input.tenantId)}`,
		body: { payload: input.payload, idempotencyKey: input.idempotencyKey },
		notFoundMessage: `Workflow "${input.workflowId}" not found`,
		parseResponse: (payload) => payload as TriggerRunResult,
	});
}
