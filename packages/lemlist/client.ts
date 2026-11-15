import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export class LemlistAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'LemlistAPIError';
	}
}

/**
 * Official Lemlist API base URL.
 * Reference: https://developer.lemlist.com/
 */
export const LEMLIST_API_BASE = 'https://api.lemlist.com/api';

/**
 * Rate limit configuration for the HTTP transport.
 * Handler owns rate limit retries (extracting Retry-After); transport retries are 0.
 */
export const LEMLIST_RATE_LIMIT_CONFIG: RateLimitConfig = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
};

/**
 * Lemlist uses HTTP Basic authentication with an empty username and the API key as the password.
 * Format: `Basic base64(:apiKey)`.
 */
export function basicAuthHeader(apiKey: string): string {
	const trimmed = apiKey.trim();
	const creds = trimmed.startsWith(':') ? trimmed : `:${trimmed}`;
	return `Basic ${Buffer.from(creds).toString('base64')}`;
}

export type LemlistQueryValue =
	| string
	| number
	| boolean
	| readonly (string | number)[]
	| undefined;

/**
 * Drops `undefined` query parameters so empty keys are not included in request URLs.
 */
export function compactQuery(
	query?: Record<string, LemlistQueryValue>,
):
	| Record<string, string | number | boolean | readonly (string | number)[]>
	| undefined {
	if (!query) return undefined;
	const defined: Record<
		string,
		string | number | boolean | readonly (string | number)[]
	> = {};
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) {
			defined[key] = value;
		}
	}
	return Object.keys(defined).length > 0 ? defined : undefined;
}

/**
 * Re-throws a sanitized `ApiError` stripped of request body and query secrets.
 */
export function sanitizeApiError(error: ApiError): ApiError {
	const cleanRequest: ApiRequestOptions = {
		method: error.request.method,
		url: '/',
	};

	return new ApiError(
		cleanRequest,
		{
			url: `${LEMLIST_API_BASE}/`,
			ok: false,
			status: error.status,
			statusText: 'Request failed',
			body: undefined,
		},
		`Lemlist API request failed with status ${error.status}`,
		{
			retryAfter: error.retryAfter,
			rateLimitReset: error.rateLimitReset,
			rateLimitRemaining: error.rateLimitRemaining,
			rateLimitLimit: error.rateLimitLimit,
		},
	);
}

export type LemlistRequestOptions = {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	// `unknown` because request bodies vary per endpoint; zod schemas validate inputs before transmission.
	body?: Record<string, unknown> | unknown[];
	query?: Record<string, LemlistQueryValue>;
	timeout?: number;
};

/**
 * Issues an authenticated request to the Lemlist API.
 */
export async function makeLemlistRequest<T>(
	endpoint: string,
	apiKey: string,
	options: LemlistRequestOptions = {},
): Promise<T> {
	if (apiKey !== undefined && apiKey.trim().length === 0) {
		throw new AuthMissingError('lemlist', 'api_key');
	}

	const { method = 'GET', body, query, timeout = 20000 } = options;

	const config: OpenAPIConfig = {
		BASE: LEMLIST_API_BASE,
		VERSION: '2.0.0',
		TIMEOUT: timeout,
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: basicAuthHeader(apiKey),
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
		query: compactQuery(query),
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: LEMLIST_RATE_LIMIT_CONFIG,
		});
	} catch (error: unknown) {
		// `unknown` because caught errors in TypeScript have no static type.
		if (error instanceof ApiError) {
			throw sanitizeApiError(error);
		}
		throw new LemlistAPIError('Lemlist API transport failed');
	}
}
