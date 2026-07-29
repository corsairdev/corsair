import * as vm from 'node:vm';
import { runReadonly } from '../core/permissions';
import type { ProbeResultPayload } from '../hub/contracts/tunnel';
import { harden, toMessage } from './execute';

// ─────────────────────────────────────────────────────────────────────────────
// Read-only probe runner (app side)
//
// Runs a short, agent-authored script against the tenant's Corsair client purely
// to READ real data — so the authoring agent can ground on real ids/values
// instead of guessing them. Two guarantees stack:
//   • runReadonly(): any write/destructive endpoint the script touches throws
//     ReadonlyForbiddenError (enforced in core/endpoints/bind.ts). A probe can
//     look, never change.
//   • node:vm realm + membrane: same host-isolation as the executor — no host
//     globals (process/require/fetch), and `corsair` is the hardened Proxy, so
//     the script can navigate the client but can't reach the host Function ctor.
//
// The result is serialized to a JSON string INSIDE the vm, under the script's own
// readonly scope, and only the string is handed back — the host never invokes
// script-defined toJSON()/getters (which would otherwise run outside the scope).
// ─────────────────────────────────────────────────────────────────────────────

const PROBE_TIMEOUT_MS = 10_000;

export type ReadonlyProbeInput = {
	/** Tenant-scoped Corsair client the script reads through (as `corsair`). */
	corsair: unknown;
	/** Async JS body with `corsair` in scope; `return` the value to hand back. */
	code: string;
	/** Max run time in ms. Defaults to {@link PROBE_TIMEOUT_MS}. */
	timeoutMs?: number;
};

/** The runner's result IS the wire contract — one source of truth (no drift). */
export type ReadonlyProbeResult = ProbeResultPayload;

/**
 * Runs `input.code` read-only against `input.corsair` in a locked-down vm realm
 * and returns its value. Never throws — failures (including a write attempt) come
 * back as `{ status: 'error' }`.
 */
export async function runReadonlyProbe(
	input: ReadonlyProbeInput,
): Promise<ReadonlyProbeResult> {
	// Null-proto global → the script's prototype chain can't reach host intrinsics.
	const sandbox = Object.create(null) as Record<string, unknown>;
	const context = vm.createContext(sandbox, {
		name: 'corsair-probe',
		codeGeneration: { strings: false, wasm: false },
	});
	// The only capability in scope is the hardened client, exposed as `corsair`.
	sandbox.corsair = harden(input.corsair, undefined);

	// Clamp into (0, PROBE_TIMEOUT_MS]: non-positive / non-finite falls back to the
	// default, and anything larger is capped so a payload can't extend the synchronous
	// vm deadline and hold the host event loop.
	const timeoutMs = clampProbeTimeout(input.timeoutMs);

	// Serialize INSIDE the vm, in the script's own readonly context: a toJSON()/getter
	// that reaches a write endpoint during stringify throws there (blocked) and
	// surfaces as { status: 'error' } — never a masked null. A genuine serialization
	// failure (e.g. a circular value) likewise surfaces as an error, not a null. The
	// host only ever parses a plain string, so it never runs script-defined callbacks.
	const wrapped = `(async () => {
const __result = await (async () => {
${input.code}
})();
return JSON.stringify(__result) ?? 'null';
})()`;

	try {
		// vm.runInContext executes the script synchronously up to its first `await`
		// (the first client call), so the readonly scope must already be active when
		// the promise is created — later continuations inherit it. assertReadonlyAllowed
		// runs host-side per call.
		const raw = await runReadonly(() => {
			const script = vm.runInContext(wrapped, context, {
				filename: 'corsair:probe',
				timeout: timeoutMs,
			}) as Promise<unknown>;
			// The vm `timeout` only bounds synchronous execution up to the first
			// `await`. Bound the async remainder with a wall-clock race so a slow or
			// never-settling *async* read can't hang the handler. Ceiling: a post-await
			// synchronous CPU loop can still block this timer on the same event loop —
			// an in-thread limit shared with the run executor; fully bounding it needs
			// worker/process isolation (tracked separately). A detached, timed-out
			// script stays read-only; clearTimeout frees a finished probe's timer.
			void script.catch(() => {});
			let timer: ReturnType<typeof setTimeout>;
			const wallClock = new Promise<never>((_resolve, reject) => {
				timer = setTimeout(
					() => reject(new Error(`Probe exceeded ${timeoutMs}ms time limit`)),
					timeoutMs,
				);
			});
			return Promise.race([script, wallClock]).finally(() =>
				clearTimeout(timer),
			);
		});

		return { status: 'ok', value: parseProbeJson(raw) };
	} catch (err) {
		return { status: 'error', error: toMessage(err) };
	}
}

/** The vm returns a JSON string (serialized in-scope); parse it to host data. A
 * non-string or unparseable value means the runner itself is broken — throw so
 * it surfaces as `{ status: 'error' }` instead of masking a bug as a null value. */
function parseProbeJson(raw: unknown): unknown {
	if (typeof raw !== 'string') {
		throw new Error(`Probe returned a non-string result (${typeof raw})`);
	}
	return JSON.parse(raw);
}

/**
 * Clamps a caller-supplied timeout into (0, {@link PROBE_TIMEOUT_MS}]. Non-finite or
 * non-positive values fall back to the default; a larger value is capped so a probe
 * payload can't extend the synchronous vm deadline and block the host event loop.
 */
export function clampProbeTimeout(ms: number | undefined): number {
	if (typeof ms !== 'number' || !Number.isFinite(ms) || ms <= 0) {
		return PROBE_TIMEOUT_MS;
	}
	return Math.min(ms, PROBE_TIMEOUT_MS);
}
