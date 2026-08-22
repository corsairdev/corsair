import { AuthMissingError } from '../core/auth/errors/auth-missing';
import type { AccountKeyManagerFor } from '../core/auth/types';
import { hubApiPost } from './client/http';
import { parseOAuthRefreshResponse } from './contracts/connect-api';
import type { HubConfig } from './types';

const TOKEN_REFRESH_BUFFER_SECONDS = 5 * 60;

export type HubOAuthContext = {
	keys: AccountKeyManagerFor<'oauth_2'>;
	hub: HubConfig;
	plugin: string;
	tenantId: string;
};

export type HubOAuthAccessTokenResult = {
	accessToken: string;
	expiresAt: number;
	refreshed: boolean;
};

// Returns a valid access token for a BYO OAuth connection whose client_secret
// lives in the hub. Refresh is stateless hub-side: the SDK sends its own
// refresh_token, the hub mints with the stored client_secret and persists
// nothing, and the SDK caches the rotated tokens locally.
export async function getHubAccessToken(
	ctx: HubOAuthContext,
	options?: { forceRefresh?: boolean },
): Promise<HubOAuthAccessTokenResult> {
	const { keys, hub, plugin, tenantId } = ctx;
	const forceRefresh = options?.forceRefresh ?? false;

	const [accessToken, expiresAt, refreshToken] = await Promise.all([
		keys.get_access_token(),
		keys.get_expires_at(),
		keys.get_refresh_token(),
	]);

	const now = Math.floor(Date.now() / 1000);
	if (
		!forceRefresh &&
		accessToken &&
		expiresAt &&
		Number(expiresAt) > now + TOKEN_REFRESH_BUFFER_SECONDS
	) {
		return {
			accessToken,
			expiresAt: Number(expiresAt),
			refreshed: false,
		};
	}

	if (!refreshToken) {
		throw new AuthMissingError(plugin, 'oauth_2');
	}

	const tokens = await hubApiPost({
		hub,
		path: '/oauth/refresh',
		body: { plugin, tenantId, refresh_token: refreshToken },
		parseResponse: parseOAuthRefreshResponse,
	});

	const nextExpiresAt = tokens.expires_in
		? now + tokens.expires_in
		: expiresAt
			? Number(expiresAt)
			: now + 3600;

	await keys.set_access_token(tokens.access_token);
	await keys.set_expires_at(String(nextExpiresAt));
	if (tokens.refresh_token) {
		await keys.set_refresh_token(tokens.refresh_token);
	}
	if (tokens.scope) {
		await keys.set_scope(tokens.scope);
	}

	return {
		accessToken: tokens.access_token,
		expiresAt: nextExpiresAt,
		refreshed: true,
	};
}
