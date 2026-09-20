import type { WorkflowRun } from '../../hub/runs';
import {
	approveRun,
	cancelRun,
	denyRun,
	getRun,
	listRuns,
	listWorkflowRuns,
} from '../../hub/runs';
import type { HubConfig } from '../../hub/types';

export type {
	WorkflowRun,
	WorkflowRunStatus,
	WorkflowRunStep,
} from '../../hub/runs';

/**
 * This tenant's workflow runs, under the workflows plane — the cross-workflow
 * activity feed (`list`), one workflow's runs (`list({ workflowId })`), plus
 * `get` and approve/deny/cancel by run id:
 *   await corsair.workflows.runs.list()
 *   await corsair.workflows.runs.list({ workflowId })
 *   await corsair.workflows.runs.get(runId)
 *   await corsair.workflows.runs.approve(runId)   // .deny / .cancel
 */
export interface CorsairRunsNamespace {
	list(opts?: { workflowId?: string }): Promise<WorkflowRun[]>;
	get(runId: string): Promise<WorkflowRun>;
	/** Approve a run that is paused awaiting approval. */
	approve(runId: string): Promise<void>;
	/** Deny a run that is paused awaiting approval. */
	deny(runId: string): Promise<void>;
	cancel(runId: string): Promise<void>;
}

export function buildRunsNamespace(
	hub: HubConfig | undefined,
	tenantId: string,
): CorsairRunsNamespace {
	const requireHub = (): HubConfig => {
		if (!hub) {
			throw new Error(
				'corsair.workflows.runs requires Hub to be configured. Pass `hub` to createCorsair({ hub: { projectApiKey, ... } }).',
			);
		}
		return hub;
	};

	return {
		list: (opts) =>
			opts?.workflowId
				? listWorkflowRuns(requireHub(), {
						workflowId: opts.workflowId,
						tenantId,
					})
				: listRuns(requireHub(), { tenantId }),
		get: (runId) => getRun(requireHub(), { runId, tenantId }),
		approve: (runId) => approveRun(requireHub(), { runId, tenantId }),
		deny: (runId) => denyRun(requireHub(), { runId, tenantId }),
		cancel: (runId) => cancelRun(requireHub(), { runId, tenantId }),
	};
}
