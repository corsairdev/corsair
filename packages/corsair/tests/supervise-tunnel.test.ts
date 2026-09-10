import { superviseTunnel } from '../core';

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('superviseTunnel', () => {
	it('restarts the tunnel when it dies (frpc death used to leave it down forever)', async () => {
		const scheduled: Array<() => void> = [];
		let starts = 0;
		let die: () => void = () => {};

		superviseTunnel({
			start: (onClose) => {
				starts++;
				die = onClose;
				return Promise.resolve();
			},
			schedule: (fn) => scheduled.push(fn),
			minDelayMs: 1,
			maxDelayMs: 8,
		});

		await flush();
		expect(starts).toBe(1);

		die();
		expect(scheduled).toHaveLength(1);
		scheduled.pop()!();
		await flush();

		// Before the fix, a dead tunnel was never restarted — starts stayed at 1.
		expect(starts).toBe(2);
	});

	it('collapses a double death signal (reject + onClose) into one restart', async () => {
		const scheduled: Array<() => void> = [];

		// runTunnel's fail() path kills the child (fires onClose) *and* rejects the
		// promise for the same dead attempt. Both must yield a single restart.
		superviseTunnel({
			start: (onClose) => {
				onClose();
				return Promise.reject(new Error('frpc timed out'));
			},
			schedule: (fn) => scheduled.push(fn),
			minDelayMs: 1,
			maxDelayMs: 8,
		});

		await flush();
		expect(scheduled).toHaveLength(1);
	});

	it('backs off exponentially on repeated start failures and caps', async () => {
		const timers: Array<{ fn: () => void; ms: number }> = [];
		let starts = 0;

		superviseTunnel({
			start: () => {
				starts++;
				return Promise.reject(new Error('no frps'));
			},
			schedule: (fn, ms) => timers.push({ fn, ms }),
			minDelayMs: 1,
			maxDelayMs: 4,
		});

		const seen: number[] = [];
		for (let i = 0; i < 5; i++) {
			await flush();
			const t = timers.shift();
			if (!t) break;
			seen.push(t.ms);
			t.fn();
		}

		expect(seen).toEqual([1, 2, 4, 4, 4]);
	});

	it('resets the backoff after a healthy start', async () => {
		const timers: Array<{ fn: () => void; ms: number }> = [];
		let healthy = true;
		let die: () => void = () => {};

		superviseTunnel({
			start: (onClose) => {
				die = onClose;
				return healthy ? Promise.resolve() : Promise.reject(new Error('down'));
			},
			schedule: (fn, ms) => timers.push({ fn, ms }),
			minDelayMs: 1,
			maxDelayMs: 16,
		});

		await flush();
		// Two failing cycles push the backoff up.
		healthy = false;
		die();
		timers.shift()!.fn();
		await flush();
		timers.shift()!.fn();
		await flush();
		// Recover, then die once more: the delay must be back at the minimum.
		healthy = true;
		timers.shift()!.fn();
		await flush();
		die();

		expect(timers.shift()!.ms).toBe(1);
	});
});
