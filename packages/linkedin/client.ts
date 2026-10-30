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
