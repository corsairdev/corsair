import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class AttioAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'AttioAPIError';
	}
}

const ATTIO_API_BASE = 'https://api.attio.com';

// ─────────────────────────────────────────────────────────────────────────────
// OAuth URLs
// ─────────────────────────────────────────────────────────────────────────────

export const ATTIO_OAUTH_AUTH_URL = 'https://app.attio.com/authorize';
export const ATTIO_OAUTH_TOKEN_URL = 'https://app.attio.com/oauth/token';

// ─────────────────────────────────────────────────────────────────────────────
// OAuth Token Refresh
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Exchange a refresh token for a new access token.
 * Attio uses standard OAuth2 token exchange with `application/x-www-form-urlencoded`.
 */
async function refreshAttioAccessToken(
	clientId: string,
	clientSecret: string,
	refreshToken: string,
): Promise<{ access_token: string; expires_in: number }> {
	const response = await fetch(ATTIO_OAUTH_TOKEN_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: refreshToken,
			client_id: clientId,
			client_secret: clientSecret,
		}),
	});

	if (!response.ok) {
		const error = await response.text();
		throw new AttioAPIError(
			`Failed to refresh access token: ${error}`,
			response.status,
		);
	}

	const json = (await response.json()) as {
		access_token: string;
		expires_in: number;
	};

	return json;
}

/**
 * Return a valid access token, refreshing if expired or when forced.
 * Mirrors the pattern used by zohomail, workday, etc.
 */
export async function getValidAccessToken({
	accessToken,
	expiresAt,
	clientId,
	clientSecret,
	refreshToken,
	forceRefresh = false,
}: {
	clientId: string;
	clientSecret: string;
	refreshToken: string;
	accessToken?: string | null;
	expiresAt?: string | null;
	forceRefresh?: boolean;
}): Promise<{ accessToken: string; expiresAt: number; refreshed: boolean }> {
	const now = Math.floor(Date.now() / 1000);
	const bufferSeconds = 5 * 60;

	if (
		!forceRefresh &&
		accessToken &&
		expiresAt &&
		Number(expiresAt) > now + bufferSeconds
	) {
		return { accessToken, expiresAt: Number(expiresAt), refreshed: false };
	}

	const tokenData = await refreshAttioAccessToken(
		clientId,
		clientSecret,
		refreshToken,
	);
	return {
		accessToken: tokenData.access_token,
		expiresAt: now + tokenData.expires_in,
		refreshed: true,
	};
}

// ─────────────────────────────────────────────────────────────────────────────
// API Request Helper
// ─────────────────────────────────────────────────────────────────────────────

export async function makeAttioRequest<T>(
	endpoint: string,
	apiKey: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: ATTIO_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType: 'application/json; charset=utf-8',
		query: method === 'GET' ? query : undefined,
	};

	try {
		return await request<T>(config, requestOptions);
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		if (error instanceof Error) {
			const status =
				'status' in error &&
				typeof (error as { status: unknown }).status === 'number'
					? (error as { status: number }).status
					: undefined;
			throw new AttioAPIError(error.message, status);
		}
		throw new AttioAPIError('Unknown error');
	}
}

// ─────────────────────────────────────────────────────────────────────────────
// Authenticated Request with Auto-Retry on 401
// ─────────────────────────────────────────────────────────────────────────────

function isUnauthorizedError(error: unknown): boolean {
	return (
		error instanceof Error &&
		'status' in error &&
		(error as { status: number }).status === 401
	);
}

type AttioRequestContext = {
	key: string;
	_refreshAuth?: () => Promise<string>;
};

/**
 * Wrapper around makeAttioRequest that retries once on 401 by force-refreshing
 * the access token. Endpoints should use this instead of makeAttioRequest
 * directly when OAuth token refresh is desired.
 */
export async function makeAuthenticatedAttioRequest<T>(
	endpoint: string,
	ctx: AttioRequestContext,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
	} = {},
): Promise<T> {
	try {
		return await makeAttioRequest<T>(endpoint, ctx.key, options);
	} catch (error) {
		if (isUnauthorizedError(error) && ctx._refreshAuth) {
			const freshToken = await ctx._refreshAuth();
			return await makeAttioRequest<T>(endpoint, freshToken, options);
		}
		throw error;
	}
}
