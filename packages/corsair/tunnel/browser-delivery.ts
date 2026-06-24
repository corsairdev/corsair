import { createHmac, timingSafeEqual } from 'node:crypto';
import type { BrowserDeliveryPayload } from '../hub/contracts/tunnel';
import { BROWSER_DELIVERY_TTL_MS } from '../hub/contracts/tunnel';

export type { BrowserDeliveryPayload } from '../hub/contracts/tunnel';

export function isConnectStatusBrowserDelivery(
	payload: BrowserDeliveryPayload,
): boolean {
	return payload.deliveryMode === 'connect.status';
}

export function isAuthCredentialsBrowserDelivery(
	payload: BrowserDeliveryPayload,
): boolean {
	return payload.deliveryMode === 'auth.credentials';
}

export function isPermissionBrowserDelivery(
	payload: BrowserDeliveryPayload,
): boolean {
	return (
		payload.deliveryMode === 'permission.approve' ||
		payload.deliveryMode === 'permission.deny'
	);
}

export function isManagedBrowserDelivery(
	payload: BrowserDeliveryPayload,
): boolean {
	return payload.deliveryMode === 'oauth.tokens';
}

export function isByoOAuthBrowserDelivery(
	payload: BrowserDeliveryPayload,
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

function resolveSigningSecret(signingSecret: string): string | null {
	const trimmed = signingSecret.trim();
	return trimmed.length > 0 ? trimmed : null;
}

function signPayload(payloadBase64: string, signingSecret: string): string {
	const secret = resolveSigningSecret(signingSecret);
	if (!secret) {
		throw new Error('Signing secret is required for browser delivery tokens');
	}

	return createHmac('sha256', secret).update(payloadBase64).digest('base64url');
}

export function verifyBrowserDeliveryToken(
	token: string,
	signingSecret: string,
): BrowserDeliveryPayload | null {
	const secret = resolveSigningSecret(signingSecret);
	if (!secret) return null;

	const parts = token.split('.');
	if (parts.length !== 2) return null;

	const [payloadBase64, signature] = parts;
	if (!payloadBase64 || !signature) return null;

	const expected = signPayload(payloadBase64, secret);
	try {
		if (
			!timingSafeEqual(
				Buffer.from(signature, 'utf8'),
				Buffer.from(expected, 'utf8'),
			)
		) {
			return null;
		}
	} catch {
		return null;
	}

	let payload: BrowserDeliveryPayload;
	try {
		payload = JSON.parse(
			Buffer.from(payloadBase64, 'base64url').toString('utf8'),
		) as BrowserDeliveryPayload;
	} catch {
		return null;
	}

	if (payload.exp * 1000 < Date.now()) return null;
	return payload;
}

export { BROWSER_DELIVERY_TTL_MS };
