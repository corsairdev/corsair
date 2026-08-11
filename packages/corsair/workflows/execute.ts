import { createHash } from 'node:crypto';
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

/** A single durable AI inference request, handed to the host `ai` capability. */
export type AiStepRequest = {
	kind: 'object' | 'text' | 'enum' | 'bool';
	stepName: string;
	input: unknown;
	prompt: string;
	returnObject?: { op: string; pick?: readonly string[] };
	options?: readonly string[];
	model?: string;
};

/**
 * Host capability that runs one inference and returns its output as a JSON
 * string: a JSON-encoded object/value for object/enum/bool, a JSON-encoded
 * string for text. Provided by the caller (the tunnel run handler); absent when
 * Hub is not configured, in which case any `step.ai` call fails clearly.
 */
export type AiStepCallback = (req: AiStepRequest) => Promise<string>;

/**
 * The `step.ai` sub-namespace. Callable for freeform text (`step.ai(name, opts)`),
 * with `.object`/`.enum`/`.bool` for typed inference. Each call is memoized like
 * `step.run`.
 */
export interface WorkflowStepAi {
	(
		name: string,
		opts: { input: unknown; prompt: string; model?: string },
	): Promise<string>;
	object<T = Record<string, unknown>>(
		name: string,
		opts: {
			input: unknown;
			prompt: string;
			returnObject: { op: string; pick?: readonly string[] };
			model?: string;
		},
	): Promise<T>;
	enum<const T extends readonly string[]>(
		name: string,
		opts: { input: unknown; prompt: string; options: T; model?: string },
	): Promise<T[number]>;
	bool(
		name: string,
		opts: { input: unknown; prompt: string; model?: string },
	): Promise<boolean>;
}

/**
 * The step primitive handed to workflow code. Callable for normal work
 * (`step(name, fn)`), with `.sleep`/`.sleepUntil` for durable pauses, `.ai` for
 * durable typed inference, and `.corsair` for a durable typed plugin-op call —
 * mirroring Inngest's `step.run` / `step.sleep` / `step.ai`.
 */
export interface WorkflowStep {
	/** Runs `fn` once, memoizing its result so retries replay it instead of re-running. */
	<T>(name: string, fn: () => Promise<T>): Promise<T>;
	/** Durably pauses the workflow for `ms`. Survives restarts; resumes after the delay. */
	sleep(name: string, ms: number): Promise<void>;
	/** Durably pauses until an absolute time (epoch ms, ISO string, or `Date`). */
	sleepUntil(name: string, when: number | string | Date): Promise<void>;
	/** Durable, typed AI inference — see {@link WorkflowStepAi}. */
	ai: WorkflowStepAi;
	/**
	 * Runs a plugin op by id (`"<plugin>.<endpoint.path>"`, e.g. `"linear.issues.create"`)
	 * with `input`, memoized like `step.run`. Sugar over `corsair.<plugin>.api.<path>(input)`
	 * that shares the op id with `step.ai`'s `returnObject`.
	 */
	corsair<T = unknown>(name: string, op: string, input?: unknown): Promise<T>;
}

const FAILED_STEP_MARKER = '__corsairFailedStep';

// One 30s cap covers both guards below; the deploy targets short, gated
// workflows. Promote to a per-run config knob if long workflows land.
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

/**
 * Stable, position-anchored id for one step call. Deterministic across attempts
 * (same name + seq → same id) and unique per call (seq disambiguates loops and
 * reused names), so it doubles as the memoization key and the correlation id in
 * run logs. The name is folded in so a code edit that changes the step at a given
 * position yields a new id instead of replaying a stale output under the old name.
 */
export function computeStepId(name: string, seq: number): string {
	const hash = createHash('sha256').update(`${seq} ${name}`).digest('hex');
	return `st_${hash.slice(0, 16)}`;
}

/** Robust message extraction, including cross-realm errors (not `instanceof Error`). */
export function toMessage(err: unknown): string {
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
	ai: (kind: string, name: string, optsJson: string) => Promise<string>;
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

	// The membrane the workflow navigates. Shared by `main`'s `corsair` arg and
	// `step.corsair`, so both resolve ops through the exact same hardened client.
	const hardenedCorsair = harden(input.corsair, undefined);

	// Realm-native `step`: built in-realm from host callbacks captured in a closure
	// (not reachable as properties), so `step.constructor` is the realm's Function.
	const makeStep = vm.runInContext(
		`(function (hostRun, hostSleep, hostAi, corsairRef) {
			const step = function step(name, fn) { return hostRun(name, fn); };
			step.sleep = function sleep(name, ms) { return hostSleep(name, ms); };
			// Absolute-time pause: convert to a relative delay and reuse step.sleep so
			// it inherits the same durable record/replay. The host clamps non-finite or
			// negative ms to 0, so a past or unparseable time becomes a 0-delay pause
			// (suspends once, then reschedules immediately).
			const toMs = function (when) {
				if (typeof when === 'number') return when;
				if (when instanceof Date) return when.getTime();
				return Date.parse(when);
			};
			step.sleepUntil = function sleepUntil(name, when) {
				return step.sleep(name, toMs(when) - Date.now());
			};
			// Typed op call by id: walk corsair.<plugin>.api.<seg...> over the same
			// membrane the workflow uses, inside step() so it inherits memo / replay /
			// failed-step recording. No new host reference crosses — corsairRef is the
			// already-hardened client. Accept the call-path form the agent emits too
			// ("linear.api.issues.create" == "linear.issues.create"), matching step.ai.
			step.corsair = function corsair(name, op, input) {
				return step(name, function () {
					const dot = op.indexOf('.');
					if (dot < 1) throw new Error('Invalid op "' + op + '": expected "<plugin>.<endpoint.path>"');
					const path = op.slice(dot + 1).split('.');
					if (path[0] === 'api') path.shift();
					let node = corsairRef[op.slice(0, dot)];
					node = node && node.api;
					for (let i = 0; i < path.length; i++) node = node && node[path[i]];
					if (typeof node !== 'function') throw new Error('Unknown op "' + op + '"');
					return node(input);
				});
			};
			// Each ai verb routes through step() so it inherits memo / replay /
			// failed-step recording; opts are serialized in-realm and the JSON-string
			// result is parsed back in-realm, so no host object reference crosses.
			const verb = function (kind) {
				return function (name, opts) {
					return step(name, function () {
						return hostAi(kind, name, JSON.stringify(opts)).then(function (s) {
							return JSON.parse(s);
						});
					});
				};
			};
			const ai = verb('text');
			ai.object = verb('object');
			ai.enum = verb('enum');
			ai.bool = verb('bool');
			step.ai = ai;
			return step;
		})`,
		context,
		{ filename: 'corsair:sandbox:step' },
	) as (
		hostRun: (name: string, fn: () => Promise<unknown>) => Promise<unknown>,
		hostSleep: (name: string, ms: number) => Promise<void>,
		hostAi: (kind: string, name: string, optsJson: string) => Promise<string>,
		corsairRef: unknown,
	) => WorkflowStep;
	const realmStep = makeStep(
		(name, fn) => input.step(name, fn),
		(name, ms) => input.step.sleep(name, ms),
		(kind, name, optsJson) => input.ai(kind, name, optsJson),
		hardenedCorsair,
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
	sandbox.__corsair = hardenedCorsair;
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
	/** Outputs of steps that already completed on prior attempts, keyed by stepId. */
	memoizedSteps?: Record<string, { output: unknown }>;
	/** Runs one `step.ai` inference against Hub. Absent when Hub isn't configured. */
	ai?: AiStepCallback;
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
		const stepId = computeStepId(name, current);

		// Replay: a completed step from a prior attempt is not re-executed and not
		// re-reported (Hub already has it persisted). Keyed by stepId so loops /
		// reused names don't collide. Harden the stored output so the sandbox gets
		// a safe view rather than a bare host object.
		if (Object.hasOwn(memo, stepId)) {
			return harden(memo[stepId]!.output, undefined) as T;
		}

		try {
			const output = await fn();
			steps.push({ stepId, name, seq: current, status: 'completed', output });
			return output;
		} catch (err) {
			if (isSleepInterrupt(err)) throw err;
			const message = toMessage(err);
			steps.push({
				stepId,
				name,
				seq: current,
				status: 'failed',
				error: message,
			});
			const wrapped = new Error(message);
			(wrapped as unknown as Record<string, unknown>)[FAILED_STEP_MARKER] =
				name;
			throw wrapped;
		}
	}) as WorkflowStep;

	step.sleep = async (name: string, ms: number): Promise<void> => {
		if (pendingSleep) throw pendingSleep;
		const current = seq++;
		const stepId = computeStepId(name, current);
		// Already slept on a prior attempt — the pause is satisfied, continue.
		if (Object.hasOwn(memo, stepId)) return;
		// First encounter: record the sleep as a completed step (so the next attempt
		// replays past it) and unwind to hand control back to Hub.
		steps.push({
			stepId,
			name,
			seq: current,
			status: 'completed',
			output: null,
		});
		// Guard non-finite ms: `Date.now() + NaN` → `new Date(NaN).toISOString()`
		// throws, turning a sleep into an infra failure.
		const delay = Number.isFinite(ms) ? Math.max(0, ms) : 0;
		pendingSleep = new SleepInterrupt(Date.now() + delay, name);
		throw pendingSleep;
	};

	// Bridges the realm's `step.ai` to the host `ai` capability: parse the
	// in-realm-serialized opts and run one inference. Rejects clearly when Hub
	// (hence `ai`) wasn't wired, so the workflow surfaces a failed step rather
	// than a TypeError.
	const aiBridge = (
		kind: string,
		name: string,
		optsJson: string,
	): Promise<string> => {
		if (!input.ai) {
			return Promise.reject(
				new Error('step.ai is unavailable: Hub is not configured for this run'),
			);
		}
		const opts = JSON.parse(optsJson) as {
			input?: unknown;
			prompt?: string;
			returnObject?: AiStepRequest['returnObject'];
			options?: readonly string[];
			model?: string;
		};
		return input.ai({
			kind: kind as AiStepRequest['kind'],
			stepName: name,
			input: opts.input,
			prompt: opts.prompt ?? '',
			returnObject: opts.returnObject,
			options: opts.options,
			model: opts.model,
		});
	};

	try {
		await runWorkflowInSandbox({
			code: input.code,
			corsair: input.corsair,
			payload: input.payload,
			step,
			ai: aiBridge,
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
