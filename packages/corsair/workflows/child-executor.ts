import { fork } from 'node:child_process';
import type { RunResultPayload } from '../hub/contracts/tunnel';
import type { ChildResultMessage, ChildRunMessage } from './child';
import { collectTenantCredentials } from './collect-credentials';
import type { ExecuteWorkflowRunInput } from './execute';
import type { WorkflowExecutor } from './executor';

export type ChildProcessExecutorConfig = {
	/** Path to the app's forkable child module (imports its plugins + runWorkflowChild). */
	childModulePath: string;
	/** Extra node args for the child (e.g. ['--import','tsx'] in dev). */
	execArgv?: string[];
	/** Child heap cap in MB; a memory bomb OOMs only the child. */
	maxOldSpaceMb?: number;
	/** Grace between SIGTERM and SIGKILL on timeout. */
	killGraceMs?: number;
};

const DEFAULT_TIMEOUT_MS = 30_000;

/**
 * Broker-side workflow executor. Decrypts the run's tenant credentials in the
 * parent (which holds the KEK + DB), forks a KEK-less child, sends the code +
 * credential map over IPC, and returns the child's result. The child never
 * receives the KEK, the DB handle, or any other tenant's credentials.
 */
export function createChildProcessExecutor(
	config: ChildProcessExecutorConfig,
): WorkflowExecutor {
	return {
		run(input: ExecuteWorkflowRunInput): Promise<RunResultPayload> {
			return runInChild(config, input);
		},
	};
}

async function runInChild(
	config: ChildProcessExecutorConfig,
	input: ExecuteWorkflowRunInput,
): Promise<RunResultPayload> {
	const tenantId = input.tenantId ?? 'default';
	const { credentialMap, integrationCredentialMap } =
		await collectTenantCredentials(input.corsair, tenantId);

	const timeoutMs = input.timeoutMs ?? DEFAULT_TIMEOUT_MS;
	const killGraceMs = config.killGraceMs ?? 2_000;
	const execArgv = [
		...(config.execArgv ?? []),
		...(config.maxOldSpaceMb
			? [`--max-old-space-size=${config.maxOldSpaceMb}`]
			: []),
	];

	return new Promise<RunResultPayload>((resolve) => {
		const child = fork(config.childModulePath, [], { execArgv });
		let settled = false;
		const finish = (result: RunResultPayload) => {
			if (settled) return;
			settled = true;
			resolve(result);
		};

		const killTimer = setTimeout(() => {
			child.kill('SIGTERM');
			setTimeout(() => child.kill('SIGKILL'), killGraceMs).unref();
			finish({
				status: 'failed',
				steps: [],
				error: { message: `Workflow exceeded ${timeoutMs}ms time limit` },
			});
		}, timeoutMs);
		// Don't let our own timers keep the host event loop alive.
		killTimer.unref();

		child.on('message', (m: ChildResultMessage) => {
			clearTimeout(killTimer);
			if (m.type === 'done') finish(m.result);
			else
				finish({ status: 'failed', steps: [], error: { message: m.message } });
			child.kill();
		});

		child.on('error', (e) => {
			clearTimeout(killTimer);
			finish({ status: 'failed', steps: [], error: { message: e.message } });
		});

		child.on('exit', (code) => {
			clearTimeout(killTimer);
			finish({
				status: 'failed',
				steps: [],
				error: { message: `workflow child exited early (code ${code})` },
			});
		});

		child.send({
			type: 'run',
			code: input.code,
			payload: input.payload,
			credentialMap,
			integrationCredentialMap,
			memoizedSteps: input.memoizedSteps,
			tenantId,
			timeoutMs,
		} satisfies ChildRunMessage);
	});
}
