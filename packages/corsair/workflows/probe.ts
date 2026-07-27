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
// The script's return value is the probe result. Unlike a workflow run there is
// no step/memoization/durability — it's a synchronous lookup.
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

	// Clamp: a non-positive / non-finite timeout would make vm's `timeout` throw a
	// RangeError. Fall back to the default instead.
	const requested = input.timeoutMs;
	const timeoutMs =
		typeof requested === 'number' && Number.isFinite(requested) && requested > 0
			? requested
			: PROBE_TIMEOUT_MS;

	try {
		// Run inside the readonly scope: vm.runInContext executes the script
		// synchronously up to its first `await` (the first client call), so the
		// scope must already be active when the promise is created — later
		// continuations inherit it. assertReadonlyAllowed runs host-side per call.
		const value = await runReadonly(() => {
			const script = vm.runInContext(
				`(async () => {\n${input.code}\n})()`,
				context,
				{ filename: 'corsair:probe', timeout: timeoutMs },
			) as Promise<unknown>;
			// The vm `timeout` only bounds synchronous execution up to the first
			// `await`. Bound the async remainder with a wall-clock race so a slow or
			// never-settling *async* read can't hang the handler. Note the ceiling: a
			// post-await synchronous CPU loop can still block this timer on the same
			// event loop — an in-thread limit shared with the run executor; fully
			// bounding it needs worker/process isolation (tracked separately). A
			// detached, timed-out script can't write (readonly); clearTimeout frees a
			// finished probe's timer.
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

		// Flatten realm-native / proxied values to plain host JSON for the wire.
		return { status: 'ok', value: toSerializable(value) };
	} catch (err) {
		return { status: 'error', error: toMessage(err) };
	}
}

/** JSON round-trip so the result is plain, wire-safe host data (no realm proxies). */
function toSerializable(value: unknown): unknown {
	if (value === undefined) return null;
	try {
		return JSON.parse(JSON.stringify(value));
	} catch {
		return null;
	}
}
