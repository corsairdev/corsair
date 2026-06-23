import { AuthMissingError } from '../core/auth/errors/auth-missing';
import type { AccountKeyManagerFor } from '../core/auth/types';
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

type HubRefreshResponse = {
	access_token?: string;
	refresh_token?: string;
	expires_in?: number;
	scope?: string;
	error?: string;
	message?: string;
};

async function readHubJsonResponse(response: Response): Promise<unknown> {
	const bodyText = await response.text();
	if (!bodyText) return null;
	try {
		return JSON.parse(bodyText) as unknown;
	} catch {
		throw new Error(`Hub API returned invalid JSON (HTTP ${response.status})`);
	}
}

function parseHubRefreshError(payload: unknown, status: number): string {
	if (payload && typeof payload === 'object') {
		const record = payload as HubRefreshResponse;
		if (record.error) return record.error;
		if (record.message) return record.message;
	}
	return `Hub token refresh failed (HTTP ${status})`;
}

/**
 * Returns a valid access token for a managed OAuth connection.
 * Uses cached credentials when still valid; otherwise refreshes via the hub.
 */
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

	if (!refreshToken && accessToken && !forceRefresh) {
		return {
			accessToken,
			expiresAt: expiresAt ? Number(expiresAt) : now + 3600,
			refreshed: false,
		};
	}

	const apiUrl = hub.apiUrl.replace(/\/$/, '');
	const response = await fetch(`${apiUrl}/oauth/refresh`, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			authorization: `Bearer ${hub.projectApiKey}`,
		},
		body: JSON.stringify({ plugin, tenantId }),
	});

	const payload = await readHubJsonResponse(response);
	if (!response.ok) {
		throw new Error(parseHubRefreshError(payload, response.status));
	}

	const tokens = payload as HubRefreshResponse;
	if (!tokens.access_token) {
		throw new Error('Hub token refresh returned no access_token');
	}

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

/**
 * Attaches a `_refreshAuth` helper on the keyBuilder context for 401 retries.
 */
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
