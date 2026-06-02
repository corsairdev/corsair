import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class DropboxAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'DropboxAPIError';
	}
}

const DROPBOX_API_BASE = 'https://api.dropboxapi.com/2';
export const DROPBOX_CONTENT_BASE = 'https://content.dropboxapi.com/2';
// https://developers.dropbox.com/oauth-guide — "Using Refresh Tokens"
const DROPBOX_TOKEN_URL = 'https://api.dropboxapi.com/oauth2/token';

async function refreshAccessToken(
	clientId: string,
	clientSecret: string,
	refreshToken: string,
) {
	const response = await fetch(DROPBOX_TOKEN_URL, {
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
		throw new DropboxAPIError(
			`Failed to refresh access token: ${error}`,
			String(response.status),
		);
	}

	const json = (await response.json()) as {
		access_token: string;
		expires_in: number;
		token_type: string;
	};
	return json;
}

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
	accessToken?: string | null;
	expiresAt?: string | null;
	refreshToken: string;
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

	const tokenData = await refreshAccessToken(
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

const DROPBOX_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: {
		retryAfter: 'Retry-After',
	},
};

function extractDropboxError(error: ApiError): string {
	// any cast needed because ApiError.body is typed as `any` (untyped API response)
	const body = error.body as
		| Record<string, unknown>
		| string
		| undefined
		| null;
	if (!body) return `[${error.status}] ${error.message}`;

	// Dropbox error responses with a string body (e.g. HTML error pages from gateway)
	if (typeof body === 'string') {
		const preview = body.length > 300 ? `${body.slice(0, 300)}...` : body;
		return `[${error.status}] ${preview}`;
	}

	if (typeof body.error_summary === 'string')
		return `[${error.status}] ${body.error_summary}`;

	// Dropbox wraps structured errors in an `error` object with `.tag`
	const errObj = body.error;
	if (errObj && typeof errObj === 'object') {
		// unknown cast needed because body.error is typed as `unknown` (value of Record<string, unknown>)
		const tag = (errObj as Record<string, unknown>)['.tag'];
		if (typeof tag === 'string') return `[${error.status}] ${tag}`;
	}

	// Fallback: surface the full body for debugging
	try {
		return `[${error.status}] ${JSON.stringify(body)}`;
	} catch {
		return `[${error.status}] ${error.message}`;
	}
}

export async function makeDropboxRequest<T>(
	endpoint: string,
	accessToken: string,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		body?: Record<string, unknown> | string;
		query?: Record<string, string | number | boolean | undefined>;
		baseUrl?: string;
		extraHeaders?: Record<string, string>;
	} = {},
): Promise<T> {
	const { method = 'POST', body, query, baseUrl, extraHeaders } = options;

	const config: OpenAPIConfig = {
		BASE: baseUrl ?? DROPBOX_API_BASE,
		VERSION: '2.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: accessToken,
		HEADERS: {
			'Content-Type': 'application/json',
			...extraHeaders,
		},
	};

	const requestOptions: ApiRequestOptions = {
		method,
		url: endpoint,
		body:
			method === 'POST' || method === 'PUT' || method === 'PATCH'
				? body
				: undefined,
		mediaType:
			typeof body === 'string'
				? 'application/octet-stream'
				: 'application/json; charset=utf-8',
		query: method === 'GET' ? query : undefined,
	};

	try {
		const response = await request<T>(config, requestOptions, {
			rateLimitConfig: DROPBOX_RATE_LIMIT_CONFIG,
		});
		return response;
	} catch (error) {
		if (error instanceof ApiError) {
			throw new DropboxAPIError(
				extractDropboxError(error),
				String(error.status),
			);
		}
		if (error instanceof Error) {
			throw new DropboxAPIError(error.message);
		}
		throw new DropboxAPIError('Unknown error');
	}
}

function isUnauthorizedError(error: unknown): boolean {
	if (error instanceof DropboxAPIError) {
		return error.code === '401';
	}
	return (
		error instanceof Error &&
		'status' in error &&
		(error as { status: number }).status === 401
	);
}

/**
 * Wrapper around makeDropboxRequest that retries once on 401 by force-refreshing
 * the access token. Handles the case where a stored token is rejected by Dropbox
 * (e.g. revoked, corrupted) even though `expires_at` hasn't passed yet.
 */
export async function makeAuthenticatedDropboxRequest<T>(
	endpoint: string,
	ctx: { key: string; _refreshAuth?: () => Promise<string> },
	options: Parameters<typeof makeDropboxRequest>[2] = {},
): Promise<T> {
	try {
		return await makeDropboxRequest<T>(endpoint, ctx.key, options);
	} catch (error) {
		if (isUnauthorizedError(error) && ctx._refreshAuth) {
			const freshToken = await ctx._refreshAuth();
			return await makeDropboxRequest<T>(endpoint, freshToken, options);
		}
		throw error;
	}
}
