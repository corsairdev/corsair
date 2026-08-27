import {
	connectReducer,
	initialConnectState,
	isPluginConnected,
	shouldSettleConnected,
} from '../client/react/connect-controller';

describe('connectReducer', () => {
	it('OPEN moves to connecting and holds the plugin + link', () => {
		const s = connectReducer(initialConnectState, {
			type: 'OPEN',
			plugin: 'gmail',
			tenantId: 'acme',
			connectUrl: 'https://hub/connect/tok',
		});
		expect(s).toEqual({
			phase: 'connecting',
			plugin: 'gmail',
			tenantId: 'acme',
			connectUrl: 'https://hub/connect/tok',
		});
	});

	it('SUCCESS marks success but keeps the plugin for the caller', () => {
		const open = connectReducer(initialConnectState, {
			type: 'OPEN',
			plugin: 'gmail',
			tenantId: null,
			connectUrl: 'https://hub/connect/tok',
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
			tenantId: null,
			connectUrl: 'https://hub/connect/tok',
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
