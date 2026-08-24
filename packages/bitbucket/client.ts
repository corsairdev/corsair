import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const BITBUCKET_API_BASE = 'https://api.bitbucket.org/2.0';
export const BITBUCKET_AUTH_URL = 'https://bitbucket.org/site/oauth2/authorize';
export const BITBUCKET_TOKEN_URL =
	'https://bitbucket.org/site/oauth2/access_token';

function rateLimitConfig(retrySafe: boolean): RateLimitConfig {
	return {
		enabled: true,
		maxRetries: retrySafe ? 3 : 0,
		initialRetryDelay: 1000,
		backoffMultiplier: 2,
		headerNames: {
			retryAfter: 'Retry-After',
			resetTime: 'X-RateLimit-Reset',
			remaining: 'X-RateLimit-Remaining',
			limit: 'X-RateLimit-Limit',
		},
	};
}
export class BitbucketOAuthError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'BitbucketOAuthError';
	}
}
export class BitbucketAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		public readonly retryAfter?: number,
	) {
		super(message);
		this.name = 'BitbucketAPIError';
	}
}
export class BitbucketSchemaError extends Error {
	constructor(
		message: string,
		public readonly direction: 'input' | 'output',
		public readonly issues: { path: string; message: string }[] = [],
	) {
		super(message);
		this.name = 'BitbucketSchemaError';
	}
}

export type BitbucketTokenResult = {
	access_token: string;
	refresh_token?: string;
	expires_in?: number;
	token_type?: string;
	scopes?: string;
};
export async function refreshBitbucketAccessToken(
	clientId: string,
	clientSecret: string,
	refreshToken: string,
): Promise<BitbucketTokenResult> {
	const tokenUrl = new URL(BITBUCKET_TOKEN_URL);
	const config: OpenAPIConfig = {
		BASE: tokenUrl.origin,
		VERSION: '2',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			Authorization:
				'Basic ' +
				Buffer.from(clientId + ':' + clientSecret).toString('base64'),
			Accept: 'application/json',
		},
	};
	const body = new URLSearchParams({
		grant_type: 'refresh_token',
		refresh_token: refreshToken,
	}).toString();
	try {
		return await request<BitbucketTokenResult>(
			config,
			{
				method: 'POST',
				url: tokenUrl.pathname,
				body,
				mediaType: 'application/x-www-form-urlencoded',
			},
			{ rateLimitConfig: rateLimitConfig(false) },
		);
	} catch (error) {
		throw new BitbucketOAuthError(
			'Failed to refresh Bitbucket access token: ' +
				(error instanceof Error ? error.message : String(error)),
		);
	}
}
export async function getValidBitbucketAccessToken({
	accessToken,
	expiresAt,
	refreshToken,
	clientId,
	clientSecret,
	forceRefresh = false,
}: {
	accessToken?: string | null;
	expiresAt?: string | null;
	refreshToken?: string | null;
	clientId?: string | null;
	clientSecret?: string | null;
	forceRefresh?: boolean;
}): Promise<{
	accessToken: string;
	refreshToken?: string;
	expiresAt: number;
	refreshed: boolean;
}> {
	const now = Math.floor(Date.now() / 1000);
	if (
		!forceRefresh &&
		accessToken &&
		(!expiresAt || Number(expiresAt) > now + 300)
	)
		return {
			accessToken,
			refreshToken: refreshToken ?? undefined,
			expiresAt: expiresAt ? Number(expiresAt) : now + 3600,
			refreshed: false,
		};
	if (!refreshToken || !clientId || !clientSecret)
		throw new BitbucketOAuthError(
			'Bitbucket refresh token and OAuth client credentials are required',
		);
	const token = await refreshBitbucketAccessToken(
		clientId,
		clientSecret,
		refreshToken,
	);
	return {
		accessToken: token.access_token,
		refreshToken: token.refresh_token ?? refreshToken,
		expiresAt: now + (token.expires_in ?? 3600),
		refreshed: true,
	};
}
export type BitbucketRequestOptions = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	body?: unknown;
	query?: Record<string, unknown>;
	mediaType?: string;
	retrySafe?: boolean;
};
export async function makeBitbucketRequest<T>(
	endpoint: string,
	accessToken: string,
	options: BitbucketRequestOptions,
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: BITBUCKET_API_BASE,
		VERSION: '2.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: undefined,
		HEADERS: {
			Authorization: 'Bearer ' + accessToken,
			Accept: 'application/json',
		},
	};
	const requestOptions: ApiRequestOptions = {
		method: options.method,
		url: endpoint,
		body: options.body,
		query: options.query,
		mediaType:
			options.body === undefined
				? undefined
				: (options.mediaType ?? 'application/json'),
	};
	try {
		const response = await request<T | undefined>(config, requestOptions, {
			rateLimitConfig: rateLimitConfig(options.retrySafe ?? false),
		});
		return (response === undefined ? null : response) as T;
	} catch (error) {
		if (error instanceof ApiError)
			throw new BitbucketAPIError(
				'Bitbucket API request failed with status ' + error.status,
				error.status,
				error.retryAfter,
			);
		throw error;
	}
}
export type BitbucketAuthContext = {
	key: string;
	_refreshAuth?: () => Promise<string>;
};
export async function makeAuthenticatedBitbucketRequest<T>(
	endpoint: string,
	ctx: BitbucketAuthContext,
	options: BitbucketRequestOptions,
): Promise<T> {
	try {
		return await makeBitbucketRequest<T>(endpoint, ctx.key, options);
	} catch (error) {
		if (
			error instanceof BitbucketAPIError &&
			error.status === 401 &&
			ctx._refreshAuth
		) {
			const freshToken = await ctx._refreshAuth();
			return await makeBitbucketRequest<T>(endpoint, freshToken, options);
		}
		throw error;
	}
}
