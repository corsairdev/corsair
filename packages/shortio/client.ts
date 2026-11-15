import { AuthMissingError } from 'corsair/core';
import type {
	ApiRequestOptions,
	OpenAPIConfig,
	RateLimitConfig,
} from 'corsair/http';
import { ApiError, request } from 'corsair/http';

// Core retries a 429 up to three times and honours Retry-After.
const rateLimitConfig: RateLimitConfig = {
	enabled: true,
	maxRetries: 3,
	initialRetryDelay: 1000,
	backoffMultiplier: 2,
	headerNames: { retryAfter: 'Retry-After' },
};

// The untrusted response varies by endpoint and is parsed by its output schema.
export async function makeShortioRequest(
	path: string,
	apiKey: string,
	options: {
		method: 'GET' | 'POST' | 'DELETE';
		// Each operation validates a different query and body before dispatch.
		query?: Record<string, unknown>;
		body?: unknown;
	},
): Promise<unknown> {
	if (!apiKey?.trim()) throw new AuthMissingError('shortio', 'api_key');
	const config: OpenAPIConfig = {
		BASE: 'https://api.short.io',
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		HEADERS: { Authorization: apiKey },
	};
	const requestOptions: ApiRequestOptions = {
		method: options.method,
		url: path,
		query: options.query,
		body: options.body,
		mediaType: options.body === undefined ? undefined : 'application/json',
	};
	try {
		// Endpoint-specific response schemas narrow the untrusted payload.
		return await request<unknown>(config, requestOptions, { rateLimitConfig });
	} catch (error) {
		// Core's ApiError goes through as the same instance (status, retryAfter
		// and anything else core sets stay intact), with the request body, query
		// and URL query string dropped: they hold link URLs, paths and titles.
		if (error instanceof ApiError) {
			Object.defineProperties(error, {
				request: {
					value: { ...error.request, body: undefined, query: undefined },
				},
				url: { value: error.url.split('?')[0] ?? error.url },
			});
		}
		throw error;
	}
}
