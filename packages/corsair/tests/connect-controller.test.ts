import type { ConnectState } from '../client/react/connect-controller';
import {
	confirmConnected,
	connectReducer,
	createConnectWaiters,
	initialConnectState,
	isConnectError,
	isPluginConnected,
	resolveBoundaryAction,
	retryAfterConnect,
	shouldCoalesceConnect,
	shouldSettleConnected,
} from '../client/react/connect-controller';

const noSleep = () => Promise.resolve();

describe('connectReducer', () => {
	it('OPEN moves to connecting and holds the plugin, link, and tenant', () => {
		const s = connectReducer(initialConnectState, {
			type: 'OPEN',
			plugin: 'gmail',
			connectUrl: 'https://hub/connect/tok',
			tenantId: 'acme',
		});
		expect(s).toEqual({
			phase: 'connecting',
			plugin: 'gmail',
			connectUrl: 'https://hub/connect/tok',
			tenantId: 'acme',
		});
	});

	it('SUCCESS marks success but keeps the plugin for the caller', () => {
		const open = connectReducer(initialConnectState, {
			type: 'OPEN',
			plugin: 'gmail',
			connectUrl: 'https://hub/connect/tok',
			tenantId: null,
		});
		expect(connectReducer(open, { type: 'SUCCESS' })).toMatchObject({
			phase: 'success',
			plugin: 'gmail',
		});
	});

	it('CLOSE returns to idle', () => {
		const open = connectReducer(initialConnectState, {
			type: 'OPEN',
			plugin: 'gmail',
			connectUrl: 'https://hub/connect/tok',
			tenantId: null,
		});
		expect(connectReducer(open, { type: 'CLOSE' })).toEqual(
			initialConnectState,
		);
	});
});

describe('isPluginConnected', () => {
	it('is true only when the plugin reads connected', () => {
		expect(isPluginConnected({ gmail: 'connected' }, 'gmail')).toBe(true);
		expect(isPluginConnected({ gmail: 'not_connected' }, 'gmail')).toBe(false);
		expect(isPluginConnected({ gmail: 'missing_credentials' }, 'gmail')).toBe(
			false,
		);
		expect(isPluginConnected({}, 'gmail')).toBe(false);
		expect(isPluginConnected(null, 'gmail')).toBe(false);
	});
});

describe('shouldSettleConnected', () => {
	const connected = { gmail: 'connected' } as const;

	it('settles when the poll is current and the plugin is connected', () => {
		expect(
			shouldSettleConnected({
				capturedAttempt: 3,
				currentAttempt: 3,
				status: connected,
				plugin: 'gmail',
			}),
		).toBe(true);
	});

	it('ignores a poll from a superseded or closed attempt', () => {
		expect(
			shouldSettleConnected({
				capturedAttempt: 2,
				currentAttempt: 3,
				status: connected,
				plugin: 'gmail',
			}),
		).toBe(false);
	});

	it('does not settle when the plugin is not yet connected', () => {
		expect(
			shouldSettleConnected({
				capturedAttempt: 3,
				currentAttempt: 3,
				status: { gmail: 'not_connected' },
				plugin: 'gmail',
			}),
		).toBe(false);
	});
});

describe('resolveBoundaryAction', () => {
	it('retries the render once the user connects', () => {
		expect(resolveBoundaryAction('connected')).toBe('retry');
	});

	it('rethrows when nothing was pending — a genuine error, not auth-missing', () => {
		expect(resolveBoundaryAction('none')).toBe('rethrow');
	});

	it('shows the dismissed state when the user closes the dialog', () => {
		expect(resolveBoundaryAction('cancelled')).toBe('dismissed');
	});
});

describe('retryAfterConnect', () => {
	it('returns the first result without retrying', async () => {
		let calls = 0;
		const fn = () => {
			calls += 1;
			return Promise.resolve('ok');
		};
		await expect(retryAfterConnect(fn, { sleep: noSleep })).resolves.toBe('ok');
		expect(calls).toBe(1);
	});

	it('retries past the credential-propagation window, then succeeds', async () => {
		let calls = 0;
		const fn = () => {
			calls += 1;
			if (calls < 3) return Promise.reject(new Error('[auth-missing:linear]'));
			return Promise.resolve(42);
		};
		await expect(retryAfterConnect(fn, { sleep: noSleep })).resolves.toBe(42);
		expect(calls).toBe(3);
	});

	it('throws the last error once the retry budget is spent', async () => {
		let calls = 0;
		const fn = () => {
			calls += 1;
			return Promise.reject(new Error(`fail ${calls}`));
		};
		await expect(
			retryAfterConnect(fn, { retries: 2, sleep: noSleep }),
		).rejects.toThrow('fail 3');
		expect(calls).toBe(3);
	});

	it('backs off between attempts using the injected sleeper', async () => {
		const waits: number[] = [];
		let calls = 0;
		const fn = () => {
			calls += 1;
			if (calls < 3) return Promise.reject(new Error('nope'));
			return Promise.resolve('done');
		};
		await retryAfterConnect(fn, {
			backoffMs: 100,
			sleep: (ms) => {
				waits.push(ms);
				return Promise.resolve();
			},
		});
		expect(waits).toEqual([100, 200]);
	});
});

describe('confirmConnected', () => {
	it('returns true on the first poll when already connected', async () => {
		let calls = 0;
		const getStatus = () => {
			calls += 1;
			return Promise.resolve({ github: 'connected' as const });
		};
		await expect(
			confirmConnected(getStatus, 'github', { sleep: noSleep }),
		).resolves.toBe(true);
		expect(calls).toBe(1);
	});

	it('rides out status lag: not-connected then connected', async () => {
		let calls = 0;
		const getStatus = () => {
			calls += 1;
			return Promise.resolve(
				calls < 3
					? { github: 'not_connected' as const }
					: { github: 'connected' as const },
			);
		};
		await expect(
			confirmConnected(getStatus, 'github', { sleep: noSleep }),
		).resolves.toBe(true);
		expect(calls).toBe(3);
	});

	it('does not discard success when an early poll throws (the Greptile case)', async () => {
		let calls = 0;
		const getStatus = () => {
			calls += 1;
			if (calls === 1) return Promise.reject(new Error('network blip'));
			return Promise.resolve({ github: 'connected' as const });
		};
		await expect(
			confirmConnected(getStatus, 'github', { sleep: noSleep }),
		).resolves.toBe(true);
		expect(calls).toBe(2);
	});

	it('returns false only after every attempt shows not-connected', async () => {
		let calls = 0;
		const getStatus = () => {
			calls += 1;
			return Promise.resolve({ github: 'not_connected' as const });
		};
		await expect(
			confirmConnected(getStatus, 'github', { retries: 2, sleep: noSleep }),
		).resolves.toBe(false);
		expect(calls).toBe(3);
	});

	it('backs off between attempts using the injected sleeper', async () => {
		const waits: number[] = [];
		const getStatus = () =>
			Promise.resolve({ github: 'not_connected' as const });
		await confirmConnected(getStatus, 'github', {
			retries: 2,
			backoffMs: 100,
			sleep: (ms) => {
				waits.push(ms);
				return Promise.resolve();
			},
		});
		expect(waits).toEqual([100, 200]);
	});
});

describe('isConnectError', () => {
	it('matches the auth-missing marker message', () => {
		expect(isConnectError(new Error('[auth-missing:linear:oauth_2]'))).toBe(
			true,
		);
	});

	it('matches the reconnect-required message', () => {
		expect(isConnectError(new Error('Reconnect required'))).toBe(true);
	});

	it('matches by error name when the message was replaced', () => {
		const e = new Error('An error occurred in the Server Components render');
		e.name = 'AuthMissingError';
		expect(isConnectError(e)).toBe(true);
	});

	it('matches a bare string reason', () => {
		expect(isConnectError('[auth-missing:slack:oauth_2]')).toBe(true);
	});

	it('ignores unrelated rejections and empty reasons', () => {
		expect(isConnectError(new Error('boom'))).toBe(false);
		expect(isConnectError('network down')).toBe(false);
		expect(isConnectError(null)).toBe(false);
		expect(isConnectError(undefined)).toBe(false);
		expect(isConnectError({})).toBe(false);
	});
});

describe('createConnectWaiters', () => {
	it('settles every waiter of an in-flight flow, not just the last', () => {
		const waiters = createConnectWaiters();
		const seen: boolean[] = [];
		waiters.add((ok) => seen.push(ok));
		waiters.add((ok) => seen.push(ok));
		expect(waiters.size()).toBe(2);
		waiters.settleAll(true);
		expect(seen).toEqual([true, true]);
		expect(waiters.size()).toBe(0);
	});

	it('clears after settling so a later settle is a no-op', () => {
		const waiters = createConnectWaiters();
		const seen: boolean[] = [];
		waiters.add((ok) => seen.push(ok));
		waiters.settleAll(false);
		waiters.settleAll(true);
		expect(seen).toEqual([false]);
	});

	it('a superseding settle only reaches waiters added since the last settle', () => {
		const waiters = createConnectWaiters();
		const first: boolean[] = [];
		const second: boolean[] = [];
		waiters.add((ok) => first.push(ok));
		waiters.settleAll(false);
		waiters.add((ok) => second.push(ok));
		waiters.settleAll(true);
		expect(first).toEqual([false]);
		expect(second).toEqual([true]);
	});
});

describe('shouldCoalesceConnect', () => {
	const connecting = (
		plugin: string,
		tenantId: string | null = null,
	): ConnectState => ({
		phase: 'connecting',
		plugin,
		connectUrl: 'https://hub/connect/tok',
		tenantId,
	});

	it('joins a second call for the same plugin and tenant', () => {
		expect(
			shouldCoalesceConnect(connecting('linear'), 'linear', null, true),
		).toBe(true);
		expect(
			shouldCoalesceConnect(
				connecting('linear', 'acme'),
				'linear',
				'acme',
				true,
			),
		).toBe(true);
	});

	it('supersedes when a different plugin is requested', () => {
		expect(
			shouldCoalesceConnect(connecting('linear'), 'slack', null, true),
		).toBe(false);
	});

	it('supersedes the same plugin for a different tenant', () => {
		expect(
			shouldCoalesceConnect(
				connecting('linear', 'acme'),
				'linear',
				'globex',
				true,
			),
		).toBe(false);
	});

	it('joins a same-tenant reactive failure while a proactive flow is open', () => {
		// Both paths resolve the tenant server-side, so a concurrent same-tenant
		// failure coalesces onto the open flow instead of superseding it.
		expect(
			shouldCoalesceConnect(
				connecting('linear', 'acme'),
				'linear',
				'acme',
				true,
			),
		).toBe(true);
	});

	it('supersedes across the default tenant regardless of null vs concrete', () => {
		// The proactive path used to pass null while the reactive path passed the
		// resolved id; both now carry the concrete tenant, but the pure check still
		// treats null and a concrete id as distinct scopes.
		expect(
			shouldCoalesceConnect(
				connecting('linear', 'default'),
				'linear',
				null,
				true,
			),
		).toBe(false);
		expect(
			shouldCoalesceConnect(
				connecting('linear', null),
				'linear',
				'default',
				true,
			),
		).toBe(false);
	});

	it('does not join a settled flow whose waiters already cleared', () => {
		// finishConnected empties the waiters and stops the watch before React
		// commits the success state, so the state still reads connecting for a
		// beat. Without the liveness gate a same-tenant call would join the dead
		// flow and hang, since nothing settles waiters again.
		expect(
			shouldCoalesceConnect(
				connecting('linear', 'acme'),
				'linear',
				'acme',
				false,
			),
		).toBe(false);
	});

	it('does not coalesce when idle or already succeeded', () => {
		expect(
			shouldCoalesceConnect(initialConnectState, 'linear', null, true),
		).toBe(false);
		expect(
			shouldCoalesceConnect(
				{ ...connecting('linear'), phase: 'success' },
				'linear',
				null,
				true,
			),
		).toBe(false);
	});
});
