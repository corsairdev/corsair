import { getHubAccessToken } from '../../hub/oauth-refresh';
import type { HubConfig } from '../../hub/types';
import { AuthMissingError } from './errors/auth-missing';
import type {
	OAuthBodyFormat,
	OAuthTokenAuthMethod,
} from './oauth-refresh-local';
import { refreshOAuthTokensLocal } from './oauth-refresh-local';
import { cacheRefreshedTokens, isAccessTokenFresh } from './oauth-token-cache';
import type { AccountKeyManagerFor } from './types';

export type OAuthAccessContext = {
	keys: AccountKeyManagerFor<'oauth_2'>;
	hub?: HubConfig | null;
	tenantId: string;
};

export type OAuthAccessOptions = {
	plugin: string;
	tokenUrl: string;
	tokenAuthMethod?: OAuthTokenAuthMethod;
	bodyFormat?: OAuthBodyFormat;
	extraParams?: Record<string, string>;
};

// Concurrent refreshes for the same (plugin, tenant) share one exchange:
// rotating providers invalidate the old refresh_token on use, so a second
// in-flight refresh with the stale token would fail. Best-effort, in-process —
// the hub single-flights its own side too.
const inFlightRefreshes = new Map<string, Promise<string>>();

function singleFlightRefresh(
	key: string,
	run: () => Promise<string>,
): Promise<string> {
	const existing = inFlightRefreshes.get(key);
	if (existing) return existing;
	const pending = run().finally(() => {
		inFlightRefreshes.delete(key);
	});
	inFlightRefreshes.set(key, pending);
	return pending;
}

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
		(ctx as Record<string, unknown>)._refreshAuth = () =>
			singleFlightRefresh(
				`${flightKey}:force`,
				async () =>
					(await getHubAccessToken(hubContext, { forceRefresh: true }))
						.accessToken,
			);
		return singleFlightRefresh(
			flightKey,
			async () => (await getHubAccessToken(hubContext)).accessToken,
		);
	}

	const clientSecret = credentials.client_secret;
	const clientId = credentials.client_id;

	// force ⇒ a 401 retry: the token can look locally fresh but be revoked at the
	// provider, so skip the freshness re-check and mint unconditionally. A distinct
	// flight key keeps a force from deduping onto an in-flight non-force refresh
	// (which could hand back the stale token).
	const runRefresh = (force: boolean): Promise<string> =>
		singleFlightRefresh(force ? `${flightKey}:force` : flightKey, async () => {
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
