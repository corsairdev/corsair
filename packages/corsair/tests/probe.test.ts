import {
	assertReadonlyAllowed,
	isReadonlyScopeActive,
} from '../core/permissions';
import { clampProbeTimeout, runReadonlyProbe } from '../workflows/probe';

// Poll until an observable flag flips instead of sleeping a fixed duration, so a
// slow runner can't assert before a post-timeout continuation has resumed.
async function waitFor(
	predicate: () => boolean,
	budgetMs = 2_000,
): Promise<void> {
	const deadline = Date.now() + budgetMs;
	while (!predicate() && Date.now() < deadline) {
		await new Promise((resolve) => setTimeout(resolve, 5));
	}
}

describe('runReadonlyProbe', () => {
	it('returns the script value, reading through the client', async () => {
		const corsair = {
			db: { query: async (x: unknown) => ({ rows: [x] }) },
		};
		const result = await runReadonlyProbe({
			corsair,
			code: 'const r = await corsair.db.query("ping"); return r.rows[0];',
		});
		expect(result).toEqual({ status: 'ok', value: 'ping' });
	});

	it('runs the client calls inside a readonly scope', async () => {
		// The endpoint sees the active readonly scope, proving runReadonly reaches
		// the client calls the script makes (this is what makes writes throw).
		const corsair = {
			probe: { check: async () => isReadonlyScopeActive() },
		};
		const result = await runReadonlyProbe({
			corsair,
			code: 'return await corsair.probe.check();',
		});
		expect(result).toEqual({ status: 'ok', value: true });
	});

	it('has no host globals in scope', async () => {
		const result = await runReadonlyProbe({
			corsair: {},
			code: 'return typeof process + "," + typeof require + "," + typeof fetch;',
		});
		expect(result).toEqual({
			status: 'ok',
			value: 'undefined,undefined,undefined',
		});
	});

	it('returns an error instead of throwing when the script fails', async () => {
		const result = await runReadonlyProbe({
			corsair: {},
			code: 'throw new Error("boom");',
		});
		expect(result).toEqual({ status: 'error', error: 'boom' });
	});

	it('returns an error when the script attempts a write', async () => {
		// A write endpoint calls assertReadonlyAllowed(path, 'write'), which throws
		// ReadonlyForbiddenError under the active scope — the exact guard bind.ts
		// applies to every real endpoint. Proves a probe can look, never change.
		const corsair = {
			slack: {
				send: async () => {
					assertReadonlyAllowed('slack.messages.post', 'write');
					return 'sent';
				},
			},
		};
		const result = await runReadonlyProbe({
			corsair,
			code: 'return await corsair.slack.send();',
		});
		expect(result.status).toBe('error');
	});

	it('times out an async probe that never settles', async () => {
		// The vm timeout only bounds synchronous work; this proves the wall-clock
		// race bounds an async read that never resolves, instead of hanging the
		// delivery handler forever.
		const corsair = { slow: { read: () => new Promise(() => {}) } };
		const result = await runReadonlyProbe({
			corsair,
			code: 'return await corsair.slow.read();',
			timeoutMs: 50,
		});
		expect(result.status).toBe('error');
	});

	it('surfaces a write attempted by toJSON during serialization as an error', async () => {
		// A returned object with a script-defined toJSON() is invoked by JSON.stringify,
		// which runs INSIDE the vm's readonly scope — so a write from toJSON is blocked
		// (assertReadonlyAllowed throws) and surfaces as { status: 'error' }, not a
		// masked null. A host-side JSON.stringify of the returned object would instead
		// invoke that callback outside the scope.
		let wrote = false;
		const corsair = {
			slack: {
				send: () => {
					assertReadonlyAllowed('slack.messages.post', 'write');
					wrote = true;
					return 'sent';
				},
			},
		};
		const result = await runReadonlyProbe({
			corsair,
			code: 'return { toJSON() { corsair.slack.send(); return "x"; } };',
		});
		// toJSON runs synchronously inside runReadonlyProbe, so the result is
		// already settled here — no continuation to wait for.
		expect(wrote).toBe(false); // write blocked during serialization
		expect(result.status).toBe('error'); // surfaced as an error, not a masked null
	});

	it('keeps readonly on a continuation that resumes after the timeout', async () => {
		// Adversarial: a read resolves AFTER the wall-clock timeout, then the script
		// tries a write. The timeout settles the delivery, but the detached
		// continuation must STILL be under runReadonly — AsyncLocalStorage propagates
		// the scope to it — so the write throws. No escape past the readonly guard.
		let sendAttempted = false;
		let wrote = false;
		let resolveRead: ((val: string) => void) | undefined;
		const corsair = {
			slow: {
				read: () =>
					new Promise<string>((resolve) => {
						resolveRead = resolve;
					}),
			},
			slack: {
				send: async () => {
					sendAttempted = true; // the post-timeout continuation actually reached here
					assertReadonlyAllowed('slack.messages.post', 'write');
					wrote = true;
					return 'sent';
				},
			},
		};
		const result = await runReadonlyProbe({
			corsair,
			code: 'await corsair.slow.read(); return await corsair.slack.send();',
			timeoutMs: 15,
		});
		expect(result.status).toBe('error'); // timed out first
		// Let the detached continuation resume past the now-resolved slow read.
		if (resolveRead) {
			resolveRead('late');
		}
		await waitFor(() => sendAttempted);
		expect(sendAttempted).toBe(true); // proves the continuation DID resume post-timeout
		expect(wrote).toBe(false); // and the write was still blocked by readonly
	});
});

describe('clampProbeTimeout', () => {
	it('caps a too-large timeout at the default max', () => {
		expect(clampProbeTimeout(1_000_000_000)).toBe(10_000);
	});

	it('keeps a valid in-range timeout', () => {
		expect(clampProbeTimeout(50)).toBe(50);
	});

	it('falls back to the default for non-positive / non-finite values', () => {
		expect(clampProbeTimeout(0)).toBe(10_000);
		expect(clampProbeTimeout(-5)).toBe(10_000);
		expect(clampProbeTimeout(Number.NaN)).toBe(10_000);
		expect(clampProbeTimeout(undefined)).toBe(10_000);
	});
});
