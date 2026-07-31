import { buildCorsairClient } from '../core/client';
import type { CorsairPlugin } from '../core/plugins';
import type { RunResultPayload } from '../hub/contracts/tunnel';
import { executeWorkflowRun } from './execute';

export type ChildRunMessage = {
	type: 'run';
	code: string;
	payload: unknown;
	credentialMap: Record<string, Record<string, string>>;
	integrationCredentialMap: Record<string, Record<string, string>>;
	memoizedSteps?: Record<string, { output: unknown }>;
	tenantId: string;
	timeoutMs?: number;
};

export type ChildResultMessage =
	| { type: 'done'; result: RunResultPayload }
	| { type: 'error'; message: string };

/**
 * Child-process entry: builds a KEK-less, DB-less client from the injected
 * credential map and runs the workflow. The app forks a module that imports its
 * plugin array (NOT its configured createCorsair instance, which holds the KEK)
 * and calls this. One `run` message in, one `done`/`error` message out, then exit.
 */
export function runWorkflowChild(plugins: readonly CorsairPlugin[]): void {
	process.on('message', async (msg: ChildRunMessage) => {
		let outgoing: ChildResultMessage;
		try {
			const corsair = buildCorsairClient(plugins, {
				database: undefined,
				kek: undefined,
				tenantId: msg.tenantId,
				credentialMap: msg.credentialMap,
				integrationCredentialMap: msg.integrationCredentialMap,
			});
			const result = await executeWorkflowRun({
				corsair,
				code: msg.code,
				payload: msg.payload,
				memoizedSteps: msg.memoizedSteps,
				timeoutMs: msg.timeoutMs,
				tenantId: msg.tenantId,
			});
			outgoing = { type: 'done', result };
		} catch (error) {
			outgoing = {
				type: 'error',
				message:
					error instanceof Error ? error.message : 'workflow child failed',
			};
		}
		// process.send is async: exiting before the IPC flush drops the message and
		// the parent reports "child exited early". Wait for the send callback first.
		await new Promise<void>((resolve) => {
			if (!process.send) {
				resolve();
				return;
			}
			process.send(outgoing, undefined, undefined, () => resolve());
		});
		process.exit(0);
	});
}
