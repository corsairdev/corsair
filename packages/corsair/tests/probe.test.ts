import {
	assertReadonlyAllowed,
	isReadonlyScopeActive,
} from '../core/permissions';
import { runReadonlyProbe } from '../workflows/probe';

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

	it('blocks a write triggered by toJSON during result serialization', async () => {
		// A returned object with a script-defined toJSON() is invoked by JSON.stringify.
		// Serialization runs INSIDE the vm's readonly scope, so a write from toJSON is
		// blocked (assertReadonlyAllowed throws) instead of escaping after the outer
		// scope resolved — which a host-side JSON.stringify of the returned object would
		// allow.
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
		await new Promise((resolve) => setTimeout(resolve, 20));
		expect(wrote).toBe(false); // write blocked during serialization
		expect(result.status).toBe('ok'); // probe still completes
	});

	it('falls back to the default for a non-positive timeoutMs', async () => {
		// A bad timeoutMs (0/NaN in a payload) must not RangeError the vm — it uses
		// the default and runs normally.
		const result = await runReadonlyProbe({
			corsair: {},
			code: 'return 1;',
			timeoutMs: 0,
		});
		expect(result).toEqual({ status: 'ok', value: 1 });
	});

	it('keeps readonly on a continuation that resumes after the timeout', async () => {
		// Adversarial: a read resolves AFTER the wall-clock timeout, then the script
		// tries a write. The timeout settles the delivery, but the detached
		// continuation must STILL be under runReadonly — AsyncLocalStorage propagates
		// the scope to it — so the write throws. No escape past the readonly guard.
		let sendAttempted = false;
		let wrote = false;
		const corsair = {
			slow: {
				read: () =>
					new Promise((resolve) => setTimeout(() => resolve('late'), 40)),
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
		await new Promise((resolve) => setTimeout(resolve, 80));
		expect(sendAttempted).toBe(true); // proves the continuation DID resume post-timeout
		expect(wrote).toBe(false); // and the write was still blocked by readonly
	});
});
