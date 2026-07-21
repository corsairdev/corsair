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

	// Managed never stores a refresh token app-side (custody: Hub owns it), so we
	// only read the cached access token + expiry. A missing access token means the
	// tenant was never connected → AuthMissingError.
	const [accessToken, expiresAt] = await Promise.all([
		keys.get_access_token(),
		keys.get_expires_at(),
	]);

	if (!accessToken) {
		throw new AuthMissingError(plugin, 'managed');
	}

	const now = Math.floor(Date.now() / 1000);

	// Serve the cached access token while it is still valid. Non-expiring tokens
	// (no expires_at) are treated as usable; expired/near-expiry ones fall through
	// to a Hub refresh, which holds the refresh token.
	const expiresAtSeconds = expiresAt ? Number(expiresAt) : null;
	const tokenStillUsable =
		expiresAtSeconds === null ||
		expiresAtSeconds > now + TOKEN_REFRESH_BUFFER_SECONDS;
	if (!forceRefresh && tokenStillUsable) {
		return {
			accessToken,
			expiresAt: expiresAtSeconds ?? now + 3600,
			refreshed: false,
		};
	}

	const tokens = await refreshManagedTokensFromHub(hub, plugin, tenantId);

	const nextExpiresAt = tokens.expires_in
		? now + tokens.expires_in
		: expiresAt
			? Number(expiresAt)
			: now + 3600;

	await keys.set_access_token(tokens.access_token);
	await keys.set_expires_at(String(nextExpiresAt));
	// Custody: the app caches only the short-lived access token. The refresh
	// token stays at Hub — managed means "we own it" (revocation via Hub).
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
