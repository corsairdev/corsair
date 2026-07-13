/**
 * Per-plugin OAuth state tokens stored in the hub DB during the connect sign-in flow.
 *
 * When a user starts OAuth for one plugin, the SDK registers a connect token keyed by
 * `oauthState`. The hub OAuth callback looks up this token to know which plugin, tenant,
 * and delivery URL to complete. Distinct from {@link ConnectSessionTokenPayload} which
 * covers the multi-plugin connect page URL.
 */

import type { HubOAuthMode } from '../types';
import {
	createSignedTokenJti,
	decodeTokenFromPath,
	encodeTokenForPath,
	signTokenWithTtl,
	verifySignedToken,
} from './signed-token';

const CONNECT_TOKEN_TTL_MS = 10 * 60 * 1000;

/**
 * Decoded payload inside a per-plugin OAuth connect token.
 */
export type ConnectTokenPayload = {
	/** Unique id for this OAuth attempt; matches `connect_tokens.jti` in the hub DB. */
	jti: string;
	/** Corsair project id (`proj_*`). */
	projectId: string;
	/** Plugin being connected (e.g. `github`, `slack`). */
	plugin: string;
	/** Tenant within the app receiving credentials. */
	tenantId: string;
	/** Display name shown on the connect UI. */
	providerName: string;
	/** Authorization URL the user was sent to (BYO OAuth). */
	oauthUrl: string;
	/** OAuth state parameter echoed back by the provider; used to look up this token. */
	state: string;
	/** OAuth redirect URI registered for this flow (hub callback URL). */
	redirectUri: string;
	/** App delivery endpoint for credential transfer after OAuth completes. */
	deliveryUrl: string;
	/** BYO (app holds OAuth app) vs managed (hub holds OAuth app). */
	oauthMode: HubOAuthMode;
	/** Unix expiry (seconds). */
	exp: number;
	/** Unix issued-at (seconds). */
	iat: number;
};

/** Creates a new jti for a connect OAuth token row. */
export function createConnectTokenJti(): string {
	return createSignedTokenJti();
}

/** Default TTL for connect OAuth tokens (10 minutes). */
export function getConnectTokenExpiryMs(): number {
	return CONNECT_TOKEN_TTL_MS;
}

/**
 * Signs a connect OAuth token embedded in the DB and used during the OAuth callback.
 */
export function signConnectToken(
	payload: Omit<ConnectTokenPayload, 'exp' | 'iat'>,
	signingSecret: string,
): string {
	return signTokenWithTtl(payload, signingSecret, CONNECT_TOKEN_TTL_MS);
}

/**
 * Verifies a connect OAuth token (e.g. to read `oauthMode` during callback).
 */
export function verifyConnectToken(
	token: string,
	signingSecret: string,
): ConnectTokenPayload | null {
	return verifySignedToken<ConnectTokenPayload>(token, signingSecret);
}

/** Encodes a connect token for use in a URL path. */
export function encodeConnectTokenForPath(token: string): string {
	return encodeTokenForPath(token);
}

/** Decodes a connect token from a URL path segment. */
export function decodeConnectTokenFromPath(encoded: string): string {
	return decodeTokenFromPath(encoded);
}
