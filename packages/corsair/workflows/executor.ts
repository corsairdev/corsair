import type { RunResultPayload } from '../hub/contracts/tunnel';
import type { ExecuteWorkflowRunInput } from './execute';
import { executeWorkflowRun } from './execute';

// The swap point for workflow execution. Today the only implementation runs the
// code in-process via node:vm. A later out-of-process (KEK-less child) executor
// implements the same interface so it drops in without touching the tunnel.
export interface WorkflowExecutor {
	run(input: ExecuteWorkflowRunInput): Promise<RunResultPayload>;
}

export const inProcessVmExecutor: WorkflowExecutor = {
	run: executeWorkflowRun,
};
