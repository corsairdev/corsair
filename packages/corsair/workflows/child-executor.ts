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
	/**
	 * Extra env var names to pass into the child on top of the runtime-safe
	 * defaults. Use only for an app-level value a plugin genuinely needs at
	 * construction; never a per-tenant secret (those cross via IPC).
	 */
	envAllowlist?: readonly string[];
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
		const child = fork(config.childModulePath, [], {
			execArgv,
			env: safeChildEnv(process.env, config.envAllowlist),
		});
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

/**
 * Env var names a Node/tsx child needs to boot. Everything else — the master
 * KEK, DATABASE_URL, provider API keys — is left behind.
 */
const DEFAULT_CHILD_ENV_ALLOWLIST: readonly string[] = [
	'PATH',
	'HOME',
	'TMPDIR',
	'TMP',
	'TEMP',
	'NODE_ENV',
	'NODE_OPTIONS',
	'NODE_PATH',
	'NODE_EXTRA_CA_CERTS',
	'TZ',
	'LANG',
	'LC_ALL',
	'LC_CTYPE',
	'TERM',
	// Windows runtime essentials
	'SystemRoot',
	'SYSTEMROOT',
	'ComSpec',
	'PATHEXT',
	'WINDIR',
	'APPDATA',
	'LOCALAPPDATA',
	'USERPROFILE',
];

/**
 * The child gets its tenant credentials over IPC — nothing else should reach it.
 * A forked child inherits the parent's whole env by default, which would hand
 * Hub-delivered workflow code every app-level secret in `process.env` (the
 * master KEK, DATABASE_URL, provider keys). Build the child's env from an
 * allow-list of runtime-necessary vars instead, plus any the app explicitly
 * opts into. Secrets are excluded by construction — nothing to out-guess (a
 * substring or re-encoded KEK, a newly-added secret name).
 */
export function safeChildEnv(
	env: NodeJS.ProcessEnv = process.env,
	extraAllowlist: readonly string[] = [],
): NodeJS.ProcessEnv {
	const allow = new Set([...DEFAULT_CHILD_ENV_ALLOWLIST, ...extraAllowlist]);
	const out: NodeJS.ProcessEnv = {};
	for (const key of allow) {
		const value = env[key];
		if (value !== undefined) out[key] = value;
	}
	return out;
}
