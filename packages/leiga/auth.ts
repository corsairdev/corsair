import { AuthMissingError } from 'corsair/core';
import { clearLeigaTokenCache, resolveLeigaToken } from './client';

/**
 * The slice of the account key manager this resolver needs. Every field it
 * reads is an **account**-level accessor from `leigaAuthConfig`, so it exists on
 * the real `api_key` manager. Declared structurally so the tests can supply a
 * fixture without a whole `AccountKeyManager`.
 */
export type LeigaAuthContext = {
	tenantId?: string;
	keys: {
		get_client_id: () => Promise<string | null | undefined>;
		get_client_secret: () => Promise<string | null | undefined>;
		get_access_token: () => Promise<string | null | undefined>;
		get_expires_at: () => Promise<string | null | undefined>;
		set_access_token: (value: string) => Promise<void>;
		set_expires_at: (value: string) => Promise<void>;
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
	// A token with no recorded expiry cannot be checked, and trusting it forever
	// means sending an expired token until Leiga answers code 15. Treat it as
	// stale so it is replaced on the next call.
	if (!expiresAt) return false;
	const expiry = Number(expiresAt);
	if (!Number.isFinite(expiry)) return false;
	return expiry - EXPIRY_SKEW_MS > now;
}

/**
 * Returns the `accessToken` header value for an account, minting a token from
 * the stored client pair only when the cached one is missing or stale.
 *
 * Both the token and its expiry are written back, so a later process can skip
 * the exchange and still know when the token stops working.
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
	const [accessToken, expiresAt, clientId, clientSecret] = await Promise.all([
		ctx.keys.get_access_token(),
		ctx.keys.get_expires_at(),
		ctx.keys.get_client_id(),
		ctx.keys.get_client_secret(),
	]);

	if (isStoredTokenUsable(accessToken, expiresAt, now)) {
		return accessToken as string;
	}

	if (!clientId || !clientSecret) {
		throw new AuthMissingError('leiga', 'api_key');
	}

	const token = await resolveLeigaToken(clientId, clientSecret, now);
	// Persist both halves. A failed write is not fatal: this call already has a
	// usable token and the module cache holds it, but the expiry must be written
	// or the next process would treat the token as permanently valid.
	await Promise.resolve()
		.then(() =>
			Promise.all([
				ctx.keys.set_access_token(token.accessToken),
				ctx.keys.set_expires_at(String(token.expiresAt)),
			]),
		)
		.catch(() => undefined);
	return token.accessToken;
}

/** Drops the in-memory token cache. Call it after a `15 accessToken error`. */
export function resetLeigaToken(): void {
	clearLeigaTokenCache();
}
