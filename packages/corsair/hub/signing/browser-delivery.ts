/**
 * Browser (client) delivery — hub redirects the user's browser to the app with `?d=<token>`.
 *
 * Used for localhost / loopback dev where the hub cannot POST to the app's delivery URL.
 * The app verifies the token, applies the payload, then redirects to `hubSuccessUrl`.
 *
 * Payload shape: {@link BrowserDeliveryPayload} in `hub/contracts/tunnel.ts`.
 */

import { randomBytes } from 'node:crypto';
import type { BrowserDeliveryPayload } from '../contracts/tunnel';
import { BROWSER_DELIVERY_TTL_MS } from '../contracts/tunnel';
import { signPayloadBase64, verifySignedToken } from './signed-token';

export type { BrowserDeliveryPayload } from '../contracts/tunnel';
export { BROWSER_DELIVERY_TTL_MS };

function resolveSigningSecret(signingSecret: string): string | null {
	const trimmed = signingSecret.trim();
	return trimmed.length > 0 ? trimmed : null;
}

/**
 * Builds the redirect URL the hub sends the user's browser to for client-side delivery.
 *
 * @param deliveryUrl - The app's Corsair delivery endpoint (e.g. `http://localhost:3001/api/corsair`).
 * @param signedToken - Output of {@link signBrowserDeliveryToken}.
 */
export function buildBrowserDeliveryRedirectUrl(
	deliveryUrl: string,
	signedToken: string,
): string {
	const url = new URL(deliveryUrl);
	url.searchParams.set('d', signedToken);
	return url.toString();
}

/**
 * Signs a browser delivery payload for redirect-based delivery (local dev / `source: "client"`).
 *
 * Short TTL (60s) — the token travels in the browser URL and must be consumed quickly.
 *
 * @param payload - Delivery-specific fields; `jti`, `iat`, and `exp` are added automatically.
 * @param signingSecret - Per-project signing secret.
 */
export function signBrowserDeliveryToken(
	payload: Omit<BrowserDeliveryPayload, 'exp' | 'iat' | 'jti'> & {
		jti?: string;
	},
	signingSecret: string,
): string {
	if (!resolveSigningSecret(signingSecret)) {
		throw new Error('Signing secret is required for browser delivery tokens');
	}

	const now = Math.floor(Date.now() / 1000);
	const fullPayload: BrowserDeliveryPayload = {
		...payload,
		jti: payload.jti ?? randomBytes(16).toString('base64url'),
		iat: now,
		exp: now + Math.floor(BROWSER_DELIVERY_TTL_MS / 1000),
	};
	const payloadBase64 = Buffer.from(JSON.stringify(fullPayload)).toString(
		'base64url',
	);
	const signature = signPayloadBase64(payloadBase64, signingSecret);
	return `${payloadBase64}.${signature}`;
}

/**
 * Verifies a `?d=` browser delivery token from the app side.
 *
 * @returns Decoded payload, or `null` if invalid or expired.
 */
export function verifyBrowserDeliveryToken(
	token: string,
	signingSecret: string,
): BrowserDeliveryPayload | null {
	if (!resolveSigningSecret(signingSecret)) return null;
	return verifySignedToken<BrowserDeliveryPayload>(token, signingSecret);
}
