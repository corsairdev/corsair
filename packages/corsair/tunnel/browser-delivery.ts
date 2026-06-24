export type { BrowserDeliveryPayload } from '../hub/contracts/tunnel';
export { BROWSER_DELIVERY_TTL_MS } from '../hub/contracts/tunnel';
export {
	buildBrowserDeliveryRedirectUrl,
	signBrowserDeliveryToken,
	verifyBrowserDeliveryToken,
} from '../hub/signing/browser-delivery';

export function isConnectStatusBrowserDelivery(
	payload: import('../hub/contracts/tunnel').BrowserDeliveryPayload,
): boolean {
	return payload.deliveryMode === 'connect.status';
}

export function isAuthCredentialsBrowserDelivery(
	payload: import('../hub/contracts/tunnel').BrowserDeliveryPayload,
): boolean {
	return payload.deliveryMode === 'auth.credentials';
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
			!isConnectStatusBrowserDelivery(payload) &&
			!isAuthCredentialsBrowserDelivery(payload) &&
			!isPermissionBrowserDelivery(payload) &&
			!isManagedBrowserDelivery(payload))
	);
}
