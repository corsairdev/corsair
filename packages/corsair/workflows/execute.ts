import * as vm from 'node:vm';
import type { RunResultPayload, RunStepResult } from '../hub/contracts/tunnel';

// ─────────────────────────────────────────────────────────────────────────────
// Workflow executor (app side)
//
// Runs a Hub-delivered workflow against the tenant's Corsair client. The step
// primitive records each executed step and replays previously-completed steps
// from the memoization map, giving durable resume-from-failure.
//
// Sandboxing. Hub-delivered code is HMAC-signed, but we still execute it in a
// locked-down `node:vm` realm rather than the host scope:
//   • The realm's global object is null-prototype, so `globalThis`/literal
//     prototype chains resolve to the realm's own intrinsics — never the host's.
//   • Host globals (`process`, `require`, `Buffer`, `fetch`, timers, `global`)
//     are simply absent; the code can't read env/secrets or touch the filesystem.
//   • `eval` / `Function` are disabled inside the realm (codeGeneration.strings).
//   • The only capabilities crossing in are `corsair`, `payload`, `step` and a
//     forwarding `console` — and `corsair` is wrapped in a membrane Proxy that
//     denies `constructor`/`prototype`/`__proto__` access, closing the classic
//     `hostFn.constructor.constructor('return process')()` escape.
//   • `payload`, `step`, `module`/`exports`/`require` are all realm-native, so
//     no bare host object references are handed to the workflow.
//
// This is not a substitute for OS-level isolation against a hostile V8 0-day;
// for that, move execution to an isolated-vm/worker/child process. But it does
// remove ambient host access, which is the practical risk for generated code.
// Execution is still gated behind `processCorsair({ allowWorkflowExecution: true })`.
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

const FAILED_STEP_MARKER = '__corsairFailedStep';

// ponytail: one 30s cap covers both guards below; the deploy targets short,
// gated workflows. Promote to a per-run config knob if long workflows land.
const WORKFLOW_TIMEOUT_MS = 30_000;

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

/** Robust message extraction, including cross-realm errors (not `instanceof Error`). */
function toMessage(err: unknown): string {
	if (err instanceof Error) return err.message;
	if (err !== null && typeof err === 'object' && 'message' in err) {
		const message = (err as { message?: unknown }).message;
		if (typeof message === 'string') return message;
	}
	return String(err);
}

// ─────────────────────────────────────────────────────────────────────────────
// Membrane — a defensive Proxy wrapper for host objects handed into the sandbox.
//
// Denies access to `constructor`/`prototype`/`__proto__` and flattens the
// prototype chain so the workflow can navigate/call the Corsair client but can
// never obtain the host `Function` constructor (the standard vm escape vector).
// Every value returned across the boundary — nested namespaces, methods, and
// their resolved results — is re-wrapped.
// ─────────────────────────────────────────────────────────────────────────────

const BLOCKED_KEYS = new Set<PropertyKey>([
	'constructor',
	'prototype',
	'__proto__',
]);

export function harden(value: unknown, thisArg: unknown): unknown {
	if (value === null) return null;
	const type = typeof value;
	if (type === 'function') {
		return hardenFunction(value as (...args: unknown[]) => unknown, thisArg);
	}
	if (type === 'object') return hardenObject(value as object);
	return value;
}

function hardenObject(target: object): object {
	return new Proxy(target, {
		get(t, key) {
			if (BLOCKED_KEYS.has(key)) return undefined;
			return harden(Reflect.get(t, key, t), t);
		},
		getPrototypeOf: () => null,
		setPrototypeOf: () => false,
		defineProperty: () => false,
		set: () => false,
		deleteProperty: () => false,
	});
}

function hardenFunction(
	target: (...args: unknown[]) => unknown,
	thisArg: unknown,
): (...args: unknown[]) => unknown {
	return new Proxy(target, {
		apply: (fn, _thisArg, args) =>
			hardenResult(Reflect.apply(fn, thisArg, args)),
		construct() {
			throw new Error('Workflow code may not construct host objects');
		},
		get(fn, key) {
			if (BLOCKED_KEYS.has(key)) return undefined;
			return harden(Reflect.get(fn, key, fn), fn);
		},
		getPrototypeOf: () => null,
		setPrototypeOf: () => false,
		defineProperty: () => false,
		set: () => false,
		deleteProperty: () => false,
	});
}

/** Wraps a call result; awaits + re-wraps promises so resolved host data stays hardened. */
function hardenResult(result: unknown): unknown {
	if (
		result !== null &&
		typeof result === 'object' &&
		typeof (result as { then?: unknown }).then === 'function'
	) {
		return Promise.resolve(result as Promise<unknown>).then(
			(value) => harden(value, undefined),
			(error) => {
				throw harden(error, undefined);
			},
		);
	}
	return harden(result, undefined);
}

// ─────────────────────────────────────────────────────────────────────────────
// Sandbox runner
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compiles and runs the workflow module inside a fresh vm realm, returning the
 * promise from its `main(corsair, payload, step)` call. `module`/`exports`/
 * `require`/`payload`/`step`/`console` are all realm-native; `corsair` is the
 * hardened membrane. Host globals are absent.
 */
function runWorkflowInSandbox(input: {
	code: string;
	corsair: unknown;
	payload: unknown;
	step: WorkflowStep;
	timeoutMs: number;
}): Promise<void> {
	// Null-proto global object → `globalThis`'s prototype chain can't reach host
	// intrinsics. V8 still installs the realm's own built-ins (Object, JSON, …).
	const sandbox = Object.create(null) as Record<string, unknown>;
	const context = vm.createContext(sandbox, {
		name: 'corsair-workflow',
		codeGeneration: { strings: false, wasm: false },
	});

	// Realm-native payload: parse a JSON string *inside* the realm so the workflow
	// never holds a host object reference to its trigger data.
	const realmParse = vm.runInContext('(s) => JSON.parse(s)', context, {
		filename: 'corsair:sandbox:json',
	}) as (s: string) => unknown;
	const realmPayload = realmParse(JSON.stringify(input.payload ?? null));

	// Realm-native `step`: built in-realm from host callbacks captured in a closure
	// (not reachable as properties), so `step.constructor` is the realm's Function.
	const makeStep = vm.runInContext(
		`(function (hostRun, hostSleep) {
			const step = function step(name, fn) { return hostRun(name, fn); };
			step.sleep = function sleep(name, ms) { return hostSleep(name, ms); };
			return step;
		})`,
		context,
		{ filename: 'corsair:sandbox:step' },
	) as (
		hostRun: (name: string, fn: () => Promise<unknown>) => Promise<unknown>,
		hostSleep: (name: string, ms: number) => Promise<void>,
	) => WorkflowStep;
	const realmStep = makeStep(
		(name, fn) => input.step(name, fn),
		(name, ms) => input.step.sleep(name, ms),
	);

	// Realm-native forwarding console (methods created in-realm; host sink hidden
	// in a closure). Best-effort — logging must never break a run.
	const makeConsole = vm.runInContext(
		`(function (sink) {
			const fwd = (level) => function () {
				try { sink(level, Array.prototype.slice.call(arguments)); } catch (_e) {}
			};
			return { log: fwd('log'), info: fwd('info'), warn: fwd('warn'), error: fwd('error'), debug: fwd('debug') };
		})`,
		context,
		{ filename: 'corsair:sandbox:console' },
	) as (sink: (level: string, args: unknown[]) => void) => unknown;
	const realmConsole = makeConsole((level, args) => {
		const sink =
			(
				console as unknown as Record<
					string,
					((...a: unknown[]) => void) | undefined
				>
			)[level] ?? console.log;
		try {
			sink(...args);
		} catch {
			// ignore logging failures
		}
	});

	// Expose the capabilities as realm globals so `main` can be *invoked inside*
	// the timed runInContext below. vm's `timeout` only bounds code it runs
	// directly, so this is what lets it abort a synchronous runaway
	// (`while (true) {}`) in the workflow body. `corsair` is the membrane;
	// `payload`/`step`/`console` are realm-native, so no bare host reference is
	// exposed by making them globals.
	sandbox.__corsair = harden(input.corsair, undefined);
	sandbox.__payload = realmPayload;
	sandbox.__step = realmStep;
	sandbox.__console = realmConsole;

	// The workflow body runs inside this realm-defined IIFE, invoked in-realm so
	// its synchronous portion is bounded by `timeout`. `require` throws
	// (self-contained modules only); `module`/`exports` are realm objects.
	const mainPromise = vm.runInContext(
		`(function () {
			'use strict';
			const module = { exports: {} };
			const require = function (id) {
				throw new Error('Workflow code may not import modules (attempted to require "' + id + '")');
			};
			(function (exports, module, require, console) {
${input.code}
			})(module.exports, module, require, __console);
			const main = module.exports.main;
			if (typeof main !== 'function') {
				throw new Error('Workflow code must export a \`main\` function');
			}
			return main(__corsair, __payload, __step);
		})()`,
		context,
		{ filename: 'corsair:workflow', timeout: input.timeoutMs },
	) as Promise<void>;

	// If the wall-clock cap wins the race below, `main` keeps running detached
	// (we can't cancel in-process). Attach a no-op catch so its late settlement
	// can't surface as an unhandledRejection and crash the host.
	void mainPromise.catch(() => {});

	// Wall-clock cap for the async remainder: once `main` yields at its first
	// await, the vm `timeout` above no longer applies, so bound total run time
	// here. clearTimeout so a finished run's timer never keeps the process alive.
	let timer: ReturnType<typeof setTimeout>;
	const wallClock = new Promise<never>((_resolve, reject) => {
		timer = setTimeout(
			() =>
				reject(new Error(`Workflow exceeded ${input.timeoutMs}ms time limit`)),
			input.timeoutMs,
		);
	});
	return Promise.race([mainPromise, wallClock]).finally(() =>
		clearTimeout(timer),
	);
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
	/** Max run time (sync + wall-clock) in ms. Defaults to {@link WORKFLOW_TIMEOUT_MS}. */
	timeoutMs?: number;
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
	// Set once step.sleep unwinds. If workflow-level try/catch swallows the throw,
	// this lets the pause re-assert itself instead of silently continuing.
	let pendingSleep: SleepInterrupt | null = null;

	const step = (async <T>(name: string, fn: () => Promise<T>): Promise<T> => {
		// A prior sleep unwound but was swallowed — re-throw rather than run more
		// work this attempt.
		if (pendingSleep) throw pendingSleep;
		const current = seq++;

		// Replay: a completed step from a prior attempt is not re-executed and not
		// re-reported (Hub already has it persisted). Harden the stored output so
		// the sandbox gets a safe view rather than a bare host object.
		if (Object.hasOwn(memo, name)) {
			return harden(memo[name]!.output, undefined) as T;
		}

		try {
			const output = await fn();
			steps.push({ name, seq: current, status: 'completed', output });
			return output;
		} catch (err) {
			if (isSleepInterrupt(err)) throw err;
			const message = toMessage(err);
			steps.push({ name, seq: current, status: 'failed', error: message });
			const wrapped = new Error(message);
			(wrapped as unknown as Record<string, unknown>)[FAILED_STEP_MARKER] =
				name;
			throw wrapped;
		}
	}) as WorkflowStep;

	step.sleep = async (name: string, ms: number): Promise<void> => {
		if (pendingSleep) throw pendingSleep;
		const current = seq++;
		// Already slept on a prior attempt — the pause is satisfied, continue.
		if (Object.hasOwn(memo, name)) return;
		// First encounter: record the sleep as a completed step (so the next attempt
		// replays past it) and unwind to hand control back to Hub.
		steps.push({ name, seq: current, status: 'completed', output: null });
		// Guard non-finite ms: `Date.now() + NaN` → `new Date(NaN).toISOString()`
		// throws, turning a sleep into an infra failure.
		const delay = Number.isFinite(ms) ? Math.max(0, ms) : 0;
		pendingSleep = new SleepInterrupt(Date.now() + delay, name);
		throw pendingSleep;
	};

	try {
		await runWorkflowInSandbox({
			code: input.code,
			corsair: input.corsair,
			payload: input.payload,
			step,
			timeoutMs: input.timeoutMs ?? WORKFLOW_TIMEOUT_MS,
		});
		// `main` returned without propagating the interrupt — a try/catch swallowed
		// it. Honor the pause anyway rather than reporting a false completion.
		// (cast: TS narrows the closure-mutated `pendingSleep` back to `null` here.)
		const swallowed = pendingSleep as SleepInterrupt | null;
		if (swallowed) {
			return {
				status: 'sleeping',
				steps,
				sleepUntil: new Date(swallowed.wakeAt).toISOString(),
			};
		}
		return { status: 'completed', steps };
	} catch (err) {
		if (isSleepInterrupt(err)) {
			return {
				status: 'sleeping',
				steps,
				sleepUntil: new Date(err.wakeAt).toISOString(),
			};
		}
		const message = toMessage(err);
		const failedStep =
			err !== null && typeof err === 'object'
				? ((err as Record<string, unknown>)[FAILED_STEP_MARKER] as
						| string
						| undefined)
				: undefined;
		return {
			status: 'failed',
			steps,
			error: { message, ...(failedStep ? { failedStep } : {}) },
		};
	}
}
