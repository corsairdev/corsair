// Shared local-cache mechanics for OAuth access tokens, used by every refresh
// path (hub-side BYO, local BYO, and — after B4 — managed). Keeps the freshness
// buffer and the persist-rotation tail in one place instead of per-path copies.

export const TOKEN_REFRESH_BUFFER_SECONDS = 5 * 60;

export function isAccessTokenFresh(input: {
	accessToken?: string | null;
	expiresAt?: string | null;
	now?: number;
	forceRefresh?: boolean;
}): boolean {
	if (input.forceRefresh) return false;
	if (!input.accessToken) return false;
	// A non-expiring token (Notion et al.) carries no expires_at — a present access
	// token is fresh. If a provider that really does expire ever omits it, the call
	// gets a 401 and the endpoint's 401-retry forces a refresh.
	if (!input.expiresAt) return true;
	const now = input.now ?? Math.floor(Date.now() / 1000);
	return Number(input.expiresAt) > now + TOKEN_REFRESH_BUFFER_SECONDS;
}

export type RefreshedTokens = {
	access_token: string;
	refresh_token?: string;
	expires_in?: number;
	scope?: string;
};

type TokenCacheKeys = {
	set_access_token: (value: string) => Promise<void>;
	set_expires_at: (value: string) => Promise<void>;
	set_refresh_token: (value: string) => Promise<void>;
	set_scope: (value: string) => Promise<void>;
};

// Persists rotated tokens to the account and returns the new absolute expiry
// (seconds). When the provider omits expires_in, keeps the previous expiry only
// if it is still in the future, else falls back to one hour — never a past
// expiry, which would make the freshly minted token read stale on the next call.
export async function cacheRefreshedTokens(
	keys: TokenCacheKeys,
	tokens: RefreshedTokens,
	prevExpiresAt?: string | null,
): Promise<number> {
	const now = Math.floor(Date.now() / 1000);
	const prev = prevExpiresAt ? Number(prevExpiresAt) : Number.NaN;
	const nextExpiresAt =
		typeof tokens.expires_in === 'number'
			? now + tokens.expires_in
			: Number.isFinite(prev) && prev > now
				? prev
				: now + 3600;

	await keys.set_access_token(tokens.access_token);
	await keys.set_expires_at(String(nextExpiresAt));
	if (tokens.refresh_token) {
		await keys.set_refresh_token(tokens.refresh_token);
	}
	if (tokens.scope) {
		await keys.set_scope(tokens.scope);
	}

	return nextExpiresAt;
}
