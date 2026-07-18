export type { BrowserDeliveryPayload } from '../hub/contracts/tunnel';
export { BROWSER_DELIVERY_TTL_MS } from '../hub/contracts/tunnel';
export {
	buildBrowserDeliveryRedirectUrl,
	signBrowserDeliveryToken,
	verifyBrowserDeliveryToken,
} from '../hub/signing/browser-delivery';

export function isAuthCredentialsBrowserDelivery(
	payload: import('../hub/contracts/tunnel').BrowserDeliveryPayload,
): boolean {
	return payload.deliveryMode === 'auth.credentials';
}

export function isConnectionsSyncBrowserDelivery(
	payload: import('../hub/contracts/tunnel').BrowserDeliveryPayload,
): boolean {
	return payload.deliveryMode === 'connections.sync';
}

export function isPermissionBrowserDelivery(
	payload: import('../hub/contracts/tunnel').BrowserDeliveryPayload,
): boolean {
	return (
		payload.deliveryMode === 'permission.approve' ||
		payload.deliveryMode === 'permission.deny'
	);
}

export function isManagedBrowserDelivery(
	payload: import('../hub/contracts/tunnel').BrowserDeliveryPayload,
): boolean {
	return payload.deliveryMode === 'oauth.tokens';
}

export function isByoOAuthBrowserDelivery(
	payload: import('../hub/contracts/tunnel').BrowserDeliveryPayload,
): boolean {
	return (
		payload.deliveryMode === 'oauth.callback' ||
		(payload.deliveryMode === undefined &&
			!isAuthCredentialsBrowserDelivery(payload) &&
			!isConnectionsSyncBrowserDelivery(payload) &&
			!isPermissionBrowserDelivery(payload) &&
			!isManagedBrowserDelivery(payload))
	);
}
