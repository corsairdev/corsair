import { AuthMissingError } from '../core/auth/errors/auth-missing';
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
		return {
			accessToken,
			expiresAt: Number(expiresAt),
			refreshed: false,
		};
	}

	// Non-expiring tokens may have no refresh token — keep using the access token
	// while it is still valid. If it is expired (or due for refresh), fall through
	// to the hub, which may still hold a refresh token even when local storage does not.
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

	const tokens = await refreshManagedTokensFromHub(hub, plugin, tenantId);

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
) {
	try {
		return await hubApiPost({
			hub,
			path: '/oauth/refresh',
			body: { plugin, tenantId },
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
