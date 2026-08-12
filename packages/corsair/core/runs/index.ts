import type { WorkflowRun } from '../../hub/runs';
import {
	approveRun,
	cancelRun,
	denyRun,
	getRun,
	listRuns,
} from '../../hub/runs';
import type { HubConfig } from '../../hub/types';

export type { WorkflowRun, WorkflowRunStep } from '../../hub/runs';

/** Handle for one run: `corsair.withTenant(t).runs(id).approve()`. */
export interface RunHandle {
	get(): Promise<WorkflowRun>;
	approve(): Promise<void>;
	deny(): Promise<void>;
	cancel(): Promise<void>;
}

/**
 * Read and act on a tenant's workflow runs:
 *   await corsair.withTenant('dev').runs.list({ limit: 20 })
 *   await corsair.withTenant('dev').runs.get(runId)
 *   await corsair.withTenant('dev').runs(runId).approve()
 */
export interface CorsairRunsNamespace {
	(runId: string): RunHandle;
	list(opts?: { limit?: number }): Promise<WorkflowRun[]>;
	get(runId: string): Promise<WorkflowRun>;
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

	const namespace = ((runId: string): RunHandle => ({
		get: () => getRun(requireHub(), { runId, tenantId }),
		approve: () => approveRun(requireHub(), { runId, tenantId }),
		deny: () => denyRun(requireHub(), { runId, tenantId }),
		cancel: () => cancelRun(requireHub(), { runId, tenantId }),
	})) as CorsairRunsNamespace;

	namespace.list = (opts) =>
		listRuns(requireHub(), { tenantId, limit: opts?.limit });
	namespace.get = (runId) => getRun(requireHub(), { runId, tenantId });

	return namespace;
}
