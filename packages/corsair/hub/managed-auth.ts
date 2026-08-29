import { AuthMissingError } from '../core/auth/errors/auth-missing';
import { cacheRefreshedTokens } from '../core/auth/oauth-token-cache';
import { singleFlight } from '../core/auth/single-flight';
import type { AccountKeyManagerFor } from '../core/auth/types';
import { hubApiPost } from './client/http';
import { parseOAuthRefreshResponse } from './contracts/connect-api';
import type { HubConfig } from './types';

const TOKEN_REFRESH_BUFFER_SECONDS = 5 * 60;

export type ManagedAuthContext = {
	keys: AccountKeyManagerFor<'managed'>;
	hub: HubConfig;
	plugin: string;
	tenantId: string;
};

export type ManagedAccessTokenResult = {
	accessToken: string;
	expiresAt: number;
	refreshed: boolean;
};

// Returns a valid access token for a managed OAuth connection.
// Uses cached credentials when still valid; otherwise refreshes via the hub.
export async function getManagedAccessToken(
	ctx: ManagedAuthContext,
	options?: { forceRefresh?: boolean },
): Promise<ManagedAccessTokenResult> {
	const { keys, hub, plugin, tenantId } = ctx;
	const forceRefresh = options?.forceRefresh ?? false;

	// Dedupe concurrent calls on this store into one flight. Keyed before any
	// async read so two callers share a single execution — and, when a refresh is
	// needed, one stateless Hub mint. Forced (401) refreshes share the same key as
	// routine ones so a 401 retry racing an expiry refresh can't spend a rotating
	// refresh_token twice.
	const flightKey = `managed:${plugin}:${tenantId}`;
	return singleFlight(keys, flightKey, async () => {
		const [accessToken, expiresAt, refreshToken] = await Promise.all([
			keys.get_access_token(),
			keys.get_expires_at(),
			keys.get_refresh_token(),
		]);

		if (!accessToken && !refreshToken) {
			throw new AuthMissingError(plugin, 'managed');
		}

		const now = Math.floor(Date.now() / 1000);
		if (
			!forceRefresh &&
			accessToken &&
			expiresAt &&
			Number(expiresAt) > now + TOKEN_REFRESH_BUFFER_SECONDS
		) {
			return { accessToken, expiresAt: Number(expiresAt), refreshed: false };
		}

		// Non-expiring tokens may have no refresh token — keep using the access
		// token while still valid. If expired (or due for refresh), fall through to
		// the hub, which may still hold a refresh token even when local storage does not.
		if (!refreshToken && accessToken && !forceRefresh) {
			const expiresAtSeconds = expiresAt ? Number(expiresAt) : null;
			const tokenStillUsable =
				expiresAtSeconds === null ||
				expiresAtSeconds > now + TOKEN_REFRESH_BUFFER_SECONDS;

			if (tokenStillUsable) {
				return {
					accessToken,
					expiresAt: expiresAtSeconds ?? now + 3600,
					refreshed: false,
				};
			}
		}

		// Without a local refresh_token the Hub has nothing to mint from either —
		// it no longer stores managed tokens — so a refresh is impossible. Surface
		// it as a reconnect instead of a doomed token-less Hub call.
		if (!refreshToken) {
			throw new AuthMissingError(plugin, 'managed');
		}

		const tokens = await refreshManagedTokensFromHub(
			hub,
			plugin,
			tenantId,
			refreshToken,
		);
		const nextExpiresAt = await cacheRefreshedTokens(keys, tokens, expiresAt);
		return {
			accessToken: tokens.access_token,
			expiresAt: nextExpiresAt,
			refreshed: true,
		};
	});
}

function isManagedConnectionMissingOnHub(message: string): boolean {
	return (
		message.includes('Managed OAuth connection not found') ||
		message.includes('Managed OAuth connection has no tokens')
	);
}

async function refreshManagedTokensFromHub(
	hub: HubConfig,
	plugin: string,
	tenantId: string,
	refreshToken: string,
) {
	try {
		return await hubApiPost({
			hub,
			path: '/oauth/refresh',
			// The SDK holds the token; Hub mints statelessly from its client_secret.
			body: { plugin, tenantId, refresh_token: refreshToken },
			parseResponse: parseOAuthRefreshResponse,
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : '';
		if (isManagedConnectionMissingOnHub(message)) {
			throw new AuthMissingError(plugin, 'managed');
		}
		throw error;
	}
}

// Attaches a `_refreshAuth` helper on the keyBuilder context for 401 retries.
export async function attachManagedRefreshAuth(
	ctx: Record<string, unknown>,
	managedContext: ManagedAuthContext,
): Promise<void> {
	(ctx as Record<string, unknown>)._refreshAuth = async () => {
		const result = await getManagedAccessToken(managedContext, {
			forceRefresh: true,
		});
		return result.accessToken;
	};
}
