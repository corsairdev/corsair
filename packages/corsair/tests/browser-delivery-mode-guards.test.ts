import type { BrowserDeliveryPayload } from '../hub/contracts/tunnel';
import {
	isAuthCredentialsBrowserDelivery,
	isByoOAuthBrowserDelivery,
	isConnectCreateLinkBrowserDelivery,
	isConnectionsSyncBrowserDelivery,
	isManagedBrowserDelivery,
	isPermissionBrowserDelivery,
} from '../tunnel/browser-delivery';

function basePayload(
	deliveryMode?: BrowserDeliveryPayload['deliveryMode'],
): BrowserDeliveryPayload {
	return {
		jti: 'jti_test',
		connectJti: 'connect_jti_test',
		projectId: 'proj_test',
		plugin: 'slack',
		tenantId: 'default',
		hubSuccessUrl: 'http://localhost:3000',
		exp: 0,
		iat: 0,
		deliveryMode,
	};
}

const MODES: Array<BrowserDeliveryPayload['deliveryMode']> = [
	'auth.credentials',
	'connections.sync',
	'connect.create_link',
	'permission.approve',
	'permission.deny',
	'oauth.tokens',
	'oauth.callback',
];

describe('isAuthCredentialsBrowserDelivery', () => {
	it.each(MODES.map((mode) => [mode, mode === 'auth.credentials'] as const))(
		'%s -> %s',
		(mode, expected) => {
			expect(isAuthCredentialsBrowserDelivery(basePayload(mode))).toBe(
				expected,
			);
		},
	);
});

describe('isConnectionsSyncBrowserDelivery', () => {
	it.each(MODES.map((mode) => [mode, mode === 'connections.sync'] as const))(
		'%s -> %s',
		(mode, expected) => {
			expect(isConnectionsSyncBrowserDelivery(basePayload(mode))).toBe(
				expected,
			);
		},
	);
});

describe('isConnectCreateLinkBrowserDelivery', () => {
	it.each(MODES.map((mode) => [mode, mode === 'connect.create_link'] as const))(
		'%s -> %s',
		(mode, expected) => {
			expect(isConnectCreateLinkBrowserDelivery(basePayload(mode))).toBe(
				expected,
			);
		},
	);
});

describe('isPermissionBrowserDelivery', () => {
	it.each(
		MODES.map(
			(mode) =>
				[
					mode,
					mode === 'permission.approve' || mode === 'permission.deny',
				] as const,
		),
	)('%s -> %s', (mode, expected) => {
		expect(isPermissionBrowserDelivery(basePayload(mode))).toBe(expected);
	});
});

describe('isManagedBrowserDelivery', () => {
	it.each(MODES.map((mode) => [mode, mode === 'oauth.tokens'] as const))(
		'%s -> %s',
		(mode, expected) => {
			expect(isManagedBrowserDelivery(basePayload(mode))).toBe(expected);
		},
	);
});

describe('isByoOAuthBrowserDelivery', () => {
	it.each(MODES.map((mode) => [mode, mode === 'oauth.callback'] as const))(
		'%s -> %s',
		(mode, expected) => {
			expect(isByoOAuthBrowserDelivery(basePayload(mode))).toBe(expected);
		},
	);

	it('falls back to true when deliveryMode is undefined and no other guard matches', () => {
		expect(isByoOAuthBrowserDelivery(basePayload(undefined))).toBe(true);
	});
});
