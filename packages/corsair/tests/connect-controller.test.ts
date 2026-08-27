import {
	CONNECTED_MESSAGE_TYPE,
	connectReducer,
	initialConnectState,
	isConnectedMessage,
	isPluginConnected,
	originOf,
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

describe('isConnectedMessage', () => {
	const hub = 'https://hub.corsair.dev';
	it('accepts the connected message from the trusted origin', () => {
		expect(isConnectedMessage({ type: CONNECTED_MESSAGE_TYPE }, hub, hub)).toBe(
			true,
		);
	});
	it('rejects a message from any other origin', () => {
		expect(
			isConnectedMessage(
				{ type: CONNECTED_MESSAGE_TYPE },
				'https://evil.com',
				hub,
			),
		).toBe(false);
	});
	it('rejects the wrong message type, non-objects, and an empty trusted origin', () => {
		expect(isConnectedMessage({ type: 'other' }, hub, hub)).toBe(false);
		expect(isConnectedMessage('corsair:connected', hub, hub)).toBe(false);
		expect(isConnectedMessage({ type: CONNECTED_MESSAGE_TYPE }, '', '')).toBe(
			false,
		);
	});
});

describe('originOf', () => {
	it('returns the origin of a valid url, null otherwise', () => {
		expect(originOf('https://hub.corsair.dev/connect/tok')).toBe(
			'https://hub.corsair.dev',
		);
		expect(originOf('not a url')).toBeNull();
	});
});
