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
		const result = await getHubAccessToken(hubContext);
		(ctx as Record<string, unknown>)._refreshAuth = async () =>
			(await getHubAccessToken(hubContext, { forceRefresh: true })).accessToken;
		return result.accessToken;
	}

	const clientSecret = credentials.client_secret;
	const clientId = credentials.client_id;

	const refresh = async (): Promise<string> => {
		const [refreshToken, expiresAt] = await Promise.all([
			ctx.keys.get_refresh_token(),
			ctx.keys.get_expires_at(),
		]);
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
	};

	(ctx as Record<string, unknown>)._refreshAuth = refresh;

	const [accessToken, expiresAt] = await Promise.all([
		ctx.keys.get_access_token(),
		ctx.keys.get_expires_at(),
	]);
	if (isAccessTokenFresh({ accessToken, expiresAt })) {
		return accessToken as string;
	}
	return refresh();
}
