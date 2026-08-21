import type { HubConfig } from '../../hub/types';
import type {
	TriggerRunResult,
	WorkflowStatus,
	WorkflowSummary,
} from '../../hub/workflows';
import {
	getWorkflow,
	listWorkflows,
	renameWorkflow,
	setWorkflowStatus,
	triggerWorkflowRun,
} from '../../hub/workflows';
import type { CorsairRunsNamespace } from '../runs';
import { buildRunsNamespace } from '../runs';

export type { WorkflowRun, WorkflowRunStep } from '../../hub/runs';
export type {
	TriggerRunResult,
	WorkflowStatus,
	WorkflowSummary,
} from '../../hub/workflows';

/**
 * Manage this tenant's workflows:
 *   await corsair.workflows.list()
 *   await corsair.workflows.get(id)
 *   await corsair.workflows.run(id, { payload })
 *   await corsair.workflows.runs.list({ workflowId })  // or .list() for all runs
 *   await corsair.workflows.disable(id)
 *   await corsair.workflows.rename(id, 'new name')
 *
 * The agent authors a workflow's code/prompt/trigger through chats; these
 * methods cover its lifecycle. Archive is a reversible soft-remove — there is
 * no hard delete.
 */
export interface CorsairWorkflowsNamespace {
	list(): Promise<WorkflowSummary[]>;
	get(workflowId: string): Promise<WorkflowSummary>;
	run(
		workflowId: string,
		opts?: { payload?: unknown; idempotencyKey?: string },
	): Promise<TriggerRunResult>;
	/** This workflow plane's runs — feed, get, approve/deny/cancel. */
	runs: CorsairRunsNamespace;
	/** Pause the workflow — sets status inactive; stops it triggering. */
	disable(workflowId: string): Promise<void>;
	/** Resume a paused workflow — sets status active. */
	enable(workflowId: string): Promise<void>;
	/** Soft-remove — sets status archived; hidden from list, run history kept. */
	archive(workflowId: string): Promise<void>;
	/** Restore an archived workflow — returns it as inactive (paused). */
	unarchive(workflowId: string): Promise<void>;
	rename(workflowId: string, name: string): Promise<void>;
}

export function buildWorkflowsNamespace(
	hub: HubConfig | undefined,
	tenantId: string,
): CorsairWorkflowsNamespace {
	const requireHub = (): HubConfig => {
		if (!hub) {
			throw new Error(
				'corsair.workflows requires Hub to be configured. Pass `hub` to createCorsair({ hub: { projectApiKey, ... } }).',
			);
		}
		return hub;
	};

	const status = (workflowId: string, next: WorkflowStatus): Promise<void> =>
		setWorkflowStatus(requireHub(), { workflowId, tenantId, status: next });

	return {
		list: () => listWorkflows(requireHub(), { tenantId }),
		get: (workflowId) => getWorkflow(requireHub(), { workflowId, tenantId }),
		run: (workflowId, opts) =>
			triggerWorkflowRun(requireHub(), {
				workflowId,
				tenantId,
				payload: opts?.payload,
				idempotencyKey: opts?.idempotencyKey,
			}),
		runs: buildRunsNamespace(hub, tenantId),
		disable: (workflowId) => status(workflowId, 'inactive'),
		enable: (workflowId) => status(workflowId, 'active'),
		archive: (workflowId) => status(workflowId, 'archived'),
		unarchive: (workflowId) => status(workflowId, 'inactive'),
		rename: (workflowId, name) =>
			renameWorkflow(requireHub(), { workflowId, tenantId, name }),
	};
}
