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
