import type { WorkflowRun } from '../../hub/runs';
import {
	approveRun,
	cancelRun,
	denyRun,
	getRun,
	listRuns,
} from '../../hub/runs';
import type { HubConfig } from '../../hub/types';

export type {
	WorkflowRun,
	WorkflowRunStatus,
	WorkflowRunStep,
} from '../../hub/runs';

/**
 * This tenant's workflow runs — the cross-workflow activity feed (`list`) plus
 * `get` and approve/deny/cancel by run id:
 *   await corsair.runs.list()
 *   await corsair.runs.get(runId)
 *   await corsair.runs.approve(runId)   // .deny / .cancel
 */
export interface CorsairRunsNamespace {
	list(): Promise<WorkflowRun[]>;
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
				'corsair.runs requires Hub to be configured. Pass `hub` to createCorsair({ hub: { projectApiKey, ... } }).',
			);
		}
		return hub;
	};

	return {
		list: () => listRuns(requireHub(), { tenantId }),
		get: (runId) => getRun(requireHub(), { runId, tenantId }),
		approve: (runId) => approveRun(requireHub(), { runId, tenantId }),
		deny: (runId) => denyRun(requireHub(), { runId, tenantId }),
		cancel: (runId) => cancelRun(requireHub(), { runId, tenantId }),
	};
}
