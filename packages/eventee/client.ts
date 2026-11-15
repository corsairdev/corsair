import { AuthMissingError } from 'corsair/core';
import type { ApiRequestOptions, ApiResult, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';

export const EVENTEE_API_BASE = 'https://eventee.com';

const NO_TRANSPORT_RETRIES = {
	enabled: true,
	maxRetries: 0,
	initialRetryDelay: 0,
	backoffMultiplier: 1,
	headerNames: { retryAfter: 'retry-after' },
} as const;

export async function makeEventeeRequest<T>(
	endpoint: string,
	apiKey: string | undefined,
	options: {
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
		// Endpoint inputs are Zod-validated before reaching this transport.
		body?: Record<string, unknown>;
		query?: Record<string, string | number | boolean | undefined>;
		path?: Record<string, string | number>;
	} = {},
): Promise<T> {
	const { method = 'GET', body, query } = options;
	if (!apiKey) {
		throw new AuthMissingError('eventee', 'api_key');
	}

	const config: OpenAPIConfig = {
		BASE: EVENTEE_API_BASE,
		VERSION: 'v1',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: apiKey,
		HEADERS: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
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
		query,
		path: options.path,
	};

	try {
		return await request<T>(config, requestOptions, {
			rateLimitConfig: NO_TRANSPORT_RETRIES,
		});
	} catch (error: unknown) {
		// Shared transport rejections are not statically typed; ApiError is narrowed below.
		if (error instanceof ApiError) {
			const safeUrl = new URL(error.url);
			// Eventee's removal filters put attendee emails in the query string; never retain queries in errors.
			safeUrl.search = '';
			safeUrl.hash = '';
			const safeResponse: ApiResult = {
				url: safeUrl.toString(),
				ok: false,
				status: error.status,
				statusText: error.statusText,
				body: { error: 'Eventee response details redacted' },
			};
			const safeRequest: ApiRequestOptions = {
				...error.request,
				// Eventee inputs may include attendee PII and are not safe to retain on errors.
				body: undefined,
				query: undefined,
			};
			throw new ApiError(
				safeRequest,
				safeResponse,
				`Eventee API request failed with HTTP ${error.status}`,
				{
					retryAfter: error.retryAfter,
					rateLimitReset: error.rateLimitReset,
					rateLimitRemaining: error.rateLimitRemaining,
					rateLimitLimit: error.rateLimitLimit,
				},
			);
		}
		throw new Error('Eventee request failed');
	}
}
