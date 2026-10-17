import { getHubAccessToken } from '../../hub/oauth-refresh';
import type { HubConfig } from '../../hub/types';
import { AuthMissingError } from './errors/auth-missing';
import type {
	OAuthBodyFormat,
	OAuthTokenAuthMethod,
} from './oauth-refresh-local';
import { refreshOAuthTokensLocal } from './oauth-refresh-local';
import { cacheRefreshedTokens, isAccessTokenFresh } from './oauth-token-cache';
import { flightStoreOf, singleFlight } from './single-flight';
import type { AccountKeyManagerFor } from './types';

export type OAuthAccessContext = {
	keys: AccountKeyManagerFor<'oauth_2'>;
	hub?: HubConfig | null;
	tenantId: string;
	/**
	 * The database handle of the Corsair instance this request belongs to. It is the
	 * same stable object for every tenant client created under that instance, so it
	 * owns the refresh single-flight: two clients refreshing the same tenant
	 * concurrently must share one provider exchange (the refresh_token rotates),
	 * while different tenants and separate Corsair instances with separate
	 * databases must not.
	 */
	database?: object;
};

export type OAuthAccessOptions = {
	plugin: string;
	tokenUrl: string;
	tokenAuthMethod?: OAuthTokenAuthMethod;
	bodyFormat?: OAuthBodyFormat;
	extraParams?: Record<string, string>;
};

// Single acquisition path for an oauth_2 access token. Dispatches on where the
// client_secret lives: absent locally ⇒ the secret is in the hub (BYO+Hub), so
// refresh round-trips the refresh_token through the hub; present ⇒ inline/no-Hub,
// so refresh runs locally against the provider. Sets ctx._refreshAuth for 401
// retries. Returns the raw access token (callers add any scheme prefix).
export async function getOAuthAccessToken(
	ctx: OAuthAccessContext,
	opts: OAuthAccessOptions,
): Promise<string> {
	const credentials = await ctx.keys.get_integration_credentials();
	const flightKey = `${opts.plugin}:${ctx.tenantId}`;
	// Owner of the refresh flight: the instance-wide database handle when available,
	// so clients of one instance share (disjoint across tenants and instances). The
	// key manager carries the same handle if the caller did not put it on the ctx
	// (renewal and managed paths); a hand-built manager still falls back to itself.
	const flightStore = ctx.database ?? flightStoreOf(ctx.keys);

	if (!credentials.client_secret) {
		if (!ctx.hub) {
			throw new AuthMissingError(opts.plugin, 'oauth_2');
		}
		const hubContext = {
			keys: ctx.keys,
			hub: ctx.hub,
			plugin: opts.plugin,
			tenantId: ctx.tenantId,
		};
		// Force (401 retry) and routine refresh share ONE flight key: the hub is
		// stateless (it mints with the stored client_secret but persists nothing),
		// so two concurrent /oauth/refresh calls would spend the same rotating
		// refresh_token and the second would fail. The freshness guard below means a
		// routine flight only exists while it is actually minting, so a forced
		// joiner never inherits a stale token.
		const runHubRefresh = (force: boolean): Promise<string> =>
			singleFlight(
				flightStore,
				flightKey,
				async () =>
					(await getHubAccessToken(hubContext, { forceRefresh: force }))
						.accessToken,
			);
		(ctx as Record<string, unknown>)._refreshAuth = () => runHubRefresh(true);

		const [accessToken, expiresAt] = await Promise.all([
			ctx.keys.get_access_token(),
			ctx.keys.get_expires_at(),
		]);
		if (isAccessTokenFresh({ accessToken, expiresAt })) {
			return accessToken as string;
		}
		return runHubRefresh(false);
	}

	const clientSecret = credentials.client_secret;
	const clientId = credentials.client_id;

	// force ⇒ a 401 retry: the token can look locally fresh but be revoked at the
	// provider, so skip the freshness re-check and mint unconditionally. Force and
	// routine share ONE flight key: a 401 retry racing an expiry refresh must not
	// both spend the same rotating refresh_token. Safe because the freshness
	// shortcut below only fires when the flight's creator was routine — and a
	// routine creator only got here after its own freshness check failed, so a
	// shortcut hit means a concurrent refresh already minted a fresh token.
	const runRefresh = (force: boolean): Promise<string> =>
		singleFlight(flightStore, flightKey, async () => {
			const [currentAccess, expiresAt, refreshToken] = await Promise.all([
				ctx.keys.get_access_token(),
				ctx.keys.get_expires_at(),
				ctx.keys.get_refresh_token(),
			]);
			// Re-check under the single-flight: a concurrent caller may have just
			// refreshed and persisted a token while we waited.
			if (
				!force &&
				isAccessTokenFresh({ accessToken: currentAccess, expiresAt })
			) {
				return currentAccess as string;
			}
			if (!refreshToken) {
				throw new AuthMissingError(opts.plugin, 'oauth_2');
			}
			const tokens = await refreshOAuthTokensLocal({
				tokenUrl: opts.tokenUrl,
				tokenAuthMethod: opts.tokenAuthMethod,
				bodyFormat: opts.bodyFormat,
				extraParams: opts.extraParams,
				clientId,
				clientSecret,
				refreshToken,
			});
			await cacheRefreshedTokens(ctx.keys, tokens, expiresAt);
			return tokens.access_token;
		});

	(ctx as Record<string, unknown>)._refreshAuth = () => runRefresh(true);

	const [accessToken, expiresAt] = await Promise.all([
		ctx.keys.get_access_token(),
		ctx.keys.get_expires_at(),
	]);
	if (isAccessTokenFresh({ accessToken, expiresAt })) {
		return accessToken as string;
	}
	return runRefresh(false);
}
