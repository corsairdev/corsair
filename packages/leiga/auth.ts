import { createHmac } from 'node:crypto';
import { AuthMissingError, asRecord } from 'corsair/core';
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
		/** Leiga's Secret Key. See `leigaAuthConfig` for why it is `api_key`. */
		get_api_key: () => Promise<string | null | undefined>;
		get_access_token: () => Promise<string | null | undefined>;
		set_access_token: (value: string) => Promise<void>;
	};
};

/**
 * What the `access_token` account field holds: the token together with its
 * expiry and the client pair that minted it.
 *
 * One value, so one write. The key manager saves a field at a time, and a token
 * saved apart from its expiry can end up as an old token under a new expiry,
 * which reads as fresh for the whole lifetime of the token that was lost.
 */
export type LeigaStoredToken = {
	accessToken: string;
	/** Epoch milliseconds at which the token stops working. */
	expiresAt: number;
	/** Fingerprint of the client pair the token was minted from. */
	pair: string;
};

/**
 * A stored token is used until this long before its expiry, so one cannot lapse
 * between the check here and the request the caller is about to send.
 */
const EXPIRY_SKEW_MS = 60_000;

/**
 * Identifies a client pair without storing it a second time. A token belongs to
 * the Leiga organization of the pair that minted it, so a token is only reused
 * while the account still holds that same pair.
 */
export function fingerprintLeigaPair(
	clientId: string,
	clientSecret: string,
): string {
	// Keyed with the secret rather than hashing it: the secret never enters the
	// digest as data, and the same pair always gives the same value.
	return createHmac('sha256', clientSecret).update(clientId).digest('hex');
}

export function encodeLeigaStoredToken(token: LeigaStoredToken): string {
	return JSON.stringify(token);
}

/**
 * Reads the `access_token` field back. Anything that is not a complete record,
 * such as a bare token pasted into the field, is treated as no token at all:
 * without its pair and expiry there is no telling whose it is or how long it
 * lasts.
 */
export function decodeLeigaStoredToken(
	raw: string | null | undefined,
): LeigaStoredToken | undefined {
	if (!raw) return undefined;
	// unknown: the field can hold anything a caller stored in it.
	let parsed: unknown;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return undefined;
	}
	const record = asRecord(parsed);
	if (!record) return undefined;
	const { accessToken, expiresAt, pair } = record;
	if (typeof accessToken !== 'string' || accessToken.length === 0) {
		return undefined;
	}
	if (typeof expiresAt !== 'number' || !Number.isFinite(expiresAt)) {
		return undefined;
	}
	if (typeof pair !== 'string' || pair.length === 0) return undefined;
	return { accessToken, expiresAt, pair };
}

/**
 * True when the stored token was minted by `pair` and has not reached its skew
 * window.
 */
export function isStoredTokenUsable(
	stored: LeigaStoredToken | undefined,
	pair: string,
	now: number = Date.now(),
): stored is LeigaStoredToken {
	if (!stored) return false;
	// Minted by a pair the account no longer holds: it would read the previous
	// organization until it expired.
	if (stored.pair !== pair) return false;
	return stored.expiresAt - EXPIRY_SKEW_MS > now;
}

export type ResolveLeigaAccessTokenOptions = {
	now?: number;
	/**
	 * A token Leiga has just answered `15 accessToken error` to. It is never
	 * returned again, whatever its recorded expiry says.
	 */
	rejectedToken?: string;
};

/**
 * Returns the `accessToken` header value for an account, minting a token from
 * the stored client pair only when the saved one is missing, expired, rejected
 * or was minted by a different pair.
 *
 * A pair that is not stored is a not-connected account, so this throws rather
 * than sending an empty header or a token left behind by an earlier pair: Leiga
 * answers an empty `accessToken` with `{"code":"15"}` on HTTP 200, which would
 * surface as a confusing failure in the middle of an operation.
 */
export async function resolveLeigaAccessToken(
	ctx: LeigaAuthContext,
	options: ResolveLeigaAccessTokenOptions = {},
): Promise<string> {
	const now = options.now ?? Date.now();
	const [storedValue, clientId, clientSecret] = await Promise.all([
		ctx.keys.get_access_token(),
		ctx.keys.get_client_id(),
		ctx.keys.get_api_key(),
	]);

	if (!clientId || !clientSecret) {
		throw new AuthMissingError('leiga', 'api_key');
	}

	const pair = fingerprintLeigaPair(clientId, clientSecret);
	const stored = decodeLeigaStoredToken(storedValue);
	if (
		isStoredTokenUsable(stored, pair, now) &&
		stored.accessToken !== options.rejectedToken
	) {
		return stored.accessToken;
	}

	const token = await resolveLeigaToken(clientId, clientSecret, now, {
		rejectedToken: options.rejectedToken,
	});
	try {
		await ctx.keys.set_access_token(
			encodeLeigaStoredToken({
				accessToken: token.accessToken,
				expiresAt: token.expiresAt,
				pair,
			}),
		);
	} catch {
		// Not fatal: this call already has a usable token. Whatever was stored
		// before is still a whole record, so the next call judges it correctly
		// and exchanges again if it has to.
	}
	return token.accessToken;
}

/** Drops the in-memory token cache. */
export function resetLeigaToken(): void {
	clearLeigaTokenCache();
}
