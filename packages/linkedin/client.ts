import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class LinkedInAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly code?: string,
		// Retry-After from the wrapped ApiError (ms), so the rate-limit
		// error handler can honor LinkedIn's requested backoff.
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'LinkedInAPIError';
	}
}

const LINKEDIN_API_BASE = 'https://api.linkedin.com';

// LinkedIn-Version is required by the versioned REST surface (e.g. /rest/posts).
const LINKEDIN_API_VERSION = '202501';

const LINKEDIN_TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken';

// Refresh a day before the access token expires so long-lived sessions do not
// hit a sudden 401 at the boundary.
const REFRESH_BUFFER_SECONDS = 24 * 60 * 60;

export type LinkedInTokenSet = {
	accessToken: string;
	refreshToken: string;
	expiresAt: number;
	refreshed: boolean;
};

type LinkedInTokenResponse = {
	access_token: string;
	expires_in: number;
	refresh_token?: string;
	refresh_token_expires_in?: number;
};

async function refreshLinkedInToken(
	clientId: string,
	clientSecret: string,
	refreshToken: string,
): Promise<LinkedInTokenResponse> {
	const response = await fetch(LINKEDIN_TOKEN_URL, {
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
		const body = await response.text();
		throw new LinkedInAPIError(
			`Failed to refresh LinkedIn access token: ${body}`,
			response.status,
		);
	}

	// fetch().json() returns `any`; assert the documented token response shape.
	return (await response.json()) as LinkedInTokenResponse;
}

export async function getValidLinkedInAccessToken({
	accessToken,
	refreshToken,
	expiresAt,
	clientId,
	clientSecret,
	forceRefresh = false,
}: {
	clientId: string;
	clientSecret: string;
	accessToken: string | null;
	refreshToken: string;
	expiresAt?: number | null;
	forceRefresh?: boolean;
}): Promise<LinkedInTokenSet> {
	const now = Math.floor(Date.now() / 1000);

	if (
		!forceRefresh &&
		accessToken &&
		expiresAt &&
		expiresAt > now + REFRESH_BUFFER_SECONDS
	) {
		return { accessToken, refreshToken, expiresAt, refreshed: false };
	}

	const tokenData = await refreshLinkedInToken(
		clientId,
		clientSecret,
		refreshToken,
	);

	// LinkedIn rotates the refresh token on some flows; keep the new one when present.
	return {
		accessToken: tokenData.access_token,
		refreshToken: tokenData.refresh_token ?? refreshToken,
		expiresAt: now + tokenData.expires_in,
		refreshed: true,
	};
}

export type LinkedInRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: Record<string, unknown>;
	// Arrays serialize as repeated keys (role=A&role=B), which is how
	// LinkedIn expects multi-value filters like organizationAcls roles.
	query?: Record<
		string,
		string | number | boolean | ReadonlyArray<string> | undefined
	>;
};

// Well above any real LinkedIn REST path; bounds the string handed to the
// shared URL-template parser so pathological inputs cannot degrade it.
const MAX_ENDPOINT_LENGTH = 2048;

export async function makeLinkedInRequest<T>(
	endpoint: string,
	accessToken: string,
	options: LinkedInRequestOptions = {},
): Promise<T> {
	if (endpoint.length > MAX_ENDPOINT_LENGTH) {
		throw new LinkedInAPIError(
			`LinkedIn endpoint exceeds ${MAX_ENDPOINT_LENGTH} characters`,
		);
	}
	const { method = 'GET', body, query } = options;

	const config: OpenAPIConfig = {
		BASE: LINKEDIN_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: accessToken,
		HEADERS: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
			// Required by LinkedIn's REST protocol for the modern Posts API surface.
			'X-Restli-Protocol-Version': '2.0.0',
			// Versioned REST endpoints (/rest/posts, etc.) require a LinkedIn-Version header.
			// Bump to a recent YYYYMM value when adopting newer API behavior.
			'LinkedIn-Version': LINKEDIN_API_VERSION,
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
			throw new LinkedInAPIError(
				error.message,
				error.status,
				undefined,
				error.retryAfter,
			);
		}
		if (error instanceof Error) {
			throw new LinkedInAPIError(error.message);
		}
		throw new LinkedInAPIError('Unknown LinkedIn API error');
	}
}

function isUnauthorizedError(error: unknown): boolean {
	if (error instanceof LinkedInAPIError) {
		return error.status === 401;
	}
	if (error instanceof ApiError) {
		return error.status === 401;
	}
	return false;
}

export type LinkedInRequestContext = {
	key: string;
	_refreshAuth?: () => Promise<string>;
};

export function attachLinkedInRefreshAuth(
	ctx: object,
	refreshAuth: () => Promise<string>,
): void {
	Object.assign(ctx, { _refreshAuth: refreshAuth });
}

/**
 * Wrapper around makeLinkedInRequest that retries once on 401 by force-refreshing
 * the access token. Handles tokens that are rejected by LinkedIn even though the
 * stored expiry has not passed yet (revoked, rotated server-side, clock skew).
 */
export async function makeAuthenticatedLinkedInRequest<T>(
	endpoint: string,
	ctx: LinkedInRequestContext,
	options: LinkedInRequestOptions = {},
): Promise<T> {
	try {
		return await makeLinkedInRequest<T>(endpoint, ctx.key, options);
	} catch (error) {
		if (isUnauthorizedError(error) && ctx._refreshAuth) {
			const freshToken = await ctx._refreshAuth();
			return await makeLinkedInRequest<T>(endpoint, freshToken, options);
		}
		throw error;
	}
}
