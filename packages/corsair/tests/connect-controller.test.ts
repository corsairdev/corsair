import {
	connectReducer,
	initialConnectState,
	isPluginConnected,
	resolveBoundaryAction,
	retryAfterConnect,
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
