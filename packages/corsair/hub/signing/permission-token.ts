/**
 * Permission approval session tokens — the token in `/approve/[token]` for the permissions page.
 *
 * When an agent needs human approval for a sensitive operation, the SDK creates a permission
 * session. The hub returns an approval URL with this signed token. Expiry is caller-controlled
 * (SDK provides `expiresAt`) rather than a fixed TTL.
 */

import {
	createSignedTokenJti,
	decodeTokenFromPath,
	signTokenWithExpiry,
	verifySignedToken,
} from './signed-token';

/**
 * Decoded payload inside a permission approval URL token.
 */
export type PermissionTokenPayload = {
	/** Unique session id; matches `permission_sessions.jti` in the hub DB. */
	jti: string;
	/** Corsair project id (`proj_*`). */
	projectId: string;
	/** Plugin whose operation requires approval. */
	plugin: string;
	/** Corsair operation path being approved (e.g. `api.messages.post`). */
	endpoint: string;
	/** Tenant the operation targets. */
	tenantId: string;
	/** App delivery endpoint where the approve/deny decision is sent. */
	deliveryUrl: string;
	/** Unix expiry (seconds); set from SDK `expiresAt`. */
	exp: number;
	/** Unix issued-at (seconds). */
	iat: number;
};

/** Creates a new jti for a permission session row. */
export function createPermissionSessionJti(): string {
	return createSignedTokenJti();
}

/**
 * Signs the token embedded in the permission approval page URL (`/approve/[token]`).
 *
 * @param expiresAt - SDK-provided deadline for the approval request.
 */
export function signPermissionToken(
	payload: Omit<PermissionTokenPayload, 'exp' | 'iat'>,
	signingSecret: string,
	expiresAt: Date,
): string {
	return signTokenWithExpiry(
		payload,
		signingSecret,
		Math.floor(expiresAt.getTime() / 1000),
	);
}

/**
 * Verifies a permission approval URL token when the approve UI loads session state.
 */
export function verifyPermissionToken(
	token: string,
	signingSecret: string,
): PermissionTokenPayload | null {
	return verifySignedToken<PermissionTokenPayload>(token, signingSecret);
}

/** Decodes a permission token from a URL path segment. */
export function decodePermissionTokenFromPath(encoded: string): string {
	return decodeTokenFromPath(encoded);
}
