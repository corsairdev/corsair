import {
	cacheRefreshedTokens,
	isAccessTokenFresh,
} from '../core/auth/oauth-token-cache';

function collectingKeys() {
	const store: Record<string, string> = {};
	return {
		store,
		keys: {
			set_access_token: async (v: string) => {
				store.access = v;
			},
			set_expires_at: async (v: string) => {
				store.expires = v;
			},
			set_refresh_token: async (v: string) => {
				store.refresh = v;
			},
			set_scope: async (v: string) => {
				store.scope = v;
			},
		},
	};
}

describe('cacheRefreshedTokens expiry fallback', () => {
	it('a refresh with no expires_in yields a future expiry, not the stale previous one', async () => {
		const { store, keys } = collectingKeys();
		const now = Math.floor(Date.now() / 1000);
		// cacheRefreshedTokens only runs after a freshness failure, so the previous
		// expiry is already in the past. Reusing it would store a token that reads
		// stale immediately and refreshes on every call.
		const stalePrev = String(now - 100);

		const nextExpiresAt = await cacheRefreshedTokens(
			keys,
			{ access_token: 'freshly-minted' },
			stalePrev,
		);

		expect(nextExpiresAt).toBeGreaterThan(now);
		expect(
			isAccessTokenFresh({
				accessToken: 'freshly-minted',
				expiresAt: store.expires,
			}),
		).toBe(true);
	});
});
