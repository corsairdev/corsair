import type { HubConfig } from '../../hub/types';
import type { TriggerRunResult, WorkflowSummary } from '../../hub/workflows';
import { listWorkflows, triggerWorkflowRun } from '../../hub/workflows';

export type { TriggerRunResult, WorkflowSummary } from '../../hub/workflows';

/** Handle for one workflow: `corsair.withTenant(t).workflows(id).run()`. */
export interface WorkflowHandle {
	/** Fire a manual run. `idempotencyKey` collapses a retried trigger to one run. */
	run(opts?: {
		payload?: unknown;
		idempotencyKey?: string;
	}): Promise<TriggerRunResult>;
}

/**
 * List a tenant's workflows and trigger runs:
 *   await corsair.withTenant('dev').workflows.list()
 *   await corsair.withTenant('dev').workflows(id).run({ payload })
 */
export interface CorsairWorkflowsNamespace {
	(workflowId: string): WorkflowHandle;
	list(): Promise<WorkflowSummary[]>;
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

	const namespace = ((workflowId: string): WorkflowHandle => ({
		run: (opts) =>
			triggerWorkflowRun(requireHub(), {
				workflowId,
				tenantId,
				payload: opts?.payload,
				idempotencyKey: opts?.idempotencyKey,
			}),
	})) as CorsairWorkflowsNamespace;

	namespace.list = () => listWorkflows(requireHub(), { tenantId });

	return namespace;
}
