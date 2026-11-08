import { AuthMissingError } from 'corsair/core';
import { clearLeigaTokenCache, resolveLeigaToken } from './client';

/**
 * The slice of the account key manager the token resolver needs. Declared
 * structurally because `get_integration_credentials` exists only on `oauth_2`
 * accounts, while Leiga stores its client pair on an `api_key` account. The
 * type is the same shape `zoominfo/auth.ts` uses for the same reason.
 */
export type LeigaAuthContext = {
	tenantId?: string;
	keys: {
		get_access_token: () => Promise<string | null | undefined>;
		get_expires_at: () => Promise<string | null | undefined>;
		get_integration_credentials: () => Promise<{
			[key: string]: string | null | undefined;
		}>;
		set_access_token: (value: string) => Promise<unknown>;
		set_expires_at?: (value: string) => Promise<unknown>;
	};
};

/**
 * A stored token is used until this long before its expiry, so one cannot lapse
 * between the check here and the request the caller is about to send.
 */
const EXPIRY_SKEW_MS = 60_000;

/** True when a stored token exists and has not reached its skew window. */
export function isStoredTokenUsable(
	accessToken: string | null | undefined,
	expiresAt: string | null | undefined,
	now: number = Date.now(),
): boolean {
	if (!accessToken) return false;
	// A token with no recorded expiry is taken at face value: Leiga's own
	// examples use a 30-day token, and refusing it would force an exchange on
	// every call for accounts that stored one by hand.
	if (!expiresAt) return true;
	const expiry = Number(expiresAt);
	if (!Number.isFinite(expiry)) return true;
	return expiry - EXPIRY_SKEW_MS > now;
}

/**
 * Returns the `accessToken` header value for an account, minting a token from
 * the stored client pair only when the cached one is missing or stale.
 *
 * A pair that is not stored is a not-connected account, so this throws rather
 * than sending an empty header: Leiga answers an empty `accessToken` with
 * `{"code":"15"}` on HTTP 200, which would surface as a confusing failure in
 * the middle of an operation.
 */
export async function resolveLeigaAccessToken(
	ctx: LeigaAuthContext,
	now: number = Date.now(),
): Promise<string> {
	const [accessToken, expiresAt, credentials] = await Promise.all([
		ctx.keys.get_access_token(),
		ctx.keys.get_expires_at(),
		ctx.keys.get_integration_credentials(),
	]);

	if (isStoredTokenUsable(accessToken, expiresAt, now)) {
		return accessToken as string;
	}

	const clientId = credentials.client_id;
	const clientSecret = credentials.client_secret;
	if (!clientId || !clientSecret) {
		throw new AuthMissingError('leiga', 'api_key');
	}

	const token = await resolveLeigaToken(clientId, clientSecret, now);
	// Persist so the next process can skip the exchange. A failed write is not
	// fatal: this call already has a usable token, and the module cache holds it.
	await Promise.resolve()
		.then(() => ctx.keys.set_access_token(token))
		.catch(() => undefined);
	return token;
}

/** Drops the in-memory token cache. Call it after a `15 accessToken error`. */
export function resetLeigaToken(): void {
	clearLeigaTokenCache();
}
