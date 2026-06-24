/**
 * Low-level HMAC signing primitives shared by all hub token types.
 *
 * Hub uses a consistent wire format: `base64url(JSON payload).base64url(HMAC-SHA256 signature)`.
 * Session URL tokens (connect, permission) and browser delivery tokens all build on these helpers.
 */

import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

/**
 * Creates a unique token id (jti) for one-time or idempotent delivery tracking.
 */
export function createSignedTokenJti(): string {
	return randomBytes(16).toString('base64url');
}

/**
 * Signs a base64url-encoded payload with the project signing secret.
 *
 * @param payloadBase64 - JSON payload already encoded as base64url (the part before the `.` in a token).
 * @param signingSecret - Per-project `csec_*` secret shared between hub and the Corsair app.
 */
export function signPayloadBase64(
	payloadBase64: string,
	signingSecret: string,
): string {
	const secret = signingSecret.trim();
	if (!secret) {
		throw new Error('Signing secret is required');
	}

	return createHmac('sha256', secret).update(payloadBase64).digest('base64url');
}

/**
 * Standard expiry fields included on every signed hub token payload.
 */
export type ExpiringTokenPayload = {
	/** Unix timestamp (seconds) after which the token must be rejected. */
	exp: number;
	/** Unix timestamp (seconds) when the token was issued. */
	iat: number;
};

/**
 * Verifies the HMAC signature and expiry of a signed token, returning the decoded payload.
 *
 * Used by connect, permission, and browser delivery token verifiers. Returns `null` on any
 * failure (bad format, bad signature, expired) rather than throwing.
 *
 * @param token - Full token string: `payloadBase64.signature`.
 * @param signingSecret - Per-project signing secret used to verify the signature.
 */
export function verifySignedToken<T extends ExpiringTokenPayload>(
	token: string,
	signingSecret: string,
): T | null {
	const secret = signingSecret.trim();
	if (!secret) return null;

	const parts = token.split('.');
	if (parts.length !== 2) return null;

	const [payloadBase64, signature] = parts;
	if (!payloadBase64 || !signature) return null;

	const expected = signPayloadBase64(payloadBase64, secret);
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

	let payload: T;
	try {
		payload = JSON.parse(
			Buffer.from(payloadBase64, 'base64url').toString('utf8'),
		) as T;
	} catch {
		return null;
	}

	if (payload.exp * 1000 < Date.now()) return null;
	return payload;
}

/**
 * Signs a payload with an explicit expiry unix timestamp.
 *
 * Used when expiry is caller-controlled (e.g. permission sessions with SDK-provided `expiresAt`).
 */
export function signTokenWithExpiry<T extends Record<string, unknown>>(
	payload: T,
	signingSecret: string,
	expUnix: number,
): string {
	const now = Math.floor(Date.now() / 1000);
	const fullPayload = {
		...payload,
		iat: now,
		exp: expUnix,
	};
	const payloadBase64 = Buffer.from(JSON.stringify(fullPayload)).toString(
		'base64url',
	);
	const signature = signPayloadBase64(payloadBase64, signingSecret);
	return `${payloadBase64}.${signature}`;
}

/**
 * Signs a payload with a fixed TTL from now.
 *
 * Used for connect OAuth tokens and connect session URL tokens with built-in lifetimes.
 */
export function signTokenWithTtl<T extends Record<string, unknown>>(
	payload: T,
	signingSecret: string,
	ttlMs: number,
): string {
	const now = Math.floor(Date.now() / 1000);
	return signTokenWithExpiry(
		payload,
		signingSecret,
		now + Math.floor(ttlMs / 1000),
	);
}

/**
 * Decodes a token embedded in a URL path segment (e.g. `/connect/[token]`).
 */
export function decodeTokenFromPath(encoded: string): string {
	return decodeURIComponent(encoded);
}

/**
 * Encodes a token for safe use in a URL path segment.
 */
export function encodeTokenForPath(token: string): string {
	return encodeURIComponent(token);
}
