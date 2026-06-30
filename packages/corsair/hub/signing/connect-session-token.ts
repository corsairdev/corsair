/**
 * Connect session URL tokens — the token in `/connect/[token]` for the hosted sign-in page.
 *
 * One session can cover multiple plugins. The SDK creates a session via REST; the hub returns
 * a connect URL containing this signed token. The UI loads session state by verifying it.
 */

import {
	createSignedTokenJti,
	decodeTokenFromPath,
	signTokenWithTtl,
	verifySignedToken,
} from './signed-token';

const CONNECT_SESSION_TTL_MS = 20 * 60 * 1000;

/**
 * Decoded payload inside a connect session URL token.
 */
export type ConnectSessionTokenPayload = {
	/** Unique session id; matches `setup_sessions.jti` in the hub DB. */
	jti: string;
	/** Corsair project id (`proj_*`). */
	projectId: string;
	/** Corsair environment id (`env_*`). */
	environmentId: string;
	/** Tenant being set up. */
	tenantId: string;
	/** App delivery endpoint used for credential transfer for this session. */
	deliveryUrl: string;
	/** Unix expiry (seconds). */
	exp: number;
	/** Unix issued-at (seconds). */
	iat: number;
};

/** Creates a new jti for a connect session row. */
export function createConnectSessionJti(): string {
	return createSignedTokenJti();
}

/** Default TTL for connect session URL tokens (20 minutes). */
export function getConnectSessionExpiryMs(): number {
	return CONNECT_SESSION_TTL_MS;
}

/**
 * Signs the token embedded in the connect page URL (`/connect/[token]`).
 */
export function signConnectSessionToken(
	payload: Omit<ConnectSessionTokenPayload, 'exp' | 'iat'>,
	signingSecret: string,
): string {
	return signTokenWithTtl(payload, signingSecret, CONNECT_SESSION_TTL_MS);
}

/**
 * Verifies a connect session URL token when the connect UI or API loads session state.
 */
export function verifyConnectSessionToken(
	token: string,
	signingSecret: string,
): ConnectSessionTokenPayload | null {
	return verifySignedToken<ConnectSessionTokenPayload>(token, signingSecret);
}

/** Decodes a connect session token from a URL path segment. */
export function decodeConnectSessionTokenFromPath(encoded: string): string {
	return decodeTokenFromPath(encoded);
}
