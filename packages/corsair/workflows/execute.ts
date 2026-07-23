import { createRequire } from 'node:module';
import type { RunResultPayload, RunStepResult } from '../hub/contracts/tunnel';

// ─────────────────────────────────────────────────────────────────────────────
// Workflow executor (app side)
//
// Runs a Hub-delivered workflow against the tenant's Corsair client. The step
// primitive records each executed step and replays previously-completed steps
// from the memoization map, giving durable resume-from-failure.
//
// ⚠️  PROTOTYPE — dynamic code execution.
// This uses `new Function` on Hub-delivered code, which the repo guide otherwise
// forbids for generated content. It is gated behind
// `processCorsair({ allowWorkflowExecution: true })` and the envelope is HMAC-
// signed by Hub, but the code still runs in-process with full access. Before this
// ships it MUST run in a real sandbox (isolated-vm / worker / separate process).
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The step primitive handed to workflow code. Callable for normal work
 * (`step(name, fn)`) with a `.sleep` method for durable pauses — mirroring
 * Inngest's `step.run` / `step.sleep`.
 */
export interface WorkflowStep {
	/** Runs `fn` once, memoizing its result so retries replay it instead of re-running. */
	<T>(name: string, fn: () => Promise<T>): Promise<T>;
	/** Durably pauses the workflow for `ms`. Survives restarts; resumes after the delay. */
	sleep(name: string, ms: number): Promise<void>;
}

export type WorkflowMain = (
	corsair: unknown,
	payload: unknown,
	step: WorkflowStep,
) => Promise<void>;

const FAILED_STEP_MARKER = '__corsairFailedStep';

/**
 * Thrown by `step.sleep` to unwind `main` at the sleep boundary. Not an Error, so
 * workflow `try/catch` around real work won't accidentally swallow it.
 */
class SleepInterrupt {
	readonly __corsairSleep = true as const;
	constructor(
		readonly wakeAt: number,
		readonly stepName: string,
	) {}
}

function isSleepInterrupt(value: unknown): value is SleepInterrupt {
	return (
		typeof value === 'object' &&
		value !== null &&
		(value as { __corsairSleep?: unknown }).__corsairSleep === true
	);
}

/** Loads `module.exports.main` from CJS source. Imports are disallowed (self-contained code). */
function loadMain(code: string): WorkflowMain {
	const module = { exports: {} as Record<string, unknown> };
	const denyRequire = createRequire(import.meta.url);
	const restrictedRequire = (id: string) => {
		// Built-in escape hatch is intentionally closed off for workflow code.
		throw new Error(
			`Workflow code may not import modules (attempted to require "${id}")`,
		);
	};
	// Preserve the real require's shape without exposing it.
	Object.setPrototypeOf(restrictedRequire, denyRequire);

	// eslint-disable-next-line no-new-func
	const factory = new Function('exports', 'module', 'require', code);
	factory(module.exports, module, restrictedRequire);

	const main = module.exports.main;
	if (typeof main !== 'function') {
		throw new Error('Workflow code must export a `main` function');
	}
	return main as WorkflowMain;
}

export type ExecuteWorkflowRunInput = {
	/** The tenant-scoped Corsair client passed as the first arg to `main`. */
	corsair: unknown;
	/** CJS module source that assigns `module.exports.main`. */
	code: string;
	/** Webhook body (or null for schedule/manual triggers). */
	payload: unknown;
	/** Outputs of steps that already completed on prior attempts, keyed by name. */
	memoizedSteps?: Record<string, { output: unknown }>;
};

/**
 * Executes one workflow attempt. Never throws for workflow-level failures — the
 * outcome (including which step failed) is returned in {@link RunResultPayload}.
 */
export async function executeWorkflowRun(
	input: ExecuteWorkflowRunInput,
): Promise<RunResultPayload> {
	const memo = input.memoizedSteps ?? {};
	const steps: RunStepResult[] = [];
	let seq = 0;

	const step = (async <T>(name: string, fn: () => Promise<T>): Promise<T> => {
		const current = seq++;

		// Replay: a completed step from a prior attempt is not re-executed and not
		// re-reported (Hub already has it persisted).
		if (Object.hasOwn(memo, name)) {
			return memo[name]!.output as T;
		}

		try {
			const output = await fn();
			steps.push({ name, seq: current, status: 'completed', output });
			return output;
		} catch (err) {
			if (isSleepInterrupt(err)) throw err;
			const message = err instanceof Error ? err.message : String(err);
			steps.push({ name, seq: current, status: 'failed', error: message });
			const wrapped = err instanceof Error ? err : new Error(message);
			(wrapped as unknown as Record<string, unknown>)[FAILED_STEP_MARKER] =
				name;
			throw wrapped;
		}
	}) as WorkflowStep;

	step.sleep = async (name: string, ms: number): Promise<void> => {
		const current = seq++;
		// Already slept on a prior attempt — the pause is satisfied, continue.
		if (Object.hasOwn(memo, name)) return;
		// First encounter: record the sleep as a completed step (so the next attempt
		// replays past it) and unwind to hand control back to Hub.
		steps.push({ name, seq: current, status: 'completed', output: null });
		throw new SleepInterrupt(Date.now() + Math.max(0, ms), name);
	};

	try {
		const main = loadMain(input.code);
		await main(input.corsair, input.payload, step);
		return { status: 'completed', steps };
	} catch (err) {
		if (isSleepInterrupt(err)) {
			return {
				status: 'sleeping',
				steps,
				sleepUntil: new Date(err.wakeAt).toISOString(),
			};
		}
		const message = err instanceof Error ? err.message : String(err);
		const failedStep = (err as unknown as Record<string, unknown>)?.[
			FAILED_STEP_MARKER
		] as string | undefined;
		return {
			status: 'failed',
			steps,
			error: { message, ...(failedStep ? { failedStep } : {}) },
		};
	}
}
